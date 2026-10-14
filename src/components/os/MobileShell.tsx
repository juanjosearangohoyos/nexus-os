import { Suspense, useEffect, useRef, useState } from 'react';
import { useOS } from './OSContext';
import { APPS, APP_BY_ID } from '../../content/apps';
import { TOUR_STAGES } from '../../content/tour';
import type { AppId } from '../../content/types';
import { asset } from '../../lib/useMedia';
import { APP_COMPONENTS, AppSkeleton } from './registry';
import { windowTitle } from './Window';
import { StageBanner } from '../ui/bits';

/**
 * Versión móvil: lanzador tipo sistema operativo y una aplicación activa a pantalla completa,
 * con barra inferior de navegación. No es una miniatura del escritorio.
 */
export function MobileShell() {
  const { state, openApp, closeWin, setOverlay, tourGo, endTour } = useOS();
  const [time, setTime] = useState(() => new Date());
  const headRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const t = window.setInterval(() => setTime(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);

  const active = state.focused;
  const Content = active ? APP_COMPONENTS[active] : null;
  const meta = active && active !== 'about' ? APP_BY_ID[active as AppId] : null;

  useEffect(() => {
    if (active) headRef.current?.focus({ preventScroll: true });
  }, [active]);

  // En móvil, «Inicio» vuelve al lanzador; los avances de cada app se conservan.
  const goHome = () => {
    state.windows.forEach((w) => closeWin(w.id));
  };

  const tourIdx = state.tour.index;

  return (
    <div className="mobile">
      <header className="mobile__status glass">
        <span className="mobile__brand">
          <img src={asset('icons/favicon.svg')} alt="" width={14} height={14} /> NEXUS OS
        </span>
        <time>{time.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</time>
      </header>

      {!active ? (
        <main className="mobile__home" aria-label="Inicio">
          <section className="mobile__hero glass">
            <p className="eyebrow">Diferentes formas de pensar. Una nueva forma de crear.</p>
            <p>Somos cuatro desarrolladores. Creamos NEXUS OS para explorar cómo compartimos conocimientos, colaboramos con IA y asumimos responsabilidades.</p>
            <button type="button" className="btn btn--primary" onClick={() => tourGo(state.tour.active ? tourIdx : 0)}>
              {state.tour.active ? 'Continuar recorrido' : 'Iniciar recorrido esencial'}
            </button>
            <p className="mobile__hint">Seis etapas, unos 7 minutos. También puedes abrir cualquier aplicación.</p>
          </section>
          <ul className="mobile__grid">
            {APPS.map((a) => (
              <li key={a.id}>
                <button type="button" onClick={() => openApp(a.id)} aria-label={`${a.name}: ${a.topic}`}>
                  <img src={asset(a.icon)} alt="" width={60} height={60} />
                  <span>{a.name}</span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => openApp('about')} aria-label="Acerca de NEXUS OS">
                <img src={asset('icons/nexus-logo.svg')} alt="" width={60} height={60} />
                <span>Acerca de</span>
              </button>
            </li>
          </ul>
        </main>
      ) : (
        <main
          className={`mobile__app window--${active}`}
          style={meta ? ({ '--accent': meta.accent, '--accent-2': meta.accent2 } as React.CSSProperties) : undefined}
        >
          <div className="mobile__appbar glass">
            <button type="button" className="btn btn--small btn--ghost" onClick={goHome}>
              ‹ Inicio
            </button>
            <h1 ref={headRef} tabIndex={-1} className="mobile__title">
              {meta ? meta.name : windowTitle(active)}
            </h1>
            <span className="mobile__spacer" />
          </div>
          {state.tour.active && (
            <div className="mobile__tour">
              <span>
                Etapa {tourIdx + 1}/{TOUR_STAGES.length} · {TOUR_STAGES[tourIdx].verb}
              </span>
              {TOUR_STAGES[tourIdx].apps.length > 1 &&
                TOUR_STAGES[tourIdx].apps.map((a) => (
                  <button key={a} type="button" className={`btn btn--small ${active === a ? '' : 'btn--ghost'}`} onClick={() => openApp(a)}>
                    {APP_BY_ID[a].name}
                  </button>
                ))}
              <button type="button" className="btn btn--small" disabled={tourIdx === 0} onClick={() => tourGo(tourIdx - 1)} aria-label="Etapa anterior">
                ←
              </button>
              {tourIdx < TOUR_STAGES.length - 1 ? (
                <button type="button" className="btn btn--small btn--primary" onClick={() => tourGo(tourIdx + 1)}>
                  Continuar →
                </button>
              ) : (
                <button type="button" className="btn btn--small btn--primary" onClick={() => { endTour(); goHome(); }}>
                  Terminar
                </button>
              )}
              <button type="button" className="btn btn--small btn--ghost" onClick={endTour} aria-label="Salir del recorrido y explorar libremente" title="Explorar libremente">
                ✕
              </button>
            </div>
          )}
          {meta && <StageBanner app={meta.id} />}
          <div className="mobile__content window__body">
            {Content && (
              <Suspense fallback={<AppSkeleton />}>
                <Content key={active} />
              </Suspense>
            )}
          </div>
        </main>
      )}

      <nav className="mobile__nav glass" aria-label="Navegación principal">
        <button type="button" onClick={goHome} aria-current={!active ? 'page' : undefined}>
          <span aria-hidden="true">⌂</span>Inicio
        </button>
        <button type="button" onClick={() => setOverlay('launcher')}>
          <span aria-hidden="true">⌕</span>Buscar
        </button>
        <button type="button" onClick={() => openApp('documentos')} aria-current={active === 'documentos' ? 'page' : undefined}>
          <span aria-hidden="true">✎</span>Manifiesto
        </button>
        <button type="button" onClick={() => setOverlay('control')}>
          <span aria-hidden="true">◐</span>Accesibilidad
        </button>
      </nav>
    </div>
  );
}
