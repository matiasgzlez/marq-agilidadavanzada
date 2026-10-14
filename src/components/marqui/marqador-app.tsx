import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, CalendarDays, ChevronDown, Download, Megaphone, PieChart, SendHorizontal, Users, Wallet, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { screens, views, type ScreenId } from "./marqador";
import { MarquiLive } from "./marqui-live";
import { MarqLogo, ease } from "./primitives";

/* ——— MARQador, the real tab ———
   What opens from the button in WhatsApp Web: a full page, not a picture of
   one. Same screens and data as the presentation, laid out like a working
   product (sidebar, filters, date range, freshness), so it can be shown live
   or captured. Opens at /?app=marqador. */

const icons: Record<ScreenId, typeof BarChart3> = {
  pauta: Megaphone,
  demanda: PieChart,
  contactos: Users,
  frenos: OctagonAlert,
  semana: Wallet,
};

export function MarqadorApp() {
  const [screen, setScreen] = useState<ScreenId>(() => (new URLSearchParams(location.search).get("s") as ScreenId) || "pauta");
  const [line, setLine] = useState<"todas" | "pauta" | "clientes">("todas");
  const [ago, setAgo] = useState(2);
  const [ask, setAsk] = useState("");
  const current = screens.find((s) => s.id === screen)!;

  useEffect(() => {
    document.title = "MARQador · MARQ";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
    const t = setInterval(() => setAgo((a) => (a >= 5 ? 1 : a + 1)), 20000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("s", screen);
    history.replaceState(null, "", url);
  }, [screen]);

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f6f5f1] text-ink">
      {/* An app shell: the sidebar stays put, only the content scrolls. */}
      <div className="grid h-full lg:grid-cols-[17rem_1fr]">
        {/* Sidebar */}
        <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r border-line bg-white px-4 py-5 max-lg:hidden">
          <div className="flex items-center gap-2.5 px-2">
            <span className="w-9">
              <MarquiLive who="marqador" pose="reposo" shadow={false} />
            </span>
            <span className="leading-tight">
              <b className="block text-[1.1rem] font-semibold tracking-[-0.02em]">MARQador</b>
              <span className="text-[0.78rem] text-ink-3">Módulo de MARQui</span>
            </span>
          </div>
          <nav className="mt-8 grid gap-1" aria-label="Pantallas">
            {screens.map((s) => {
              const Icon = icons[s.id];
              return (
                <button key={s.id} onClick={() => setScreen(s.id)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] font-medium transition-colors", screen === s.id ? "bg-[#fdeee3] text-orange-deep" : "text-ink-2 hover:bg-paper-2")}>
                  <Icon className="size-[1.1rem]" />
                  {s.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto grid gap-3 rounded-2xl bg-paper-2 p-4 text-[0.85rem] text-ink-2">
            <span className="flex items-center gap-2">
              <span className="relative grid size-2 place-items-center">
                <span className="absolute size-2 animate-ping rounded-full bg-[#1daa61] opacity-60" />
                <span className="size-2 rounded-full bg-[#1daa61]" />
              </span>
              Conectado a las 2 líneas
            </span>
            <span className="text-ink-3">Actualizado hace {ago} min</span>
          </div>
          <div className="mt-4 flex items-center gap-2.5 px-2 text-[0.85rem]">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-[0.8rem] font-semibold text-white">EQ</span>
            <span className="leading-tight">
              <b className="block font-medium">Equipo MARQ</b>
              <span className="text-ink-3">Ventas</span>
            </span>
          </div>
        </aside>

        {/* Main */}
        <main className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-line bg-[#f6f5f1]/90 px-5 py-4 backdrop-blur sm:px-8">
            <MarqLogo dark className="h-6 lg:hidden" />
            <div className="flex rounded-full bg-white p-1 ring-1 ring-line">
              {(["todas", "pauta", "clientes"] as const).map((l) => (
                <button key={l} onClick={() => setLine(l)} className={cn("rounded-full px-3.5 py-1.5 text-[0.88rem] font-medium transition-colors", line === l ? "bg-ink text-white" : "text-ink-2 hover:text-ink")}>
                  {l === "todas" ? "Las 2 líneas" : l === "pauta" ? "Línea de pauta" : "Línea de clientes"}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.88rem] font-medium ring-1 ring-line">
              <CalendarDays className="size-4" /> 6 – 12 oct 2026 <ChevronDown className="size-4 text-ink-3" />
            </button>
            <button className="ml-auto inline-flex items-center gap-2 rounded-full bg-orange px-4 py-2 text-[0.88rem] font-semibold text-white">
              <Download className="size-4" /> Reporte PDF
            </button>
          </header>

          {/* Mobile nav */}
          <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line px-4 py-2 lg:hidden">
            {screens.map((s) => (
              <button key={s.id} onClick={() => setScreen(s.id)} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-[0.9rem] font-medium", screen === s.id ? "bg-ink text-white" : "text-ink-2")}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-[78rem] px-5 py-8 sm:px-8 sm:py-10">
            <AnimatePresence mode="wait">
              <motion.div key={screen} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                <p className="text-[0.85rem] font-medium uppercase tracking-[0.1em] text-ink-3">{current.label}</p>
                <h1 className="mt-1 text-[clamp(1.6rem,2.4vw,2.3rem)] font-semibold tracking-[-0.03em]">{current.question}</h1>
                <div className="mt-6 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-8">{views[screen]}</div>
              </motion.div>
            </AnimatePresence>

            {/* Ask MARQui, right from the dashboard. */}
            <form
              className="sticky bottom-5 mt-6 flex items-center gap-3 rounded-full bg-white p-2 pl-3 shadow-[0_1rem_2.5rem_-1rem_rgb(6_35_31/0.35)] ring-1 ring-line"
              onSubmit={(e) => {
                e.preventDefault();
                setAsk("");
              }}
            >
              <span className="w-9 shrink-0">
                <MarquiLive pose={ask ? "pensando" : "reposo"} shadow={false} />
              </span>
              <label htmlFor="ask" className="sr-only">
                Preguntale a MARQui
              </label>
              <input id="ask" value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Preguntale a MARQui: «¿cuántos pidieron 2 dormitorios esta semana?»" className="min-w-0 flex-1 bg-transparent text-[0.98rem] outline-none placeholder:text-ink-3" />
              <button aria-label="Preguntar" className="grid size-10 place-items-center rounded-full bg-ink text-white">
                <SendHorizontal className="size-4" />
              </button>
            </form>
            <p className="mt-4 text-center text-[0.8rem] text-ink-3">Simulación con datos ilustrativos.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
