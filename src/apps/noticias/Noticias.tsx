import { useEffect, useRef } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { Reference, RichText } from '../../components/ui/Cite';
import { CompletionBar, GoApp, Tag } from '../../components/ui/bits';
import { NEWS, type NewsItem } from '../../content/noticias';
import { asset } from '../../lib/useMedia';
import { NewsIllustration } from './Illustrations';
import './noticias.css';

/** Biblioteca de casos reales: tarjetas de resumen y expediente completo al seleccionarlas. */
export default function Noticias() {
  const [current, setCurrent] = usePersistent<string | null>('noticias:open', null);
  const [read, setRead] = usePersistent<string[]>('noticias:read', []);
  const intent = useIntent('noticias');
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (intent && NEWS.some((n) => n.id === intent.value)) setCurrent(intent.value);
  }, [intent, setCurrent]);

  useEffect(() => {
    if (!current) return;
    setRead((r) => (r.includes(current) ? r : [...r, current]));
    articleRef.current?.scrollTo({ top: 0 });
  }, [current, setRead]);

  const n = NEWS.find((x) => x.id === current) ?? null;

  return (
    <div className="news" ref={articleRef}>
      {n ? (
        <Dossier n={n} onBack={() => setCurrent(null)} onOpen={setCurrent} />
      ) : (
        <div className="news__home">
          <header className="news__brand">
            <span className="news__logo" aria-hidden="true">
              N
            </span>
            <div>
              <p className="eyebrow">Recurso de profundización</p>
              <h2>Expedientes verificables · 2024–2026</h2>
              <p className="news__lead">Casos reales que sostienen el manifiesto. Abre los que te interesen: no es necesario leerlos todos.</p>
            </div>
          </header>
          <ul className="news__cards">
            {NEWS.map((x) => (
              <li key={x.id}>
                <button type="button" className="news-card" onClick={() => setCurrent(x.id)}>
                  <span className="news-card__visual" aria-hidden="true">
                    {x.visual.kind === 'photo' ? <img src={asset(x.visual.src)} alt="" loading="lazy" /> : <NewsIllustration name={x.visual.name} />}
                  </span>
                  <span className="news-card__body">
                    <span className="news-card__kicker">{x.kicker}</span>
                    <strong className="news-card__title">{x.title}</strong>
                    <span className="news-card__date">
                      {x.dateLabel}
                      {read.includes(x.id) && <span className="news-card__read"> · leído</span>}
                    </span>
                    <span className="news-card__q">{x.question}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <CompletionBar app="noticias" done={read.length > 0} />
        </div>
      )}
    </div>
  );
}

function Dossier({ n, onBack, onOpen }: { n: NewsItem; onBack: () => void; onOpen: (id: string) => void }) {
  const { openApp } = useOS();
  const idx = NEWS.findIndex((x) => x.id === n.id);
  const prev = NEWS[idx - 1];
  const next = NEWS[idx + 1];
  return (
    <article className="news__article" aria-labelledby="news-title">
      <nav className="news__nav" aria-label="Navegación de expedientes">
        <button type="button" className="btn btn--small" onClick={onBack}>
          ← Todos los expedientes
        </button>
        <span className="news__nav-pos">
          {idx + 1} de {NEWS.length}
        </span>
        <span className="news__nav-step">
          <button type="button" className="btn btn--small" disabled={!prev} onClick={() => prev && onOpen(prev.id)}>
            ‹ Anterior
          </button>
          <button type="button" className="btn btn--small" disabled={!next} onClick={() => next && onOpen(next.id)}>
            Siguiente ›
          </button>
        </span>
      </nav>

      <header className="news__head">
        <div className="news__head-text">
          <p className="news__kicker">{n.kicker}</p>
          <h2 id="news-title">{n.title}</h2>
          <div className="news__meta">
            <time dateTime={n.dateISO}>{n.dateLabel}</time>
            <span>·</span>
            <span>{n.institution}</span>
            <span className={`news__int news__int--${n.intelligence.toLowerCase()}`}>
              {n.intelligence === 'Antecedente' ? 'Antecedente' : `Inteligencia ${n.intelligence.toLowerCase()}`}
            </span>
          </div>
          <p className="news__scope">
            <strong>Alcance:</strong> {n.scope}
          </p>
        </div>
        <figure className="news__visual">
          {n.visual.kind === 'photo' ? (
            <>
              <img src={asset(n.visual.src)} alt={n.visual.alt} loading="lazy" />
              <figcaption>
                Crédito: {n.visual.credit}. {n.visual.license}
              </figcaption>
            </>
          ) : (
            <>
              <div role="img" aria-label={n.visual.alt}>
                <NewsIllustration name={n.visual.name} />
              </div>
              <figcaption>Ilustración original de NEXUS OS. No reproduce materiales de la institución citada.</figcaption>
            </>
          )}
        </figure>
      </header>

      <div className="news__columns">
        <section className="news__col news__col--fact">
          <h3>
            <Tag kind="evidencia" />
            <span>Qué ocurrió</span>
          </h3>
          <p>
            <RichText value={n.happened} />
          </p>
        </section>
        <section className="news__col news__col--stance">
          <h3>
            <Tag kind="postura" />
            <span>Qué podemos concluir</span>
          </h3>
          <p>
            <RichText value={n.conclude} />
          </p>
        </section>
        <section className="news__col news__col--limit">
          <h3>
            <span className="news__no">Qué NO demuestra</span>
          </h3>
          <p>
            <RichText value={n.notShow} />
          </p>
        </section>
      </div>

      <section className="news__question">
        <div>
          <p className="eyebrow">Nuestra postura</p>
          <blockquote className="news__stance">«{n.stance}»</blockquote>
        </div>
        <div>
          <p className="eyebrow">Pregunta ética</p>
          <p className="news__q">{n.question}</p>
          {n.id === 'nasa' && (
            <p className="news__q2">
              ¿Estamos diseñando sistemas para recibir conocimientos de muchas personas o solo para extraer sus aportes sin reconocerlas?
            </p>
          )}
          <div className="pill-row">
            <GoApp app={n.related.app} intent={n.related.intent}>
              {n.related.label}
            </GoApp>
          </div>
        </div>
      </section>

      <footer className="news__source">
        <p className="news__source-label">Fuente</p>
        {n.sources.map((s) => (
          <p key={s} className="apa-ref">
            <Reference id={s} />
          </p>
        ))}
        <div className="pill-row">
          <a className="btn btn--small btn--primary" href={n.url} target="_blank" rel="noopener noreferrer">
            Documento original ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <button type="button" className="btn btn--small" onClick={() => openApp('archivos', `src:${n.sources[0]}`)}>
            Ver ficha en Archivos
          </button>
        </div>
      </footer>
    </article>
  );
}
