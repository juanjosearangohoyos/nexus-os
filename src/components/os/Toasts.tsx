import { useEffect } from 'react';
import { useOS, type Toast } from './OSContext';
import { APP_BY_ID } from '../../content/apps';
import { asset } from '../../lib/useMedia';

function ToastCard({ t }: { t: Toast }) {
  const { dismissToast, openApp } = useOS();
  useEffect(() => {
    const timer = window.setTimeout(() => dismissToast(t.id), 9000);
    return () => window.clearTimeout(timer);
  }, [t.id, dismissToast]);
  const icon = t.action ? APP_BY_ID[t.action.app].icon : 'icons/nexus-logo.svg';
  return (
    <div className={`toast glass toast--${t.tone ?? 'info'}`} role="status">
      <img src={asset(icon)} alt="" width={34} height={34} />
      <div className="toast__body">
        <p className="toast__title">{t.title}</p>
        {t.body && <p className="toast__text">{t.body}</p>}
        {t.action && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              dismissToast(t.id);
              openApp(t.action!.app, t.action!.intent);
            }}
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button type="button" className="icon-btn toast__close" aria-label="Descartar notificación" onClick={() => dismissToast(t.id)}>
        ✕
      </button>
    </div>
  );
}

/** Notificaciones no bloqueantes, al estilo del centro de notificaciones. */
export function Toasts() {
  const { state } = useOS();
  return (
    <div className="toasts" aria-live="polite">
      {state.toasts.map((t) => (
        <ToastCard key={t.id} t={t} />
      ))}
    </div>
  );
}
