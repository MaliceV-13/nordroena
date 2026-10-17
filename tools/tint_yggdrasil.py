#!/usr/bin/env python3
"""Hand-tint the user's sepia Yggdrasil engraving (autochrome / hand-coloured photo look).
Soft, low-saturation tints over the original luminance + vignette + fine grain."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
src = Image.open(ROOT / "art-user" / "yggdrasil.jpg").convert("RGB")
W0, H0 = src.size
im = src.resize((W0 * 2, H0 * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
W, H = im.size
a = np.asarray(im).astype(np.float32) / 255.0
L = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
x = xx / W * W0; y = yy / H * H0          # coordinates in original pixel space
cx, cy, R = 153, 186, 112
inside = (np.hypot(x - cx, y - cy) < R).astype(np.float32)

def soft(m, r=6):
    img = Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(r * 2))).astype(np.float32) / 255.0

def ramp(v, lo, hi):
    return np.clip((v - lo) / (hi - lo), 0, 1)

canopy = soft(inside * (y < 150) * (1 - ramp(L, 0.45, 0.65)))
sky = soft(inside * (y > 105) * (y < 222) * ramp(L, 0.55, 0.75))
mount = soft(inside * (y > 188) * (y < 240) * ramp(L, 0.3, 0.45) * (1 - ramp(L, 0.72, 0.85)) * (np.abs(x - cx) > 30))
trunk = soft(((np.abs(x - cx) < 34) * (y > 95) * (y < 300)) + inside * (y > 232), 4)
frame = soft(1 - inside, 3)
medal = soft(((np.hypot(x - 45, y - 375) < 38) + (np.hypot(x - 262, y - 375) < 38)).astype(np.float32), 3)

def col(r, g, b):
    return np.array([r, g, b], np.float32) / 255.0

sepia = col(196, 172, 138)
C = np.ones_like(a) * sepia
for mask, c in [
    (frame, col(184, 152, 102)),   # antique bronze frame
    (trunk, col(170, 118, 80)),    # warm brown trunk / roots
    (mount, col(158, 150, 176)),   # dusty lavender-grey mountains
    (sky, col(176, 198, 214)),     # pale faded blue sky
    (canopy, col(118, 142, 104)),  # muted foliage green
    (medal, col(126, 146, 128)),   # corner medallions (sage)
]:
    C = C * (1 - mask[..., None]) + c * mask[..., None]

tinted = np.clip(C * (L[..., None] * 1.22), 0, 1)
out = 0.62 * tinted + 0.38 * a                       # keep the engraving's own tone
grey = out.mean(axis=2, keepdims=True)
out = grey + (out - grey) * 0.9                      # low saturation, slightly faded
out = out * 0.94 + 0.04                              # lifted blacks (faded print)
v = 1 - 0.38 * np.clip(np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2)) - 0.45, 0, 1) ** 1.4
out *= v[..., None]
rng = np.random.default_rng(3)
out += (rng.normal(0, 0.018, (H, W, 1))).astype(np.float32)
res = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))
res.save(ROOT / "art-user" / "yggdrasil-tinted.jpg", "JPEG", quality=88)
res.save(ROOT / "img" / "yggdrasil-tinted.jpg", "JPEG", quality=75, optimize=True, progressive=True)
res.save(ROOT / "img" / "yggdrasil-tinted.webp", "WEBP", quality=72, method=6)
print(res.size, (ROOT / "img" / "yggdrasil-tinted.jpg").stat().st_size, (ROOT / "img" / "yggdrasil-tinted.webp").stat().st_size)
