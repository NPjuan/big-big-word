# 🌐 中英双语翻译功能文档

## 📋 概述

Big Big Word 现已集成中英双语翻译功能，使用 **MyMemory Translation API** 自动翻译单词的释义和例句。

---

## ✨ 新功能

### 1. 自动翻译

- ✅ 输入单词后自动获取英文释义
- ✅ 自动翻译为中文释义
- ✅ 支持多个词性的翻译
- ✅ 包含释义和例句的翻译

### 2. 表格显示

- ✅ 新增"Meanings"列
- ✅ 显示中英双语预览
- ✅ 点击展开查看完整翻译
- ✅ 优雅的展开/收起动画

### 3. 翻译 API

- ✅ 使用 MyMemory Translation API
- ✅ 免费服务（1000词/天）
- ✅ 无需 API Key
- ✅ 自动错误处理和降级

---

## 🎨 UI 设计

### 翻译列预览

```
┌─────────────────────────────────┐
│ 🇨🇳 偶然发现珍奇事物的能力...    │
│ 🇬🇧 The occurrence and deve... │
│                              ▼  │
└─────────────────────────────────┘
```

### 展开后的完整视图

```
┌─────────────────────────────────┐
│ 🇨🇳 中文释义                     │
│   noun                          │
│   • 偶然发现珍奇事物的能力       │
│   • 意外发现有价值东西的运气     │
│                                 │
│ 🇬🇧 English Meanings            │
│   noun                          │
│   • The occurrence and deve...  │
│   • Good fortune in making...   │
└─────────────────────────────────┘
```

---

## 🔧 技术实现

### 1. 翻译 API 服务

#### MyMemory Translation API

