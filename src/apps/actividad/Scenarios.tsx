/**
 * Siete ilustraciones cualitativas, una por tensión. Cada una explica un mecanismo distinto
 * (flujo, atribución, participación, supervisión, exposición, decisión, proporcionalidad).
 * No representan datos, porcentajes ni probabilidades.
 */
const OK = '#3fffc4';
const RISK = '#ff7a6b';
const MUTED = 'rgba(255,255,255,0.28)';
const TEXT = '#e8f1ff';

function Box({ x, y, w, h, label, color, sub }: { x: number; y: number; w: number; h: number; label: string; color: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={`${color}22`} stroke={color} strokeWidth={1.6} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" fontSize="13" fontWeight="700" fill={TEXT}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize="11" fill="rgba(232,241,255,0.75)">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - Math.cos(a) * 8;
  const hy = y2 - Math.sin(a) * 8;
  return (
    <g stroke={color} fill={color}>
      <line x1={x1} y1={y1} x2={hx} y2={hy} strokeWidth={2} strokeDasharray={dashed ? '5 5' : undefined} />
      <path d={`M${x2},${y2} L${hx - Math.sin(a) * 5},${hy + Math.cos(a) * 5} L${hx + Math.sin(a) * 5},${hy - Math.cos(a) * 5} Z`} stroke="none" />
    </g>
  );
}

function Note({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <text x={x} y={y} fontSize="12" fontWeight="600" fill={color} textAnchor="middle">
      {text}
    </text>
  );
}

/** Acceso al conocimiento / información errónea: flujo de una afirmación. */
function Informacion({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Una afirmación pasa por un punto de contraste con la fuente original antes de compartirse.' : 'Una afirmación generada se comparte sin pasar por ninguna verificación.'}>
      <Box x={10} y={80} w={110} h={56} label="Respuesta" sub="generada" color="#9b5cff" />
      {on ? (
        <>
          <Arrow x1={120} y1={108} x2={175} y2={108} color={OK} />
          <Box x={175} y={72} w={115} h={72} label="Contraste" sub="fuente original" color={OK} />
          <Arrow x1={290} y1={108} x2={335} y2={108} color={OK} />
          <Box x={335} y={80} w={115} h={56} label="Se comparte" sub="con su fuente" color={OK} />
          <Note x={232} y={176} text="Lo que no se comprueba queda marcado como incierto" color={OK} />
        </>
      ) : (
        <>
          <Arrow x1={120} y1={100} x2={335} y2={40} color={RISK} dashed />
          <Arrow x1={120} y1={108} x2={335} y2={108} color={RISK} dashed />
          <Arrow x1={120} y1={116} x2={335} y2={176} color={RISK} dashed />
          {[40, 108, 176].map((y) => (
            <Box key={y} x={335} y={y - 20} w={115} h={40} label="Compartida" color={RISK} />
          ))}
          <Note x={230} y={210} text="Se replica sin que nadie consulte el original" color={RISK} />
        </>
      )}
    </svg>
  );
}

/** Creatividad asistida / pérdida de atribución: quién aparece en los créditos. */
function Creacion({ on }: { on: boolean }) {
  const people = ['Idea', 'Variaciones IA', 'Selección', 'Edición'];
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'La obra final muestra en sus créditos cada aporte humano y el uso de la herramienta.' : 'La obra final aparece sin registro de quién aportó qué.'}>
      {people.map((p, i) => (
        <Box key={p} x={10} y={12 + i * 50} w={130} h={40} label={p} color={on ? (i === 1 ? '#9b5cff' : OK) : MUTED} />
      ))}
      {people.map((_, i) => (
        <Arrow key={i} x1={140} y1={32 + i * 50} x2={250} y2={110} color={on ? OK : MUTED} dashed={!on} />
      ))}
      <Box x={250} y={70} w={200} h={80} label="Obra publicada" sub={on ? 'créditos completos y licencias' : 'sin registro del proceso'} color={on ? OK : RISK} />
      <Note x={350} y={185} text={on ? 'Cada decisión tiene autoría visible' : '¿Quién creó, editó y decidió?'} color={on ? OK : RISK} />
    </svg>
  );
}

