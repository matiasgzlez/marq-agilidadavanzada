import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MarquiBadge, type Pose } from "./marqui-character";
import { MarquiMark } from "./marqui-mark";

export const LOGO = "/assets/marq-official.svg";
export const ease = [0.16, 1, 0.3, 1] as const;

/** The black brand mark, rendered white for the sky (or kept black on paper). */
export function MarqLogo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return <img src={LOGO} alt="MARQ" className={cn("h-6 w-auto", !dark && "brightness-0 invert", className)} />;
}

/** MARQui's mark. `light` is the white body with an ink face (for the sky). */
export function Mascot({ className, light = true, alt = "MARQui" }: { className?: string; light?: boolean; alt?: string }) {
  return <MarquiMark tone={light ? "light" : "ink"} className={className} title={alt} />;
}

/** MARQui as a chat avatar: his profile picture, a teal disc with the 3D character. */
export function MarquiAvatar({ className, pose = "reposo" }: { className?: string; pose?: Pose; tone?: string }) {
  return <MarquiBadge pose={pose} className={className} />;
}

/** Section shell: declares its sky and gives anchors room under the header. */
export function Section({ sky, className, children, ...props }: ComponentProps<"section"> & { sky: number }) {
  return (
    <section data-sky={sky} {...props} className={cn("relative px-4 sm:px-8 lg:px-12", className)}>
      {children}
    </section>
  );
}

/** Numbered chapter label that sits above a headline on the sky. */
export function Kicker({ n, children, className }: { n?: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-white", className)}>
      {n && <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white px-2 text-ink">{n}</span>}
      {children}
    </p>
  );
}

export { FadeUp, RiseLines } from "./reveal";

/** A browser window, so every screen reads as "this is the real thing". */
export function BrowserFrame({ url, children, className, badge, dark = false }: { url: string; children: ReactNode; className?: string; badge?: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-[1.25rem] shadow-[0_3rem_7rem_-2rem_rgb(1_30_27/0.6)] ring-1", dark ? "bg-night ring-white/10" : "bg-white ring-black/10", className)}>
      <div className={cn("flex items-center gap-3 px-4 py-2.5", dark ? "border-b border-white/10 bg-[#04221f]" : "border-b border-black/[0.06] bg-[#f4f5f7]")}>
        <span className="flex gap-1.5" aria-hidden>
          <i className="size-3 rounded-full bg-[#ff5f57]" />
          <i className="size-3 rounded-full bg-[#febc2e]" />
          <i className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className={cn("mx-auto flex h-7 w-full max-w-[24rem] items-center justify-center truncate rounded-lg px-3 text-[0.8rem]", dark ? "bg-white/[0.07] text-white/70" : "bg-white text-black/55 ring-1 ring-black/[0.06]")}>{url}</span>
        {badge}
      </div>
      {children}
    </div>
  );
}

/** Small ink note that marks every number on the page as illustrative. */
export function Illustrative({ className, dark = false }: { className?: string; dark?: boolean }) {
  return <span className={cn("eyebrow text-[0.7rem]", dark ? "text-white/55" : "text-ink-3", className)}>Datos ilustrativos</span>;
}