```typescript
// 文件: src/services/dictionaryApi.ts

export const translateToChineseSimple = async (text: string): Promise<string> => {
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`,
  )
  const data = await response.json()
  return data.responseData?.translatedText || text
}
```

#### 批量翻译（带速率限制）

```typescript
const translateBatch = async (texts: string[], delayMs = 300): Promise<string[]> => {
  const results: string[] = []
  for (const text of texts) {
    const translated = await translateToChineseSimple(text)
    results.push(translated)
    // 添加延迟避免速率限制
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return results
}
```

#### 生成中文释义

```typescript
export const generateChineseMeanings = async (
  englishMeanings: WordData['englishMeanings'],
): Promise<ChineseMeaning[]> => {
  const chineseMeanings = []

  for (const meaning of englishMeanings) {
    // 限制翻译数量以避免速率限制
    const definitions = meaning.definitions.slice(0, 3)
    const examples = meaning.examples.slice(0, 2)

    // 翻译释义和例句
    const translatedDefinitions = await translateBatch(definitions)
    const translatedExamples = await translateBatch(examples)

    chineseMeanings.push({
      partOfSpeech: meaning.partOfSpeech,
      definitions: translatedDefinitions,
      examples: translatedExamples,
    })
  }

  return chineseMeanings
}
```

### 2. 数据结构

#### Word 类型（已存在）

```typescript
export interface Word {
  id: string
  word: string
  phonetic: string
  audioUrl?: string
  partOfSpeech: string[]
  chineseMeaning: ChineseMeaning[] // 中文释义
  englishMeaning: EnglishMeaning[] // 英文释义
  etymology: Etymology
  createdAt: string
  lastReviewed?: string
  reviewCount: number
  mastery: number
}
```

#### ChineseMeaning 接口

```typescript
export interface ChineseMeaning {
  partOfSpeech: string // 词性
  definitions: string[] // 中文释义列表
  examples: string[] // 中文例句列表
}
```

#### EnglishMeaning 接口

```typescript
export interface EnglishMeaning {
  partOfSpeech: string // 词性
  definitions: string[] // 英文释义列表
  examples: string[] // 英文例句列表
  synonyms: string[] // 同义词
  antonyms: string[] // 反义词
}
```

### 3. 表格组件更新

#### 新增状态

```typescript
const expandedMeanings = ref<Set<string>>(new Set())
```

#### 辅助函数

```typescript
// 获取第一个中文释义（用于预览）
const getFirstChineseMeaning = (word: Word): string => {
  if (!word.chineseMeaning || word.chineseMeaning.length === 0) {
    return '暂无中文释义'
  }
  const firstMeaning = word.chineseMeaning[0]
  const definition = firstMeaning.definitions[0]
  return definition.length > 50 ? definition.substring(0, 50) + '...' : definition
}

// 获取第一个英文释义（用于预览）
const getFirstEnglishMeaning = (word: Word): string => {
  if (!word.englishMeaning || word.englishMeaning.length === 0) {
    return 'No English meaning'
  }
  const firstMeaning = word.englishMeaning[0]
  const definition = firstMeaning.definitions[0]
  return definition.length > 50 ? definition.substring(0, 50) + '...' : definition
}

// 切换展开/收起
const toggleMeanings = (wordId: string) => {
  if (expandedMeanings.value.has(wordId)) {
    expandedMeanings.value.delete(wordId)
  } else {
    expandedMeanings.value.add(wordId)
  }
  expandedMeanings.value = new Set(expandedMeanings.value)
}
```

---

## 🎯 使用流程

### 1. 添加单词

```
用户输入 "serendipity"
  ↓
调用 Free Dictionary API
  ↓
获取英文释义和音标
  ↓
调用 MyMemory Translation API
  ↓
翻译为中文释义
  ↓
保存到 localStorage
  ↓
显示在表格中
```

### 2. 查看翻译

```
点击 Meanings 列的预览卡片
  ↓
展开动画
  ↓
显示完整的中英双语释义
  ↓
再次点击收起
```

---

## 📊 API 限制

### MyMemory Translation API

#### 免费版限制

- **每日限额**: 1000 词
- **速率限制**: 建议每次请求间隔 300ms
- **文本长度**: 最大 500 字符/请求
- **无需注册**: 无需 API Key

#### 付费版（可选）

- **每日限额**: 10,000+ 词
- **速率限制**: 更高
- **需要注册**: 获取 API Key

### 应对策略

#### 1. 限制翻译数量

```typescript
// 只翻译前 3 个释义
const definitions = meaning.definitions.slice(0, 3)

// 只翻译前 2 个例句
const examples = meaning.examples.slice(0, 2)
```

#### 2. 添加请求延迟

```typescript
// 每次请求间隔 300ms
await new Promise((resolve) => setTimeout(resolve, 300))
```

#### 3. 错误处理

```typescript
try {
  const translated = await translateToChineseSimple(text)
  return translated
} catch (error) {
  console.error('Translation error:', error)
  return text // 返回原文
}
```

#### 4. 降级策略

```typescript
// 如果翻译失败，显示占位符
return englishMeanings.map((meaning) => ({
  partOfSpeech: meaning.partOfSpeech,
  definitions: meaning.definitions.map((def) => `[翻译失败: ${def}]`),
  examples: meaning.examples.map((ex) => `[翻译失败: ${ex}]`),
}))
```

---

## 🎨 样式设计

### 翻译卡片

```css
.meanings-toggle {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.meanings-toggle:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}
```

### 展开动画

```css
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
```

### 释义列表

```css
.meaning-definition {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.6;
  padding-left: 1.25rem;
  position: relative;
}

.meaning-definition::before {
  content: '•';
  position: absolute;
  left: 0.375rem;
  color: #667eea;
  font-weight: 700;
}
```

---

## 🔍 示例

### 输入单词: "serendipity"

#### 英文释义（来自 Free Dictionary API）

```json
{
  "partOfSpeech": "noun",
  "definitions": [
    "The occurrence and development of events by chance in a happy or beneficial way",
    "Good fortune in making unexpected and fortunate discoveries"
  ],
  "examples": ["A fortunate stroke of serendipity brought the two old friends together"]
}
```

#### 中文翻译（来自 MyMemory API）

```json
{
  "partOfSpeech": "noun",
  "definitions": ["偶然发现珍奇事物的能力；意外发现有价值东西的运气", "在意外中发现有益事物的好运"],
  "examples": ["一次幸运的偶然使两位老朋友重逢"]
}
```

---

## 🚀 性能优化

### 1. 批量翻译

- 收集所有需要翻译的文本
- 批量发送请求
- 添加延迟避免速率限制

### 2. 缓存策略（未来）

```typescript
// 可以添加翻译缓存
const translationCache = new Map<string, string>()

const translateWithCache = async (text: string): Promise<string> => {
  if (translationCache.has(text)) {
    return translationCache.get(text)!
  }

  const translated = await translateToChineseSimple(text)
  translationCache.set(text, translated)
  return translated
}
```

### 3. 懒加载

- 只在展开时加载完整翻译
- 预览只显示第一条释义

---

## 🐛 故障排除

### 问题 1: 翻译失败

**症状**: 显示 "[翻译失败: ...]"

**原因**:

- API 速率限制
- 网络连接问题
- API 服务不可用

**解决方案**:

1. 等待几分钟后重试
2. 检查网络连接
3. 查看浏览器控制台错误信息

### 问题 2: 翻译质量差

**症状**: 中文翻译不准确

**原因**:

- 机器翻译的局限性
- 专业术语翻译困难

**解决方案**:

1. 参考英文原文
2. 未来可集成更好的翻译 API（如 DeepL）

### 问题 3: 加载缓慢

**症状**: 添加单词需要很长时间

**原因**:

- 需要翻译多个释义和例句
- 每次请求有 300ms 延迟

**解决方案**:

1. 已限制翻译数量（3个释义 + 2个例句）
2. 可以调整延迟时间（但可能触发速率限制）

---

## 🔮 未来改进

### 1. 更好的翻译 API

- [ ] 集成 DeepL API（更高质量）
- [ ] 集成 Google Translate API
- [ ] 支持多种翻译引擎切换

### 2. 翻译缓存

- [ ] 本地缓存翻译结果
- [ ] 减少 API 调用次数
- [ ] 提高响应速度

### 3. 离线支持

- [ ] 预下载常用词汇翻译
- [ ] 离线词典集成
- [ ] Service Worker 缓存

### 4. 用户自定义

- [ ] 允许用户编辑翻译
- [ ] 支持用户贡献翻译
- [ ] 翻译质量评分

### 5. 更多语言

- [ ] 支持繁体中文
- [ ] 支持其他语言（日语、韩语等）
- [ ] 多语言切换

---

## 📚 相关文档

- [MyMemory Translation API 文档](https://mymemory.translated.net/doc/spec.php)
- [Free Dictionary API 文档](https://dictionaryapi.dev/)
- [Word 类型定义](../src/types/word.types.ts)
- [Dictionary API 服务](../src/services/dictionaryApi.ts)
- [Word Store](../src/stores/wordStore.ts)

---

## ✅ 功能清单

### 已完成

- [x] 集成 MyMemory Translation API
- [x] 自动翻译英文释义为中文
- [x] 在表格中显示中英双语
- [x] 展开/收起动画
- [x] 错误处理和降级
- [x] 速率限制处理
- [x] 美观的 UI 设计

### 待完成

- [ ] 翻译缓存
- [ ] 更好的翻译 API
- [ ] 用户自定义翻译
- [ ] 离线支持
- [ ] 多语言支持

---

**功能状态**: ✅ **已完成并可用**  
**翻译质量**: ⭐⭐⭐⭐ **良好（机器翻译）**  
**API 状态**: 🟢 **免费可用**

**更新日期**: 2026-01-17  
**版本**: v1.0.0  
**作者**: AI Assistant
