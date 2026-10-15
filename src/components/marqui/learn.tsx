import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Camera, Globe, Handshake, MessageSquareText, Mic, PenLine, Phone, Sheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMarquiLife } from "./marqui-character";
import { MarquiLive } from "./marqui-live";

/* ——— Where MARQui learns from, like the "all your apps, one context" hub on gasti.pro ——— */

type Id = "wa" | "audio" | "xls" | "drive" | "web" | "mp" | "obra" | "edits" | "talk" | "ig";
type Glyph = (p: { className?: string }) => ReactNode;
/** `label` sits under the icon (`short` on phones); `name` is how the sentence on the left says it. */
type Source = { id: Id; label: string; short: string; name: string; x: number; y: number; size: "lg" | "md" | "sm"; soon?: boolean; glyph: Glyph; tile: string };

/* Brand-ish glyphs, drawn small so they read at any size. */
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid place-items-center", className)}>
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-full" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden>
        <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" />
      </svg>
      <Phone className="size-[42%] fill-current" strokeWidth={0} aria-hidden />
    </span>
  );
}
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function DriveGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8.2 3h7.6l6.6 11.4h-7.6z" fill="#ffba00" />
      <path d="M8.2 3 1.6 14.4l3.8 6.6L12 9.6z" fill="#0f9d58" />
      <path d="M5.4 21h13.2l3.8-6.6H9.2z" fill="#4285f4" />
    </svg>
  );
}
const lucide = (Icon: typeof Mic): Glyph => ({ className }) => <Icon className={className} aria-hidden />;

/* Clockwise from the top, on an ellipse in a 125 × 100 box. The two upcoming ones sit at the bottom. */
const SOURCES: Source[] = [
  { id: "wa", label: "Chats de WhatsApp", short: "WhatsApp", name: "los chats de WhatsApp", x: 62.5, y: 12, size: "lg", glyph: WhatsAppGlyph, tile: "bg-[#25d366] text-white" },
  { id: "audio", label: "Audios", short: "Audios", name: "los audios", x: 91.9, y: 18.7, size: "md", glyph: lucide(Mic), tile: "bg-white text-[#008c7e]" },
  { id: "xls", label: "Excels", short: "Excels", name: "los Excel", x: 110.1, y: 36.2, size: "md", glyph: lucide(Sheet), tile: "bg-white text-[#0f9d58]" },
  { id: "drive", label: "Documentos de Drive", short: "Drive", name: "los documentos de Drive", x: 110.1, y: 57.8, size: "md", glyph: DriveGlyph, tile: "bg-white" },
  { id: "web", label: "La web y su formulario", short: "Web", name: "la web", x: 91.9, y: 75.3, size: "md", glyph: lucide(Globe), tile: "bg-white text-[#014645]" },
  { id: "mp", label: "Mercado Pago", short: "Pagos", name: "Mercado Pago", x: 62.5, y: 82, size: "sm", soon: true, glyph: lucide(Handshake), tile: "bg-white text-[#009ee3]" },
  { id: "obra", label: "Avance de obra", short: "Obra", name: "el avance de obra", x: 33.1, y: 75.3, size: "sm", soon: true, glyph: lucide(Camera), tile: "bg-white text-[#5b6b75]" },
  { id: "edits", label: "Tus correcciones", short: "Correcciones", name: "cada respuesta que corregís", x: 14.9, y: 57.8, size: "md", glyph: lucide(PenLine), tile: "bg-white text-[#7a4a00]" },
  { id: "talk", label: "Lo que le contás", short: "Lo que contás", name: "lo que le contás", x: 14.9, y: 36.2, size: "md", glyph: lucide(MessageSquareText), tile: "bg-white text-[#008c7e]" },
  { id: "ig", label: "Pauta de Instagram", short: "Pauta IG", name: "la pauta de Instagram", x: 33.1, y: 18.7, size: "md", glyph: InstagramGlyph, tile: "bg-[radial-gradient(circle_at_30%_105%,#fdd86a_0%,#f7743c_38%,#d6249f_62%,#5b4ae0_100%)] text-white" },
];
const MAIN = SOURCES.filter((s) => !s.soon).map((s) => s.id);
const byId = (id: Id) => SOURCES.find((s) => s.id === id)!;
const W = 125;
const H = 100;
const CENTER = { x: 62.5, y: 47 };

