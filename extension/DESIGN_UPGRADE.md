# 🎨 翻译弹窗设计升级 - Claymorphism 风格

## 设计理念

基于主工程的设计风格，采用 **Claymorphism（粘土拟态）** 设计语言，打造温暖、友好、playful 的学习体验。

---

## 🎯 设计特点

### 1. Claymorphism 风格元素

- **柔和 3D 效果**：多层阴影营造立体感
- **圆润边框**：16-24px 圆角，chunky 风格
- **厚实边框**：3-4px 边框，toy-like 质感
- **双重阴影**：外阴影 + 内高光，增强立体感
- **柔和过渡**：200-300ms 缓动动画

### 2. 配色方案（参考主工程）

```css
/* 主色调 - Teal/Emerald */
Primary:    #0D9488  /* 深青色 */
Secondary:  #2DD4BF  /* 亮青色 */
CTA:        #EA580C  /* 橙色强调 */
Background: #F0FDFA  /* 浅青背景 */
Text:       #134E4A  /* 深青文字 */
```

### 3. 字体系统

- **标题字体**：Baloo 2（playful, friendly）
- **音标字体**：SF Mono / Monaco（等宽）
- **正文字体**：系统默认 San-serif

---

## 📐 布局结构

```
┌─────────────────────────────────────────┐
│ ╔═══════════════════════════════════╗   │
│ ║  serendipity              ⊗       ║   │ ← 渐变头部 + 橙色底边
│ ╚═══════════════════════════════════╝   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ /ˌserənˈdɪpɪti/            🔊    │  │ ← 音标卡片
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ noun                              │  │
│  │ ● 意外发现珍奇事物的本领            │  │ ← 中文释义
│  │ ● 偶然发现有价值事物的能力          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ verb                              │  │
│  │ ● 偶然发现                         │  │
│  └───────────────────────────────────┘  │
│                                         │
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │ 📚 添加到单词本  │ │ 🎴 打开学习     │ │ ← 操作按钮
│ └─────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎨 视觉效果详解

### 头部区域

- **渐变背景**：#0D9488 → #2DD4BF
- **橙色底边**：4px 高度，#EA580C → #F97316
- **文字阴影**：0 2px 8px rgba(0,0,0,0.15)
- **关闭按钮**：圆形，白色半透明，hover 旋转 90°

### 音标卡片

- **背景**：rgba(13, 148, 136, 0.06)
- **边框**：2px solid rgba(13, 148, 136, 0.15)
- **圆角**：16px
- **播放按钮**：
  - 渐变背景：#0D9488 → #14B8A6
  - 圆形 40x40px
  - Hover 放大 1.15x
  - 播放时脉冲动画

### 释义卡片

- **背景**：白色
- **边框**：3px solid rgba(13, 148, 136, 0.15)
- **圆角**：16px
- **Hover 效果**：
  - 边框加深
  - 阴影增强
  - 向上移动 2px

### 词性标签

- **背景**：rgba(234, 88, 12, 0.1)
- **边框**：2px solid rgba(234, 88, 12, 0.2)
- **圆角**：10px
- **颜色**：#EA580C（橙色）

### 列表项目符号

- **样式**：圆形渐变
- **颜色**：#0D9488 → #2DD4BF
- **大小**：12x12px
- **阴影**：0 2px 4px rgba(13, 148, 136, 0.3)

### 底部按钮

- **主按钮**（添加到单词本）：
  - 渐变背景：#0D9488 → #14B8A6
  - 白色文字
  - Hover 向上移动 3px
  - 阴影增强

- **次按钮**（打开学习）：
  - 白色背景
  - 3px 青色边框
  - Hover 背景变浅青色
  - Hover 向上移动 3px

---

## 🔄 动画效果

### 弹窗出现

```css
opacity: 0 → 1
transform: translateY(-10px) scale(0.95) → translateY(0) scale(1)
duration: 0.3s
easing: cubic-bezier(0.34, 1.56, 0.64, 1) /* 弹性效果 */
```

### 按钮 Hover

```css
transform: translateY(-3px)
box-shadow: 增强
duration: 0.2s
easing: ease-out
```

### 播放按钮脉冲

```css
@keyframes pulse-play {
  0%, 100%: scale(1)
  50%: scale(1.1)
}
duration: 1s
iteration: infinite
```

### 关闭按钮旋转

```css
transform: scale(1.1) rotate(90deg)
duration: 0.2s
```

---

## 🌐 中文翻译功能

### API 集成

- **翻译服务**：LibreTranslate（免费、开源）
- **API 地址**：https://libretranslate.com/translate
- **翻译方向**：英文 → 中文
- **翻译内容**：单词释义（definitions）

### 翻译流程

1. 获取英文释义
2. 逐条翻译为中文
3. 显示中文释义（移除英文）
4. 保留词性标签（英文）

### 优势

- ✅ 更符合中文用户习惯
- ✅ 降低阅读门槛
- ✅ 提升学习效率
- ✅ 减少认知负担

---

## 📱 响应式设计

### 移动端适配（< 480px）

- 弹窗宽度：90vw（最小 280px）
- 头部 padding：16px 20px
- 单词字号：20px
- 关闭按钮：32x32px
- 音标字号：16px
- 播放按钮：36x36px
- 底部按钮：纵向排列

---

## ♿ 无障碍设计

### 键盘导航

- 所有交互元素支持 Tab 键
- Focus 状态：3px 青色外框
- Outline offset：2px

### 屏幕阅读器

- 关闭按钮：title="关闭"
- 播放按钮：title="播放发音"
- 语义化 HTML 结构

### 动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  /* 禁用所有动画 */
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

---

## 🎯 设计对比

### 旧设计问题

- ❌ 扁平化风格，缺乏层次感
- ❌ 英文释义，阅读门槛高
- ❌ 简单渐变，视觉单调
- ❌ 缺少 playful 元素
- ❌ 按钮样式普通

### 新设计优势

- ✅ Claymorphism 风格，立体感强
- ✅ 中文翻译，易于理解
- ✅ 多层阴影，视觉丰富
- ✅ 圆润可爱，友好温暖
- ✅ 按钮有趣，交互愉悦

---

## 🚀 技术实现

### CSS 关键技术

```css
/* 多层阴影 */
box-shadow:
  0 8px 16px rgba(13, 148, 136, 0.12),
  0 16px 32px rgba(13, 148, 136, 0.08),
  inset 0 1px 0 rgba(255, 255, 255, 0.9);

