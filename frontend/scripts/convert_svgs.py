import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size):
    # Try to load a standard serif font
    fonts = ["georgia.ttf", "times.ttf", "arial.ttf"]
    for font_name in fonts:
        try:
            return ImageFont.truetype(font_name, size)
        except IOError:
            pass
    return ImageFont.load_default()

def create_favicon(size, out_path):
    # Create image with matte black background
    img = Image.new('RGBA', (size, size), color=(10, 10, 10, 255))
    draw = ImageDraw.Draw(img)
    
    # Gold color #D4AF37 = (212, 175, 55)
    gold = (212, 175, 55, 255)
    
    # Draw outer circle
    margin = int(size * 0.08)
    line_width = max(1, int(size * 0.024))
    draw.ellipse([margin, margin, size - margin, size - margin], outline=gold, width=line_width)
    
    # Draw inner circle (faint)
    inner_margin = int(size * 0.12)
    inner_line_width = max(1, int(size * 0.005))
    faint_gold = (212, 175, 55, 150)
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], outline=faint_gold, width=inner_line_width)
    
    # Draw "SF" text
    font_size = int(size * 0.45)
    font = get_font(font_size)
    
    # Get text bounding box for centering
    text = "SF"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Slight manual offset for visual centering
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - int(size * 0.05)
    
    draw.text((x, y), text, fill=gold, font=font)
    
    img.save(out_path)
    print(f"Generated {out_path}")

def create_logo(width, height, out_path):
    img = Image.new('RGBA', (width, height), color=(0, 0, 0, 0)) # Transparent
    draw = ImageDraw.Draw(img)
    gold = (212, 175, 55, 255)
    
    # Draw icon on the left
    icon_size = int(height * 0.8)
    margin_y = int(height * 0.1)
    margin_x = int(width * 0.02)
    
    line_width = max(1, int(icon_size * 0.05))
    draw.ellipse([margin_x, margin_y, margin_x + icon_size, margin_y + icon_size], outline=gold, width=line_width)
    
    font_size_icon = int(icon_size * 0.45)
    font_icon = get_font(font_size_icon)
    bbox_icon = draw.textbbox((0, 0), "SF", font=font_icon)
    icon_text_w = bbox_icon[2] - bbox_icon[0]
    icon_text_h = bbox_icon[3] - bbox_icon[1]
    
    draw.text((margin_x + (icon_size - icon_text_w)/2, margin_y + (icon_size - icon_text_h)/2 - int(icon_size * 0.05)), "SF", fill=gold, font=font_icon)
    
    # Draw text "SHAH FASHION"
    font_size_text = int(height * 0.45)
    font_text = get_font(font_size_text)
    text_x = margin_x + icon_size + int(width * 0.05)
    
    bbox_text = draw.textbbox((0, 0), "SHAH FASHION", font=font_text)
    text_h = bbox_text[3] - bbox_text[1]
    text_y = (height - text_h) / 2 - int(height * 0.05)
    
    draw.text((text_x, text_y), "SHAH FASHION", fill=gold, font=font_text)
    
    img.save(out_path)
    print(f"Generated {out_path}")

favicon_sizes = [
    (16, r"d:\Fashion\frontend\public\branding\favicon\favicon-16x16.png"),
    (32, r"d:\Fashion\frontend\public\branding\favicon\favicon-32x32.png"),
    (48, r"d:\Fashion\frontend\public\branding\favicon\favicon-48x48.png"),
    (192, r"d:\Fashion\frontend\public\branding\pwa\icon-192.png"),
    (512, r"d:\Fashion\frontend\public\branding\pwa\icon-512.png"),
    (1024, r"d:\Fashion\frontend\public\branding\pwa\icon-1024.png"),
    (192, r"d:\Fashion\frontend\public\branding\pwa\icon-maskable-192.png"),
    (512, r"d:\Fashion\frontend\public\branding\pwa\icon-maskable-512.png"),
    (180, r"d:\Fashion\frontend\public\branding\pwa\apple-touch-icon.png")
]

logo_sizes = [
    (400, 80, r"d:\Fashion\frontend\public\branding\logo\shah-fashion-logo.png"),
    (800, 160, r"d:\Fashion\frontend\public\branding\logo\shah-fashion-logo@2x.png"),
    (1200, 240, r"d:\Fashion\frontend\public\branding\logo\shah-fashion-logo@3x.png"),
]

for s, out in favicon_sizes:
    create_favicon(s, out)
    
for w, h, out in logo_sizes:
    create_logo(w, h, out)

import shutil
shutil.copyfile(r"d:\Fashion\frontend\public\branding\favicon\favicon-32x32.png", r"d:\Fashion\frontend\public\branding\favicon\favicon.ico")
print("Done!")
