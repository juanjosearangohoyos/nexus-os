import type { AppId, SourceId } from './types';
import type { Rich } from './rich';

/**
 * Texto ÍNTEGRO del manifiesto (guion maestro v4, §APP 08). Solo se resolvió la clave interna
 * F05 en su cita APA visible (Vaccaro et al., 2024). Cualquier cambio de argumento requiere aprobación del equipo.
 */

export const MANIFESTO_TITLE = 'Manifiesto de NEXUS OS';
export const MANIFESTO_SUBTITLE = 'Diferentes formas de pensar. Una nueva forma de crear.';

export const DECLARATION: Rich = [
  { b: 'Nosotros, Valentina Giraldo, Juan Román, Sebastián Camacho y Juan José Arango, desarrolladores de NEXUS OS, declaramos:' },
];

export const OPENING: Rich[] = [
  [
    'No vivimos en un mundo donde las ideas pertenezcan a una única cabeza. Aprendemos a través de otras personas, nos comunicamos mediante redes y creamos con tecnologías que ya intervienen en imágenes, textos, sonidos y decisiones. La inteligencia colectiva conecta saberes; la artificial permite inferir y producir resultados a partir de información; la híbrida organiza colaboraciones entre capacidades humanas y sistemas de IA. Se cruzan, pero ninguna es idéntica a otra.',
  ],
  [
    'Este encuentro abre posibilidades reales: investigación colaborativa, herramientas de expresión, acceso al conocimiento y nuevas formas de trabajo. Pero también revela conflictos: sesgos, desinformación, opacidad, vigilancia, desigualdad de acceso y dudas sobre la autoría. La evidencia nos recuerda, además, que sumar humanos e IA no siempre produce un resultado superior ',
    { cite: 'vaccaro2024' },
    '.',
  ],
  [
    'Por eso nos manifestamos. No para prometer que cada innovación es progreso. No para prohibir toda tecnología nueva. Nos manifestamos porque ',
    { b: 'ninguna herramienta debe decidir por sí sola los valores con los que organizamos nuestra vida en común' },
    '.',
  ],
];

export interface Principle {
  n: string;
  title: string;
  body: string;
  /** Notas de fundamento: fuera del texto del manifiesto, como notas expandibles. */
  grounds: SourceId[];
  apps: AppId[];
}

export const PRINCIPLES: Principle[] = [
  {
    n: '01',
    title: 'Pensaremos antes de delegar.',
    body: 'Defendemos el uso de IA como apoyo a la comprensión y la creación. No aceptaremos que la comodidad sustituya el examen crítico. Cuando una decisión pueda afectar a otras personas, exigiremos revisión, contexto y responsables identificables.',
    grounds: ['unesco2021', 'vaccaro2024'],
    apps: ['asistente', 'ajustes'],
  },
  {
    n: '02',
    title: 'Una red necesita voces, no solo conexiones.',
    body: 'El conocimiento colectivo no consiste en reunir mensajes sin escucharlos. Abriremos espacio al desacuerdo razonado, a la experiencia diversa y a quienes suelen quedar fuera de las decisiones digitales. Participar debe significar poder influir.',
    grounds: ['levy2004', 'mitMci'],
    apps: ['mensajes'],
  },
  {
    n: '03',
    title: 'No confundiremos una respuesta con una prueba.',
    body: 'Una frase fluida puede ser incorrecta. Una imagen convincente puede representar algo que nunca ocurrió. Contrastaremos afirmaciones, identificaremos incertidumbres y enlazaremos fuentes originales cuando comuniquemos hechos.',
    grounds: ['nist2023', 'ep2025'],
    apps: ['asistente', 'pizarra'],
  },
  {
    n: '04',
    title: 'Crearemos sin ocultar nuestros procesos.',
    body: 'Valoramos las posibilidades creativas de la IA, pero también el trabajo de quienes imaginan, seleccionan, modifican y dan sentido a una obra. Reconoceremos el uso de sistemas generativos y documentaremos las contribuciones relevantes de nuestro proceso.',
    grounds: ['usco2025', 'ec2026', 'unesco2025'],
    apps: ['pizarra', 'noticias'],
  },
  {
    n: '05',
    title: 'La responsabilidad no se automatiza.',
    body: 'Ninguna explicación técnica debe servir para evadir las consecuencias de una decisión. Exigiremos mecanismos de revisión, corrección y rendición de cuentas. La supervisión debe ser proporcional al impacto de cada uso.',
    grounds: ['unesco2021', 'nist2023'],
    apps: ['enlace', 'ajustes'],
  },
  {
    n: '06',
    title: 'La privacidad es parte de la dignidad.',
    body: 'No convertiremos a las personas en recursos de datos disponibles sin consideración. Defenderemos el consentimiento cuando corresponda, la minimización de información personal y el respeto por los derechos de quienes participan.',
    grounds: ['unesco2021', 'ep2025'],
    apps: ['actividad', 'ajustes'],
  },
  {
    n: '07',
    title: 'La diferencia fortalece la inteligencia.',
    body: 'Una comunidad que solo reproduce opiniones conocidas corre el riesgo de confundir acuerdo con conocimiento. Promoveremos el encuentro entre saberes, culturas, disciplinas y experiencias. La colaboración requiere diversidad y también procedimientos para comprobar lo que construimos.',
    grounds: ['woolley2010', 'unesco2025', 'levy2004'],
    apps: ['mensajes', 'noticias'],
  },
  {
    n: '08',
    title: 'Ningún sistema está terminado mientras no pueda corregirse.',
    body: 'La ética no termina cuando publicamos un producto. Evaluaremos sesgos, errores, efectos sociales y costos ambientales. Escucharemos objeciones y cambiaremos lo necesario cuando encontremos daños o mejores argumentos.',
    grounds: ['nist2023', 'unesco2021'],
    apps: ['actividad', 'ajustes'],
  },
];

export const COMMITMENT: Rich = [
  { b: 'Nuestro compromiso empieza aquí.' },
  ' Como desarrolladores de NEXUS OS, identificaremos las fuentes de nuestras afirmaciones, declararemos el uso de IA en las piezas que generemos, pediremos autorización para usar materiales de otras personas, mantendremos visible la autoría colectiva y ofreceremos mecanismos para cuestionar nuestras ideas.',
];

export const CLOSING: Rich[] = [
  [
    'No esperamos un futuro perfecto ni una máquina que resuelva todos nuestros dilemas. Elegimos algo más difícil: un futuro que pueda discutirse, construirse y corregirse entre personas, con herramientas al servicio de esa responsabilidad.',
  ],
  [{ b: 'No basta con que el sistema funcione. Debemos poder defender la manera en que funciona.' }],
  [{ b: 'NEXUS OS · Diferentes formas de pensar. Una nueva forma de crear.' }],
];

export const PLACE_DATE = 'Cali, Colombia · Octubre de 2026';
export const SIGNATORIES = ['Valentina Giraldo', 'Juan Román', 'Sebastián Camacho', 'Juan José Arango'];

export const CALL_TO_ACTION = 'Lee nuestras fuentes. Pon a prueba nuestros argumentos. Cuestiona nuestros principios. Crea con responsabilidad.';
