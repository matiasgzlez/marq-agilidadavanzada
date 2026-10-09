# MARQ Alloy — Agilidad avanzada

**Arquitectura, arte y comunidad para hacer visible a MARQ en Resistencia.**

Este proyecto es una presentación web de **MARQ Alloy**, una propuesta para Estudio MARQ que busca transformar sus desarrollos en lugares que la ciudad reconozca, recuerde y comparta.

## La idea para MARQ

El desafío planteado es aumentar el reconocimiento de MARQ en Resistencia. La propuesta aprovecha una identidad propia de la ciudad: su relación con las esculturas y el arte en el espacio urbano.

**Cada nuevo desarrollo incorpora una escultura de un artista regional. El edificio y la obra se presentan juntos, en una misma inauguración.** La escultura se concibe en diálogo con la arquitectura y forma parte de la identidad del proyecto desde el primer día.

La intervención contempla una base de hormigón con el nombre de MARQ y la autoría de la pieza, acompañada por iluminación cálida. La participación artística podría concretarse mediante una convocatoria a artistas locales o un concurso estudiantil en un convenio a explorar con FADyCC–UNNE.

*Alloy* significa «aleación»: el nombre expresa la unión de arquitectura, arte y comunidad para crear valor en la ciudad.

## Qué busca generar

- **Presencia cotidiana:** una obra visible en los recorridos de vecinos, residentes y visitantes.
- **Identidad para cada proyecto:** un lugar con una historia y un punto de referencia propio.
- **Reconocimiento de marca:** asociar el nombre de MARQ con una contribución concreta al entorno urbano.
- **Vínculos y comunicación:** un encuentro con artistas y comunidad, y contenido para comunicar el proyecto antes, durante y después de su inauguración.

Son objetivos de la propuesta, cuyo impacto deberá evaluarse al implementar un piloto.

## Qué muestra la presentación

La experiencia sigue el recorrido **Dolor → Solución → Noticias** e incluye:

- La explicación de MARQ Alloy y sus cuatro componentes: arquitectura, arte regional, presencia y comunidad.
- Una visualización conceptual de una escultura frente a Torre Natalini, con comparación de la imagen actual y la propuesta.
- Google Maps integrado y un enlace a Google Earth para explorar el entorno.
- Cuatro maquetas de noticias inspiradas en Diario Norte, Diario Chaco, Diario TAG y DataChaco, con lectura ampliada.
- Un selector entre **Soluciones** y **Design thinking**. La segunda solución y Design thinking tienen espacios reservados para una próxima etapa.

### El escenario de Natalini

Torre Natalini ya está construida. Aquí se utiliza como referencia visual para **imaginar que el edificio y su escultura se inauguran juntos**. Ese ejercicio permite mostrar cómo se comunicaría la propuesta al aplicarla a un nuevo desarrollo de MARQ.

Las noticias son textos originales y ficticios; no fueron publicadas por los medios ni representan su respaldo. La imagen de la intervención fue generada con IA. Esta presentación conceptual no es el sitio oficial de MARQ. Los acuerdos con artistas e instituciones, el emplazamiento y los permisos se definirían durante la implementación; la instalación de una obra no implica su declaración automática como patrimonio cultural.

## Ejecutar en tu computadora

Requiere Node.js compatible con Vite 8 (20.19+ o 22.12+; se recomienda una versión LTS vigente) y npm.

```sh
git clone https://github.com/matiasgzlez/marq-agilidadavanzada.git
cd marq-agilidadavanzada
npm ci
npm run dev
```

Abrí **http://127.0.0.1:4173/**. Vite actualiza la presentación al guardar cambios. Para detener el servidor, usá `Ctrl+C`.

Si el puerto está ocupado, detené el servidor anterior o elegí otro:

```sh
npm run dev -- --port 4174
```

## Compilar y previsualizar

```sh
npm run build
npm run preview
```

La compilación se genera en `dist/`, incluyendo los recursos y documentos de referencia. `preview` también utiliza el puerto 4173, por lo que debés detener `dev` antes de iniciarlo. Subir este repositorio a GitHub no publica automáticamente un sitio web.

## Estructura del proyecto

| Archivo o carpeta | Contenido |
| --- | --- |
| `index.html` | Estructura, textos y cards de la presentación |
| `styles.css` | Identidad visual, diseño adaptable y animaciones |
| `app.js` | Selectores, explorador y lecturas de noticias |
| `background.js` | Fondo animado con shader de Paper Design |
| `transitions.js` | Indicadores deslizantes y transiciones |
| `assets/` | Logos, fotografías y visualización conceptual |
| `docs/propuesta.md` | Fundamentos y criterios de implementación |
| `docs/prompt-imagen.md` | Prompt de la imagen, disponible solo en el repo |
| `docs/fuentes.md` | Fuentes y referencias visuales/editoriales |
| `docs/verificacion.md` | Registro de verificaciones y limitaciones |

## Diseño y tecnología

La web utiliza HTML, CSS y JavaScript con Vite. El fondo es un shader GrainGradient de `@paper-design/shaders`, no un video, con una paleta de carbón, bronce y marfil. El diseño toma referencias de NLASmith y de componentes de Aceternity UI, adaptadas con código propio.

Las animaciones respetan la preferencia de movimiento reducido y el fondo tiene un degradado CSS de respaldo. Los controles flotantes mantienen su contraste sobre las distintas secciones.

Los logos y fotografías de terceros se incluyen como referencias dentro de esta presentación. Su inclusión no implica cesión de derechos ni afiliación; las fuentes están documentadas en [docs/fuentes.md](docs/fuentes.md).
