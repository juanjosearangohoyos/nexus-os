import type { Rich } from './rich';
import type { SourceId } from './types';

export interface NewsItem {
  id: string;
  kicker: string;
  title: string;
  dateISO: string;
  dateLabel: string;
  institution: string;
  scope: string;
  intelligence: 'Colectiva' | 'Artificial' | 'Híbrida' | 'Antecedente';
  sources: SourceId[];
  url: string;
  urlLabel: string;
  visual:
    | { kind: 'photo'; src: string; alt: string; credit: string; license: string }
    | { kind: 'illustration'; name: 'process' | 'labels' | 'meta' | 'culture' | 'archive'; alt: string };
  happened: Rich;
  conclude: Rich;
  notShow: Rich;
  stance: string;
  question: string;
  related: { app: 'mensajes' | 'pizarra' | 'enlace' | 'ajustes' | 'actividad' | 'documentos'; label: string; intent?: string };
}

export const NEWS: NewsItem[] = [
  {
    id: 'nasa',
    kicker: 'Ciencia ciudadana · NASA',
    title: 'Un planeta posible descubierto con ciencia ciudadana',
    dateISO: '2026-01-27',
    dateLabel: 'Publicado el 27 de enero de 2026',
    institution: 'NASA Science',
    scope: 'Astronomía. HD 137010 b es un candidato, no un planeta confirmado.',
    intelligence: 'Colectiva',
    sources: ['brennan2026'],
    url: 'https://science.nasa.gov/universe/exoplanets/discovery-alert-an-ice-cold-earth/',
    urlLabel: 'Documento original en NASA Science',
    visual: {
      kind: 'photo',
      src: 'media/img/nasa-hd137010b-concepto.jpg',
      alt: 'Concepto artístico de HD 137010 b: un planeta rocoso de tonos crema y blancos, con zonas que sugieren hielo, sobre un fondo de estrellas.',
      credit: 'NASA/JPL-Caltech/Keith Miller (Caltech/IPAC)',
      license: 'Concepto artístico, no fotografía. Uso educativo conforme a las pautas de medios de NASA; no implica aval de NASA.',
    },
    happened: [
      'En enero de 2026, la NASA informó sobre HD 137010 b, un ',
      { b: 'candidato' },
      ' a exoplaneta identificado a partir de un único tránsito registrado en datos de la misión K2. El equipo internacional que lo analizó incluyó a cuatro voluntarios del proyecto de ciencia ciudadana Planet Hunters como coautores. El hallazgo requiere más observaciones para confirmarse ',
      { cite: 'brennan2026', claim: 'HD 137010 b es un candidato pendiente de confirmación; cuatro voluntarios de Planet Hunters son coautores.' },
      '.',
    ],
    conclude: [
      'La participación de voluntarios muestra que una comunidad organizada puede contribuir a la producción científica. La validación y la colaboración con especialistas son parte de esa inteligencia colectiva.',
    ],
    notShow: [
      'No demuestra que HD 137010 b sea un planeta: sigue siendo un ',
      { b: 'candidato' },
      '. Tampoco es un ejemplo de inteligencia híbrida: la nota de NASA no menciona el uso de IA en este hallazgo, así que no lo presentamos como tal.',
    ],
    stance: 'La ciencia no depende únicamente de expertos aislados; pueden colaborar públicos diversos cuando existen procedimientos de observación y validación.',
    question: '¿A quién reconocemos como autor de un descubrimiento colectivo?',
    related: { app: 'mensajes', label: 'Ir a Mensajes' },
  },
  {
    id: 'usco',
    kicker: 'Autoría creativa · U.S. Copyright Office',
    title: '¿Quién es autor cuando creamos con IA?',
    dateISO: '2025-01-29',
    dateLabel: 'Publicado el 29 de enero de 2025',
    institution: 'U.S. Copyright Office',
    scope: 'Derecho de autor de Estados Unidos. No es legislación colombiana ni una norma universal.',
    intelligence: 'Híbrida',
    sources: ['usco2025'],
    url: 'https://www.copyright.gov/newsnet/2025/1060.html',
    urlLabel: 'Documento original en copyright.gov',
    visual: {
      kind: 'illustration',
      name: 'process',
      alt: 'Ilustración original: carpeta de producción con las etapas de una obra —idea, borradores, selección, edición y créditos— y la intervención humana resaltada.',
    },
    happened: [
      'La Oficina de Derechos de Autor de Estados Unidos publicó la segunda parte de su informe sobre inteligencia artificial. Concluyó que usar IA para asistir la creación no impide por sí mismo la protección de una obra. Los resultados generados pueden protegerse cuando una persona determinó suficientes elementos expresivos —por ejemplo, con arreglos o modificaciones creativas—, pero no por la sola formulación de prompts ',
      { cite: 'usco2025' },
      '.',
    ],
    conclude: ['En ese marco jurídico, la autoría se apoya en decisiones expresivas humanas que puedan identificarse y explicarse.'],
    notShow: [
      'No es ley colombiana ni una regla aplicable a todos los países: es la posición de una oficina estadounidense sobre su propio sistema de copyright. Tampoco resuelve, por sí sola, los debates éticos sobre el reconocimiento de quienes crean.',
    ],
    stance: 'No se trata solo de quién pulsó el botón, sino de qué decisiones expresivas tomó y cómo puede explicarlas.',
    question: '¿Deberíamos documentar el proceso, además del resultado?',
    related: { app: 'pizarra', label: 'Probar el lienzo «Crear»', intent: 'crear' },
  },
  {
    id: 'ue',
    kicker: 'Transparencia · Comisión Europea',
    title: 'La transparencia ya tiene implicaciones legales',
    dateISO: '2026-07-20',
    dateLabel: 'Publicado el 20 de julio de 2026',
    institution: 'Comisión Europea',
    scope: 'Unión Europea. Las obligaciones varían según el supuesto regulado.',
    intelligence: 'Artificial',
    sources: ['ec2026'],
    url: 'https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems',
    urlLabel: 'Documento original en digital-strategy.ec.europa.eu',
    visual: {
      kind: 'illustration',
      name: 'labels',
      alt: 'Ilustración original: dos tarjetas de contenido, una con etiqueta visible de intervención de IA y otra sin información de origen.',
    },
    happened: [
      'La Comisión Europea publicó directrices sobre las obligaciones de transparencia del artículo 50 del Reglamento de IA. Determinadas interacciones con sistemas de IA y ciertos contenidos generados o manipulados están sujetos a obligaciones de información o identificación, que se aplican desde el 2 de agosto de 2026 ',
      { cite: 'ec2026' },
      '.',
    ],
    conclude: ['En ciertos supuestos, conocer que un contenido fue generado o manipulado con IA se reconoce como condición de una comunicación pública confiable.'],
    notShow: [
      'No significa que todo contenido con IA deba llevar la misma etiqueta en cualquier caso, ni que estas obligaciones rijan fuera de la Unión Europea. Las directrices orientan la aplicación; las obligaciones concretas dependen del supuesto.',
    ],
    stance: 'Si una tecnología participa en la comunicación, su intervención no debería quedar invisibilizada cuando importa al derecho a saber.',
    question: '¿Es ético ocultar la intervención de IA solo porque el contenido resulta convincente?',
    related: { app: 'pizarra', label: 'Probar el lienzo «Comunicar»', intent: 'comunicar' },
  },
  {
    id: 'nature',
    kicker: 'Colaboración humano-IA · Nature Human Behaviour',
    title: 'La combinación humano-IA no siempre gana',
    dateISO: '2024-10-28',
    dateLabel: 'Publicado en línea el 28 de octubre de 2024',
    institution: 'Nature Human Behaviour',
    scope: 'Revisión sistemática y metaanálisis de estudios experimentales.',
    intelligence: 'Híbrida',
    sources: ['vaccaro2024'],
    url: 'https://doi.org/10.1038/s41562-024-02024-1',
    urlLabel: 'Artículo original (acceso abierto)',
    visual: {
      kind: 'illustration',
      name: 'meta',
      alt: 'Ilustración original de los hallazgos: la combinación humano-IA aparece por encima de las personas solas, pero por debajo de la mejor alternativa por separado; las tareas de creación muestran resultados más favorables que las de decisión.',
    },
    happened: [
      { cite: 'vaccaro2024', narrative: true },
      ' revisaron 106 experimentos con 370 tamaños de efecto. En promedio, las combinaciones humano-IA superaron a las personas que trabajaban solas, pero no a la mejor alternativa por separado. Encontraron pérdidas en tareas de decisión y ganancias significativamente mayores en tareas de creación de contenido. Cuando las personas superaban a la IA por sí solas, la combinación tendía a mejorar; cuando la IA las superaba, tendía a perder.',
    ],
    conclude: ['La calidad de una colaboración depende de la tarea y del diseño; no se puede presumir.'],
    notShow: [
      'No demuestra que la IA empeore el trabajo humano ni que convenga evitarla. Tampoco que colaborar siempre fracase: los efectos son heterogéneos. No convertimos tamaños de efecto en porcentajes de éxito.',
    ],
    stance: 'La calidad de la colaboración se diseña, se mide y se revisa: añadir IA no es sinónimo de mejora.',
    question: '¿Cuándo es mejor trabajar con IA y cuándo conviene no hacerlo?',
    related: { app: 'enlace', label: 'Diseñar un equipo en Enlace' },
  },
  {
    id: 'unesco',
    kicker: 'Cultura · UNESCO',
    title: 'IA y diversidad cultural',
    dateISO: '2025-11-25',
    dateLabel: 'Publicado el 25 de noviembre de 2025',
    institution: 'UNESCO',
    scope: 'Informe de un grupo independiente de expertos presentado en MONDIACULT 2025 (30 de septiembre de 2025).',
    intelligence: 'Colectiva',
    sources: ['unesco2025'],
    url: 'https://www.unesco.org/en/articles/new-expert-report-explores-how-ai-transforming-culture',
    urlLabel: 'Documento original en unesco.org',
    visual: {
      kind: 'illustration',
      name: 'culture',
      alt: 'Ilustración original: muchos patrones culturales distintos que, al pasar por un filtro algorítmico, tienden a parecerse entre sí.',
    },
    happened: [
      'La UNESCO difundió el informe de su Grupo Independiente de Expertos sobre IA y Cultura (CULTAI). El informe examina cómo la IA transforma la creación contemporánea, el patrimonio y la diversidad lingüística, y advierte riesgos como la erosión de la creatividad, la homogeneización algorítmica, la concentración en plataformas y el uso injusto del trabajo de creadores ',
      { cite: 'unesco2025' },
      '.',
    ],
    conclude: ['El debate cultural sobre IA no se reduce a eficiencia: involucra derechos culturales, diversidad y reconocimiento de quienes crean.'],
    notShow: ['No afirma que la IA destruya la cultura ni que sus efectos sean inevitables. Presenta oportunidades y riesgos para orientar políticas públicas.'],
    stance: 'Una cultura en red necesita diversidad de voces y reconocimiento de quienes crean; la automatización no debería volver homogéneo lo que expresamos.',
    question: '¿Qué voces se pierden cuando los sistemas recomiendan y producen lo más probable?',
    related: { app: 'actividad', label: 'Revisar riesgos en Actividad', intent: 'creacion' },
  },
  {
    id: 'cluetrain',
    kicker: 'Archivo · Antecedentes del manifiesto',
    title: 'De Cluetrain a New Clues: la red como conversación',
    dateISO: '2015-01-08',
    dateLabel: 'Textos de 1999 y 2015',
    institution: 'Publicaciones de los autores',
    scope: 'Antecedentes históricos del género; no analizan la IA generativa actual.',
    intelligence: 'Antecedente',
    sources: ['cluetrain1999', 'newclues2015'],
    url: 'https://www.cluetrain.com/newclues/',
    urlLabel: 'Leer New Clues en el sitio original',
    visual: {
      kind: 'illustration',
      name: 'archive',
      alt: 'Ilustración original: una línea de tiempo que va de 1999 a 2015 y 2026, con burbujas de conversación que se convierten en nodos de red.',
    },
    happened: [
      { i: 'The Cluetrain Manifesto' },
      ' ',
      { cite: 'cluetrain1999' },
      ' reunió 95 tesis sobre la conversación humana en red; la primera sostiene que los mercados son conversaciones. En 2015, ',
      { cite: 'newclues2015', narrative: true },
      ' publicaron ',
      { i: 'New Clues' },
      ', que parte de la idea de que Internet somos nosotros, conectados, y defiende una red abierta frente a su control por intermediarios.',
    ],
    conclude: [
      'Los manifiestos digitales anteriores defendieron la voz humana y la apertura de la red. En 2026 la pregunta se amplía: ¿qué sucede cuando sistemas automáticos también intervienen en lo que decimos, leemos y creamos?',
    ],
    notShow: ['Estos textos no estudian la IA generativa; los usamos como antecedentes del género y de sus valores, no como evidencia sobre la IA.'],
    stance: 'Heredamos de estos manifiestos la defensa de la conversación humana. Le añadimos una exigencia: saber quién —o qué— participa en ella.',
    question: '¿Qué conversaciones siguen siendo humanas cuando un sistema participa en ellas?',
    related: { app: 'documentos', label: 'Leer nuestro manifiesto' },
  },
];
