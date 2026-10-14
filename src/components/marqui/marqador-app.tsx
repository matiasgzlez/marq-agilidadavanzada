import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BarChart3, Download, Megaphone, PieChart, SendHorizontal, Users, Wallet, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { screens, views, type ScreenId } from "./marqador";
import { MarquiLive } from "./marqui-live";
import { MarqLogo, ease } from "./primitives";
import { DateRangePicker, type DateRangePreset } from "@/components/arc/date-range-picker/date-range-picker";
import SegmentedControl from "@/components/arc/segmented-control/segmented-control";
import { Breadcrumb } from "@/components/arc/breadcrumb/breadcrumb";
import { Button } from "@/components/arc/button/button";
import { NotificationCenter, type NotificationItem } from "@/components/arc/notification-center/notification-center";
import { Skeleton } from "@/components/arc/skeleton/skeleton";
import Toast from "@/components/arc/toast/toast";
import { UserMenu } from "@/components/arc/user-menu/user-menu";

/* The same avisos MARQui sends by WhatsApp, kept here too. */
const avisos: NotificationItem[] = [
  { id: "1", title: "Marta Ríos reapareció", description: "Volvió a escribir después de 40 días. Pregunta por la 3B de MARQ Collection.", time: "11:14", tone: "warning" },
  { id: "2", title: "Escribió un cliente", description: "Pablo Sosa, que invirtió en Torre Natalini, consulta por lotes en Fontana.", time: "12:02", tone: "info" },
  { id: "3", title: "Llegó un referido", description: "Sofía Acosta viene recomendada por Pablo Sosa.", time: "12:15", tone: "success" },
  { id: "4", title: "Resumen de ayer", description: "23 consultas, 2 nuevos interesados y 4 chats sin responder.", time: "9:00", read: true, tone: "info" },
];

const day = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const presets: DateRangePreset[] = [
  { label: "Esta semana", range: () => ({ start: new Date(2026, 9, 6), end: new Date(2026, 9, 12) }) },
  { label: "Semana pasada", range: () => ({ start: new Date(2026, 8, 29), end: new Date(2026, 9, 5) }) },
  { label: "Últimos 30 días", range: (t) => ({ start: day(t, -29), end: t }) },
  { label: "Este mes", range: (t) => ({ start: new Date(t.getFullYear(), t.getMonth(), 1), end: t }) },
];

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
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  // Changing what you look at takes a moment, like a real query: the content holds its layout as a skeleton.
  const reload = () => {
    setLoading(true);
    window.setTimeout(() => setLoading(false), 650);
  };
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
    <div className="arc-marqador h-[100dvh] overflow-hidden bg-[#f6f5f1] text-ink">
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
          <div className="mt-4">
            <UserMenu user={{ name: "Equipo MARQ", email: "ventas@marq.com.ar", plan: "Líneas de pauta y clientes" }} showTheme={false} showName align="start" defaultStatus="available" onStatusChange={() => {}} />
          </div>
        </aside>

        {/* Main */}
        <main className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-line bg-[#f6f5f1]/90 px-5 py-4 backdrop-blur sm:px-8">
            <MarqLogo dark className="h-6 lg:hidden" />
            <SegmentedControl
              label="Línea"
              value={line}
              onValueChange={(v) => {
                setLine(v as typeof line);
                reload();
              }}
              options={[
                { value: "todas", label: "Las 2 líneas" },
                { value: "pauta", label: "Línea de pauta" },
                { value: "clientes", label: "Línea de clientes" },
              ]}
            />
            <DateRangePicker label="Semana" locale="es-AR" weekStartsOn={1} defaultValue={{ start: new Date(2026, 9, 6), end: new Date(2026, 9, 12) }} presets={presets} onChange={reload} />
            <div className="ml-auto flex items-center gap-2">
              <NotificationCenter notifications={avisos} label="Avisos" />
              <Button onClick={() => setToast(true)}>
                <Download size={16} strokeWidth={1.75} aria-hidden="true" /> Descargar reporte
              </Button>
            </div>
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
                <Breadcrumb items={[{ label: "MARQador", onClick: () => setScreen("pauta") }, { label: current.label }]} />
                <h1 className="mt-1 text-[clamp(1.6rem,2.4vw,2.3rem)] font-semibold tracking-[-0.03em]">{current.question}</h1>
                <div className="mt-6 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-8" aria-busy={loading}>
                  {loading ? (
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {[0, 1, 2, 3].map((i) => (
                          <Skeleton key={i} lines={2} />
                        ))}
                      </div>
                      <Skeleton lines={6} />
                    </div>
                  ) : (
                    views[screen]
                  )}
                </div>
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
            <div className="pointer-events-none fixed right-6 top-20 z-30 flex justify-end [&>*]:pointer-events-auto">
              <Toast open={toast} onOpenChange={setToast} title="Reporte descargado" description="Semana del 6 al 12 de octubre, en PDF." />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
