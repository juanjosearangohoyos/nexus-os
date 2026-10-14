import { useEffect, useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useOS } from '../../components/os/OSContext';
import { Cite, RichText } from '../../components/ui/Cite';
import { Badge, CompletionBar, Deeper, ExternalLink, Tag, WelcomeNote } from '../../components/ui/bits';
import { MEMBER, TEAM } from '../../content/team';
import { MSG_CHAT, MSG_CONCEPT, MSG_HEADLINE, MSG_LEVY_QUOTE, MSG_MODES, MSG_NUANCE, MSG_PIECES, MSG_PIECES_DONE, MSG_PRINCIPLE } from '../../content/mensajes';
import { sfx } from '../../lib/sound';
import './mensajes.css';

type View = 'equipo' | 'saberes';
type Mode = (typeof MSG_MODES)[number]['id'];
type PieceId = (typeof MSG_PIECES)[number]['id'];

const VIEWS: { id: View; title: string; preview: string }[] = [
  { id: 'equipo', title: 'Equipo NEXUS', preview: 'Conectar no basta. ¿Quién está siendo escuchado?' },
  { id: 'saberes', title: 'Unir conocimientos', preview: 'Actividad opcional · cuatro saberes.' },
];

export default function Mensajes() {
  const [view, setView] = usePersistent<View>('mensajes:view', 'equipo');
  const [modesSeen, setModesSeen] = usePersistent<Mode[]>('mensajes:modes', []);
  const [placed, setPlaced] = usePersistent<Partial<Record<PieceId, boolean>>>('mensajes:placed', {});
  const allPlaced = MSG_PIECES.every((p) => placed[p.id]);
  const current: View = view === 'saberes' ? 'saberes' : 'equipo';

  return (
    <div className="app app--mensajes">
      <aside className="app__side msg-side" aria-label="Conversaciones">
        <div className="msg-side__head">
          <p className="eyebrow">Inteligencia colectiva</p>
          <h2>Mensajes</h2>
        </div>
        <ul className="msg-list">
          {VIEWS.map((v) => {
            const complete = (v.id === 'equipo' && modesSeen.includes('turnos')) || (v.id === 'saberes' && allPlaced);
            return (
              <li key={v.id}>
                <button type="button" className={`msg-list__item ${current === v.id ? 'is-active' : ''}`} aria-current={current === v.id} onClick={() => setView(v.id)}>
                  <span className="msg-list__avatar" aria-hidden="true">
                    {v.id === 'equipo' ? (
                      <span className="msg-stack">
                        {TEAM.map((m) => (
                          <Badge key={m.initials} member={m} size={20} />
                        ))}
                      </span>
                    ) : (
                      <span className="msg-list__glyph">◇</span>
                    )}
                  </span>
                  <span className="msg-list__text">
                    <strong>{v.title}</strong>
                    <span>{v.preview}</span>
                  </span>
                  {complete && <span className="msg-list__done" aria-label="completado">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="msg-side__foot">
          <WelcomeNote initials="VG" title={MEMBER.VG.welcomeTitle} text={MEMBER.VG.welcomeText} />
        </div>
      </aside>

      <section className="app__main msg-main">
        <header className="msg-headline">
          <p className="msg-headline__text">{MSG_HEADLINE}</p>
        </header>

        {current === 'equipo' ? (
          <>
            <div className="msg-duo">
              <TeamChat />
              <Listening seen={modesSeen} onSee={(m) => setModesSeen((s) => (s.includes(m) ? s : [...s, m]))} />
            </div>
            <p className="msg-optional">
              ¿Quieres ir más allá?{' '}
              <button type="button" className="link-btn" onClick={() => setView('saberes')}>
                Actividad opcional: unir cuatro saberes →
              </button>
            </p>
          </>
        ) : (
          <Knowledge placed={placed} setPlaced={setPlaced} onBack={() => setView('equipo')} />
        )}

        <Deeper title="Comprender mejor: Lévy y el MIT" hint="Definición, matiz indispensable y fuentes">
          <Concept />
        </Deeper>

        <CompletionBar app="mensajes" done={modesSeen.includes('turnos')} principle={{ n: '02', text: MSG_PRINCIPLE }} />
      </section>
    </div>
  );
}

function TeamChat() {
  const { reducedMotion } = useOS();
  const [shown, setShown] = useState(reducedMotion ? MSG_CHAT.length : 1);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (shown >= MSG_CHAT.length) return;
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setShown((s) => s + 1);
      sfx.message();
    }, 900);
    return () => window.clearTimeout(t);
  }, [shown]);

  const next = MSG_CHAT[shown];

  return (
    <section className="chat" aria-label="Conversación del equipo">
      <div className="chat__banner">
        <Tag kind="simulacion">Simulación editorial</Tag>
        <span>Conversación escrita por el equipo, no un registro real.</span>
      </div>
      <ol className="chat__log" aria-live="polite">
        {MSG_CHAT.slice(0, shown).map((m, i) => {
          const member = MEMBER[m.from];
          const mine = m.from === 'VG';
          return (
            <li key={i} className={`bubble-row ${mine ? 'is-mine' : ''}`}>
              {!mine && <Badge member={member} size={30} />}
              <div className="bubble">
                <span className="bubble__name">{member.name}</span>
                <p>{m.text}</p>
              </div>
              {mine && <Badge member={member} size={30} />}
            </li>
          );
        })}
        {typing && next && (
          <li className="bubble-row bubble-row--typing" aria-label={`${MEMBER[next.from].name} está escribiendo`}>
            <Badge member={MEMBER[next.from]} size={30} />
            <div className="bubble bubble--typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </li>
        )}
      </ol>
      <div className="chat__controls">
        {shown < MSG_CHAT.length ? (
          <button type="button" className="btn btn--small" onClick={() => setShown(MSG_CHAT.length)}>
            Mostrar toda la conversación
          </button>
        ) : (
          <button type="button" className="btn btn--small" onClick={() => setShown(1)}>
            Repetir conversación
          </button>
        )}
      </div>
    </section>
  );
}

const NODES = [
  { id: 'VG', x: 90, y: 70 },
  { id: 'JR', x: 330, y: 70 },
  { id: 'SC', x: 330, y: 230 },
  { id: 'JJ', x: 90, y: 230 },
] as const;

/** Esquema de una forma de conversar (ilustración; no mide nada real). */
function ModeDiagram({ mode, label }: { mode: Mode; label: string }) {
  return (
    <svg viewBox="0 0 420 300" role="img" aria-label={`Ilustración: ${label}`}>
      <defs>
        <radialGradient id={`msgCore-${mode}`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.4" stopColor="#6FF0A0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6FF0A0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {mode === 'turnos' && <circle cx="210" cy="150" r="58" fill={`url(#msgCore-${mode})`} className="listen__core" />}
      {mode === 'turnos' && (
        <text x="210" y="155" textAnchor="middle" className="listen__core-label">
          espacio común
        </text>
      )}
      {NODES.map((n, i) => {
        const active = mode === 'todos' || (mode === 'uno' && n.id === 'VG') || mode === 'turnos';
        return (
          <g key={n.id}>
            {mode === 'uno' && n.id !== 'VG' && <line x1={90} y1={70} x2={n.x} y2={n.y} className="listen__line listen__line--one" />}
            {mode === 'turnos' && <line x1={n.x} y1={n.y} x2={210} y2={150} className="listen__line listen__line--turn" style={{ animationDelay: `${i * 0.8}s` }} />}
            {mode === 'todos' &&
              NODES.filter((o) => o.id !== n.id).map((o) => (
                <line key={o.id} x1={n.x} y1={n.y} x2={o.x + (i % 2 ? 14 : -10)} y2={o.y + (i % 2 ? -12 : 10)} className="listen__line listen__line--noise" />
              ))}
            <circle cx={n.x} cy={n.y} r={30} className={`listen__node ${active ? 'is-active' : 'is-muted'} ${mode === 'turnos' ? 'is-turn' : ''}`} style={{ animationDelay: `${i * 0.8}s` }} />
            <text x={n.x} y={n.y + 6} textAnchor="middle" className="listen__label">
              {n.id}
            </text>
            {(mode === 'todos' || (mode === 'uno' && n.id === 'VG')) &&
              [0, 1, 2].map((k) => (
                <rect
                  key={k}
                  x={n.x + (n.x < 210 ? 34 : -82) + k * (mode === 'todos' ? 6 : 0)}
                  y={n.y - 30 + k * (mode === 'uno' ? 20 : 9)}
                  width={48}
                  height={14}
                  rx={7}
                  className="listen__bubble"
                  style={{ animationDelay: `${k * 0.3 + i * 0.15}s` }}
                />
              ))}
            {mode === 'turnos' && (
              <rect x={n.x + (n.x < 210 ? 34 : -82)} y={n.y - 8} width={48} height={14} rx={7} className="listen__bubble listen__bubble--turn" style={{ animationDelay: `${i * 0.8}s` }} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function Listening({ seen, onSee }: { seen: Mode[]; onSee: (m: Mode) => void }) {
  const [mode, setMode] = useState<Mode>(seen[seen.length - 1] ?? 'uno');
  const info = MSG_MODES.find((m) => m.id === mode)!;
  useEffect(() => onSee(mode), [mode, onSee]);

  return (
    <section className="listen" aria-labelledby="listen-title">
      <h3 className="msg-h3" id="listen-title">
        ¿Quién está siendo escuchado?
      </h3>
      <p className="msg-lead">Tres formas de repartir la palabra. Toca una para ver qué cambia.</p>
      <div className="listen__modes" role="radiogroup" aria-label="Forma de conversación">
        {MSG_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            className={`listen__mode listen--${m.id} ${mode === m.id ? 'is-on' : ''}`}
            onClick={() => {
              setMode(m.id);
              sfx.click();
            }}
          >
            <ModeDiagram mode={m.id} label={m.label} />
            <span className="listen__mode-label">{m.label}</span>
            {seen.includes(m.id) && <span className="listen__seen" aria-label="visto">✓</span>}
          </button>
        ))}
      </div>
      <div className={`listen__result is-${mode}`} aria-live="polite">
        <p className="listen__result-main">{info.result}</p>
        <p className="listen__result-detail">{info.detail}</p>
        {mode === 'turnos' && (
          <p className="listen__evidence">
            <Tag kind="evidencia" /> En grupos humanos, un reparto más equitativo de los turnos se asocia con mayor inteligencia colectiva{' '}
            <Cite id="mitMci" claim="La inteligencia colectiva de un grupo se correlaciona con la igualdad en la distribución de turnos de conversación y con la sensibilidad social media." />.
          </p>
        )}
      </div>
      <p className="listen__sim">
        <Tag kind="simulacion" /> Ilustración: no mide conversaciones reales.
      </p>
    </section>
  );
}

function Knowledge({
  placed,
  setPlaced,
  onBack,
}: {
  placed: Partial<Record<PieceId, boolean>>;
  setPlaced: (v: Partial<Record<PieceId, boolean>> | ((p: Partial<Record<PieceId, boolean>>) => Partial<Record<PieceId, boolean>>)) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<PieceId | null>(null);
  const [feedback, setFeedback] = useState<string>('Toca una pieza y luego su espacio (también puedes arrastrarla).');
  const all = MSG_PIECES.every((p) => placed[p.id]);

  const tryPlace = (piece: PieceId, slot: PieceId) => {
    if (piece === slot) {
      setPlaced((p) => ({ ...p, [piece]: true }));
      const info = MSG_PIECES.find((p) => p.id === piece)!;
      setFeedback(`${info.label}: ${info.adds}`);
      setSelected(null);
      sfx.success();
    } else {
      const s = MSG_PIECES.find((p) => p.id === slot)!;
      setFeedback(`Esa pieza no encaja en «${s.slot}». Piensa qué tipo de saber responde a ese espacio.`);
      sfx.alert();
    }
  };

  return (
    <section className="kb">
      <div className="kb__intro">
        <h3 className="msg-h3">Unir conocimientos · actividad opcional</h3>
        <p className="msg-lead">Ninguno de nosotros conoce el sistema completo. Coloca cada saber en su espacio.</p>
        <div className="kb__pieces" aria-label="Piezas disponibles">
          {MSG_PIECES.filter((p) => !placed[p.id]).map((p) => (
            <button
              key={p.id}
              type="button"
              draggable
              className={`kb__piece kb__piece--${p.id} ${selected === p.id ? 'is-selected' : ''}`}
              aria-pressed={selected === p.id}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', p.id)}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
            >
              {p.label}
            </button>
          ))}
          {all && <p className="kb__all">Todas las piezas están en su lugar.</p>}
        </div>
        <p className="kb__feedback" role="status">
          {all ? MSG_PIECES_DONE : feedback}
        </p>
        <div className="chat__controls">
          <button type="button" className="btn btn--small" onClick={() => { setPlaced({}); setFeedback('Piezas reiniciadas.'); }}>
            Reiniciar piezas
          </button>
          <button type="button" className="btn btn--small" onClick={onBack}>
            ← Volver a la conversación
          </button>
        </div>
      </div>
      <div className={`kb__board ${all ? 'is-complete' : ''}`}>
        {MSG_PIECES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`kb__slot ${placed[s.id] ? `is-filled kb__piece--${s.id}` : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain') as PieceId;
              if (id) tryPlace(id, s.id);
            }}
            onClick={() => {
              if (placed[s.id]) return;
              if (selected) tryPlace(selected, s.id);
              else setFeedback('Primero selecciona una pieza.');
            }}
            aria-label={placed[s.id] ? `${s.slot}: ${s.label} colocada` : `Espacio: ${s.slot}`}
          >
            <span className="kb__slot-hint">{s.slot}</span>
            {placed[s.id] && <strong>{s.label}</strong>}
          </button>
        ))}
        <div className="kb__center" aria-hidden="true">
          Conocimiento
          <br />
          compartido
        </div>
      </div>
    </section>
  );
}

function Concept() {
  const { openSource } = useOS();
  return (
    <div className="concept">
      <article className="card">
        <Tag kind="evidencia" />
        <p>
          <RichText value={MSG_CONCEPT} />
        </p>
        <blockquote className="quote">
          Lévy la define como «{MSG_LEVY_QUOTE.text}» <Cite id="levy2004" locator={MSG_LEVY_QUOTE.locator} claim="Definición de inteligencia colectiva en Lévy (1994/2004)." />.
        </blockquote>
      </article>
      <article className="card card--nuance">
        <Tag kind="evidencia">Matiz indispensable</Tag>
        <p>
          <RichText value={MSG_NUANCE} />
        </p>
      </article>
      <article className="card">
        <Tag kind="postura" />
        <p>
          Por eso no tratamos cualquier red como inteligente: preguntamos quién participa, quién influye y cómo se valida lo que construimos.
        </p>
      </article>
      <div className="pill-row">
        <ExternalLink href="https://cci.mit.edu/mci/">Abrir estudio del MIT</ExternalLink>
        <button type="button" className="btn btn--ghost" onClick={() => openSource('levy2004')}>
          Ficha de Lévy (1994/2004)
        </button>
      </div>
    </div>
  );
}
