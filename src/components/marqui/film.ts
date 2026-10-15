/* ——— Film helpers ———
   The intros are drawn as pure functions of time: these are the small
   pieces they are made of. `p` is always a progress from 0 to 1. */

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
/** How far `t` is through the span [a, b], from 0 to 1. */
export const progress = ([a, b]: readonly number[], t: number) => clamp01((t - a!) / (b! - a!));
export const inside = ([a, b]: readonly number[], t: number) => t >= a! && t < b!;
export const easeOut = (p: number) => 1 - (1 - p) ** 3;
export const easeIn = (p: number) => p * p;
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
/** Overshoots a little and settles: for things that pop into place. */
export const easeOutBack = (p: number) => 1 + 2.7 * (p - 1) ** 3 + 1.7 * (p - 1) ** 2;
/** 0 → 1 → 0. */
export const bump = (p: number) => Math.sin(Math.PI * p);
/** A landing that rings out: `amp` of squash `d` seconds after the hit. */
export const ring = (d: number, amp: number) => (d < 0 || d > 1 ? 0 : amp * Math.exp(-9 * d) * Math.cos(22 * d));

/** A value that moves between keyframes [time, value], easing in and out between each pair. */
export function track(keys: readonly (readonly [number, number])[], t: number) {
  if (t <= keys[0]![0]) return keys[0]![1];
  for (let i = 1; i < keys.length; i++) {
    const [b, vb] = keys[i]!;
    if (t < b) {
      const [a, va] = keys[i - 1]!;
      return lerp(va, vb, easeInOut((t - a) / (b - a)));
    }
  }
  return keys[keys.length - 1]![1];
}

/** A pose list [time, pose] read at `t`. */
export function at<P>(list: readonly (readonly [number, P])[], t: number): P {
  let v = list[0]![1];
  for (const [time, pose] of list) if (t >= time) v = pose;
  return v;
}
