import type { AppId } from './types';

export interface Member {
  initials: 'VG' | 'JR' | 'SC' | 'JJ';
  name: string;
  /** Cargo narrativo: ficción editorial del proyecto, no credencial profesional. */
  role: string;
  area: string;
  apps: AppId[];
  statement: string;
  responsibilities: string[];
  /** Colores de la insignia geométrica. */
  colors: [string, string];
  /** Forma base de la insignia (abstracta, no figurativa). */
  badge: 'nodes' | 'orbit' | 'link' | 'seal';
  /** Mensaje de bienvenida a la aplicación que diseñó (texto). */
  welcomeTitle: string;
  welcomeText: string;
}

export const TEAM: Member[] = [
  {
    initials: 'VG',
    name: 'Valentina Giraldo',
    role: 'Arquitecta de Experiencias Colectivas',
    area: 'Redes colectivas',
    apps: ['mensajes'],
    statement: 'Una red no se vuelve inteligente solo por conectar personas; tiene que permitirles participar.',
    responsibilities: [
      'Diseñó la experiencia de Mensajes y la interacción «¿Quién está siendo escuchado?».',
      'Seleccionó las fuentes sobre inteligencia colectiva (Lévy y MIT).',
      'Responsable editorial de los postulados 1 y 2 del manifiesto.',
    ],
    colors: ['#2EE6C9', '#28C76F'],
    badge: 'nodes',
    welcomeTitle: 'Bienvenida a Mensajes',
    welcomeText:
      'Conectar cuatro personas no nos convierte automáticamente en un equipo inteligente. Necesitamos escuchar, contrastar experiencias y aprender a construir algo que ninguno tenía al empezar. Por eso diseñamos Mensajes.',
  },
  {
    initials: 'JR',
    name: 'Juan Román',
    role: 'Ingeniero de Sistemas Artificiales',
    area: 'Sistemas artificiales',
    apps: ['asistente'],
    statement: 'La potencia de un modelo no es una garantía de verdad ni de justicia.',
    responsibilities: [
      'Escribió las tres respuestas preprogramadas del Asistente.',
      'Contrastó la definición de la OCDE y el marco de riesgos del NIST.',
      'Responsable editorial de los postulados 3 y 4 del manifiesto.',
    ],
    colors: ['#9B5CFF', '#5CC8FF'],
    badge: 'orbit',
    welcomeTitle: 'Bienvenida a Asistente',
    welcomeText:
      'La IA puede generar ideas, analizar información y acelerar tareas. Pero también puede equivocarse con enorme seguridad. Nuestra propuesta es utilizarla como herramienta sin confundir sus respuestas con conocimiento verificado.',
  },
  {
    initials: 'SC',
    name: 'Sebastián Camacho',
    role: 'Diseñador de Interacción Híbrida',
    area: 'Interacción híbrida',
    apps: ['enlace', 'pizarra'],
    statement: 'Colaborar con IA es decidir qué aporta cada parte y quién responde por el resultado.',
    responsibilities: [
      'Diseñó Enlace y los tres lienzos de Pizarra.',
      'Analizó el metaanálisis de Vaccaro et al. (2024) y los textos de inteligencia híbrida.',
      'Responsable editorial de los postulados 5 y 6 del manifiesto.',
    ],
    colors: ['#3B8BFF', '#FF8A2A'],
    badge: 'link',
    welcomeTitle: 'Bienvenida a Enlace',
    welcomeText:
      'La colaboración híbrida no aparece simplemente porque abramos un chatbot. Debemos decidir qué tarea corresponde a las personas, cuál puede apoyar la IA y dónde hacen falta discusión, revisión y responsabilidad conjunta.',
  },
  {
    initials: 'JJ',
    name: 'Juan José Arango',
    role: 'Director de Narrativa y Ética Digital',
    area: 'Narrativa y ética',
    apps: ['noticias', 'actividad', 'ajustes', 'documentos'],
    statement: 'El sistema no está terminado mientras sus principios no puedan defenderse públicamente.',
    responsibilities: [
      'Coordinó la narrativa general, Noticias, Actividad, Ajustes y Documentos.',
      'Revisó la distinción entre hechos, posturas, simulaciones y principios.',
      'Responsable editorial de la apertura y de los postulados 7 y 8 del manifiesto.',
    ],
    colors: ['#4A6CFF', '#FFB020'],
    badge: 'seal',
    welcomeTitle: 'Bienvenida a Ajustes',
    welcomeText:
      'Nos dimos cuenta de que un sistema que funciona técnicamente también puede fallar socialmente. Por eso decidimos publicar sus criterios de transparencia, inclusión, responsabilidad y revisión. Esta es nuestra posición como desarrolladores.',
  },
];

export const MEMBER = Object.fromEntries(TEAM.map((m) => [m.initials, m])) as Record<Member['initials'], Member>;

export const CHORAL_LINE = 'Creamos herramientas. Elegimos principios. Respondemos por nuestras decisiones.';
