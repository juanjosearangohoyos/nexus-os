import { useEffect, useMemo, useRef, useState } from 'react';
import { useOS } from './OSContext';
import { APPS, APP_BY_ID } from '../../content/apps';
import { PRINCIPLES } from '../../content/manifesto';
import { SOURCE_LIST } from '../../content/sources';
import { NEWS } from '../../content/noticias';
import { TENSIONS } from '../../content/actividad';
import { SETTINGS } from '../../content/ajustes';
import type { AppId, WindowId } from '../../content/types';
import { asset } from '../../lib/useMedia';

interface Entry {
  key: string;
  group: string;
  title: string;
  subtitle: string;
  app: WindowId;
  intent?: string;
  haystack: string;
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function buildIndex(): Entry[] {
  const e: Entry[] = [];
  for (const a of APPS)
    e.push({ key: `app-${a.id}`, group: 'Aplicaciones', title: a.name, subtitle: `${a.topic} · ${a.summary}`, app: a.id, haystack: norm([a.name, a.topic, a.summary, ...a.keywords].join(' ')) });
  e.push({ key: 'about', group: 'Aplicaciones', title: 'Acerca de NEXUS OS', subtitle: 'Equipo de desarrollo, roles y declaraciones', app: 'about', haystack: norm('acerca equipo desarrolladores autores valentina juan roman sebastian camacho juan jose arango') });
  for (const p of PRINCIPLES)
    e.push({ key: `p${p.n}`, group: 'Manifiesto', title: `${p.n} · ${p.title}`, subtitle: p.body, app: 'documentos', intent: `p${p.n}`, haystack: norm(`${p.n} ${p.title} ${p.body} postulado principio`) });
  for (const n of NEWS)
    e.push({ key: `n-${n.id}`, group: 'Noticias', title: n.title, subtitle: `${n.kicker} · ${n.dateLabel}`, app: 'noticias', intent: n.id, haystack: norm(`${n.title} ${n.kicker} ${n.institution} ${n.stance}`) });
  for (const t of TENSIONS)
    e.push({ key: `t-${t.id}`, group: 'Actividad', title: `${t.opportunity} / ${t.risk}`, subtitle: `Medida: ${t.measure}`, app: 'actividad', intent: t.id, haystack: norm(`${t.opportunity} ${t.risk} ${t.measure} ${t.domain}`) });
  for (const s of SETTINGS)
    e.push({ key: `s-${s.id}`, group: 'Ajustes', title: s.label, subtitle: s.on, app: 'ajustes', intent: s.id, haystack: norm(`${s.label} ${s.on} ${s.off}`) });
  for (const s of SOURCE_LIST)
    e.push({ key: `src-${s.id}`, group: 'Fuentes', title: `${s.citeAuthor} (${s.year})`, subtitle: s.supports, app: 'archivos', intent: `src:${s.id}`, haystack: norm(`${s.citeAuthor} ${s.year} ${s.institution} ${s.type} ${s.concepts.join(' ')} ${s.supports}`) });
  return e;
}

/** Búsqueda y lanzador de aplicaciones (Ctrl + K). */
export function Launcher() {
  const { setOverlay, openApp, startTour, state } = useOS();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const index = useMemo(buildIndex, []);

  useEffect(() => input.current?.focus(), []);

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return [];
    const words = t.split(/\s+/);
    return index
      .filter((e) => words.every((w) => e.haystack.includes(w) || norm(e.title).includes(w)))
      .slice(0, 24);
  }, [q, index]);

  const choose = (e: Entry) => {
    setOverlay(null);
    openApp(e.app, e.intent);
  };

  const onKey = (ev: React.KeyboardEvent) => {
    if (!results.length) return;
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      choose(results[sel]);
    }
  };

  let lastGroup = '';

  return (
    <div className="popover-backdrop popover-backdrop--center" onClick={() => setOverlay(null)}>
      <div className="launcher glass" role="dialog" aria-modal="true" aria-label="Buscar en NEXUS OS" onClick={(e) => e.stopPropagation()}>
        <div className="launcher__search">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            type="search"
            value={q}
            placeholder="Buscar apps, postulados, casos, fuentes…"
            aria-label="Buscar"
            aria-controls="launcher-results"
            aria-activedescendant={results[sel] ? `lr-${results[sel].key}` : undefined}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
          />
          <kbd>Esc</kbd>
        </div>

        {!q.trim() ? (
          <div className="launcher__home">
            <h2 className="launcher__h">Aplicaciones</h2>
            <ul className="launcher__grid">
              {APPS.map((a) => (
                <li key={a.id}>
                  <button type="button" onClick={() => { setOverlay(null); openApp(a.id); }}>
                    <img src={asset(a.icon)} alt="" width={52} height={52} />
                    <span>{a.name}</span>
                    {state.visited.includes(a.id) && <span className="launcher__seen" aria-label="visitada">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
            <h2 className="launcher__h">Recomendado</h2>
            <div className="launcher__recos">
              <button type="button" className="reco" onClick={() => { setOverlay(null); startTour(state.tour.active ? state.tour.index : 0); }}>
                <strong>{state.tour.active ? 'Continuar recorrido esencial' : 'Iniciar recorrido esencial'}</strong>
                <span>Seis etapas, unos 7 minutos: de Conectar a Declarar. Noticias y Archivos quedan para profundizar.</span>
              </button>
              <button type="button" className="reco" onClick={() => { setOverlay(null); openApp('documentos'); }}>
                <strong>Leer el manifiesto</strong>
                <span>Ocho postulados, compromisos y firmas.</span>
              </button>
              <button type="button" className="reco" onClick={() => { setOverlay(null); openApp('about'); }}>
                <strong>Conocer al equipo</strong>
                <span>Cuatro desarrolladores, cuatro responsabilidades.</span>
              </button>
            </div>
          </div>
        ) : (
          <ul id="launcher-results" className="launcher__results" role="listbox" aria-label="Resultados">
            {results.length === 0 && <li className="launcher__empty">Sin resultados para «{q}». Prueba con «colectiva», «Vaccaro» o «privacidad».</li>}
            {results.map((r, i) => {
              const header = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              const icon = r.app === 'about' ? 'icons/nexus-logo.svg' : APP_BY_ID[r.app as AppId].icon;
              return (
                <li key={r.key} role="presentation">
                  {header && <p className="launcher__group">{header}</p>}
                  <button
                    id={`lr-${r.key}`}
                    type="button"
                    role="option"
                    aria-selected={i === sel}
                    className={`launcher__result ${i === sel ? 'is-sel' : ''}`}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => choose(r)}
                  >
                    <img src={asset(icon)} alt="" width={28} height={28} />
                    <span>
                      <strong>{r.title}</strong>
                      <span className="launcher__sub">{r.subtitle}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
