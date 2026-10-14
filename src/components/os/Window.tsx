import { Component, Suspense, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useOS, type WinState } from './OSContext';
import { APP_BY_ID } from '../../content/apps';
import type { AppId } from '../../content/types';
import { APP_COMPONENTS, AppSkeleton } from './registry';
import { asset } from '../../lib/useMedia';
import { StageBanner } from '../ui/bits';

const MENU_H = 34;

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean; chunk: boolean }> {
  state = { failed: false, chunk: false };
  static getDerivedStateFromError(error: unknown) {
    // Si cambió la versión publicada, el fragmento antiguo ya no existe: se recarga la página.
    const chunk = /dynamically imported module|module script failed|Loading chunk/i.test(String((error as Error)?.message ?? error));
    return { failed: true, chunk };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="app-error" role="alert">
          <p>No pudimos cargar el documento. Intenta nuevamente.</p>
          <button type="button" className="btn" onClick={() => (this.state.chunk ? window.location.reload() : this.setState({ failed: false }))}>
            Reintentar
          </button>
        </div>
      );
    return this.props.children;
  }
}

export function windowTitle(id: WinState['id']) {
  return id === 'about' ? 'Acerca de NEXUS OS' : APP_BY_ID[id as AppId].windowTitle;
}

/** Ventana real: activar, mover, redimensionar, minimizar, maximizar y cerrar. */
export function Window({ win }: { win: WinState }) {
  const { state, focus, closeWin, minimize, toggleMax, move, resize, reducedMotion } = useOS();
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focused = state.focused === win.id;
  const meta = win.id === 'about' ? null : APP_BY_ID[win.id as AppId];
  const Content = APP_COMPONENTS[win.id];

  // Al abrir o restaurar, el foco pasa al título de la ventana.
  useEffect(() => {
    if (!win.minimized && focused) headingRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.minimized]);

  const startDrag = (e: React.PointerEvent) => {
    if (win.maximized || (e.target as HTMLElement).closest('button')) return;
    focus(win.id);
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = win.x;
    const oy = win.y;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => {
      const nx = Math.min(window.innerWidth - 120, Math.max(-win.w + 160, ox + ev.clientX - sx));
      const ny = Math.min(window.innerHeight - 80, Math.max(MENU_H + 4, oy + ev.clientY - sy));
      move(win.id, nx, ny);
    };
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    const sx = e.clientX;
    const sy = e.clientY;
    const ow = win.w;
    const oh = win.h;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const onMove = (ev: PointerEvent) => resize(win.id, Math.max(560, ow + ev.clientX - sx), Math.max(380, oh + ev.clientY - sy));
    const onUp = () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
  };

  // Mover con teclado: Alt + flechas sobre la barra de título.
  const onTitleKey = (e: React.KeyboardEvent) => {
    if (!e.altKey || win.maximized) return;
    const d = 24;
    if (e.key === 'ArrowLeft') move(win.id, win.x - d, win.y);
    else if (e.key === 'ArrowRight') move(win.id, win.x + d, win.y);
    else if (e.key === 'ArrowUp') move(win.id, win.x, Math.max(MENU_H + 4, win.y - d));
    else if (e.key === 'ArrowDown') move(win.id, win.x, win.y + d);
    else return;
    e.preventDefault();
  };

  const style: CSSProperties = win.maximized
    ? { zIndex: win.z }
    : { zIndex: win.z, left: win.x, top: win.y, width: win.w, height: win.h };
  if (meta) {
    (style as Record<string, string | number>)['--accent'] = meta.accent;
    (style as Record<string, string | number>)['--accent-2'] = meta.accent2;
  }

  const title = windowTitle(win.id);

  return (
    <section
      ref={ref}
      className={`window ${focused ? 'is-focused' : ''} ${win.maximized ? 'is-max' : ''} ${win.minimized ? 'is-min' : ''} ${reducedMotion ? '' : 'can-animate'} window--${win.id}`}
      style={style}
      aria-label={title}
      // `inert` oculta la ventana minimizada a las tecnologías de apoyo y libera el foco (aria-hidden no lo libera).
      inert={win.minimized || undefined}
      onPointerDownCapture={() => focus(win.id)}
    >
      <header className="window__bar" onPointerDown={startDrag} onDoubleClick={() => toggleMax(win.id)}>
        <div className="traffic">
          <button type="button" className="traffic__btn traffic__btn--close" aria-label={`Cerrar ${meta?.name ?? 'Acerca de'}`} onClick={() => closeWin(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" /></svg>
          </button>
          <button type="button" className="traffic__btn traffic__btn--min" aria-label={`Minimizar ${meta?.name ?? 'Acerca de'}`} onClick={() => minimize(win.id)}>
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5h6" /></svg>
          </button>
          <button
            type="button"
            className="traffic__btn traffic__btn--max"
            aria-label={win.maximized ? 'Restaurar tamaño' : 'Maximizar'}
            onClick={() => toggleMax(win.id)}
          >
            <svg viewBox="0 0 10 10" aria-hidden="true">
              {win.maximized ? <path d="M3 7V3h4M7 3v4H3" /> : <path d="M2.5 6.5v-4h4M7.5 3.5v4h-4" />}
            </svg>
          </button>
        </div>
        <h1 className="window__title" ref={headingRef} tabIndex={-1} onKeyDown={onTitleKey}>
          {meta && <img src={asset(meta.icon)} alt="" width={16} height={16} />}
          {title}
        </h1>
        <span className="window__spacer" />
      </header>
      {meta && <StageBanner app={meta.id} />}
      <div className="window__body">
        <AppErrorBoundary>
          <Suspense fallback={<AppSkeleton />}>
            <Content />
          </Suspense>
        </AppErrorBoundary>
      </div>
      {!win.maximized && <div className="window__resize" onPointerDown={startResize} aria-hidden="true" />}
    </section>
  );
}
