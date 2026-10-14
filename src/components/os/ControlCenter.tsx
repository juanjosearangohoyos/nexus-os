import { useEffect, useRef } from 'react';
import { useOS, type Prefs } from './OSContext';
import { sfx } from '../../lib/sound';

interface ToggleDef {
  key: keyof Prefs;
  label: string;
  hint: string;
}

const TOGGLES: ToggleDef[] = [
  { key: 'sound', label: 'Sonido', hint: 'Efectos breves de interfaz y sonido de arranque.' },
  { key: 'ambient', label: 'Ambiente sonoro', hint: 'Acorde instrumental suave y original. Requiere sonido activado.' },
  { key: 'captions', label: 'Subtítulos', hint: 'Subtítulos en el video y descripciones de efectos sonoros.' },
  { key: 'reduceMotion', label: 'Reducir movimiento', hint: 'Desactiva animaciones y transiciones amplias.' },
  { key: 'staticWallpaper', label: 'Fondo estático', hint: 'Detiene la animación del fondo del escritorio.' },
  { key: 'largeText', label: 'Texto grande', hint: 'Aumenta el tamaño del texto de lectura.' },
];

export function PrefToggles({ compact = false }: { compact?: boolean }) {
  const { state, setPrefs, reducedMotion } = useOS();
  const p = state.prefs;
  return (
    <ul className={`pref-list ${compact ? 'pref-list--compact' : ''}`}>
      {TOGGLES.map((t) => {
        const on = t.key === 'reduceMotion' ? reducedMotion : Boolean(p[t.key]);
        const disabled = t.key === 'ambient' && !p.sound;
        return (
          <li key={t.key}>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              disabled={disabled}
              className="pref"
              onClick={() => {
                const next = !on;
                setPrefs({ [t.key]: next } as Partial<Prefs>);
                if (t.key === 'sound' && next) window.setTimeout(() => sfx.toggleOn(), 30);
                else if (next) sfx.toggleOn();
                else sfx.toggleOff();
              }}
            >
              <span className="pref__text">
                <span className="pref__label">{t.label}</span>
                {!compact && <span className="pref__hint">{t.hint}</span>}
              </span>
              <span className="switch" aria-hidden="true">
                <span className="switch__knob" />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Centro de control: accesibilidad, sonido y estado del recorrido. */
export function ControlCenter() {
  const { state, setOverlay, setPrefs, showBoot, resetProgress } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('button')?.focus();
  }, []);
  return (
    <div className="popover-backdrop" onClick={() => setOverlay(null)}>
      <div
        ref={ref}
        className="control-center glass"
        role="dialog"
        aria-modal="true"
        aria-label="Accesibilidad y sonido"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cc__head">
          <h2>Accesibilidad y sonido</h2>
          <button type="button" className="icon-btn" aria-label="Cerrar" onClick={() => setOverlay(null)}>
            ✕
          </button>
        </header>
        <PrefToggles />
        <div className="cc__row">
          <button type="button" className="btn btn--small" onClick={() => setPrefs({ reduceMotion: null })} disabled={state.prefs.reduceMotion === null}>
            Usar preferencia del sistema
          </button>
          <button
            type="button"
            className="btn btn--small"
            onClick={() => {
              setOverlay(null);
              showBoot();
            }}
          >
            Ver introducción de nuevo
          </button>
          <button type="button" className="btn btn--small" onClick={resetProgress}>
            Reiniciar progreso del recorrido
          </button>
        </div>
        <p className="cc__note">
          Atajos: <kbd>Ctrl</kbd> + <kbd>K</kbd> abre la búsqueda · <kbd>Esc</kbd> cierra paneles · <kbd>Alt</kbd> + <kbd>W</kbd> cierra la
          ventana activa · <kbd>Alt</kbd> + <kbd>M</kbd> la minimiza.
        </p>
        <p className="cc__note">NEXUS OS no recopila datos personales. Tus preferencias se guardan solo en este navegador.</p>
      </div>
    </div>
  );
}