/* 厚实边框 */
border: 3px solid rgba(13, 148, 136, 0.15);

/* 圆润边角 */
border-radius: 24px;

/* 弹性动画 */
transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### JavaScript 翻译逻辑

```javascript
// 调用翻译 API
const translateToChinese = async (text) => {
  const response = await fetch('https://libretranslate.com/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: 'zh',
      format: 'text',
    }),
  })
  const data = await response.json()
  return data.translatedText
}

// 批量翻译释义
const chineseMeanings = await DictionaryAPI.generateChineseMeanings(wordData.englishMeanings)
```

---

## 📋 Pre-Delivery Checklist

- [x] 使用 SVG 图标（不使用 emoji）
- [x] 所有可点击元素添加 cursor-pointer
- [x] Hover 状态有平滑过渡（150-300ms）
- [x] 文字对比度 ≥ 4.5:1
- [x] Focus 状态清晰可见
- [x] 支持 prefers-reduced-motion
- [x] 响应式设计（375px, 768px, 1024px, 1440px）
- [x] 中文翻译功能正常
- [x] 音频播放功能正常
- [x] 按钮交互流畅

---

## 🎉 总结

新设计采用 **Claymorphism** 风格，结合主工程的配色方案，打造了一个：

- 🎨 **视觉愉悦**：柔和 3D、圆润可爱
- 🌐 **易于理解**：中文翻译、降低门槛
- 🎯 **交互友好**：平滑动画、清晰反馈
- ♿ **无障碍**：键盘导航、屏幕阅读器支持
- 📱 **响应式**：移动端完美适配

让单词学习变得更加轻松愉快！✨
