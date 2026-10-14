import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Clock, Download, FileText, MessageCircle, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowserFrame, FadeUp, RiseLines, Section, ease } from "./primitives";
import { Brothers } from "./brothers";
import { MarqadorIntro } from "./marqador-intro";
import { MarqadorMark } from "./marqador-mark";
import { SKY } from "./sky";

/* ——— MARQador ———
   One screen per decision. Every chart is a single series: one hue, the
   bar that matters lit, the rest recessive, values labelled directly. */

export type ScreenId = "pauta" | "demanda" | "contactos" | "frenos" | "semana";

export const screens: { id: ScreenId; label: string; question: string }[] = [
  { id: "pauta", label: "Pauta", question: "¿Dónde conviene poner la plata?" },
  { id: "demanda", label: "Demanda", question: "¿Qué piden y cómo piensan pagar?" },
  { id: "contactos", label: "Contactos", question: "¿A quién llamo o invito?" },
  { id: "frenos", label: "Frenos", question: "¿Por qué no avanzan?" },
  { id: "semana", label: "Semana", question: "¿Cómo venimos?" },
];

export function MarqadorSection() {
  return (
    <>
    {/* The reveal happens at night, so MARQador's orange glows like in the brand artwork. */}
    <Section sky={SKY.night} id="marqador" data-brand="marqador" aria-label="MARQador">
      <div className="-mx-4 sm:-mx-8 lg:-mx-12">
        <MarqadorIntro />
      </div>
    </Section>
    <Brothers />
    <Section sky={SKY.dusk} data-brand="marqador" className="pb-28 sm:pb-40" aria-label="El tablero de MARQador">
      <div className="mx-auto max-w-[90rem] pt-24">
        <RiseLines lines={["Lo que pide el mercado,", <em key="e">a la vista.</em>]} className="display sky-type text-[clamp(2.2rem,5.8vw,7.4rem)]" />

        <FadeUp className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <p className="paper rounded-[1.5rem] px-6 py-5 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-[1.45] sm:px-8 sm:py-6">
            Hoy, para saber qué pide el mercado hay que leer chat por chat. MARQador lo junta todo en un tablero que se abre <b>en una pestaña nueva</b> desde WhatsApp Web. Cada pantalla responde una pregunta del negocio.
          </p>
          <div className="paper flex flex-col justify-center gap-3 rounded-[1.5rem] px-6 py-5 sm:px-8">
            <span className="eyebrow text-ink-3">También llega por WhatsApp</span>
            <ul className="grid gap-2 text-[clamp(1.02rem,1.3vw,1.3rem)] font-medium">
              <li className="flex items-center gap-3"><Clock className="size-5 text-orange-deep" /> Resumen cada mañana</li>
              <li className="flex items-center gap-3"><FileText className="size-5 text-orange-deep" /> Reporte semanal y mensual en PDF</li>
              <li className="flex items-center gap-3"><MessageCircle className="size-5 text-orange-deep" /> Respuestas a lo que le preguntes</li>
            </ul>
          </div>
        </FadeUp>

        <FadeUp className="mt-10">
          <Marqador />
        </FadeUp>
      </div>
    </Section>
    </>
  );
}

