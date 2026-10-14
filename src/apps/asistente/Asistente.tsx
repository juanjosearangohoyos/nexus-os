import { useEffect, useRef, useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useOS } from '../../components/os/OSContext';
import { Cite, RichText } from '../../components/ui/Cite';
import { CompletionBar, ExternalLink, Tag, WelcomeNote } from '../../components/ui/bits';
import { MEMBER } from '../../content/team';
import {
  AST_DEFINITION,
  AST_DISCLAIMER,
  AST_NARRATIVE,
  AST_PRINCIPLE,
  CAPABILITIES,
  CATEGORIES,
  CHECKLIST,
  IDEAS,
  LIMITS,
  NIST_TRAITS,
  QUERIES,
  type Category,
} from '../../content/asistente';
import { sfx } from '../../lib/sound';
import './asistente.css';

type QueryId = (typeof QUERIES)[number]['id'];
type Tab = 'demo' | 'definicion' | 'capacidades' | 'verificacion';

const DEEP_TABS: { id: Tab; label: string }[] = [
  { id: 'definicion', label: 'Definición OCDE' },
  { id: 'capacidades', label: 'Capacidades y límites' },
  { id: 'verificacion', label: 'Verificación (NIST)' },
];

export default function Asistente() {
  const [tab, setTab] = usePersistent<Tab>('asistente:tab', 'demo');
  const [tried, setTried] = usePersistent<QueryId[]>('asistente:tried', []);
  // Para la etapa basta con una consulta; las otras dos son exploración adicional.
  const done = tried.length >= 1;

  return (
    <div className="ast">
      <header className="ast__hero">
        <Orb />
        <div className="ast__hero-text">
          <p className="eyebrow">Inteligencia artificial</p>
          <h2>Poder responder no significa tener razón</h2>
          <p className="ast__lead">Podemos obtener una respuesta en segundos. Aun así, debemos comprobarla.</p>
          <div className="ast__badge" role="note">
            <Tag kind="simulacion">Simulación preprogramada, no IA conectada</Tag>
            <span>{AST_DISCLAIMER}</span>
          </div>
        </div>
        <div className="ast__welcome">
          <WelcomeNote initials="JR" title={MEMBER.JR.welcomeTitle} text={MEMBER.JR.welcomeText} />
        </div>
      </header>

      <div className="tabs ast__tabs" role="tablist" aria-label="Secciones del Asistente">
        <button type="button" role="tab" id="ast-tab-demo" aria-selected={tab === 'demo'} aria-controls="ast-panel-demo" onClick={() => setTab('demo')}>
          Demostración
        </button>
        <span className="ast__tabs-sep" aria-hidden="true">
          Comprender mejor:
        </span>
        {DEEP_TABS.map((t) => (
          <button key={t.id} type="button" role="tab" id={`ast-tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`ast-panel-${t.id}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="ast__panel" role="tabpanel" id={`ast-panel-${tab}`} aria-labelledby={`ast-tab-${tab}`}>
        {tab === 'demo' && <Demo tried={tried} onTry={(id) => setTried((t) => (t.includes(id) ? t : [...t, id]))} />}
        {tab === 'definicion' && <Definition />}
        {tab === 'capacidades' && <Capabilities />}
        {tab === 'verificacion' && <Verification />}
      </div>

      <div className="ast__footer">
        <CompletionBar app="asistente" done={done} principle={{ n: '03', text: AST_PRINCIPLE }} />
      </div>
    </div>
  );
}

const CHIP_HINT: Record<QueryId, string> = {
  organizar: 'Organizar no es decidir',
  verdad: 'Convincente frente a comprobada',
  titular: 'Sensacionalista frente a responsable',
};

function OecdButton() {
  const { openSource } = useOS();
  return (
    <button type="button" className="btn btn--ghost" onClick={() => openSource('oecd2024')}>
      Ver definición OCDE
    </button>
  );
}

function Orb({ thinking = false }: { thinking?: boolean }) {
  return (
    <div className={`orb ${thinking ? 'is-thinking' : ''}`} aria-hidden="true">
      <span className="orb__ring orb__ring--1" />
      <span className="orb__ring orb__ring--2" />
      <span className="orb__core" />
    </div>
  );
}

function Demo({ tried, onTry }: { tried: QueryId[]; onTry: (id: QueryId) => void }) {
  const [active, setActive] = useState<QueryId | null>(null);
  const [thinking, setThinking] = useState(false);
  const { reducedMotion } = useOS();
  const logRef = useRef<HTMLDivElement>(null);

  const run = (id: QueryId) => {
    setActive(id);
    setThinking(true);
    sfx.click();
    window.setTimeout(
      () => {
        setThinking(false);
        onTry(id);
        sfx.pulse();
      },
      reducedMotion ? 0 : 1100,
    );
  };

  useEffect(() => {
    logRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [active, thinking, reducedMotion]);

  const q = QUERIES.find((x) => x.id === active);

  return (
    <div className="demo">
      <p className="ast__muted">Elige una consulta: basta con una. Las respuestas fueron escritas por el equipo para mostrar capacidades y límites.</p>
      <div className="demo__chips">
        {QUERIES.map((x) => (
          <button key={x.id} type="button" className={`chip ${active === x.id ? 'is-on' : ''}`} onClick={() => run(x.id)}>
            <strong>{x.prompt}</strong>
            <span className="chip__hint">{CHIP_HINT[x.id]}</span>
            {tried.includes(x.id) && <span className="chip__seen" aria-label="probada"> ✓</span>}
          </button>
        ))}
      </div>

      <div className={`demo__log ${q ? '' : 'is-empty'}`} ref={logRef} aria-live="polite">
        {!q && <p className="demo__empty">La respuesta aparecerá aquí. Esta interfaz solo contiene tres respuestas preprogramadas.</p>}
        {q && (
          <>
            <div className="msg msg--user">
              <p>{q.prompt}</p>
              {q.id === 'verdad' && <p className="msg__claim">«{q.claim}»</p>}
              {q.id === 'organizar' && (
                <ul className="msg__ideas">
                  {IDEAS.map((i) => (
                    <li key={i.text}>{i.text}</li>
                  ))}
                </ul>
              )}
            </div>
            {thinking ? (
              <div className="msg msg--ai msg--thinking" aria-label="Generando respuesta simulada">
                <Orb thinking />
                <span>Generando respuesta simulada…</span>
              </div>
            ) : (
              <div className="msg msg--ai">
                <div className="msg__tag">
                  <Tag kind="simulacion">Respuesta preprogramada</Tag>
                </div>
                {q.id === 'organizar' && <Organize />}
                {q.id === 'verdad' && <Verify answer={q.answer} />}
                {q.id === 'titular' && <Headline sensational={q.sensational} responsible={q.responsible} />}
                <p className="msg__explain">
                  <Tag kind="postura" /> {q.explanation}
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {tried.length > 0 && tried.length < 3 && <p className="ast__muted">Consultas probadas: {tried.length} de 3. Las demás son opcionales.</p>}
    </div>
  );
}

function Organize() {
  const [mine, setMine] = usePersistent<Record<string, Category>>('asistente:mine', {});
  const differences = IDEAS.filter((i) => mine[i.text] && mine[i.text] !== i.suggested).length;
  return (
    <div className="organize">
      <p>Propongo agrupar las ideas en tres categorías. Puedes cambiar cualquier idea de grupo.</p>
      <div className="organize__cols">
        {CATEGORIES.map((c) => (
          <section key={c} className={`organize__col organize__col--${c === 'Comunicación' ? 'com' : c === 'Creación' ? 'cre' : 'col'}`}>
            <h4>{c}</h4>
            <ul>
              {IDEAS.filter((i) => (mine[i.text] ?? i.suggested) === c).map((i) => (
                <li key={i.text}>
                  <span>{i.text}</span>
                  <label className="sr-only" htmlFor={`cat-${i.text}`}>
                    Categoría de «{i.text}»
                  </label>
                  <select id={`cat-${i.text}`} value={mine[i.text] ?? i.suggested} onChange={(e) => setMine((m) => ({ ...m, [i.text]: e.target.value as Category }))}>
                    {CATEGORIES.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="organize__note" role="status">
        {differences === 0
          ? 'Usas la clasificación sugerida. ¿Responde al criterio de tu equipo?'
          : `Tu clasificación difiere de la sugerida en ${differences} ${differences === 1 ? 'idea' : 'ideas'}. Ninguna es la única correcta: depende del criterio que definan como equipo.`}
      </p>
    </div>
  );
}

function Verify({ answer }: { answer: string }) {
  const [checked, setChecked] = useState(false);
  const claim = QUERIES.find((q) => q.id === 'verdad')!;
  return (
    <div className="verify">
      <section className="verify__col verify__col--fluent">
        <p className="verify__kicker">Respuesta convincente</p>
        <p className="verify__claim">«{'claim' in claim ? claim.claim : ''}»</p>
        <p className="verify__answer">
          <strong>Asistente:</strong> {answer}
        </p>
      </section>
      <section className={`verify__col verify__col--checked ${checked ? 'is-open' : ''}`}>
        <p className="verify__kicker">Respuesta comprobada</p>
        {!checked ? (
          <>
            <p className="ast__muted">Todavía no consultamos ninguna fuente.</p>
            <button type="button" className="btn btn--small btn--primary" onClick={() => setChecked(true)}>
              Consultar la fuente original
            </button>
          </>
        ) : (
          <>
            <Tag kind="evidencia" />
            <p>
              La palabra «siempre» no resiste la evidencia: en un metaanálisis de 106 experimentos, las combinaciones humano-IA mostraron, en promedio, pérdidas en
              tareas de decisión y no superaron a la mejor alternativa por separado{' '}
              <Cite id="vaccaro2024" claim="Las combinaciones humano-IA mostraron pérdidas en tareas de decisión y no superaron, en promedio, a la mejor alternativa por separado." />.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

function Headline({ sensational, responsible }: { sensational: string; responsible: string }) {
  const [version, setVersion] = useState<'s' | 'r'>('s');
  return (
    <div className="headline">
      <div className="segmented" role="radiogroup" aria-label="Versión del titular">
        <button type="button" role="radio" aria-checked={version === 's'} className={version === 's' ? 'is-on' : ''} onClick={() => setVersion('s')}>
          Versión sensacionalista
        </button>
        <button type="button" role="radio" aria-checked={version === 'r'} className={version === 'r' ? 'is-on' : ''} onClick={() => setVersion('r')}>
          Versión responsable
        </button>
      </div>
      <article className={`headline__card headline__card--${version}`}>
        <p className="headline__kicker">{version === 's' ? 'TENDENCIA · CIENCIA' : 'Investigación · Nature Human Behaviour'}</p>
        <h4>{version === 's' ? sensational : responsible}</h4>
      </article>
      <ul className="headline__notes">
        {version === 's' ? (
          <>
            <li>Generaliza: convierte un resultado matizado en una conclusión absoluta.</li>
            <li>Atribuye a «la ciencia» sin identificar estudio, autores ni fecha.</li>
            <li>Busca reacción emocional antes que comprensión.</li>
          </>
        ) : (
          <>
            <li>Identifica el tipo de estudio y su alcance (106 experimentos).</li>
            <li>Conserva el matiz: «no siempre» en lugar de «nunca» o «siempre».</li>
            <li>
              Permite verificar la fuente: <Cite id="vaccaro2024" narrative />.
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

function Definition() {
  return (
    <div className="ast__grid">
      <article className="card">
        <Tag kind="evidencia" />
        <h3>¿Qué es un sistema de IA?</h3>
        <p>
          <RichText value={AST_DEFINITION} />
        </p>
      </article>
      <figure className="flow" aria-label="Flujo de un sistema de IA: entradas, inferencia, resultados y verificación humana">
        <div className="flow__step">
          <span className="flow__n">1</span>
          <strong>Entradas</strong>
          <span>Datos, texto, imágenes o instrucciones.</span>
        </div>
        <span className="flow__arrow" aria-hidden="true">→</span>
        <div className="flow__step flow__step--core">
          <span className="flow__n">2</span>
          <strong>Inferencia</strong>
          <span>Para objetivos explícitos o implícitos, con distinta autonomía y adaptabilidad.</span>
        </div>
        <span className="flow__arrow" aria-hidden="true">→</span>
        <div className="flow__step">
          <span className="flow__n">3</span>
          <strong>Resultados</strong>
          <span>Predicciones, contenidos, recomendaciones o decisiones.</span>
        </div>
        <span className="flow__arrow" aria-hidden="true">→</span>
        <div className="flow__step flow__step--human">
          <span className="flow__n">4</span>
          <strong>Verificación</strong>
          <span>Nuestra propuesta: evaluar el resultado antes de usarlo.</span>
        </div>
        <figcaption className="ast__muted">
          <OecdButton />{' '}
          Pasos 1 a 3: elaborados a partir de <Cite id="oecd2024" />. Paso 4: postura del equipo.
        </figcaption>
      </figure>
      <article className="card">
        <Tag kind="postura" />
        <p>
          <RichText value={AST_NARRATIVE} />
        </p>
      </article>
    </div>
  );
}

function Capabilities() {
  return (
    <div className="caps">
      <section>
        <h3 className="caps__h caps__h--yes">Capacidades</h3>
        <ul className="caps__list">
          {CAPABILITIES.map((c) => (
            <li key={c.t}>
              <strong>{c.t}</strong>
              <span>{c.d}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="caps__h caps__h--no">Límites</h3>
        <ul className="caps__list caps__list--limits">
          {LIMITS.map((c) => (
            <li key={c.t}>
              <strong>{c.t}</strong>
              <span>{c.d}</span>
            </li>
          ))}
        </ul>
      </section>
      <p className="ast__muted caps__src">
        Síntesis del equipo a partir de <Cite id="nist2023" /> y <Cite id="ep2025" />.
      </p>
    </div>
  );
}

function Verification() {
  const [checks, setChecks] = usePersistent<boolean[]>('asistente:checks', CHECKLIST.map(() => false));
  const count = checks.filter(Boolean).length;
  return (
    <div className="ast__grid">
      <article className="card">
        <Tag kind="evidencia" />
        <h3>Una IA confiable, según el NIST</h3>
        <p>
          El marco de gestión de riesgos del NIST describe siete características de los sistemas de IA confiables <Cite id="nist2023" />:
        </p>
        <ul className="traits">
          {NIST_TRAITS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </article>
      <article className="card">
        <Tag kind="principio">Lista de verificación del equipo</Tag>
        <p>Antes de usar una respuesta generada, nos hacemos estas preguntas:</p>
        <ul className="checklist">
          {CHECKLIST.map((c, i) => (
            <li key={c}>
              <label>
                <input type="checkbox" checked={checks[i] ?? false} onChange={(e) => setChecks((arr) => arr.map((v, k) => (k === i ? e.target.checked : v)))} />
                <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
        <ExternalLink href="https://doi.org/10.6028/NIST.AI.100-1">Abrir el marco del NIST</ExternalLink>
        <p className="ast__muted" role="status">
          {count === CHECKLIST.length ? 'Revisaste las cinco preguntas. Ahora la decisión es tuya, no del sistema.' : `${count} de ${CHECKLIST.length} preguntas revisadas.`}
        </p>
      </article>
    </div>
  );
}
