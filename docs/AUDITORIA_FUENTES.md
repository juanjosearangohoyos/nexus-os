# Auditoría de fuentes — NEXUS OS

Fecha de cotejo: **14 de octubre de 2026**. Método: consulta directa de cada documento original (página institucional, PDF o DOI) y de los metadatos de Crossref cuando existe DOI. Formato: APA 7.ª edición con la adaptación al español del Centro de Escritura Javeriano (manual incluido en `referencias/`): «y» en citas y referencias en español, «, &» en referencias en inglés, fechas «(año, día de mes)», «s.f.» para obras sin fecha.

Las claves F01–F16 son **solo internas** (campo `internal` en `src/content/sources.ts`). La interfaz muestra siempre la cita autor-año, que abre una ficha con la referencia completa y el enlace original.

## 1. Estado por fuente

| Clave | Cita en la web | Estado | Qué se comprobó | Observaciones |
|---|---|---|---|---|
| F01 | (Levine et al., 1999) | Verificada | Autores, año y texto en cluetrain.com | Se cita la versión web original. |
| F02 | (Weinberger y Searls, 2015) | Verificada con observaciones | Fecha (8 de enero de 2015), autoría en la página | **Cambio:** la página firma «David Weinberger and Doc Searls»; el guion decía «Searls & Weinberger». El subdominio `newclues.cluetrain.com` de la consigna no respondió; se usa `cluetrain.com/newclues/`. |
| F03 | (Lévy, 1994/2004) | Verificada con observaciones | Portada y página legal del PDF: OPS, Washington D. C., marzo de 2004; traducción de Felino Martínez Álvarez; original francés de La Découverte | **Cambio APA:** obra traducida con doble fecha. Cita textual localizada en la sección «¿Qué es la inteligencia colectiva?» (el PDF no imprime números de página). **Pendiente:** confirmar con la docente que es la edición usada en el curso. Enlace de consulta: copia en el repositorio de la PUCP (no se usa el enlace de WordPress de la consigna). |
| F04 | (MIT Center for Collective Intelligence, s.f.-a) | Verificada | Página «About», pregunta central del centro y noción de *supermind* | Sin fecha de publicación. |
| F04b | (MIT Center for Collective Intelligence, s.f.-b) | Verificada | Página «Measuring Collective Intelligence»: correlación con sensibilidad social y turnos de conversación | Sin fecha de publicación. |
| F04c (nueva) | (Woolley et al., 2010) | Verificada | Metadatos en Crossref: *Science*, 330(6004), 686–688 | **Añadida** como fuente académica primaria que respalda la página del MIT. |
| F05 | (Vaccaro et al., 2024) | Verificada | PMC y Crossref: *Nature Human Behaviour*, 8(12), 2293–2303; 106 experimentos, 370 tamaños de efecto; publicado el 28/10/2024; CC BY 4.0 | Se añadió el número (12). No se convierten tamaños de efecto en porcentajes. |
| F06 | (OECD, 2024) | Verificada | Crossref (5 de marzo de 2024) y serie *OECD Artificial Intelligence Papers*, n.º 8 | Se añadió número de serie y editorial. |
| F07 | (UNESCO, 2021) | Verificada | Adopción el 23 de noviembre de 2021 (41.ª Conferencia General); valores y principios | Recomendación, no ley nacional. |
| F08 | (NIST, 2023) | Verificada con observaciones | Portada del PDF: *NIST AI 100-1*, enero de 2023; siete características de IA confiable | **Cambio:** la portada no consigna autor personal → autoría institucional. Crossref registra a Elham Tabassi (el guion citaba «Tabassi, 2023»). **Decisión a validar por el equipo.** |
| F09 | (De Val Pardo, 2024) | Verificada con observaciones | PDF: *Encuentros Multidisciplinares*, n.º 77, mayo-agosto 2024, pp. 1–6; autora Isabel De Val Pardo | El servidor solo respondió por HTTP. |
| F10 | (Dellermann et al., 2019) | Verificada | Crossref: *Business & Information Systems Engineering*, 61(5), 637–643 | Se añadió el número (5). La definición se presenta como paráfrasis. |
| F11 | (Brennan, 2026) | Verificada | NASA Science, 27/01/2026; HD 137010 b descrito como **candidato**; un tránsito en datos K2; cuatro voluntarios de Planet Hunters coautores | La nota **no menciona IA**: no se presenta como caso de inteligencia híbrida. Imagen: NASA/JPL-Caltech/Keith Miller (Caltech/IPAC). |
| F12 | (U.S. Copyright Office, 2025) | Verificada | NewsNet n.º 1060, 29/01/2025; conclusiones sobre contribución humana y prompts | Marco jurídico de **Estados Unidos**, no colombiano. |
| F13 | (European Commission, 2026) | Verificada | Publicación del 20/07/2026 (actualizada el 31/07/2026); artículo 50; aplicación desde el 2/08/2026 | Ámbito: Unión Europea. Las obligaciones dependen del supuesto regulado. |
| F14 | (UNESCO, 2025) | Verificada | Nota del 25/11/2025; informe CULTAI presentado el 30/09/2025 en MONDIACULT 2025 | Expediente de debate, no afirmación de que «la IA destruye la cultura». |
| F15 | (Parlamento Europeo, 2025) | Verificada con observaciones | Página en español; publicada el 23/09/2020; actualizada el **25**/04/2025 | **Cambio:** el guion indicaba «24 de abril». Se usa la versión en español que enlaza la consigna. |
| F16 | (Sastre Domínguez, 2024) | Verificada con observaciones | PDF de la guía (créditos, NIPO, licencia CC BY-SA 4.0) | El DOI impreso `10.4438/LADA059_2024` **no resolvía** en doi.org; se usa la URL de INTEF. |

