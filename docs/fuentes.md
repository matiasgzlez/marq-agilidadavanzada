# Fuentes y referencias

Consultadas el 8 de octubre de 2026.

## MARQ y Natalini

- [Estudio MARQ](https://estudiomarq.com.ar/): identidad, lenguaje de valor, proyectos y presentación de Natalini como edificio terminado.
- [Torre Natalini](https://estudiomarq.com.ar/torre-natalini/): ubicación Formosa 485, esquina Av. Rivadavia; arquitectura, basamento vegetal y fotografías. Los datos del proyecto se distinguen de la intervención propuesta.
- Foto de torre: https://estudiomarq.com.ar/wp-content/uploads/natalini-new-001.webp
- Foto frontal de referencia: https://estudiomarq.com.ar/wp-content/uploads/2024/07/torre-natalini01.webp

Las imágenes se usan como referencia en esta presentación para MARQ. No se presume licencia para una campaña comercial pública.

## Cultura y referencias editoriales

- [Gobierno del Chaco, Bienal 2026](https://www.chaco.gov.ar/noticia-bienal-2026-resistencia-celebra-el-encuentro-mundial-del-arte-a-cielo-abierto-2026-07-18-13-16): referencia de enfoque sobre arte a cielo abierto e inauguración.
- [Diario Norte: Cuando Resistencia empezó a ser un museo a cielo abierto](https://www.diarionorte.com/330551-cuando-resistencia-empezo-a-ser-un-museo-a-cielo-abierto): contexto cultural y referencia editorial.
- [Diario Norte](https://www.diarionorte.com/): referencia de titulares, serif y etiquetas, junto a la captura proporcionada por el usuario.
- [DataChaco](https://www.datachaco.com/): estilo inspirado principalmente en la captura del usuario. El acceso automatizado al portal devolvió 403; no se verificó una nota específica.
- [Más Contenido](https://mascontenido.net/): referencia solicitada; la respuesta obtenida no permitió verificar su diseño editorial. La maqueta es una interpretación propia, no una réplica del sitio.

Los artículos de la web son textos originales e hipotéticos. No se copian noticias ni se atribuyen citas inventadas a artistas, funcionarios o instituciones. El año 2027 es un horizonte ilustrativo sin fecha de evento comprometida.

## Referencia visual

- [NLASmith](https://nlasmith.com/)
- [Repositorio de referencia](https://github.com/alejorrojas/nlasmith)

Se inspeccionaron portada, CSS, degradado y cierre de marca. La adaptación usa código propio: paleta papel/hormigón/bronce, portada con grano, tipografía amplia, superficies sobrias y marca de gran escala. No se incorporan su aplicación, credenciales, backend ni textos.

## Servicios de exploración

Google Maps se carga al elegir Mapa; Google Earth se abre externamente mediante búsqueda de Natalini. Son herramientas para explorar el lugar real, no visualizaciones de la instalación futura. No se afirma que se haya agregado una escultura a los datos de Google.

## Imagen conceptual

Generada con la herramienta integrada de imágenes, basada en la foto frontal. Archivo: `assets/alloy-concept.png`. Inspeccionada visualmente. La IA altera detalles y no ofrece un replanteo arquitectónico exacto. El prompt y sus restricciones están en `prompt-imagen.md`.

## Revisión de movimiento

- [Paper Grain Gradient](https://shaders.paper.design/grain-gradient): mismo shader `corners` que usa NLASmith. Implementado mediante `@paper-design/shaders` con paleta MARQ.
- [Aceternity Aurora Background](https://ui.aceternity.com/components/aurora-background): bandas de degradado animadas con CSS; el ejemplo `motion.div` controla la entrada del contenido. Evaluado como alternativa.
- [Aceternity Animated Tabs](https://ui.aceternity.com/components/tabs): referencia para la selección que se desplaza y el contenido animado. Se creó una implementación propia en JavaScript nativo.
- [Aceternity Background Gradient Animation](https://ui.aceternity.com/components/background-gradient-animation): evaluado; se prefirió Paper para conservar el grano y la composición de NLASmith.

También se consideró Compare para las vistas de Natalini; no se incorporó porque los encuadres actuales no coinciden y un deslizador sugeriría una comparación fotográfica exacta.

### Identidad y componentes — revisión de interfaz
- Logotipo vectorial oficial: https://estudiomarq.com.ar/wp-content/uploads/2024/12/estudiomarq.svg
- Referencias para las cards: https://ui.aceternity.com/components/bento-grid , https://ui.aceternity.com/components/glowing-effect y https://ui.aceternity.com/components/card-hover-effect . Adaptación propia en CSS y JavaScript.

### Cuatro maquetas editoriales (9 de octubre de 2026)
Se revisaron las portadas y recursos públicos de https://www.diarionorte.com/ , https://www.diariochaco.com/ , https://www.diariotag.com/ y https://www.datachaco.com/ . Se guardaron sus logos en assets. Colores observados en CSS: Diario Chaco #bc1918, TAG #125ecc, DataChaco #d82727. Norte conserva su logo verde/amarillo, títulos serif y etiquetas amarillas. Titulares y textos de las maquetas son originales, ficticios, sin citas inventadas de personas reales.
