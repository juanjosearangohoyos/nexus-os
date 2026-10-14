# Textos de bienvenida, guion del video y diseño sonoro

NEXUS OS **no incluye narraciones de voz** de los integrantes (ni sintéticas ni grabadas), por decisión del equipo del 14 de octubre de 2026. Los mensajes de cada desarrollador se presentan como texto.

## Mensajes de bienvenida (texto en cada aplicación)

Se muestran como tarjetas con monograma, nombre y cargo en la barra lateral de cada app y en «Acerca de NEXUS OS» › «Leer su postura».

**Valentina Giraldo — Bienvenida a Mensajes.** «Conectar cuatro personas no nos convierte automáticamente en un equipo inteligente. Necesitamos escuchar, contrastar experiencias y aprender a construir algo que ninguno tenía al empezar. Por eso diseñamos Mensajes».

**Juan Román — Bienvenida a Asistente.** «La IA puede generar ideas, analizar información y acelerar tareas. Pero también puede equivocarse con enorme seguridad. Nuestra propuesta es utilizarla como herramienta sin confundir sus respuestas con conocimiento verificado».

**Sebastián Camacho — Bienvenida a Enlace.** «La colaboración híbrida no aparece simplemente porque abramos un chatbot. Debemos decidir qué tarea corresponde a las personas, cuál puede apoyar la IA y dónde hacen falta discusión, revisión y responsabilidad conjunta».

**Juan José Arango — Bienvenida a Ajustes.** «Nos dimos cuenta de que un sistema que funciona técnicamente también puede fallar socialmente. Por eso decidimos publicar sus criterios de transparencia, inclusión, responsabilidad y revisión. Esta es nuestra posición como desarrolladores».

**Línea coral (Acerca de NEXUS OS y video).** «Creamos herramientas. Elegimos principios. Respondemos por nuestras decisiones».

El texto íntegro del manifiesto está en Documentos y en `docs/MANIFIESTO.md`.

## Video V01 «NEXUS OS — Introducción» (32 s)

Archivo: `public/media/video/nexus-os-introduccion.{webm,mp4}` · Subtítulos: `nexus-os-introduccion.es.vtt` · Generador: `tools/media/make_video.py`.
Sin imágenes ni voces de los integrantes: tipografía cinética, monogramas y diagramas. Música instrumental original sintetizada (`tools/media/make_audio.py`).

| Tiempo | Imagen | Texto en pantalla / subtítulo |
|---|---|---|
| 0–5 s | Red de puntos (izquierda) y trazos de una rejilla (derecha) convergen; aparece el logo | [Música instrumental original] NEXUS OS 1.0 |
| 5–10 s | Tipografía cinética | Diferentes formas de pensar. / Una nueva forma de crear. |
| 10–18 s | Tres círculos se superponen; núcleo luminoso | Colectiva: saberes que se coordinan · Artificial: sistemas que infieren · Híbrida: colaboración con responsabilidades · Se cruzan, pero ninguna es idéntica a otra. |
| 18–24 s | «106 experimentos.» y tres barras ordinales | Sumar humano + IA no garantiza superar al mejor por separado (Vaccaro et al., 2024). |
| 24–29 s | Monogramas VG, JR, SC, JJ con sus áreas | Creamos herramientas. Elegimos principios. Respondemos por nuestras decisiones. |
| 29–32 s | Llamado final | Lee nuestras fuentes. Cuestiona nuestros principios. Crea con responsabilidad. |

## Sonido (todo desactivado por defecto)

- **Arranque** (3,5 s): pulso grave y acorde ascendente. `public/media/audio/nexus-arranque.mp3/.ogg`. Suena solo si el visitante activó el sonido y pulsa una opción de entrada.
- **Interfaz**: clics, apertura y cierre de ventanas, minimización, interruptores, alertas y confirmaciones, sintetizados en tiempo real (`src/lib/sound.ts`).
- **Ambiente sonoro**: acorde instrumental suave y opcional (Accesibilidad y sonido › «Ambiente sonoro»; requiere «Sonido»).
- **Silenciar**: botón de altavoz en la barra superior (silencia todo) o Accesibilidad y sonido › «Sonido».
