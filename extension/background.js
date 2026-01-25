/**
 * Background Service Worker
 * Handles extension lifecycle and context menu
 */

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('Big Big Word extension installed')

  // Create context menu
  chrome.contextMenus.create({
    id: 'translate-word',
    title: '翻译 "%s"',
    contexts: ['selection'],
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-word' && info.selectionText) {
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'translate-selection',
      word: info.selectionText,
    })
  }
})

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'translate-selection') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'translate-selection',
        })
      }
    })
  }
})

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get-words') {
    // Get words from storage
    chrome.storage.local.get(['big-big-words'], (result) => {
      sendResponse({ words: result['big-big-words'] || [] })
    })
    return true // Keep message channel open for async response
  }
})

console.log('Big Big Word background service worker loaded')
