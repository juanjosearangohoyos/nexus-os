import { useEffect } from 'react';
import { OSProvider, useOS } from './components/os/OSContext';
import { Wallpaper } from './components/os/Wallpaper';
import { BootScreen } from './components/os/BootScreen';
import { Desktop } from './components/os/Desktop';
import { MobileShell } from './components/os/MobileShell';
import { Launcher } from './components/os/Launcher';
import { ControlCenter } from './components/os/ControlCenter';
import { SourceSheet } from './components/os/SourceSheet';
import { Toasts } from './components/os/Toasts';
import { useMediaQuery } from './lib/useMedia';

function Shell() {
  const { state, reducedMotion, setOverlay, closeSource } = useOS();
  const mobile = useMediaQuery('(max-width: 760px)');

  // Escape cierra primero la ficha de fuente y luego los paneles.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (state.source) closeSource();
      else if (state.overlay) setOverlay(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.source, state.overlay, closeSource, setOverlay]);

  const animatedWallpaper = !reducedMotion && !state.prefs.staticWallpaper;

  return (
    <div className={`os ${mobile ? 'os--mobile' : 'os--desktop'}`}>
      <a className="skip-link" href="#main-content" onClick={(e) => { e.preventDefault(); document.querySelector<HTMLElement>('.window.is-focused .window__title, .mobile__title, .desk-icon, .boot .btn--primary')?.focus(); }}>
        Saltar al contenido
      </a>
      <Wallpaper animated={animatedWallpaper} />
      <div id="main-content" />
      {state.phase === 'boot' ? <BootScreen /> : mobile ? <MobileShell /> : <Desktop />}
      {state.overlay === 'launcher' && <Launcher />}
      {state.overlay === 'control' && <ControlCenter />}
      <SourceSheet />
      {state.phase === 'desktop' && <Toasts />}
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}
