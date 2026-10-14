import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { Cite, RichText } from '../../components/ui/Cite';
import { Badge, CompletionBar, Deeper, Tag } from '../../components/ui/bits';
import {
  CALL_TO_ACTION,
  CLOSING,
  COMMITMENT,
  DECLARATION,
  MANIFESTO_SUBTITLE,
  MANIFESTO_TITLE,
  OPENING,
  PLACE_DATE,
  PRINCIPLES,
  SIGNATORIES,
} from '../../content/manifesto';
import { APP_BY_ID } from '../../content/apps';
import { TEAM } from '../../content/team';
import { asset } from '../../lib/useMedia';
import './documentos.css';

type View = 'sintesis' | 'completo';

const INDEX = [
  { id: 'doc-portada', label: 'Portada' },
  { id: 'doc-declaracion', label: 'Declaración' },
  ...PRINCIPLES.map((p) => ({ id: `doc-p${p.n}`, label: `${p.n} · ${p.title}` })),
  { id: 'doc-compromiso', label: 'Nuestro compromiso' },
  { id: 'doc-firmas', label: 'Firmas' },
  { id: 'doc-objecion', label: 'Escribir una objeción' },
];

/** Última oración de cada postulado: su compromiso concreto, citado sin modificar. */
const lastSentence = (body: string) => body.split(/(?<=\.)\s+/).pop() ?? body;

function ManifestoText({ withNotes = true, print = false }: { withNotes?: boolean; print?: boolean }) {
  const { openApp } = useOS();
  // En la copia de impresión no se repiten los identificadores del documento en pantalla.
  const id = (v: string) => (print ? undefined : v);
  const chunk = (base = '') => ({ className: base || undefined });
  return (
    <>
      <header id={id('doc-portada')} className="doc__cover">
        <img src={asset('icons/nexus-logo.svg')} alt="" width={72} height={72} />
        <p className="doc__eyebrow">Documento fundacional · Versión 1.0</p>
        <h1 {...chunk()}>
          {MANIFESTO_TITLE}
          <span className="doc__subtitle">{MANIFESTO_SUBTITLE}</span>
        </h1>
        <p className="doc__authors">Valentina Giraldo · Juan Román · Sebastián Camacho · Juan José Arango</p>
      </header>

      <section id={id('doc-declaracion')} className="doc__section">
        <p {...chunk('doc__declaration')}>
          <RichText value={DECLARATION} />
        </p>
        {OPENING.map((p, i) => (
          <p key={i} {...chunk('doc__p')}>
            <RichText value={p} />
          </p>
        ))}
      </section>

      <section className="doc__principles" aria-label="Ocho postulados">
        {PRINCIPLES.map((p) => (
          <article key={p.n} id={id(`doc-p${p.n}`)} {...chunk('doc__principle')}>
            <h2>
              <span className="doc__n">{p.n}</span> {p.title}
            </h2>
            <p className="doc__p">{p.body}</p>
            {withNotes && (
              <details className="doc__note">
                <summary>Fundamento y relación con NEXUS OS</summary>
                <p>
                  Fuentes que sustentan este postulado:{' '}
                  {p.grounds.map((g, i) => (
                    <span key={g}>
                      {i > 0 && '; '}
                      <Cite id={g} />
                    </span>
                  ))}
                  .
                </p>
                <p>
                  Experiméntalo en:{' '}
                  {p.apps.map((a, i) => (
                    <span key={a}>
                      {i > 0 && ', '}
                      <button type="button" className="link-btn" onClick={() => openApp(a)}>
                        {APP_BY_ID[a].name}
                      </button>
                    </span>
                  ))}
                  .
                </p>
              </details>
            )}
          </article>
        ))}
      </section>

      <section id={id('doc-compromiso')} className="doc__section">
        <p {...chunk('doc__p')}>
          <RichText value={COMMITMENT} />
        </p>
        {CLOSING.map((p, i) => (
          <p key={i} {...chunk(`doc__p ${i > 0 ? 'doc__strong' : ''}`)}>
            <RichText value={p} />
          </p>
        ))}
      </section>

      <footer id={id('doc-firmas')} className="doc__signatures">
        <p {...chunk('doc__place')}>{PLACE_DATE}</p>
        <ul>
          {TEAM.map((m) => (
            <li key={m.initials}>
              <Badge member={m} size={40} />
              <span className="doc__sign">{m.name}</span>
              <span className="doc__role">{m.role}</span>
            </li>
          ))}
        </ul>
        <p className="doc__sign-note">Firmas tipográficas. Los cargos son una ficción editorial del proyecto, no credenciales profesionales.</p>
      </footer>
    </>
  );
}

