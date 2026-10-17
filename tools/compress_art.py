#!/usr/bin/env python3
"""Compress user-supplied artwork (art-user/) into mobile-sized JPEG + WebP in img/."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / "art-user", ROOT / "img"
OUT.mkdir(exist_ok=True)

# name: (max long edge, optional crop box as fractions l,t,r,b)
SPEC = {
    # yggdrasil: hand-tinted by tools/tint_yggdrasil.py -> img/yggdrasil-tinted.*
    "horn-warrior": (900, None),
    "mjolnir-knotwork": (1000, None),
    "odin-throne": (1000, None),
    "cliff-god": (900, None),
    "serpent-eye": (700, (0.165, 0.0, 0.835, 1.0)),  # drop the black side bars
    # small, low-res images: used only as avatars/badges/medallions
    "forest-sage": (700, None),
    "odin-ravens-bw": (225, None),
    "odin-ravens-storm": (300, None),
    "odin-wolves": (300, None),
}

def duotone(im, dark=(26, 20, 13), light=(233, 220, 191)):
    g = ImageOps.grayscale(im)
    return ImageOps.colorize(g, black=dark, white=light)

for name, (edge, crop) in SPEC.items():
    src = next(SRC.glob(f"{name}.*"))
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (12, 14, 13, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")
    if crop:
        w, h = im.size
        im = im.crop((int(crop[0] * w), int(crop[1] * h), int(crop[2] * w), int(crop[3] * h)))
    if name == "serpent-eye":
        im = duotone(im)  # sepia/parchment duotone to sit on parchment cards
    if max(im.size) > edge:
        im.thumbnail((edge, edge), Image.LANCZOS)
    im.save(OUT / f"{name}.jpg", "JPEG", quality=75, optimize=True, progressive=True)
    im.save(OUT / f"{name}.webp", "WEBP", quality=72, method=6)
    print(name, im.size, (OUT / f"{name}.jpg").stat().st_size, (OUT / f"{name}.webp").stat().st_size)
