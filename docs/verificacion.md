# Verificación de la primera versión

- JavaScript: comprobación sintáctica con `node --check`, sin errores.
- HTML: referencias locales, IDs únicos y destinos de controles revisados.
- Servidor local: respuesta HTTP 200.
- Navegación: Soluciones, segunda solución reservada y Design thinking probados en navegador.
- Explorador: imagen propuesta, fotografía de referencia y mapa alternados correctamente. Google Maps mostró Torre Natalini en Formosa 485.
- Noticias: tres medios alternados; diálogo de lectura comprobado con DataChaco y cierre por botón.
- Prompt: copia comprobada mediante mensaje de éxito.
- Responsive: anchos de 390 y 1440 píxeles sin desbordamiento horizontal.
- Consola: sin errores observados durante el recorrido probado.
- Estado Git: repositorio local inicializado; todos los entregables siguen sin commits.

## Límites

Google Earth se ofrece como enlace externo, sin incrustación 3D propia. Las imágenes actuales y conceptuales tienen encuadres diferentes; no se ofrece una comparación técnica exacta. La maqueta de Más Contenido es una interpretación porque no se pudo verificar su página editorial. Las noticias y la instalación son hipotéticas. Los resultados del programa cultural requieren un piloto real.

## Actualización: Vite y movimiento

- `npm run dev`: arranque correcto en 127.0.0.1:4173, con actualización al guardar.
- `npm run build`: compilación correcta; se verificó que los recursos seleccionados dinámicamente y los documentos estén presentes en `dist/`.
- Fondo: GrainGradient real montado en un canvas WebGL; textura decodificada antes del montaje.
- Switch principal, selector de solución, vistas Actual/Propuesta y tres medios probados en navegador, incluyendo cambios consecutivos.
- Indicadores deslizantes visibles en móvil; ancho de 390 px sin desbordamiento.
- Reducción de movimiento implementada con media query y listener; degradado de respaldo ante fallo de WebGL.

## Revisión del 9 de octubre — jerarquía y navegación
- Orden editorial: dolor → identidad MARQ Alloy → solución/visualización/valor → noticias.
- Eliminados minitítulos, prompt visible, piloto 06, preguntas y cierre posterior. Prompt conservado en docs/prompt-imagen.md.
- Logo: SVG oficial de Estudio MARQ, conservando su forma y lema.
- Cards adaptadas al sitio con referencias de Aceternity: Bento Grid, Glowing Effect y Card Hover Effect; implementación CSS/JS local sin dependencia React.
- Prueba real a 1440×1000: switch principal antes/después x581.859,y26.273 (4 cambios); soluciones x130,y462; explorador x1082.906,y530.820; medios x130,y528.953. Sin desplazamiento al seleccionar.
- Fondo calculado del switch sobre papel: rgb(36,38,34); texto inactivo rgb(231,231,223), activo rgb(36,38,34) sobre indicador claro.
- Lectura de noticia abre/cierra correctamente; consola sin errores JavaScript.
- Build Vite y node --check app.js correctos.
- La herramienta de viewport no aplicó el cambio a 390×844 (innerWidth siguió en 1440). Estilos móviles implementados; verificación visual móvil pendiente.

## MARQUI — seis funciones y demo WhatsApp Web
- Añadida segunda solución MARQUI; eliminada la función de coordinación del equipo del selector de la demo.
- Seis casos con explicación, tres pasos, conversación y acciones simuladas.
- Verificado en navegador: selección de respuesta, edición, envío ficticio y reinicio con borrador vacío y envío deshabilitado.
- Verificados los cinco flujos restantes: paso de revisión, confirmación/continuación y estado completado.
- Verificado el cambio entre WhatsApp Web y celular. La vista de celular es un modo de la demo, no una integración real.
- Build Vite, sintaxis JS y git diff --check correctos.
- Tras propagarse el cambio de viewport, se verificó 390×844: sin desborde horizontal, publicación simulada de avance completada y selección de respuesta en modo celular correcta.
