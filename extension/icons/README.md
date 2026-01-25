# 图标文件说明

## 🎨 快速生成图标（推荐）

我们提供了一个自动图标生成器，可以一键生成所有尺寸的图标！

### 📺 预览图标效果

在生成之前，你可以先预览图标效果：

```bash
# 在浏览器中打开预览页面
file:///path/to/big-big-word/extension/icons/preview.html
```

或者直接双击 `preview.html` 文件

### 使用方法

1. **打开生成器页面**

   ```bash
   # 在浏览器中打开
   file:///path/to/big-big-word/extension/icons/generate-icons.html
   ```

   或者直接双击 `generate-icons.html` 文件

2. **下载图标**
   - 点击 "📦 Download All Icons" 按钮
   - 所有 4 个尺寸的图标会自动下载到你的下载文件夹

3. **放置图标**
   - 将下载的 PNG 文件移动到 `extension/icons/` 目录
   - 确保文件名正确：`icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

4. **重新加载扩展**
   - 打开 `chrome://extensions/`
   - 点击扩展的"重新加载"按钮
   - 完成！🎉

---

## 需要的图标尺寸

以下 4 个尺寸的图标文件是必需的：

- `icon16.png` - 16x16 像素（浏览器工具栏）
- `icon32.png` - 32x32 像素（扩展管理页面）
- `icon48.png` - 48x48 像素（扩展管理页面）
- `icon128.png` - 128x128 像素（Chrome Web Store）

## 设计建议

### 主题

- 📚 书本图标
- 🎴 卡片图标
- 💡 灯泡图标
- ✨ 星星图标

### 颜色方案

使用应用的主色调：

- 主色：`#667eea` (紫蓝色)
- 辅色：`#764ba2` (紫色)
- 渐变：`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

### 设计工具

- Figma
- Adobe Illustrator
- Canva
- 在线图标生成器

## 临时方案

在开发阶段，可以使用以下方法生成临时图标：

### 方法 1：使用 Emoji

将 📚 emoji 截图并调整大小

### 方法 2：使用文字

创建纯色背景 + "BBW" 文字

### 方法 3：在线生成

使用在线工具：

- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

## 快速生成命令（需要 ImageMagick）

```bash
# 安装 ImageMagick
brew install imagemagick  # macOS
# sudo apt-get install imagemagick  # Linux

# 生成图标（从 SVG 或大图）
convert source.png -resize 16x16 icon16.png
convert source.png -resize 32x32 icon32.png
convert source.png -resize 48x48 icon48.png
convert source.png -resize 128x128 icon128.png
```

## 注意事项

1. **透明背景**：建议使用 PNG 格式，支持透明背景
2. **清晰度**：确保小尺寸图标也清晰可辨
3. **一致性**：所有尺寸保持相同的设计风格
4. **对比度**：确保在浅色和深色背景下都清晰可见

---

**在正式发布前，请替换这些占位符图标！**