/** The dashboard itself; the day demo mounts it on one screen. */
export function Marqador({ initial = "pauta", className }: { initial?: ScreenId; className?: string }) {
  const [screen, setScreen] = useState<ScreenId>(initial);
  const current = screens.find((s) => s.id === screen)!;
  return (
    <BrowserFrame
      url="marqador.marq.com.ar"
      className={className}
      badge={<span className="hidden items-center gap-1.5 rounded-md bg-[#fdeee3] px-2 py-1 text-[0.72rem] font-medium text-orange-deep sm:flex">Pestaña nueva</span>}
    >
      <div className="text-ink">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line px-5 py-4 sm:px-8">
          <span className="flex items-center gap-2 font-display text-[1.35rem] font-bold tracking-[-0.03em]">
            <MarqadorMark className="size-7" /> MARQador
          </span>
          <span className="rounded-full bg-teal-soft px-3 py-1 text-[0.85rem] font-semibold text-teal">Módulo de MARQui</span>
          <span className="text-[0.95rem] text-ink-3">Semana del 6 al 12 de octubre · Líneas de pauta y clientes</span>
          <a href="/?app=marqador" target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[0.9rem] font-medium text-white transition-transform hover:-translate-y-0.5">
            Abrir en una pestaña ↗
          </a>
        </div>
        <div role="tablist" aria-label="Pantallas de MARQador" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-3 sm:px-6">
          {screens.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={screen === s.id}
              onClick={() => setScreen(s.id)}
              className={cn("relative shrink-0 px-4 py-3.5 text-[1.02rem] font-semibold transition-colors", screen === s.id ? "text-ink" : "text-ink-3 hover:text-ink-2")}
            >
              {s.label}
              {screen === s.id && <motion.span layoutId={`tab-line-${initial}`} className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-orange" />}
            </button>
          ))}
        </div>
        <div className="min-h-[34rem] px-5 py-7 sm:px-8 sm:py-9">
          <AnimatePresence mode="wait">
            <motion.div key={screen} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
              <h3 className="font-display text-[clamp(1.3rem,2vw,2.05rem)] font-bold leading-tight tracking-[-0.03em]">{current.question}</h3>
              <div className="mt-7">{views[screen]}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </BrowserFrame>
  );
}

/* ——— Pieces ——— */

function Takeaway({ children }: { children: ReactNode }) {
  return <p className="mt-7 rounded-2xl bg-[#fdeee3] px-5 py-4 text-[clamp(1.02rem,1.3vw,1.3rem)] leading-snug text-ink">💡 {children}</p>;
}

