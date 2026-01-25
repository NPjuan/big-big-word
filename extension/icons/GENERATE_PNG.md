# 🚀 快速生成图标文件

## 问题

manifest.json 需要这4个PNG文件，但它们还不存在：

- `icon16.png`
- `icon32.png`
- `icon48.png`
- `icon128.png`

## 解决方案

### 方案1：使用Python脚本（推荐）⭐

```bash
# 1. 安装依赖
pip install Pillow

# 2. 运行脚本
cd /Users/ekkopan/Desktop/playground/big-big-word/extension/icons/
python3 generate_icons.py
```

脚本会自动生成所有4个PNG文件！

### 方案2：使用浏览器生成器

1. 打开 `generate-icons.html`
2. 点击 "📦 Download All Icons"
3. 将下载的文件移动到 icons 目录：
   ```bash
   mv ~/Downloads/icon*.png /Users/ekkopan/Desktop/playground/big-big-word/extension/icons/
   ```

### 方案3：使用在线工具

如果没有Python环境，可以：

1. 打开 https://www.favicon-generator.org/
2. 上传 `icon.svg` 文件
3. 下载生成的PNG文件
4. 重命名为 `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

## 验证

生成后检查文件：

```bash
ls -lh /Users/ekkopan/Desktop/playground/big-big-word/extension/icons/*.png
```

应该看到：

```
icon16.png
icon32.png
icon48.png
icon128.png
```

## 重新加载扩展

1. 打开 `chrome://extensions/`
2. 点击扩展的"重新加载"按钮
3. 检查是否还有错误提示

✅ 完成！
