import { useEffect, useState } from "react";
import { Next, Outro, Thinking } from "@/components/marqui/closing";
import { Day } from "@/components/marqui/day";
import { Functions } from "@/components/marqui/functions";
import { Header, type Panel } from "@/components/marqui/header";
import { Hero } from "@/components/marqui/hero";
import { Inside } from "@/components/marqui/inside";
import { MarqadorSection } from "@/components/marqui/marqador";
import { Control, TimeSaved } from "@/components/marqui/story";
import { Where } from "@/components/marqui/where";
import { SkyBackground, SkyProvider } from "@/components/marqui/sky";

/* Design thinking isn't presented yet: its tab and the header switch stay hidden. Flip to bring them back. */
const SHOW_THINKING = false;
const initialPanel = (): Panel => (SHOW_THINKING && new URLSearchParams(window.location.search).get("panel") === "thinking" ? "thinking" : "solucion");

export function App() {
  const [panel, setPanel] = useState<Panel>(initialPanel);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (panel === "thinking") url.searchParams.set("panel", "thinking");
    else url.searchParams.delete("panel");
    history.replaceState(null, "", url);
  }, [panel]);

  return (
    <SkyProvider>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <SkyBackground />
      <Header panel={panel} onPanel={setPanel} showPanels={SHOW_THINKING} />
      <main id="contenido">
        {panel === "solucion" ? (
          <div id="panel-solucion" role="tabpanel" aria-label="La solución: Marqui">
            <Hero />
            <Functions />
            <TimeSaved />
            <Control />
            <Day />
            <Where />
            <MarqadorSection />
            <Inside />
            <Next />
            <Outro />
          </div>
        ) : (
          <Thinking
            onGoToSolution={() => {
              setPanel("solucion");
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          />
        )}
      </main>
    </SkyProvider>
  );
}
