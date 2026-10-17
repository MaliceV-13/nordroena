#!/usr/bin/env python3
"""Bundle Norðrœna into a single HTML file (inline CSS + JS)."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "nordroena-standalone.html"
ZIP_OUT = ROOT.parent / "OldNorseCourse.zip"

CSS = ROOT / "css" / "styles.css"
SCRIPTS = [
    "data/course.js",
    "data/path.js",
    "data/lesson1.js",
    "data/lesson2.js",
    "data/lesson3.js",
    "data/futhark.js",
    "js/progress.js",
    "js/exercises.js",
    "js/voice.js",
    "js/tts.js",
    "js/review.js",
    "js/session.js",
    "js/app.js",
]

def build_html() -> str:
    css = CSS.read_text(encoding="utf-8")
    parts = []
    for rel in SCRIPTS:
        src = (ROOT / rel).read_text(encoding="utf-8")
        parts.append(f"\n/* ==== {rel} ==== */\n{src}\n")
    js_blob = "".join(parts)
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0f1210" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="description" content="Norðrœna — progressive path course in historical Old West Norse / Classical normalized Old Norse. Not Modern Icelandic." />
  <title>Norðrœna — Old Norse Path</title>
  <style>
{css}
  </style>
</head>
<body>
  <div id="app">
    <p style="font-family: system-ui; color: #a89f8e; padding: 2rem;">Loading Norðrœna…</p>
  </div>
  <noscript><p style="padding:2rem;color:#c44">JavaScript is required.</p></noscript>
  <script>
    window.addEventListener('error', function(e) {{
      var el = document.getElementById('app');
      if (el && /Loading Nor/.test(el.textContent||'')) {{
        el.innerHTML = '<p style="padding:2rem;font-family:system-ui;color:#c9a227">Load error: ' + (e.message||'unknown') +
          '. On iPhone, open this standalone file in Safari.</p>';
      }}
    }}, true);
  </script>
  <script>
{js_blob}
  </script>
</body>
</html>
"""

def main():
    html = build_html()
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} ({len(html)} bytes)")

    if ZIP_OUT.exists():
        ZIP_OUT.unlink()
    with zipfile.ZipFile(ZIP_OUT, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(ROOT.rglob("*")):
            if path.is_file():
                if path.name.endswith(".zip"):
                    continue
                arc = Path("OldNorseCourse") / path.relative_to(ROOT)
                zf.write(path, arc.as_posix())
    print(f"Wrote {ZIP_OUT} ({ZIP_OUT.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