/** Colaboración ampliada / desigualdad de participación: quién tiene voz. */
function Colaboracion({ on }: { on: boolean }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 230 + Math.cos(a) * 80, y: 105 + Math.sin(a) * 75 };
  });
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Ocho participantes con turnos repartidos y canales alternativos.' : 'Dos participantes concentran la palabra; los demás quedan fuera.'}>
      <circle cx={230} cy={105} r={26} fill={on ? `${OK}33` : `${RISK}22`} stroke={on ? OK : RISK} />
      <text x={230} y={109} textAnchor="middle" fontSize="11" fontWeight="700" fill={TEXT}>
        decisión
      </text>
      {pts.map((p, i) => {
        const heard = on || i < 2;
        return (
          <g key={i}>
            {heard && <line x1={p.x} y1={p.y} x2={230} y2={105} stroke={on ? OK : RISK} strokeWidth={on ? 2 : 4} />}
            <circle cx={p.x} cy={p.y} r={on ? 13 : i < 2 ? 18 : 11} fill={heard ? (on ? OK : RISK) : MUTED} opacity={heard ? 0.85 : 0.5} />
          </g>
        );
      })}
      <Note x={230} y={212} text={on ? 'Turnos, accesibilidad y canales alternativos' : 'Dos voces deciden; seis no influyen'} color={on ? OK : RISK} />
    </svg>
  );
}

/** Automatización / sobredependencia: supervisión proporcional al impacto. */
function Automatizacion({ on }: { on: boolean }) {
  const rows = [
    { t: 'Impacto bajo', ex: 'formatear un texto' },
    { t: 'Impacto medio', ex: 'resumir fuentes' },
    { t: 'Impacto alto', ex: 'decidir qué publicar' },
  ];
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Las tareas de mayor impacto pasan por revisión humana; las de bajo impacto se automatizan.' : 'Todas las tareas se automatizan sin revisión, incluso las de alto impacto.'}>
      {rows.map((r, i) => {
        const review = on && i > 0;
        const y = 14 + i * 64;
        return (
          <g key={r.t}>
            <Box x={10} y={y} w={140} h={50} label={r.t} sub={r.ex} color={i === 2 ? '#ffc94d' : '#5cc8ff'} />
            <Arrow x1={150} y1={y + 25} x2={review ? 215 : 330} y2={y + 25} color={on ? OK : i === 2 ? RISK : MUTED} dashed={!on} />
            {review && <Box x={215} y={y + 5} w={105} h={40} label={i === 2 ? 'Revisión + firma' : 'Revisión'} color={OK} />}
            {review && <Arrow x1={320} y1={y + 25} x2={340} y2={y + 25} color={OK} />}
            <Box x={340} y={y + 5} w={110} h={40} label="Resultado" color={on ? OK : i === 2 ? RISK : MUTED} />
          </g>
        );
      })}
    </svg>
  );
}

/** Personalización / privacidad: qué datos se recogen. */
function Privacidad({ on }: { on: boolean }) {
  const fields = ['Preferencia de idioma', 'Necesidad de accesibilidad', 'Ubicación precisa', 'Contactos', 'Historial completo', 'Rostro'];
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Solo se recogen dos datos necesarios, con explicación y autorización.' : 'Se recogen seis tipos de datos, incluidos datos sensibles, sin explicación.'}>
      {fields.map((f, i) => {
        const needed = i < 2;
        const kept = on ? needed : true;
        const y = 8 + i * 34;
        return (
          <g key={f}>
            <rect x={10} y={y} width={230} height={28} rx={7} fill={kept ? (needed ? `${OK}22` : `${RISK}26`) : 'transparent'} stroke={kept ? (needed ? OK : RISK) : MUTED} strokeDasharray={kept ? undefined : '4 4'} />
            <text x={22} y={y + 19} fontSize="12" fill={kept ? TEXT : 'rgba(232,241,255,0.45)'} textDecoration={kept ? undefined : 'line-through'}>
              {f}
            </text>
          </g>
        );
      })}
      <Box x={290} y={70} w={160} h={70} label={on ? 'Perfil mínimo' : 'Perfil expuesto'} sub={on ? 'explicado y autorizado' : 'sin explicar por qué'} color={on ? OK : RISK} />
      {on && <Note x={370} y={170} text="🔒 Consentimiento cuando corresponde" color={OK} />}
    </svg>
  );
}

