import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size):
    fonts = ["georgia.ttf", "times.ttf", "arial.ttf"]
    for font_name in fonts:
        try:
            return ImageFont.truetype(font_name, size)
        except IOError:
            pass
    return ImageFont.load_default()

def process_image(bg_path, out_path, target_size, add_text=True):
    try:
        img = Image.open(bg_path).convert('RGBA')
        
        # Calculate crop/resize to match target_size
        target_w, target_h = target_size
        img_w, img_h = img.size
        
        img_ratio = img_w / img_h
        target_ratio = target_w / target_h
        
        if img_ratio > target_ratio:
            # Image is wider than target
            new_w = int(img_h * target_ratio)
            left = (img_w - new_w) // 2
            img = img.crop((left, 0, left + new_w, img_h))
        elif img_ratio < target_ratio:
            # Image is taller than target
            new_h = int(img_w / target_ratio)
            top = (img_h - new_h) // 2
            img = img.crop((0, top, img_w, top + new_h))
            
        img = img.resize(target_size, Image.LANCZOS)
        
        if add_text:
            # Add text overlay
            draw = ImageDraw.Draw(img)
            
            # Add subtle dark gradient/overlay to make text readable
            overlay = Image.new('RGBA', img.size, (0, 0, 0, 150))
            img = Image.alpha_composite(img, overlay)
            draw = ImageDraw.Draw(img)
            
            gold = (212, 175, 55, 255)
            white = (240, 240, 240, 255)
            
            h1_size = int(target_h * 0.12)
            h2_size = int(target_h * 0.08)
            h3_size = int(target_h * 0.04)
            
            f1 = get_font(h1_size)
            f2 = get_font(h2_size)
            f3 = get_font(h3_size)
            
            texts = [
                ("SHAH FASHION", f1, gold),
                ("SADI & BLOUSES", f2, white),
                ("TRADITION MEETS ELEGANCE", f3, gold)
            ]
            
            y_offset = target_h * 0.35
            
            for text, font, color in texts:
                bbox = draw.textbbox((0, 0), text, font=font)
                w = bbox[2] - bbox[0]
                h = bbox[3] - bbox[1]
                x = (target_w - w) / 2
                draw.text((x, y_offset), text, fill=color, font=font)
                y_offset += h + target_h * 0.03
                
        img = img.convert('RGB')
        img.save(out_path, quality=95)
        
        # Save as webp if it's png or jpg
        if out_path.endswith('.png') or out_path.endswith('.jpg'):
            webp_path = out_path.rsplit('.', 1)[0] + '.webp'
            img.save(webp_path, format='WEBP', quality=90)
            print(f"Generated {webp_path}")
            
        print(f"Generated {out_path}")
    except Exception as e:
        print(f"Error processing {bg_path}: {e}")

# Base directories
artifacts_dir = r"C:\Users\kasim\.gemini\antigravity-ide\brain\9f14683a-27cc-4cb8-8c30-43688cc9d49b"

bg_hero = os.path.join(artifacts_dir, "bg_hero_1789534110921.jpg")
bg_mobile = os.path.join(artifacts_dir, "bg_mobile_1789534123731.jpg")
bg_og = os.path.join(artifacts_dir, "bg_og_1789534136466.jpg")
bg_square = os.path.join(artifacts_dir, "bg_square_1789534148618.jpg")

hero_dir = r"d:\Fashion\frontend\public\branding\hero"
social_dir = r"d:\Fashion\frontend\public\branding\social"

# Tasks
process_image(bg_hero, os.path.join(hero_dir, "shah-fashion-hero.jpg"), (1536, 1024), True)
process_image(bg_og, os.path.join(social_dir, "og-image-1200x630.png"), (1200, 630), True)
process_image(bg_square, os.path.join(social_dir, "social-square-1080.png"), (1080, 1080), True)
process_image(bg_mobile, os.path.join(social_dir, "social-portrait-1080x1350.png"), (1080, 1350), True)

print("All promotional artwork generated successfully.")
