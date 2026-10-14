import { useEffect, useRef } from "react";
import { isMotionValue, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Procedural sky: drifting, domain-warped clouds lit from the sun, over a
 * gradient that can travel through the day. `timeOfDay` goes 0 → 3:
 * noon, dusk, night and dawn. Pass a MotionValue to drive it from scroll
 * without re-rendering React.
 */
export interface CloudShaderProps {
  className?: string;
  timeOfDay?: number | MotionValue<number>;
  /** Drift speed multiplier. */
  speed?: number;
  /** 0 = clear sky, 1 = overcast. */
  cover?: number;
}

type RGB = [number, number, number];
interface Palette {
  top: RGB;
  bottom: RGB;
  cloud: RGB;
  shade: RGB;
  sun: RGB;
  sunPos: [number, number];
  night: number;
}

const hex = (value: string): RGB => {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const palettes: Palette[] = [
  // Noon — Marqui's teal.
  { top: hex("#0b6f66"), bottom: hex("#8fd8cb"), cloud: hex("#ffffff"), shade: hex("#86c3b8"), sun: hex("#fff3e4"), sunPos: [0.82, 1.08], night: 0 },
  // Dusk — MARQador's orange: deep at the top, peach below.
  { top: hex("#a94c1c"), bottom: hex("#f4c9a7"), cloud: hex("#ffe4d1"), shade: hex("#d9814e"), sun: hex("#ffb27a"), sunPos: [0.7, 0.18], night: 0 },
  // Night — deep teal, where MARQador lives.
  { top: hex("#010d0c"), bottom: hex("#05302c"), cloud: hex("#0f4a43"), shade: hex("#031a18"), sun: hex("#5fe0c8"), sunPos: [0.78, 0.9], night: 1 },
  // Dawn — teal into peach.
  { top: hex("#0d6a61"), bottom: hex("#f3c29e"), cloud: hex("#fff0e6"), shade: hex("#d8a283"), sun: hex("#ffc48f"), sunPos: [0.2, 0.12], night: 0 },
];

function paletteAt(t: number): Palette {
  const clamped = Math.min(Math.max(t, 0), palettes.length - 1);
  const i = Math.min(Math.floor(clamped), palettes.length - 2);
  const f = clamped - i;
  const k = f * f * (3 - 2 * f);
  const a = palettes[i]!;
  const b = palettes[i + 1]!;
  const mix3 = (x: RGB, y: RGB): RGB => [x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k];
  return {
    top: mix3(a.top, b.top),
    bottom: mix3(a.bottom, b.bottom),
    cloud: mix3(a.cloud, b.cloud),
    shade: mix3(a.shade, b.shade),
    sun: mix3(a.sun, b.sun),
    sunPos: [a.sunPos[0] + (b.sunPos[0] - a.sunPos[0]) * k, a.sunPos[1] + (b.sunPos[1] - a.sunPos[1]) * k],
    night: a.night + (b.night - a.night) * k,
  };
}

const vertex = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const fragment = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCover;
uniform vec3 uTop, uBottom, uCloud, uShade, uSun;
uniform vec2 uSunPos;
uniform float uNight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
float clouds(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.03)), fbm(p + vec2(5.2, 1.3) - t * 0.02));
  return fbm(p + 1.7 * q + vec2(t * 0.04, 0.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 sp = vec2(uv.x * aspect, uv.y);

  vec3 sky = mix(uBottom, uTop, pow(uv.y, 0.85));
  float sunD = distance(sp, vec2(uSunPos.x * aspect, uSunPos.y));
  sky += uSun * (exp(-sunD * 3.2) * 0.38 + exp(-sunD * 14.0) * 0.22);

  // Stars, only at night, gently twinkling.
  vec2 grid = gl_FragCoord.xy / 9.0;
  vec2 cell = floor(grid);
  vec2 offset = vec2(hash(cell + 1.3), hash(cell + 7.7)) * 0.6 + 0.2;
  float pointStar = smoothstep(0.16, 0.0, length(fract(grid) - offset));
  float star = step(0.93, hash(cell)) * pointStar * (0.6 + 0.4 * sin(uTime * 1.7 + hash(cell + 3.1) * 40.0));
  sky += vec3(star) * uNight * smoothstep(0.15, 0.7, uv.y);

  float t = uTime;
  vec2 p = sp * 2.1 + vec2(t * 0.018, 0.0);
  float c = clouds(p, t);
  // Banks gather low and to the sides, leaving the centre open for type.
  float mask = 0.55 + 0.6 * (1.0 - smoothstep(0.0, 0.75, uv.y)) + 0.35 * abs(uv.x - 0.5);
  float lo = mix(0.62, 0.38, uCover);
  float density = smoothstep(lo, lo + 0.2, c * mask);

  vec2 toSun = normalize(vec2(uSunPos.x * aspect, uSunPos.y) - sp);
  float lit = clamp(0.62 + (c - clouds(p + toSun * 0.07, t)) * 4.0, 0.0, 1.0);
  lit = mix(lit, 1.0, smoothstep(0.75, 1.0, density) * 0.25);
  vec3 cloud = mix(uShade, uCloud, lit);
  cloud += uSun * pow(1.0 - density, 3.0) * 0.18;

  // A wispy high layer for parallax.
  float wisp = smoothstep(0.52, 0.86, fbm(sp * vec2(1.2, 4.0) + vec2(t * 0.05, 0.0))) * 0.35;

  vec3 col = mix(sky, cloud, density);
  col = mix(col, uCloud, wisp * (1.0 - density) * (1.0 - uNight * 0.6));
  col += (hash(gl_FragCoord.xy + fract(t)) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "shader");
  return shader;
}

export function CloudShader({ className, timeOfDay = 0, speed = 1, cover = 0.5 }: CloudShaderProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const time = useRef(timeOfDay);
  time.current = timeOfDay;

  useEffect(() => {
    const el = canvas.current!;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl || gl.isContextLost()) return;
    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      gl.useProgram(program);
    } catch (error) {
      console.warn("CloudShader: usando el degradado de respaldo.", error);
      return;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    const loc = {
      res: u("uRes"), time: u("uTime"), cover: u("uCover"), top: u("uTop"), bottom: u("uBottom"),
      cloud: u("uCloud"), shade: u("uShade"), sun: u("uSun"), sunPos: u("uSunPos"), night: u("uNight"),
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Clouds are soft: rendering under native resolution keeps the GPU cool.
    const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;
    const resize = () => {
      const { width, height } = host.current!.getBoundingClientRect();
      el.width = Math.max(1, Math.round(width * scale));
      el.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, el.width, el.height);
      draw(last);
    };

    let last = 0;
    let lastPhase = -1;
    function draw(seconds: number) {
      const source = time.current;
      const phase = isMotionValue(source) ? source.get() : source;
      const pal = paletteAt(phase);
      gl!.uniform2f(loc.res, el.width, el.height);
      gl!.uniform1f(loc.time, seconds * speed + 40);
      gl!.uniform1f(loc.cover, cover);
      gl!.uniform3fv(loc.top, pal.top);
      gl!.uniform3fv(loc.bottom, pal.bottom);
      gl!.uniform3fv(loc.cloud, pal.cloud);
      gl!.uniform3fv(loc.shade, pal.shade);
      gl!.uniform3fv(loc.sun, pal.sun);
      gl!.uniform2fv(loc.sunPos, pal.sunPos);
      gl!.uniform1f(loc.night, pal.night);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      lastPhase = phase;
    }

    let frame = 0;
    let visible = true;
    const start = performance.now();
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (reduce.matches) {
        // Still sky: redraw only when the time of day moves.
        const source = time.current;
        const phase = isMotionValue(source) ? source.get() : source;
        if (Math.abs(phase - lastPhase) > 0.001) draw(last);
        return;
      }
      last = (now - start) / 1000;
      draw(last);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host.current!);
    const io = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting));
    io.observe(host.current!);
    resize();
    host.current!.dataset.ready = "true";
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      // No loseContext(): StrictMode remounts on the same canvas.
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [speed, cover]);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(180deg,#3d70c4,#a9cdf3)]",
        "[&>canvas]:opacity-0 data-[ready=true]:[&>canvas]:opacity-100 [&>canvas]:transition-opacity [&>canvas]:duration-700",
        className,
      )}
    >
      <canvas ref={canvas} className="absolute inset-0 size-full" />
    </div>
  );
}

export default CloudShader;
