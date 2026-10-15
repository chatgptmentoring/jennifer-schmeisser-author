"""Site build helper.

  python tools/build.py            # sync shared partials into every page
  python tools/build.py --assets   # also regenerate PDFs, thumbnails, share image

Pages in docs/ are the source of truth; blocks between
<!-- partial:NAME --> and <!-- /partial:NAME --> are replaced with partials/NAME.html.
"""
import io
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
PARTIALS = ROOT / "partials"
PRINT = ROOT / "print"
SOURCE = ROOT.parent  # the client's project folder (resources live in "Extra Book")
DL = DOCS / "assets" / "downloads"
IMG = DOCS / "assets" / "img"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"


def sync_partials():
    parts = {p.stem: p.read_text(encoding="utf-8").strip("\n") for p in PARTIALS.glob("*.html")}
    for page in sorted(DOCS.glob("*.html")):
        html = page.read_text(encoding="utf-8")

        def fill(m):
            name = m.group(1)
            return f"<!-- partial:{name} -->\n{parts[name]}\n<!-- /partial:{name} -->"

        new = re.sub(r"<!-- partial:(\w+) -->.*?<!-- /partial:\1 -->", fill, html, flags=re.S)
        if new != html:
            page.write_text(new, encoding="utf-8", newline="\n")
            print("synced", page.name)


def edge(args, url):
    with tempfile.TemporaryDirectory() as prof:
        cmd = [EDGE, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
               f"--user-data-dir={prof}", "--virtual-time-budget=12000", *args, url]
        subprocess.run(cmd, check=True, timeout=120, capture_output=True)


