import { useEffect, useRef, useState } from 'react';
import { useOS } from './OSContext';
import { asset } from '../../lib/useMedia';
import { playBootChime } from '../../lib/sound';
import { PrefToggles } from './ControlCenter';

const STATUS = [
  { label: 'Red colectiva', value: 'conectada', tone: 'ok' },
  { label: 'Asistencia artificial', value: 'disponible', tone: 'ok' },
  { label: 'Colaboración híbrida', value: 'disponible', tone: 'ok' },
  { label: 'Principios del sistema', value: 'pendientes de aprobación humana', tone: 'attention' },
] as const;

/** Pantalla de arranque (3–5 s) con opción «Omitir». */
export function BootScreen() {
  const { enterDesktop, reducedMotion } = useOS();
  const [step, setStep] = useState(reducedMotion ? 99 : 0);
  const [showA11y, setShowA11y] = useState(false);
  const primary = useRef<HTMLButtonElement>(null);
  const done = step >= STATUS.length + 2;

  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 900 : 620);
    return () => window.clearTimeout(t);
  }, [step, done]);

  useEffect(() => {
    if (done) primary.current?.focus();
  }, [done]);

  const go = (mode: 'tour' | 'free' | 'team') => {
    playBootChime(asset('media/audio/nexus-arranque.mp3'));
    enterDesktop(mode);
  };

  return (
    <div className={`boot ${done ? 'boot--ready' : ''}`} role="dialog" aria-modal="true" aria-labelledby="boot-title">
      <div className="boot__stage">
        <div className="boot__left">
        <div className="boot__logo-wrap" aria-hidden="true">
          <svg className="boot__rings" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" />
            <circle cx="100" cy="100" r="74" />
            <circle cx="100" cy="100" r="56" />
          </svg>
          <img className="boot__logo" src={asset('icons/nexus-logo.svg')} alt="" width={112} height={112} />
        </div>
        <p className="boot__version">NEXUS OS · 1.0</p>
        <p className="boot__slogan">Diferentes formas de pensar. Una nueva forma de crear.</p>

        <div className="boot__status" aria-live="polite">
          <p className="boot__checking">{done ? 'Módulos verificados.' : 'Verificando módulos de inteligencia…'}</p>
          <ul>
            {STATUS.map((s, i) => (
              <li key={s.label} className={`boot__line ${step > i ? 'is-on' : ''} is-${s.tone}`}>
                <span className="boot__led" aria-hidden="true" />
                <span className="boot__label">{s.label}:</span> <span className="boot__value">{s.value}.</span>
              </li>
            ))}
          </ul>
          <div className="boot__bar" aria-hidden="true">
            <span style={{ width: `${Math.min(100, (step / (STATUS.length + 2)) * 100)}%` }} />
          </div>
          <p className={`boot__ethics ${step > STATUS.length ? 'is-on' : ''}`}>La configuración ética requiere decisiones humanas.</p>
        </div>
        </div>

        {done && (
          <div className="boot__intro">
            <h1 id="boot-title" className="boot__title">
              La tecnología ya puede ejecutar. Ahora nos toca decidir.
            </h1>
            <p className="boot__quote">«El sistema puede ejecutar acciones. Nosotros debemos decidir cuáles vale la pena ejecutar».</p>
            <p className="boot__desc">
              Somos cuatro desarrolladores. Creamos NEXUS OS para explorar cómo compartimos conocimientos, colaboramos con IA y asumimos
              responsabilidades. Te invitamos a conocer y cuestionar nuestra postura.
            </p>
            <div className="boot__actions">
              <button ref={primary} type="button" className="btn btn--primary btn--lg" onClick={() => go('tour')}>
                Iniciar recorrido
              </button>
              <button type="button" className="btn btn--glass btn--lg" onClick={() => go('free')}>
                Explorar escritorio
              </button>
            </div>
            <p className="boot__hint boot__tour-hint">Recorrido esencial: seis etapas, unos 7 minutos. Puedes salir y explorar libremente cuando quieras.</p>
            <div className="boot__secondary">
              <button type="button" className="link-btn" onClick={() => go('team')}>
                Ver equipo de desarrollo
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" className="link-btn" aria-expanded={showA11y} onClick={() => setShowA11y((v) => !v)}>
                Accesibilidad y sonido
              </button>
            </div>
            {showA11y && (
              <div className="boot__a11y">
                <PrefToggles compact />
                <p className="boot__hint">El sonido está desactivado al iniciar. Si lo activas, escucharás un breve sonido de arranque al entrar.</p>
              </div>
            )}
            <p className="boot__notice">
              Esta es una experiencia narrativa educativa; las simulaciones no ejecutan decisiones reales ni procesan datos de terceros.
            </p>
            <p className="boot__credits">
              Valentina Giraldo · Juan Román · Sebastián Camacho · Juan José Arango
              <br />
              Ciberculturas · Pontificia Universidad Javeriana Cali · 2026
            </p>
          </div>
        )}
      </div>
      {!done && (
        <button type="button" className="boot__skip btn btn--glass" onClick={() => setStep(99)}>
          Omitir introducción
        </button>
      )}
    </div>
  );
}
