import type { Rich } from './rich';

export const PIZ_INTRO = 'Tres actividades que cambiaron con la llegada de la IA. Tres preguntas que seguimos obligados a hacernos.';

export const COMUNICAR = {
  message: 'Ya no solo elegimos qué decir. Debemos explicar cómo se produjo y por qué merece confianza.',
  question: '¿Qué cambia en nuestra confianza cuando conocemos el origen de un mensaje?',
  sample: 'La biblioteca ampliará su horario a 24 horas durante la semana de exámenes, del 20 al 24 de octubre.',
  origins: [
    {
      id: 'humano',
      label: 'Texto humano revisado',
      badge: 'Redactado y revisado por personas',
      meta: [
        ['Autoría', 'Oficina de comunicaciones'],
        ['Revisión', 'Coordinación de la biblioteca'],
        ['Fuente', 'Resolución interna enlazada'],
        ['Uso de IA', 'No se usó'],
      ],
    },
    {
      id: 'etiquetado',
      label: 'Texto sintético etiquetado',
      badge: 'Redactado con ayuda de IA y revisado por la oficina',
      meta: [
        ['Autoría', 'Oficina de comunicaciones'],
        ['Revisión', 'Coordinación de la biblioteca'],
        ['Fuente', 'Resolución interna enlazada'],
        ['Uso de IA', 'Borrador generado con un asistente de redacción'],
      ],
    },
    {
      id: 'sinetiqueta',
      label: 'Texto sintético sin etiqueta',
      badge: '',
      meta: [
        ['Autoría', 'Desconocida'],
        ['Revisión', 'Desconocida'],
        ['Fuente', 'No indicada'],
        ['Uso de IA', 'No declarado'],
      ],
    },
  ],
  sameText:
    'El texto es idéntico en las tres versiones: no podemos detectar su origen solo por su aspecto. Lo que cambia es la información que lo acompaña.',
  reliable: {
    text: 'La Universidad informa que, del 20 al 24 de octubre, la biblioteca abrirá 24 horas durante la semana de exámenes. Consulta la resolución en el sitio oficial.',
    signals: ['Identifica quién informa', 'Fechas concretas', 'Remite a una fuente verificable', 'Tono descriptivo'],
  },
  sensational: {
    text: '🚨 ¡URGENTE! La biblioteca ya no cierra NUNCA. Compártelo antes de que lo borren.',
    signals: ['Sin fuente ni autor', 'Absolutos («nunca»)', 'Urgencia artificial', 'Presión para compartir'],
  },
  evidence: [
    'En la Unión Europea, determinadas interacciones y contenidos generados o manipulados con IA están sujetos a obligaciones de transparencia desde el 2 de agosto de 2026, según el supuesto regulado ',
    { cite: 'ec2026' },
    '.',
  ] as Rich,
  reflection:
    'No proponemos etiquetar por costumbre ni sospechar de todo. Proponemos que el origen y la revisión de un mensaje sean visibles cuando importan para confiar en él.',
  principle: '03',
};

export const LAYERS = [
  { id: 'idea', label: 'Idea original humana', who: 'Valentina y Sebastián', log: 'Bocetaron la idea: dos redes que se encuentran.' },
  { id: 'generada', label: 'Propuesta generada', who: 'Herramienta generativa (simulada)', log: 'Se generaron variaciones visuales a partir de la idea.' },
  { id: 'revision', label: 'Revisión del equipo', who: 'Juan Román y Juan José', log: 'Marcaron qué conservar, qué quitar y qué ajustar.' },
  { id: 'edicion', label: 'Edición final', who: 'Sebastián Camacho', log: 'Ajustó color, composición y título.' },
  { id: 'creditos', label: 'Créditos', who: 'Todo el equipo', log: 'Se documentaron autorías, herramientas y licencias.' },
] as const;

export type LayerId = (typeof LAYERS)[number]['id'];

