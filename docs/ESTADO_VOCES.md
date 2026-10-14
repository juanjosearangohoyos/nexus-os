# Estado de las voces — NEXUS OS

Última actualización: 14 de octubre de 2026. **Tarea cerrada.**

## Decisión final del equipo

**Se eliminan las narraciones de los cuatro desarrolladores.** NEXUS OS no usa voces generadas con IA ni grabaciones de los integrantes. Los mensajes de bienvenida y el manifiesto se presentan como texto.

## Cambios realizados

- Eliminado `src/lib/speech.ts` (síntesis de voz del navegador).
- El componente de narración se sustituyó por `WelcomeNote` (`src/components/ui/bits.tsx`): tarjeta de texto con monograma, nombre, cargo y mensaje, en Mensajes, Asistente, Enlace y Ajustes.
- «Acerca de NEXUS OS»: retirado el botón «Escuchar»; «Leer su postura» muestra el mensaje como texto. Se conservan nombres, cargos, monogramas e insignias.
- Documentos: retirados «Escuchar manifiesto», el aviso de voz, el resaltado de lectura y el bloque «Distribución de voces». Se conservan el índice, el texto íntegro, las firmas con monogramas, imprimir/guardar PDF y la objeción.
- `src/content/team.ts`: campos renombrados a `welcomeTitle` / `welcomeText` (mismo texto); las responsabilidades ya no mencionan lecturas en voz.
- `src/content/manifesto.ts`: eliminados el plan de voces y el lector asignado a cada postulado.
- Créditos: eliminada la ficha de voz; se conservan las atribuciones de los demás recursos elaborados con asistencia de IA.
- Se mantienen sin cambios: sonido de arranque, sonidos de interfaz, ambiente sonoro opcional, botón global de silencio y banda del video.

## Material de las pruebas descartadas

La carpeta temporal `tools/voces/` (generador, muestras y modelos de Piper) se eliminó del proyecto el 14 de octubre de 2026, tras comprobar que ningún componente la usaba. El paquete `piper-tts` del Python del usuario no se desinstaló.
