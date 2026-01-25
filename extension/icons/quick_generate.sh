#!/bin/bash
# 快速生成简单的PNG图标（用于测试）

echo "🎨 Generating simple test icons..."

# 使用ImageMagick生成简单的绿色图标
# 如果没有ImageMagick，请使用方案1（浏览器生成器）

convert -size 16x16 xc:"#10B981" -fill white -pointsize 12 -gravity center -annotate +0+0 "W" icon16.png
convert -size 32x32 xc:"#10B981" -fill white -pointsize 24 -gravity center -annotate +0+0 "W" icon32.png
convert -size 48x48 xc:"#10B981" -fill white -pointsize 36 -gravity center -annotate +0+0 "W" icon48.png
convert -size 128x128 xc:"#10B981" -fill white -pointsize 96 -gravity center -annotate +0+0 "W" icon128.png

echo "✅ Done! Icons generated."
