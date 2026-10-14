# NEXUS OS

**«Diferentes formas de pensar. Una nueva forma de crear.»**

Manifiesto interactivo sobre las inteligencias **colectiva, artificial e híbrida** y su efecto en la **comunicación, la creatividad y la colaboración**, presentado como un sistema operativo original inspirado en macOS, Windows 11 y visionOS.

Ciberculturas · Pontificia Universidad Javeriana Cali · 2026
Autoría colectiva: **Valentina Giraldo, Juan Román, Sebastián Camacho y Juan José Arango**.

---

## Qué contiene

| Elemento | Dónde |
|---|---|
| Arranque (3–5 s, «Omitir»), escritorio, barra superior, Dock con ampliación, ventanas reales (mover, redimensionar, minimizar, maximizar, cerrar), búsqueda (Ctrl + K), centro de accesibilidad, notificaciones, widgets | `src/components/os/` |
| Nueve aplicaciones: Mensajes, Asistente, Enlace, Pizarra, Noticias, Actividad, Ajustes, Documentos, Archivos + «Acerca de NEXUS OS» | `src/apps/` |
| Recorrido esencial de seis etapas (≈ 7 min), con Noticias y Archivos como recursos de profundización | `src/content/tour.ts`, `src/components/os/TourBar.tsx` |
| Textos aprobados (guion maestro v4), manifiesto íntegro, 18 fuentes APA 7, créditos | `src/content/` |
| Logo y nueve íconos originales (SVG + PNG 512/180 px) | `public/icons/` |
| Fotografía documental autorizada (NASA), video original con subtítulos, sonido de arranque original | `public/media/` |
| Generadores de audio y video (Python + ffmpeg) | `tools/media/` |
| Documentación académica y de producción | `docs/` |
| Flujo de despliegue en GitHub Pages (preparado, no ejecutado) | `.github/workflows/deploy.yml` |

## Requisitos

- **Node.js 20 o superior** (probado con Node 24.20 LTS y npm 11).
- Solo para regenerar multimedia: Python 3.10+ con `numpy` y `pillow`, y `ffmpeg` en el PATH.

## Instalación y uso

```bash
npm install
```

```bash
npm run dev
```

Abre `http://localhost:5173/`.

```bash
npm run build
```

Compila el sitio estático en `dist/` (verificación de tipos con TypeScript incluida).

```bash
npm run preview
```

Sirve la compilación en `http://localhost:4173/` para revisarla tal como quedará publicada.

Otros comandos:

| Comando | Función |
|---|---|
| `npm run check:content` | Control editorial: sin claves `[Fxx]` visibles, sin Wikipedia/Wikimedia, fuentes con URL y multimedia presente. |
| `npm run icons:png` | Exporta los SVG de `public/icons` a PNG (512 y 180 px). |
| `npm run media:audio` | Regenera el sonido de arranque y la banda del video (síntesis original). |
| `npm run media:video` | Regenera el video de introducción (32 s, MP4 + WebM + VTT + póster). Ejecutar después de `media:audio`. |

## Publicación en GitHub Pages (FASE 2 — pendiente de aprobación del equipo)

El proyecto **no se ha publicado**. Cuando el equipo apruebe la versión local y el repositorio de destino:

1. Crear un repositorio **público** en GitHub (con GitHub Free, Pages requiere repositorio público), por ejemplo `nexus-os`.
2. Subir el contenido de esta carpeta (la carpeta `referencias/` está excluida en `.gitignore`; decidan con la docente si se publica).
3. En el repositorio: **Settings › Pages › Build and deployment › Source: GitHub Actions**.
4. Hacer `push` a la rama `main`. El flujo `Desplegar NEXUS OS en GitHub Pages` compila con la ruta base correcta (`/NOMBRE_REPOSITORIO/`) y publica `dist/`.
5. La dirección será `https://USUARIO.github.io/REPOSITORIO/`. Comprobar que cargan íconos, imagen de NASA, video y audio.

Compilación manual para un repositorio de proyecto:

```bash
BASE_PATH=/nexus-os/ npm run build
```

La navegación usa rutas con `#` (`/#/mensajes`), por lo que recargar cualquier aplicación no produce errores 404 en GitHub Pages.

## Accesibilidad

- Navegación completa con teclado, foco visible y enlace «Saltar al contenido».
- `Ctrl + K` búsqueda · `Esc` cierra paneles y fichas · `Alt + W` cierra la ventana activa · `Alt + M` la minimiza · `Alt + flechas` sobre el título mueve la ventana.
- Arrastrar nunca es el único método: todas las interacciones tienen alternativa por clic o teclado.
- Respeta `prefers-reduced-motion`; además hay interruptores de «Reducir movimiento», «Fondo estático», «Texto grande» y «Subtítulos».
- Sin sonido automático: el sonido se activa solo por decisión del visitante. Botón global de silencio en la barra superior.
- Versión móvil real (390 × 844): lanzador de aplicaciones, una app a pantalla completa y barra inferior.

## Honestidad del producto

- Las simulaciones (Asistente, Actividad, Ajustes, Enlace) están etiquetadas como tales; **no** llaman a ninguna API ni muestran datos reales.
- NEXUS OS no incluye narraciones de voz de los integrantes (ni sintéticas ni grabadas): sus mensajes y el manifiesto se presentan como texto.
- La objeción del visitante **no se envía ni se almacena en un servidor**: se copia al portapapeles.
- Los activos gráficos, sonoros y audiovisuales originales se elaboraron **con asistencia de IA generativa (Claude, Anthropic)** bajo dirección del equipo y así se declara en Archivos › Créditos, en coherencia con el compromiso del manifiesto.
- No hay fotografías, retratos ni avatares de los integrantes.

## Estado

Consulta `docs/PRUEBAS.md` (pruebas realizadas), `docs/AUDITORIA_FUENTES.md` (verificación bibliográfica y decisiones pendientes) y `docs/MATRIZ_RUBRICA.md` (evidencia por criterio).
