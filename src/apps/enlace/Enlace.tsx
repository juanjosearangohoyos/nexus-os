import { useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { Cite, RichText } from '../../components/ui/Cite';
import { CompletionBar, Deeper, ExternalLink, Tag, WelcomeNote } from '../../components/ui/bits';
import { MEMBER } from '../../content/team';
import { ENL_DEFINITION, ENL_DELLERMANN, ENL_NUANCE, ENL_PRINCIPLE, INTELLIGENCES, PROBLEMS, PROPOSAL, TASKS, ZONES, type TaskId, type Zone } from '../../content/enlace';
import { sfx } from '../../lib/sound';
import './enlace.css';

type ProblemId = (typeof PROBLEMS)[number]['id'];
type IntId = (typeof INTELLIGENCES)[number]['id'] | 'relacion';

export default function Enlace() {
  const [problem, setProblem] = usePersistent<ProblemId>('enlace:problem', 'campana');
  const [assign, setAssign] = usePersistent<Partial<Record<TaskId, Zone>>>('enlace:assign', {});
  const complete = TASKS.every((t) => assign[t.id]);
  const count = TASKS.filter((t) => assign[t.id]).length;

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="app app--enlace">
      <aside className="app__side enl-side">
        <p className="eyebrow">Inteligencia híbrida</p>
        <h2 className="enl-side__title">Enlace</h2>
        <p className="enl-side__lead">Decidimos qué aporta cada parte y quién responde por el resultado.</p>
        <nav aria-label="Secciones de Enlace" className="enl-nav">
          {[
            ['enl-dato', '106 experimentos'],
            ['enl-equipo', 'Diseñar un equipo'],
            ['enl-tres', 'Tres inteligencias'],
          ].map(([id, label]) => (
            <button key={id} type="button" onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </nav>
        <WelcomeNote initials="SC" title={MEMBER.SC.welcomeTitle} text={MEMBER.SC.welcomeText} />
      </aside>

      <section className="app__main enl-main">
        <header className="enl-hero">
          <h2>La colaboración no sucede por accidente</h2>
          <p className="enl-hero__lead">
            La inteligencia híbrida es la cooperación <strong>organizada</strong> entre capacidades humanas y sistemas de IA. Su calidad depende del diseño, no
            de una mezcla automática.
          </p>
        </header>

        <MetaFinding />

        <section id="enl-equipo" className="enl-design">
          <div className="enl-design__head">
            <div>
              <h3 className="enl-h3">Diseñar un equipo</h3>
              <p className="muted">Elige un problema y asigna cada tarea. Cada decisión tiene una consecuencia; no hay puntuación.</p>
            </div>
            <div className="segmented" role="radiogroup" aria-label="Problema">
              {PROBLEMS.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={problem === p.id} className={problem === p.id ? 'is-on' : ''} onClick={() => setProblem(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <p className="enl-problem-note">
            <Tag kind="evidencia" /> {PROBLEMS.find((p) => p.id === problem)!.note} <Cite id="vaccaro2024" />
          </p>

          <div className="enl-design__grid">
            <ul className="assign">
              {TASKS.map((t) => {
                const z = assign[t.id];
                return (
                  <li key={t.id} className={`assign__row ${z ? `is-${z}` : ''}`}>
                    <span className="assign__task">{t.label}</span>
                    <div className="assign__zones" role="radiogroup" aria-label={`Responsable de ${t.label}`}>
                      {ZONES.map((zone) => (
                        <button
                          key={zone.id}
                          type="button"
                          role="radio"
                          aria-checked={z === zone.id}
                          className={`zone zone--${zone.id} ${z === zone.id ? 'is-on' : ''}`}
                          onClick={() => {
                            setAssign((a) => ({ ...a, [t.id]: zone.id }));
                            sfx.click();
                          }}
                        >
                          {zone.label}
                        </button>
                      ))}
                    </div>
                    <p className="assign__why" aria-live="polite">
                      {z ? t.why[z] : 'Sin asignar.'}
                    </p>
                  </li>
                );
              })}
              <li className="assign__tools">
                <button type="button" className="btn btn--small" onClick={() => setAssign({})} disabled={count === 0}>
                  Reiniciar asignaciones
                </button>
              </li>
            </ul>

            <div className="enl-design__result">
              {complete ? (
                <Circuit assign={assign as Record<TaskId, Zone>} problem={problem} />
              ) : (
                <div className="circuit circuit--pending" aria-live="polite">
                  <p className="circuit__title">Circuito de responsabilidades</p>
                  <p className="muted">
                    Asignadas {count} de {TASKS.length}. Al completar las cinco verás quién aporta, quién revisa y quién responde por el resultado.
                  </p>
                  <div className="circuit__progress" aria-hidden="true">
                    {TASKS.map((t) => (
                      <span key={t.id} className={assign[t.id] ? `is-${assign[t.id]}` : ''} />
                    ))}
                  </div>
                </div>
              )}
              {problem === 'campana' && <Proposal />}
            </div>
          </div>
        </section>

        <ThreeIntelligences />

        <Deeper title="Comprender mejor: ¿qué es la inteligencia híbrida?" hint="Definiciones de De Val Pardo y Dellermann et al.">
          <p>
            <Tag kind="evidencia" /> <RichText value={ENL_DEFINITION} />
          </p>
          <p>
            <RichText value={ENL_DELLERMANN} />
          </p>
          <div className="pill-row">
            <ExternalLink href="https://doi.org/10.1038/s41562-024-02024-1">Leer el estudio de Nature (2024)</ExternalLink>
          </div>
        </Deeper>

        <CompletionBar app="enlace" done={complete} principle={{ n: '05', text: ENL_PRINCIPLE }} />
      </section>
    </div>
  );
}

/** Tres inteligencias como nodos conectados: se relacionan, pero ninguna equivale ni implica a las otras. */
function ThreeIntelligences() {
  const [sel, setSel] = useState<IntId>('relacion');
  const info = INTELLIGENCES.find((i) => i.id === sel);
  const pos: Record<string, [number, number]> = { colectiva: [110, 95], artificial: [410, 95], hibrida: [260, 245] };
  const links: { a: string; b: string; text: string; x: number; y: number }[] = [
    { a: 'colectiva', b: 'artificial', text: 'puede usar herramientas digitales', x: 260, y: 70 },
    { a: 'colectiva', b: 'hibrida', text: 'aporta personas y criterio', x: 135, y: 190 },
    { a: 'artificial', b: 'hibrida', text: 'aporta inferencia', x: 395, y: 190 },
  ];
  return (
    <section id="enl-tres" className="tri">
      <h3 className="enl-h3">Tres inteligencias, una relación</h3>
      <div className="tri__layout">
        <svg viewBox="0 0 520 330" className="tri__svg" role="group" aria-label="Diagrama de las tres inteligencias">
          <defs>
            {INTELLIGENCES.map((it) => (
              <radialGradient key={it.id} id={`triG-${it.id}`} cx="0.4" cy="0.35" r="0.8">
                <stop offset="0" stopColor={it.color} stopOpacity="0.55" />
                <stop offset="1" stopColor={it.color} stopOpacity="0.12" />
              </radialGradient>
            ))}
          </defs>
          {links.map((l) => (
            <g key={l.text}>
              <line x1={pos[l.a][0]} y1={pos[l.a][1]} x2={pos[l.b][0]} y2={pos[l.b][1]} className="tri__link" />
              <text x={l.x} y={l.y} textAnchor="middle" className="tri__link-label">
                {l.text}
              </text>
            </g>
          ))}
          {INTELLIGENCES.map((it) => {
            const [x, y] = pos[it.id];
            return (
              <g
                key={it.id}
                className={`tri__node ${sel === it.id ? 'is-on' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`Inteligencia ${it.name}`}
                aria-pressed={sel === it.id}
                onClick={() => setSel(it.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(it.id))}
              >
                <circle cx={x} cy={y} r={62} fill={`url(#triG-${it.id})`} stroke={it.color} strokeWidth={sel === it.id ? 4 : 2} />
                <text x={x} y={y + 6} textAnchor="middle" className="tri__label">
                  {it.name}
                </text>
              </g>
            );
          })}
          <g
            className={`tri__node tri__node--rel ${sel === 'relacion' ? 'is-on' : ''}`}
            tabIndex={0}
            role="button"
            aria-label="Relación entre las tres"
            aria-pressed={sel === 'relacion'}
            onClick={() => setSel('relacion')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel('relacion'))}
          >
            <rect x={196} y={130} width={128} height={34} rx={17} />
            <text x={260} y={152} textAnchor="middle">
              ¿Sinónimos? No
            </text>
          </g>
        </svg>
        <div className="tri__info" aria-live="polite">
          {info ? (
            <>
              <p className="tri__kicker" style={{ color: info.color }}>
                Inteligencia {info.name.toLowerCase()}
              </p>
              <p className="tri__def">{info.def}</p>
              <p className="muted">Ejemplo: {info.example}</p>
              <p className="muted">
                Fuente: <Cite id={info.source} />
              </p>
            </>
          ) : (
            <>
              <p className="tri__kicker">Relación entre las tres</p>
              <p className="tri__def">{ENL_NUANCE}</p>
              <p className="muted">Toca un nodo para ver su definición.</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function MetaFinding() {
  return (
    <section id="enl-dato" className="meta">
      <div className="meta__head">
        <p className="meta__big">106 experimentos.</p>
        <p className="meta__sub">Una conclusión incómoda: sumar humano + IA no garantiza superar al mejor por separado.</p>
      </div>
      <div className="meta__body">
        <div className="meta__chart" role="img" aria-label="Representación ordinal: en promedio, la combinación humano-IA quedó por encima de las personas solas y por debajo de la mejor alternativa por separado.">
          <div className="meta__bar meta__bar--h">
            <span>Personas solas</span>
          </div>
          <div className="meta__bar meta__bar--c">
            <span>Combinación humano-IA</span>
          </div>
          <div className="meta__bar meta__bar--b">
            <span>Mejor alternativa por separado</span>
          </div>
          <p className="meta__caption">Representación ordinal de los promedios: no muestra magnitudes ni porcentajes.</p>
        </div>
        <div className="meta__text">
          <Tag kind="evidencia" />
          <p>
            En una revisión y metaanálisis, las combinaciones superaron en promedio al humano solo, pero no a la mejor alternativa individual; los resultados
            variaron por tipo de tarea. Las tareas creativas mostraron resultados más prometedores que varias tareas decisionales <Cite id="vaccaro2024" />.
          </p>
          <div className="meta__tasks">
            <span className="meta__task meta__task--down">Decisión: pérdidas en promedio</span>
            <span className="meta__task meta__task--up">Creación de contenido: ganancias mayores</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Circuit({ assign, problem }: { assign: Record<TaskId, Zone>; problem: ProblemId }) {
  const by = (z: Zone) => TASKS.filter((t) => assign[t.id] === z).map((t) => t.label);
  const warnings: { tone: 'risk' | 'ok' | 'note'; text: string }[] = [];
  if (assign.decision === 'ia') warnings.push({ tone: 'risk', text: 'Nadie responde por el resultado: la decisión final quedó sin una persona o un equipo identificable.' });
  if (assign.verificacion === 'ia') warnings.push({ tone: 'risk', text: 'La verificación es solo automática. Alguien debe consultar las fuentes originales antes de actuar.' });
  if (TASKS.every((t) => assign[t.id] === 'ia')) warnings.push({ tone: 'risk', text: 'Automatizar todo no garantiza un mejor resultado; la evidencia muestra efectos heterogéneos.' });
  if (TASKS.every((t) => assign[t.id] !== 'ia'))
    warnings.push({ tone: 'note', text: 'Es una opción válida: la colaboración puede funcionar sin IA. Pregúntense si renuncian a apoyos útiles, por ejemplo en la ideación.' });
  if (problem === 'publicar' && (assign.seleccion === 'ia' || assign.decision === 'ia'))
    warnings.push({ tone: 'risk', text: 'En una tarea de decisión, delegar la selección o la decisión en la IA requiere especial cautela.' });
  if (assign.decision !== 'ia' && assign.verificacion !== 'ia')
    warnings.push({ tone: 'ok', text: 'La colaboración mejora cuando sabemos quién aporta, evalúa y responde.' });

  const responsible = assign.decision === 'personas' ? 'Una persona identificable' : assign.decision === 'equipo' ? 'El equipo, con reglas de decisión' : 'Nadie identificable';

  return (
    <figure className="circuit">
      <figcaption className="circuit__title">Circuito de responsabilidades</figcaption>
      <div className="circuit__grid">
        {ZONES.map((z) => (
          <div key={z.id} className={`circuit__node circuit__node--${z.id}`}>
            <strong>{z.label}</strong>
            <ul>
              {by(z.id).length ? by(z.id).map((l) => <li key={l}>{l}</li>) : <li className="muted">Sin tareas</li>}
            </ul>
          </div>
        ))}
        <div className={`circuit__result ${assign.decision === 'ia' ? 'is-risk' : ''}`}>
          <span className="eyebrow">Resultado</span>
          <strong>Responde: {responsible}</strong>
        </div>
      </div>
      <ul className="circuit__notes">
        {warnings.map((w) => (
          <li key={w.text} className={`circuit__note is-${w.tone}`}>
            {w.text}
          </li>
        ))}
      </ul>
      <p className="muted">
        <Tag kind="simulacion" /> Consecuencias descriptivas escritas por el equipo, sin puntuación científica.
      </p>
    </figure>
  );
}

function Proposal() {
  const [open, setOpen] = useState(false);
  return (
    <div className="proposal">
      <button type="button" className="btn btn--small" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? 'Ocultar nuestra propuesta' : 'Ver nuestra propuesta para «Crear una campaña»'}
      </button>
      {open && (
        <div className="proposal__grid">
          <div>
            <strong>Personas</strong>
            <p>{PROPOSAL.personas}</p>
          </div>
          <div>
            <strong>IA</strong>
            <p>{PROPOSAL.ia}</p>
          </div>
          <div>
            <strong>Equipo</strong>
            <p>{PROPOSAL.equipo}</p>
          </div>
          <p className="proposal__end">
            <Tag kind="postura" /> {PROPOSAL.conclusion}
          </p>
        </div>
      )}
    </div>
  );
}
