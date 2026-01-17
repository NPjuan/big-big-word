import type { Word } from '@/types/word.types'

/**
 * Export words to CSV format
 * Follows RFC 4180 standard for CSV formatting
 */
export const exportWordsToCSV = (words: Word[]): string => {
  // CSV headers
  const headers = [
    'Word',
    'Phonetic',
    'Part of Speech',
    'Chinese Meaning',
    'English Meaning',
    'Etymology',
    'Created At',
    'Review Count',
    'Mastery (%)',
  ]

  // Helper function to escape CSV values
  const escapeCSVValue = (value: string): string => {
    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  // Helper function to format array data
  const formatArray = (arr: string[]): string => {
    return arr.join('; ')
  }

  // Helper function to format meanings
  const formatMeanings = (meanings: any[]): string => {
    return meanings
      .map((m) => {
        const defs = m.definitions.join('; ')
        return `${m.partOfSpeech}: ${defs}`
      })
      .join(' | ')
  }

  // Helper function to format etymology
  const formatEtymology = (etymology: any): string => {
    const roots = etymology.roots.map((r: any) => `${r.root} (${r.meaning})`).join('; ')
    return `Origin: ${etymology.origin}. Roots: ${roots}`
  }

  // Build CSV rows
  const rows = words.map((word) => {
    return [
      escapeCSVValue(word.word),
      escapeCSVValue(word.phonetic || ''),
      escapeCSVValue(formatArray(word.partOfSpeech)),
      escapeCSVValue(formatMeanings(word.chineseMeaning)),
      escapeCSVValue(formatMeanings(word.englishMeaning)),
      escapeCSVValue(formatEtymology(word.etymology)),
      escapeCSVValue(word.createdAt),
      word.reviewCount.toString(),
      word.mastery.toString(),
    ].join(',')
  })

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n')
}

/**
 * Export words to JSON format
 * Returns a formatted JSON string with proper indentation
 */
export const exportWordsToJSON = (words: Word[]): string => {
  return JSON.stringify(words, null, 2)
}

/**
 * Download a file to the user's device
 * @param content - The file content as a string
 * @param filename - The name of the file to download
 * @param mimeType - The MIME type of the file
 */
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  // Create a Blob from the content
  const blob = new Blob([content], { type: mimeType })

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob)

  // Create a temporary anchor element and trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  // Append to body, click, and remove
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL
  URL.revokeObjectURL(url)
}

/**
 * Generate a filename with current date
 * @param format - The export format (csv or json)
 * @returns Filename in format: words-export-YYYY-MM-DD.{format}
 */
export const generateExportFilename = (format: 'csv' | 'json'): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `words-export-${year}-${month}-${day}.${format}`
}

/**
 * Export words to CSV and trigger download
 */
export const exportToCSV = (words: Word[]): void => {
  const csvContent = exportWordsToCSV(words)
  const filename = generateExportFilename('csv')
  downloadFile(csvContent, filename, 'text/csv;charset=utf-8;')
}

/**
 * Export words to JSON and trigger download
 */
export const exportToJSON = (words: Word[]): void => {
  const jsonContent = exportWordsToJSON(words)
  const filename = generateExportFilename('json')
  downloadFile(jsonContent, filename, 'application/json;charset=utf-8;')
}