/* One shared "what's lit" between the words on the left and the diagram on the right. */
let snap: { active: Id; held: boolean } = { active: "wa", held: false };
const subs = new Set<() => void>();
const store = {
  get: () => snap,
  set: (next: Partial<typeof snap>) => {
    snap = { ...snap, ...next };
    subs.forEach((f) => f());
  },
  sub: (f: () => void) => {
    subs.add(f);
    return () => subs.delete(f);
  },
};
const useLit = () => useSyncExternalStore(store.sub, store.get);
const hold = (id: Id) => ({
  onMouseEnter: () => store.set({ active: id, held: true }),
  onMouseLeave: () => store.set({ held: false }),
  onFocus: () => store.set({ active: id, held: true }),
  onBlur: () => store.set({ held: false }),
});

/** A source named inline, with its icon and a dotted underline. Pointing at it lights it up in the diagram. */
function Named({ id, tail }: { id: Id; tail?: string }) {
  const s = byId(id);
  const lit = useLit().active === id;
  return (
    <button type="button" {...hold(id)} className="group inline cursor-default whitespace-nowrap text-left focus-visible:outline-none">
      <span className={cn("mr-1.5 inline-grid size-[1.15em] translate-y-[0.16em] place-items-center rounded-[0.3em] shadow-[0_0_0_1px_rgb(255_255_255/0.35)] transition-transform duration-300", s.tile, lit && "scale-110")}>
        <s.glyph className="size-[72%]" />
      </span>
      <span className={cn("underline decoration-dotted decoration-[0.08em] underline-offset-[0.22em] transition-colors duration-300", lit ? "decoration-white text-white" : "decoration-white/45 group-focus-visible:decoration-white")}>{s.name}</span>
      {tail}
    </button>
  );
}

export function LearnText() {
  return (
    <>
      Se nutre de <Named id="wa" tail="," /> <Named id="audio" /> y <Named id="ig" tail="." /> De <Named id="xls" tail="," /> <Named id="drive" /> y <Named id="web" tail="." /> Y de <Named id="talk" /> y <Named id="edits" tail="." /> Nadie carga nada en otro sistema.
    </>
  );
}

const SIZE = {
  lg: "size-[3.2rem] rounded-[1rem] sm:size-[4.4rem] sm:rounded-[1.35rem]",
  md: "size-[2.6rem] rounded-[0.8rem] sm:size-[3.4rem] sm:rounded-[1.05rem]",
  sm: "size-[2.2rem] rounded-[0.7rem] sm:size-[2.8rem] sm:rounded-[0.85rem]",
};

