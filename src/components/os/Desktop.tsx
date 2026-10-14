import { useEffect } from 'react';
import { useOS } from './OSContext';
import { APPS } from '../../content/apps';
import { DEEPER_APPS, TOUR_STAGES } from '../../content/tour';
import { asset } from '../../lib/useMedia';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { Window } from './Window';
import { TourBar } from './TourBar';

function DesktopIcons() {
  const { openApp, state } = useOS();
  return (
    <nav className="desk-icons" aria-label="Aplicaciones del escritorio">
      <ul>
        {APPS.map((a) => (
          <li key={a.id}>
            <button type="button" className="desk-icon" onDoubleClick={() => openApp(a.id)} onClick={() => openApp(a.id)} aria-label={`Abrir ${a.name}: ${a.topic}`}>
              <img src={asset(a.icon)} alt="" width={64} height={64} draggable={false} />
              <span className="desk-icon__label">
                {a.name}
                {DEEPER_APPS.includes(a.id) && <span className="desk-icon__tag">Profundizar</span>}
                {state.visited.includes(a.id) && <span className="desk-icon__seen" aria-hidden="true" />}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Widgets() {
  const { state, startTour, openApp } = useOS();
  const seen = state.visited.length;
  return (
    <aside className="widgets" aria-label="Widgets">
      <section className="widget glass">
        <p className="widget__eyebrow">Tesis central</p>
        <p className="widget__thesis">
          No rechazamos la inteligencia artificial ni creemos que deba reemplazar el pensamiento humano. Defendemos un futuro donde las inteligencias
          colectiva, artificial e híbrida amplíen nuestras posibilidades de comunicar, crear y colaborar, bajo condiciones de responsabilidad,
          transparencia, inclusión y autonomía humana.
        </p>
        <button type="button" className="link-btn" onClick={() => openApp('documentos')}>
          Leer el manifiesto →
        </button>
      </section>
      <section className="widget glass">
        <p className="widget__eyebrow">Recorrido esencial · ≈ 7 min</p>
        <ol className="widget__stages">
          {TOUR_STAGES.map((st, k) => (
            <li key={st.verb} className={`${state.stagesSeen.includes(k) ? 'is-on' : ''} ${state.tour.active && state.tour.index === k ? 'is-current' : ''}`}>
              <button type="button" onClick={() => startTour(k)} title={`${st.title}`}>
                <span className="widget__n">{k + 1}</span>
                {st.verb}
              </button>
            </li>
          ))}
        </ol>
        <p className="widget__text">
          Etapas recorridas: {state.stagesSeen.length} de {TOUR_STAGES.length}. Puedes abrir cualquier aplicación cuando quieras.
        </p>
        <button type="button" className="btn btn--small btn--primary" onClick={() => startTour(state.tour.active || seen ? state.tour.index : 0)}>
          {state.tour.active ? 'Continuar recorrido' : state.stagesSeen.length ? 'Retomar recorrido' : 'Iniciar recorrido'}
        </button>
      </section>
      <section className="widget glass widget--tension">
        <p className="widget__eyebrow">La tensión</p>
        <p className="widget__text">
          Combinar inteligencias no garantiza un mejor resultado. La pregunta no es «¿cuánto podemos automatizar?», sino «¿qué relación vale la pena
          diseñar y bajo qué condiciones?».
        </p>
        <button type="button" className="link-btn" onClick={() => openApp('enlace')}>
          Ver la evidencia en Enlace →
        </button>
      </section>
    </aside>
  );
}

export function Desktop() {
  const { state, closeWin, minimize, setOverlay } = useOS();

  // Atajos globales de teclado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOverlay(state.overlay === 'launcher' ? null : 'launcher');
      } else if (e.altKey && e.key.toLowerCase() === 'w' && state.focused) {
        e.preventDefault();
        closeWin(state.focused);
      } else if (e.altKey && e.key.toLowerCase() === 'm' && state.focused) {
        e.preventDefault();
        minimize(state.focused);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.overlay, state.focused, closeWin, minimize, setOverlay]);

  const anyMax = state.windows.some((w) => w.maximized && !w.minimized);

  return (
    <div className="desktop">
      <MenuBar />
      <TourBar />
      <main className="desktop__area" aria-label="Escritorio">
        <DesktopIcons />
        {!anyMax && <Widgets />}
        <div className="windows-layer">
          {state.windows.map((w) => (
            <Window key={w.id} win={w} />
          ))}
        </div>
      </main>
      <Dock />
    </div>
  );
}