/** Decisiones asistidas / sesgos y opacidad: circuito de responsabilidad. */
function Decisiones({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Circuito con auditoría de datos, explicación y posibilidad de impugnar la decisión.' : 'Cadena cerrada: datos, sistema y decisión, sin explicación ni vía para corregir.'}>
      <Box x={10} y={60} w={90} h={50} label="Datos" color={on ? OK : '#5cc8ff'} />
      <Arrow x1={100} y1={85} x2={130} y2={85} color={on ? OK : MUTED} />
      <Box x={130} y={60} w={100} h={50} label="Sistema" color="#9b5cff" />
      <Arrow x1={230} y1={85} x2={260} y2={85} color={on ? OK : MUTED} />
      <Box x={260} y={60} w={90} h={50} label="Decisión" color={on ? OK : RISK} />
      <Arrow x1={350} y1={85} x2={370} y2={85} color={on ? OK : RISK} />
      <Box x={370} y={60} w={80} h={50} label="Persona" sub="afectada" color={on ? OK : RISK} />
      {on ? (
        <>
          <Box x={20} y={140} w={110} h={40} label="Auditoría" color={OK} />
          <Box x={175} y={140} w={110} h={40} label="Explicación" color={OK} />
          <Box x={330} y={140} w={120} h={40} label="Impugnar" color={OK} />
          <path d="M390 140 C 390 125, 300 125, 300 110" fill="none" stroke={OK} strokeWidth={2} strokeDasharray="5 4" />
          <Note x={230} y={210} text="Quien es afectado puede entender y pedir corrección" color={OK} />
        </>
      ) : (
        <Note x={230} y={160} text="Nadie puede explicar ni corregir el resultado" color={RISK} />
      )}
    </svg>
  );
}

/** Escalabilidad / impacto ambiental: uso proporcionado de la herramienta. */
function Ambiental({ on }: { on: boolean }) {
  const tasks = ['Corregir una tilde', 'Traducir un aviso', 'Analizar mil documentos'];
  return (
    <svg viewBox="0 0 460 220" role="img" aria-label={on ? 'Cada tarea se resuelve con la herramienta proporcionada; solo la más grande usa un modelo grande.' : 'Todas las tareas, incluso las mínimas, se envían a un modelo grande.'}>
      {tasks.map((t, i) => {
        const y = 14 + i * 64;
        const big = !on || i === 2;
        return (
          <g key={t}>
            <Box x={10} y={y} w={160} h={46} label={t} color="#5cc8ff" />
            <Arrow x1={170} y1={y + 23} x2={big ? 300 : 235} y2={big ? 105 : y + 23} color={big ? (on ? '#ffc94d' : RISK) : OK} />
            {!big && <Box x={235} y={y + 4} w={110} h={38} label="Herramienta simple" color={OK} />}
          </g>
        );
      })}
      <circle cx={360} cy={105} r={on ? 34 : 54} fill={on ? '#ffc94d22' : `${RISK}22`} stroke={on ? '#ffc94d' : RISK} strokeWidth={2} />
      <text x={360} y={101} textAnchor="middle" fontSize="12" fontWeight="700" fill={TEXT}>
        Modelo
      </text>
      <text x={360} y={117} textAnchor="middle" fontSize="12" fontWeight="700" fill={TEXT}>
        grande
      </text>
      <Note x={230} y={212} text={on ? 'Usamos IA cuando aporta, no por costumbre' : 'Toda tarea consume la misma infraestructura'} color={on ? OK : RISK} />
    </svg>
  );
}

export function Scenario({ id, on }: { id: string; on: boolean }) {
  switch (id) {
    case 'informacion':
      return <Informacion on={on} />;
    case 'creacion':
      return <Creacion on={on} />;
    case 'colaboracion':
      return <Colaboracion on={on} />;
    case 'automatizacion':
      return <Automatizacion on={on} />;
    case 'privacidad':
      return <Privacidad on={on} />;
    case 'decisiones':
      return <Decisiones on={on} />;
    case 'ambiental':
      return <Ambiental on={on} />;
    default:
      return null;
  }
}
