import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Clock, Download, FileText, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrowserFrame, FadeUp, RiseLines, Section, ease } from "./primitives";
import { Brothers } from "./brothers";
import { MarqadorBoard } from "./marqador-board";
import { MarqadorIntro } from "./marqador-intro";
import { MarqadorMark } from "./marqador-mark";
import { BarChart } from "@/components/arc/bar-chart/bar-chart";
import { LineChart } from "@/components/arc/line-chart/line-chart";
import { DonutChart } from "@/components/arc/donut-chart/donut-chart";
import { Gauge } from "@/components/arc/gauge/gauge";
import { MetricCard } from "@/components/arc/metric-card/metric-card";
import SegmentedControl from "@/components/arc/segmented-control/segmented-control";
import { SlotText } from "@/components/arc/slot-text/slot-text";
import { SortableDataTable } from "@/components/arc/sortable-data-table/sortable-data-table";
import { Sparkline } from "@/components/arc/sparkline/sparkline";
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
            Hoy, las decisiones de pauta y de producto se toman sin datos: en un lanzamiento llegaron 500 consultas y no hubo forma de saber cuántas personas podían comprar sin revisar los chats uno por uno. <b>MARQador convierte esas conversaciones en información</b>: un tablero que se abre en una pestaña desde WhatsApp Web, donde cada pantalla responde una pregunta del negocio.
          </p>
          <div className="paper flex flex-col justify-center gap-3 rounded-[1.5rem] px-6 py-5 sm:px-8">
            <span className="eyebrow text-ink-3">También llega por WhatsApp</span>
            <ul className="grid gap-2 text-[clamp(1.02rem,1.3vw,1.3rem)] font-medium">
              <li className="flex items-center gap-3"><FileText className="size-5 text-orange-deep" /> Resumen semanal en PDF, con tus seguidos</li>
              <li className="flex items-center gap-3"><Clock className="size-5 text-orange-deep" /> Reporte mensual, guardado en MARQador</li>
              <li className="flex items-center gap-3"><MessageCircle className="size-5 text-orange-deep" /> Y cualquier dato, preguntándole a MARQui</li>
            </ul>
          </div>
        </FadeUp>

        <FadeUp className="mt-10">
          <MarqadorBoard />
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
      className={cn("arc-marqador", className)}
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

const trend = [
  { key: "w1", label: "Semana del 1 de septiembre", axisLabel: "1 sep", values: { reco: 5, insta: 9, web: 4 } },
  { key: "w2", label: "Semana del 8 de septiembre", axisLabel: "8 sep", values: { reco: 6, insta: 11, web: 5 } },
  { key: "w3", label: "Semana del 15 de septiembre", axisLabel: "15 sep", values: { reco: 7, insta: 10, web: 6 } },
  { key: "w4", label: "Semana del 22 de septiembre", axisLabel: "22 sep", values: { reco: 8, insta: 12, web: 6 } },
  { key: "w5", label: "Semana del 29 de septiembre", axisLabel: "29 sep", values: { reco: 9, insta: 14, web: 7 } },
  { key: "w6", label: "Semana del 6 de octubre", axisLabel: "6 oct", values: { reco: 11, insta: 13, web: 9 } },
];

