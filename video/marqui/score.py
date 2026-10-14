"""score.py — the sound, placed from the comp's own window.__events().

Recorded CC0 sources from Kenney (sfx-src/, licences beside them), each placed so its measured peak — not the start
of the file — lands on the event; air for camera moves from the onetake palette; one shared room; mastered to
-16 LUFS under a -4 dBTP ceiling (AAC overshoots). No music (the brief asked for sound effects only).

    python3 score.py film        → sfx-film.wav        (also: consultas, senas, marqador)
Needs the skill's scripts/sfx_palette.py, Playwright (python) and ffmpeg.
"""
import asyncio, pathlib, subprocess, sys
import numpy as np
from playwright.async_api import async_playwright

sys.path.insert(0, str(pathlib.Path.home() / ".claude/skills/onetake/scripts"))
from sfx_palette import SR, Score, air, sub  # noqa: E402

HERE = pathlib.Path(__file__).parent
CUT = sys.argv[1] if len(sys.argv) > 1 else "film"


async def events():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto((HERE / "comp.html").resolve().as_uri() + f"?cut={CUT}")
        await pg.evaluate("window.__ready")
        ev = await pg.evaluate("window.__events()")
        await b.close()
        return ev


_cache = {}
def src(name):
    """A recorded source as mono float at SR, and the index of its peak."""
    if name not in _cache:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(HERE / "sfx-src" / f"{name}.ogg"), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                             capture_output=True, check=True).stdout
        x = np.frombuffer(raw, dtype=np.float32).copy()
        x /= max(1e-6, np.abs(x).max())
        env = np.convolve(np.abs(x), np.ones(96) / 96, mode="same")
        _cache[name] = (x, int(env.argmax()))
    return _cache[name]


E = asyncio.run(events())
s = Score(dur=E["T"] + 1.4, T60=1.0)
P = lambda e: float(np.clip(e["pan"] * 0.6, -0.7, 0.7))


def hit(name, t, gain, pan, send=0.22, rate=1.0):
    x, pk = src(name)
    if rate != 1.0:   # pitch by resampling (deterministic)
        idx = np.arange(0, len(x) - 1, rate); x = np.interp(idx, np.arange(len(x)), x); pk = int(pk / rate)
    s.place(x, max(0.0, t - pk / SR), gain, pan, send)


rng = np.random.default_rng(5)
for e in E["events"]:
    t, v, k, pan = e["t"], e["v"], e["kind"], P(e)
    if k == "pop":        hit("drop_002", t, 0.55 * v, pan, 0.25)
    elif k == "chip":     hit("select_002", t, 0.35 * v, pan, 0.2)
    elif k == "split":    hit("maximize_003", t, 0.40 * v, pan, 0.3); s.place(air(0.42, 260, 2400, 1.3, 0.4), t - 0.02, 0.18 * v, pan, 0.45)
    elif k == "card":     hit("drop_001", t + 0.22, 0.28 * v, pan, 0.25, rate=1.12)
    elif k == "tick":     hit("tick_002", t, 0.40 * v, pan, 0.3)
    elif k == "hover":    hit("tick_004", t, 0.30 * v, pan, 0.2)
    elif k == "click":    hit("ui-click3", t, 0.62 * v, pan, 0.15)
    elif k == "fall":     hit("minimize_004", t, 0.32 * v, pan, 0.3)
    elif k == "morph":    hit("maximize_006", t, 0.34 * v, pan, 0.3); s.place(air(0.45, 300, 1800, 1.2, 0.5), t - 0.02, 0.14 * v, pan, 0.45)
    elif k == "key":      hit("ui-click5", t, 0.16 * v * rng.uniform(0.7, 1.2), pan, 0.1, rate=rng.uniform(0.95, 1.1))
    elif k == "whoosh":   s.place(air(0.48, 220, 3000, 1.3, 0.35), t, 0.34 * v, pan, 0.45, pan_to=float(np.clip(pan + 0.35, -0.7, 0.7)))
    elif k == "land":     hit("impactSoft_medium_001", t, 0.42 * v, pan, 0.25)
    elif k == "glass":    hit("glass_002", t, 0.32 * v, pan, 0.45)
    elif k == "tap":      hit("select_001", t, 0.42 * v, pan, 0.2)
    elif k == "flip":     hit("switch_004", t, 0.36 * v, pan, 0.25)
    elif k == "chord":    hit("confirmation_002", t, 0.46 * v, pan, 0.4)
    elif k == "flood":    hit("impactSoft_heavy_002", t + 0.05, 0.55 * v, 0.0, 0.35); s.place(air(0.55, 160, 2600, 1.0, 0.35), t - 0.05, 0.36 * v, 0.0, 0.5)
    elif k == "hit":      hit("impactSoft_heavy_000", t, 0.62 * v, pan, 0.3); hit("impactPlate_light_001", t, 0.22 * v, pan, 0.3)
    elif k == "rise":     s.place(air(1.4, 160, 2400, 1.0, 0.7), t, 0.36 * v, 0.0, 0.6)
    elif k == "bubble":   hit("drop_003", t, 0.26 * v, pan, 0.3, rate=rng.uniform(0.95, 1.25))
    elif k == "collapse": hit("minimize_007", t + 0.3, 0.45 * v, pan, 0.35); s.place(air(0.5, 2400, 300, 1.3, 0.6), t, 0.2 * v, pan, 0.5)
    elif k == "letters":  [hit("click_004", t + i * 0.06, 0.22, -0.2 + i * 0.1, 0.2, rate=1.0 + i * 0.04) for i in range(6) if i != 3]
    elif k == "air":      s.place(air(0.6, 300, 1500, 1.1, 0.6), t, 0.14 * v, 0.0, 0.6)
    elif k == "end":      hit("impactBell_heavy_001", t, 0.20 * v, 0.0, 0.55); s.place(sub(52, 1.2), t, 0.18 * v, 0.0, 0.4)

out = HERE / f"sfx-{CUT}.wav"
raw = HERE / f".sfx-{CUT}-raw.wav"
s.write(str(raw), peak_db=-3.0)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", "loudnorm=I=-16:TP=-4:LRA=11", "-ar", str(SR), str(out)], check=True)
raw.unlink()
print(f"{out.name}: {len(E['events'])} events, {E['T']:.2f} s")
