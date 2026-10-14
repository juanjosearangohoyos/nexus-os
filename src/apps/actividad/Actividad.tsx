import { useEffect } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { RichText } from '../../components/ui/Cite';
import { CompletionBar, Deeper, Tag } from '../../components/ui/bits';
import { TENSIONS, type Tension } from '../../content/actividad';
import { stageOf } from '../../content/tour';
import { sfx } from '../../lib/sound';
import { Scenario } from './Scenarios';
import './actividad.css';

type Filter = 'Todos' | Tension['domain'];
const FILTERS: Filter[] = ['Todos', 'Comunicación', 'Creatividad', 'Colaboración', 'Transversal'];
/** Caso representativo para el recorrido esencial. */
const TOUR_CASE = 'decisiones';

export default function Actividad() {
  const [filter, setFilter] = usePersistent<Filter>('actividad:filter', 'Todos');
  const [selected, setSelected] = usePersistent<string>('actividad:sel', TOUR_CASE);
  const [seen, setSeen] = usePersistent<string[]>('actividad:seen', []);
  const [mitigation, setMitigation] = usePersistent<Record<string, boolean>>('actividad:mit', {});
  const intent = useIntent('actividad');
  const { openApp, state } = useOS();
  const inTour = state.tour.active && state.tour.index === stageOf('actividad');

  // Un único estado derivado: el caso mostrado SIEMPRE pertenece al filtro vigente.
  const rows = TENSIONS.filter((x) => filter === 'Todos' || x.domain === filter);
  const t = rows.find((x) => x.id === selected) ?? rows[0] ?? null;

  // Si el caso guardado no pertenece al filtro, se selecciona el primero válido.
  useEffect(() => {
    if (t && t.id !== selected) setSelected(t.id);
  }, [t, selected, setSelected]);

  // Abrir un caso concreto desde otra app (buscador, Noticias): se muestra sin filtro.
  useEffect(() => {
    if (intent && TENSIONS.some((x) => x.id === intent.value)) {
      setFilter('Todos');
      setSelected(intent.value);
    }
  }, [intent, setFilter, setSelected]);

  useEffect(() => {
    if (t) setSeen((s) => (s.includes(t.id) ? s : [...s, t.id]));
  }, [t, setSeen]);

  const choose = (id: string) => {
    setSelected(id);
    sfx.click();
  };
  const changeFilter = (f: Filter) => {
    setFilter(f);
    const first = TENSIONS.find((x) => (f === 'Todos' || x.domain === f) && x.id === selected) ?? TENSIONS.find((x) => f === 'Todos' || x.domain === f);
    if (first) setSelected(first.id);
  };

  const on = t ? Boolean(mitigation[t.id]) : false;
  const activeMeasures = TENSIONS.filter((x) => mitigation[x.id]).length;

  return (
    <div className="act">
      <header className="act__toolbar">
        <div>
          <p className="eyebrow">Monitor de oportunidades y riesgos</p>
          <h2>Cada oportunidad trae una vulnerabilidad. Elige un caso y activa su medida.</h2>
        </div>
        <div className="segmented act__filters" role="radiogroup" aria-label="Filtrar por ámbito">
          {FILTERS.map((f) => (
            <button key={f} type="button" role="radio" aria-checked={filter === f} className={filter === f ? 'is-on' : ''} onClick={() => changeFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </header>

      {inTour && (
        <p className="act__tour" role="note">
          <strong>Para esta etapa basta con un caso.</strong> En «Decisiones asistidas», activa la medida y compara los dos escenarios. Los otros seis riesgos
          quedan para profundizar.
          {t?.id !== TOUR_CASE && (
            <button type="button" className="link-btn" onClick={() => { setFilter('Todos'); setSelected(TOUR_CASE); }}>
              Ir al caso
            </button>
          )}
        </p>
      )}

      <div className="act__layout">
        <div className="act__table-wrap">
          <table className="act__table">
            <caption className="sr-only">Tensiones entre oportunidades y riesgos{filter !== 'Todos' ? ` · ámbito ${filter}` : ''}</caption>
            <thead>
              <tr>
                <th scope="col">Oportunidad</th>
                <th scope="col">Riesgo asociado</th>
                <th scope="col">Ámbito</th>
                <th scope="col">Medida</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="act__empty">
                    No hay casos en este ámbito.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className={r.id === t?.id ? 'is-sel' : ''} onClick={() => choose(r.id)}>
                  <td>
                    <button type="button" className="act__row-btn" aria-pressed={r.id === t?.id} onClick={(e) => { e.stopPropagation(); choose(r.id); }}>
                      <span className={`act__dot ${seen.includes(r.id) ? 'is-seen' : ''}`} aria-hidden="true" />
                      {r.opportunity}
                    </button>
                  </td>
                  <td>{r.risk}</td>
                  <td>{r.domain}</td>
                  <td>
                    <span className={`act__state ${mitigation[r.id] ? 'is-on' : ''}`}>{mitigation[r.id] ? 'Activada' : 'Desactivada'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="act__note">
            <Tag kind="simulacion">Simulación didáctica</Tag> Escenarios cualitativos: no son métricas reales, probabilidades ni datos tuyos.
          </p>
        </div>

        {t ? (
          <section className="act__detail" aria-labelledby="act-title" key={t.id}>
            <header className="act__detail-head">
              <h3 id="act-title">
                {t.opportunity} <span className="act__vs">↔</span> {t.risk}
              </h3>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                className="act__switch"
                onClick={() => {
                  setMitigation((m) => ({ ...m, [t.id]: !on }));
                  if (on) sfx.toggleOff();
                  else sfx.toggleOn();
                }}
              >
                <span>Medida: {on ? 'activada' : 'desactivada'}</span>
                <span className="switch" aria-hidden="true">
                  <span className="switch__knob" />
                </span>
              </button>
            </header>

            <div className="act__grid">
              <figure className="act__viz">
                <figcaption>
                  Escenario {on ? 'con medida' : 'sin medida'} · <span className="act__viz-sub">ilustración cualitativa</span>
                </figcaption>
                <Scenario id={t.id} on={on} />
                <p className={`act__outcome ${on ? 'is-on' : ''}`} aria-live="polite">
                  {on ? t.withMeasure : t.withoutMeasure}
                </p>
              </figure>

              <div className="act__side">
                <article className="act__panel act__panel--opp">
                  <h4>Oportunidad</h4>
                  <ul>
                    {t.favorable.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </article>
                <article className="act__panel act__panel--risk">
                  <h4>Riesgo</h4>
                  <ul>
                    {t.adverse.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </article>
                <article className="act__panel act__panel--measure">
                  <h4>Medida: {t.measure}</h4>
                  <ol>
                    {t.measureSteps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  {t.id === 'automatizacion' && <p className="callout">Este resultado no garantiza una mejora en todas las tareas.</p>}
                  <button type="button" className="link-btn" onClick={() => openApp('documentos', `p${t.principle}`)}>
                    Postulado {t.principle} del manifiesto →
                  </button>
                </article>
              </div>
            </div>

            <Deeper title="Ver evidencia" hint="Qué dicen las fuentes sobre esta oportunidad y este riesgo">
              <p>
                <Tag kind="evidencia">Oportunidad</Tag> <RichText value={t.opportunityDetail} />
              </p>
              <p>
                <Tag kind="evidencia">Riesgo</Tag> <RichText value={t.riskDetail} />
              </p>
            </Deeper>
          </section>
        ) : (
          <section className="act__detail act__detail--empty">
            <p>Selecciona otro ámbito para ver sus casos.</p>
          </section>
        )}
      </div>

      <p className="muted">
        Casos revisados: {seen.length} de {TENSIONS.length} · Medidas activadas: {activeMeasures} de {TENSIONS.length}
      </p>
      <CompletionBar app="actividad" done={activeMeasures > 0} />
    </div>
  );
}
