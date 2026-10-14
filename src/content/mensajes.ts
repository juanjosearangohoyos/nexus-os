import type { Rich } from './rich';

export const MSG_HEADLINE =
  'La inteligencia colectiva no surge cuando todos repetimos lo mismo, sino cuando podemos aportar, corregirnos y organizarnos.';

export const MSG_CHAT: { from: 'VG' | 'JR' | 'SC' | 'JJ'; text: string }[] = [
  { from: 'VG', text: 'Tenemos cuatro personas y cuatro ideas. ¿Eso ya es inteligencia colectiva?' },
  { from: 'SC', text: 'No necesariamente. Falta escuchar qué aporta cada una y encontrar relaciones entre sus ideas.' },
  { from: 'JR', text: 'Podemos reunir información, pero también necesitamos comprobarla.' },
  { from: 'JJ', text: 'Entonces nuestra primera regla es clara: conectar no basta. Debemos aprender a colaborar.' },
];

export const MSG_CONCEPT: Rich = [
  'La inteligencia colectiva es una capacidad que emerge de la participación y coordinación de múltiples personas. Para Pierre Lévy, los saberes están distribuidos y pueden valorarse, coordinarse y movilizarse colectivamente ',
  { cite: 'levy2004' },
  '. El MIT estudia cómo los grupos —y las combinaciones de personas y computadoras— llegan a actuar de maneras que parecen inteligentes ',
  { cite: 'mitAbout' },
  '.',
];

export const MSG_LEVY_QUOTE = {
  text: 'una inteligencia repartida en todas partes, valorizada constantemente, coordinada en tiempo real, que conduce a una movilización efectiva de las competencias',
  locator: 'sección «¿Qué es la inteligencia colectiva?»',
};

export const MSG_NUANCE: Rich = [
  'Más usuarios o más mensajes no equivalen automáticamente a mejor conocimiento: importa quién participa y cómo se coordinan las aportaciones. El MIT relaciona el desempeño colectivo de los equipos con la sensibilidad social de sus integrantes y con un reparto más equilibrado de las intervenciones ',
  { cite: 'mitMci' },
  ', a partir del estudio de ',
  { cite: 'woolley2010', narrative: true },
  '.',
];

export const MSG_MODES = [
  {
    id: 'uno',
    label: 'Una persona habla siempre',
    result: 'La conversación pierde diversidad de aportes.',
    detail: 'Las demás personas escuchan, pero no influyen. Lo que no se dice tampoco se puede corregir.',
  },
  {
    id: 'todos',
    label: 'Todos hablan a la vez',
    result: 'Hay participación, pero falta coordinación.',
    detail: 'Muchos mensajes no equivalen a más conocimiento: las ideas se superponen y nadie las relaciona.',
  },
  {
    id: 'turnos',
    label: 'Turnos distribuidos con escucha',
    result:
      'La coordinación y la escucha pueden favorecer el pensamiento colectivo. No garantizan, por sí solas, que todas las decisiones sean acertadas.',
    detail: 'Cada aporte llega a un espacio común donde puede relacionarse con los demás y ser revisado.',
  },
] as const;

export const MSG_PIECES = [
  { id: 'experiencia', label: 'Experiencia', slot: 'Lo que hemos vivido', adds: 'Aporta contexto: sabemos cómo se vive el problema.' },
  { id: 'investigacion', label: 'Investigación', slot: 'Lo que consultamos', adds: 'Aporta datos y fuentes que no dependen de una sola opinión.' },
  { id: 'creatividad', label: 'Creatividad', slot: 'Lo que imaginamos', adds: 'Aporta alternativas que todavía no existen.' },
  { id: 'verificacion', label: 'Verificación', slot: 'Cómo lo comprobamos', adds: 'Aporta acuerdos sobre cómo validar lo que construimos.' },
] as const;

export const MSG_PIECES_DONE = 'El conocimiento compartido necesita diferencias y también acuerdos sobre cómo validarlas.';
export const MSG_PRINCIPLE = 'No confundiremos una multitud conectada con una comunidad que piensa.';
