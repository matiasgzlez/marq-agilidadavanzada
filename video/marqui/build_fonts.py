"""Subset the four faces to the glyphs the film sets and inline them as base64 woff2 → fonts.js.

render.py loads comp.html over file://, where remote fonts never arrive. Re-run after copy edits:
    python3 build_fonts.py
Uses look.py's subsetter from the onetake skill (fontTools + brotli).
"""
import base64, pathlib, sys

sys.path.insert(0, str(pathlib.Path.home() / ".claude/skills/onetake/scripts"))
from look import subset_face  # noqa: E402

HERE = pathlib.Path(__file__).parent
FACES = [  # family, file, css weight, style, pinned axes
    ("Bricolage", "BricolageGrotesque.ttf", "200 800", "normal", {"opsz": 96, "wdth": 100}),
    ("Serif", "InstrumentSerif-Italic.ttf", "400", "italic", None),
    ("Geist", "Geist.ttf", "100 900", "normal", None),
    ("Mono", "GeistMono.ttf", "100 900", "normal", None),
]
chars = set(map(chr, range(32, 127))) | set("áéíóúñÁÉÍÓÚÑ¿¡«»“”‘’–—…·×→←↑↓✓•°%$") | set((HERE / "comp.html").read_text())
chars = sorted(c for c in chars if c.isprintable() and ord(c) < 0x2e80)
css = []
for fam, file, weight, style, pin in FACES:
    data, cmap = subset_face(HERE / "fonts" / file, pin, chars)
    lack = "".join(c for c in chars if not c.isspace() and ord(c) not in cmap)
    if lack and fam != "Mono":
        print(f"{fam} lacks: {lack[:60]}")
    css.append(f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{base64.b64encode(data).decode()}) format('woff2');font-weight:{weight};font-style:{style};font-display:block}}")
js = ("(function(){var s=document.createElement('style');s.textContent=" + repr("\n".join(css)) + ";document.head.appendChild(s);"
      "window.FONTS_READY=Promise.all([\"700 40px Bricolage\",\"italic 40px Serif\",\"500 20px Geist\",\"14px Mono\"].map(function(f){return document.fonts.load(f);})).then(function(){return document.fonts.ready;});})();\n")
(HERE / "fonts.js").write_text(js)
print(f"fonts.js · {len(js) // 1024} KB · {len(chars)} glyphs")
