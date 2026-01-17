# 🧪 Dictionary API Feature - Quick Test Guide

## 🚀 How to Test

### Start the Application

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## ✅ Test Scenarios

### 1. Test Basic Word Lookup

**Test Word**: `hello`

**Steps**:

1. Type "hello" in the input field
2. Click "Add Word" or press Enter
3. Wait for API response (1-2 seconds)

**Expected Results**:

- ✅ Word added successfully
- ✅ Success message appears
- ✅ Word appears in table with:
  - Phonetic: `/həˈloʊ/` or similar
  - Audio button (🔊 icon) visible
  - Part of speech: "noun", "verb", "interjection"
  - All data populated

---

### 2. Test Complex Word

**Test Word**: `serendipity`

**Steps**:

1. Type "serendipity" in the input field
2. Submit the word

**Expected Results**:

- ✅ Phonetic: `/ˌserənˈdɪpɪti/`
- ✅ Audio button available
- ✅ Part of speech: "noun"
- ✅ Multiple definitions loaded
- ✅ Origin/etymology populated

---

### 3. Test Audio Pronunciation

**Steps**:

1. Add a word (e.g., "hello")
2. Find the word in the table
3. Click the 🔊 volume icon in the Phonetic column

**Expected Results**:

- ✅ Audio plays immediately
- ✅ Clear pronunciation heard
- ✅ No errors in console
- ✅ Button shows hover effect

---

### 4. Test Word Not Found

**Test Word**: `asdfghjkl` (random characters)

**Steps**:

1. Type random characters
2. Try to add the word

**Expected Results**:

- ❌ Error message appears
- ❌ Message: "Word 'asdfghjkl' not found in dictionary"
- ✅ Input field remains editable
- ✅ User can try again

---

### 5. Test Duplicate Word

**Steps**:

1. Add a word (e.g., "hello")
2. Try to add the same word again

**Expected Results**:

- ❌ Error message: "Word already exists"
- ✅ Original word remains in table
- ✅ No duplicate created

---

### 6. Test Multiple Parts of Speech

**Test Word**: `run`

**Steps**:

1. Add the word "run"
2. Check the Part of Speech column

**Expected Results**:

- ✅ Multiple chips shown: "noun", "verb"
- ✅ If more than 2, shows "+N more"
- ✅ Chips are color-coded

---

### 7. Test Word Without Audio

**Test Word**: Try rare or technical words

**Steps**:

1. Add a rare word
2. Check if audio button appears

**Expected Results**:

- ✅ Phonetic notation still shown
- ⚠️ Audio button may not appear (depends on API)
- ✅ All other data populated normally

---

### 8. Test Loading State

**Steps**:

1. Type a word
2. Click "Add Word"
3. Observe during API call

**Expected Results**:

- ✅ Input field shows loading indicator
- ✅ "Add Word" button shows loading spinner
- ✅ Button is disabled during loading
- ✅ Loading clears after response

---

### 9. Test Network Error

**Steps**:

1. Disconnect internet
2. Try to add a word

**Expected Results**:

- ❌ Error message appears
- ❌ Message indicates connection problem
- ✅ User can retry when online

---

### 10. Test Table Display

**Steps**:

1. Add several words
2. Check table columns

**Expected Results**:

- ✅ Word column: Capitalized word with icon
- ✅ Phonetic column: IPA notation + audio button
- ✅ Part of Speech column: Chips for each type
- ✅ Created column: Relative date
- ✅ Mastery column: Progress bar
- ✅ Reviews column: Count chip
- ✅ Actions column: View/Edit/Delete buttons

---

## 🎯 Quick Checklist

Use this for rapid testing:

- [ ] Word lookup works
- [ ] Phonetic notation displays correctly
- [ ] Audio button appears (when available)
- [ ] Audio plays on click
- [ ] Parts of speech show as chips
- [ ] Multiple parts of speech handled
- [ ] Definitions populated
- [ ] Origin/etymology saved
- [ ] Loading state shows during fetch
- [ ] Success message appears
- [ ] Error handling for not found
- [ ] Error handling for duplicates
- [ ] Error handling for network issues
- [ ] Table displays all columns
- [ ] Responsive on mobile
- [ ] No console errors

