import { useEffect, useMemo, useRef, useState } from 'react';
import { usePersistent } from '../../lib/usePersistent';
import { useIntent, useOS } from '../../components/os/OSContext';
import { Reference } from '../../components/ui/Cite';
import { AppIcon, CompletionBar } from '../../components/ui/bits';
import { ACCESS_DATE, SOURCES, SOURCE_LIST, citeText } from '../../content/sources';
import { APPS, APP_BY_ID } from '../../content/apps';
import { CREDITS } from '../../content/credits';
import type { AppId, SourceId } from '../../content/types';
import './archivos.css';

type Section = 'todas' | 'creditos' | 'auditoria' | `app:${AppId}`;
type Status = '' | 'verificada' | 'obs';

const OBS_COUNT = SOURCE_LIST.filter((s) => s.status !== 'verificada').length;

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const TYPES = [...new Set(SOURCE_LIST.map((s) => s.type))].sort();
const CONCEPTS = [...new Set(SOURCE_LIST.flatMap((s) => s.concepts))].sort((a, b) => a.localeCompare(b, 'es'));
const INSTITUTIONS = [...new Set(SOURCE_LIST.map((s) => s.institution))].sort((a, b) => a.localeCompare(b, 'es'));
const yearKey = (y: string) => (y.startsWith('s.f.') ? 's.f.' : y.slice(-4));
const YEARS = [...new Set(SOURCE_LIST.map((s) => yearKey(s.year)))].sort();

