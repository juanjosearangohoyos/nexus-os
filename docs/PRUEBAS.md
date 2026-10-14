# Registro de pruebas — FASE 1 (versión local)

Fecha: 14 de octubre de 2026. Entorno: Windows 11, Node.js 24.20 LTS, npm 11.19, Vite 8, React 19, TypeScript 7. Navegador de pruebas: navegador integrado de Claude (Chromium) con emulación de tamaños.

## Compilación y control

| Prueba | Resultado |
|---|---|
| `npm run build` (TypeScript + Vite) | ✅ Sin errores ni advertencias de tipos |
| `npm run check:content` | ✅ 18 fuentes con URL; sin claves `[Fxx]` visibles; sin Wikipedia/Wikimedia; 17 archivos multimedia presentes |
| Build con `BASE_PATH=/nexus-os/` (GitHub Pages) | ✅ Scripts, estilos, fuentes y multimedia usan la ruta `/nexus-os/` |
| Video: `ffprobe` | ✅ H.264 1280×720 + AAC, 32,0 s; WebM VP9 + Opus; VTT en español |
| Carga limpia del build (`npm run preview`) abriendo las 10 ventanas | ✅ 0 errores de consola, 0 errores de carga |

## Once flujos

| # | Flujo | Resultado | Observaciones |
|---|---|---|---|
| 1 | Inicio: arranque con estados, «Omitir introducción», opciones de entrada | ✅ | Animación de ~4 s; panel «Accesibilidad y sonido» desplegable. |
| 2 | Modo libre: «Explorar escritorio», íconos, Dock, búsqueda | ✅ | Notificación «DOCUMENTOS 1.0» no bloqueante. |
| 3 | Recorrido guiado: «Iniciar recorrido» → Continuar/Anterior → Documentos | ✅ | La app anterior se minimiza al Dock; la isla del recorrido sigue a la app abierta. |
| 4 | Mensajes: conversación, tres modos de turnos, piezas (con error y acierto) | ✅ | Retroalimentación correcta para pieza en lugar equivocado. |
| 5 | Asistente: tres consultas, reclasificación de ideas, verificación con fuente | ✅ | Etiqueta permanente de simulación. |
| 6 | Enlace: diagrama, metaanálisis, diseño de equipo y circuito | ✅ | Advertencias correctas al asignar decisión y verificación a la IA. |
| 7 | Pizarra: Comunicar (3 orígenes), Crear (5 capas + video), Colaborar (mapa) | ✅ | Video carga con subtítulos activos. |
| 8 | Ajustes: desactivar, alerta en el flujo, informe, restaurar | ✅ | Mensaje final exacto del guion. |
| 9 | Documentos: índice, notas de fundamento, copia de impresión, objeción | ✅ | «Copiar texto» probado con clic real. |
| 10 | Citas APA: ficha con referencia completa, «Ver en Archivos», Escape | ✅ | Archivos se abre en la ficha correcta. |
| 11 | Archivos: búsqueda, filtros, créditos, enlaces y metadatos | ✅ | |

## Ventanas y teclado

| Prueba | Resultado |
|---|---|
| Abrir, enfocar, cerrar, minimizar (al Dock), restaurar desde el Dock, maximizar (doble clic en la barra) | ✅ |
| Arrastrar ventana por la barra de título | ✅ |
| `Ctrl + K` búsqueda + flechas + Enter | ✅ |
| `Esc` cierra ficha de fuente y paneles | ✅ |
| `Alt + M` minimiza · `Alt + W` cierra | ✅ |
| Recargar en `#/enlace` abre Enlace (sin 404) | ✅ (defecto encontrado y corregido durante las pruebas) |

## Adaptación

| Tamaño | Resultado |
|---|---|
| 1440 × 900 | ✅ Escritorio completo con widgets |
| 1280 × 800 | ✅ |
| 1024 × 768 | ✅ Ventanas maximizadas al abrir; menús redundantes ocultos durante el recorrido |
| 390 × 844 | ✅ Lanzador, app a pantalla completa, barra inferior; ninguna de las nueve apps desborda el ancho |

## Accesibilidad

| Prueba | Resultado |
|---|---|
| «Reducir movimiento» y «Texto grande» aplican clases globales | ✅ |
| Sonido desactivado por defecto; botón global de silencio | ✅ |
| Subtítulos del video controlados por la preferencia | ✅ |

## Defectos encontrados y corregidos durante las pruebas

1. Barra lateral que desaparecía al desplazarse (diseño de desplazamiento independiente).
2. Lista de compromisos de Ajustes comprimida a 2 px dentro de un contenedor de altura fija.
3. Columnas de Archivos que se superponían por textos de una línea.
4. Barra del recorrido que tapaba la barra de título de las ventanas (rediseñada como isla en la barra superior).
5. La ruta inicial (`#/app`) se perdía al recargar.
6. Etiqueta «Uso de IA: No se usó» marcada en rojo por error en Pizarra.
7. Desbordes horizontales en móvil (pestañas de Pizarra, filtros y etiqueta de Actividad, interruptores de Ajustes).
8. Superposición de textos en la escena 3 del video y en el lienzo «Crear».

## Retiro de narraciones (14 de octubre de 2026)

