import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CalendarClock, CheckCheck, Copy, FileSpreadsheet, Forward, MessageCircleQuestion, Mic, Minus, Play, Reply, Smartphone, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "./primitives";
import { PhoneFrame } from "./phone";

/* 0 rest · 1 you forward a client's message · 2 typing · 3 three replies · 4 you long-press the 2nd
   · 5 copied · 6 you ask a question · 7 typing · 8 the answer · 9 you send a voice note · 10 typing · 11 noted */
const LAST = 11;

const REPLIES = [
  "¡Hola! Sí, financiamos hasta 36 cuotas en pesos. ¿Te paso el plano con los lotes disponibles?",
  "¡Sí! Anticipo del 30% y el resto en cuotas. ¿Lo pensás para construir ya o como inversión?",
  "Sí, tenemos financiación propia. ¿Te llamo mañana y lo vemos?",
];

/**
 * On the phone, MARQui is a contact: you forward him a client's message and copy one of his
 * three replies, or you just ask. `MobileLimits` says, honestly, what it can't do.
 */
export function MobileVisual() {
  return <PhoneDemo />;
}

/** What the phone can't do, for under the section's text. */
export { Limits as MobileLimits };

/* The demo's step, shared with the list beside the phone so both move together. */
let shared = 0;
const listeners = new Set<() => void>();
const publish = (n: number) => {
  shared = n;
  listeners.forEach((f) => f());
};
const useSharedStep = () =>
  useSyncExternalStore(
    (f) => {
      listeners.add(f);
      return () => listeners.delete(f);
    },
    () => shared,
  );

