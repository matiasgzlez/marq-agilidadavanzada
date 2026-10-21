import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Globe, Landmark, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeUp, RiseLines, Section, ease } from "./primitives";
import { MarquiMark } from "./marqui-mark";
import { BigList, PartTitle, STICKY, Scrolly, StageCaption, TechniquePill, useWide } from "./dt-kit";
import { SKY } from "./sky";

/* ——— Técnica 1 · Clustering ———
   Told the way the class asks for it, and the way we'll say it in the video:
   what it is, why we picked it, how we applied it and what we got. The
   board and the choice are pinned to the screen and play with the scroll,
   so whoever presents only scrolls. */

type ClusterId = "consultas" | "procesos" | "web" | "reconocimiento";

const CLUSTERS: { id: ClusterId; name: string; says: string; area: string; head: string; ink: string }[] = [
  { id: "consultas", name: "Responder consultas", says: "Responder se come el día y no sabemos quién va a comprar.", area: "bg-[#fbe4e2]", head: "bg-[#f4c5c1]", ink: "text-[#8f2a22]" },
  { id: "procesos", name: "Procesos internos", says: "Nadie quiere cargar datos en otro sistema.", area: "bg-[#e7e3fa]", head: "bg-[#d0c8f4]", ink: "text-[#4b3b9a]" },
  { id: "web", name: "Página web", says: "La web depende de otro y no deja vender.", area: "bg-[#dcf3e3]", head: "bg-[#b6e5c5]", ink: "text-[#1d6b3c]" },
  { id: "reconocimiento", name: "Reconocimiento de MARQ", says: "La gente conoce los edificios, no a quien los hace.", area: "bg-[#e1ebfa]", head: "bg-[#c4d7f5]", ink: "text-[#23488f]" },
];

/* One idea per note, all from the interview notes. `aside`: notes that were left out of the groups, and why. */
const NOTES: { id: string; c: ClusterId | "aside"; text: string; why?: string }[] = [
  { id: "c1", c: "consultas", text: "Con pauta activa llegan unas 100 consultas por día." },
  { id: "c2", c: "consultas", text: "Contestar mensajes se lleva cuatro horas por día." },
  { id: "c3", c: "consultas", text: "Mucha gente pide rápido la información y no escribe mucho." },
  { id: "c4", c: "consultas", text: "Hablar manualmente con el cliente es demasiado trabajo." },
  { id: "c5", c: "consultas", text: "Siempre todo por mensaje, las consultas." },
  { id: "c6", c: "consultas", text: "Quizás tenés seis contactos hasta que concretás una venta." },
  { id: "c7", c: "consultas", text: "Es muy difícil retomar la conversación con el cliente una vez que no le contestó." },
  { id: "c8", c: "consultas", text: "Todavía no encuentran cómo clasificar quién es un cliente interesado." },
  { id: "c9", c: "consultas", text: "Se dio de baja el chatbot: mejores resultados de manera manual." },
  { id: "c10", c: "consultas", text: "A los clientes no les gustaba hablar con un chatbot." },
  { id: "c11", c: "consultas", text: "Ella quiere contactar a la persona para explicarle y saber su objetivo." },
  { id: "c12", c: "consultas", text: "La pauta se prueba sin datos: le encantaría hacerla más eficiente." },
  { id: "c13", c: "consultas", text: "32 casas en 120 cuotas: muchas consultas y ninguna venta." },
  { id: "p1", c: "procesos", text: "Demoran en la etapa de la documentación." },
  { id: "p2", c: "procesos", text: "Usan Trello, pero no todos quieren usarlo." },
  { id: "p3", c: "procesos", text: "Del software nuevo, solo algunas personas cargan la información." },
  { id: "p4", c: "procesos", text: "Tienen un servidor donde guardan todo, por fecha, etapa y rótulo." },
  { id: "p5", c: "procesos", text: "Trello y el servidor están separados: cargan todo dos veces." },
  { id: "p6", c: "procesos", text: "Al servidor no se puede entrar fuera de la oficina." },
  { id: "p7", c: "procesos", text: "Probaron ClickUp y no les sirvió: con Trello alcanzaba." },
  { id: "w1", c: "web", text: "Tienen que llamar a un proveedor externo y es demasiado lento." },
  { id: "w2", c: "web", text: "No logramos enlazar la página para que puedas señar o reservar." },
  { id: "w3", c: "web", text: "En la web solo puedo editar precios y cargar o bajar unidades. Muy básico." },
  { id: "w4", c: "web", text: "Para la landing y sumar un proyecto nuevo necesito del programador." },
  { id: "w5", c: "web", text: "Le da pereza entrar a la web a dar de alta y de baja proyectos." },
  { id: "w6", c: "web", text: "No conviene publicar todos los precios." },
  { id: "r1", c: "reconocimiento", text: "¿Cómo llegar al público? ¿Diario, redes?" },
  { id: "r2", c: "reconocimiento", text: "Pocos saben quién está detrás del proyecto." },
  { id: "r3", c: "reconocimiento", text: "Cada proyecto tiene identidad propia." },
  { id: "r4", c: "reconocimiento", text: "Quieren mostrar la trayectoria de MARQ para generar confianza." },
  { id: "r5", c: "reconocimiento", text: "La preventa es confianza: se compra algo que todavía no se ve." },
  { id: "r6", c: "reconocimiento", text: "Su diferencial: hacer cosas distintas en la ciudad." },
  { id: "a1", c: "aside", text: "Dos grandes clientes: consumidores finales e inversores.", why: "Dato, no dolor → Personas" },
  { id: "a2", c: "aside", text: "Es muy difícil trabajar con la municipalidad.", why: "No depende de MARQ" },
];

