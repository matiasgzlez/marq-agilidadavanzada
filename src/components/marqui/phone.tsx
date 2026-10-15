import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Camera, ChevronLeft, CheckCheck, FileSpreadsheet, FileText, Forward, Mic, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiAvatar } from "./primitives";

export type PhoneMsg =
  | { kind: "in"; text: ReactNode; time?: string }
  | { kind: "out"; text: ReactNode; time?: string; forwarded?: boolean }
  | { kind: "file"; name: string; meta: string; type?: "xlsx" | "pdf"; time?: string; from?: "in" | "out" }
  | { kind: "day"; text: string };

/* iOS status bar glyphs: signal, wifi and battery, drawn like the real ones. */
function StatusIcons() {
  return (
    <span className="flex items-center gap-[0.32rem]" aria-hidden>
      <svg viewBox="0 0 18 12" className="h-[0.7rem] w-auto fill-current">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
        <rect x="10" y="3" width="3" height="9" rx="0.8" />
        <rect x="15" y="0" width="3" height="12" rx="0.8" />
      </svg>
      <svg viewBox="0 0 16 12" className="h-[0.7rem] w-auto fill-current">
        <path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.6 10.6 0 0 0 8 .4 10.6 10.6 0 0 0 .5 3.4l1.2 1.3A9 9 0 0 1 8 2.2zm0 3.6c1.4 0 2.8.5 3.8 1.5l1.3-1.3A7.2 7.2 0 0 0 8 4a7.2 7.2 0 0 0-5.1 2l1.3 1.3c1-1 2.4-1.5 3.8-1.5zM8 9.4c-.6 0-1.2.2-1.6.6L8 11.7 9.6 10c-.4-.4-1-.6-1.6-.6z" />
      </svg>
      <svg viewBox="0 0 27 13" className="h-[0.78rem] w-auto">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="2.2" y="2.2" width="17" height="8.6" rx="2.2" fill="currentColor" />
        <path d="M25 4.4v4.2c.9-.3 1.5-1.1 1.5-2.1s-.6-1.8-1.5-2.1z" fill="currentColor" fillOpacity="0.45" />
      </svg>
    </span>
  );
}

/**
 * An iPhone 17 Pro Max (silver), true to its proportions (78 × 163.4 mm), with WhatsApp open on
 * the MARQui contact. `children` is the chat; `overlay` sits above everything (menus, toasts).
 */
export function PhoneFrame({ children, className, title = "MARQui", subtitle = "Asistente de MARQ", overlay }: { children: ReactNode; className?: string; title?: string; subtitle?: ReactNode; overlay?: ReactNode }) {
  return (
    // Never taller than the screen (minus room for the header): the width follows the height.
    <div className={cn("relative mx-auto w-full max-w-[min(21rem,calc((100svh-11rem)*0.477))]", className)}>
      {/* Side buttons: action and volume on the left, side button and camera control on the right. */}
      <i className="absolute -left-[0.2rem] top-[17%] h-[5%] w-[0.32rem] rounded-l-md bg-[linear-gradient(90deg,#9ea4ab,#e4e7ea)]" aria-hidden />
      <i className="absolute -left-[0.2rem] top-[25%] h-[8.5%] w-[0.32rem] rounded-l-md bg-[linear-gradient(90deg,#9ea4ab,#e4e7ea)]" aria-hidden />
      <i className="absolute -left-[0.2rem] top-[35.5%] h-[8.5%] w-[0.32rem] rounded-l-md bg-[linear-gradient(90deg,#9ea4ab,#e4e7ea)]" aria-hidden />
      <i className="absolute -right-[0.2rem] top-[27%] h-[12%] w-[0.32rem] rounded-r-md bg-[linear-gradient(270deg,#9ea4ab,#e4e7ea)]" aria-hidden />
      <i className="absolute -right-[0.16rem] top-[58%] h-[7%] w-[0.26rem] rounded-r-sm bg-[linear-gradient(270deg,#7d838a,#c9cdd1)]" aria-hidden />

      {/* The aluminium band, then a thin black border around the glass. */}
      <div className="relative aspect-[78/163.4] rounded-[17%/8.1%] bg-[linear-gradient(145deg,#f4f5f6_0%,#c3c8cd_22%,#eef0f2_48%,#aeb4ba_78%,#e9ebed_100%)] p-[0.28rem] shadow-[0_3rem_6rem_-1.5rem_rgb(1_30_27/0.65),inset_0_0_0_1px_rgb(255_255_255/0.7),inset_0_0_0_2px_rgb(0_0_0/0.08)]">
        <div className="size-full rounded-[15.6%/7.45%] bg-[#0a0b0d] p-[0.42rem]">
          <div className="relative flex size-full flex-col overflow-hidden rounded-[13.6%/6.5%] bg-wa-paper text-[#111b21]">
            {/* Status bar around the Dynamic Island. */}
            <div className="relative flex h-[3.1rem] shrink-0 items-center justify-between bg-[#f7f7f7] px-[9%] pt-1 text-[0.86rem] font-semibold tracking-tight">
              <span>9:41</span>
              <span className="absolute left-1/2 top-[0.6rem] h-[1.75rem] w-[32%] -translate-x-1/2 rounded-full bg-black" aria-hidden />
              <StatusIcons />
            </div>
            <header className="flex shrink-0 items-center gap-2.5 border-b border-black/[0.06] bg-[#f7f7f7] px-3 pb-2">
              <ChevronLeft className="size-6 text-[#0a84ff]" aria-hidden />
              <MarquiAvatar className="size-9" />
              <span className="leading-tight">
                <b className="block text-[0.98rem]">{title}</b>
                <span className="text-[0.75rem] text-black/50">{subtitle}</span>
              </span>
            </header>
            {children}
            <div className="flex shrink-0 items-center gap-2 bg-[#f7f7f7] px-3 pb-7 pt-2">
              <Plus className="size-6 text-[#0a84ff]" aria-hidden />
              <span className="h-9 flex-1 rounded-full bg-white ring-1 ring-black/10" />
              <Camera className="size-5 text-[#0a84ff]" aria-hidden />
              <Mic className="size-5 text-[#0a84ff]" aria-hidden />
            </div>
            {/* Home indicator. */}
            <i className="absolute bottom-[0.45rem] left-1/2 h-[0.3rem] w-[36%] -translate-x-1/2 rounded-full bg-black/85" aria-hidden />
            {overlay}
          </div>
        </div>
      </div>
    </div>
  );
}

