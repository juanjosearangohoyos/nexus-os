import type { AppId } from './types';

/**
 * Recorrido esencial (≈ 7 minutos): seis etapas que forman una historia.
 * Noticias y Archivos quedan como recursos de profundización, siempre accesibles.
 */
export interface TourStage {
  verb: string;
  title: string;
  apps: AppId[];
  question: string;
  doThis: string;
  learning: string;
  minutes: string;
}

export const TOUR_STAGES: TourStage[] = [
  {
    verb: 'Conectar',
    title: 'Inteligencia colectiva',
    apps: ['mensajes'],
    question: '¿Reunir a muchas personas basta para pensar juntas?',
    doThis: 'Compara tres formas de repartir la palabra en una conversación.',
    learning: 'Conectar personas no basta. Importa cómo escuchamos y coordinamos saberes.',
    minutes: '≈ 1 min',
  },
  {
    verb: 'Preguntar',
    title: 'Inteligencia artificial',
    apps: ['asistente'],
    question: '¿Una respuesta fluida es una respuesta verdadera?',
    doThis: 'Haz una consulta al asistente simulado y compara lo convincente con lo comprobado.',
    learning: 'Poder responder no significa tener razón.',
    minutes: '≈ 1 min',
  },
  {
    verb: 'Combinar',
    title: 'Inteligencia híbrida',
    apps: ['enlace'],
    question: '¿Sumar personas e IA garantiza un mejor resultado?',
    doThis: 'Reparte cinco tareas entre personas, IA y equipo, y observa quién responde por el resultado.',
    learning: 'La calidad de una colaboración depende de cómo se diseña y se evalúa.',
    minutes: '≈ 1,5 min',
  },
  {
    verb: 'Crear',
    title: 'Comunicar, crear y colaborar',
    apps: ['pizarra'],
    question: '¿Qué decisiones siguen siendo humanas cuando la IA participa?',
    doThis: 'Elige uno de los tres lienzos y experimenta con él. Los otros dos son opcionales.',
    learning: 'La intervención humana debe ser visible, no supuesta.',
    minutes: '≈ 1 min',
  },
  {
    verb: 'Configurar',
    title: 'Riesgos y compromisos éticos',
    apps: ['actividad', 'ajustes'],
    question: '¿Qué pasa cuando una protección falta?',
    doThis: 'Activa una medida frente a un riesgo y desactiva un compromiso para ver dónde falla el flujo.',
    learning: 'Las decisiones tecnológicas son también decisiones sociales.',
    minutes: '≈ 1,5 min',
  },
  {
    verb: 'Declarar',
    title: 'Nuestro manifiesto',
    apps: ['documentos'],
    question: '¿Qué defendemos después de todo lo explorado?',
    doThis: 'Recorre la síntesis de los ocho postulados y abre el texto completo cuando quieras.',
    learning: 'No basta con que el sistema funcione. Debemos poder defender la manera en que funciona.',
    minutes: '≈ 1,5 min',
  },
];

/** Recursos de profundización: no forman parte del recorrido esencial. */
export const DEEPER_APPS: AppId[] = ['noticias', 'archivos'];

export function stageOf(app: AppId): number {
  return TOUR_STAGES.findIndex((s) => s.apps.includes(app));
}