**Total:** 18 referencias (16 del guion + Woolley et al. 2010 + desdoblamiento F04/F04b). Ninguna se marca como definitiva sin cotejo.

## 2. Fuentes de la consigna que no se usan como referencia

| Recurso | Motivo |
|---|---|
| «Inteligencia colectiva según el MIT (Rey, 2009)» (enlace a Google Drive) | No es una publicación institucional o académica verificable; se sustituye por las páginas primarias del MIT CCI y por Woolley et al. (2010). |
| PDF de Lévy alojado en WordPress | Sitio personal; se cita la edición de la OPS con enlace a un repositorio universitario. |
| Copias de *New Clues* en Scribd y del artículo de De Val Pardo en ResearchGate | Se prefieren los sitios originales de los autores y de la revista. |
| Wikipedia / Wikimedia | Excluidas por decisión editorial. `npm run check:content` lo verifica. |

## 3. Decisiones que requieren aprobación del equipo

1. **NIST:** autoría institucional (portada) frente a «Tabassi» (Crossref).
2. **New Clues:** orden de autores según la página original (Weinberger y Searls).
3. **Lévy:** doble fecha (1994/2004) y confirmación de la edición usada en clase.
4. **Integrantes:** la consigna impresa indica grupos de tres; el proyecto mantiene a los cuatro autores por decisión del equipo. Confirmar la autorización con la docente.
5. **Declaración de uso de IA:** los activos visuales, sonoros y audiovisuales se elaboraron con asistencia de IA generativa bajo dirección del equipo. La consigna lo permite si se cita; Archivos › Créditos lo declara. El equipo debe revisar y aprobar esos activos.
6. **Narraciones:** decisión del equipo (14/10/2026): no se incluyen narraciones de voz de los integrantes, ni sintéticas ni grabadas. Ver `docs/ESTADO_VOCES.md`.

## 4. Afirmaciones con cuidado factual explícito

- HD 137010 b: siempre «candidato», nunca «planeta confirmado» ni «caso de IA».
- Vaccaro et al. (2024): «en promedio, superaron a las personas solas, pero no a la mejor alternativa por separado»; nunca «la colaboración con IA siempre gana» ni «siempre pierde».
- U.S. Copyright Office: siempre identificado como derecho de Estados Unidos.
- Comisión Europea: obligación legal **en la UE** desde el 2/08/2026; las demás medidas de Ajustes son recomendaciones éticas del equipo, no obligaciones legales.
- Ninguna cifra de la interfaz es inventada: los únicos números de estudio son 106 experimentos y 370 tamaños de efecto. Las gráficas de Enlace y Actividad son ordinales o cualitativas y lo declaran.
