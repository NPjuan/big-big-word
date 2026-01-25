/**
 * Popup Script - Manages the extension popup UI
 */

// DOM elements
const wordInput = document.getElementById('word-input')
const addWordBtn = document.getElementById('add-word-btn')
const wordList = document.getElementById('word-list')
const wordCount = document.getElementById('word-count')
const loading = document.getElementById('loading')
const emptyState = document.getElementById('empty-state')
const openAppBtn = document.getElementById('open-app-btn')
const clearAllBtn = document.getElementById('clear-all-btn')

// Load words from storage
const loadWords = async () => {
  loading.style.display = 'block'
  emptyState.style.display = 'none'
  wordList.innerHTML = ''

  try {
    const result = await chrome.storage.local.get(['big-big-words'])
    const words = result['big-big-words'] || []

    loading.style.display = 'none'

    if (words.length === 0) {
      emptyState.style.display = 'block'
      wordCount.textContent = '0'
      return
    }

    // Update count
    wordCount.textContent = words.length

    // Render words
    words.forEach((word) => {
      const wordItem = createWordItem(word)
      wordList.appendChild(wordItem)
    })
  } catch (error) {
    console.error('Load words error:', error)
    loading.style.display = 'none'
    emptyState.style.display = 'block'
  }
}

// Create word item element
const createWordItem = (word) => {
  const item = document.createElement('div')
  item.className = 'word-item'

  // Get first meaning
  const firstMeaning = word.englishMeaning?.[0] || word.chineseMeaning?.[0]
  const meaningText = firstMeaning?.definitions?.[0] || '暂无释义'
  const pos = firstMeaning?.partOfSpeech || ''

  item.innerHTML = `
    <div class="word-item-header">
      <span class="word-item-word">${word.word}</span>
      <button class="word-item-delete" data-id="${word.id}" title="删除">×</button>
    </div>
    ${word.phonetic ? `<div class="word-item-phonetic">${word.phonetic}</div>` : ''}
    <div class="word-item-meaning">
      ${pos ? `<span class="word-item-pos">${pos}</span>` : ''}
      ${meaningText}
    </div>
  `

  // Add delete event listener
  const deleteBtn = item.querySelector('.word-item-delete')
  deleteBtn.addEventListener('click', () => deleteWord(word.id))

  return item
}

// Add word
const addWord = async () => {
  const word = wordInput.value.trim()

  if (!word) {
    return
  }

  // Disable button
  addWordBtn.disabled = true
  addWordBtn.textContent = '添加中...'

  try {
    // Get existing words
    const result = await chrome.storage.local.get(['big-big-words'])
    const words = result['big-big-words'] || []

    // Check if word already exists
    if (words.some((w) => w.word === word.toLowerCase())) {
      alert('该单词已在单词本中')
      return
    }

    // Fetch word data
    const wordData = await DictionaryAPI.fetchWordData(word)

    if (!wordData) {
      alert('未找到该单词')
      return
    }

    // Generate Chinese meanings
    const chineseMeanings = await DictionaryAPI.generateChineseMeanings(wordData.englishMeanings)

    // Create word object
    const newWord = {
      id: crypto.randomUUID(),
      word: wordData.word.toLowerCase(),
      phonetic: wordData.phonetic || '',
      audioUrl: wordData.audioUrl,
      partOfSpeech: wordData.partOfSpeech,
      chineseMeaning: chineseMeanings,
      englishMeaning: wordData.englishMeanings,
      etymology: {
        roots: [],
        origin: wordData.origin || '',
        evolution: '',
        relatedWords: [],
        mnemonic: '',
        generatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      mastery: 0,
    }

    // Add to storage
    words.unshift(newWord)
    await chrome.storage.local.set({ 'big-big-words': words })

    // Clear input
    wordInput.value = ''

    // Reload list
    await loadWords()
  } catch (error) {
    console.error('Add word error:', error)
    alert('添加失败: ' + error.message)
  } finally {
    addWordBtn.disabled = false
    addWordBtn.textContent = '添加'
  }
}

// Delete word
const deleteWord = async (id) => {
  if (!confirm('确定要删除这个单词吗？')) {
    return
  }

  try {
    const result = await chrome.storage.local.get(['big-big-words'])
    const words = result['big-big-words'] || []

    // Remove word
    const updatedWords = words.filter((w) => w.id !== id)
    await chrome.storage.local.set({ 'big-big-words': updatedWords })

    // Reload list
    await loadWords()
  } catch (error) {
    console.error('Delete word error:', error)
    alert('删除失败')
  }
}

// Clear all words
const clearAllWords = async () => {
  if (!confirm('确定要清空所有单词吗？此操作不可恢复！')) {
    return
  }

  try {
    await chrome.storage.local.set({ 'big-big-words': [] })
    await loadWords()
  } catch (error) {
    console.error('Clear all error:', error)
    alert('清空失败')
  }
}

// Open web app
const openWebApp = () => {
  // Open the web app in a new tab
  chrome.tabs.create({ url: 'https://big-big-word-pevn.vercel.app/' })
}

// Event listeners
addWordBtn.addEventListener('click', addWord)
wordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addWord()
  }
})
clearAllBtn.addEventListener('click', clearAllWords)
openAppBtn.addEventListener('click', openWebApp)

// Load words on popup open
loadWords()

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['big-big-words']) {
    loadWords()
  }
})
