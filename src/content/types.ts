export type AppId =
  | 'mensajes'
  | 'asistente'
  | 'enlace'
  | 'pizarra'
  | 'noticias'
  | 'actividad'
  | 'ajustes'
  | 'documentos'
  | 'archivos';

/** Ventanas especiales del sistema que no son aplicaciones del Dock. */
export type SystemWindowId = 'about';
export type WindowId = AppId | SystemWindowId;

export type SourceId =
  | 'cluetrain1999'
  | 'newclues2015'
  | 'levy2004'
  | 'mitAbout'
  | 'mitMci'
  | 'woolley2010'
  | 'vaccaro2024'
  | 'oecd2024'
  | 'unesco2021'
  | 'nist2023'
  | 'devalpardo2024'
  | 'dellermann2019'
  | 'brennan2026'
  | 'usco2025'
  | 'ec2026'
  | 'unesco2025'
  | 'ep2025'
  | 'sastre2024';

export type SourceType =
  | 'Artículo académico'
  | 'Libro'
  | 'Informe institucional'
  | 'Página institucional'
  | 'Noticia institucional'
  | 'Guía regulatoria'
  | 'Instrumento normativo internacional'
  | 'Manifiesto'
  | 'Guía didáctica';

/** Segmento de texto de una referencia: permite marcar cursivas APA sin HTML. */
export type RefPart = string | { i: string };

export interface Source {
  id: SourceId;
  /** Clave interna de trazabilidad del guion (F01–F16). Nunca se muestra como cita. */
  internal: string;
  /** Autoría para la cita parentética, p. ej. «Vaccaro et al.». */
  citeAuthor: string;
  /** Autoría para la cita narrativa si difiere (p. ej. «Searls y Weinberger»). */
  narrativeAuthor?: string;
  /** Forma completa para la primera mención, p. ej. «Organisation for Economic Co-operation and Development [OECD]». */
  firstMention?: string;
  year: string;
  /** Referencia completa APA 7 en segmentos (cursivas marcadas). */
  reference: RefPart[];
  /** Clave de orden alfabético para la lista de referencias. */
  sortKey: string;
  url: string;
  doi?: string;
  type: SourceType;
  institution: string;
  language: 'es' | 'en';
  /** Argumento o afirmación que respalda dentro de NEXUS OS. */
  supports: string;
  apps: AppId[];
  concepts: string[];
  status: 'verificada' | 'verificada con observaciones';
  /** Observación editorial visible en Archivos (y en docs/AUDITORIA_FUENTES.md). */
  note?: string;
}

export type EvidenceKind = 'evidencia' | 'postura' | 'simulacion' | 'principio';
