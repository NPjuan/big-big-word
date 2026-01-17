# 🧪 Export Feature - Quick Test Guide

## 🚀 How to Test the Export Feature

### Prerequisites

```bash
# Make sure the app is running
npm run dev
```

Visit: `http://localhost:5173`

---

## ✅ Test Scenarios

### 1. Test Export Button Visibility

#### Scenario A: No Words

**Steps**:

1. Open the app with no words in the collection
2. Look at the Word Collection header

**Expected Result**:

- ❌ Export button should NOT be visible
- ✅ Only search field is shown

#### Scenario B: With Words

**Steps**:

1. Add at least one word to the collection
2. Look at the Word Collection header

**Expected Result**:

- ✅ Export button appears next to search field
- ✅ Button shows "Export" text with download icon

---

### 2. Test Export Menu

**Steps**:

1. Click the "Export" button

**Expected Result**:

- ✅ Dropdown menu appears
- ✅ Two options visible:
  - "Export as CSV" with green file icon
  - "Export as JSON" with blue code icon
- ✅ Each option has a subtitle description

---

### 3. Test CSV Export

**Steps**:

1. Add a few test words (or use existing words)
2. Click "Export" button
3. Select "Export as CSV"

**Expected Result**:

- ✅ Loading spinner appears briefly
- ✅ File downloads automatically
- ✅ Filename format: `words-export-2026-01-17.csv`
- ✅ Success message appears: "Successfully exported X words as CSV!"
- ✅ Message disappears after 3 seconds

**Verify File Content**:

```csv
Word,Phonetic,Part of Speech,Chinese Meaning,English Meaning,Etymology,Created At,Review Count,Mastery (%)
serendipity,/ˌserənˈdɪpɪti/,noun,...
```

---

### 4. Test JSON Export

**Steps**:

1. Click "Export" button
2. Select "Export as JSON"

**Expected Result**:

- ✅ Loading spinner appears briefly
- ✅ File downloads automatically
- ✅ Filename format: `words-export-2026-01-17.json`
- ✅ Success message appears: "Successfully exported X words as JSON!"
- ✅ Message disappears after 3 seconds

**Verify File Content**:

```json
[
  {
    "id": "...",
    "word": "serendipity",
    "phonetic": "/ˌserənˈdɪpɪti/",
    ...
  }
]
```

---

### 5. Test Empty Export

**Steps**:

1. Delete all words from collection
2. Add one word back
3. Export as CSV and JSON

**Expected Result**:

- ✅ CSV file contains headers and one data row
- ✅ JSON file contains array with one object
- ✅ No errors occur

---

### 6. Test Special Characters

**Steps**:

1. Add a word with special characters:
   - Word: `test, "quoted"`
   - Meaning: Contains commas, quotes, newlines

2. Export as CSV

**Expected Result**:

- ✅ CSV properly escapes special characters
- ✅ File can be opened in Excel/Google Sheets
- ✅ Data integrity maintained

---

### 7. Test Responsive Design

#### Desktop (>1280px)

**Expected**:

- ✅ Export button next to search field
- ✅ Both visible in same row

#### Tablet (600-1279px)

**Expected**:

- ✅ Export button may wrap to new line
- ✅ Still fully functional

#### Mobile (<600px)

**Expected**:

- ✅ Export button full width or wraps
- ✅ Touch-friendly menu items
- ✅ All features accessible

---

### 8. Test Loading State

**Steps**:

1. Click export button
2. Observe during export

**Expected Result**:

- ✅ Button shows loading spinner
- ✅ Button is disabled during export
- ✅ Loading clears after export completes

---

### 9. Test Multiple Exports

**Steps**:

1. Export as CSV
2. Wait for success message
3. Export as JSON
4. Repeat several times

**Expected Result**:

- ✅ Each export works correctly
- ✅ Filenames have correct timestamps
- ✅ No memory leaks
- ✅ No performance degradation

---

## 🎯 Quick Checklist

Use this checklist for rapid testing:

- [ ] Export button appears when words exist
- [ ] Export button hidden when no words
- [ ] Menu opens on button click
- [ ] CSV option visible with icon
- [ ] JSON option visible with icon
- [ ] CSV export downloads file
- [ ] JSON export downloads file
- [ ] Filenames have correct format
- [ ] Success message appears
- [ ] Success message auto-dismisses
- [ ] Loading state shows during export
- [ ] CSV file opens in Excel/Sheets
- [ ] JSON file is valid JSON
- [ ] Special characters handled correctly
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] No console errors
- [ ] No memory leaks

---

## 🐛 Common Issues & Solutions

### Issue: Export button not visible

**Solution**: Add at least one word to the collection

### Issue: File not downloading

**Solution**: Check browser download settings and permissions

### Issue: CSV file looks wrong in Excel

**Solution**: Use "Import Data" feature in Excel and select UTF-8 encoding

### Issue: JSON file won't open

**Solution**: Use a text editor or JSON viewer, not a spreadsheet app

---

## 📊 Test Data Suggestions

### Minimal Test

```
1 word with basic data
```

### Standard Test

```
5-10 words with varied data
- Different parts of speech
- Various mastery levels
- Different review counts
```

### Stress Test

```
50+ words
- Test performance
- Test file size
- Test memory usage
```

### Edge Cases

```
- Words with commas: "hello, world"
- Words with quotes: 'say "hello"'
- Words with newlines
- Very long definitions
- Unicode characters: 你好, مرحبا
- Empty fields
```

---

## 🎓 Manual Testing Script

Copy and paste this into your browser console to add test data:

```javascript
// Add test words with special characters
const testWords = [
  { word: 'test, comma', mastery: 50 },
  { word: 'test "quote"', mastery: 75 },
  { word: 'test\nnewline', mastery: 90 },
  { word: 'test unicode 你好', mastery: 60 },
]

// Note: Actual implementation depends on your store structure
```

---

## ✅ Acceptance Criteria

The feature is ready when:

- ✅ All test scenarios pass
- ✅ No console errors
- ✅ Files download correctly
- ✅ Data integrity maintained
- ✅ UI is responsive
- ✅ Loading states work
- ✅ Success messages appear
- ✅ Special characters handled
- ✅ Works across browsers
- ✅ Performance is acceptable

---

## 🎉 Testing Complete!

Once all tests pass, the export feature is ready for production use.

**Happy Testing!** 🚀