function PhoneDemo() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { amount: 0.5 });
  const [step, setStep] = useState(reduce ? LAST : 0);
  useEffect(() => publish(step), [step]);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    setStep(0);
    const ids = [700, 1500, 2600, 5000, 6900, 9200, 10000, 11100, 13600, 14500, 15500].map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    ids.push(window.setTimeout(() => setRun((r) => r + 1), 20500));
    return () => ids.forEach(clearTimeout);
  }, [inView, reduce, run]);

  const pop = reduce ? {} : { initial: { opacity: 0, y: 12, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.42, ease } };
  const holding = step === 4;
  const typing = (
    <motion.span {...pop} className="flex w-fit gap-1 rounded-[0.8rem] rounded-tl-none bg-white px-3 py-2.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]" aria-label="MARQui está escribiendo">
      {[0, 1, 2].map((d) => (
        <motion.i key={d} className="size-1.5 rounded-full bg-black/35" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
      ))}
    </motion.span>
  );

  return (
    <div ref={root} className="wa-font w-full max-w-[21rem] shrink-0">
      <PhoneFrame
        subtitle={step === 2 || step === 7 || step === 10 ? <span className="text-[#00a884]">escribiendo…</span> : "Asistente de MARQ"}
        overlay={
          <AnimatePresence>
            {step === 5 && (
              /* The phone's honest step: you copy it, then paste it in the client's chat yourself. */
              <motion.div
                key={`toast-${run}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, ease }}
                className="absolute inset-x-6 bottom-20 z-30 flex items-center gap-2.5 rounded-2xl bg-[#1f2c33]/95 px-3.5 py-2.5 text-[0.78rem] leading-snug text-white shadow-[0_1rem_2rem_-0.8rem_rgb(0_0_0/0.6)]"
              >
                <Copy className="size-4 shrink-0 text-[#25d366]" aria-hidden />
                <span>
                  <b className="font-semibold">Copiado.</b> Pegalo vos en el chat del cliente.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        }
      >
        <div className="wa-paper relative flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-3 py-3 text-[0.86rem] leading-[1.38]">
          <span className="mx-auto mb-auto rounded-lg bg-white/90 px-3 py-1 text-[0.72rem] font-medium text-black/55 shadow-sm">Hoy</span>

          {step >= 1 && (
            <motion.div key={`fwd-${run}`} {...pop} className="ml-auto max-w-[86%] rounded-[0.8rem] rounded-tr-none bg-wa-bubble px-2.5 py-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              <span className="mb-0.5 flex items-center gap-1 text-[0.72rem] italic text-black/45">
                <Forward className="size-3.5" aria-hidden /> Reenviado
              </span>
              Hola, ¿los lotes de Fontana tienen financiación?
              <Stamp out>19:05</Stamp>
            </motion.div>
          )}
          <AnimatePresence mode="popLayout">{step === 2 && <motion.div key={`t1-${run}`} exit={{ opacity: 0, transition: { duration: 0 } }}>{typing}</motion.div>}</AnimatePresence>

          {step >= 3 && (
            <>
              {REPLIES.map((r, i) => {
                const lifted = holding && i === 1;
                return (
                  <motion.div
                    key={`r${i}-${run}`}
                    initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: holding && !lifted ? 0.35 : 1, y: 0, scale: lifted ? 1.03 : 1 }}
                    transition={{ duration: 0.42, delay: step === 3 ? i * 0.3 : 0, ease }}
                    className={cn("relative max-w-[88%] rounded-[0.8rem] rounded-tl-none bg-white px-2.5 py-1.5", lifted ? "z-20 shadow-[0_1rem_2rem_-0.6rem_rgb(0_0_0/0.45)]" : "shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]")}
                  >
                    <b>{i + 1}.</b> {r}
                    <Stamp>19:05</Stamp>
                    {lifted && (
                      <>
                        <Touch />
                        {/* iOS's long-press menu, above the bubble. */}
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.55, ease }}
                          className="absolute bottom-full left-2 mb-2 w-44 origin-bottom-left overflow-hidden rounded-xl bg-white/95 text-[0.84rem] shadow-[0_1rem_2.5rem_-0.6rem_rgb(0_0_0/0.45)] backdrop-blur"
                        >
                          {[
                            { icon: Reply, label: "Responder" },
                            { icon: Forward, label: "Reenviar" },
                            { icon: Copy, label: "Copiar", on: true },
                          ].map((o) => (
                            <span key={o.label} className={cn("flex items-center justify-between border-b border-black/[0.06] px-3.5 py-2 last:border-0", o.on && "bg-black/[0.06] font-medium")}>
                              {o.label}
                              <o.icon className="size-4 text-black/60" aria-hidden />
                            </span>
                          ))}
                        </motion.span>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </>
          )}

          {step >= 6 && (
            <motion.div key={`q-${run}`} {...pop} className="ml-auto max-w-[86%] rounded-[0.8rem] rounded-tr-none bg-wa-bubble px-2.5 py-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              ¿Cuántos lotes quedan en Fontana?
              <Stamp out>19:08</Stamp>
            </motion.div>
          )}
          <AnimatePresence mode="popLayout">{step === 7 && <motion.div key={`t2-${run}`} exit={{ opacity: 0, transition: { duration: 0 } }}>{typing}</motion.div>}</AnimatePresence>
          {step >= 8 && (
            <motion.div key={`a-${run}`} {...pop} className="max-w-[86%] rounded-[0.8rem] rounded-tl-none bg-white px-2.5 py-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              Quedan <b>12 de 40</b>. Los de esquina son los más pedidos esta semana.
              <Stamp>19:08</Stamp>
            </motion.div>
          )}

          {/* Talking to him: a voice note with a novelty, and he learns it. */}
          {step >= 9 && (
            <motion.div key={`v-${run}`} {...pop} className="ml-auto w-[78%] rounded-[0.8rem] rounded-tr-none bg-wa-bubble px-2.5 pb-1.5 pt-2 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              <span className="flex items-center gap-2">
                <Play className="size-4 shrink-0 fill-[#54656f] text-[#54656f]" aria-hidden />
                <span className="flex h-5 flex-1 items-center gap-[2px]" aria-hidden>
                  {[5, 9, 13, 8, 15, 11, 6, 14, 17, 10, 7, 12, 16, 9, 5, 11, 14, 8, 12, 6].map((h, i) => (
                    <i key={i} className="w-[2.5px] rounded-full bg-[#8aa79a]" style={{ height: h }} />
                  ))}
                </span>
                <span className="text-[0.66rem] text-black/45">0:05</span>
              </span>
              <span className="mt-1 block border-t border-black/[0.07] pt-1 text-[0.76rem] italic leading-snug text-[#3b4a54]">«Anotá que Collection ahora financia en 36 cuotas»</span>
              <Stamp out>19:10</Stamp>
            </motion.div>
          )}
          <AnimatePresence mode="popLayout">{step === 10 && <motion.div key={`t3-${run}`} exit={{ opacity: 0, transition: { duration: 0 } }}>{typing}</motion.div>}</AnimatePresence>
          {step >= 11 && (
            <motion.div key={`n-${run}`} {...pop} className="max-w-[86%] rounded-[0.8rem] rounded-tl-none bg-white px-2.5 py-1.5 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
              Anotado ✓ Desde hoy sugiero <b>36 cuotas</b> para Collection.
              <Stamp>19:10</Stamp>
            </motion.div>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}

function Stamp({ children, out = false }: { children: ReactNode; out?: boolean }) {
  return (
    <span className="mt-0.5 flex items-center justify-end gap-0.5 text-[0.65rem] text-black/45">
      {children} {out && <CheckCheck className="size-3.5 text-[#53bdeb]" aria-hidden />}
    </span>
  );
}

/** A fingertip, held down: the dot lands, a ring fills while you hold. */
function Touch() {
  return (
    <span className="pointer-events-none absolute left-[46%] top-1/2 z-30 grid -translate-x-1/2 -translate-y-1/2 place-items-center" aria-hidden>
      <motion.i className="absolute size-12 rounded-full border-2 border-[#0a84ff]/70" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 1.15], opacity: [0, 1, 0] }} transition={{ duration: 0.9, ease: "easeOut" }} />
      <motion.i className="size-9 rounded-full bg-black/25 ring-2 ring-white/70" initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: [1.4, 0.9, 0.9, 1], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.6, times: [0, 0.25, 0.85, 1] }} />
    </span>
  );
}

/* What the phone can't do that WhatsApp Web can. Nothing more. */
const CANT = [
  { title: "No te ayuda dentro de cada chat", text: "Para pedirle algo, entrás a su contacto." },
  { title: "Sin ficha, Seguir ni Reglas", text: "Eso está en WhatsApp Web." },
];

function Limits() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: 0.2, ease }}
      className="w-full max-w-[19rem] rounded-[1.4rem] bg-white/95 p-5 text-[#111b21] shadow-[0_2.5rem_5rem_-2rem_rgb(1_30_27/0.55)] ring-1 ring-white/70"
    >
      <p className="flex items-center gap-2 text-[0.95rem] font-semibold">
        <Smartphone className="size-4 text-[#54656f]" aria-hidden /> En el celular, no:
      </p>
      <ul className="mt-3 grid gap-3">
        {CANT.map((c) => (
          <li key={c.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#f1f3f4] text-[#8696a0]">
              <Minus className="size-3" strokeWidth={3} aria-hidden />
            </span>
            <span className="text-[0.84rem] leading-snug">
              <b className="block font-semibold">{c.title}</b>
              <span className="text-[#54656f]">{c.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* What you can do with MARQui from the phone. The ones the demo plays light up as they happen. */
const DOES: { icon: typeof Mic; title: string; text: string; tile: string; live?: [number, number] }[] = [
  { icon: Forward, title: "Le reenviás un mensaje", text: "Te devuelve tres respuestas para copiar.", tile: "from-[#00a390] to-[#014645]", live: [1, 5] },
  { icon: MessageCircleQuestion, title: "Le preguntás lo que necesites", text: "Números o un dato de un proyecto.", tile: "from-[#5b8def] to-[#2f4fb5]", live: [6, 8] },
  { icon: Mic, title: "Le hablás con un audio", text: "Le contás una novedad y la aprende.", tile: "from-[#f59a5b] to-[#c4511b]", live: [9, 11] },
  { icon: Sun, title: "Te llega el resumen", text: "Cada mañana, y los avisos al instante.", tile: "from-[#f8c84a] to-[#d68a00]" },
  { icon: FileSpreadsheet, title: "Le pedís listas en Excel", text: "Para una difusión o un evento.", tile: "from-[#3fbf6f] to-[#13773c]" },
  { icon: CalendarClock, title: "Le pedís tareas que se repiten", text: "Como una lista diaria por proyecto.", tile: "from-[#a78bfa] to-[#6d42d6]" },
];

export function MobileSteps() {
  const reduce = useReducedMotion();
  const step = useSharedStep();
  return (
    <ul className="grid gap-2">
      {DOES.map((x) => {
        const on = !reduce && !!x.live && step >= x.live[0] && step <= x.live[1];
        return (
          <motion.li
            key={x.title}
            animate={{ x: on ? 6 : 0 }}
            transition={{ duration: 0.4, ease }}
            className={cn(
              "flex items-center gap-3.5 rounded-[1.1rem] px-3.5 py-3 transition-colors duration-500",
              on ? "bg-white text-[#111b21] shadow-[0_1.5rem_3rem_-1.5rem_rgb(1_30_27/0.55)]" : "bg-white/10 text-white ring-1 ring-white/15",
            )}
          >
            {/* App-style tile: a colour per function, so the list reads at a glance. */}
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-[0.8rem] bg-gradient-to-br text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_0.4rem_0.9rem_-0.4rem_rgb(0_0_0/0.45)]", x.tile)}>
              <x.icon className="size-[1.15rem]" strokeWidth={2.2} aria-hidden />
            </span>
            <span className="leading-snug">
              <b className="block text-[clamp(1rem,1.15vw,1.15rem)] font-semibold">{x.title}</b>
              <span className={cn("text-[clamp(0.85rem,0.92vw,0.98rem)]", on ? "text-[#54656f]" : "text-white/75")}>{x.text}</span>
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
