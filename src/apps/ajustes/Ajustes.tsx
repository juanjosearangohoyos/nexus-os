import { useEffect, useRef, useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { Cite } from '../../components/ui/Cite';
import { CompletionBar, Tag, WelcomeNote } from '../../components/ui/bits';
import { SETTINGS, type EthicSetting } from '../../content/ajustes';
import { MEMBER } from '../../content/team';
import { sfx } from '../../lib/sound';
import './ajustes.css';

type StageId = EthicSetting['stage'];

const ALL_ON = Object.fromEntries(SETTINGS.map((s) => [s.id, true])) as Record<string, boolean>;
const STAGES: { id: StageId; label: string; desc: string }[] = [
  { id: 'datos', label: 'Datos', desc: 'Qué información usamos y cómo la protegemos.' },
  { id: 'creacion', label: 'Creación', desc: 'Cómo se produce la pieza y quién participa.' },
  { id: 'revision', label: 'Revisión', desc: 'Quién comprueba, cuestiona y corrige.' },
  { id: 'publicacion', label: 'Publicación', desc: 'Qué se declara al público y quién responde.' },
];

export default function Ajustes() {
  const [values, setValues] = usePersistent<Record<string, boolean>>('ajustes:values', ALL_ON);
  const [experimented, setExperimented] = usePersistent('ajustes:experimented', false);
  const [, setReviewed] = usePersistent('ajustes:reviewed', false);
  const [message, setMessage] = useState<string>('Los ocho compromisos están activados. Desactiva uno para ver en qué etapa del flujo aparece su consecuencia.');
  const [focusStage, setFocusStage] = useState<StageId | null>(null);
  const [report, setReport] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const intent = useIntent('ajustes');
  const { openApp } = useOS();
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    if (!intent) return;
    setHighlight(intent.value);
    rowRefs.current[intent.value]?.scrollIntoView({ block: 'center' });
  }, [intent]);

  const off = SETTINGS.filter((s) => !values[s.id]);
  const allOn = off.length === 0;

  const toggle = (s: EthicSetting) => {
    const next = !values[s.id];
    setValues((v) => ({ ...v, [s.id]: next }));
    setHighlight(s.id);
    if (next) {
      sfx.toggleOn();
      setFocusStage(null);
      setMessage(`Activaste «${s.label}». ${s.on}`);
    } else {
      sfx.alert();
      setExperimented(true);
      setFocusStage(s.stage);
      setMessage(`Desactivaste «${s.label}». En la etapa de ${STAGES.find((x) => x.id === s.stage)!.label.toLowerCase()}: ${s.off.charAt(0).toLowerCase()}${s.off.slice(1)}`);
    }
  };

  const restore = () => {
    setValues(ALL_ON);
    setFocusStage(null);
    sfx.success();
    setMessage('Restauraste nuestras ocho prioridades. Esto no certifica que el sistema sea ético: nos compromete a comprobarlo.');
  };

  return (
    <div className="set">
      <header className="set__head">
        <div>
          <p className="eyebrow">Ajustes · Compromisos éticos</p>
          <h2>La ética no es un complemento opcional. Es la configuración que debemos justificar.</h2>
          <p className="set__lead">Desactiva un compromiso y observa en qué etapa del flujo de publicación aparece la consecuencia. Con una basta.</p>
          <div className="set__note" role="note">
            <Tag kind="simulacion" />
            <span>Los interruptores solo cambian una visualización educativa. No modifican el mundo ni declaran que un sistema sea seguro.</span>
          </div>
        </div>
        <WelcomeNote initials="JJ" title={MEMBER.JJ.welcomeTitle} text={MEMBER.JJ.welcomeText} />
      </header>

      <div className="set__grid">
        <div className="set__switches">
          {STAGES.map((st, si) => {
            const items = SETTINGS.filter((s) => s.stage === st.id);
            return (
              <section key={st.id} className={`set__group ${focusStage === st.id ? 'is-focus' : ''}`} aria-labelledby={`set-g-${st.id}`}>
                <h3 id={`set-g-${st.id}`} className="set__group-title">
                  <span className="set__group-n">{si + 1}</span> {st.label}
                  <span className="set__group-desc">{st.desc}</span>
                </h3>
                <ul className="set__list">
                  {items.map((s) => {
                    const on = values[s.id];
                    return (
                      <li
                        key={s.id}
                        ref={(el) => {
                          rowRefs.current[s.id] = el;
                        }}
                        className={`set__row ${on ? '' : 'is-off'} ${highlight === s.id ? 'is-highlight' : ''}`}
                      >
                        <div className="set__row-main">
                          <div>
                            <p className="set__label">{s.label}</p>
                            <p className="set__state">{on ? s.on : s.off}</p>
                          </div>
                          <button type="button" role="switch" aria-checked={on} aria-label={s.label} className="set__switch" onClick={() => toggle(s)}>
                            <span className="set__switch-text" aria-hidden="true">
                              {on ? 'Activado' : 'Desactivado'}
                            </span>
                            <span className="switch" aria-hidden="true">
                              <span className="switch__knob" />
                            </span>
                          </button>
                        </div>
                        {!on && <p className="set__detail">{s.offDetail}</p>}
                        <p className="set__grounds">
                          Fundamento:{' '}
                          {s.grounds.map((g, i) => (
                            <span key={g}>
                              {i > 0 && '; '}
                              <Cite id={g} />
                            </span>
                          ))}
                          {' · '}
                          <button type="button" className="link-btn" onClick={() => openApp('documentos', `p${s.principle}`)}>
                            Postulado {s.principle}
                          </button>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <aside className="set__panel" aria-label="Consecuencias en el flujo">
          <Pipeline values={values} focus={focusStage} />

          <p className={`set__message ${allOn ? '' : 'is-warn'}`} role="status" aria-live="polite">
            {message}
          </p>

          <div className="set__actions">
            <button type="button" className="btn btn--primary" onClick={restore} disabled={allOn}>
              Restaurar los ocho compromisos
            </button>
            <button
              type="button"
              className="btn"
              aria-expanded={report}
              onClick={() => {
                setReport((r) => !r);
                setReviewed(true);
                sfx.click();
              }}
            >
              {report ? 'Ocultar informe' : 'Ver informe de configuración'}
            </button>
          </div>

          {report && (
            <section className="set__report" aria-labelledby="report-title">
              <h3 id="report-title">Informe de configuración</h3>
              {allOn ? (
                <p>Los ocho compromisos están activados en la simulación. Esto no certifica que un sistema sea ético: nos compromete a comprobarlo.</p>
              ) : (
                <>
                  <p>
                    {off.length === 1 ? 'Hay 1 compromiso pendiente' : `Hay ${off.length} compromisos pendientes`}. Consecuencias cualitativas que describe la simulación:
                  </p>
                  <ul>
                    {off.map((s) => (
                      <li key={s.id}>
                        <strong>{s.label}.</strong> {s.offDetail}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          <CompletionBar app="ajustes" done={experimented} />
        </aside>
      </div>
    </div>
  );
}

function Pipeline({ values, focus }: { values: Record<string, boolean>; focus: StageId | null }) {
  return (
    <figure className="pipe" aria-label="Simulación: flujo de publicación de una pieza de campaña universitaria">
      <figcaption className="pipe__cap">Simulación · Flujo de publicación de una pieza de campaña universitaria</figcaption>
      <ol className="pipe__stages">
        {STAGES.map((st, i) => {
          const issues = SETTINGS.filter((s) => s.stage === st.id && !values[s.id]);
          return (
            <li key={st.id} className={`pipe__stage ${issues.length ? 'has-issue' : ''} ${focus === st.id ? 'is-focus' : ''}`}>
              <span className="pipe__dot" aria-hidden="true">
                {issues.length ? '!' : '✓'}
              </span>
              <span className="pipe__body">
                <span className="pipe__name">
                  {i + 1}. {st.label}
                </span>
                <span className="pipe__status">{issues.length ? `Falla: ${issues.length} compromiso${issues.length > 1 ? 's' : ''} desactivado${issues.length > 1 ? 's' : ''}` : 'Sin alertas'}</span>
                {issues.map((x) => (
                  <span key={x.id} className="pipe__issue">
                    {x.label}
                  </span>
                ))}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="set__final">Las decisiones tecnológicas son también decisiones sociales.</p>
    </figure>
  );
}