const count = (id: ClusterId) => NOTES.filter((n) => n.c === id).length;

/* ——— De la entrevista a las notas ———
   The interview notes as we typed them; a marker runs over one line and the
   idea in it lands on the Miro board as a note. Loops while on screen. */

const DOC: { raw: string; note?: string }[] = [
  { raw: "Estudio MARQ arranca como una desarrolladora, y luego como un estudio de arquitectura." },
  { raw: "En los contactos con el cliente es bastante manual. Habían empezado con un bot, lo dieron de baja.", note: "Se dio de baja el chatbot: mejores resultados de manera manual." },
  { raw: "Preventa es 20% más bajo; terminado, se vende entre 10 y 15% más alto." },
  { raw: "Todavía no encuentran cómo clasificar quién es un cliente interesado, o más potencial que otros.", note: "Todavía no encuentran cómo clasificar quién es un cliente interesado." },
  { raw: "Lleva tiempo actualizar la web, llamar a proveedores, sistema lento.", note: "Tienen que llamar a un proveedor externo y es demasiado lento." },
  { raw: "Gestión de consorcio la implementaron recientemente." },
  { raw: "Muy pocos conocen quiénes están detrás del proyecto.", note: "Pocos saben quién está detrás del proyecto." },
];
const MARKED = DOC.flatMap((d, i) => (d.note ? [i] : []));

function useLoop(n: number, ms: number) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const [beat, setBeat] = useState(reduce ? n - 1 : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    setBeat(0);
    const t = window.setInterval(() => setBeat((b) => (b + 1) % n), ms);
    return () => clearInterval(t);
  }, [inView, reduce, n, ms]);
  return { ref, beat };
}

