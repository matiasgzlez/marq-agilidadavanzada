# MARQUI · Agilidad avanzada

**Marqui te sopla la respuesta. El cliente nunca lo ve.**

Presentación web de **Marqui**, un asistente con IA para el equipo de MARQ dentro del WhatsApp que ya usan, y de **MARQador**, su tablero. El alcance y las decisiones están en [docs/marqui-contexto.md](docs/marqui-contexto.md).

## Qué muestra la presentación

La pestaña **MARQui** sigue la estructura de la página de [dots](https://chatgpt.com/es-ES/features/dots/) y cuenta todo como dolor → solución, sobre un cielo que cambia de hora:

1. **Te presentamos MARQui:** el personaje vivo (sigue el cursor) y una frase.
2. **Lo que gana el equipo** (va después de las funciones): el dolor y el tiempo que devuelve MARQui (carrera de una respuesta, 2,9 a 6,7 h por semana), con estudios de NBER (2023) y HBR (2011).
3. **Empezá con MARQui:** qué es, y las seis funciones en tarjetas, cada una con su «Hoy…».
4. **De tu lado, bajo tu control:** no es un bot, no hay encuestas, decidís vos.
6. **Un día con MARQui:** línea de tiempo de 9:00 a 18:30 (flechas ← → para presentar).
7. **Justo donde lo necesitás:** WhatsApp Web (demo interactiva), celular y MARQador.
8. **MARQador:** su presentación animada, «Un módulo de MARQui» y el tablero.
9. **Cómo llega MARQui a MARQ**, **Lo que viene** y el cierre.

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