export const CREAR = {
  message: 'La creatividad también está en formular preguntas, seleccionar, transformar, dar contexto y asumir decisiones.',
  question: '¿Quién decidió qué conservar, qué cambiar y qué publicar?',
  evidence: [
    'En el derecho de Estados Unidos, usar IA no impide por sí mismo proteger una obra; la protección depende de la contribución expresiva humana, y la sola formulación de prompts no basta ',
    { cite: 'usco2025' },
    '. Este criterio es estadounidense: no es una norma colombiana ni universal.',
  ] as Rich,
  reflection: 'Por eso documentamos el proceso, además del resultado: quién imaginó, qué se generó, quién seleccionó y quién respondió por la versión final.',
  principle: '04',
};

export const COLLAB_TASKS = [
  { id: 'guion', label: 'Redactar el guion' },
  { id: 'fuentes', label: 'Buscar y verificar fuentes' },
  { id: 'visuales', label: 'Generar variaciones visuales' },
  { id: 'aprobar', label: 'Aprobar la publicación' },
] as const;

export type CollabTask = (typeof COLLAB_TASKS)[number]['id'];
export type CollabOwner = 'persona' | 'sistema' | 'conjunta';

export const OWNERS: { id: CollabOwner; label: string; reviewer: string }[] = [
  { id: 'persona', label: 'Una persona', reviewer: 'Otra persona del equipo' },
  { id: 'sistema', label: 'Un sistema', reviewer: 'Una persona del equipo (obligatorio)' },
  { id: 'conjunta', label: 'Decisión conjunta', reviewer: 'El equipo, con criterios acordados' },
];

/** Consecuencia descriptiva de cada asignación (no es una puntuación). */
export const COLLAB_FEEDBACK: Record<CollabTask, Record<CollabOwner, string>> = {
  guion: {
    persona: 'El guion conserva una voz y un criterio reconocibles; conviene que otra persona lo revise.',
    sistema: 'Un borrador generado acelera el inicio, pero alguien debe ajustar el contexto, el público y el tono.',
    conjunta: 'Escribir en conjunto suma perspectivas; necesitan acordar quién tiene la última palabra.',
  },
  fuentes: {
    persona: 'Una persona consulta los documentos originales y puede responder por lo que verificó.',
    sistema: 'Un sistema puede sugerir fuentes, incluso inexistentes: cada referencia debe comprobarse.',
    conjunta: 'Verificar entre varias personas reduce errores que una sola no detectaría.',
  },
  visuales: {
    persona: 'Explorar a mano da control total, aunque produce menos alternativas para comparar.',
    sistema: 'Generar variaciones es un uso razonable de la IA; hay que declararlo y revisar licencias.',
    conjunta: 'El equipo compara variaciones y explicita por qué elige una.',
  },
  aprobar: {
    persona: 'Una persona identificable firma y responde por lo que se publica.',
    sistema: 'Si un sistema aprueba solo, nadie responde por la publicación.',
    conjunta: 'Una aprobación colectiva funciona si está claro quién firma y cómo se resuelven desacuerdos.',
  },
};

export const COLABORAR = {
  message: 'Un equipo no mejora solo por incorporar otra herramienta. Mejora cuando puede coordinar aportes y reconocer desacuerdos.',
  question: '¿Sabemos quién revisó la información antes de actuar?',
  evidence: [
    'El MIT relaciona la inteligencia colectiva de los grupos con la distribución equilibrada de la conversación ',
    { cite: 'mitMci' },
    ', y un metaanálisis encontró que combinar personas e IA no supera, en promedio, a la mejor alternativa por separado ',
    { cite: 'vaccaro2024' },
    '.',
  ] as Rich,
  reflection: 'Una colaboración responsable no depende de cuántas herramientas usemos, sino de que cada tarea tenga a alguien que la revise y responda por ella.',
  principle: '05',
};

export const PIZ_VIDEO = {
  src: 'media/video/nexus-os-introduccion',
  poster: 'media/video/nexus-os-introduccion-poster.jpg',
  captions: 'media/video/nexus-os-introduccion.es.vtt',
  title: 'NEXUS OS — Introducción (motion graphics)',
  description:
    'Pieza original de 32 segundos con tipografía cinética, monogramas y diagramas animados. Sin imágenes de los integrantes. Música instrumental original sintetizada. Subtítulos en español.',
};
