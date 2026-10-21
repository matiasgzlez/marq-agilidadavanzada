import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarqLogo, Section, ease } from "./primitives";
import { Lead } from "./story";
import { MarquiLive } from "./marqui-live";
import { MarqadorMark } from "./marqador-mark";
import { SKY } from "./sky";
import { PORTFOLIO, type Block, type DocId } from "./portfolio-content";

/* ——— Portfolio ———
   The report for the client, written to be read. Three documents on paper,
   picked with folder tabs that join the sheet they open. Each document opens
   with a cover, and its index follows the reader down the page. The text
   lives in portfolio-content.ts. */

const DOCS: { id: DocId; name: string; what: string; thesis: string }[] = [
  { id: "marqui", name: "MARQui", what: "Asistente comercial", thesis: "Un compañero de trabajo que vive en el WhatsApp que el equipo ya usa. Prepara cada respuesta y avisa lo importante; el que responde siempre es una persona de MARQ." },
  { id: "marqador", name: "MARQador", what: "Módulo de datos", thesis: "Junta todas las conversaciones y muestra qué pide el mercado: dónde poner la pauta, qué construir y a quién llamar." },
  { id: "alloy", name: "MARQ Alloy", what: "Segunda propuesta", thesis: "Arte regional en cada desarrollo, para que en Resistencia se sepa quién está detrás de cada edificio." },
];

