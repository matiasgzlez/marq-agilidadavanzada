import { useId } from "react";
import { cn } from "@/lib/utils";

/* ——— MARQador ———
   MARQui's little brother: a solid Q with MARQ's own tail (it runs flat to
   the right, like the Q in "marq"), the same slanted eyes as MARQui, in
   white, and the brand's orange gradient. Measured on the brand artwork in
   its 1254 × 1254 pixel space. */

export const MARQADOR_GRADIENT = ["#ff4000", "#ff6c0c", "#fda25a", "#fdc08e"] as const;

export const MARQADOR = {
  viewBox: "200 190 900 900",
  // A perfect circle plus MARQ's flat tail, built from clean curves.
  body: "M938.0 843.7C975 873 1025 906 1079 906L1079 1006C1010 1006 905 986 835 936L765.0 983.3A391.25 391.25 0 1 1 938.0 843.7Z",
  head: { cx: 616, cy: 621.5, r: 391.25 },
  eyes: [
    { cx: 662.4, cy: 506.9, length: 168, width: 74, angle: 56.2 },
    { cx: 816, cy: 445.9, length: 168, width: 74, angle: 56.3 },
  ],
};

export function MarqadorGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="300" y1="250" x2="1000" y2="1000" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor={MARQADOR_GRADIENT[0]} />
      <stop offset="0.38" stopColor={MARQADOR_GRADIENT[1]} />
      <stop offset="0.7" stopColor={MARQADOR_GRADIENT[2]} />
      <stop offset="1" stopColor={MARQADOR_GRADIENT[3]} />
    </linearGradient>
  );
}

/** One eye: a capsule drawn as a round-capped line, so it can blink and look. */
export function MarqadorEye({ eye, ...props }: { eye: (typeof MARQADOR.eyes)[number] } & React.SVGProps<SVGLineElement>) {
  const r = (eye.angle * Math.PI) / 180;
  const h = (eye.length - eye.width) / 2;
  return <line x1={eye.cx - Math.cos(r) * h} y1={eye.cy - Math.sin(r) * h} x2={eye.cx + Math.cos(r) * h} y2={eye.cy + Math.sin(r) * h} stroke="#fff" strokeWidth={eye.width} strokeLinecap="round" {...props} />;
}

export function MarqadorMark({ className, title = "MARQador", mono }: { className?: string; title?: string; mono?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={MARQADOR.viewBox} className={cn("shrink-0", className)} role="img" aria-label={title}>
      <defs>
        <MarqadorGradient id={`g${id}`} />
      </defs>
      <path d={MARQADOR.body} fill={mono ?? `url(#g${id})`} />
      {MARQADOR.eyes.map((e, i) => (
        <MarqadorEye key={i} eye={e} stroke={mono ? "#fff" : "#fff"} />
      ))}
    </svg>
  );
}
