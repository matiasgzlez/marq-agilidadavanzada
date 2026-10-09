import {
  ShaderMount,
  grainGradientFragmentShader,
  GrainGradientShapes,
  getShaderColorFromString,
  getShaderNoiseTexture,
} from "@paper-design/shaders";

// Same shader family and "corners" composition as the NLASmith reference.
// Native JS API: the rest of the presentation does not need a React migration.
const host = document.querySelector(".hero-shader");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let shader;
let mounting = false;
let disposed = false;
async function mountBackground() {
  if (reduceMotion.matches || shader || !host || mounting || disposed) return;
  mounting = true;
  try {
    const noise = getShaderNoiseTexture();
    if (noise) await noise.decode();
    if (reduceMotion.matches || disposed) return;
    const colors = ["#a77b53", "#cbb79a", "#eee5d1"].map(
      getShaderColorFromString,
    );
    shader = new ShaderMount(
      host,
      grainGradientFragmentShader,
      {
        u_colorBack: getShaderColorFromString("#242622"),
        u_colors: colors,
        u_colorsCount: colors.length,
        u_softness: 0.85,
        u_intensity: 0.72,
        u_noise: 0.12,
        u_shape: GrainGradientShapes.corners,
        u_noiseTexture: noise,
        u_fit: 2,
        u_scale: 1,
        u_rotation: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_offsetX: 0,
        u_offsetY: 0,
        u_worldWidth: 0,
        u_worldHeight: 0,
      },
      { alpha: false, antialias: false },
      0.8,
      7000,
      1,
      1500000,
    );
    host.classList.add("ready");
    host.querySelector("canvas")?.addEventListener("webglcontextlost", () => {
      host.classList.remove("ready");
    });
  } catch (error) {
    // The CSS gradient remains visible if WebGL is unavailable.
    shader?.dispose();
    shader = undefined;
    host.classList.remove("ready");
    host.replaceChildren();
    console.warn("MARQ Alloy: usando el fondo CSS de respaldo.", error);
  } finally {
    mounting = false;
  }
}
function updateMotion() {
  if (reduceMotion.matches) {
    shader?.dispose();
    shader = undefined;
    host.classList.remove("ready");
  } else mountBackground();
}
mountBackground();
reduceMotion.addEventListener("change", updateMotion);
// ShaderMount automatically pauses when offscreen or the document is hidden.
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    disposed = true;
    shader?.dispose();
    reduceMotion.removeEventListener("change", updateMotion);
  });
