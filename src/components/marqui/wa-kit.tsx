import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CheckCheck, Mic, MoreVertical, Plus, Search, SendHorizontal, Smile, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "./primitives";

/* ——— WhatsApp Web pieces shared by the mockups ——— */

export const BUBBLE = "shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]";

export function ChatWindow({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1rem] bg-white shadow-[0_1px_2px_rgb(1_30_27/0.1),0_0.75rem_1.75rem_-0.5rem_rgb(1_30_27/0.28),0_2.5rem_5rem_-1.5rem_rgb(1_30_27/0.5)] ring-1 ring-black/[0.08]">
      {children}
    </div>
  );
}

export function ChatHeader({ name, children, below, avatar, back, actions }: { name: string; children: ReactNode; below?: ReactNode; avatar?: ReactNode; back?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="border-b border-black/[0.06] bg-[#f0f2f5] px-3.5 py-2">
      <div className="flex items-center gap-3">
        {back}
        {avatar ?? <Face name={name} className="size-9" />}
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.95rem] font-medium">{name}</span>
          <span className="block truncate text-[0.74rem] text-[#667781]">{children}</span>
        </span>
        {actions}
        <Video className="size-[1.15rem] text-[#54656f]" aria-hidden />
        <Search className="size-[1.15rem] text-[#54656f]" aria-hidden />
        <MoreVertical className="size-[1.15rem] text-[#54656f]" aria-hidden />
      </div>
      {below}
    </header>
  );
}

/* Clients' profile pictures. The faces are AI-generated (thispersondoesnotexist.com): nobody real. */
export const FACES: Record<string, string> = {
  Juan: "/assets/clientes/juan.jpg",
  "Marta Ríos": "/assets/clientes/marta.jpg",
  "Sofía Acosta": "/assets/clientes/sofia.jpg",
  "Laura Gómez": "/assets/clientes/laura.jpg",
  "Pablo Sosa": "/assets/clientes/pablo.jpg",
  Cande: "/assets/clientes/cande.jpg",
};

export function Face({ name, className }: { name: string; className?: string }) {
  const src = FACES[name];
  return src ? (
    <img src={src} alt="" className={cn("shrink-0 rounded-full object-cover", className)} />
  ) : (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#c7d3e6] to-[#9fb3d4] text-[0.9rem] font-semibold text-white", className)}>{name[0]}</span>
  );
}

/** The little hook on the first bubble of a run. */
export function Tail({ out = false }: { out?: boolean }) {
  return out ? (
    <svg viewBox="0 0 8 13" className="absolute -right-2 top-0 h-[13px] w-2 fill-wa-bubble" aria-hidden>
      <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
    </svg>
  ) : (
    <svg viewBox="0 0 8 13" className="absolute -left-2 top-0 h-[13px] w-2 fill-white" aria-hidden>
      <path d="M1.533 3.568 8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
    </svg>
  );
}

export function Time({ children, read = false }: { children: ReactNode; read?: boolean }) {
  return (
    <span className="float-right -mb-1 ml-2.5 mt-1.5 inline-flex items-center gap-0.5 text-[0.64rem] leading-none text-[#667781]">
      {children}
      {read && <CheckCheck className="size-3.5 text-[#53bdeb]" />}
    </span>
  );
}

export function Composer({ draft = "", typing = false, cursor }: { draft?: string; typing?: boolean; cursor?: ReactNode }) {
  return (
    <div className="flex items-end gap-2 bg-[#f0f2f5] px-2.5 py-2">
      <div className="flex min-h-10 flex-1 items-center gap-1.5 rounded-[1.4rem] bg-white py-1.5 pl-2.5 pr-3">
        <Plus className="size-5 shrink-0 self-end text-[#54656f]" aria-hidden />
        <Smile className="size-5 shrink-0 self-end text-[#54656f]" aria-hidden />
        <p className="min-w-0 flex-1 py-0.5 pl-1 text-[0.84rem] leading-[1.35]">
          {draft ? (
            <>
              {draft}
              {typing && <i className="ml-px inline-block h-[1.05em] w-px translate-y-[0.18em] animate-pulse bg-[#00a884]" />}
            </>
          ) : (
            <span className="text-[#667781]">Escribe un mensaje</span>
          )}
        </p>
      </div>
      <span className={cn("relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300", draft ? "bg-[#00a884] text-white" : "text-[#54656f]")} aria-hidden>
        {draft ? <SendHorizontal className="size-[1.15rem]" /> : <Mic className="size-5" />}
        {cursor}
      </span>
    </div>
  );
}

/** A macOS pointer that glides in, taps the reply, and leaves. */
export function Cursor({ play, delay = 1.1 }: { play: boolean; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="pointer-events-none absolute right-[16%] top-[50%] z-10 size-7 drop-shadow-[0_3px_4px_rgb(0_0_0/0.35)]"
      initial={{ opacity: 0, x: 110, y: 140 }}
      animate={play ? { opacity: [0, 1, 1, 0], x: [110, 0, 0, 0, 8], y: [140, 0, 0, 0, 12], scale: [1, 1, 0.8, 1, 1] } : undefined}
      transition={{
        delay,
        opacity: { delay, duration: 2.6, times: [0, 0.12, 0.85, 1] },
        default: { delay, duration: 2.6, times: [0, 0.45, 0.52, 0.6, 1], ease },
      }}
      aria-hidden
    >
      <path d="M5.5 3.2v15.6l4.1-3.9 2.6 6.1 2.6-1.1-2.6-6h5.7z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </motion.svg>
  );
}
