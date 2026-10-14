import type { SourceId } from '../../content/types';
import { SOURCES } from '../../content/sources';
import { useOS } from '../os/OSContext';
import type { Rich } from '../../content/rich';

interface CiteProps {
  id: SourceId;
  narrative?: boolean;
  first?: boolean;
  locator?: string;
  /** Afirmación concreta que respalda la cita en este lugar (se muestra en la ficha). */
  claim?: string;
}

/** Cita APA 7 visible y accionable: abre la ficha con la referencia completa. */
export function Cite({ id, narrative, first, locator, claim }: CiteProps) {
  const { openSource } = useOS();
  const s = SOURCES[id];
  const author = first && s.firstMention ? s.firstMention : s.narrativeAuthor ?? s.citeAuthor;
  const loc = locator ? `, ${locator}` : '';
  const label = narrative ? (
    <>
      {author} ({s.year}
      {loc})
    </>
  ) : (
    <>
      ({author}, {s.year}
      {loc})
    </>
  );
  return (
    <button
      type="button"
      className={`cite${narrative ? ' cite--narrative' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        openSource(id, claim);
      }}
      aria-label={`Ver referencia: ${s.citeAuthor}, ${s.year}`}
      title="Ver referencia APA 7"
    >
      {label}
    </button>
  );
}

/** Renderiza texto enriquecido con citas enlazadas. */
export function RichText({ value }: { value: Rich }) {
  return (
    <>
      {value.map((p, i) => {
        if (typeof p === 'string') return <span key={i}>{p}</span>;
        if ('b' in p) return <strong key={i}>{p.b}</strong>;
        if ('i' in p) return <em key={i}>{p.i}</em>;
        return <Cite key={i} id={p.cite} narrative={p.narrative} first={p.first} locator={p.locator} claim={p.claim} />;
      })}
    </>
  );
}

/** Referencia completa con cursivas APA. */
export function Reference({ id }: { id: SourceId }) {
  return (
    <>
      {SOURCES[id].reference.map((p, i) => (typeof p === 'string' ? <span key={i}>{p}</span> : <em key={i}>{p.i}</em>))}
    </>
  );
}
