import { useEffect, useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { RichText } from '../../components/ui/Cite';
import { CompletionBar, Deeper, Tag } from '../../components/ui/bits';
import { VideoPlayer } from '../../components/ui/VideoPlayer';
import { COLABORAR, COLLAB_FEEDBACK, COLLAB_TASKS, COMUNICAR, CREAR, LAYERS, OWNERS, PIZ_INTRO, PIZ_VIDEO, type CollabOwner, type CollabTask, type LayerId } from '../../content/pizarra';
import { PRINCIPLES } from '../../content/manifesto';
import { sfx } from '../../lib/sound';
import './pizarra.css';

type Canvas = 'comunicar' | 'crear' | 'colaborar';
const CANVASES: { id: Canvas; label: string; color: string }[] = [
  { id: 'comunicar', label: 'Comunicar', color: '#5CC8FF' },
  { id: 'crear', label: 'Crear', color: '#FF8A2A' },
  { id: 'colaborar', label: 'Colaborar', color: '#2EE6C9' },
];

export default function Pizarra() {
  const [canvas, setCanvas] = usePersistent<Canvas>('pizarra:canvas', 'comunicar');
  const [originsSeen, setOriginsSeen] = usePersistent<string[]>('pizarra:origins', []);
  const [layers, setLayers] = usePersistent<LayerId[]>('pizarra:layers', []);
  const [owners, setOwners] = usePersistent<Partial<Record<CollabTask, CollabOwner>>>('pizarra:owners', {});
  const intent = useIntent('pizarra');

  useEffect(() => {
    if (intent && CANVASES.some((c) => c.id === intent.value)) setCanvas(intent.value as Canvas);
  }, [intent, setCanvas]);

  const doneCom = originsSeen.length >= 3;
  const doneCre = layers.length === LAYERS.length;
  const doneCol = COLLAB_TASKS.every((t) => owners[t.id]);
  const status: Record<Canvas, boolean> = { comunicar: doneCom, crear: doneCre, colaborar: doneCol };

  return (
    <div className="piz">
      <header className="piz__head">
        <div>
          <p className="eyebrow">Comunicación · Creatividad · Colaboración</p>
          <h2>{PIZ_INTRO}</h2>
          <p className="piz__hint">Basta con un lienzo; los otros dos son opcionales.</p>
        </div>
        <div className="piz__tabs" role="tablist" aria-label="Lienzos">
          {CANVASES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={canvas === c.id}
              id={`piz-tab-${c.id}`}
              aria-controls="piz-panel"
              className={`piz__tab ${canvas === c.id ? 'is-on' : ''}`}
              style={{ ['--c' as string]: c.color }}
              onClick={() => setCanvas(c.id)}
            >
              <span className="piz__tab-dot" aria-hidden="true" />
              {c.label}
              {status[c.id] && <span aria-label="completado"> ✓</span>}
            </button>
          ))}
        </div>
      </header>

      <div className="piz__board" role="tabpanel" id="piz-panel" aria-labelledby={`piz-tab-${canvas}`}>
        {canvas === 'comunicar' && <Communicate seen={originsSeen} onSee={(o) => setOriginsSeen((s) => (s.includes(o) ? s : [...s, o]))} />}
        {canvas === 'crear' && <Create layers={layers} setLayers={setLayers} />}
        {canvas === 'colaborar' && <Collaborate owners={owners} setOwners={setOwners} />}
      </div>

      <div className="piz__foot">
        <CompletionBar app="pizarra" done={doneCom || doneCre || doneCol} />
      </div>
    </div>
  );
}

function CanvasFrame({ message, question, evidence, reflection, principle, children }: { message: string; question: string; evidence: Parameters<typeof RichText>[0]['value']; reflection: string; principle: string; children: React.ReactNode }) {
  const { openApp } = useOS();
  const p = PRINCIPLES.find((x) => x.n === principle)!;
  return (
    <div className="canvas">
      <div className="canvas__main">{children}</div>
      <aside className="canvas__aside" aria-label="Pregunta y fundamentos">
        <p className="canvas__message">{message}</p>
        <p className="canvas__question">
          <span className="canvas__q-label">Pregunta crítica</span>
          {question}
        </p>
        <article className="canvas__reflection">
          <Tag kind="postura">Reflexión del equipo</Tag>
          <p>{reflection}</p>
        </article>
        <Deeper title="Ver evidencia" hint="Fuente y alcance">
          <p>
            <Tag kind="evidencia" /> <RichText value={evidence} />
          </p>
        </Deeper>
        <button type="button" className="link-btn canvas__principle" onClick={() => openApp('documentos', `p${p.n}`)}>
          Postulado {p.n} · {p.title} →
        </button>
      </aside>
    </div>
  );
}

