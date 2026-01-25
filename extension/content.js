/**
 * Content Script - Injected into web pages
 * Handles word selection and translation popup
 */

// Translation popup element
let translationPopup = null
let currentSelection = ''

// Create translation popup
const createTranslationPopup = () => {
  const popup = document.createElement('div')
  popup.id = 'big-big-word-popup'
  popup.className = 'bbw-popup'
  popup.innerHTML = `
    <div class="bbw-popup-content">
      <div class="bbw-popup-header">
        <span class="bbw-word"></span>
        <button class="bbw-close" title="关闭">×</button>
      </div>
      <div class="bbw-popup-body">
        <div class="bbw-loading">加载中...</div>
        <div class="bbw-phonetic" style="display: none;">
          <span class="bbw-phonetic-text"></span>
          <button class="bbw-play-btn" title="播放发音">🔊</button>
        </div>
        <div class="bbw-meanings"></div>
      </div>
      <div class="bbw-popup-footer">
        <button class="bbw-add-btn">📚 添加到单词本</button>
        <button class="bbw-open-app-btn">🎴 打开学习</button>
      </div>
    </div>
  `
  document.body.appendChild(popup)
  return popup
}

// Show translation popup
const showTranslation = async (word, x, y) => {
  if (!translationPopup) {
    translationPopup = createTranslationPopup()
  }

  // Position popup
  translationPopup.style.left = `${x}px`
  translationPopup.style.top = `${y + 20}px`
  translationPopup.classList.add('bbw-visible')

  // Update word
  const wordElement = translationPopup.querySelector('.bbw-word')
  wordElement.textContent = word

  // Show loading
  const loadingElement = translationPopup.querySelector('.bbw-loading')
  const phoneticElement = translationPopup.querySelector('.bbw-phonetic')
  const meaningsElement = translationPopup.querySelector('.bbw-meanings')

  loadingElement.textContent = '查询中...'
  loadingElement.style.display = 'flex'
  phoneticElement.style.display = 'none'
  meaningsElement.style.display = 'none'

  try {
    // Fetch word data
    const wordData = await DictionaryAPI.fetchWordData(word)

    if (!wordData) {
      meaningsElement.innerHTML = '<p class="bbw-error">未找到该单词</p>'
      loadingElement.style.display = 'none'
      meaningsElement.style.display = 'flex'
      return
    }

    // Hide loading
    loadingElement.style.display = 'none'

    // Show phonetic with audio button
    if (wordData.phonetic) {
      const phoneticText = phoneticElement.querySelector('.bbw-phonetic-text')
      const playBtn = phoneticElement.querySelector('.bbw-play-btn')

      phoneticText.textContent = wordData.phonetic
      phoneticElement.style.display = 'flex'

      // Handle audio playback
      if (wordData.audioUrl) {
        playBtn.style.display = 'flex'
        playBtn.style.cursor = 'pointer'

        // Remove old event listeners
        const newPlayBtn = playBtn.cloneNode(true)
        playBtn.parentNode.replaceChild(newPlayBtn, playBtn)

        // Add new event listener
        newPlayBtn.addEventListener('click', (e) => {
          e.stopPropagation()
          const audio = new Audio(wordData.audioUrl)
          newPlayBtn.classList.add('playing')

          audio.play().catch((error) => {
            console.error('Audio play error:', error)
            newPlayBtn.classList.remove('playing')
            alert('音频播放失败，请检查网络连接')
          })

          audio.onended = () => {
            newPlayBtn.classList.remove('playing')
          }

          audio.onerror = () => {
            newPlayBtn.classList.remove('playing')
            alert('音频加载失败')
          }
        })
      } else {
        playBtn.style.display = 'none'
      }
    }

    // Show Chinese meanings only
    // Keep loading visible while translating
    loadingElement.textContent = '正在翻译...'
    loadingElement.style.display = 'block'

    const chineseMeanings = await DictionaryAPI.generateChineseMeanings(wordData.englishMeanings)

    // Hide loading after translation is complete
    loadingElement.style.display = 'none'

    let meaningsHTML = ''
    chineseMeanings.forEach((meaning) => {
      meaningsHTML += `
        <div class="bbw-meaning">
          <div class="bbw-pos">${meaning.partOfSpeech}</div>
          <ul class="bbw-definitions">
            ${meaning.definitions.map((def) => `<li>${def}</li>`).join('')}
          </ul>
        </div>
      `
    })
    meaningsElement.innerHTML = meaningsHTML
    meaningsElement.style.display = 'block'

    // Store word data for adding
    translationPopup.dataset.wordData = JSON.stringify(wordData)
  } catch (error) {
    console.error('Translation error:', error)
    meaningsElement.innerHTML = '<p class="bbw-error">加载失败，请重试</p>'
    loadingElement.style.display = 'none'
    meaningsElement.style.display = 'flex'
  }
}