---

## 📊 Test Words Collection

### Good Test Words

**Simple Words** (fast, reliable):

- hello
- world
- book
- run
- happy

**Complex Words** (rich data):

- serendipity
- ephemeral
- ubiquitous
- mellifluous
- quintessential

**Multiple Meanings**:

- run (noun + verb)
- light (noun + verb + adjective)
- set (many meanings)

**Technical Words**:

- algorithm
- photosynthesis
- cryptocurrency

**Rare Words** (may not have audio):

- sesquipedalian
- floccinaucinihilipilification

---

## 🐛 Common Issues & Solutions

### Issue: "Word not found"

**Cause**: Word doesn't exist in Free Dictionary API
**Solution**: Try simpler form or check spelling

### Issue: No audio button

**Cause**: Audio not available for this word
**Solution**: Normal behavior, phonetic still shown

### Issue: Slow loading

**Cause**: Network latency
**Solution**: Wait a moment, API typically responds in 1-2s

### Issue: API error

**Cause**: Network connection or API down
**Solution**: Check internet, try again later

### Issue: Duplicate error

**Cause**: Word already in collection
**Solution**: Check existing words, use search

---

## 🔍 What to Look For

### Data Quality

- ✅ Phonetic notation is accurate
- ✅ Definitions are comprehensive
- ✅ Examples are relevant
- ✅ Parts of speech are correct
- ✅ Audio pronunciation is clear

### UI/UX

- ✅ Loading states are smooth
- ✅ Error messages are clear
- ✅ Success feedback is visible
- ✅ Table is readable
- ✅ Audio button is intuitive
- ✅ Responsive on all devices

### Performance

- ✅ API calls are fast (<2s)
- ✅ UI remains responsive
- ✅ No memory leaks
- ✅ Audio loads quickly

---

## 📱 Mobile Testing

### Test on Mobile

1. Open on phone/tablet
2. Add a word
3. Check table display
4. Test audio button (touch)

**Expected**:

- ✅ Input field is touch-friendly
- ✅ Table scrolls horizontally if needed
- ✅ Audio button is large enough to tap
- ✅ All features work on mobile

---

## 🎓 API Testing

### Free Dictionary API

```
Endpoint: https://api.dictionaryapi.dev/api/v2/entries/en/{word}
```

### Manual API Test

```bash
# Test in browser or curl
curl https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

**Expected Response**:

```json
[
  {
    "word": "hello",
    "phonetic": "/həˈloʊ/",
    "phonetics": [...],
    "meanings": [...],
    "origin": "..."
  }
]
```

---

## ✅ Acceptance Criteria

Feature is ready when:

- ✅ All test scenarios pass
- ✅ No console errors
- ✅ API integration works
- ✅ Audio playback works
- ✅ Error handling is robust
- ✅ UI is responsive
- ✅ Loading states work
- ✅ Data quality is good
- ✅ Performance is acceptable
- ✅ Mobile experience is good

---

## 🎉 Testing Complete!

Once all tests pass, the dictionary API feature is production-ready!

**Happy Testing!** 🚀

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Basic Lookup:        [ ] Pass  [ ] Fail
Complex Word:        [ ] Pass  [ ] Fail
Audio Playback:      [ ] Pass  [ ] Fail
Word Not Found:      [ ] Pass  [ ] Fail
Duplicate Check:     [ ] Pass  [ ] Fail
Multiple POS:        [ ] Pass  [ ] Fail
Loading State:       [ ] Pass  [ ] Fail
Error Handling:      [ ] Pass  [ ] Fail
Table Display:       [ ] Pass  [ ] Fail
Mobile Experience:   [ ] Pass  [ ] Fail

Overall: [ ] PASS  [ ] FAIL

Notes:
_________________________________
_________________________________
_________________________________
```