function Communicate({ seen, onSee }: { seen: string[]; onSee: (o: string) => void }) {
  const [origin, setOrigin] = useState<string>(seen[seen.length - 1] ?? 'humano');
  const [signals, setSignals] = useState(false);
  const o = COMUNICAR.origins.find((x) => x.id === origin)!;
  useEffect(() => onSee(origin), [origin, onSee]);

  return (
    <CanvasFrame {...COMUNICAR}>
      <section className="canvas__block">
        <h3 className="canvas__h">1 · ¿De dónde viene este mensaje?</h3>
        <p className="muted">Ejemplo ficticio. Cambia el origen y observa qué información acompaña al mismo texto.</p>
        <div className="segmented" role="radiogroup" aria-label="Origen del mensaje">
          {COMUNICAR.origins.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={origin === x.id} className={origin === x.id ? 'is-on' : ''} onClick={() => { setOrigin(x.id); sfx.click(); }}>
              {x.label}
            </button>
          ))}
        </div>
        <div className={`post post--${origin}`}>
          <div className="post__card">
            <p className="post__from">{origin === 'sinetiqueta' ? 'Cuenta sin identificar' : 'Biblioteca · Universidad (ejemplo)'}</p>
            <p className="post__text">{COMUNICAR.sample}</p>
            {o.badge && (
              <p className={`post__label ${origin === 'etiquetado' ? 'is-ai' : ''}`}>
                {origin === 'etiquetado' ? '✦ ' : '✓ '}
                {o.badge}
              </p>
            )}
          </div>
          <dl className="post__meta">
            {o.meta.map(([k, v]) => (
              <div key={k} className={['Desconocida', 'No indicada', 'No declarado'].includes(v) ? 'is-unknown' : ''}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="canvas__insight">{COMUNICAR.sameText}</p>
        <p className="muted">Orígenes revisados: {seen.length} de 3.</p>
      </section>

      <section className="canvas__block">
        <h3 className="canvas__h">2 · Comunicación fiable o sensacionalista</h3>
        <div className="compare">
          <article className="compare__item compare__item--ok">
            <p className="compare__kicker">Fiable</p>
            <p>{COMUNICAR.reliable.text}</p>
            {signals && (
              <ul>
                {COMUNICAR.reliable.signals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </article>
          <article className="compare__item compare__item--bad">
            <p className="compare__kicker">Sensacionalista</p>
            <p>{COMUNICAR.sensational.text}</p>
            {signals && (
              <ul>
                {COMUNICAR.sensational.signals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </article>
        </div>
        <button type="button" className="btn btn--small" aria-pressed={signals} onClick={() => setSignals((v) => !v)}>
          {signals ? 'Ocultar señales' : 'Mostrar señales de contexto'}
        </button>
        <p className="canvas__insight">La confianza no depende del tono del mensaje, sino de que podamos saber quién informa y comprobarlo.</p>
      </section>
    </CanvasFrame>
  );
}

function Create({ layers, setLayers }: { layers: LayerId[]; setLayers: (v: LayerId[] | ((p: LayerId[]) => LayerId[])) => void }) {
  const on = (id: LayerId) => layers.includes(id);
  const toggle = (id: LayerId) => {
    setLayers((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
    sfx.click();
  };
  return (
    <CanvasFrame {...CREAR}>
      <section className="canvas__block creator">
        <div className="creator__layers" role="group" aria-label="Capas de la pieza">
          <h3 className="canvas__h">Capas de la pieza</h3>
          {LAYERS.map((l) => (
            <button key={l.id} type="button" role="switch" aria-checked={on(l.id)} className="layer" onClick={() => toggle(l.id)}>
              <span className="switch" aria-hidden="true">
                <span className="switch__knob" />
              </span>
              <span className="layer__text">
                <strong>{l.label}</strong>
                <span>{l.who}</span>
              </span>
            </button>
          ))}
          <button type="button" className="btn btn--small" onClick={() => setLayers([])}>
            Vaciar lienzo
          </button>
        </div>

        <div className="creator__stage-wrap">
          <svg className={`creator__stage ${on('edicion') ? 'is-graded' : ''}`} viewBox="0 0 640 360" role="img" aria-label={`Mini pieza audiovisual con ${layers.length} de ${LAYERS.length} capas activas.`}>
            <defs>
              <linearGradient id="stageBg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={on('edicion') ? '#0C142A' : '#20273a'} />
                <stop offset="1" stopColor={on('edicion') ? '#2a1d5c' : '#2b3247'} />
              </linearGradient>
              <radialGradient id="genA">
                <stop offset="0" stopColor="#FF8A2A" stopOpacity="0.9" />
                <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="genB">
                <stop offset="0" stopColor="#9B5CFF" stopOpacity="0.9" />
                <stop offset="1" stopColor="#9B5CFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="640" height="360" fill="url(#stageBg)" />
            {layers.length === 0 && (
              <text x="320" y="185" textAnchor="middle" className="stage__empty">
                Lienzo vacío: activa una capa
              </text>
            )}
            {on('generada') && (
              <g className="stage__gen">
                {Array.from({ length: 26 }).map((_, i) => (
                  <circle key={i} cx={60 + ((i * 97) % 540)} cy={50 + ((i * 53) % 260)} r={18 + (i % 5) * 8} fill={i % 2 ? 'url(#genA)' : 'url(#genB)'} opacity={on('revision') && i % 4 === 0 ? 0.15 : 0.75} />
                ))}
                <rect x="470" y="14" width="156" height="24" rx="12" className="stage__ai-tag" />
                <text x="548" y="30" textAnchor="middle" className="stage__ai-text">
                  Generado con IA (simulado)
                </text>
              </g>
            )}
            {on('idea') && (
              <g className="stage__idea">
                <path d="M90 250 C150 140 210 300 280 190" />
                <path d="M560 250 C500 140 430 300 360 190" />
                <circle cx="320" cy="190" r="26" />
                <text x="24" y="292" className="stage__note">
                  Idea: dos redes que se encuentran
                </text>
              </g>
            )}
            {on('revision') && (
              <g className="stage__review">
                <circle cx="157" cy="103" r="34" />
                <text x="200" y="98">Quitar</text>
                <circle cx="320" cy="190" r="44" />
                <text x="372" y="160">Mantener</text>
                <path d="M430 300 l40 -20" />
                <text x="476" y="282">Ajustar color</text>
              </g>
            )}
            {on('edicion') && (
              <g className="stage__final">
                <text x="320" y="62" textAnchor="middle" className="stage__title">
                  Diferentes formas de pensar
                </text>
                <text x="320" y="90" textAnchor="middle" className="stage__subtitle">
                  Una nueva forma de crear
                </text>
              </g>
            )}
            {on('creditos') && (
              <g className="stage__credits">
                <rect x="0" y="306" width="640" height="54" />
                <text x="16" y="327">Idea: V. Giraldo y S. Camacho · Variaciones: herramienta generativa (simulada)</text>
                <text x="16" y="346">Revisión: J. Román y J. J. Arango · Edición: S. Camacho · Licencia: uso académico</text>
              </g>
            )}
          </svg>
          <ol className="creator__log" aria-label="Registro del proceso">
            {layers.length === 0 && <li className="muted">El registro del proceso aparecerá aquí.</li>}
            {layers.map((id) => {
              const l = LAYERS.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <strong>{l.label}</strong> — {l.log}
                </li>
              );
            })}
          </ol>
          {layers.length === LAYERS.length && <p className="canvas__insight">La intervención humana es visible: el registro muestra quién imaginó, seleccionó, editó y respondió por la versión final.</p>}
        </div>
      </section>

      <section className="canvas__block">
        <h3 className="canvas__h">Pieza audiovisual del proyecto</h3>
        <VideoPlayer {...PIZ_VIDEO} />
      </section>
    </CanvasFrame>
  );
}

function Collaborate({ owners, setOwners }: { owners: Partial<Record<CollabTask, CollabOwner>>; setOwners: (v: Partial<Record<CollabTask, CollabOwner>> | ((p: Partial<Record<CollabTask, CollabOwner>>) => Partial<Record<CollabTask, CollabOwner>>)) => void }) {
  const all = COLLAB_TASKS.every((t) => owners[t.id]);
  return (
    <CanvasFrame {...COLABORAR}>
      <section className="canvas__block">
        <h3 className="canvas__h">Asigna las cuatro tareas</h3>
        <ul className="collab">
          {COLLAB_TASKS.map((t) => (
            <li key={t.id} className="collab__row">
              <span className="collab__task">{t.label}</span>
              <div className="segmented" role="radiogroup" aria-label={`Responsable de ${t.label}`}>
                {OWNERS.map((o) => (
                  <button key={o.id} type="button" role="radio" aria-checked={owners[t.id] === o.id} className={owners[t.id] === o.id ? 'is-on' : ''} onClick={() => { setOwners((p) => ({ ...p, [t.id]: o.id })); sfx.click(); }}>
                    {o.label}
                  </button>
                ))}
              </div>
              <p className={`collab__why ${owners[t.id] ? `is-${owners[t.id]}` : ''}`} aria-live="polite">
                {owners[t.id] ? COLLAB_FEEDBACK[t.id][owners[t.id]!] : 'Elige quién se encarga.'}
              </p>
            </li>
          ))}
        </ul>
        {all && (
          <div className="resp-map" role="table" aria-label="Mapa de responsabilidades">
            <div className="resp-map__row resp-map__row--head" role="row">
              <span role="columnheader">Tarea</span>
              <span role="columnheader">Responsable</span>
              <span role="columnheader">Quién revisa</span>
            </div>
            {COLLAB_TASKS.map((t) => {
              const o = OWNERS.find((x) => x.id === owners[t.id])!;
              const risky = t.id === 'aprobar' && o.id === 'sistema';
              return (
                <div key={t.id} className={`resp-map__row ${risky ? 'is-risk' : ''}`} role="row">
                  <span role="cell">{t.label}</span>
                  <span role="cell">{o.label}</span>
                  <span role="cell">{risky ? 'Nadie responde por la publicación: asigna la aprobación a una persona o al equipo.' : o.reviewer}</span>
                </div>
              );
            })}
            <p className="resp-map__note">No hay una única combinación correcta: depende de la tarea, del riesgo y de quién puede responder por el resultado.</p>
          </div>
        )}
      </section>
    </CanvasFrame>
  );
}