// Hide translation popup
const hideTranslation = () => {
  if (translationPopup) {
    translationPopup.classList.remove('bbw-visible')
  }
}

// Handle text selection
const handleSelection = () => {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (selectedText && selectedText.split(/\s+/).length === 1) {
    // Only single word
    currentSelection = selectedText
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Show translation after a short delay
    setTimeout(() => {
      if (window.getSelection().toString().trim() === currentSelection) {
        showTranslation(currentSelection, rect.left + window.scrollX, rect.bottom + window.scrollY)
      }
    }, 300)
  } else {
    hideTranslation()
  }
}

// Handle single word click
const handleWordClick = (e) => {
  // Get the word at click position
  const range = document.caretRangeFromPoint(e.clientX, e.clientY)
  if (!range) return

  const textNode = range.startContainer
  if (textNode.nodeType !== Node.TEXT_NODE) return

  const text = textNode.textContent
  const offset = range.startOffset

  // Find word boundaries
  const wordRegex = /[a-zA-Z]+/g
  let match
  while ((match = wordRegex.exec(text)) !== null) {
    if (offset >= match.index && offset <= match.index + match[0].length) {
      const word = match[0]
      currentSelection = word

      // Create a temporary range to get position
      const tempRange = document.createRange()
      tempRange.setStart(textNode, match.index)
      tempRange.setEnd(textNode, match.index + word.length)
      const rect = tempRange.getBoundingClientRect()

      showTranslation(word, rect.left + window.scrollX, rect.bottom + window.scrollY)
      break
    }
  }
}

// Add word to storage
const addWordToStorage = async (wordData) => {
  try {
    // Get existing words
    const result = await chrome.storage.local.get(['big-big-words'])
    const words = result['big-big-words'] || []

    // Check if word already exists
    if (words.some((w) => w.word === wordData.word.toLowerCase())) {
      alert('该单词已在单词本中')
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

    // Show success message
    alert('✅ 已添加到单词本')
    hideTranslation()
  } catch (error) {
    console.error('Add word error:', error)
    alert('❌ 添加失败，请重试')
  }
}

// Event listeners
document.addEventListener('mouseup', handleSelection)
document.addEventListener('dblclick', handleWordClick)
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection().toString().trim()
  if (!selection) {
    hideTranslation()
  }
})

// Popup event listeners
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('bbw-close')) {
    hideTranslation()
  } else if (e.target.classList.contains('bbw-add-btn')) {
    const wordData = JSON.parse(translationPopup.dataset.wordData || '{}')
    if (wordData.word) {
      addWordToStorage(wordData)
    }
  } else if (e.target.classList.contains('bbw-open-app-btn')) {
    // Open the deployed app
    window.open('https://big-big-word-pevn.vercel.app/', '_blank')
    hideTranslation()
  } else if (!translationPopup?.contains(e.target)) {
    // Click outside popup
    hideTranslation()
  }
})

// Listen for keyboard shortcut
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate-selection') {
    handleSelection()
  }
})

console.log('Big Big Word extension loaded')
