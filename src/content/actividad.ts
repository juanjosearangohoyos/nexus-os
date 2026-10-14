import type { Rich } from './rich';

export interface Tension {
  id: string;
  process: string;
  opportunity: string;
  risk: string;
  domain: 'Comunicación' | 'Creatividad' | 'Colaboración' | 'Transversal';
  opportunityDetail: Rich;
  riskDetail: Rich;
  favorable: string[];
  adverse: string[];
  measure: string;
  measureSteps: string[];
  withMeasure: string;
  withoutMeasure: string;
  principle: string;
}

/** Siete tensiones del guion maestro. Escenarios cualitativos: no son métricas reales ni datos del visitante. */
export const TENSIONS: Tension[] = [
  {
    id: 'informacion',
    process: 'Acceso al conocimiento',
    opportunity: 'Acceso al conocimiento',
    risk: 'Información errónea',
    domain: 'Comunicación',
    opportunityDetail: [
      'La traducción, la síntesis y la búsqueda asistida pueden ampliar el acceso a información, educación y formación ',
      { cite: 'ep2025' },
      '.',
    ],
    riskDetail: [
      'Los sistemas pueden producir contenidos inventados o engañosos con apariencia convincente; los deepfakes y las cámaras de eco figuran entre las amenazas señaladas ',
      { cite: 'ep2025' },
      '. Una IA confiable debe ser válida y fiable ',
      { cite: 'nist2023' },
      '.',
    ],
    favorable: ['Más personas acceden a textos en otros idiomas.', 'Resúmenes que facilitan una primera lectura.'],
    adverse: ['Se comparten afirmaciones sin fuente.', 'Una respuesta fluida se confunde con una prueba.'],
    measure: 'Contraste con fuentes originales',
    measureSteps: ['Identificar quién afirma y con qué evidencia.', 'Enlazar el documento original.', 'Señalar la incertidumbre cuando exista.'],
    withMeasure: 'Las afirmaciones llegan acompañadas de su fuente y de sus límites.',
    withoutMeasure: 'El contenido persuasivo circula sin comprobación.',
    principle: '03',
  },
  {
    id: 'creacion',
    process: 'Creatividad asistida',
    opportunity: 'Creatividad asistida',
    risk: 'Pérdida de atribución',
    domain: 'Creatividad',
    opportunityDetail: [
      'Las herramientas generativas permiten iterar más rápido y explorar nuevos recursos expresivos; las tareas de creación de contenido mostraron resultados más favorables que las de decisión ',
      { cite: 'vaccaro2024' },
      '.',
    ],
    riskDetail: [
      'Pueden invisibilizarse los creadores y los procesos; la UNESCO advierte sobre el uso injusto del trabajo de creadores y la homogeneización algorítmica ',
      { cite: 'unesco2025' },
      '. En Estados Unidos, la protección depende de la contribución expresiva humana ',
      { cite: 'usco2025' },
      '.',
    ],
    favorable: ['Más versiones para comparar y elegir.', 'Nuevos formatos para expresar ideas.'],
    adverse: ['No queda claro quién decidió qué.', 'Obras ajenas se reutilizan sin reconocimiento.'],
    measure: 'Registrar contribuciones y revisar licencias',
    measureSteps: ['Documentar qué hizo cada persona y cada herramienta.', 'Revisar licencias y permisos.', 'Publicar créditos completos.'],
    withMeasure: 'La obra muestra su proceso y reconoce a quienes la hicieron posible.',
    withoutMeasure: 'El producto es visible, pero desaparece el registro de quién creó, editó y decidió.',
    principle: '04',
  },
  {
    id: 'colaboracion',
    process: 'Colaboración ampliada',
    opportunity: 'Colaboración ampliada',
    risk: 'Desigualdad de participación',
    domain: 'Colaboración',
    opportunityDetail: [
      'Las redes permiten colaborar a distancia y conectar saberes distribuidos ',
      { cite: 'levy2004' },
      '.',
    ],
    riskDetail: [
      'Quedan fuera quienes no tienen acceso o voz. En grupos humanos, la inteligencia colectiva se asocia con una distribución más equitativa de los turnos de conversación ',
      { cite: 'mitMci' },
      '; la diversidad y la inclusión son valores de la ',
      { i: 'Recomendación' },
      ' de la UNESCO ',
      { cite: 'unesco2021' },
      '.',
    ],
    favorable: ['Equipos que reúnen experiencias distintas.', 'Proyectos que superan distancias.'],
    adverse: ['Hablan siempre las mismas voces.', 'Personas sin conexión o sin formación quedan excluidas.'],
    measure: 'Accesibilidad, turnos y canales alternativos',
    measureSteps: ['Diseñar con criterios de accesibilidad.', 'Organizar turnos y escucha.', 'Ofrecer canales alternativos de participación.'],
    withMeasure: 'Participar significa también poder influir.',
    withoutMeasure: 'La red puede volverse homogénea sin que nadie la haya desconectado.',
    principle: '02',
  },
  {
    id: 'automatizacion',
    process: 'Automatización de tareas',
    opportunity: 'Automatización de tareas',
    risk: 'Sobredependencia',
    domain: 'Transversal',
    opportunityDetail: ['Delegar tareas repetitivas puede liberar tiempo para actividades humanas de alto valor.'],
    riskDetail: [
      'Delegar sin verificar ni comprender. El Parlamento Europeo señala tanto el uso excesivo de la IA en tareas que no lo requieren como su infrautilización ',
      { cite: 'ep2025' },
      '; combinar personas e IA no garantiza superar a la mejor alternativa ',
      { cite: 'vaccaro2024' },
      '.',
    ],
    favorable: ['Menos tiempo en tareas mecánicas.', 'Procesos más rápidos.'],
    adverse: ['Se pierde la capacidad de revisar.', 'Se automatiza por costumbre, no por utilidad.'],
    measure: 'Supervisión proporcional al riesgo',
    measureSteps: ['Clasificar las tareas según su impacto.', 'Definir quién revisa y cuándo.', 'Evaluar si la automatización mejora el resultado.'],
    withMeasure: 'La supervisión crece cuando aumenta el impacto de una decisión.',
    withoutMeasure: 'Nadie revisa lo que el sistema produce porque «siempre funciona».',
    principle: '01',
  },
  {
    id: 'privacidad',
    process: 'Personalización',
    opportunity: 'Personalización',
    risk: 'Vigilancia y privacidad',
    domain: 'Comunicación',
    opportunityDetail: ['Adaptar servicios y contenidos a necesidades concretas, incluidas las de accesibilidad ', { cite: 'ep2025' }, '.'],
    riskDetail: [
      'Exposición y abuso de datos personales; el reconocimiento facial y la elaboración de perfiles figuran entre los riesgos señalados ',
      { cite: 'ep2025' },
      '. El derecho a la privacidad y la protección de datos es un principio de la UNESCO ',
      { cite: 'unesco2021' },
      '.',
    ],
    favorable: ['Servicios más útiles para cada persona.', 'Interfaces adaptadas.'],
    adverse: ['Se recogen datos sin explicar por qué.', 'Las personas se convierten en perfiles.'],
    measure: 'Minimización, información clara y autorización',
    measureSteps: ['Recoger solo los datos necesarios.', 'Explicar para qué se usan.', 'Pedir autorización cuando corresponda.'],
    withMeasure: 'La personalización no exige exponer más de lo necesario.',
    withoutMeasure: 'Se normaliza una exposición innecesaria de datos.',
    principle: '06',
  },
  {
    id: 'decisiones',
    process: 'Decisiones asistidas',
    opportunity: 'Decisiones asistidas',
    risk: 'Sesgos y opacidad',
    domain: 'Transversal',
    opportunityDetail: ['Detectar patrones útiles en grandes volúmenes de información para apoyar decisiones.'],
    riskDetail: [
      'Injusticia por datos, objetivos o procesos deficientes: el Parlamento Europeo menciona sesgos en contratación, préstamos o procesos penales ',
      { cite: 'ep2025' },
      '. El NIST propone una IA justa, con sesgos perjudiciales gestionados, y explicable ',
      { cite: 'nist2023' },
      '. En tareas de decisión, la combinación humano-IA mostró pérdidas en promedio ',
      { cite: 'vaccaro2024' },
      '.',
    ],
    favorable: ['Análisis más amplios.', 'Detección temprana de problemas.'],
    adverse: ['Errores que afectan de forma desigual.', 'Decisiones que nadie puede explicar.'],
    measure: 'Pruebas, auditoría, explicación y revisión humana',
    measureSteps: ['Probar el sistema con casos diversos.', 'Auditar resultados por grupos.', 'Explicar y permitir impugnar decisiones.'],
    withMeasure: 'Las decisiones pueden explicarse, revisarse y corregirse.',
    withoutMeasure: 'Un error puede afectar de modo desigual a personas y comunidades.',
    principle: '05',
  },
  {
    id: 'ambiental',
    process: 'Escalabilidad digital',
    opportunity: 'Escalabilidad digital',
    risk: 'Impacto ambiental',
    domain: 'Transversal',
    opportunityDetail: [
      'Resolver tareas a mayor escala; el Parlamento Europeo menciona el apoyo de la IA a los objetivos del Pacto Verde Europeo ',
      { cite: 'ep2025' },
      '.',
    ],
    riskDetail: [
      'La infraestructura digital tiene costos energéticos y materiales. La sostenibilidad y el florecimiento del medio ambiente figuran entre los valores y principios de la UNESCO ',
      { cite: 'unesco2021' },
      '.',
    ],
    favorable: ['Servicios para más personas.', 'Optimización de procesos.'],
    adverse: ['Consumo de recursos por tareas innecesarias.', 'Costos que no se ven en la pantalla.'],
    measure: 'Uso proporcionado y evaluación de impacto',
    measureSteps: ['Preguntar si la tarea necesita IA.', 'Elegir la herramienta más proporcionada.', 'Considerar el impacto al evaluar el proyecto.'],
    withMeasure: 'Usamos IA cuando aporta, no por costumbre.',
    withoutMeasure: 'Podemos usar recursos para tareas sin preguntarnos si esa escala era necesaria.',
    principle: '08',
  },
];