def html_to_pdf(src: Path, out: Path):
    import fitz
    raw = out.with_suffix(".raw.pdf")
    edge(["--no-pdf-header-footer", f"--print-to-pdf={raw}"], src.as_uri())
    doc = fitz.open(raw)
    if hasattr(doc, "rewrite_images"):
        doc.rewrite_images(dpi_threshold=160, dpi_target=150, quality=80)
    doc.save(out, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True)
    doc.close()
    raw.unlink()
    print("pdf", out.name, fitz.open(out).page_count, "pages", out.stat().st_size // 1024, "KB")


def screenshot(src: Path, out: Path, w: int, h: int):
    edge([f"--window-size={w},{h}", f"--screenshot={out}"], src.as_uri())


def raster_pdf(pages, out: Path, quality=78):
    """pages: list of PIL images -> compact image-only PDF."""
    import fitz
    doc = fitz.open()
    for im in pages:
        buf = io.BytesIO()
        im.convert("RGB").save(buf, "JPEG", quality=quality, optimize=True, progressive=True)
        w, h = im.size
        pw, ph = (612, 792) if h >= w else (792, 612)
        page = doc.new_page(width=pw, height=ph)
        page.insert_image(page.rect, stream=buf.getvalue(), keep_proportion=True)
    doc.save(out, garbage=4, deflate=True)
    print("pdf", out.name, out.stat().st_size // 1024, "KB")


def render_pages(pdf: Path, dpi=110, rotate=None):
    import fitz
    from PIL import Image
    imgs = []
    for i, p in enumerate(fitz.open(pdf)):
        pix = p.get_pixmap(dpi=dpi)
        im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        if rotate and rotate.get(i):
            im = im.rotate(rotate[i], expand=True)
        imgs.append(im)
    return imgs


def thumb(pdf: Path, out: Path, pages=(0, 1)):
    """Two tilted page previews on a soft background, 640x400 webp."""
    from PIL import Image, ImageDraw, ImageFilter
    W, H = 1280, 800
    bg = Image.new("RGB", (W, H), "#f2f5fb")
    grad = Image.linear_gradient("L").resize((W, H)).rotate(35, expand=False)
    bg = Image.composite(Image.new("RGB", (W, H), "#f5ecd9"), bg, grad)
    imgs = render_pages(pdf, dpi=90)
    picks = [imgs[i] for i in pages if i < len(imgs)]
    layout = [(-5, 0.36, 0.5), (6, 0.64, 0.54)] if len(picks) > 1 else [(-4, 0.5, 0.52)]
    for (angle, cx, cy), im in reversed(list(zip(layout, picks))):
        im = im.convert("RGBA")
        scale = (H * 0.78) / im.height
        im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
        if im.width > W * 0.6:
            s2 = (W * 0.6) / im.width
            im = im.resize((int(im.width * s2), int(im.height * s2)), Image.LANCZOS)
        framed = Image.new("RGBA", (im.width + 60, im.height + 60), (0, 0, 0, 0))
        shadow = Image.new("RGBA", framed.size, (0, 0, 0, 0))
        ImageDraw.Draw(shadow).rectangle([34, 40, 34 + im.width, 40 + im.height], fill=(15, 31, 68, 90))
        shadow = shadow.filter(ImageFilter.GaussianBlur(14))
        framed.alpha_composite(shadow)
        framed.alpha_composite(im, (30, 30))
        framed = framed.rotate(angle, expand=True, resample=Image.BICUBIC)
        x = int(W * cx - framed.width / 2)
        y = int(H * cy - framed.height / 2)
        bg.paste(framed, (x, y), framed)
    bg.resize((640, 400), Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
    print("thumb", out.name)


def build_assets():
    from PIL import Image
    DL.mkdir(parents=True, exist_ok=True)
    xb = SOURCE / "Extra Book"

    # 1) Client PDFs (scanned images): recompress; fix the sideways scan
    raster_pdf(render_pages(xb / "10 Brain Foods.pdf", dpi=120), DL / "10-Favorite-Brain-Foods.pdf")
    scan = render_pages(xb / "FedEx Scan 2026-01-18_14-23-34.pdf", dpi=120, rotate={0: 90, 1: 90, 2: 90, 3: 90, 4: 90})
    raster_pdf(scan, DL / "Brain-Boosters-and-Calcium-Rich-Recipes.pdf")

    # 2) Branded printables -> PDF
    html_to_pdf(DOCS / "resources" / "love-your-brain.html", DL / "10-Ways-to-Love-Your-Brain.pdf")
    html_to_pdf(DOCS / "resources" / "vitamin-d-magnesium.html", DL / "Vitamin-D-and-Magnesium-Timing-Guide.pdf")
    html_to_pdf(DOCS / "resources" / "accountability-workbook.html", DL / "8-Week-Accountability-Challenge-Workbook.pdf")
    html_to_pdf(PRINT / "speaker-one-sheet.html", DL / "Jennifer-Schmeisser-Speaker-One-Sheet.pdf")

    # 3) Card thumbnails
    thumb(DL / "10-Favorite-Brain-Foods.pdf", IMG / "res-brain-foods.webp")
    thumb(DL / "Brain-Boosters-and-Calcium-Rich-Recipes.pdf", IMG / "res-brain-boosters.webp", pages=(0, 5))
    thumb(DL / "10-Ways-to-Love-Your-Brain.pdf", IMG / "res-love-your-brain.webp", pages=(0,))
    thumb(DL / "Vitamin-D-and-Magnesium-Timing-Guide.pdf", IMG / "res-vitamin-d-magnesium.webp", pages=(0,))
    thumb(DL / "8-Week-Accountability-Challenge-Workbook.pdf", IMG / "res-accountability.webp", pages=(0, 1))

    # 4) Social share image
    png = IMG / "og-image.png"
    screenshot(PRINT / "og.html", png, 1200, 630)
    Image.open(png).convert("RGB").save(IMG / "og-image.jpg", quality=86, optimize=True, progressive=True)
    png.unlink()
    print("og-image.jpg")


if __name__ == "__main__":
    sync_partials()
    if "--assets" in sys.argv:
        build_assets()
