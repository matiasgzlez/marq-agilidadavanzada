import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, LOGO, RiseLines, Section, ease } from "./primitives";
import { BigList, PartTitle, Scrolly, StageCaption, TechniquePill, useWide } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Técnica 5 · Prototipado de apps en papel ———
   Our paper sketch of MARQui (the four blocks from the report), checked
   against the restrictions, which moved it from its own screen into
   WhatsApp Web; then each block lands where it lives in the interactive
   prototype, and the prototype goes to Cande. */

const BLOCKS = [
  { n: 1, name: "Ficha del cliente", lines: ["Nombre: [prospecto]", "Interés: [propiedad]", "Etapa: Evaluación", "Último contacto: [fecha]"], real: "La ficha, arriba del chat", at: { x: 74, y: 18.5 } },
  { n: 2, name: "Contexto y sugerencias", lines: ["Resumen del cliente", "A. Enviar información", "B. Proponer una visita", "C. Consultar dudas"], real: "Tres respuestas, abajo", at: { x: 41, y: 73 } },
  { n: 3, name: "Control humano", lines: ["El vendedor elige, edita", "o descarta antes de enviar"], real: "Se escribe en tu cuadro y la mandás vos", at: { x: 45, y: 95 } },
  { n: 4, name: "Seguimiento", lines: ["Próxima acción:", "programar contacto"], real: "La estrella y el resumen diario", at: { x: 86.5, y: 11 } },
];

/* The three restrictions from the ideation, checked on the sketch. */
const CHECKS = [
  { rule: "Responde una persona", ok: true, how: "El bloque 3 lo asegura" },
  { rule: "Sin encuestas", ok: true, how: "La ficha se llena con la charla" },
  { rule: "Sin sistemas nuevos", ok: false, how: "Era una pantalla aparte → va dentro de WhatsApp Web" },
];

const STEPS: { title: string; text?: string }[] = [
  { title: "1. Bocetamos la pantalla en papel", text: "Cuatro bloques, sin diseño: solo qué tiene que haber." },
  { title: "2. Lo revisamos con las restricciones", text: "Una no se cumplía." },
  { title: "3. Cada bloque, a su lugar en WhatsApp Web" },
  { title: "4. Un prototipo que se puede tocar", text: "La presentación interactiva: elegís una respuesta, la mandás y la ficha se completa sola." },
  { title: "5. Lo probamos con Cande" },
];

const RATIO = 2.15;

