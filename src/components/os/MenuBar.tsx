import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useOS } from './OSContext';
import { APP_BY_ID } from '../../content/apps';
import type { AppId } from '../../content/types';
import { asset } from '../../lib/useMedia';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function Menu({ label, children, className = '' }: { label: ReactNode; children: (close: () => void) => ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector<HTMLButtonElement>('.menubar__item')?.focus();
      }
    };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    ref.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = [...(ref.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? [])];
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[next]?.focus();
  };
  return (
    <div className={`menu ${className}`} ref={ref}>
      <button type="button" className={`menubar__item ${open ? 'is-open' : ''}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {label}
      </button>
      {open && (
        <div className="menu__list glass" role="menu" onKeyDown={onMenuKey}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function Item({ onSelect, children, disabled }: { onSelect: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button type="button" role="menuitem" className="menu__item" disabled={disabled} onClick={onSelect}>
      {children}
    </button>
  );
}

export function MenuBar() {
  const os = useOS();
  const { state } = os;
  const now = useClock();
  const focusedApp = state.focused && state.focused !== 'about' ? APP_BY_ID[state.focused as AppId] : null;
  const date = now.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  return (
    <nav className="menubar glass" aria-label="Barra de menús de NEXUS OS">
      <div className="menubar__left">
        <Menu
          className="menu--brand"
          label={
            <>
              <img src={asset('icons/favicon.svg')} alt="" width={16} height={16} />
              <span className="menubar__brand">NEXUS OS</span>
            </>
          }
        >
          {(close) => (
            <>
              <Item onSelect={() => { close(); os.openApp('about'); }}>Acerca de NEXUS OS</Item>
              <Item onSelect={() => { close(); os.startTour(state.tour.active ? state.tour.index : 0); }}>
                {state.tour.active ? 'Continuar recorrido esencial' : 'Recorrido esencial (6 etapas)'}
              </Item>
              <Item onSelect={() => { close(); os.setOverlay('launcher'); }}>Buscar…  Ctrl K</Item>
              <hr className="menu__sep" />
              <Item onSelect={() => { close(); os.setOverlay('control'); }}>Accesibilidad y sonido</Item>
              <Item onSelect={() => { close(); os.showBoot(); }}>Ver introducción de nuevo</Item>
            </>
          )}
        </Menu>

        {focusedApp && (
          <Menu label={<strong>{focusedApp.name}</strong>}>
            {(close) => (
              <>
                <Item onSelect={() => { close(); os.openApp('archivos', `app:${focusedApp.id}`); }}>Ver fuentes de esta aplicación</Item>
                <Item onSelect={() => { close(); os.toggleMax(focusedApp.id); }}>Pantalla completa para lectura</Item>
                <Item onSelect={() => { close(); os.minimize(focusedApp.id); }}>Minimizar  Alt M</Item>
                <Item onSelect={() => { close(); os.closeWin(focusedApp.id); }}>Cerrar ventana  Alt W</Item>
              </>
            )}
          </Menu>
        )}

        {/* Durante el recorrido, la isla central ofrece Anterior / Continuar / Explorar libremente. */}
        {!state.tour.active && (
          <>
            <button type="button" className="menubar__item hide-sm" onClick={() => os.openApp('about')}>
              Acerca de
            </button>
            <button type="button" className="menubar__item hide-sm" onClick={() => os.startTour(state.tour.index)}>
              Recorrido esencial
            </button>
          </>
        )}
      </div>

      <div className="menubar__right">
        <button type="button" className="menubar__icon" aria-label="Buscar aplicaciones y contenidos" onClick={() => os.setOverlay('launcher')}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="menubar__icon"
          role="switch"
          aria-checked={state.prefs.sound}
          aria-label={state.prefs.sound ? 'Silenciar todo' : 'Activar sonido'}
          title={state.prefs.sound ? 'Silenciar todo' : 'Activar sonido'}
          onClick={() => os.setPrefs({ sound: !state.prefs.sound })}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor" />
            {state.prefs.sound ? (
              <path d="M13 7a4 4 0 010 6M15 5a7 7 0 010 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M13 8l4 4M17 8l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <button type="button" className="menubar__icon" aria-label="Accesibilidad y sonido" onClick={() => os.setOverlay('control')}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="10" cy="6" r="1.4" fill="currentColor" />
            <path d="M6 8.5h8M10 8.5v3.5l-2 3.5M10 12l2 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <time className="menubar__clock" dateTime={now.toISOString()}>
          <span className="hide-sm">{date} </span>
          {time}
        </time>
      </div>
    </nav>
  );
}