export default function Archivos() {
  const intent = useIntent('archivos');
  const { openApp } = useOS();
  const [section, setSection] = usePersistent<Section>('archivos:section', 'todas');
  const [selected, setSelected] = usePersistent<SourceId>('archivos:sel', SOURCE_LIST[0].id);
  const [opened, setOpened] = usePersistent<string[]>('archivos:opened', []);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [concept, setConcept] = useState('');
  const [inst, setInst] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState<Status>('');
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!intent) return;
    if (intent.value.startsWith('src:')) {
      const id = intent.value.slice(4) as SourceId;
      if (SOURCES[id]) {
        setSection('todas');
        setSelected(id);
        setQ('');
        setType('');
        setConcept('');
        setInst('');
        setYear('');
        setStatus('');
      }
    } else if (intent.value.startsWith('app:')) {
      setSection(intent.value as Section);
    }
  }, [intent, setSection, setSelected]);

  const list = useMemo(() => {
    const t = norm(q.trim());
    return SOURCE_LIST.filter((s) => {
      if (section.startsWith('app:') && !s.apps.includes(section.slice(4) as AppId)) return false;
      if (type && s.type !== type) return false;
      if (concept && !s.concepts.includes(concept)) return false;
      if (inst && s.institution !== inst) return false;
      if (year && yearKey(s.year) !== year) return false;
      if (status === 'verificada' && s.status !== 'verificada') return false;
      if (status === 'obs' && s.status === 'verificada') return false;
      if (!t) return true;
      return norm(
        [citeText(s.id), s.institution, s.type, s.supports, s.note ?? '', s.reference.map((p) => (typeof p === 'string' ? p : p.i)).join(''), ...s.concepts].join(' '),
      ).includes(t);
    });
  }, [q, type, concept, inst, year, status, section]);

  // La ficha siempre corresponde a una referencia visible con los filtros actuales.
  const sel = list.find((s) => s.id === selected) ?? list[0] ?? null;
  useEffect(() => {
    if (sel && sel.id !== selected) setSelected(sel.id);
  }, [sel, selected, setSelected]);

  const filtered = Boolean(q || type || concept || inst || year || status);
  const clear = () => {
    setQ('');
    setType('');
    setConcept('');
    setInst('');
    setYear('');
    setStatus('');
  };
  const pick = (id: SourceId) => {
    setSelected(id);
    setOpened((o) => (o.includes(id) ? o : [...o, id]));
    if (window.matchMedia('(max-width: 980px)').matches) window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  return (
    <div className="fin">
      <aside className="fin__side" aria-label="Ubicaciones">
        <p className="fin__group">Biblioteca</p>
        <button type="button" className={`fin__loc ${section === 'todas' ? 'is-on' : ''}`} onClick={() => setSection('todas')}>
          <span className="fin__folder" aria-hidden="true" />
          Referencias académicas y oficiales
          <span className="fin__count">{SOURCE_LIST.length}</span>
        </button>
        <button type="button" className={`fin__loc ${section === 'creditos' ? 'is-on' : ''}`} onClick={() => setSection('creditos')}>
          <span className="fin__folder fin__folder--media" aria-hidden="true" />
          Créditos de imágenes, audio y video
          <span className="fin__count">{CREDITS.length}</span>
        </button>
        <button type="button" className={`fin__loc ${section === 'auditoria' ? 'is-on' : ''}`} onClick={() => setSection('auditoria')}>
          <span className="fin__folder fin__folder--audit" aria-hidden="true" />
          Enlaces y metadatos
        </button>
        <p className="fin__group">Por aplicación</p>
        {APPS.filter((a) => a.id !== 'archivos').map((a) => (
          <button key={a.id} type="button" className={`fin__loc ${section === `app:${a.id}` ? 'is-on' : ''}`} onClick={() => setSection(`app:${a.id}`)}>
            <AppIcon id={a.id} size={18} />
            {a.name}
            <span className="fin__count">{SOURCE_LIST.filter((s) => s.apps.includes(a.id)).length}</span>
          </button>
        ))}
      </aside>

      <section className="fin__main">
        {section === 'creditos' ? (
          <Credits />
        ) : section === 'auditoria' ? (
          <Audit />
        ) : (
          <>
            <div className="fin__toolbar">
              <div className="fin__search">
                <span aria-hidden="true">⌕</span>
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por autor, institución, tema o palabra clave…" aria-label="Buscar en la biblioteca" />
              </div>
              <div className="fin__filters">
                <label>
                  <span>Autor o institución</span>
                  <select value={inst} onChange={(e) => setInst(e.target.value)}>
                    <option value="">Todas</option>
                    {INSTITUTIONS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Año</span>
                  <select value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">Todos</option>
                    {YEARS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Concepto</span>
                  <select value={concept} onChange={(e) => setConcept(e.target.value)}>
                    <option value="">Todos</option>
                    {CONCEPTS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Tipo de documento</span>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Todos</option>
                    {TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="fin__status-row">
                <div className="segmented" role="radiogroup" aria-label="Estado de verificación">
                  {(
                    [
                      ['', `Todas (${SOURCE_LIST.length})`],
                      ['verificada', `Verificadas (${SOURCE_LIST.length - OBS_COUNT})`],
                      ['obs', `Con observaciones (${OBS_COUNT})`],
                    ] as [Status, string][]
                  ).map(([v, label]) => (
                    <button key={v || 'all'} type="button" role="radio" aria-checked={status === v} className={status === v ? 'is-on' : ''} onClick={() => setStatus(v)}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="fin__result" role="status" aria-live="polite">
                  {list.length === 1 ? '1 referencia' : `${list.length} referencias`}
                  {filtered && ` de ${SOURCE_LIST.length}`}
                </p>
                {filtered && (
                  <button type="button" className="btn btn--small" onClick={clear}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            {section.startsWith('app:') && (
              <p className="fin__crumb">
                Fuentes usadas en <strong>{APP_BY_ID[section.slice(4) as AppId].name}</strong> ·{' '}
                <button type="button" className="link-btn" onClick={() => setSection('todas')}>
                  Ver todas
                </button>
              </p>
            )}
            <div className="fin__split">
              <ul className="fin__list" aria-label="Referencias en orden alfabético">
                {list.length === 0 && <li className="fin__empty">Sin resultados. Ajusta la búsqueda o limpia los filtros.</li>}
                {list.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={`fin__row ${s.id === selected ? 'is-on' : ''}`}
                      aria-pressed={s.id === selected}
                      onClick={() => pick(s.id)}
                    >
                      <span className={`fin__doc fin__doc--${s.type === 'Artículo académico' ? 'art' : s.type === 'Libro' ? 'book' : 'web'}`} aria-hidden="true" />
                      <span className="fin__row-text">
                        <strong>{citeText(s.id)}</strong>
                        <span>
                          {s.type} · {s.institution}
                        </span>
                      </span>
                      {s.status !== 'verificada' && <span className="fin__flag">Con observaciones</span>}
                    </button>
                  </li>
                ))}
              </ul>

              {sel && (
                <article ref={detailRef} className="fin__detail" aria-labelledby="fin-title">
                  <div className="fin__detail-head">
                    <p className="eyebrow">{sel.type}</p>
                    <span className={`fin__badge ${sel.status === 'verificada' ? 'is-ok' : 'is-obs'}`}>
                      {sel.status === 'verificada' ? 'Verificada' : 'Con observaciones'}
                    </span>
                  </div>
                  <h3 id="fin-title">{citeText(sel.id)}</h3>
                  {sel.note && (
                    <section className={`fin__note ${sel.status === 'verificada' ? '' : 'is-obs'}`}>
                      <h4>{sel.status === 'verificada' ? 'Nota de verificación' : 'Observación de verificación'}</h4>
                      <p>{sel.note}</p>
                    </section>
                  )}
                  <section>
                    <h4>Referencia APA 7</h4>
                    <p className="apa-ref">
                      <Reference id={sel.id} />
                    </p>
                  </section>
                  <section>
                    <h4>Afirmación que respalda</h4>
                    <p>{sel.supports}</p>
                  </section>
                  <section>
                    <h4>Cita en el texto</h4>
                    <p>
                      Parentética: {citeText(sel.id)} · Narrativa: {citeText(sel.id, { narrative: true })}
                    </p>
                  </section>
                  <section>
                    <h4>Dónde se usa · ver contexto</h4>
                    <div className="pill-row">
                      {sel.apps.map((a) => (
                        <button key={a} type="button" className="btn btn--small" onClick={() => openApp(a)}>
                          <AppIcon id={a} size={16} />
                          {APP_BY_ID[a].name}
                        </button>
                      ))}
                    </div>
                  </section>
                  <dl className="fin__meta">
                    <div>
                      <dt>Estado</dt>
                      <dd className={sel.status === 'verificada' ? 'ok' : 'warn'}>{sel.status === 'verificada' ? 'Verificada' : 'Verificada con observaciones'}</dd>
                    </div>
                    <div>
                      <dt>Consulta</dt>
                      <dd>{ACCESS_DATE}</dd>
                    </div>
                    <div>
                      <dt>Conceptos</dt>
                      <dd>{sel.concepts.join(', ')}</dd>
                    </div>
                    <div>
                      <dt>{sel.doi ? 'DOI' : 'URL'}</dt>
                      <dd className="fin__url">{sel.doi ? `https://doi.org/${sel.doi}` : sel.url}</dd>
                    </div>
                  </dl>
                  <a className="btn btn--primary" href={sel.url} target="_blank" rel="noopener noreferrer">
                    Consultar documento original ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </article>
              )}
            </div>
            <CompletionBar app="archivos" done={opened.length >= 3} />
          </>
        )}
      </section>
    </div>
  );
}

function Credits() {
  return (
    <div className="credits">
      <header>
        <h3>Créditos de fotografías, ilustraciones, audio y video</h3>
        <p className="muted">
          Fichas independientes de las referencias académicas. Los materiales elaborados con asistencia de IA están identificados como tales. No usamos fotografías,
          retratos ni avatares de los integrantes.
        </p>
      </header>
      <ul className="credits__list">
        {CREDITS.map((c) => (
          <li key={c.id} className="credits__item">
            <div className="credits__head">
              <strong>{c.title}</strong>
              <span className="credits__type">{c.type}</span>
              {c.aiAssisted && <span className="credits__ai">Elaborado con asistencia de IA</span>}
            </div>
            <dl>
              <div>
                <dt>Autoría</dt>
                <dd>{c.creator}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>{c.date}</dd>
              </div>
              <div>
                <dt>Archivo</dt>
                <dd className="fin__url">{c.file}</dd>
              </div>
              <div>
                <dt>Licencia / permiso</dt>
                <dd>{c.license}</dd>
              </div>
              <div>
                <dt>Modificación</dt>
                <dd>{c.modification}</dd>
              </div>
              <div>
                <dt>Texto alternativo</dt>
                <dd>{c.alt}</dd>
              </div>
            </dl>
            {c.url && (
              <a className="link-btn" href={c.url} target="_blank" rel="noopener noreferrer">
                Ver procedencia ↗
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Audit() {
  const missing = SOURCE_LIST.filter((s) => !s.url);
  return (
    <div className="credits">
      <header>
        <h3>Enlaces y metadatos</h3>
        <p className="muted">
          Comprobación manual realizada el {ACCESS_DATE}. Esta página no consulta los enlaces en tiempo real: un sitio estático no puede verificarlos sin un servidor.
          Las observaciones también figuran en docs/AUDITORIA_FUENTES.md.
        </p>
      </header>
      <table className="audit">
        <thead>
          <tr>
            <th scope="col">Cita</th>
            <th scope="col">Enlace</th>
            <th scope="col">DOI</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {SOURCE_LIST.map((s) => (
            <tr key={s.id}>
              <td>{citeText(s.id)}</td>
              <td>{s.url ? 'Comprobado' : 'Falta'}</td>
              <td>{s.doi ? 'Sí' : '—'}</td>
              <td className={s.status === 'verificada' ? 'ok' : 'warn'}>{s.status === 'verificada' ? 'Verificada' : 'Con observaciones'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted">
        Fuentes sin URL: {missing.length}. Fuentes con observaciones: {SOURCE_LIST.filter((s) => s.status !== 'verificada').length} (detalle en cada ficha).
      </p>
    </div>
  );
}