/** A thin horizontal bar, anchored left, value labelled at its end. */
function Bar({ pct, lit, max = 100, label, delay = 0 }: { pct: number; lit?: boolean; max?: number; label: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-center gap-3">
      <span className="relative h-3.5 flex-1 rounded-full bg-paper-2">
        <motion.span
          className={cn("absolute inset-y-0 left-0 rounded-full", lit ? "bg-orange" : "bg-[#f2c4a2]")}
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${(pct / max) * 100}%` }}
          transition={{ duration: 0.9, delay, ease }}
        />
      </span>
      <span className={cn("min-w-[3.6rem] shrink-0 whitespace-nowrap text-right text-[1.05rem] tabular-nums", lit ? "font-bold text-ink" : "text-ink-2")}>{label}</span>
    </span>
  );
}

/* ——— Screens ——— */

const pauta = [
  { name: "Instagram · «Collection 2D»", consultas: 180, interesados: 13, reservas: 1 },
  { name: "Facebook · «Lotes Fontana»", consultas: 96, interesados: 11, reservas: 2 },
  { name: "Google · búsqueda", consultas: 41, interesados: 8, reservas: 1 },
  { name: "Formulario de la web", consultas: 34, interesados: 9, reservas: 2 },
  { name: "Recomendación de clientes", consultas: 25, interesados: 11, reservas: 3 },
];

function Pauta() {
  const rows = pauta.map((r) => ({ ...r, pct: Math.round((r.interesados / r.consultas) * 100) }));
  const best = Math.max(...rows.map((r) => r.pct));
  return (
    <>
      {/* Phones: one row per channel, the bar is the point. */}
      <ul className="grid gap-4 md:hidden">
        {rows.map((r, i) => (
          <li key={r.name} className="border-t border-line pt-3">
            <span className={cn("block text-[1.02rem]", r.pct === best ? "font-bold" : "text-ink-2")}>{r.name}</span>
            <span className="mb-2 block text-[0.85rem] text-ink-3">
              {r.consultas} consultas · {r.reservas} {r.reservas === 1 ? "reserva" : "reservas"}
            </span>
            <Bar pct={r.pct} max={50} lit={r.pct === best} label={`${r.pct}%`} delay={0.1 + i * 0.06} />
          </li>
        ))}
      </ul>
      <div className="overflow-x-auto max-md:hidden">
        <table className="w-full min-w-[40rem] text-left">
          <thead>
            <tr className="text-[0.85rem] text-ink-3">
              <th className="pb-3 font-medium">Canal o anuncio</th>
              <th className="pb-3 text-right font-medium">Consultas</th>
              <th className="w-[42%] pb-3 pl-8 font-medium">Llegan a Interesado</th>
              <th className="pb-3 text-right font-medium">Reservas</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name} className="border-t border-line">
                <td className={cn("py-3.5 pr-4 text-[1.05rem]", r.pct === best ? "font-bold" : "text-ink-2")}>{r.name}</td>
                <td className="py-3.5 text-right text-[1.05rem] tabular-nums text-ink-2">{r.consultas}</td>
                <td className="py-3.5 pl-8">
                  <Bar pct={r.pct} max={50} lit={r.pct === best} label={`${r.pct}%`} delay={0.1 + i * 0.06} />
                </td>
                <td className="py-3.5 text-right text-[1.05rem] tabular-nums text-ink-2">{r.reservas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Takeaway>
        Instagram trae más consultas, pero solo el 7% avanza. <b>Las recomendaciones traen 6 veces más interesados por consulta.</b>
      </Takeaway>
    </>
  );
}

const demanda = {
  collection: {
    label: "MARQ Collection",
    blocks: [
      { title: "Qué buscan", rows: [["1 dormitorio", 18], ["2 dormitorios", 55], ["3 dormitorios", 27]] },
      { title: "Para qué", rows: [["Invertir", 62], ["Vivir", 38]] },
      { title: "Cómo piensan pagar", rows: [["Crédito", 48], ["Contado", 22], ["Financiación propia", 21], ["No lo dijo", 9]] },
    ],
    takeaway: <>Más de la mitad pide 2 dormitorios y casi la mitad pagaría con crédito: <b>hay demanda para un producto apto crédito.</b></>,
  },
  fontana: {
    label: "Lotes Fontana",
    blocks: [
      { title: "Qué buscan", rows: [["Lote de 300 m²", 46], ["Lote de 400 m²", 34], ["Lote de 600 m²", 20]] },
      { title: "Para qué", rows: [["Construir y vivir", 71], ["Invertir", 29]] },
      { title: "Cómo piensan pagar", rows: [["Financiación propia", 58], ["Contado", 30], ["Crédito", 6], ["No lo dijo", 6]] },
    ],
    takeaway: <>Familias que quieren construir y necesitan cuotas: <b>conviene destacar la financiación propia en los anuncios.</b></>,
  },
} as const;

function Demanda() {
  const [project, setProject] = useState<keyof typeof demanda>("collection");
  const data = demanda[project];
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2" role="radiogroup" aria-label="Proyecto">
        {(Object.keys(demanda) as (keyof typeof demanda)[]).map((k) => (
          <button key={k} role="radio" aria-checked={project === k} onClick={() => setProject(k)} className={cn("rounded-full px-4 py-2 text-[0.98rem] font-semibold transition-colors", project === k ? "bg-ink text-white" : "bg-paper-2 text-ink-2 hover:bg-line")}>
            {demanda[k].label}
          </button>
        ))}
      </div>
      <div key={project} className="grid gap-8 md:grid-cols-3">
        {data.blocks.map((b) => {
          const top = Math.max(...b.rows.map((r) => r[1]));
          return (
            <div key={b.title}>
              <h4 className="eyebrow mb-4 text-ink-3">{b.title}</h4>
              <ul className="grid gap-3.5">
                {b.rows.map(([name, v], i) => (
                  <li key={name}>
                    <span className={cn("mb-1.5 block text-[1.02rem]", v === top ? "font-bold" : "text-ink-2")}>{name}</span>
                    <Bar pct={v} lit={v === top} label={`${v}%`} delay={0.08 * i} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <Takeaway>{data.takeaway}</Takeaway>
    </>
  );
}

const contactos = [
  { name: "Juan Pérez", busca: "2 dorm", paga: "Crédito", marca: "", hace: "hoy" },
  { name: "Marta Ríos", busca: "3 dorm", paga: "Contado", marca: "Reaparece", hace: "hoy" },
  { name: "Pablo Sosa", busca: "1 dorm", paga: "Contado", marca: "Cliente", hace: "ayer" },
  { name: "Sofía Acosta", busca: "2 dorm", paga: "¿?", marca: "Referida", hace: "hace 2 días" },
  { name: "Diego Romero", busca: "2 dorm", paga: "Financiación", marca: "", hace: "hace 3 días" },
];

function Contactos() {
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {["MARQ Collection", "Busca: invertir", "Etapa: Interesado"].map((f) => (
          <span key={f} className="inline-flex items-center gap-2 rounded-full bg-paper-2 py-1.5 pl-4 pr-2.5 text-[0.98rem] font-medium">
            {f} <X className="size-4 text-ink-3" aria-hidden />
          </span>
        ))}
        <button className="ml-auto inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-[1rem] font-semibold text-white">
          <Download className="size-4.5" /> Exportar a Excel · 9
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left">
          <thead>
            <tr className="text-[0.85rem] text-ink-3">
              {["Nombre", "Busca", "Paga", "Marca", "Última charla"].map((h) => (
                <th key={h} className="pb-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[1.05rem]">
            {contactos.map((c) => (
              <tr key={c.name} className="border-t border-line">
                <td className="py-3.5 font-semibold">{c.name}</td>
                <td className="py-3.5 text-ink-2">{c.busca}</td>
                <td className={cn("py-3.5", c.paga === "¿?" ? "text-ink-3" : "text-ink-2")}>{c.paga}</td>
                <td className="py-3.5">{c.marca && <span className="rounded-full bg-sun px-2.5 py-1 text-[0.85rem] font-semibold text-ink">{c.marca}</span>}</td>
                <td className="py-3.5 text-ink-3">{c.hace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Takeaway>
        Una lista lista para invitar al evento de lanzamiento. <b>También se la podés pedir a MARQui por chat.</b>
      </Takeaway>
    </>
  );
}

const frenos: [string, number][] = [
  ["Financiación", 38],
  ["Precio", 24],
  ["Fecha de entrega", 16],
  ["Ubicación", 12],
  ["Tamaño", 10],
];

const unanswered: [string, number][] = [
  ["¿Aceptan un auto como parte de pago?", 7],
  ["¿Las unidades tienen cochera?", 5],
  ["¿Se puede escriturar a nombre de una empresa?", 3],
];

function Frenos() {
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h4 className="eyebrow mb-4 text-ink-3">Tema en el que se cortó la charla</h4>
          <ul className="grid gap-3.5">
            {frenos.map(([name, v], i) => (
              <li key={name}>
                <span className={cn("mb-1.5 block text-[1.02rem]", i === 0 ? "font-bold" : "text-ink-2")}>{name}</span>
                <Bar pct={v} max={40} lit={i === 0} label={`${v}%`} delay={0.07 * i} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow mb-4 text-ink-3">Lo que MARQui no supo responder</h4>
          <ul className="grid gap-2.5">
            {unanswered.map(([q, n]) => (
              <li key={q} className="flex items-center justify-between gap-4 rounded-2xl bg-paper-2 px-4 py-3.5 ring-1 ring-ink/5">
                <span className="text-[1.02rem] leading-snug">{q}</span>
                <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.9rem] font-semibold tabular-nums">{n} veces</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Takeaway>
        4 de cada 10 que no avanzan se frenan en la financiación. <b>Ahí está la próxima mejora de la oferta.</b>
      </Takeaway>
    </>
  );
}

const tiles = [
  { label: "Consultas", value: "112", delta: "+14%", dir: "up" as const },
  { label: "Nuevos interesados", value: "19", delta: "+5", dir: "up" as const },
  { label: "Reservas", value: "3", delta: "igual", dir: "flat" as const },
  { label: "Chats sin responder", value: "4", delta: "−3", dir: "down" as const },
];

function Semana() {
  const reduce = useReducedMotion();
  const how = [
    { label: "Elegida tal cual", v: 61, color: "#ec8f55" },
    { label: "Corregida", v: 27, color: "#c4561b" },
    { label: "Escrita de cero", v: 12, color: "#7f340e" },
  ];
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((t) => {
          const Icon = t.dir === "up" ? ArrowUpRight : t.dir === "down" ? ArrowDownRight : Minus;
          return (
            <div key={t.label} className="rounded-2xl bg-paper-2 p-5 ring-1 ring-ink/5">
              <span className="text-[0.95rem] text-ink-3">{t.label}</span>
              <span className="mt-1 block font-sans text-[clamp(2.2rem,3.4vw,3.4rem)] font-bold leading-none tracking-[-0.03em]">{t.value}</span>
              <span className={cn("mt-2 inline-flex items-center gap-1 text-[0.9rem] font-semibold", t.dir === "flat" ? "text-ink-3" : "text-orange-deep")}>
                <Icon className="size-4" /> {t.delta} <span className="font-normal text-ink-3">vs. semana anterior</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-paper-2 p-6 ring-1 ring-ink/5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-[1.2rem] font-bold">Tiempo ahorrado con MARQui</h4>
            <span className="font-display text-[clamp(1.4rem,2vw,2rem)] font-bold tracking-[-0.03em] text-orange-deep">≈ 5 h esta semana</span>
          </div>
          <p className="mt-1 text-[0.95rem] text-ink-3">Tiempo promedio por respuesta, desde que abrís el chat hasta que enviás.</p>
          <div className="mt-5 grid gap-4">
            {[
              { label: "Sin MARQui · buscar el dato y escribir de cero", v: 190, text: "3 min 10 s", lit: false },
              { label: "Con MARQui · elegir y corregir", v: 40, text: "40 s", lit: true },
            ].map((r, i) => (
              <div key={r.label}>
                <span className={cn("mb-1.5 block text-[1rem]", r.lit ? "font-bold" : "text-ink-2")}>{r.label}</span>
                <Bar pct={r.v} max={190} lit={r.lit} label={r.text} delay={0.15 * i} />
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.85rem] text-ink-3">126 respuestas con sugerencia × 2 min 30 s ≈ 5 h, dentro de lo que muestran los estudios. Se compara con las 2 semanas de medición sin sugerencias.</p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl bg-paper-2 p-6 ring-1 ring-ink/5">
            <h4 className="text-[1.2rem] font-bold">Primera respuesta</h4>
            <p className="mt-1 font-display text-[clamp(1.4rem,2vw,2rem)] font-bold tracking-[-0.03em]">9 min <span className="text-[1rem] font-medium tracking-normal text-ink-3">promedio</span></p>
            <p className="mt-1 text-[0.95rem] text-ink-3">Pauta 7 min · Clientes 14 min</p>
          </div>
          <div className="rounded-2xl bg-paper-2 p-6 ring-1 ring-ink/5">
            <h4 className="text-[1.2rem] font-bold">Cómo se respondió</h4>
            <div className="mt-4 flex h-4 gap-[2px] overflow-hidden rounded-full" role="img" aria-label="61% elegida tal cual, 27% corregida, 12% escrita de cero">
              {how.map((h, i) => (
                <motion.span key={h.label} style={{ background: h.color }} initial={reduce ? false : { flexGrow: 0 }} animate={{ flexGrow: h.v }} transition={{ duration: 0.9, delay: 0.1 * i, ease }} className="h-full basis-0" />
              ))}
            </div>
            <ul className="mt-3 grid gap-1 text-[0.95rem]">
              {how.map((h) => (
                <li key={h.label} className="flex items-center gap-2">
                  <span className="size-3 rounded-sm" style={{ background: h.color }} /> {h.label} <b className="ml-auto tabular-nums">{h.v}%</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export const views: Record<ScreenId, ReactNode> = {
  pauta: <Pauta />,
  demanda: <Demanda />,
  contactos: <Contactos />,
  frenos: <Frenos />,
  semana: <Semana />,
};
