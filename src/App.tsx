import { useEffect, useState } from "react";
import { Next, Outro, Thinking } from "@/components/marqui/closing";
import { Day } from "@/components/marqui/day";
import { Functions } from "@/components/marqui/functions";
import { Header, type Panel } from "@/components/marqui/header";
import { Hero } from "@/components/marqui/hero";
import { Inside } from "@/components/marqui/inside";
import { Brothers } from "@/components/marqui/brothers";
import { MarqadorSection } from "@/components/marqui/marqador";
import { NotBot } from "@/components/marqui/not-bot";
import { SkyBackground, SkyProvider } from "@/components/marqui/sky";

const initialPanel = (): Panel => (new URLSearchParams(window.location.search).get("panel") === "thinking" ? "thinking" : "solucion");

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
      <Header panel={panel} onPanel={setPanel} />
      <main id="contenido">
        {panel === "solucion" ? (
          <div id="panel-solucion" role="tabpanel" aria-label="La solución: Marqui">
            <Hero />
            <NotBot />
            <Functions />
            <Brothers />
            <MarqadorSection />
            <Day />
            <Inside />
            <Next />
            <Outro />
          </div>
        ) : (
          <Thinking />
        )}
      </main>
    </SkyProvider>
  );
}
