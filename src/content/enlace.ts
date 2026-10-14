import type { Rich } from './rich';

export const ENL_DEFINITION: Rich = [
  'La inteligencia híbrida aborda la cooperación organizada entre capacidades humanas y sistemas de IA. En los sistemas socio-técnicos, los actores, herramientas y normas influyen mutuamente; el resultado depende del diseño de la colaboración, no de una mezcla automática ',
  { cite: 'devalpardo2024' },
  '; ',
  { cite: 'dellermann2019' },
  '.',
];

export const ENL_DELLERMANN: Rich = [
  { cite: 'dellermann2019', narrative: true },
  ' describen la inteligencia híbrida como la capacidad de alcanzar objetivos complejos combinando inteligencia humana y artificial, de modo que se logren resultados que ninguna conseguiría por separado y ambas mejoren aprendiendo una de la otra.',
];

export const INTELLIGENCES = [
  {
    id: 'colectiva',
    name: 'Colectiva',
    color: '#2EE6C9',
    def: 'Surge de la coordinación de conocimientos entre personas y puede utilizar herramientas digitales.',
    example: 'Voluntarios y astrónomos que estudian juntos un candidato a exoplaneta.',
    source: 'levy2004',
  },
  {
    id: 'artificial',
    name: 'Artificial',
    color: '#9B5CFF',
    def: 'Capacidades de inferencia de sistemas basados en máquinas.',
    example: 'Un modelo que propone un resumen o una clasificación a partir de un texto.',
    source: 'oecd2024',
  },
  {
    id: 'hibrida',
    name: 'Híbrida',
    color: '#3B8BFF',
    def: 'Combinación organizada de aportes humanos y artificiales, con funciones y responsabilidades definidas.',
    example: 'Un equipo que usa IA para generar alternativas y decide, revisa y firma el resultado.',
    source: 'dellermann2019',
  },
] as const;

export const ENL_NUANCE =
  'Estas categorías se interrelacionan, pero no son sinónimos. La colectividad puede funcionar sin IA, la IA puede operar sin colaboración humana simultánea y una experiencia híbrida no necesariamente incluye a una comunidad extensa.';

export const PROBLEMS = [
  { id: 'campana', label: 'Crear una campaña', note: 'Una tarea de creación: el metaanálisis encontró resultados más favorables en tareas de creación de contenido que en tareas de decisión.' },
  { id: 'afirmacion', label: 'Analizar una afirmación', note: 'Una tarea de comprobación: lo decisivo es quién consulta las fuentes originales y responde por la conclusión.' },
  { id: 'publicar', label: 'Decidir qué publicar', note: 'Una tarea de decisión: en promedio, las combinaciones humano-IA mostraron pérdidas en este tipo de tareas.' },
] as const;

export type Zone = 'personas' | 'ia' | 'equipo';
export const ZONES: { id: Zone; label: string }[] = [
  { id: 'personas', label: 'Personas' },
  { id: 'ia', label: 'IA' },
  { id: 'equipo', label: 'Equipo' },
];

export const TASKS = [
  {
    id: 'investigacion',
    label: 'Investigación',
    why: {
      personas: 'Las personas definen qué preguntar y evalúan la calidad de las fuentes.',
      ia: 'La IA puede acelerar búsquedas y resúmenes, pero puede inventar referencias: hay que comprobar cada fuente.',
      equipo: 'Investigar en equipo diversifica las fuentes y permite contrastar hallazgos.',
    },
  },
  {
    id: 'ideacion',
    label: 'Ideación',
    why: {
      personas: 'Las ideas parten de la experiencia y del contexto de quienes conocen el problema.',
      ia: 'Generar alternativas es una tarea en la que la IA puede aportar variedad; alguien debe seleccionar con criterio.',
      equipo: 'Idear en grupo multiplica perspectivas si todos tienen turno para aportar.',
    },
  },
  {
    id: 'seleccion',
    label: 'Selección',
    why: {
      personas: 'Seleccionar exige criterio y responsabilidad sobre lo que se descarta.',
      ia: 'Una selección automática tiende a priorizar lo probable o lo popular; puede excluir propuestas valiosas.',
      equipo: 'Seleccionar en equipo obliga a explicitar criterios y a reconocer desacuerdos.',
    },
  },
  {
    id: 'verificacion',
    label: 'Verificación',
    why: {
      personas: 'Una persona consulta las fuentes originales y asume que verificó.',
      ia: 'La IA puede apoyar la detección de errores, pero una verificación solo automática no sustituye la consulta de fuentes.',
      equipo: 'Verificar entre varias personas reduce errores que una sola no detectaría.',
    },
  },
  {
    id: 'decision',
    label: 'Decisión final',
    why: {
      personas: 'La decisión queda en alguien identificable que responde por el resultado.',
      ia: 'Si la IA decide sola, nadie responde por el resultado. En tareas de decisión, la combinación humano-IA mostró pérdidas en promedio.',
      equipo: 'Una decisión colectiva necesita reglas claras: quién firma y cómo se resuelven los desacuerdos.',
    },
  },
] as const;

export type TaskId = (typeof TASKS)[number]['id'];

export const PROPOSAL = {
  personas: 'Objetivo, experiencia, contexto, público y juicio editorial.',
  ia: 'Borradores alternativos, clasificación de ideas y variaciones de texto, siempre sujetos a revisión.',
  equipo: 'Contraste de enfoques, selección, aprobación y créditos.',
  conclusion: 'La colaboración es valiosa cuando se explica qué aporta cada parte y cómo se evalúa el resultado.',
};

export const ENL_PRINCIPLE = 'No prometemos una mezcla perfecta. Nos comprometemos a diseñar colaboraciones responsables.';
