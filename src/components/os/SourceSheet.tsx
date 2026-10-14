import { useEffect, useRef } from 'react';
import { useOS } from './OSContext';
import { ACCESS_DATE, SOURCES, citeText } from '../../content/sources';
import { APP_BY_ID } from '../../content/apps';
import { Reference } from '../ui/Cite';
import { Tag } from '../ui/bits';

/** Ficha de fuente: referencia APA 7 completa, argumento que respalda y enlace al original. */
export function SourceSheet() {
  const { state, closeSource, openApp } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const src = state.source ? SOURCES[state.source.id] : null;

  useEffect(() => {
    if (!src) return;
    opener.current = document.activeElement;
    ref.current?.focus();
    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, [src]);

  if (!src) return null;

  return (
    <div className="sheet-backdrop" onClick={closeSource}>
      <div
        ref={ref}
        tabIndex={-1}
        className="sheet glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sheet__head">
          <div>
            <p className="eyebrow">Ficha de fuente · {src.type}</p>
            <h2 id="sheet-title">{citeText(src.id)}</h2>
          </div>
          <button type="button" className="icon-btn" aria-label="Cerrar ficha" onClick={closeSource}>
            ✕
          </button>
        </header>

        <section className="sheet__block">
          <h3>Referencia APA 7</h3>
          <p className="apa-ref">
            <Reference id={src.id} />
          </p>
        </section>

        <section className="sheet__block">
          <h3>Qué respalda en NEXUS OS</h3>
          <Tag kind="evidencia" />
          <p>{state.source?.claim ?? src.supports}</p>
          {state.source?.claim && <p className="sheet__muted">Contenido general de la fuente: {src.supports}</p>}
        </section>

        {src.note && (
          <section className="sheet__block sheet__note">
            <h3>Nota editorial</h3>
            <p>{src.note}</p>
          </section>
        )}

        <dl className="sheet__meta">
          <div>
            <dt>Institución</dt>
            <dd>{src.institution}</dd>
          </div>
          <div>
            <dt>Idioma</dt>
            <dd>{src.language === 'es' ? 'Español' : 'Inglés'}</dd>
          </div>
          <div>
            <dt>Consultada</dt>
            <dd>{ACCESS_DATE}</dd>
          </div>
          <div>
            <dt>Se usa en</dt>
            <dd>{src.apps.map((a) => APP_BY_ID[a].name).join(', ')}</dd>
          </div>
        </dl>

        <footer className="sheet__actions">
          <a className="btn btn--primary" href={src.url} target="_blank" rel="noopener noreferrer">
            Consultar documento original ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <button
            type="button"
            className="btn"
            onClick={() => {
              closeSource();
              openApp('archivos', `src:${src.id}`);
            }}
          >
            Ver en Archivos
          </button>
        </footer>
      </div>
    </div>
  );
}