function InterviewToNotes() {
  // One beat per marked line, then a beat holding all the notes.
  const { ref, beat } = useLoop(MARKED.length + 1, 2300);
  const shown = beat >= MARKED.length ? MARKED.length : beat + 1;
  return (
    <div ref={ref} className="relative w-full max-w-[40rem] rounded-[2rem] bg-[#f7f7f5] p-2.5 text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]">
      <div className="grid gap-4 rounded-[1.6rem] bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,#eef3f1_60%,#e3ebe8_100%)] p-5 ring-1 ring-black/[0.04] sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] sm:p-6">
        <div className="rounded-[0.9rem] bg-white p-5 shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.3)] ring-1 ring-black/[0.05]">
          <p className="text-[0.78rem] font-semibold text-ink-3">Anotaciones de la entrevista</p>
          <div className="mt-3 grid gap-2.5 text-[0.86rem] leading-[1.45] text-ink-2">
            {DOC.map((d, i) => {
              const on = beat < MARKED.length && MARKED[beat] === i;
              return (
                <p key={i} className="relative">
                  <motion.span aria-hidden initial={false} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: on ? 0.7 : 0.3, ease }} className="absolute -inset-x-1 -inset-y-0.5 origin-left rounded-[0.25rem] bg-[#fff3a3]" />
                  <span className="relative">{d.raw}</span>
                </p>
              );
            })}
          </div>
        </div>
        {/* What each marked line became, landing on a piece of the board. */}
        <div className="grid min-h-[14rem] content-start gap-2.5 rounded-[0.9rem] bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.1)_1px,transparent_1.2px)] bg-[length:18px_18px] p-3 ring-1 ring-black/[0.05]">
          <p className="text-[0.78rem] font-semibold text-ink-3">Tablero en Miro</p>
          <AnimatePresence initial={false}>
            {MARKED.slice(0, shown).map((line, k) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: -14, rotate: 0, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: k % 2 ? 1.6 : -1.8, scale: 1 }}
                transition={{ duration: 0.6, delay: k === shown - 1 && beat < MARKED.length ? 0.55 : 0, ease }}
                className={cn(STICKY, "p-3 text-[0.84rem] font-medium leading-snug")}
              >
                {DOC[line]!.note}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ——— El tablero ———
   `fit`: the board is drawn at a fixed shape and every size is in cqw, so it
   scales as a whole to fit the screen, like zooming out in Miro. Without
   `fit` (phones) it flows, already grouped. */

