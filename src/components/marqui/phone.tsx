import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, CheckCheck, FileSpreadsheet, FileText, Forward, Mic, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarquiAvatar } from "./primitives";

export type PhoneMsg =
  | { kind: "in"; text: ReactNode; time?: string }
  | { kind: "out"; text: ReactNode; time?: string; forwarded?: boolean }
  | { kind: "file"; name: string; meta: string; type?: "xlsx" | "pdf"; time?: string; from?: "in" | "out" }
  | { kind: "day"; text: string };

/** An iPhone-sized WhatsApp chat with the MARQui contact. */
export function Phone({ messages, className, title = "MARQui", subtitle = "Asistente de MARQ", stagger = 0.5, play = true }: { messages: PhoneMsg[]; className?: string; title?: string; subtitle?: string; stagger?: number; play?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("mx-auto w-full max-w-[23rem] rounded-[3rem] bg-[#0d0f14] p-2.5 shadow-[0_3rem_6rem_-1.5rem_rgb(1_30_27/0.65)] ring-1 ring-white/15", className)}>
      <div className="relative flex h-[min(38rem,74svh)] min-h-[30rem] flex-col overflow-hidden rounded-[2.4rem] bg-wa-paper text-[#111b21]">
        <div className="flex items-center justify-between px-7 pb-1 pt-3 text-[0.78rem] font-semibold">
          <span>9:41</span>
          <span className="h-6 w-24 rounded-full bg-[#0d0f14]" aria-hidden />
          <span className="tracking-tight">5G ▮</span>
        </div>
        <header className="flex items-center gap-2.5 border-b border-black/[0.06] bg-[#f7f7f7] px-3 py-2">
          <ChevronLeft className="size-6 text-[#0a84ff]" aria-hidden />
          <MarquiAvatar className="size-9" />
          <span className="leading-tight">
            <b className="block text-[0.98rem]">{title}</b>
            <span className="text-[0.75rem] text-black/50">{subtitle}</span>
          </span>
        </header>
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
        <div className="flex items-center gap-2 bg-[#f7f7f7] px-3 pb-5 pt-2">
          <Plus className="size-6 text-[#0a84ff]" aria-hidden />
          <span className="h-9 flex-1 rounded-full bg-white ring-1 ring-black/10" />
          <Mic className="size-5 text-[#0a84ff]" aria-hidden />
        </div>
      </div>
    </div>
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
