import type { AppId } from './types';

export interface AppMeta {
  id: AppId;
  name: string;
  /** Título de ventana aprobado en el guion. */
  windowTitle: string;
  /** Qué inteligencia o ámbito explora. */
  topic: string;
  summary: string;
  icon: string;
  accent: string;
  accent2: string;
  /** Desarrollador responsable dentro de la ficción editorial. */
  owner: 'VG' | 'JR' | 'SC' | 'JJ';
  /** Texto del botón que conduce al siguiente paso del recorrido. */
  nextLabel: string;
  completion: string;
  keywords: string[];
}

export const APPS: AppMeta[] = [
  {
    id: 'mensajes',
    name: 'Mensajes',
    windowTitle: 'Mensajes — Nadie conoce el sistema completo',
    topic: 'Inteligencia colectiva',
    summary: 'Una conversación de equipo para comprender cómo se forma un conocimiento que nadie poseía al principio.',
    icon: 'icons/mensajes.svg',
    accent: '#28C76F',
    accent2: '#6FF0A0',
    owner: 'VG',
    nextLabel: 'Comprender la IA',
    completion: 'Conectar personas no basta. Importa cómo escuchamos y coordinamos saberes.',
    keywords: ['colectiva', 'Lévy', 'MIT', 'turnos', 'escucha', 'red', 'conversación'],
  },
  {
    id: 'asistente',
    name: 'Asistente',
    windowTitle: 'Asistente — Poder responder no significa tener razón',
    topic: 'Inteligencia artificial',
    summary: 'Tres consultas preprogramadas para distinguir lo que la IA puede producir de lo que podemos comprobar.',
    icon: 'icons/asistente.svg',
    accent: '#9B5CFF',
    accent2: '#D7B8FF',
    owner: 'JR',
    nextLabel: 'Abrir Enlace',
    completion: 'Una respuesta posible no equivale a evidencia comprobada.',
    keywords: ['artificial', 'OCDE', 'NIST', 'verificación', 'sesgos', 'fluidez', 'chatbot'],
  },
  {
    id: 'enlace',
    name: 'Enlace',
    windowTitle: 'Enlace — La colaboración no sucede por accidente',
    topic: 'Inteligencia híbrida',
    summary: 'Diseña un equipo entre personas, IA y grupo, y descubre por qué la mezcla no garantiza un mejor resultado.',
    icon: 'icons/enlace.svg',
    accent: '#3B8BFF',
    accent2: '#9ECBFF',
    owner: 'SC',
    nextLabel: 'Experimentar en Pizarra',
    completion: 'La colaboración mejora cuando sabemos quién aporta, evalúa y responde.',
    keywords: ['híbrida', 'Vaccaro', 'metaanálisis', 'Dellermann', 'De Val Pardo', 'tareas', 'equipo'],
  },
  {
    id: 'pizarra',
    name: 'Pizarra',
    windowTitle: 'Pizarra — Comunicar, crear y colaborar',
    topic: 'Comunicación, creatividad y colaboración',
    summary: 'Tres lienzos para examinar el origen de los mensajes, la autoría creativa y el reparto de responsabilidades.',
    icon: 'icons/pizarra.svg',
    accent: '#FF8A2A',
    accent2: '#FFC15A',
    owner: 'SC',
    nextLabel: 'Abrir casos reales',
    completion: 'La intervención humana debe ser visible, no supuesta.',
    keywords: ['comunicación', 'creatividad', 'colaboración', 'transparencia', 'autoría', 'video', 'capas'],
  },
  {
    id: 'noticias',
    name: 'Noticias',
    windowTitle: 'Noticias — Expedientes verificables',
    topic: 'Casos actuales',
    summary: 'Expedientes 2024–2026 de NASA, U.S. Copyright Office, Comisión Europea, Nature Human Behaviour y UNESCO.',
    icon: 'icons/noticias.svg',
    accent: '#FF5A5F',
    accent2: '#FF8D7A',
    owner: 'JJ',
    nextLabel: 'Revisar impactos',
    completion: 'Hemos separado el hecho documentado de nuestra posición.',
    keywords: ['NASA', 'exoplaneta', 'copyright', 'Unión Europea', 'transparencia', 'UNESCO', 'cultura', 'casos'],
  },
  {
    id: 'actividad',
    name: 'Actividad',
    windowTitle: 'Actividad — Oportunidades, riesgos y su impacto',
    topic: 'Retos y oportunidades',
    summary: 'Siete tensiones entre oportunidad y riesgo, con efectos, evidencia y medidas de mitigación.',
    icon: 'icons/actividad.svg',
    accent: '#19C3E0',
    accent2: '#5CF2FF',
    owner: 'JJ',
    nextLabel: 'Revisar Ajustes',
    completion: 'Los efectos dependen del uso, del contexto y de su evaluación.',
    keywords: ['riesgos', 'oportunidades', 'desinformación', 'privacidad', 'sesgos', 'ambiental', 'mitigación'],
  },
  {
    id: 'ajustes',
    name: 'Ajustes',
    windowTitle: 'Ajustes — Principios éticos como reglas operativas',
    topic: 'Compromisos éticos',
    summary: 'Ocho compromisos que puedes activar o desactivar en una simulación didáctica para ver sus consecuencias.',
    icon: 'icons/ajustes.svg',
    accent: '#AEB6C3',
    accent2: '#E9EDF3',
    owner: 'JJ',
    nextLabel: 'Publicar declaración',
    completion: 'La ética no se instala una vez: hay que practicarla.',
    keywords: ['ética', 'revisión humana', 'transparencia', 'privacidad', 'diversidad', 'atribución', 'sesgos', 'sostenibilidad'],
  },
  {
    id: 'documentos',
    name: 'Documentos',
    windowTitle: 'Documentos — Manifiesto de NEXUS OS',
    topic: 'Manifiesto',
    summary: 'El texto íntegro del manifiesto: ocho postulados, compromisos, llamado a la acción y firmas.',
    icon: 'icons/documentos.svg',
    accent: '#4A6CFF',
    accent2: '#9DB0FF',
    owner: 'JJ',
    nextLabel: 'Ver fuentes',
    completion: 'El sistema está listo para ser discutido. No para ser obedecido sin preguntas.',
    keywords: ['manifiesto', 'postulados', 'principios', 'firmas', 'objeción', 'imprimir'],
  },
  {
    id: 'archivos',
    name: 'Archivos',
    windowTitle: 'Archivos — Evidencias, biblioteca y créditos',
    topic: 'Fuentes y créditos',
    summary: 'Biblioteca filtrable de referencias APA 7 y créditos de imágenes, audio y video.',
    icon: 'icons/archivos.svg',
    accent: '#FFB020',
    accent2: '#FFD66B',
    owner: 'JJ',
    nextLabel: 'Volver al escritorio',
    completion: 'Comprueba nuestras afirmaciones en sus documentos originales.',
    keywords: ['fuentes', 'referencias', 'APA', 'bibliografía', 'créditos', 'licencias', 'evidencias'],
  },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppMeta>;