/* Reading time at ~200 words per minute, from the document's own text. */
function minutes(id: DocId) {
  const words = JSON.stringify(PORTFOLIO[id]).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* MARQui and MARQador have a character; Alloy is shown by its own sculpture, as a small round photo in its tab. */
function DocMark({ id, className }: { id: DocId; className?: string }) {
  if (id === "marqui") return <MarquiLive pose="alegria" follow shadow={false} className={className} />;
  if (id === "marqador") return <MarqadorMark className={className} title="" />;
  return <img src="/assets/alloy/alloy-concept.jpg" alt="" className={cn("rounded-full object-cover object-[62%_60%]", className)} />;
}

/** Which section of the open document is being read: the last one whose top has passed a third of the screen. */
function useActiveSection(id: DocId, count: number) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive(0);
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let at = 0;
      for (let i = 0; i < count; i++) {
        const el = document.getElementById(`${id}-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= line) at = i;
      }
      setActive(at);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, [id, count]);
  return active;
}

export function Portfolio() {
  const [doc, setDoc] = useState<DocId>("marqui");
  const d = DOCS.find((x) => x.id === doc)!;
  const sections = PORTFOLIO[doc];
  const active = useActiveSection(doc, sections.length);
  const reduce = useReducedMotion();
  const sheet = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ["start 30%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  const open = (id: DocId) => {
    setDoc(id);
    const top = sheet.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) sheet.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div id="panel-portfolio" role="tabpanel" aria-label="Portfolio">
      <Section sky={SKY.noon} id="portfolio" className="pb-28 pt-40 sm:pt-52" aria-labelledby="portfolio-title">
        <Lead id="portfolio-title" title={["El trabajo completo,", <em key="e">para leer con tiempo.</em>]}>
          Todo lo que desarrollamos durante la consultoría, con el detalle que no entró en la presentación.
        </Lead>

        <div className="mx-auto mt-16 max-w-[76rem] sm:mt-20">
          {/* Folder tabs: the open one is the same paper as the sheet and joins it. */}
          <div ref={sheet} role="tablist" aria-label="Propuestas" className="flex scroll-mt-24 items-end gap-1.5 px-3 sm:gap-2 sm:px-8">
            {DOCS.map((x) => {
              const on = x.id === doc;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="portfolio-sheet"
                  onClick={() => open(x.id)}
                  className={cn(
                    "relative flex min-w-0 flex-1 items-center gap-3 rounded-t-[1.25rem] px-3 text-left transition-[background-color,padding] duration-500 sm:flex-none sm:px-5",
                    on ? "bg-paper pb-4 pt-4 text-ink sm:pt-5" : "bg-white/15 pb-3 pt-3 text-white hover:bg-white/25",
                  )}
                >
                  <DocMark id={x.id} className="size-8 shrink-0 sm:size-10" />
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-[clamp(0.95rem,1.2vw,1.2rem)] font-semibold tracking-[-0.02em]">{x.name}</span>
                    <span className={cn("hidden text-[0.85rem] sm:block", on ? "text-ink-3" : "text-white/75")}>{x.what}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="portfolio-sheet" className="relative rounded-[2rem] bg-paper text-ink shadow-[0_2.5rem_6rem_-2rem_rgb(1_40_36/0.45)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={doc} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.55, ease }}>
                {/* Cover. */}
                <header className="grid gap-8 border-b border-line px-6 pb-12 pt-12 sm:px-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-16 lg:pb-16">
                  <div className="max-w-[48rem]">
                    <h2 className="display text-[clamp(3rem,7vw,6rem)] text-ink">{d.name}</h2>
                    <p className="mt-6 text-balance text-[clamp(1.25rem,1.9vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.015em] text-ink-2">{d.thesis}</p>
                    <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-3 text-[0.95rem]">
                      {[
                        ["Para", "Candelaria, MARQ"],
                        ["Fecha", "Octubre de 2026"],
                        ["Lectura", `${minutes(doc)} min`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-ink-3">{k}</dt>
                          <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  {doc !== "alloy" && <DocMark id={doc} className="hidden size-[clamp(7rem,12vw,11rem)] lg:block" />}
                </header>

                <div ref={body} className="grid gap-12 px-6 py-12 sm:px-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:py-16">
                  {/* Index: follows the reader, with a line that fills as you read. */}
                  <nav aria-label={`Índice de ${d.name}`} className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
                    <p className="text-[0.95rem] font-semibold text-ink">Contenido</p>
                    <div className="relative mt-4 pl-5">
                      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-line" />
                      <motion.span aria-hidden className="absolute left-0 top-0 h-full w-px origin-top bg-ink" style={{ scaleY: progress }} />
                      <ol className="grid gap-2.5">
                        {sections.map((s, i) => (
                          <li key={s.title}>
                            <a href={`#${doc}-${i + 1}`} aria-current={i === active ? "true" : undefined} className={cn("flex gap-2.5 text-[0.98rem] leading-snug transition-colors duration-300", i === active ? "font-semibold text-ink" : "text-ink-3 hover:text-ink")}>
                              <span className="w-4 shrink-0 tabular-nums">{i + 1}</span>
                              {s.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </nav>

                  <div className="grid min-w-0 content-start gap-16 sm:gap-20">
                    {sections.map((s, i) => (
                      <section key={s.title} id={`${doc}-${i + 1}`} className="scroll-mt-28" aria-labelledby={`${doc}-${i + 1}-t`}>
                        <h3 id={`${doc}-${i + 1}-t`} className="flex items-baseline gap-4 text-[clamp(1.7rem,2.6vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
                          <span className="text-[0.55em] font-medium tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                          {s.title}
                        </h3>
                        <div className="mt-6 grid gap-5">
                          {s.blocks.map((b, k) => (
                            <DocBlock key={k} b={b} lead={k === 0 && i === 0} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Section>

      <footer className="relative -mx-4 flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-5 text-[0.95rem] text-white/75 sm:-mx-8 lg:-mx-12 lg:px-12">
        <MarqLogo className="h-7" />
        <span>Portfolio · MARQui, MARQador y MARQ Alloy · Agilidad avanzada · 2026</span>
      </footer>
    </div>
  );
}

/* One piece of a section: a paragraph, a list, a table, a note, a figure or a quote.
   `lead`: the first paragraph of a document, set larger. */
function DocBlock({ b, lead = false }: { b: Block; lead?: boolean }) {
  const text = "max-w-[44rem] text-[clamp(1.05rem,1.15vw,1.2rem)] leading-[1.7] text-ink-2";
  if ("p" in b) return <p className={cn(text, lead && "text-[clamp(1.2rem,1.5vw,1.5rem)] leading-[1.55] text-ink")}>{b.p}</p>;
  if ("list" in b) {
    const Tag = b.ordered ? "ol" : "ul";
    return (
      <Tag className={cn(text, "grid gap-3")}>
        {b.list.map((x, i) => (
          <li key={x} className="grid grid-cols-[1.75rem_1fr]">
            {b.ordered ? <span className="font-semibold tabular-nums text-ink">{i + 1}.</span> : <span aria-hidden className="mt-[0.85em] block h-px w-3 bg-ink-3" />}
            <span>{x}</span>
          </li>
        ))}
      </Tag>
    );
  }
  if ("table" in b)
    return (
      <>
      {/* Phones: each row stacked, with the column names as labels. */}
      <dl className="grid divide-y divide-line border-y border-line sm:hidden">
        {b.table.rows.map((r) => (
          <div key={r[0]} className="grid gap-2 py-4">
            <dt className="text-[1.05rem] font-semibold leading-snug text-ink">{r[0]}</dt>
            {r.slice(1).map((c, i) => (
              <dd key={i} className="text-[0.98rem] leading-[1.55] text-ink-2">
                <span className="block text-[0.85rem] font-semibold text-ink-3">{b.table.head[i + 1]}</span>
                {c}
              </dd>
            ))}
          </div>
        ))}
      </dl>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[38rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              {b.table.head.map((h) => (
                <th key={h} scope="col" className="pb-3 pr-6 text-[0.95rem] font-semibold text-ink last:pr-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.table.rows.map((r) => (
              <tr key={r[0]} className="border-b border-line align-top transition-colors hover:bg-paper-2/70">
                {r.map((c, i) => (
                  <td key={i} className={cn("py-4 pr-6 text-[clamp(0.95rem,1vw,1.05rem)] leading-[1.55] last:pr-0", i === 0 ? "w-[22%] font-semibold text-ink" : "text-ink-2")}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
    );
  if ("note" in b) {
    const warn = b.tone === "warn";
    const Icon = warn ? TriangleAlert : Info;
    return (
      <p className={cn("flex max-w-[44rem] gap-3.5 rounded-[1.1rem] px-5 py-4 text-[clamp(1rem,1.05vw,1.1rem)] font-medium leading-[1.55]", warn ? "bg-[#fbeee4] text-[#7a3510]" : "bg-teal-soft text-teal-deep")}>
        <Icon className="mt-[0.2em] size-[1.15em] shrink-0" aria-hidden />
        <span>{b.note}</span>
      </p>
    );
  }
  if ("figure" in b)
    return (
      <figure className="grid gap-3">
        <img src={b.figure} alt={b.alt} width={1600} height={900} className="aspect-[16/9] w-full rounded-[1.25rem] object-cover" loading="lazy" />
        <figcaption className="max-w-[44rem] text-[0.95rem] leading-snug text-ink-3">{b.caption}</figcaption>
      </figure>
    );
  return (
    <figure className="max-w-[44rem] py-2">
      <blockquote className="text-balance text-[clamp(1.6rem,2.6vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">
        <span aria-hidden className="text-ink-3">«</span>
        {b.quote}
        <span aria-hidden className="text-ink-3">»</span>
      </blockquote>
      <figcaption className="mt-3 text-[0.95rem] text-ink-3">{b.who}</figcaption>
    </figure>
  );
}