export default function Documentos() {
  const { openApp, toast } = useOS();
  const intent = useIntent('documentos');
  const [scale, setScale] = usePersistent('documentos:scale', 1);
  const [signed, setSigned] = usePersistent('documentos:reached', false);
  const [view, setView] = usePersistent<View>('documentos:view', 'sintesis');
  const scrollRef = useRef<HTMLDivElement>(null);

  const switchView = (v: View) => {
    setView(v);
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const goTo = (id: string, full = false) => {
    if (full) setView('completo');
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), full ? 90 : 0);
  };

  useEffect(() => {
    if (!intent) return;
    if (intent.value === 'objecion') goTo('doc-objecion');
    else goTo(`doc-${intent.value}`, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent]);

  useEffect(() => {
    const targets = document.querySelectorAll('[data-reach]');
    if (!targets.length) return;
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setSigned(true), { threshold: 0.3 });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [setSigned, view]);

  const print = () => {
    toast({ title: 'Imprimir o guardar como PDF', body: 'En el diálogo de impresión elige «Guardar como PDF» para obtener el archivo.', tone: 'info' });
    window.setTimeout(() => window.print(), 300);
  };

  return (
    <div className={`doc ${view === 'sintesis' ? 'is-synth' : ''}`}>
      {view === 'completo' && (
        <nav className="doc__index" aria-label="Índice del manifiesto">
          <p className="eyebrow">Índice</p>
          <ul>
            {INDEX.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => goTo(i.id)}>
                  {i.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="doc__main">
        <div className="doc__toolbar" role="toolbar" aria-label="Herramientas del documento">
          <div className="segmented" role="radiogroup" aria-label="Vista del manifiesto">
            <button type="button" role="radio" aria-checked={view === 'sintesis'} className={view === 'sintesis' ? 'is-on' : ''} onClick={() => switchView('sintesis')}>
              Síntesis
            </button>
            <button type="button" role="radio" aria-checked={view === 'completo'} className={view === 'completo' ? 'is-on' : ''} onClick={() => switchView('completo')}>
              Texto completo
            </button>
          </div>
          {view === 'completo' && (
            <>
              <button type="button" className="btn btn--small" onClick={() => setScale((x) => Math.max(0.9, +(x - 0.1).toFixed(1)))} aria-label="Reducir tamaño del texto">
                A−
              </button>
              <button type="button" className="btn btn--small" onClick={() => setScale((x) => Math.min(1.4, +(x + 0.1).toFixed(1)))} aria-label="Aumentar tamaño del texto">
                A+
              </button>
            </>
          )}
          <span className="doc__toolbar-gap" />
          <button type="button" className="btn btn--small btn--primary" onClick={print}>
            Imprimir / Guardar PDF
          </button>
          <button type="button" className="btn btn--small" onClick={() => openApp('archivos')}>
            Ver fuentes
          </button>
        </div>

        <div
          ref={scrollRef}
          className="doc__scroll"
          onScroll={(e) => {
            // Respaldo del IntersectionObserver: marca la lectura al llegar al cierre.
            if (signed) return;
            const f = e.currentTarget.querySelector('[data-reach]');
            if (f && f.getBoundingClientRect().top < e.currentTarget.getBoundingClientRect().bottom - 120) setSigned(true);
          }}
        >
          {view === 'sintesis' ? (
            <Synthesis onOpen={(n) => goTo(`doc-p${n}`, true)} />
          ) : (
            <div className="doc__paper" style={{ fontSize: `${scale}rem` }}>
              <ManifestoText />
            </div>
          )}

          <section className="doc__after">
            <section className="doc__finale" data-reach aria-labelledby="doc-finale-title">
              <p className="doc__finale-stamp">
                <span>Publicado</span> {PLACE_DATE}
              </p>
              {view === 'sintesis' ? (
                <>
                  <p id="doc-finale-title" className="doc__finale-line">
                    No basta con que el sistema funcione.
                    <br />
                    Debemos poder defender la manera en que funciona.
                  </p>
                  <ul className="doc__finale-sign" aria-label="Firmantes">
                    {SIGNATORIES.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p id="doc-finale-title" className="doc__finale-line doc__finale-line--small">
                  Publicamos nuestros principios. Puedes leerlos, examinarlos y cuestionarlos.
                </p>
              )}
              <p className="doc__cta-text">{CALL_TO_ACTION}</p>
              <div className="pill-row">
                {view === 'sintesis' && (
                  <button type="button" className="btn btn--primary" onClick={() => switchView('completo')}>
                    Leer el texto completo
                  </button>
                )}
                <button type="button" className="btn" onClick={print}>
                  Imprimir / Guardar PDF
                </button>
                <button type="button" className="btn" onClick={() => openApp('archivos')}>
                  Consultar evidencias
                </button>
                <button type="button" className="btn" onClick={() => goTo('doc-objecion')}>
                  Escribir una objeción
                </button>
              </div>
            </section>

            <CompletionBar app="documentos" done={signed} />

            <Deeper title="Nota editorial: el género manifiesto" hint="Antecedentes y forma del texto">
                <p>
                  <Tag kind="evidencia">Nota editorial</Tag> Este manifiesto dialoga con dos antecedentes de la cultura digital: <Cite id="cluetrain1999" narrative /> y{' '}
                  <Cite id="newclues2015" narrative />. Sigue los rasgos del género que describe <Cite id="sastre2024" narrative />: un «nosotros» que expone por qué y
                  para qué se manifiesta, una lista de principios y un llamado a la acción. Sus afirmaciones de hecho remiten a las fuentes de Archivos; sus postulados
                  son nuestra postura.
                </p>
            </Deeper>

            <Objection />
          </section>
        </div>
      </div>

      {createPortal(
        <div className="print-root" aria-hidden="true">
          <ManifestoText withNotes={false} print />
          <section className="print-refs">
            <h2>Referencias citadas en el manifiesto</h2>
            <p>
              Vaccaro, M., Almaatouq, A., & Malone, T. (2024). When combinations of humans and AI are useful: A systematic review and meta-analysis. Nature Human
              Behaviour, 8(12), 2293–2303. https://doi.org/10.1038/s41562-024-02024-1
            </p>
            <p>Bibliografía completa en la aplicación Archivos de NEXUS OS.</p>
          </section>
        </div>,
        document.body,
      )}
    </div>
  );
}

/** Síntesis: los ocho postulados de un vistazo, con acceso al texto completo de cada uno. */
function Synthesis({ onOpen }: { onOpen: (n: string) => void }) {
  return (
    <div className="syn">
      <header className="syn__head">
        <p className="doc__eyebrow">Síntesis · Ocho postulados</p>
        <h1>
          {MANIFESTO_TITLE}
          <span className="doc__subtitle">{MANIFESTO_SUBTITLE}</span>
        </h1>
        <p className="syn__decl">
          <RichText value={DECLARATION} />
        </p>
        <p className="syn__hint">
          Cada tarjeta muestra un postulado y su compromiso central, citado del texto. El manifiesto completo, con fundamentos y firmas, está en «Texto completo».
        </p>
      </header>
      <ol className="syn__grid">
        {PRINCIPLES.map((p) => (
          <li key={p.n} className="syn__card">
            <span className="syn__n">{p.n}</span>
            <h2 className="syn__title">{p.title}</h2>
            <p className="syn__text">{lastSentence(p.body)}</p>
            <button type="button" className="link-btn syn__more" onClick={() => onOpen(p.n)}>
              Leer el postulado completo →
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Objection() {
  const [text, setText] = usePersistent('documentos:objection', '');
  const [target, setTarget] = usePersistent('documentos:target', 'general');
  const [status, setStatus] = useState('');

  const compose = () => {
    const p = PRINCIPLES.find((x) => x.n === target);
    const head = p ? `Objeción al postulado ${p.n} («${p.title}») del Manifiesto de NEXUS OS:` : 'Objeción al Manifiesto de NEXUS OS:';
    return `${head}\n\n${text.trim()}`;
  };

  const copy = async () => {
    if (!text.trim()) {
      setStatus('Escribe tu objeción antes de copiarla.');
      return;
    }
    try {
      await navigator.clipboard.writeText(compose());
      setStatus('Texto copiado al portapapeles. Puedes pegarlo donde quieras compartirlo.');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = compose();
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      setStatus(ok ? 'Texto copiado al portapapeles.' : 'No pudimos copiar el texto. Selecciónalo y cópialo manualmente.');
    }
  };

  return (
    <section id="doc-objecion" className="objection" aria-labelledby="obj-title">
      <h2 id="obj-title">Escribir una objeción</h2>
      <p className="muted">
        Tu objeción no se envía, no se publica y no se guarda en ningún servidor: permanece en este navegador y puedes copiarla para compartirla por el medio
        que elijas.
      </p>
      <label className="objection__label" htmlFor="obj-target">
        ¿Qué cuestionas?
      </label>
      <select id="obj-target" value={target} onChange={(e) => setTarget(e.target.value)}>
        <option value="general">El manifiesto en general</option>
        {PRINCIPLES.map((p) => (
          <option key={p.n} value={p.n}>
            {p.n} · {p.title}
          </option>
        ))}
      </select>
      <label className="objection__label" htmlFor="obj-text">
        Tu argumento
      </label>
      <textarea id="obj-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Por ejemplo: «Creo que el postulado 03 no considera…»" />
      <div className="pill-row">
        <button type="button" className="btn btn--primary" onClick={copy}>
          Copiar texto
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setText('');
            setStatus('Borrador eliminado de este navegador.');
          }}
        >
          Borrar borrador
        </button>
      </div>
      <p role="status" className="objection__status">
        {status}
      </p>
    </section>
  );
}
