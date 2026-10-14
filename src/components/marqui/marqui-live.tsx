import { useEffect, useId, useMemo, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import type { Pose } from "./marqui-character";
import { MARQADOR } from "./marqador-mark";
import { MARK } from "./marqui-mark";

/* ——— MARQui, alive ———
   The 3D poses from the brand artwork, rebuilt as one vector character so
   every change is a continuous motion instead of a cut between pictures.
   The body is a soft, shaded white Q (radial light from the top left, a
   darker rim, a specular glint). Each eye is a single round-capped stroke
   with a bendable middle: shortening it closes the eye, bending it makes
   the happy arc, shrinking its length to zero makes the surprised dot, and
   moving it is the glance. Everything travels on springs. */

type Eye = { x: number; y: number; len: number; ang: number; w: number; bend: number };
type Body = { y: number; rot: number; sx: number; sy: number };
type Shape = { eyes: [Eye, Eye]; body: Body };

const rest: [Eye, Eye] = [
  { x: 633, y: 469, len: 56, ang: 55, w: 47, bend: 0 },
  { x: 719, y: 431, len: 60, ang: 53, w: 44, bend: 0 },
];
const still: Body = { y: 0, rot: 0, sx: 1, sy: 1 };

/** Each pose, measured from its reference image and mapped onto the mark. */
const SHAPES: Record<Pose, Shape> = {
  reposo: { eyes: rest, body: still },
  parpadeo: {
    eyes: [
      { x: 636, y: 476, len: 58, ang: 36, w: 14, bend: 0 },
      { x: 721, y: 438, len: 58, ang: 36, w: 14, bend: 0 },
    ],
    body: still,
  },
  guino: {
    eyes: [rest[0], { x: 726, y: 440, len: 62, ang: -10, w: 20, bend: 0 }],
    body: { y: 0, rot: -4, sx: 1, sy: 1 },
  },
  alegria: {
    eyes: [
      { x: 552, y: 494, len: 64, ang: 0, w: 19, bend: -26 },
      { x: 700, y: 494, len: 64, ang: 0, w: 19, bend: -26 },
    ],
    body: { y: -6, rot: 0, sx: 1.02, sy: 0.98 },
  },
  sorpresa: {
    eyes: [
      { x: 562, y: 503, len: 8, ang: 90, w: 54, bend: 0 },
      { x: 682, y: 503, len: 8, ang: 90, w: 54, bend: 0 },
    ],
    body: { y: -10, rot: 0, sx: 0.98, sy: 1.03 },
  },
  pensando: {
    eyes: [
      { x: 622, y: 452, len: 26, ang: 55, w: 32, bend: 0 },
      { x: 709, y: 420, len: 58, ang: 53, w: 40, bend: 0 },
    ],
    body: { y: 0, rot: -6, sx: 1, sy: 1 },
  },
  izquierda: {
    eyes: [
      { x: 540, y: 478, len: 56, ang: 62, w: 42, bend: 0 },
      { x: 606, y: 462, len: 58, ang: 60, w: 40, bend: 0 },
    ],
    body: { y: 0, rot: -3, sx: 1, sy: 1 },
  },
  derecha: {
    eyes: [
      { x: 660, y: 480, len: 56, ang: 50, w: 42, bend: 0 },
      { x: 744, y: 452, len: 58, ang: 48, w: 40, bend: 0 },
    ],
    body: { y: 0, rot: 3, sx: 1, sy: 1 },
  },
  inclinado: {
    eyes: [
      { x: 618, y: 462, len: 56, ang: 55, w: 42, bend: 0 },
      { x: 699, y: 421, len: 58, ang: 53, w: 40, bend: 0 },
    ],
    body: { y: 0, rot: -10, sx: 1, sy: 1 },
  },
  salto: { eyes: rest, body: { y: -70, rot: 0, sx: 0.95, sy: 1.06 } },
};

const EYE_KEYS = ["x", "y", "len", "ang", "w", "bend"] as const;
const BODY_KEYS = ["y", "rot", "sx", "sy"] as const;

/** A quadratic stroke through the eye's centre; `bend` pushes its middle sideways. */
function eyePath([x, y, len, ang]: number[], bend: number) {
  const a = (ang * Math.PI) / 180;
  const dx = (Math.cos(a) * len) / 2;
  const dy = (Math.sin(a) * len) / 2;
  const cx = x - Math.sin(a) * bend * 2;
  const cy = y + Math.cos(a) * bend * 2;
  return `M${x - dx} ${y - dy} Q${cx} ${cy} ${x + dx} ${y + dy}`;
}

function useEye(eye: Eye) {
  const mv = {
    x: useMotionValue(eye.x),
    y: useMotionValue(eye.y),
    len: useMotionValue(eye.len),
    ang: useMotionValue(eye.ang),
    w: useMotionValue(eye.w),
    bend: useMotionValue(eye.bend),
  };
  const d = useTransform([mv.x, mv.y, mv.len, mv.ang, mv.bend] as MotionValue<number>[], (v: number[]) => eyePath(v, v[4]!));
  return { mv, d };
}

/* MARQador wears the same face in his own body: the Marqui-space eyes are
   mapped onto his head and drawn a little smaller, as in his logo. */
const K = MARQADOR.head.r / MARK.head.r;
const FACE_TO_MARQADOR = `translate(${MARQADOR.head.cx + 15 - MARK.head.cx * K} ${MARQADOR.head.cy + 7 - MARK.head.cy * K}) scale(${K})`;
const EYE_SCALE = { marqui: 1, marqador: 0.8 };

export type Who = "marqui" | "marqador";

export function MarquiLive({ pose, className, shadow = true, follow = false, who = "marqui", title, svgProps }: { pose: Pose; className?: string; shadow?: boolean; follow?: boolean; who?: Who; title?: string; svgProps?: React.SVGProps<SVGSVGElement> }) {
  const isM = who === "marqador";
  const label = title ?? (isM ? "MARQador" : "MARQui");
  const svgRef = useRef<SVGSVGElement>(null);
  // Eyes follow the pointer: a small, springy offset toward wherever it is.
  const lookX = useSpring(0, { stiffness: 120, damping: 14 });
  const lookY = useSpring(0, { stiffness: 120, damping: 14 });
  // The whole body leans toward the pointer too, so the gaze reads even when he is tiny.
  const leanX = useSpring(0, { stiffness: 90, damping: 14 });
  const leanY = useSpring(0, { stiffness: 90, damping: 14 });
  const leanR = useSpring(0, { stiffness: 90, damping: 14 });
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const e0 = useEye(SHAPES.reposo.eyes[0]);
  const e1 = useEye(SHAPES.reposo.eyes[1]);
  const body = { y: useMotionValue(0), rot: useMotionValue(0), sx: useMotionValue(1), sy: useMotionValue(1) };
  const shadowScale = useTransform(body.y, [isM ? -180 : -90, 0], [0.55, 1]);
  const shadowOpacity = useTransform(body.y, [isM ? -180 : -90, 0], [0.35, 1]);

  useEffect(() => {
    const target = SHAPES[pose];
    // Blinks snap shut; everything else moves on a soft spring.
    const blink = pose === "parpadeo";
    const t = reduce ? { duration: 0 } : blink ? { duration: 0.07, ease: "easeIn" as const } : { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.8 };
    const controls = [
      ...[e0, e1].flatMap((e, i) => EYE_KEYS.map((k) => animate(e.mv[k], (k === "len" || k === "w" ? EYE_SCALE[who] : 1) * target.eyes[i]![k], t))),
      ...BODY_KEYS.map((k) => animate(body[k], (k === "y" && isM ? K : 1) * target.body[k], reduce ? { duration: 0 } : { type: "spring", stiffness: pose === "salto" ? 180 : 220, damping: pose === "salto" ? 12 : 16 })),
    ];
    // Landing from a jump: a quick squash, then back to round.
    if (pose !== "salto" && !reduce && body.y.get() < -30 * (isM ? K : 1)) {
      const t2 = window.setTimeout(() => {
        animate(body.sy, [0.9, 1.04, 1], { duration: 0.45, ease: "easeOut" });
        animate(body.sx, [1.08, 0.98, 1], { duration: 0.45, ease: "easeOut" });
      }, 260);
      return () => {
        clearTimeout(t2);
        controls.forEach((c) => c.stop());
      };
    }
    return () => controls.forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose, reduce]);

  useEffect(() => {
    if (!follow || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width * 0.5);
      const dy = e.clientY - (r.top + r.height * 0.42);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, dist / 260);
      const nx = (dx / dist) * reach;
      const ny = (dy / dist) * reach;
      // At rest the eyes sit up and to the right, so the gaze first recentres them on the face,
      // then sends them far toward the pointer (the head radius is ≈ 195 in face space).
      const cx = -38 * reach;
      const cy = 50 * reach;
      lookX.set(cx + nx * 62);
      lookY.set(cy + ny * 52);
      leanX.set(nx * 26);
      leanY.set(ny * 16);
      leanR.set(nx * 14);
      // (in face space; MARQador's face group scales it up with him)
    };
    const reset = () => {
      lookX.set(0);
      lookY.set(0);
      leanX.set(0);
      leanY.set(0);
      leanR.set(0);
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
    };
  }, [follow, reduce, lookX, lookY, leanX, leanY, leanR]);

  const { head, tail } = MARK;
  const g = useMemo(() => ({ body: `b${id}`, rim: `r${id}`, eye: `e${id}`, glint: `s${id}`, soft: `f${id}`, mbody: `mb${id}`, mrim: `mr${id}` }), [id]);

  return (
    <svg ref={svgRef} viewBox={isM ? "170 150 960 1060" : "380 240 470 590"} className={cn("overflow-visible", className)} role="img" aria-label={label} {...svgProps}>
      <defs>
        {/* Soft white, lit from the top left. */}
        <radialGradient id={g.body} cx="560" cy="430" r="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f7f9f9" />
          <stop offset="0.78" stopColor="#eaeeed" />
          <stop offset="1" stopColor="#dde4e2" />
        </radialGradient>
        {/* A teal-tinted rim, darker away from the light. */}
        <radialGradient id={g.rim} cx="600" cy="490" r="215" gradientUnits="userSpaceOnUse">
          <stop offset="0.8" stopColor="#014645" stopOpacity="0" />
          <stop offset="1" stopColor="#014645" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={g.eye} x1="540" y1="390" x2="700" y2="540" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={isM ? "#ffffff" : "#0d7c71"} />
          <stop offset="1" stopColor={isM ? "#fff4ea" : "#03433d"} />
        </linearGradient>
        {/* MARQador: the brand's orange, lit from the top left, warmer and lighter toward the tail. */}
        <linearGradient id={g.mbody} x1="300" y1="250" x2="1000" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff4000" />
          <stop offset="0.38" stopColor="#ff6c0c" />
          <stop offset="0.7" stopColor="#fda25a" />
          <stop offset="1" stopColor="#fdc08e" />
        </linearGradient>
        <radialGradient id={g.mrim} cx="640" cy="640" r="420" gradientUnits="userSpaceOnUse">
          <stop offset="0.82" stopColor="#7a2a00" stopOpacity="0" />
          <stop offset="1" stopColor="#7a2a00" stopOpacity="0.22" />
        </radialGradient>
        <filter id={g.glint} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={g.soft} x="-50%" y="-200%" width="200%" height="500%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {shadow && (
        <motion.ellipse cx={isM ? 640 : 610} cy={isM ? 1105 : 760} rx={isM ? 300 : 150} ry={isM ? 38 : 20} fill={isM ? "#3a1400" : "#012a27"} opacity={0.28} filter={`url(#${g.soft})`} style={{ scale: shadowScale, opacity: shadowOpacity, transformBox: "fill-box", transformOrigin: "50% 50%" }} />
      )}

      {/* The body squashes and stretches from the ground up. */}
      {/* Breathing: a slow, barely-there swell. */}
      <motion.g animate={reduce ? undefined : { scaleY: [1, 1.018, 1], scaleX: [1, 0.992, 1] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}>
      <motion.g style={{ x: leanX, y: leanY, rotate: leanR, transformBox: "fill-box", transformOrigin: "50% 60%" }}>
      <motion.g style={{ y: body.y, rotate: body.rot, scaleX: body.sx, scaleY: body.sy, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        {isM ? (
          <g>
            <path d={MARQADOR.body} fill={`url(#${g.mbody})`} />
            <path d={MARQADOR.body} fill={`url(#${g.mrim})`} />
            <ellipse cx="430" cy="400" rx="130" ry="70" fill="#fff" opacity="0.35" transform="rotate(-36 430 400)" filter={`url(#${g.glint})`} />
          </g>
        ) : (
          <g>
            <line {...tail} stroke={`url(#${g.body})`} strokeWidth={tail.width} strokeLinecap="round" />
            <circle {...head} fill={`url(#${g.body})`} />
            <circle {...head} fill={`url(#${g.rim})`} />
            <ellipse cx="540" cy="405" rx="72" ry="42" fill="#fff" opacity="0.9" transform="rotate(-32 540 405)" filter={`url(#${g.glint})`} />
          </g>
        )}

        {/* Eyes: a faint edge under each one makes it read as carved in (light under teal eyes, warm under white ones). */}
        <g transform={isM ? FACE_TO_MARQADOR : undefined}>
        <motion.g style={{ x: lookX, y: lookY }}>
        {[e0, e1].map((e, i) => (
          <g key={i}>
            <motion.path d={e.d} fill="none" stroke={isM ? "#b23d00" : "#ffffff"} strokeOpacity={isM ? 0.35 : 0.9} strokeLinecap="round" style={{ strokeWidth: e.mv.w, x: 2.5, y: 3.5 }} />
            <motion.path d={e.d} fill="none" stroke={`url(#${g.eye})`} strokeLinecap="round" style={{ strokeWidth: e.mv.w }} />
          </g>
        ))}
        </motion.g>
        </g>
      </motion.g>
      </motion.g>
      </motion.g>
    </svg>
  );
}