const LOOSE = (() => {
  const order = NOTES.map((_, i) => i);
  let seed = 11;
  for (let i = order.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  return order.map((i) => NOTES[i]!);
})();

const tilt = (i: number) => (((i * 37) % 11) - 5) * 1.1;
const BOARD_RATIO = 1.75;

function Sticky({ id, text, i, loose, fit, aside = false }: { id: string; text: string; i: number; loose: boolean; fit: boolean; aside?: boolean }) {
  return (
    <motion.div
      layoutId={`note-${id}`}
      transition={{ layout: { type: "spring", stiffness: 140, damping: 22, mass: 0.9, delay: i * 0.012 } }}
      initial={false}
      animate={{ rotate: loose ? tilt(i) : tilt(i) * 0.15 }}
      // Small on the zoomed-out board: hovering one brings it up to read it.
      whileHover={fit ? { scale: loose ? 1.25 : 1.9, rotate: 0, zIndex: 20 } : undefined}
      style={{ position: "relative" }}
      className={cn(
        STICKY,
        "flex items-start font-medium leading-[1.28]",
        fit ? (loose ? "min-h-[9.2cqw] p-[0.8cqw] text-[1.02cqw]" : "min-h-[4.5cqw] p-[0.5cqw] text-[0.84cqw]") : "min-h-[4.2rem] p-2.5 text-[0.85rem]",
        aside && "bg-white text-ink ring-1 ring-black/10",
      )}
    >
      {text}
    </motion.div>
  );
}

function Board({ step, fit }: { step: number; fit: boolean }) {
  const grouped = step >= 1;
  const f = (a: string, b: string) => (fit ? a : b);
  return (
    <motion.div
      layoutRoot
      className={cn("overflow-hidden bg-[#f4f3ef] bg-[radial-gradient(circle,rgb(0_0_0/0.09)_1px,transparent_1.2px)] shadow-[0_2.5rem_6rem_-2rem_rgb(1_40_36/0.45)] ring-1 ring-white/60", f("rounded-[1.6cqw] bg-[length:1.6cqw_1.6cqw] p-[1.5cqw]", "rounded-[1.5rem] bg-[length:20px_20px] p-3"))}
      style={fit ? { aspectRatio: BOARD_RATIO } : undefined}
    >
      <LayoutGroup>
        {grouped ? (
          <div className={cn("grid", f("grid-cols-4 gap-[0.8cqw]", "gap-3 sm:grid-cols-2"))}>
            {CLUSTERS.map((c, ci) => {
              const notes = NOTES.filter((n) => n.c === c.id);
              return (
                <motion.section key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 + ci * 0.08 }} className={cn("self-start", c.area, f("rounded-[1cqw] p-[0.5cqw]", "rounded-[1.1rem] p-2"))} aria-label={c.name}>
                  <header className={cn("flex items-center justify-between", c.head, f("gap-[0.5cqw] rounded-[0.7cqw] px-[0.8cqw] py-[0.55cqw]", "gap-2 rounded-[0.75rem] px-3 py-2"))}>
                    <h5 className={cn("font-semibold leading-tight tracking-tight", c.ink, f("text-[1.25cqw]", "text-[1rem]"))}>{c.name}</h5>
                    <span className={cn("shrink-0 rounded-full bg-white/70 font-semibold tabular-nums", c.ink, f("px-[0.6cqw] text-[0.9cqw]", "px-2.5 py-0.5 text-[0.8rem]"))}>{notes.length}</span>
                  </header>
                  <AnimatePresence initial={false}>
                    {step >= 2 && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.55, delay: ci * 0.12, ease }}
                        className="overflow-hidden"
                      >
                        <span className={cn("block rounded-[0.3rem] bg-[#ffc98f] font-semibold leading-snug text-[#4a2405] shadow-[0_0.6rem_1.2rem_-0.5rem_rgb(0_0_0/0.25)]", f("mt-[0.5cqw] p-[0.6cqw] text-[1.15cqw]", "mt-2 p-2.5 text-[0.95rem]"))}>{c.says}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className={cn("grid grid-cols-2", f("mt-[0.5cqw] gap-[0.4cqw]", "mt-2 gap-1.5"))}>
                    {notes.map((n) => (
                      <Sticky key={n.id} id={n.id} text={n.text} i={NOTES.indexOf(n)} loose={false} fit={fit} />
                    ))}
                  </div>
                </motion.section>
              );
            })}
            <motion.aside layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className={cn("grid border-dashed border-black/15", f("col-span-4 grid-cols-2 gap-[0.8cqw] rounded-[1cqw] border-[0.15cqw] p-[0.5cqw]", "gap-3 rounded-[1.1rem] border-2 p-2.5 sm:col-span-2 sm:grid-cols-2"))} aria-label="Lo que quedó afuera">
              {NOTES.filter((n) => n.c === "aside").map((n) => (
                <div key={n.id} className={cn("grid items-center", f("grid-cols-[11cqw_1fr] gap-[0.8cqw]", "grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-3"))}>
                  <Sticky id={n.id} text={n.text} i={NOTES.indexOf(n)} loose={false} fit={fit} aside={step >= 3} />
                  <AnimatePresence initial={false}>
                    {step >= 3 && (
                      <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className={cn("font-medium leading-snug text-ink-2", f("text-[1.05cqw]", "text-[0.95rem]"))}>
                        {n.why}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.aside>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-[0.8cqw]">
            {LOOSE.map((n) => (
              <Sticky key={n.id} id={n.id} text={n.text} i={NOTES.indexOf(n)} loose fit={fit} />
            ))}
          </div>
        )}
      </LayoutGroup>
    </motion.div>
  );
}

/* On screen, only the step's title: the explanation is said over it (it lives in the doc). */
const BOARD_STEPS = ["Una idea por nota", "Agrupadas por parecido", "Cada grupo, una frase", "Lo que no era un dolor"];

function BoardStage() {
  // One board only: notes share layout ids, so a second (hidden) copy would steal them.
  const wide = useWide();
  return (
    <Scrolly steps={BOARD_STEPS.length}>
      {(step) => (
        <>
          <StageCaption step={step} steps={BOARD_STEPS.length} title={BOARD_STEPS[step]} />
          {wide ? (
            /* The space left under the caption; the board takes the largest shape that fits in it. */
            <div className="relative mt-3 min-h-0 flex-1 [container-type:size]">
              <div className="mx-auto [container-type:inline-size]" style={{ width: `min(100cqw, calc(100cqh * ${BOARD_RATIO}))` }}>
                <Board step={step} fit />
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <Board step={step} fit={false} />
            </div>
          )}
        </>
      )}
    </Scrolly>
  );
}

/* ——— Cómo elegimos el problema ———
   Having the most notes is not enough. Each group answers the same three
   questions; every stretch of scroll answers one of them for all four, as
   a checklist on each tile. A group with a "no" stays for later. In the
   end only one has three yeses, and every group shows where it went. */

const QUESTIONS = [
  { title: "¿Es un dolor para MARQ?", short: "Es un dolor para MARQ" },
  { title: "¿MARQ lo puede resolver por su cuenta?", short: "MARQ lo resuelve sola" },
  { title: "¿Es lo que hoy frena las ventas?", short: "Frena las ventas hoy" },
];

/* Each group's answers; a "no" carries its reason, in a few words. */
const ANSWERS: Record<ClusterId, { yes: [boolean, boolean, boolean]; no: [string?, string?, string?]; to: string; mark: ReactNode }> = {
  consultas: { yes: [true, true, true], no: [], to: "MARQui y MARQador", mark: <MarquiMark tone="light" className="size-5" title="" /> },
  procesos: { yes: [false, true, false], no: ["«La información está»", undefined, "Es interno, no llega al cliente"], to: "Regla: nada de sistemas nuevos", mark: <MessageCircle className="size-4" /> },
  web: { yes: [true, false, false], no: [undefined, "Depende del programador", "La venta es uno a uno"], to: "Lo que viene", mark: <Globe className="size-4" /> },
  reconocimiento: { yes: [true, true, false], no: [undefined, undefined, "Ya llegan 100 consultas por día"], to: "MARQ Alloy", mark: <Landmark className="size-4" /> },
};

const PICK_STEPS: { title: string; text?: string }[] = [
  { title: "Tres preguntas para cada grupo", text: "Si un grupo responde que no a alguna, queda para más adelante." },
  { title: QUESTIONS[0]!.title },
  { title: QUESTIONS[1]!.title },
  { title: QUESTIONS[2]!.title },
  { title: "El único con tres sí" },
  { title: "Los otros no se descartaron" },
];

function Answer({ yes }: { yes: boolean | null }) {
  return (
    <span className="relative grid size-7 shrink-0 place-items-center">
      <span className="absolute inset-0 rounded-full ring-2 ring-inset ring-black/10" />
      <AnimatePresence>
        {yes !== null && (
          <motion.span
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: "spring", stiffness: 460, damping: 24 }}
            className={cn("absolute inset-0 grid place-items-center rounded-full text-white", yes ? "bg-[linear-gradient(135deg,#19d3b4,#014645)]" : "bg-ink")}
          >
            {yes ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function PickStage() {
  const last = PICK_STEPS.length - 1;
  return (
    <Scrolly steps={PICK_STEPS.length} className="justify-center">
      {(step) => (
        <>
          <StageCaption step={step} steps={PICK_STEPS.length} title={PICK_STEPS[step]!.title} text={PICK_STEPS[step]!.text} />
          <div className="mx-auto mt-8 grid w-full max-w-[84rem] gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {CLUSTERS.map((c) => {
              const a = ANSWERS[c.id];
              const asked = Math.min(step, QUESTIONS.length);
              const landed = step >= last;
              const failed = !landed && a.yes.slice(0, asked).includes(false);
              const won = c.id === "consultas" && step === last - 1;
              return (
                <motion.article
                  key={c.id}
                  animate={{ opacity: failed ? 0.55 : 1, y: won ? -10 : 0, scale: failed ? 0.98 : 1 }}
                  transition={{ duration: 0.6, ease }}
                  className={cn("flex flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f5] text-ink shadow-[0_2rem_4rem_-2rem_rgb(1_30_27/0.45)]", won && "ring-4 ring-white")}
                >
                  <div className={cn("m-2.5 grid content-between gap-4 rounded-[1.6rem] p-5 transition-[filter] duration-700", c.area, failed && "grayscale")}>
                    <span className={cn("text-[clamp(1.05rem,1.2vw,1.25rem)] font-semibold leading-tight tracking-tight", c.ink)}>{c.name}</span>
                    <span className="flex items-end gap-2">
                      <span className={cn("text-[clamp(2.6rem,3.8vw,3.8rem)] font-bold leading-[0.85] tracking-[-0.05em] tabular-nums", c.ink)}>{count(c.id)}</span>
                      <span className={cn("pb-1 text-[0.95rem] font-medium", c.ink)}>notas</span>
                    </span>
                  </div>
                  {/* The checklist: one row per question, answered as the scroll reaches it. */}
                  <ul className="grid gap-2.5 px-5 pb-2 pt-2">
                    {QUESTIONS.map((q, qi) => {
                      const shown = qi < asked;
                      const no = shown && !a.yes[qi];
                      return (
                        <li key={q.short} className={cn("flex items-start gap-3 transition-opacity duration-500", qi === asked - 1 || landed ? "opacity-100" : shown ? "opacity-80" : "opacity-45")}>
                          <Answer yes={shown ? a.yes[qi]! : null} />
                          <span className="min-w-0 pt-0.5 leading-tight">
                            <span className="block text-[clamp(0.92rem,1vw,1.05rem)] font-medium">{q.short}</span>
                            <AnimatePresence initial={false}>
                              {no && a.no[qi] && (
                                <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }} className="block overflow-hidden text-[clamp(0.82rem,0.9vw,0.95rem)] text-ink-3">
                                  <span className="block pt-0.5">{a.no[qi]}</span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-auto min-h-[3.6rem] px-5 pb-5 pt-3">
                    <AnimatePresence mode="wait" initial={false}>
                      {landed ? (
                        <motion.p key="to" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }} className="flex items-center gap-2.5 border-t border-line pt-3 text-[clamp(1rem,1.1vw,1.15rem)] font-semibold leading-snug">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white">{a.mark}</span>
                          {a.to}
                        </motion.p>
                      ) : won ? (
                        <motion.p key="won" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }} className="border-t border-line pt-3 text-[clamp(0.95rem,1.05vw,1.1rem)] font-semibold leading-snug">
                          «Estar contestando mensajes cuatro horas…»
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </>
      )}
    </Scrolly>
  );
}

export function Clustering() {
  return (
    <>
      <Section sky={SKY.noon} id="clustering" className="py-28 sm:py-40" aria-labelledby="clustering-title">
        <TechniquePill id="clustering" />
        <div className="mx-auto mt-6 grid max-w-[60rem] justify-items-center text-center">
          <RiseLines id="clustering-title" lines={["Clustering"]} className="display sky-type text-[clamp(3.4rem,8vw,8.5rem)]" />
          <FadeUp delay={0.15}>
            <p className="sky-type mt-5 text-[clamp(1.2rem,2vw,2.1rem)] font-medium text-white/85">Una idea por nota, agrupadas por parecido.</p>
          </FadeUp>
        </div>

        <article className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 sm:mt-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <FadeUp className="flex min-w-0 justify-center">
            <InterviewToNotes />
          </FadeUp>
          <FadeUp delay={0.1} className="grid gap-5">
            <h3 className="display sky-type text-[clamp(2.4rem,4vw,4.4rem)] font-bold!">¿Por qué la elegimos?</h3>
            <BigList items={["1 hora de entrevista", "Decenas de temas", "Ningún problema claro"]} />
          </FadeUp>
        </article>
      </Section>

      <Section sky={SKY.noon} id="clustering-aplicacion" className="pt-12 sm:pt-20" aria-labelledby="aplicacion-title">
        <PartTitle id="aplicacion-title">¿Cómo la aplicamos?</PartTitle>
        <BoardStage />
      </Section>

      <Section sky={SKY.noon} id="clustering-eleccion" className="pt-24 sm:pt-32" aria-labelledby="eleccion-title">
        <PartTitle id="eleccion-title">¿Cómo elegimos el problema?</PartTitle>
        <PickStage />
      </Section>

      <Section sky={SKY.noon} id="clustering-resultado" className="py-28 sm:py-40" aria-labelledby="resultado-title">
        <PartTitle id="resultado-title">¿Qué obtuvimos?</PartTitle>
        <div className="mx-auto mt-12 grid max-w-[72rem] justify-items-center text-center">
          <RiseLines as="h3" lines={["MARQ no tiene un problema de demanda.", <em key="e" className="text-white/70">Tiene un problema para saber quién está realmente interesado.</em>]} className="display sky-type text-[clamp(1.9rem,4.2vw,4.6rem)]" />
          <FadeUp delay={0.2}>
            <span className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-white py-2 pl-2 pr-5 text-[clamp(1rem,1.2vw,1.25rem)] font-semibold text-ink shadow-[0_1rem_2rem_-1rem_rgb(1_30_27/0.5)]">
              <span className="grid size-8 place-items-center rounded-full bg-[linear-gradient(135deg,#19d3b4,#014645)] text-white">
                <Check className="size-4" />
              </span>
              Validado con Cande
            </span>
          </FadeUp>
        </div>
      </Section>
    </>
  );
}
