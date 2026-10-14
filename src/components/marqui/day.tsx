import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kicker, RiseLines, Section, ease } from "./primitives";
import { Marqador } from "./marqador";
import { Phone } from "./phone";
import { SKY } from "./sky";
import { WhatsAppWeb } from "./whatsapp-web";

const moments = [
  {
    time: "9:00",
    sky: SKY.dawn,
    title: "Llega el resumen del día.",
    text: "Antes de abrir la computadora, MARQui ya te contó cómo vino ayer y a quién conviene atender primero.",
  },
  {
    time: "10:30",
    sky: SKY.noon,
    title: "Juan pregunta «precio?».",
    text: "Abrís su chat en WhatsApp Web. MARQui completa la tarjeta mientras charlan y te sopla cada respuesta. Juan termina pidiendo una visita.",
  },
  {
    time: "18:00",
    sky: SKY.dusk,
    title: "Mirás cómo vino la semana.",
    text: "Un botón en WhatsApp Web abre MARQador. En un vistazo ves qué anuncio trae gente que de verdad avanza.",
  },
];

export function Day() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const m = moments[step]!;

  // Presenter keys: ← → move through the day while the demo is on screen.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("textarea, input")) return;
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, moments.length - 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView]);

  return (
    <Section ref={ref} sky={m.sky} id="un-dia" className="py-28 sm:py-40" aria-labelledby="un-dia-title">
      <div className="mx-auto max-w-[90rem]">
        <Kicker n="04">Demo</Kicker>
        <RiseLines id="un-dia-title" lines={[<>Un día <em>con MARQui.</em></>]} className="display sky-type mt-6 text-[clamp(2.2rem,5vw,6.4rem)]" />

        {/* The day as a timeline: three stops on the left, the screen on the right. The sky follows the hour. */}
        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,22rem)_1fr] xl:grid-cols-[minmax(0,26rem)_1fr]">
          <div className="flex flex-col gap-2.5">
            <div role="tablist" aria-label="Momentos del día" className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {moments.map((mo, i) => (
                <button
                  key={mo.time}
                  role="tab"
                  aria-selected={step === i}
                  onClick={() => setStep(i)}
                  className={cn("relative overflow-hidden rounded-2xl px-4 py-4 text-left transition-colors sm:px-6 sm:py-5", step === i ? "bg-paper text-ink" : "bg-ink/80 text-white hover:bg-ink")}
                >
                  <span className="block font-display text-[clamp(1.3rem,2.1vw,2.3rem)] font-bold leading-none tracking-[-0.03em]">{mo.time}</span>
                  <span className={cn("mt-2 block text-[clamp(1rem,1.25vw,1.3rem)] font-semibold leading-snug max-sm:hidden", step === i ? "text-ink" : "text-white/75")}>{mo.title}</span>
                  <AnimatePresence initial={false}>
                    {step === i && (
                      <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }} className="block overflow-hidden max-lg:hidden">
                        <span className="block pt-3 text-[clamp(1rem,1.15vw,1.2rem)] leading-[1.45] text-ink-2">{mo.text}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {step === i && <motion.span layoutId="day-bar" className="absolute inset-y-0 left-0 w-1.5 bg-orange max-lg:inset-x-0 max-lg:bottom-0 max-lg:top-auto max-lg:h-1.5 max-lg:w-auto" />}
                </button>
              ))}
            </div>
            <p className="paper rounded-2xl px-5 py-4 text-[1.05rem] leading-snug text-ink-2 lg:hidden">{m.text}</p>
            <div className="mt-auto flex items-center gap-2.5">
              <button onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} aria-label="Momento anterior" className="grid size-14 shrink-0 place-items-center rounded-full bg-paper text-ink transition-opacity disabled:opacity-40">
                <ArrowLeft className="size-6" />
              </button>
              <button onClick={() => setStep((s) => (s + 1) % moments.length)} className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-paper px-6 text-[1.1rem] font-semibold text-ink transition-transform hover:-translate-y-0.5">
                {step === moments.length - 1 ? "Volver a las 9:00" : `Seguir a las ${moments[step + 1]!.time}`} <ArrowRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-[min(44rem,80svh)]">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.98 }} transition={{ duration: 0.6, ease }} className="h-full">
                {step === 0 && (
                  <div className="grid h-full place-items-center">
                    <Phone
                      stagger={0.7}
                      messages={[
                        { kind: "day", text: "Hoy" },
                        { kind: "in", time: "9:00", text: <><b>☀️ Buen día. Así vino ayer:</b><br />23 consultas (17 de pauta, 6 de clientes)<br />2 nuevos interesados · 1 reserva<br />4 chats sin responder</> },
                        { kind: "in", time: "9:00", text: <><b>Para atender primero:</b><br />🔁 Marta Ríos reapareció después de 40 días. Pregunta por la 3B.<br />🤝 Sofía Acosta llegó recomendada por Pablo Sosa.</> },
                        { kind: "file", from: "in", name: "Resumen · lunes 13.pdf", meta: "1 página · PDF", type: "pdf", time: "9:00" },
                      ]}
                    />
                  </div>
                )}
                {step === 1 && <WhatsAppWeb showSidebar={false} height="h-[min(44rem,78svh)]" />}
                {step === 2 && <Marqador initial="pauta" />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