| Prueba | Resultado |
|---|---|
| `npm run build` y `npm run check:content` tras retirar las narraciones | ✅ |
| Las 10 ventanas abren sin errores; consola vacía | ✅ |
| Ningún texto visible de «Escuchar», «voz sintética», «Distribución de voces» ni grabaciones (la única coincidencia es «Escucharemos objeciones», texto del postulado 08) | ✅ |
| No quedan elementos `<audio>` ni botones de lectura; el único reproductor es el video de Pizarra | ✅ |
| Mensajes de bienvenida visibles como texto (4 apps) y «Leer su postura» en Acerca de (4 integrantes) | ✅ |
| Sonido activado: el motor de audio queda en marcha y abrir una app genera el efecto de apertura | ✅ |
| «Silenciar todo»: al abrir otra app no se genera ningún sonido | ✅ |
| Sonido de arranque `nexus-arranque.mp3` disponible (200, audio/mpeg) | ✅ |

No es posible escuchar el audio en el entorno de pruebas; la verificación del sonido es técnica (Web Audio en marcha y efectos generados).

## Optimización final (14 de octubre de 2026)

Pruebas ejecutadas tras reorganizar el recorrido en seis etapas y simplificar las nueve aplicaciones. Las comprobaciones de diseño en escritorio se hicieron con emulación de 1600 × 1000 y mediciones del DOM (posiciones y columnas), no con inspección visual a tamaño real.

| Prueba | Resultado |
|---|---|
| `npx tsc -b`, `npm run build`, `npm run check:content` | ✅ Sin errores; 18 fuentes, 17 archivos multimedia |
| Recorrido completo desde el arranque: etapas 1 → 6 con «Continuar →» | ✅ «Etapa X de 6», verbo y tiempo correctos; solo quedan visibles las ventanas de la etapa actual |
| Etapa 5 (Actividad + Ajustes) | ✅ Dos ventanas en mitades de pantalla (12–794 px y 806–1588 px), por encima del Dock (Dock desde 918 px; ventanas hasta 888 px) |
| Última etapa: «Terminar recorrido» | ✅ Sale del recorrido, vuelve al escritorio; widget «Etapas recorridas: 6 de 6»; ya no aparece el contador «x/9 apps» |
| Botón ⌂ (volver al escritorio) durante el recorrido | ✅ Minimiza todo sin salir del recorrido; sin advertencias de foco en consola |
| Actividad: filtros Todos / Comunicación / Creatividad / Colaboración / Transversal | ✅ El detalle siempre corresponde a un caso de la categoría elegida |
| Noticias: 6 tarjetas (3 columnas a 1248 px) → expediente → Anterior/Siguiente → volver | ✅ Precisiones intactas (NASA «candidato»; derecho de EE. UU.; alcance de la UE; Vaccaro «en promedio»); el mensaje «Hemos separado…» aparece una sola vez (en la vista de tarjetas) |
| Ajustes: desactivar un compromiso de «Datos» | ✅ La etapa 1 del flujo y su grupo se resaltan; mensaje con la consecuencia; la etapa se completa con una sola consecuencia; «Restaurar» reactiva los ocho |
| Documentos: Síntesis (8 tarjetas, 4 columnas) → «Leer el postulado completo» (03) → texto completo | ✅ Salta al postulado 03; índice visible solo en el texto completo; firmas, copia de impresión y objeción presentes |
| Archivos: filtros por estado (Todas 18 / Verificadas 12 / Con observaciones 6), búsqueda «unesco» (2), búsqueda sin resultados, «Limpiar filtros» | ✅ La ficha siempre corresponde a una referencia visible; estado vacío sin ficha; «Con observaciones» visible en lista y ficha |
| Recarga limpia del servidor de desarrollo abriendo las nueve apps y Acerca de | ✅ Sin errores de consola |
| `npm run preview` (4173): las nueve apps, póster del video y sonido de arranque | ✅ Sin errores de consola; recursos con estado 200 |
| 390 × 844: las nueve apps | ✅ Ningún elemento desborda el ancho; un único contenedor de desplazamiento por app |
| Restos de narraciones en `src/` | ✅ Solo usos figurados de «voces» y el sonido de arranque de la interfaz |

Defectos encontrados y corregidos en esta fase:

1. Actividad mostraba el detalle de un caso de otra categoría al cambiar de filtro.
2. Archivos podía mostrar la ficha de una referencia oculta por los filtros (mismo patrón que Actividad).
3. Contadores contradictorios: «x/9 apps visitadas» frente a etapas del recorrido; ahora solo se cuentan etapas.
4. Encabezado fijo de Pizarra que se superponía al contenido al desplazarse.
5. Advertencia de accesibilidad: una ventana minimizada conservaba el foco bajo `aria-hidden`; ahora se usa solo `inert`, que libera el foco.

## Limitaciones conocidas (no son fallos de la web)

- La impresión real («Guardar como PDF») debe confirmarse manualmente con `Ctrl + P` en Documentos: se verificó que la copia editorial de impresión existe con los ocho postulados, pero el diálogo de impresión no puede automatizarse en el entorno de pruebas.
- No se probó en Safari/iOS ni en Firefox; se recomienda revisarlo en los equipos del grupo antes de la presentación.
