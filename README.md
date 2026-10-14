# MARQUI · Agilidad avanzada

**Marqui te sopla la respuesta. El cliente nunca lo ve.**

Presentación web de **Marqui**, un asistente con IA para el equipo de MARQ dentro del WhatsApp que ya usan, y de **MARQador**, su tablero. El alcance y las decisiones están en [docs/marqui-contexto.md](docs/marqui-contexto.md).

## Qué muestra la presentación

La pestaña **Solución** recorre, sobre un mismo cielo que cambia de hora:

1. **Hero:** WhatsApp Web con Marqui adentro. Demo interactiva: Juan pregunta «precio?», la tarjeta se completa sola y pasa a Interesado.
2. **Qué es:** Marqui contra un chatbot.
3. **Qué hace:** las seis funciones, cada una con su pantalla.
4. **MARQador:** el tablero, con cinco pantallas (Pauta, Demanda, Contactos, Frenos y Semana).
5. **Demo «Un día con Marqui»:** 9:00, 10:30 y 18:00. El cielo sigue la hora. Se avanza con los botones o con las flechas ← → del teclado.
6. **Por dentro:** cómo se conecta y qué pasa si la extensión falla.
7. **Lo que viene:** precios, señas, landings y avance de obra.

La pestaña **Design thinking** queda en preparación (`?panel=thinking`).

Toda la tipografía escala con el ancho de la pantalla, para que se lea desde lejos en una TV 2K. Todas las conversaciones, nombres y números son ilustrativos: no hay conexión con WhatsApp, la web de MARQ ni Mercado Pago.

## Ejecutar en tu computadora

Requiere Node.js 20.19+ o 22.12+ y npm.

```sh
npm ci
npm run dev
```

Abrí **http://127.0.0.1:4173/**.

```sh
npm run build     # verifica tipos y compila en dist/
npm run preview
```

`.npmrc` activa `legacy-peer-deps` por un conflicto de una dependencia opcional de `@vitejs/plugin-react` (`@babel/core` 7 contra 8).

## Diseño y tecnología

- **Vite + React + TypeScript + Tailwind CSS v4.**
- **shadcn/ui** (accordion, badge, tooltip) en `src/components/ui`.
- **Arc** (`https://uiarc.dev`, vía el registro `@arc` de `components.json`): tokens, contador animado, segmented control y gráficos de barras, donut y waffle, en `src/components/arc`.
- **CloudShader** (`src/components/ui/cloud-shader.tsx`): shader WebGL propio de nubes procedurales con la misma API que el componente de Aceternity (`<CloudShader className="…" />`). Acepta `timeOfDay` (0 mediodía, 1 atardecer, 2 noche, 3 amanecer) como número o `MotionValue`. Si conseguís el original desde 21st.dev, se puede reemplazar sin tocar el resto.
- Tipografías: Bricolage Grotesque, Instrument Serif, Geist y Geist Mono.
- Respeta `prefers-reduced-motion`: el cielo queda quieto y las conversaciones se muestran completas.

### MCP

`.mcp.json` configura el MCP de shadcn para este proyecto. El MCP de Arc se agregó a la configuración local con `claude mcp add --transport http arc https://uiarc.dev/api/mcp` y pide iniciar sesión la primera vez que se usa.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/App.tsx` | Composición de la página y pestañas |
| `src/components/marqui/` | Secciones, chats simulados y el controlador del cielo |
| `src/components/ui/` | shadcn y CloudShader |
| `src/components/arc/` | Componentes de Arc |
| `public/assets/` | Logo de MARQ, mascota de Marqui y favicon |
| `public/videos/` | El film (21 s, con sonido) y los tres cortos en loop, con sus pósters |
| `video/marqui/` | La composición de los videos y cómo volver a renderizarlos ([README](video/marqui/README.md)) |
| `docs/` | Referencia de Marqui y documentos de la propuesta anterior (Alloy) |
