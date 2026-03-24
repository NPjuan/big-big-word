/**
 * Etymology prompt template for AI-powered word root/origin analysis.
 * Used by the AI Drawer to pre-fill a prompt for Doubao chat.
 */

/**
 * Build a structured etymology prompt for the given word.
 * The prompt asks the AI to analyze word roots, origin, evolution,
 * related words, and provide a creative mnemonic for Chinese learners.
 *
 * @param word - The English word to analyze
 * @param meanings - Optional basic meanings for context (improves AI accuracy)
 * @returns A formatted prompt string ready to paste into the AI chat
 */
export const buildEtymologyPrompt = (word: string, meanings?: string): string => {
  const meaningContext = meanings ? `\n该单词的基本含义：${meanings}` : ''

  return `请用词根词源法帮我深入分析并记忆英语单词「${word}」。${meaningContext}

请按以下结构回答：

1️⃣ **词根拆解**
将单词拆分为词根/词缀，说明每个部分的含义和来源语言（如拉丁语、希腊语等）。

2️⃣ **词源演变**
简述这个词的历史演变过程，从古代到现代英语是如何演变的。

3️⃣ **联想记忆法**
给出一个创意联想或记忆技巧，帮助中文母语者快速记住这个单词。可以用谐音、画面联想、故事等方式。

4️⃣ **同根词族**
列出 3-6 个与该单词共享相同词根的常见英语单词，并简要说明它们的含义。

5️⃣ **例句**
用该单词造 1-2 个实用例句，附上中文翻译。`
}
