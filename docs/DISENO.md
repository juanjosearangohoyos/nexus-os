# Sistema de diseño — NEXUS OS

## Dirección de arte

Sistema operativo original, no una copia: **macOS** como patrón principal (barra superior, Dock con ampliación, ventanas con controles de semáforo, íconos de alto acabado), **Windows 11** en el lanzador de aplicaciones, los widgets y la claridad de Ajustes y Archivos, y **visionOS** en la profundidad de los paneles translúcidos. Referencia de composición: 1440 × 900; adaptado a 1280, 1024, tableta y 390 × 844.

## Fondo narrativo

Canvas original con tres zonas: **red colectiva** (nodos orgánicos turquesa, izquierda), **arquitectura computacional** (rejilla y trazos ortogonales violeta, derecha) y **zona de encuentro** (núcleo coral, centro). Pulsos que viajan desde ambos lados hacia el centro; parallax sutil. Versión estática con «Fondo estático» o «Reducir movimiento».

## Color

| Token | Valor | Uso |
|---|---|---|
| `--night` | `#0C142A` | Base azul noche |
| `--graphite` | `#18233B` | Superficies |
| `--soft` | `#F3F7FF` | Texto principal |
| `--cyan` | `#5CC8FF` | Evidencia, foco |
| `--violet` | `#9B5CFF` | Inteligencia artificial |
| `--turquoise` | `#2EE6C9` | Inteligencia colectiva, principios |
| `--coral` | `#FF7A6B` | Intersección, Noticias |
| `--amber` | `#FFB020` | Atención, Archivos |

Acentos por aplicación: Mensajes verde esmeralda, Asistente púrpura, Enlace azul, Pizarra naranja, Noticias coral, Actividad cian, Ajustes plata, Documentos azul real, Archivos ámbar. Cada ventana tiene identidad propia: chat (Mensajes), orbe y terminal amable (Asistente), diagrama y asignación (Enlace), lienzo punteado y notas adhesivas (Pizarra), lector en papel claro con tipografía serif (Noticias), tabla de monitor (Actividad), panel de ajustes (Ajustes), documento editorial (Documentos), explorador de archivos (Archivos).

## Etiquetas de estatuto

`HECHO DOCUMENTADO` (cian) · `NUESTRA INTERPRETACIÓN` (lila) · `SIMULACIÓN` (ámbar) · `PRINCIPIO` (turquesa). Se usan de forma constante en todas las apps.

## Tipografía

Inter (lectura), Space Grotesk (títulos), JetBrains Mono (estados del sistema). Instaladas localmente con Fontsource: funcionan sin internet.

## Íconos

Nueve íconos 1:1 originales en SVG con fondo de esquinas continuas, degradado, brillo superior controlado, borde interior y sombra del glifo. Exportados a PNG (512 y 180 px) con `npm run icons:png`.

## Movimiento

Apertura de ventana con muelle suave, minimizado hacia el Dock, rebote del ícono al abrir, ampliación del Dock según la distancia del puntero, esqueletos de carga coherentes, notificaciones deslizantes. Todo se desactiva con `prefers-reduced-motion` o el interruptor «Reducir movimiento».

## Accesibilidad

Contraste alto sobre fondos oscuros; versiones en papel claro para lectura larga (Noticias, Documentos). Roles ARIA en conmutadores, pestañas, grupos de opción y diálogos; foco visible; alternativas por teclado al arrastre; subtítulos; textos alternativos en imágenes informativas y `aria-hidden` en decorativas.
