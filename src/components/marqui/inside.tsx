import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMarquiLife } from "./marqui-character";
import { MarquiLive } from "./marqui-live";
import { FadeUp, Section } from "./primitives";
import { Lead } from "./story";
import { MarqadorMark } from "./marqador-mark";
import { SKY } from "./sky";

/* ——— Cómo llega MARQui a MARQ ———
   Abstract on purpose (the detail lives in the portfolio): the two lines on the left, the
   official API, MARQui in the middle, the three places the team sees him on the right.
   Light travels the wires: messages in, help out, and a person's reply going back. */

const W = 1200;
const H = 520;
const P = {
  pauta: [120, 180],
  clientes: [120, 340],
  api: [390, 260],
  marqui: [650, 260],
  web: [1040, 108],
  ext: [835, 108],
  cel: [1070, 260],
  mqd: [1000, 400],
} as const;
const at = ([x, y]: readonly [number, number]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

const WIRES = {
  in1: `M120 180 C 260 180 260 260 390 260`,
  in2: `M120 340 C 260 340 260 260 390 260`,
  core: `M390 260 L 650 260`,
  web: `M650 260 C 740 260 740 108 820 108`,
  plug: `M850 108 L 942 108`,
  cel: `M650 260 L 1070 260`,
  mqd: `M650 260 C 820 260 830 400 1000 400`,
};

export function Inside() {
  const reduce = useReducedMotion();
  const pose = useMarquiLife();
  return (
    <Section sky={SKY.dusk} id="por-dentro" className="py-28 sm:py-40" aria-labelledby="por-dentro-title">
      <div className="mx-auto max-w-[90rem]">
        <Lead id="por-dentro-title" title={["Cómo llega MARQui", <em key="e">a MARQ.</em>]}>
          Las dos líneas siguen igual que hoy. MARQui se conecta por detrás, por la vía oficial de WhatsApp, y aparece donde el equipo ya trabaja.
        </Lead>

        <FadeUp className="mt-14 sm:mt-20">
          <div className="[container-type:inline-size]">
            <div className="relative mx-auto aspect-[12/5.2] max-w-[78rem]" role="img" aria-label="Los mensajes de las dos líneas llegan a MARQui por la API oficial de WhatsApp; MARQui ayuda en WhatsApp Web, en el celular y en MARQador, y la respuesta la envía una persona.">
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
                <defs>
                  <radialGradient id="core-glow">
                    <stop offset="0%" stopColor="#19d3b4" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#19d3b4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx={P.marqui[0]} cy={P.marqui[1]} r="210" fill="url(#core-glow)" />

                {/* The cables: a soft sheath and a dark core, drawn in on arrival. The light runs inside. */}
                {Object.entries(WIRES).map(([k, d], i) => {
                  const back = k === "back";
                  const draw = { initial: reduce ? false : { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true }, transition: { duration: 1.2, delay: 0.2 + i * 0.12, ease: "easeInOut" as const } };
                  return (
                    <g key={k}>
                      <motion.path d={d} fill="none" stroke="#ffffff" strokeOpacity={back ? 0.16 : 0.28} strokeWidth={back ? 7 : 13} strokeLinecap="round" {...draw} />
                      <motion.path d={d} fill="none" stroke="#062520" strokeOpacity={back ? 0.28 : 0.42} strokeWidth={back ? 3 : 6.5} strokeLinecap="round" {...draw} />
                      <motion.path d={d} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1} strokeLinecap="round" transform="translate(0 -3.4)" {...draw} style={{ display: back ? "none" : undefined }} />
                    </g>
                  );
                })}

                {/* MARQui's orbit: thinking, always. */}
                {!reduce && (
                  <g transform={`translate(${P.marqui[0]} ${P.marqui[1]})`}>
                    <motion.circle r="118" fill="none" stroke="#8ff0d9" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 14" strokeLinecap="round" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
                    <motion.circle r="150" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="1 10" strokeLinecap="round" animate={{ rotate: -360 }} transition={{ duration: 46, repeat: Infinity, ease: "linear" }} />
                  </g>
                )}

                {/* Light on the wires: messages in, help out, a person's reply going back. */}
                {!reduce && (
                  <>
                    <Packet d={WIRES.in1} color="#25d366" dur={2.2} begin={0} />
                    <Packet d={WIRES.in2} color="#25d366" dur={2.2} begin={1.1} />
                    <Packet d={WIRES.core} color="#7cf5dc" dur={1.4} begin={0.5} />
                    <Packet d={WIRES.core} color="#7cf5dc" dur={1.4} begin={1.6} />
                    <Packet d={WIRES.web} color="#7cf5dc" dur={1.8} begin={0.9} />
                    <Packet d={WIRES.cel} color="#7cf5dc" dur={1.8} begin={1.5} />
                    <Packet d={WIRES.mqd} color="#ff9a52" dur={1.8} begin={2.1} />
                    <Packet d={WIRES.plug} color="#7cf5dc" dur={0.9} begin={2.6} />
                  </>
                )}
              </svg>

              {/* ——— Nodes ——— */}
              <Node pos={P.pauta} label="Línea de pauta">
                <Halo tone="wa">
                  <MiniPhone kind="line" />
                </Halo>
              </Node>
              <Node pos={P.clientes} label="Línea de clientes">
                <Halo tone="wa">
                  <MiniPhone kind="line" />
                </Halo>
              </Node>
              <Node pos={P.api} label="API oficial de WhatsApp" short="API oficial">
                <ApiGlyph />
              </Node>
              <Node pos={P.marqui} label="MARQui" big>
                <span className="relative grid size-[min(12cqw,9.5rem)] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#00a390,#008c7e_55%,#014645)] shadow-[0_0_0_1px_rgb(255_255_255/0.25),0_1.5rem_3rem_-1rem_rgb(0_40_35/0.6)]">
                  {!reduce && <motion.i className="absolute inset-0 rounded-full" animate={{ boxShadow: ["0 0 0 0 rgb(25 211 180 / 0.45)", "0 0 0 1.6rem rgb(25 211 180 / 0)"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }} />}
                  <span className="w-[66%]">
                    <MarquiLive pose={pose} shadow={false} />
                  </span>
                </span>
              </Node>
              {/* The extension is the plug: MARQui's cable goes into it, and it clicks MARQui's layer into WhatsApp Web. */}
              <Node pos={P.web} label="WhatsApp Web">
                <MiniBrowser play={!reduce} />
              </Node>
              <Node pos={P.ext} label="Extensión de Chrome" short="Extensión" above>
                <ExtensionPlug play={!reduce} />
              </Node>
              <Node pos={P.cel} label="Celular" sub="contacto MARQui">
                <Halo tone="glass">
                  <MiniPhone kind="marqui" />
                </Halo>
              </Node>
              <Node pos={P.mqd} label="MARQador">
                <span className="relative grid place-items-center">
                  <i className="absolute size-[min(7cqw,5.4rem)] rounded-full bg-[#ff6c0c]/40 blur-[1.2cqw]" aria-hidden />
                  <MarqadorMark className="relative size-[min(6.4cqw,5rem)] drop-shadow-[0_0.6cqw_0.9cqw_rgb(80_25_0/0.4)]" />
                </span>
              </Node>

            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="mx-auto mt-14 flex max-w-[60rem] flex-wrap justify-center gap-2.5">
          {["Las líneas siguen como hoy", "Vía oficial de WhatsApp", "Una sola instalación: la extensión", "Si la extensión falla, sigue por el contacto"].map((t) => (
            <span key={t} className="sky-type rounded-full bg-white/10 px-4 py-2 text-[clamp(0.9rem,1.05vw,1.05rem)] font-medium text-white ring-1 ring-white/20 backdrop-blur-sm">
              {t}
            </span>
          ))}
        </FadeUp>
      </div>
    </Section>
  );
}

/** A glowing bead that rides a wire, forever. */
function Packet({ d, color, dur, begin, small }: { d: string; color: string; dur: number; begin: number; small?: boolean }) {
  return (
    <g>
      <circle r={small ? 2.4 : 3.6} fill="#ffffff" opacity="0">
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
      <circle r={small ? 5 : 9} fill={color} opacity="0">
        <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
        <animate attributeName="opacity" values="0;0.85;0.85;0" keyTimes="0;0.12;0.85;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

function Node({ pos, label, short, sub, big, above, children }: { pos: readonly [number, number]; label: string; short?: string; sub?: string; big?: boolean; above?: boolean; children: ReactNode }) {
  return (
    <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={at(pos)}>
      {children}
      <span className={cn("sky-type absolute whitespace-nowrap text-center font-medium", above ? "bottom-full mb-[0.8cqw]" : "top-full mt-[0.8cqw]", " text-white", big ? "text-[clamp(0.75rem,1.75cqw,1.4rem)] font-semibold" : "text-[clamp(0.58rem,1.25cqw,1rem)] text-white/85")}>{short ? (
          <>
            <span className="sm:hidden">{short}</span>
            <span className="max-sm:hidden">{label}</span>
          </>
        ) : (
          label
        )}
        {sub && <span className="block text-center text-[0.85em] font-normal text-white/60 max-sm:hidden">{sub}</span>}
      </span>
    </div>
  );
}

/** A soft ring of light behind a drawn object. */
function Halo({ tone, children }: { tone: "wa" | "glass"; children: ReactNode }) {
  return (
    <span className="relative grid place-items-center">
      <i className={cn("absolute size-[min(7cqw,5.4rem)] rounded-full blur-[1.2cqw]", tone === "wa" ? "bg-[#25d366]/45" : "bg-white/25")} aria-hidden />
      <span className="relative">{children}</span>
    </span>
  );
}

/** A tiny iPhone. `line`: one of MARQ's lines, a client's chat on screen. `marqui`: the MARQui contact. */
function MiniPhone({ kind }: { kind: "line" | "marqui" }) {
  const line = kind === "line";
  return (
    <svg viewBox="0 0 40 76" className="h-[min(6.2cqw,4.8rem)] w-auto drop-shadow-[0_0.6cqw_0.9cqw_rgb(0_0_0/0.35)]" aria-hidden>
      <rect x="0.5" y="0.5" width="39" height="75" rx="9" fill="#e6e8ea" />
      <rect x="2" y="2" width="36" height="72" rx="7.6" fill="#0d0f14" />
      <rect x="3.6" y="3.6" width="32.8" height="68.8" rx="6.2" fill={line ? "#efeae2" : "#eef6f4"} />
      <rect x="15" y="6" width="10" height="3" rx="1.5" fill="#0d0f14" />
      {/* chat header */}
      <rect x="3.6" y="11" width="32.8" height="8" fill={line ? "#f7f7f7" : "#008c7e"} />
      <circle cx="9" cy="15" r="2.4" fill={line ? "#9fb3d4" : "#ffffff"} />
      <rect x="13" y="13.8" width="12" height="2.4" rx="1.2" fill={line ? "#b9c0c6" : "#ffffff"} opacity={line ? 1 : 0.8} />
      {/* bubbles */}
      <rect x="6.5" y="25" width="18" height="6" rx="2.2" fill="#ffffff" />
      <rect x="15.5" y="34" width="18" height="6" rx="2.2" fill={line ? "#d9fdd3" : "#c9efe5"} />
      <rect x="6.5" y="43" width="14" height="6" rx="2.2" fill="#ffffff" />
      <rect x="11.5" y="52" width="22" height="9" rx="2.2" fill={line ? "#d9fdd3" : "#c9efe5"} />
      <rect x="15" y="68" width="10" height="1.6" rx="0.8" fill="#0d0f14" opacity="0.7" />
    </svg>
  );
}

/**
 * WhatsApp Web, drawn small. The extension is shown for what it is: a layer. Its icon sits in
 * the browser's toolbar, and MARQui's tray (the ficha on top, three replies below) lifts off and
 * clicks back into the chat, again and again, while the light arrives from MARQui.
 */
function MiniBrowser({ play }: { play: boolean }) {
  const loop = { duration: 3.6, repeat: Infinity, ease: [0.16, 1, 0.3, 1] as const, times: [0, 0.18, 0.32, 0.86, 1] };
  return (
    <span className="relative block w-[min(17cqw,13.5rem)] drop-shadow-[0_0.8cqw_1.4cqw_rgb(0_0_0/0.35)]">
      <svg viewBox="0 0 100 70" className="block w-full" aria-hidden>
        <rect x="0.5" y="0.5" width="99" height="69" rx="7" fill="#ffffff" />
        {/* toolbar */}
        <path d="M0.5 7.5a7 7 0 0 1 7-7h85a7 7 0 0 1 7 7V11H0.5z" fill="#f0f2f5" />
        <circle cx="6.5" cy="6" r="1.7" fill="#ff5f57" />
        <circle cx="11.5" cy="6" r="1.7" fill="#febc2e" />
        <circle cx="16.5" cy="6" r="1.7" fill="#28c840" />
        <rect x="24" y="3.4" width="50" height="5.2" rx="2.6" fill="#ffffff" />
        <rect x="38" y="5.4" width="22" height="1.2" rx="0.6" fill="#c9ced3" />
        {/* the extension's icon, in the toolbar where Chrome puts them */}
        <rect x="85.5" y="2.4" width="9" height="7.2" rx="2" fill="#e7f6f2" />
        <path
          transform="translate(86.6 2.7) scale(0.29)"
          d="M10 3.5a2 2 0 0 1 4 0V5h3.5A1.5 1.5 0 0 1 19 6.5V10h1.5a2 2 0 0 1 0 4H19v3.5a1.5 1.5 0 0 1-1.5 1.5H14v-1.5a2 2 0 0 0-4 0V19H6.5A1.5 1.5 0 0 1 5 17.5V14h1.5a2 2 0 0 0 0-4H5V6.5A1.5 1.5 0 0 1 6.5 5H10z"
          fill="#008c7e"
        />
        {/* chat list */}
        {[16, 26, 36, 46, 56].map((y, i) => (
          <g key={y}>
            <circle cx="7" cy={y + 2.4} r="3.2" fill={i === 1 ? "#f5b301" : "#c7d3e6"} />
            <rect x="12.5" y={y} width="16" height="2" rx="1" fill="#c9ced3" />
            <rect x="12.5" y={y + 3.4} width="11" height="1.7" rx="0.85" fill="#e2e5e8" />
          </g>
        ))}
        <rect x="33" y="11" width="0.7" height="58.5" fill="#e9edef" />
        {/* the conversation, before MARQui */}
        <path d="M33.7 11H99.5v51.5a7 7 0 0 1-7 7H33.7z" fill="#efeae2" />
        <rect x="38" y="15" width="24" height="5.5" rx="2" fill="#ffffff" />
        <rect x="70" y="23" width="25" height="5.5" rx="2" fill="#d9fdd3" />
        {/* where the layer lands: a faint dashed slot */}
        <rect x="35.5" y="31.5" width="62" height="36" rx="3.5" fill="none" stroke="#008c7e" strokeOpacity="0.35" strokeWidth="0.7" strokeDasharray="2 2" />
      </svg>

      {/* MARQui's layer: lifts off and clicks into its slot. */}
      <motion.span
        className="absolute left-[35.5%] top-[45%] h-[51.4%] w-[62%] overflow-hidden rounded-[0.5cqw] bg-[#e7f6f2] shadow-[0_0_0_0.12cqw_#19d3b4]"
        animate={play ? { y: ["-38%", "-38%", "0%", "0%", "-38%"], x: ["10%", "10%", "0%", "0%", "10%"], opacity: [0, 1, 1, 1, 0], boxShadow: ["0 0 0 0.12cqw #19d3b4, 0 1.2cqw 1.6cqw -0.4cqw rgb(0 0 0 / 0.45)", "0 0 0 0.12cqw #19d3b4, 0 1.2cqw 1.6cqw -0.4cqw rgb(0 0 0 / 0.45)", "0 0 0 0.5cqw rgb(25 211 180 / 0.35), 0 0 0 0 rgb(0 0 0 / 0)", "0 0 0 0.12cqw rgb(25 211 180 / 0.6), 0 0 0 0 rgb(0 0 0 / 0)", "0 0 0 0.12cqw #19d3b4, 0 1.2cqw 1.6cqw -0.4cqw rgb(0 0 0 / 0.45)"] } : undefined}
        transition={loop}
      >
        <svg viewBox="0 0 62 36" className="block size-full" aria-hidden>
          {/* the ficha */}
          <circle cx="4.5" cy="4.6" r="2" fill="#008c7e" />
          <rect x="8.5" y="2.8" width="11" height="3.6" rx="1.8" fill="#ffffff" />
          <rect x="21" y="2.8" width="9" height="3.6" rx="1.8" fill="#ffffff" />
          <rect x="31.5" y="2.8" width="10" height="3.6" rx="1.8" fill="#008c7e" />
          {/* three replies, the chosen one solid */}
          <rect x="3" y="10" width="56" height="7" rx="1.8" fill="#ffffff" />
          <rect x="3" y="18.8" width="56" height="7" rx="1.8" fill="#008c7e" />
          <rect x="3" y="27.6" width="56" height="7" rx="1.8" fill="#ffffff" />
          <rect x="7" y="12.6" width="30" height="1.6" rx="0.8" fill="#cfd8d6" />
          <rect x="7" y="21.4" width="36" height="1.6" rx="0.8" fill="#ffffff" opacity="0.75" />
          <rect x="7" y="30.2" width="26" height="1.6" rx="0.8" fill="#cfd8d6" />
        </svg>
      </motion.span>
    </span>
  );
}

/**
 * The Chrome extension, in the lead role: a big white tile with the puzzle piece, plugged into
 * WhatsApp Web's side. It glows every time a packet arrives and the layer clicks in.
 */
function ExtensionPlug({ play }: { play: boolean }) {
  return (
    <span className="relative grid size-[min(6cqw,4.6rem)] place-items-center rounded-[1.6cqw] bg-white shadow-[0_0_0_0.35cqw_rgb(25_211_180/0.55),0_1cqw_2cqw_-0.6cqw_rgb(0_40_35/0.6)]">
      {play && (
        <motion.i
          className="absolute inset-0 rounded-[1.6cqw]"
          animate={{ boxShadow: ["0 0 0 0 rgb(25 211 180 / 0.7)", "0 0 0 1.8cqw rgb(25 211 180 / 0)"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          aria-hidden
        />
      )}
      <svg viewBox="0 0 24 24" className="relative size-[64%]" aria-hidden>
        <defs>
          <linearGradient id="plug-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#19d3b4" />
            <stop offset="100%" stopColor="#014645" />
          </linearGradient>
        </defs>
        <path
          d="M10 3.5a2 2 0 0 1 4 0V5h3.5A1.5 1.5 0 0 1 19 6.5V10h1.5a2 2 0 0 1 0 4H19v3.5a1.5 1.5 0 0 1-1.5 1.5H14v-1.5a2 2 0 0 0-4 0V19H6.5A1.5 1.5 0 0 1 5 17.5V14h1.5a2 2 0 0 0 0-4H5V6.5A1.5 1.5 0 0 1 6.5 5H10z"
          fill="url(#plug-g)"
        />
      </svg>
      {/* the prong that goes into the browser */}
      <i className="absolute -right-[0.9cqw] top-1/2 h-[1.4cqw] w-[1cqw] -translate-y-1/2 rounded-r-[0.4cqw] bg-white shadow-[0.2cqw_0_0.4cqw_rgb(0_0_0/0.15)]" aria-hidden />
    </span>
  );
}

/** The official API: a small glass ring with the two linked ends of a connection. */
function ApiGlyph() {
  return (
    <span className="grid size-[min(4.4cqw,3.4rem)] place-items-center rounded-full bg-white/15 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.45)] backdrop-blur-md">
      <svg viewBox="0 0 24 24" className="size-[56%]" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M9.5 14.5 14.5 9.5" />
        <path d="M11 6.5 12.6 4.9a3.8 3.8 0 0 1 5.4 5.4L16.5 12" />
        <path d="M13 17.5 11.4 19.1a3.8 3.8 0 0 1-5.4-5.4L7.5 12" />
      </svg>
    </span>
  );
}

