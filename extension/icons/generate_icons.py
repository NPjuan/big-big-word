#!/usr/bin/env python3
"""
Big Big Word - Icon Generator
自动生成所有尺寸的PNG图标文件
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 颜色定义（绿色主题）
COLOR_PRIMARY = "#10B981"  # Emerald-500
COLOR_SECONDARY = "#059669"  # Emerald-600

def hex_to_rgb(hex_color):
    """将十六进制颜色转换为RGB元组"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_gradient(draw, width, height, color1, color2):
    """创建渐变背景"""
    for y in range(height):
        # 计算当前行的颜色
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_icon(size):
    """绘制指定尺寸的图标"""
    # 创建图像
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    scale = size / 128
    
    # 绘制圆角矩形背景（渐变）
    # 由于PIL不直接支持渐变，我们先创建一个临时图像
    temp_img = Image.new('RGB', (size, size))
    temp_draw = ImageDraw.Draw(temp_img)
    
    color1 = hex_to_rgb(COLOR_PRIMARY)
    color2 = hex_to_rgb(COLOR_SECONDARY)
    create_gradient(temp_draw, size, size, color1, color2)
    
    # 创建圆角蒙版
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = int(24 * scale)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # 应用蒙版
    img.paste(temp_img, (0, 0), mask)
    draw = ImageDraw.Draw(img)
    
    # 绘制书本
    book_left = int(35 * scale)
    book_top = int(40 * scale)
    book_width = int(29 * scale)
    book_height = int(48 * scale)
    book_right = int(64 * scale)
    
    # 左页
    draw.rectangle(
        [(book_left, book_top), (book_left + book_width, book_top + book_height)],
        fill=(255, 255, 255, 242)
    )
    
    # 右页
    draw.rectangle(
        [(book_right, book_top), (book_right + book_width, book_top + book_height)],
        fill=(255, 255, 255, 217)
    )
    
    # 书脊
    draw.rectangle(
        [(int(62 * scale), book_top), (int(66 * scale), book_top + book_height)],
        fill=(255, 255, 255, 179)
    )
    
    # 绘制字母 "W"
    try:
        # 尝试使用系统字体
        font_size = int(28 * scale)
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
        except:
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
        
        text = "W"
        # 获取文本边界框
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        text_x = int(49.5 * scale - text_width / 2)
        text_y = int(68 * scale - text_height / 2)
        
        draw.text((text_x, text_y), text, fill=hex_to_rgb(COLOR_PRIMARY), font=font)
    except Exception as e:
        print(f"Warning: Could not draw text for size {size}: {e}")
    
    # 绘制装饰线条
    line_color = hex_to_rgb(COLOR_PRIMARY) + (153,)  # 60% opacity
    line_width = max(1, int(2 * scale))
    
    line_x1 = int(70 * scale)
    line_x2 = int(87 * scale)
    line_positions = [52, 60, 68, 76]
    
    for i, y in enumerate(line_positions):
        y_pos = int(y * scale)
        end_x = int(82 * scale) if i == 3 else line_x2
        draw.line([(line_x1, y_pos), (end_x, y_pos)], fill=line_color, width=line_width)
    
    return img

def main():
    """主函数：生成所有尺寸的图标"""
    sizes = [16, 32, 48, 128]
    
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("🎨 Big Big Word - Icon Generator")
    print("=" * 50)
    print(f"📁 Output directory: {script_dir}")
    print(f"🎨 Theme: Green (Emerald)")
    print(f"🔢 Sizes: {', '.join(map(str, sizes))} pixels")
    print("=" * 50)
    print()
    
    for size in sizes:
        filename = f"icon{size}.png"
        filepath = os.path.join(script_dir, filename)
        
        print(f"⏳ Generating {filename} ({size}×{size})...", end=" ")
        
        try:
            img = draw_icon(size)
            img.save(filepath, 'PNG')
            file_size = os.path.getsize(filepath)
            print(f"✅ Done ({file_size} bytes)")
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    print()
    print("=" * 50)
    print("✨ All icons generated successfully!")
    print()
    print("📋 Next steps:")
    print("1. Check the generated PNG files in the icons directory")
    print("2. Reload your Chrome extension at chrome://extensions/")
    print("3. Verify the icons appear correctly")
    print()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
        print("💡 Make sure you have Pillow installed:")
        print("   pip install Pillow")