/** An iPhone-sized WhatsApp chat with the MARQui contact. */
export function Phone({ messages, className, title = "MARQui", subtitle = "Asistente de MARQ", stagger = 0.5, play = true }: { messages: PhoneMsg[]; className?: string; title?: string; subtitle?: string; stagger?: number; play?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <PhoneFrame className={className} title={title} subtitle={subtitle}>
      <div className="wa-paper flex flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 py-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={reduce || !play ? false : { opacity: 0, y: 14, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.45, delay: 0.2 + i * stagger, ease: [0.16, 1, 0.3, 1] }}
            className={cn("flex", (m.kind === "out" || (m.kind === "file" && m.from === "out")) && "justify-end", m.kind === "day" && "justify-center")}
          >
            <PhoneBubble m={m} />
          </motion.div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function PhoneBubble({ m }: { m: PhoneMsg }) {
  if (m.kind === "day") return <span className="rounded-lg bg-white/90 px-3 py-1 text-[0.72rem] font-medium text-black/55 shadow-sm">{m.text}</span>;
  if (m.kind === "file") {
    const Icon = m.type === "pdf" ? FileText : FileSpreadsheet;
    return (
      <div className={cn("w-[85%] rounded-[0.7rem] p-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]", m.from === "out" ? "rounded-tr-none bg-wa-bubble" : "rounded-tl-none bg-white")}>
        <div className="flex items-center gap-2.5 rounded-lg bg-black/[0.04] p-2.5">
          <span className={cn("grid size-10 place-items-center rounded-md text-white", m.type === "pdf" ? "bg-[#e5484d]" : "bg-[#1d8f4e]")}>
            <Icon className="size-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <b className="block truncate text-[0.85rem] font-semibold">{m.name}</b>
            <span className="text-[0.72rem] text-black/50">{m.meta}</span>
          </span>
        </div>
        {m.time && <span className="block px-1 pt-0.5 text-right text-[0.65rem] text-black/45">{m.time}</span>}
      </div>
    );
  }
  const out = m.kind === "out";
  return (
    <div className={cn("max-w-[86%] rounded-[0.7rem] px-2.5 py-1.5 text-[0.88rem] leading-[1.38] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]", out ? "rounded-tr-none bg-wa-bubble" : "rounded-tl-none bg-white")}>
      {out && m.forwarded && (
        <span className="mb-0.5 flex items-center gap-1 text-[0.72rem] italic text-black/45">
          <Forward className="size-3.5" /> Reenviado
        </span>
      )}
      <div>{m.text}</div>
      <span className="mt-0.5 flex items-center justify-end gap-0.5 text-[0.65rem] text-black/45">
        {m.time ?? "9:00"} {out && <CheckCheck className="size-3.5 text-[#53bdeb]" />}
      </span>
    </div>
  );
}