function Pauta() {
  const rows = pauta.map((r) => ({ ...r, pct: Math.round((r.interesados / r.consultas) * 100) }));
  const best = Math.max(...rows.map((r) => r.pct));
  return (
    <>
      <div className="mb-8">
        <LineChart
          label="Interesados por semana"
          categoryLabel="Semana"
          height={200}
          data={trend}
          series={[
            { key: "reco", label: "Recomendación de clientes" },
            { key: "insta", label: "Instagram" },
            { key: "web", label: "Formulario de la web", dashed: true },
          ]}
          formatValue={(v) => `${Math.round(v)}`}
        />
      </div>
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
  const [busca, para, paga] = data.blocks;
  // The donuts count people, not percentages: the centre reads «41 consultas».
  const total = project === "collection" ? 41 : 35;
  const donut = (rows: readonly (readonly [string, number])[]) => {
    const out = rows.map(([label, pct]) => ({ key: label, label, value: Math.round((pct * total) / 100) }));
    // Rounding can drift by one; the largest slice absorbs it so every donut adds up to the same total.
    const drift = total - out.reduce((a, x) => a + x.value, 0);
    out.reduce((m, x) => (x.value > m.value ? x : m)).value += drift;
    return out;
  };
  return (
    <>
      <SegmentedControl
        label="Proyecto"
        value={project}
        onValueChange={(v) => setProject(v as keyof typeof demanda)}
        options={(Object.keys(demanda) as (keyof typeof demanda)[]).map((k) => ({ value: k, label: demanda[k].label }))}
        className="mb-7"
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
        <div>
          <h4 className="eyebrow mb-4 text-ink-3">{busca!.title}</h4>
          <ul key={project} className="grid gap-3.5">
            {busca!.rows.map(([name, v], i) => {
              const top = Math.max(...busca!.rows.map((r) => r[1]));
              return (
                <li key={name}>
                  <span className={cn("mb-1.5 block text-[1.02rem]", v === top ? "font-bold" : "text-ink-2")}>{name}</span>
                  <Bar pct={v} lit={v === top} label={`${v}%`} delay={0.08 * i} />
                </li>
              );
            })}
          </ul>
        </div>
        {/* The arcs morph between projects: same keys keep their colour. */}
        <div>
          <h4 className="eyebrow mb-4 text-ink-3">{para!.title}</h4>
          <DonutChart data={donut(para!.rows)} label={para!.title} totalLabel="Consultas" size={200} thickness={26} />
        </div>
        <div>
          <h4 className="eyebrow mb-4 text-ink-3">{paga!.title}</h4>
          <DonutChart data={donut(paga!.rows)} label={paga!.title} totalLabel="Consultas" size={200} thickness={26} />
        </div>
      </div>
      <Takeaway>{data.takeaway}</Takeaway>
    </>
  );
}

const contactos = [
  { name: "Juan Pérez", busca: "2 dorm", paga: "Crédito", marca: "", hace: "hoy", dias: 0 },
  { name: "Marta Ríos", busca: "3 dorm", paga: "Contado", marca: "Reaparece", hace: "hoy", dias: 0.1 },
  { name: "Pablo Sosa", busca: "1 dorm", paga: "Contado", marca: "Cliente", hace: "ayer", dias: 1 },
  { name: "Sofía Acosta", busca: "2 dorm", paga: "¿?", marca: "Referida", hace: "hace 2 días", dias: 2 },
  { name: "Diego Romero", busca: "2 dorm", paga: "Financiación", marca: "", hace: "hace 3 días", dias: 3 },
  { name: "Lucía Benítez", busca: "2 dorm", paga: "Crédito", marca: "", hace: "hace 4 días", dias: 4 },
  { name: "Andrés Molina", busca: "1 dorm", paga: "Contado", marca: "", hace: "hace 5 días", dias: 5 },
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
      {/* Sort by any column, tick who to invite. */}
      <SortableDataTable
        rows={contactos}
        rowKey="name"
        caption="Interesados de MARQ Collection que buscan invertir"
        itemName={{ one: "contacto", other: "contactos" }}
        selectable
        defaultSort={{ key: "dias", direction: "asc" }}
        columns={[
          { key: "name", label: "Nombre", sortable: true },
          { key: "busca", label: "Busca", sortable: true },
          { key: "paga", label: "Paga", sortable: true, render: (v) => <span className={v === "¿?" ? "text-ink-3" : undefined}>{String(v)}</span> },
          { key: "marca", label: "Marca", render: (v) => (v ? <span className="rounded-full bg-[#fdeee3] px-2.5 py-1 text-[0.85rem] font-semibold text-orange-deep">{String(v)}</span> : null) },
          { key: "dias", label: "Última charla", sortable: true, numeric: true, render: (_v, row) => <span className="text-ink-3">{(row as (typeof contactos)[number]).hace}</span> },
        ]}
      />
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


function Semana() {
  const reduce = useReducedMotion();
  const how = [
    { label: "Elegida tal cual", v: 61, color: "#ec8f55" },
    { label: "Corregida", v: 27, color: "#c4561b" },
    { label: "Escrita de cero", v: 12, color: "#7f340e" },
  ];
  return (
    <>
      {/* Numbers count up; each change carries its own direction. */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Consultas" value={112} change="+14%" context="vs. semana anterior" />
        <MetricCard label="Nuevos interesados" value={19} change="+5" context="vs. semana anterior" />
        <MetricCard label="Reservas" value={3} change="igual" context="vs. semana anterior" />
        <MetricCard label="Chats sin responder" value={4} change="3 menos" context="vs. semana anterior" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-paper-2 p-5 ring-1 ring-ink/5">
          <BarChart
            label="Consultas por día"
            period="6 al 12 de octubre"
            valueLabel="Total"
            averageLabel="Promedio diario"
            categoryLabel="Día"
            data={[
              { key: "lun", label: "Lunes", axisLabel: "Lun", value: 21 },
              { key: "mar", label: "Martes", axisLabel: "Mar", value: 18 },
              { key: "mie", label: "Miércoles", axisLabel: "Mié", value: 16 },
              { key: "jue", label: "Jueves", axisLabel: "Jue", value: 19 },
              { key: "vie", label: "Viernes", axisLabel: "Vie", value: 24 },
              { key: "sab", label: "Sábado", axisLabel: "Sáb", value: 9 },
              { key: "dom", label: "Domingo", axisLabel: "Dom", value: 5 },
            ]}
          />
        </div>
        <div className="grid gap-4">
          <div className="rounded-2xl bg-paper-2 p-5 ring-1 ring-ink/5">
            <Gauge value={78} label="Fichas completas" detail="MARQui sabe qué busca y cómo paga 78 de cada 100 interesados" thresholds={[{ from: 0, tone: "danger", label: "Pocas" }, { from: 50, tone: "warning", label: "A medias" }, { from: 70, tone: "success", label: "Bien" }]} />
          </div>
          <div className="rounded-2xl bg-paper-2 p-5 ring-1 ring-ink/5">
            <Sparkline
              label="Primera respuesta"
              value="9 min"
              change="−6 min"
              tone="success"
              width={260}
              height={64}
              data={[22, 19, 17, 15, 12, 10, 9]}
              labels={["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Esta"]}
              formatValue={(v) => `${v} min`}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-paper-2 p-6 ring-1 ring-ink/5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-[1.2rem] font-bold">Tiempo ahorrado con MARQui</h4>
            <span className="text-[clamp(1.4rem,2vw,2rem)] font-semibold tracking-[-0.03em] text-orange-deep">
              ≈ <SlotText value={5} /> h esta semana
            </span>
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
