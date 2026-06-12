import io
import urllib.request

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf"

BG = "#0a0d12"
DOT = "#1d242e"
TEXT = "#e6edf3"
GREEN = "#39d353"
CYAN = "#58c6ff"
DATA = "#79c0ff"
MOBILE = "#7ee787"
AI = "#ffa657"
FAINT = "#6e7681"

INVADER = [
    "..#..#..", "...##...", "..####..", ".##..##.",
    "########", "#.####.#", "#.#..#.#", ".#....#.",
]

font_bytes = urllib.request.urlopen(FONT_URL, timeout=30).read()
f_big = ImageFont.truetype(io.BytesIO(font_bytes), 52)
f_mid = ImageFont.truetype(io.BytesIO(font_bytes), 22)
f_small = ImageFont.truetype(io.BytesIO(font_bytes), 16)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

for gx in range(0, W, 28):
    for gy in range(0, H, 28):
        d.rectangle([gx, gy, gx + 1, gy + 1], fill=DOT)

d.rectangle([0, 0, W - 1, H - 1], outline="#38414d", width=2)
def rect(x0, y0, x1, y1, fill):
    d.rectangle([min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)], fill=fill)

for cx, cy, dx, dy in [(14, 14, 1, 1), (W - 15, 14, -1, 1), (14, H - 15, 1, -1), (W - 15, H - 15, -1, -1)]:
    rect(cx, cy, cx + 26 * dx, cy + 3 * dy, CYAN)
    rect(cx, cy, cx + 3 * dx, cy + 26 * dy, CYAN)

x0 = 80
d.text((x0, 90), "$ whoami", font=f_mid, fill=GREEN)
d.text((x0, 150), "EFECAN", font=f_big, fill=TEXT)
d.text((x0, 220), "KÜÇÜK", font=f_big, fill=TEXT)

d.text((x0, 330), "$ git branch -a", font=f_mid, fill=GREEN)
branches = [("* data-analytics", DATA), ("  mobile-development", MOBILE), ("  ai-engineering", AI)]
for i, (name, color) in enumerate(branches):
    d.text((x0, 380 + i * 44), name, font=f_mid, fill=color)

d.text((x0, 545), "efekckk.github.io", font=f_small, fill=FAINT)

s = 22
ix, iy = 880, 150
for ry, row in enumerate(INVADER):
    for rx, c in enumerate(row):
        if c == "#":
            d.rectangle([ix + rx * s, iy + ry * s, ix + rx * s + s - 1, iy + ry * s + s - 1], fill=AI)

bar_x = 850
for i, bh in enumerate([40, 56, 32, 96, 48, 64, 36]):
    color = AI if bh == 96 else GREEN
    d.rectangle([bar_x + i * 44, 540 - bh, bar_x + i * 44 + 28, 540], fill=color)
    d.rectangle([bar_x + i * 44 - 3, 540 - bh, bar_x + i * 44 + 31, 540 - bh + 6], fill="#aff5b4" if color == GREEN else "#ffd8b5")

img.save("public/og.png")
print("public/og.png written")
