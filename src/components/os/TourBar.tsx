import { useOS } from './OSContext';
import { APP_BY_ID } from '../../content/apps';
import { TOUR_STAGES } from '../../content/tour';
import { asset } from '../../lib/useMedia';

/** Isla del recorrido esencial (seis etapas). No bloquea la exploración libre. */
export function TourBar() {
  const { state, tourGo, endTour, openApp, toDesktop } = useOS();
  if (!state.tour.active) return null;
  const i = state.tour.index;
  const stage = TOUR_STAGES[i];
  const last = i === TOUR_STAGES.length - 1;
  return (
    <div className="tourbar" role="region" aria-label="Recorrido esencial">
      <ol className="tourbar__steps" aria-label="Etapas">
        {TOUR_STAGES.map((s, k) => (
          <li key={s.verb}>
            <button
              type="button"
              className={`tourbar__step ${k === i ? 'is-current' : ''} ${state.stagesSeen.includes(k) ? 'is-seen' : ''}`}
              onClick={() => tourGo(k)}
              aria-label={`Etapa ${k + 1}: ${s.verb}`}
              aria-current={k === i ? 'step' : undefined}
              title={`Etapa ${k + 1} · ${s.verb}`}
            >
              {k + 1}
            </button>
          </li>
        ))}
      </ol>
      <p className="tourbar__label">
        <span className="tourbar__count">
          Etapa {i + 1} de {TOUR_STAGES.length}
        </span>
        <span className="tourbar__name">
          {stage.verb} · {stage.minutes}
        </span>
      </p>
      {stage.apps.length > 1 && (
        <span className="tourbar__apps">
          {stage.apps.map((a) => (
            <button key={a} type="button" className={`tourbar__app ${state.focused === a ? 'is-on' : ''}`} onClick={() => openApp(a)} title={`Ir a ${APP_BY_ID[a].name}`}>
              <img src={asset(APP_BY_ID[a].icon)} alt="" />
              <span>{APP_BY_ID[a].name}</span>
            </button>
          ))}
        </span>
      )}
      <div className="tourbar__actions">
        <button type="button" className="btn btn--small" disabled={i === 0} onClick={() => tourGo(i - 1)}>
          ← Anterior
        </button>
        {last ? (
          <button type="button" className="btn btn--small btn--primary" onClick={() => { endTour(); toDesktop(); }}>
            Terminar recorrido
          </button>
        ) : (
          <button type="button" className="btn btn--small btn--primary" onClick={() => tourGo(i + 1)}>
            Continuar →
          </button>
        )}
        <button type="button" className="btn btn--small btn--ghost tourbar__icon" onClick={toDesktop} title="Volver al escritorio" aria-label="Volver al escritorio">
          ⌂
        </button>
        <button type="button" className="btn btn--small btn--ghost" onClick={endTour} title="Salir del recorrido y explorar libremente">
          Explorar libremente
        </button>
      </div>
    </div>
  );
}
