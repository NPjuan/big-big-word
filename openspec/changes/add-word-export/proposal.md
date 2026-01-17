# Change: Add Word Export Functionality

## Why

Users currently have no way to export their saved vocabulary list for backup, sharing, or use in other applications. This limits the portability of their learning data and creates a risk of data loss if localStorage is cleared. Adding export functionality will provide users with data ownership and flexibility.

## What Changes

- Add export button to Word Gallery page
- Implement CSV export format for compatibility with spreadsheet applications
- Implement JSON export format for programmatic use and backup
- Add download functionality that triggers browser file download
- Include all word properties in export: word, phonetic, parts of speech, participle, meaning, and creation timestamp

## Impact

- Affected specs: `word-management`
- Affected code:
  - `src/pages/word-gallery.vue` - Add export UI button
  - `src/utils/wordUtils.ts` - Add export utility functions
- No breaking changes
- Purely additive feature
