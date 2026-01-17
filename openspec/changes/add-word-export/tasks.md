## 1. Implementation

### 1.1 Add Export Utility Functions

- [x] 1.1.1 Create `exportWordsToCSV(words: Word[]): string` function in `wordUtils.ts`
- [x] 1.1.2 Create `exportWordsToJSON(words: Word[]): string` function in `wordUtils.ts`
- [x] 1.1.3 Create `downloadFile(content: string, filename: string, mimeType: string): void` helper function
- [x] 1.1.4 Add unit tests for export functions

### 1.2 Update Word Gallery UI

- [x] 1.2.1 Add export button to Word Gallery card header
- [x] 1.2.2 Create export menu with CSV and JSON options
- [x] 1.2.3 Wire up export button to call export functions
- [x] 1.2.4 Add loading state during export generation
- [x] 1.2.5 Add success toast notification after export

### 1.3 Testing

- [x] 1.3.1 Test CSV export with sample data
- [x] 1.3.2 Test JSON export with sample data
- [x] 1.3.3 Test export with empty word list
- [x] 1.3.4 Test export with special characters in words
- [x] 1.3.5 Verify downloaded file format and content

### 1.4 Documentation

- [x] 1.4.1 Update README.md with export feature description
- [x] 1.4.2 Add inline code comments for export functions
