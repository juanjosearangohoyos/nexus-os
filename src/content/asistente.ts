import type { Rich } from './rich';

export const AST_DEFINITION: Rich = [
  'Según la definición de la OCDE —',
  { cite: 'oecd2024', first: true },
  '—, un sistema de inteligencia artificial es un sistema basado en máquinas que, con diferentes grados de autonomía, infiere cómo producir resultados —como predicciones, contenidos, recomendaciones o decisiones— a partir de las entradas que recibe.',
];

export const AST_NARRATIVE: Rich = [
  'Los modelos pueden ayudar a generar, organizar y analizar información. Pero una respuesta convincente no es una prueba. Los sistemas pueden equivocarse, reproducir sesgos y producir contenidos inadecuados para el contexto. Usarlos exige identificar su función y evaluar su resultado ',
  { cite: 'unesco2021' },
  '; ',
  { cite: 'nist2023', first: true },
  '.',
];

export const AST_DISCLAIMER = 'Esta demostración utiliza respuestas predefinidas; no consulta un modelo en tiempo real.';

export type Category = 'Comunicación' | 'Creación' | 'Colaboración';
export const CATEGORIES: Category[] = ['Comunicación', 'Creación', 'Colaboración'];

export const IDEAS: { text: string; suggested: Category }[] = [
  { text: 'Etiquetar contenido generado con IA', suggested: 'Comunicación' },
  { text: 'Enlazar fuentes originales', suggested: 'Comunicación' },
  { text: 'Usar lenguaje claro', suggested: 'Comunicación' },
  { text: 'Registrar versiones de la obra', suggested: 'Creación' },
  { text: 'Dar créditos a imágenes y música', suggested: 'Creación' },
  { text: 'Explorar variaciones visuales', suggested: 'Creación' },
  { text: 'Organizar turnos de palabra', suggested: 'Colaboración' },
  { text: 'Definir quién revisa antes de publicar', suggested: 'Colaboración' },
];

export const QUERIES = [
  {
    id: 'organizar',
    prompt: 'Organiza estas ideas',
    explanation: 'La clasificación propuesta facilita explorar alternativas, pero una persona debe decidir si resulta adecuada.',
  },
  {
    id: 'verdad',
    prompt: '¿Esta afirmación es verdadera?',
    claim: 'Un estudio demostró que los equipos que usan IA siempre toman mejores decisiones.',
    answer: 'No puedo confirmarla con la información disponible en esta demostración. Consulta una fuente original.',
    explanation: 'La fluidez del lenguaje no sustituye a la evidencia.',
  },
  {
    id: 'titular',
    prompt: 'Crea un titular impactante',
    sensational: '¡La IA vuelve inútiles a los equipos humanos, según la ciencia!',
    responsible: 'Un metaanálisis de 106 experimentos encuentra que combinar personas e IA no siempre mejora los resultados',
    explanation: 'Una herramienta puede ayudar a redactar; la responsabilidad editorial sigue en manos humanas.',
  },
] as const;

export const CAPABILITIES = [
  { t: 'Analizar patrones', d: 'Encontrar regularidades en grandes volúmenes de datos que una persona tardaría mucho en revisar.' },
  { t: 'Apoyar la producción de contenido', d: 'Proponer borradores, variaciones de texto o imágenes y resúmenes para revisar.' },
  { t: 'Recomendar', d: 'Sugerir opciones a partir de las entradas y los objetivos con que fue diseñado el sistema.' },
  { t: 'Automatizar tareas delimitadas', d: 'Ejecutar pasos repetitivos y bien definidos, con supervisión proporcional al riesgo.' },
];

export const LIMITS = [
  { t: 'Errores', d: 'Puede producir afirmaciones falsas con apariencia segura.' },
  { t: 'Contexto insuficiente', d: 'No siempre conoce la situación, el público ni las consecuencias de un uso.' },
  { t: 'Sesgos de datos', d: 'Puede reproducir desigualdades presentes en los datos o en los objetivos.' },
  { t: 'Opacidad', d: 'No siempre es posible explicar por qué produjo un resultado.' },
  { t: 'Sobreconfianza', d: 'Las personas tienden a aceptar una respuesta fluida sin comprobarla.' },
];

/** Características de una IA confiable según el marco del NIST (traducción propia). */
export const NIST_TRAITS = [
  'Válida y fiable',
  'Segura',
  'Protegida y resiliente',
  'Responsable y transparente',
  'Explicable e interpretable',
  'Con privacidad reforzada',
  'Justa, con sesgos perjudiciales gestionados',
];

export const CHECKLIST = [
  '¿Quién hace la afirmación y con qué autoridad?',
  '¿Hay un documento original que pueda consultar?',
  '¿La respuesta distingue hechos, interpretaciones y opiniones?',
  '¿Qué información falta o es incierta?',
  '¿Qué consecuencias tendría publicarla si fuera falsa?',
];

export const AST_PRINCIPLE = 'No confundiremos fluidez con verdad.';
