# 📖 Learning System Guide

## Overview

Big Big Word uses an intelligent, swipe-based learning system inspired by spaced repetition algorithms. This guide will help you understand how to use the card learning interface effectively.

---

## 🎯 How It Works

### Card Learning Interface

The home page displays your vocabulary words as interactive cards in a stack. You can swipe cards left or right to indicate your famtery level with each word.

### Swipe Actions

#### ✅ Swipe Right - "I Know This Word!"

When you swipe a card to the right, you're indicating that you've mastered this word.

**Effects:**

- ✨ Mastery increases by **+10%**
- 📈 Review count increments by 1
- 🕐 Last reviewed time updates
- 🎯 When mastery reaches **80%**, the word is marked as "Mastered"

**When to use:**

- You can recall the word's meaning instantly
- You understand all the definitions shown
- You can use the word in a sentence confidently

#### ❌ Swipe Left - "Need More Practice"

When you swipe a card to the left, you're indicating that you need more practice with this word.

**Effects:**

- 📉 Mastery decreases by **-5%**
- 📈 Review count increments by 1
- 🕐 Last reviewed time updates
- 🔄 Word cycles back for more practice

**When to use:**

- You're unsure about the word's meaning
- You need to review the definitions again
- You want to see this word more frequently

---

## 📊 Mastery Levels

Your progress is tracked using a mastery percentage (0-100%) for each word:

### 🟢 High Mastery (80-100%)

- **Status:** Mastered
- **Color:** Green
- **Meaning:** You know this word well!
- **Action:** Keep reviewing occasionally to maintain mastery

### 🟠 Medium Mastery (50-79%)

- **Status:** Learning
- **Color:** Orange
- **Meaning:** You're making good progress
- **Action:** Continue practicing regularly

### 🔴 Low Mastery (0-49%)

- **Status:** Needs Practice
- **Color:** Red
- **Meaning:** This word needs more attention
- **Action:** Review frequently until comfortable

---

## 💡 Learning Tips

### 1. **Double-Click to Reveal**

- Card content is initially blurred to test your recall
- Double-click any card to reveal the full content
- Try to recall before revealing for better retention

### 2. **Use Audio Pronunciation**

- Click the phonetic button to hear the word pronounced
- Listen multiple times to improve pronunciation
- Repeat the word out loud for better memorization

### 3. **Review Regularly**

- Consistent daily practice is more effective than cramming
- Aim to review your words at least once per day
- Focus on words with lower mastery levels

### 4. **Be Honest with Yourself**

- Only swipe right if you truly know the word
- It's okay to swipe left - that's how you learn!
- The system adapts to your honest feedback

### 5. **Track Your Progress**

- Check the statistics in the header/sidebar
- Monitor your overall mastery percentage
- Celebrate when words reach "Mastered" status

---

## 🎮 Interactive Features

### Card Interactions

- **Drag:** Click and drag cards left or right
- **Swipe Threshold:** Drag at least 150px to trigger a swipe
- **Visual Feedback:** Icons appear showing swipe direction
- **Smooth Animations:** Cards fly off screen with rotation

### Keyboard Shortcuts (Coming Soon)

- `←` Left Arrow - Swipe left (need practice)
- `→` Right Arrow - Swipe right (mastered)
- `Space` - Reveal/hide card content
- `P` - Play pronunciation audio

---

## 📈 Progress Tracking

### Statistics Dashboard

Monitor your learning progress through:

- **Total Words:** Number of words in your collection
- **Mastered Words:** Words with 80%+ mastery
- **Average Mastery:** Overall progress percentage
- **Review Count:** How many times you've reviewed each word

### Table View

Switch to table view to see:

- All words with their mastery levels
- Last reviewed dates
- Review counts
- Detailed definitions

---

## 🧠 Learning Science

### Why This System Works

1. **Active Recall:** Testing yourself strengthens memory
2. **Spaced Repetition:** Words you struggle with appear more often
3. **Immediate Feedback:** Know your progress instantly
4. **Gamification:** Visual progress motivates continued learning
5. **Adaptive Learning:** System adjusts to your performance

### The Forgetting Curve

- Words you don't review regularly will be forgotten
- Regular practice maintains and strengthens memory
- The system helps you focus on words that need attention

---

## 🎯 Best Practices

### For Beginners

1. Start with 5-10 words per day
2. Review all words daily for the first week
3. Focus on understanding, not just memorization
4. Use example sentences to understand context

### For Advanced Learners

1. Add 10-20 words per day
2. Review words with low mastery first
3. Create your own example sentences
4. Use words in real conversations or writing

### For Maintenance

1. Review mastered words weekly
2. Add new words as you encounter them
3. Export your progress regularly
4. Challenge yourself with difficult vocabulary

---

## 🔄 Learning Cycle

```
1. Add New Word
   ↓
2. Review Card (Swipe Left/Right)
   ↓
3. Mastery Updates
   ↓
4. Track Progress
   ↓
5. Repeat Until Mastered (80%+)
   ↓
6. Maintain with Periodic Reviews
```

---

## ❓ FAQ

### How many times do I need to swipe right to master a word?

With each right swipe adding 10% mastery, you need **8 successful reviews** to reach 80% (mastered status) from 0%.

### What happens if I swipe left on a mastered word?

The mastery will decrease by 5%, but the word remains in your collection. This helps you stay honest about your knowledge.

### Can I undo a swipe?

Currently, swipes are final. Be thoughtful about your choices - it helps with honest self-assessment.

### How often should I review?

Daily review is ideal. Even 10-15 minutes per day is more effective than longer, infrequent sessions.

### What if I forget a mastered word?

That's normal! Swipe left to reduce mastery and see it more frequently. The system adapts to your current knowledge.

---

## 🎉 Success Tips

1. **Consistency is Key:** Review daily, even if just for a few minutes
2. **Quality Over Quantity:** Better to know 10 words well than 100 words poorly
3. **Use Context:** Try to use new words in sentences or conversations
4. **Be Patient:** Language learning takes time - celebrate small wins
5. **Stay Honest:** Accurate self-assessment leads to better learning

---

## 📚 Additional Resources

- [README.md](../README.md) - Project overview and features
- [API Documentation](./API.md) - Technical details
- [Contributing Guide](../CONTRIBUTING.md) - Help improve the project

---

**Happy Learning! 🚀**

Remember: Every expert was once a beginner. Keep practicing, stay consistent, and you'll see amazing progress!
