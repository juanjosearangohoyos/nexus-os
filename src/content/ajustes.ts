import type { SourceId } from './types';

export interface EthicSetting {
  id: string;
  label: string;
  on: string;
  off: string;
  /** Texto adicional al desactivar (guion §12.5). */
  offDetail: string;
  grounds: SourceId[];
  principle: string;
  /** Etapa del flujo de publicación simulado en la que se nota el efecto. */
  stage: 'datos' | 'creacion' | 'revision' | 'publicacion';
}

/** Ocho compromisos del guion maestro. Los interruptores solo modifican una simulación didáctica. */
export const SETTINGS: EthicSetting[] = [
  {
    id: 'revision',
    label: 'Revisión humana de decisiones relevantes',
    on: 'Revisión, posibilidad de cuestionar y corregir.',
    off: 'Puede disminuir la capacidad de detectar errores y asignar responsabilidades.',
    offDetail: 'Una decisión podría publicarse sin revisión suficiente. ¿Quién detectaría un error y quién tendría autoridad para corregirlo?',
    grounds: ['unesco2021'],
    principle: '05',
    stage: 'revision',
  },
  {
    id: 'transparencia',
    label: 'Transparencia de contenido sintético',
    on: 'Se identifica la intervención de IA cuando corresponde.',
    off: 'Aumenta la dificultad de reconocer el origen de determinados mensajes.',
    offDetail:
      'Al ocultar la intervención de IA, dificultamos comprender el origen de un contenido. No toda intervención exige idéntica etiqueta: revisa el contexto y la normativa aplicable.',
    grounds: ['ec2026', 'unesco2021'],
    principle: '04',
    stage: 'publicacion',
  },
  {
    id: 'verificacion',
    label: 'Verificación de hechos',
    on: 'Antes de publicar, exigimos fuentes contrastables.',
    off: 'El contenido persuasivo puede circular sin comprobación.',
    offDetail: 'La apariencia de seguridad en una respuesta no sustituye a una fuente comprobable.',
    grounds: ['nist2023'],
    principle: '03',
    stage: 'revision',
  },
  {
    id: 'privacidad',
    label: 'Privacidad desde el diseño',
    on: 'Recopilamos solo lo necesario y explicamos por qué.',
    off: 'Se normaliza una exposición innecesaria de datos.',
    offDetail: 'Se vuelve más fácil recoger datos sin explicar por qué son necesarios.',
    grounds: ['unesco2021'],
    principle: '06',
    stage: 'datos',
  },
  {
    id: 'diversidad',
    label: 'Participación y diversidad',
    on: 'Habilitamos voces y mecanismos de corrección.',
    off: 'Corremos el riesgo de reproducir perspectivas dominantes.',
    offDetail: 'Una red puede volverse homogénea sin que nadie la haya desconectado.',
    grounds: ['mitMci', 'unesco2021'],
    principle: '07',
    stage: 'creacion',
  },
  {
    id: 'atribucion',
    label: 'Atribución de la creación',
    on: 'Registramos aportes humanos, uso de herramientas y licencias.',
    off: 'Se dificulta comprender el proceso creativo y sus responsabilidades.',
    offDetail: 'El producto final es visible, pero desaparece el registro de quién decidió, editó y creó.',
    grounds: ['usco2025'],
    principle: '04',
    stage: 'creacion',
  },
  {
    id: 'sesgos',
    label: 'Evaluación de sesgos y daños',
    on: 'Probamos antes de confiar y corregimos fallos.',
    off: 'Pueden persistir errores perjudiciales.',
    offDetail: 'Un error puede afectar de modo desigual a personas y comunidades.',
    grounds: ['nist2023'],
    principle: '08',
    stage: 'revision',
  },
  {
    id: 'sostenibilidad',
    label: 'Uso proporcionado y sostenible',
    on: 'Elegimos herramientas según su necesidad e impacto.',
    off: 'Podemos automatizar por costumbre, no por utilidad.',
    offDetail: 'Podemos usar recursos para tareas sin preguntarnos si esa escala o automatización era necesaria.',
    grounds: ['unesco2021'],
    principle: '08',
    stage: 'datos',
  },
];
