# Marqui · el globo que viaja

Los videos de la sección «Mirá cómo funciona». Un solo elemento recorre todo el film: el «precio?» de Juan se vuelve las tres sugerencias, el mensaje enviado, el link de Mercado Pago, la unidad 2A reservada, un globo entre las nubes, una barra de MARQador y, al final, la Q de Marqui.

**v2** (actual): rehecha a partir de los prompts detallados de [prompt-motion.com](https://prompt-motion.com), sobre todo «Shape morphing through UI states» y «Photo print app launch film» (@twoclipping), «Food craving launch film» (@ultimaxbt), el film de Taxtello y el de Spotify. De ahí salen la grilla de 120 BPM con algo en cada golpe, la cámara que llena el cuadro con cada estado y acompaña al cursor de texto, el cursor que provoca cada cambio, la inundación de color en lugar de cortes, los bordes con resortes distintos, el texto que sube desde una línea de máscara y los efectos grabados ubicados por su pico. Los prompts son de sus autores: se tomaron como referencia, no se copiaron. `comp-v1.html` es la primera versión.

Hecho con la skill **onetake** (`~/.claude/skills/onetake`). `comp.html` es una composición donde todo es función del tiempo; `motion.js` es su biblioteca de movimientos (licencia PolyForm Noncommercial 1.0.0).

| archivo | qué es |
| --- | --- |
| `comp.html` | la composición. `?cut=film` (16:9, 22,5 s) · `consultas` · `senas` · `marqador` (1:1, en loop) · `?play` · `?t=6.4&hud` |
| `fonts.js` | Bricolage Grotesque, Instrument Serif, Geist y Geist Mono subseteadas e incrustadas (OFL, ver `fonts/`) |
| `score.py` | el sonido: lee `window.__events()` de la composición y ubica efectos grabados por su pico, más aire sintetizado en los movimientos; −16 LUFS |
| `sfx-src/` | efectos de Kenney (Interface Sounds, UI Audio, Impact Sounds), licencia CC0 |
| `build_fonts.py` | regenera `fonts.js` después de cambiar textos |

## Volver a renderizar

Requiere Python con `playwright` (Chromium), `numpy`, `scipy`, `Pillow`, `fonttools`, `brotli` y `ffmpeg`.

```sh
SK=~/.claude/skills/onetake/scripts
python3 build_fonts.py
python3 score.py film
python3 $SK/render.py comp.html --out out/film.mp4 --sfx sfx-film.wav
for c in consultas senas marqador; do
  python3 score.py $c
  python3 $SK/render.py "comp.html?cut=$c" --width 1080 --height 1080 --out out/$c.mp4 --sfx sfx-$c.wav
done
python3 $SK/verify_promo.py out/film.mp4 --comp comp.html
```

Después se recomprimen para la web en `public/videos/` (H.264 CRF 23, `+faststart`) con un póster `.jpg` cada uno.

Datos ilustrativos: los porcentajes, la unidad y los nombres no son reales.
