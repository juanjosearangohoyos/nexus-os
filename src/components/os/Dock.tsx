import { useRef, useState } from 'react';
import { useOS } from './OSContext';
import { APPS } from '../../content/apps';
import type { AppId } from '../../content/types';
import { asset } from '../../lib/useMedia';

const BASE = 54;
const RANGE = 150;
const BOOST = 0.62;

/** Dock inferior con ampliación al pasar el puntero, indicadores de ejecución y estado minimizado. */
export function Dock() {
  const { state, openApp, minimize, setOverlay, reducedMotion } = useOS();
  const listRef = useRef<HTMLUListElement>(null);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [bouncing, setBouncing] = useState<AppId | null>(null);

  const scaleFor = (el: HTMLElement | null) => {
    if (reducedMotion || pointerX == null || !el) return 1;
    const r = el.getBoundingClientRect();
    const d = Math.abs(pointerX - (r.left + r.width / 2));
    return 1 + BOOST * Math.max(0, 1 - d / RANGE) ** 1.6;
  };

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const activate = (id: AppId) => {
    const win = state.windows.find((w) => w.id === id);
    if (win && !win.minimized && state.focused === id) {
      minimize(id);
      return;
    }
    if (!win) {
      setBouncing(id);
      window.setTimeout(() => setBouncing(null), 700);
    }
    openApp(id);
  };

  return (
    <nav className="dock-wrap" aria-label="Dock de aplicaciones">
      <ul
        ref={listRef}
        className="dock glass"
        onPointerMove={(e) => setPointerX(e.clientX)}
        onPointerLeave={() => setPointerX(null)}
      >
        {APPS.map((app) => {
          const win = state.windows.find((w) => w.id === app.id);
          const s = scaleFor(itemRefs.current[app.id]);
          const status = win ? (win.minimized ? 'minimizada' : 'abierta') : 'cerrada';
          return (
            <li
              key={app.id}
              ref={(el) => {
                itemRefs.current[app.id] = el;
              }}
              className={`dock__item ${bouncing === app.id && !reducedMotion ? 'is-bouncing' : ''} ${state.focused === app.id ? 'is-active' : ''}`}
              style={{ width: BASE * s, height: BASE * s }}
            >
              <button
                type="button"
                className="dock__btn"
                aria-label={`${app.name}: ${app.topic} (${status})`}
                onClick={() => activate(app.id)}
              >
                <img src={asset(app.icon)} alt="" draggable={false} />
                <span className="dock__tip" aria-hidden="true">
                  {app.name}
                  {win?.minimized ? ' · minimizada' : ''}
                </span>
              </button>
              <span className={`dock__dot ${win ? (win.minimized ? 'is-min' : 'is-on') : ''}`} aria-hidden="true" />
            </li>
          );
        })}
        <li className="dock__sep" aria-hidden="true" />
        <li className="dock__item" style={{ width: BASE, height: BASE }}>
          <button type="button" className="dock__btn dock__btn--launcher" aria-label="Todas las aplicaciones y búsqueda" onClick={() => setOverlay('launcher')}>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              {[0, 1, 2].map((r) =>
                [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={9 + c * 11} y={9 + r * 11} width="8" height="8" rx="2.5" fill="currentColor" opacity={0.55 + ((r + c) % 3) * 0.15} />),
              )}
            </svg>
            <span className="dock__tip" aria-hidden="true">
              Todas las apps
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