/** The paper sketch: pencil lines on paper, a bit crooked, numbered blocks. */
function Sketch({ step, fit }: { step: number; fit: boolean }) {
  const f = (a: string, b: string) => (fit ? a : b);
  const separate = step >= 1;
  return (
    <div className={cn("relative rotate-[-1.2deg] bg-[#fffdf6] text-[#3b3a36] shadow-[0_1.2cqw_2.4cqw_-1cqw_rgb(0_0_0/0.4)]", f("rounded-[0.4cqw] p-[1.4cqw]", "rounded-md p-4"))} style={{ fontFamily: "'Segoe Print','Bradley Hand','Comic Sans MS',cursive" }}>
      <div className={cn("flex items-center justify-between border-b-2 border-dashed border-[#3b3a36]/40", f("pb-[0.6cqw] text-[1.35cqw]", "pb-2 text-[1rem]"))}>
        <span className="font-semibold">MARQui · Asistente comercial</span>
        <span className="relative">
          <span className={f("text-[1cqw]", "text-[0.8rem]")}>pantalla aparte</span>
          {separate && <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, ease }} aria-hidden className="absolute inset-x-[-0.3cqw] top-1/2 h-[0.22cqw] origin-left -rotate-6 bg-orange" />}
        </span>
      </div>
      <div className={cn("grid grid-cols-2", f("mt-[1cqw] gap-[0.9cqw]", "mt-3 gap-2"))}>
        {BLOCKS.map((b) => (
          <div key={b.n} className={cn("rounded-[0.3cqw] border-2 border-[#3b3a36]/55", b.n >= 3 && "col-span-2", f("p-[0.8cqw]", "p-2"))}>
            <p className={cn("flex items-center font-semibold", f("gap-[0.5cqw] text-[1.15cqw]", "gap-2 text-[0.9rem]"))}>
              <span className={cn("grid place-items-center rounded-full border-2 border-[#3b3a36]/70", f("size-[1.8cqw] text-[0.95cqw]", "size-6 text-[0.75rem]"))}>{b.n}</span>
              {b.name}
            </p>
            <div className={cn("grid", f("mt-[0.4cqw] gap-[0.15cqw] text-[0.95cqw]", "mt-1 text-[0.78rem]"))}>
              {b.lines.map((l) => (
                <span key={l} className="text-[#3b3a36]/80">{l}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtoCanvas({ step }: { step: number }) {
  const real = step >= 2;
  return (
    <div className="relative grid grid-cols-[0.82fr_auto_1.35fr] items-center gap-[1.6cqw] overflow-visible" style={{ aspectRatio: RATIO }}>
      <div className="relative">
        <Sketch step={step} fit />
      </div>
      <motion.span initial={false} animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : -10 }} className="grid size-[3.4cqw] place-items-center rounded-full bg-white text-ink shadow-md" aria-hidden>
        <ArrowRight className="size-[1.8cqw]" />
      </motion.span>
      <div className="relative">
      {/* Step 2: the three restrictions, checked against the sketch. */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div exit={{ opacity: 0 }} className="absolute inset-y-0 left-0 grid w-[80%] content-center gap-[1cqw]">
            {CHECKS.map((c, i) => (
              <motion.div key={c.rule} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: i * 0.2, ease }} className={cn("flex items-start gap-[1cqw] rounded-[1cqw] p-[1.2cqw] shadow-[0_1cqw_2cqw_-1cqw_rgb(1_30_27/0.5)]", c.ok ? "bg-[#f7f7f5]" : "bg-white ring-[0.3cqw] ring-orange")}>
                <span className={cn("grid size-[2.6cqw] shrink-0 place-items-center rounded-full text-[1.3cqw] font-semibold text-white", c.ok ? "bg-[linear-gradient(135deg,#19d3b4,#014645)]" : "bg-orange")}>{c.ok ? <Check className="size-[1.5cqw]" strokeWidth={3} /> : "✕"}</span>
                <span className="leading-snug">
                  <span className="block text-[1.7cqw] font-semibold tracking-[-0.02em] text-ink">{c.rule}</span>
                  <span className={cn("mt-[0.2cqw] block text-[1.2cqw] font-medium", c.ok ? "text-ink-3" : "text-orange-deep")}>{c.how}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* The prototype: MARQui inside WhatsApp Web, with the sketch's numbers where each block ended up. */}
      <motion.div initial={false} animate={{ opacity: real ? 1 : 0, scale: real ? 1 : 0.96 }} transition={{ duration: 0.6, ease }} className="relative overflow-hidden rounded-[1cqw] bg-white shadow-[0_2cqw_4cqw_-1.5cqw_rgb(1_30_27/0.6)] ring-1 ring-black/10">
        <div className="relative">
          <img src="/assets/dt/whatsapp-web.jpg" alt="MARQui dentro de WhatsApp Web" className="block w-full" />
          {BLOCKS.map((b, i) => (
            <motion.span
              key={b.n}
              initial={false}
              animate={{ opacity: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.4 }}
              transition={{ type: "spring", stiffness: 420, damping: 22, delay: step === 2 ? 0.4 + i * 0.25 : 0 }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-[0.4cqw] whitespace-nowrap rounded-full bg-ink py-[0.25cqw] pl-[0.25cqw] pr-[0.8cqw] text-[0.95cqw] font-semibold text-white shadow-lg ring-[0.2cqw] ring-white"
              style={{ left: `${b.at.x}%`, top: `${b.at.y}%` }}
            >
              <span className="grid size-[1.6cqw] place-items-center rounded-full bg-white text-ink">{b.n}</span>
              {b.real}
            </motion.span>
          ))}
          {/* Tapping it, in the interactive prototype. */}
          <AnimatePresence>
            {step === 3 && (
              <motion.span initial={{ opacity: 0, x: 40, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }} aria-hidden className="absolute left-[44%] top-[70%]">
                <svg viewBox="0 0 24 24" className="size-[2.6cqw] drop-shadow-md">
                  <path d="M5 3l14 8-6 1.5L10 19z" fill="#fff" stroke="#06231f" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                <motion.span animate={{ scale: [0.6, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="absolute -left-[0.8cqw] -top-[0.8cqw] block size-[2.6cqw] rounded-full bg-teal/50" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {/* The test with Cande: her verdict on top of the prototype. */}
        <AnimatePresence>
          {step >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-[rgb(6_35_31/0.55)] backdrop-blur-[2px]">
              <motion.div initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.6, ease }} className="flex items-center gap-[1.2cqw] rounded-[1.2cqw] bg-white p-[1.2cqw] pr-[2cqw] text-ink shadow-2xl">
                <span className="grid size-[5cqw] place-items-center rounded-full bg-ink"><img src={LOGO} alt="" className="w-[70%] brightness-0 invert" /></span>
                <span className="leading-tight">
                  <span className="block text-[1.05cqw] font-semibold text-teal">Candelaria, MARQ</span>
                  <span className="mt-[0.3cqw] block text-[2cqw] font-semibold tracking-[-0.02em]">Le encantó la propuesta</span>
                  <span className="mt-[0.3cqw] block text-[1.05cqw] text-ink-3">Validó el problema y la solución</span>
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
}

function ProtoStage() {
  const wide = useWide();
  if (!wide)
    return (
      <div className="mt-10 grid gap-5">
        <Sketch step={2} fit={false} />
        <img src="/assets/dt/whatsapp-web.jpg" alt="MARQui dentro de WhatsApp Web" className="w-full rounded-xl shadow-lg" />
        <ol className="grid gap-2">
          {BLOCKS.map((b) => (
            <li key={b.n} className="flex items-center gap-3 rounded-full bg-ink/85 py-1.5 pl-1.5 pr-4 text-[0.95rem] font-medium text-white">
              <span className="grid size-7 place-items-center rounded-full bg-white text-ink">{b.n}</span>
              {b.real}
            </li>
          ))}
        </ol>
      </div>
    );
  return (
    <Scrolly steps={STEPS.length}>
      {(step) => (
        <>
          <StageCaption step={step} steps={STEPS.length} title={STEPS[step]!.title} text={STEPS[step]!.text} />
          <div className="relative mt-6 min-h-0 flex-1 [container-type:size]">
            <div className="mx-auto [container-type:inline-size]" style={{ width: `min(100cqw, calc(100cqh * ${RATIO}))` }}>
              <ProtoCanvas step={step} />
            </div>
          </div>
        </>
      )}
    </Scrolly>
  );
}

/* What the prototype validated, and what's left to measure with the team. */
const VALIDATED = ["El problema: responder y dar seguimiento", "Que viva en el WhatsApp que ya usan", "Que al cliente le responda una persona"];
const NEXT = ["Facilidad de uso", "Utilidad de los recordatorios", "Calidad de las sugerencias"];

export function Prototipo() {
  return (
    <>
      <Section sky={SKY.noon} id="prototipo" className="py-28 sm:py-40" aria-labelledby="prototipo-title">
        <TechniquePill id="prototipo" />
        <div className="mx-auto mt-6 grid max-w-[64rem] justify-items-center text-center">
          <RiseLines id="prototipo-title" lines={["Prototipo en papel"]} className="display sky-type text-[clamp(3rem,7.4vw,8rem)]" />
          <FadeUp delay={0.15}>
            <p className="sky-type mt-5 text-[clamp(1.2rem,2vw,2.1rem)] font-medium text-white/85">Dibujar la pantalla antes de construirla, y probarla.</p>
          </FadeUp>
        </div>

        <article className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 sm:mt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <FadeUp className="flex min-w-0 justify-center">
            <div className="w-full max-w-[34rem]">
              <Sketch step={0} fit={false} />
            </div>
          </FadeUp>
          <FadeUp delay={0.1} className="grid gap-5">
            <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">¿Por qué la elegimos?</h3>
            <BigList items={["MARQui es una pantalla", "En papel, cambiar es gratis", "Probar antes de construir"]} />
          </FadeUp>
        </article>
      </Section>

      <Section sky={SKY.noon} id="prototipo-aplicacion" className="pt-12 sm:pt-20" aria-labelledby="prototipo-aplicacion-title">
        <PartTitle id="prototipo-aplicacion-title">¿Cómo la aplicamos?</PartTitle>
        <ProtoStage />
      </Section>

      <Section sky={SKY.noon} id="prototipo-resultado" className="py-28 sm:py-40" aria-labelledby="prototipo-resultado-title">
        <PartTitle id="prototipo-resultado-title">¿Qué obtuvimos?</PartTitle>
        <div className="mx-auto mt-10 grid max-w-[72rem] justify-items-center text-center">
          <RiseLines as="h3" lines={["Una propuesta validada", <em key="e" className="text-white/70">antes de desarrollarla.</em>]} className="display sky-type text-[clamp(2rem,4.4vw,4.8rem)]" />
        </div>
        <div className="mx-auto mt-14 grid max-w-[72rem] gap-3.5 md:grid-cols-2">
          {[
            { title: "Cande validó", items: VALIDATED, done: true },
            { title: "Falta medir con el equipo", items: NEXT, done: false },
          ].map((col, i) => (
            <FadeUp key={col.title} delay={i * 0.1} className="h-full">
              <article className="h-full overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-2.5 text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
                <h4 className="rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-5 text-[clamp(1.3rem,1.7vw,1.75rem)] font-semibold tracking-[-0.02em] ring-1 ring-black/[0.04]">{col.title}</h4>
                <ul className="grid gap-3 px-4 pb-5 pt-4">
                  {col.items.map((x) => (
                    <li key={x} className="flex items-center gap-3 text-[clamp(1.02rem,1.15vw,1.2rem)] font-medium">
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", col.done ? "bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white" : "ring-2 ring-inset ring-black/15")}>{col.done && <Check className="size-4" strokeWidth={3} />}</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeUp>
          ))}
        </div>
      </Section>
    </>
  );
}