export function LearnVisual() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const { active, held } = useLit();
  const pose = useMarquiLife({ active: inView });

  // Presenting: it walks through the sources by itself, unless someone is pointing.
  useEffect(() => {
    if (!inView || held || reduce) return;
    const t = window.setInterval(() => {
      const i = MAIN.indexOf(store.get().active);
      store.set({ active: MAIN[(i + 1) % MAIN.length]! });
    }, 2400);
    return () => clearInterval(t);
  }, [inView, held, reduce]);

  return (
    <div ref={root} className="w-full max-w-[46rem] overflow-hidden rounded-[2rem] bg-white/92 text-[#111b21] shadow-[0_3rem_6rem_-2rem_rgb(1_30_27/0.55)] ring-1 ring-white/70 backdrop-blur">
      <div className="relative aspect-[5/4]">
        {/* A soft glow behind MARQui, the way gasti lights its mark. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_47%,rgb(138_216_200/0.5)_0%,rgb(138_216_200/0.1)_30%,transparent_55%)]" aria-hidden />

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
          {SOURCES.map((s) => {
            const on = s.id === active;
            const d = `M ${s.x} ${s.y} L ${CENTER.x} ${CENTER.y}`;
            return (
              <g key={s.id}>
                <path d={d} stroke={on ? "#008c7e" : "#0b3a35"} strokeOpacity={on ? 0.55 : 0.13} strokeWidth={on ? 0.45 : 0.28} strokeDasharray={s.soon ? "1 1.2" : undefined} fill="none" style={{ transition: "stroke-opacity .4s, stroke-width .4s" }} />
                {/* What flows in: short bright dashes travelling to MARQui. Upcoming sources stay still. */}
                {!s.soon && !reduce && (
                  <motion.path
                    d={d}
                    pathLength={100}
                    fill="none"
                    stroke={on ? "#00a884" : "#3fae9c"}
                    strokeOpacity={on ? 1 : 0.7}
                    strokeWidth={on ? 0.9 : 0.6}
                    strokeLinecap="round"
                    strokeDasharray="7 93"
                    animate={{ strokeDashoffset: [0, -93] }}
                    transition={{ duration: on ? 1.3 : 2.4 + (Math.round(s.x) % 7) * 0.15, repeat: Infinity, ease: "linear", delay: (Math.round(s.y) % 5) * 0.3 }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* MARQui in the middle, in his brand tile (white on teal), alive: he blinks and glances while it all comes in. */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(CENTER.x / W) * 100}%`, top: `${(CENTER.y / H) * 100}%` }}>
          <motion.div
            className="grid size-[5.2rem] place-items-center rounded-[1.5rem] bg-[radial-gradient(circle_at_35%_28%,#00a390,#008c7e_55%,#014645)] ring-1 ring-white/30 sm:size-[7.2rem] sm:rounded-[2rem]"
            animate={reduce ? undefined : { boxShadow: ["0 0 0 0 rgb(0 168 132 / 0.28), 0 1.2rem 2.4rem -1rem rgb(1 70 69 / 0.45)", "0 0 0 1.1rem rgb(0 168 132 / 0), 0 1.2rem 2.4rem -1rem rgb(1 70 69 / 0.45)"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          >
            <MarquiLive pose={pose} shadow={false} className="w-[74%]" />
          </motion.div>
        </div>

        {/* Every source says what it is, no hover needed. */}
        {SOURCES.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              {...hold(s.id)}
              aria-label={`${s.label}${s.soon ? " (próximamente)" : ""}`}
              className="absolute flex -translate-x-1/2 -translate-y-[1.6rem] cursor-default flex-col items-center gap-1 focus-visible:outline-none sm:-translate-y-[2.1rem]"
              style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
            >
              <motion.span
                animate={{ scale: on ? 1.1 : 1, y: on ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={cn(
                  "grid place-items-center transition-shadow duration-300",
                  SIZE[s.size],
                  s.tile,
                  s.soon && !on && "opacity-55 grayscale-[0.4]",
                  on ? "shadow-[0_0_0_3px_#fff,0_0_0_5px_#00a884,0_0.9rem_1.6rem_-0.6rem_rgb(1_70_69/0.5)]" : "shadow-[0_0_0_1px_rgb(1_30_27/0.07),0_0.6rem_1.2rem_-0.6rem_rgb(1_30_27/0.35)]",
                )}
              >
                <s.glyph className="size-[48%]" />
              </motion.span>
              <span className={cn("whitespace-nowrap rounded-full px-1.5 text-[0.62rem] font-semibold leading-tight transition-colors duration-300 sm:text-[0.74rem]", on ? "bg-[#008c7e] text-white" : s.soon ? "text-[#8696a0]" : "bg-white/80 text-[#3b4a54]")}>
                <span className="sm:hidden">{s.short}</span>
                <span className="max-sm:hidden">{s.label}</span>
                {s.soon && <span className="ml-1 rounded-full max-sm:hidden bg-[#111b21] px-1 py-px text-[0.5rem] uppercase tracking-wide text-white sm:text-[0.55rem]">pronto</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
