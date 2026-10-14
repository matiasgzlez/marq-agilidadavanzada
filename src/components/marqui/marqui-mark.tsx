import { useId } from "react";
import { cn } from "@/lib/utils";

/* ——— MARQui, final mark ———
   A white Q: a round head with a short, rounded stick for a tail, and two
   slanted eyes cut out of it, looking up and to the right. Rebuilt from the
   brand artwork, measured in its own pixel space. Brand colours: teal for
   MARQui, orange as the warm accent. */

export const BRAND = {
  teal: "#008c7e",
  tealDeep: "#014645",
  tealBright: "#00a390",
  orange: "#e96f2d",
  orangeDeep: "#b45521",
  peach: "#f5cdad",
};

export const MARK = {
  viewBox: "400 318 430 430",
  head: { cx: 622.6, cy: 525.2, r: 194.6 },
  // The tail is a capsule leaving the head at ~49°.
  tail: { x1: 720.9, y1: 637, x2: 774.6, y2: 698.4, width: 77 },
  eyes: [
    { cx: 633, cy: 469, length: 100, width: 44, angle: 55 },
    { cx: 719, cy: 431, length: 100, width: 40, angle: 53 },
  ],
};

const tones = {
  /** White body, eyes cut out (they show whatever is behind). */
  light: { body: "#ffffff", tile: undefined },
  teal: { body: BRAND.teal, tile: undefined },
  ink: { body: "#06231f", tile: undefined },
  /** The app icon: white Q on a teal tile. */
  icon: { body: "#ffffff", tile: BRAND.teal },
} as const;

export type MarquiTone = keyof typeof tones;

export function EyeShape({ eye, ...props }: { eye: (typeof MARK.eyes)[number] } & React.SVGProps<SVGRectElement>) {
  return (
    <g transform={`rotate(${eye.angle} ${eye.cx} ${eye.cy})`}>
      <rect x={eye.cx - eye.length / 2} y={eye.cy - eye.width / 2} width={eye.length} height={eye.width} rx={eye.width / 2} {...props} />
    </g>
  );
}

export function MarquiMark({ className, tone = "light", title = "MARQui" }: { className?: string; tone?: MarquiTone; title?: string }) {
  const id = useId().replace(/:/g, "");
  const t = tones[tone];
  const { head, tail } = MARK;
  return (
    <svg viewBox={MARK.viewBox} className={cn("shrink-0", className)} role="img" aria-label={title}>
      <defs>
        <mask id={`eyes${id}`} maskUnits="userSpaceOnUse" x="400" y="318" width="430" height="430">
          <rect x="400" y="318" width="430" height="430" fill="#fff" />
          {MARK.eyes.map((e, i) => (
            <EyeShape key={i} eye={e} fill="#000" />
          ))}
        </mask>
      </defs>
      {t.tile && <rect x="400" y="318" width="430" height="430" rx="108" fill={t.tile} />}
      <g mask={`url(#eyes${id})`} fill={t.body}>
        <circle {...head} />
        <line {...tail} stroke={t.body} strokeWidth={tail.width} strokeLinecap="round" />
      </g>
    </svg>
  );
}
