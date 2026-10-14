import type { ReactNode } from 'react';
import type { AppId, EvidenceKind } from '../../content/types';
import { APP_BY_ID } from '../../content/apps';
import { TOUR_STAGES, stageOf } from '../../content/tour';
import { MEMBER, type Member } from '../../content/team';
import { useOS } from '../os/OSContext';
import { asset } from '../../lib/useMedia';

const TAG_LABEL: Record<EvidenceKind, string> = {
  evidencia: 'Hecho documentado',
  postura: 'Nuestra interpretación',
  simulacion: 'Simulación',
  principio: 'Principio',
};

/** Etiqueta constante que distingue el estatuto de cada bloque. */
export function Tag({ kind, children }: { kind: EvidenceKind; children?: ReactNode }) {
  return (
    <span className={`tag tag--${kind}`}>
      <span className="tag__dot" aria-hidden="true" />
      {children ?? TAG_LABEL[kind]}
    </span>
  );
}

export function AppIcon({ id, size = 56, className = '' }: { id: AppId; size?: number; className?: string }) {
  const meta = APP_BY_ID[id];
  return <img className={`app-icon ${className}`} src={asset(meta.icon)} width={size} height={size} alt="" draggable={false} />;
}

/** Insignia geométrica abstracta + monograma tipográfico. No representa rostros ni figuras humanas. */
export function Badge({ member, size = 56 }: { member: Member; size?: number }) {
  const [c1, c2] = member.colors;
  const gid = `bdg-${member.initials}`;
  return (
    <svg className="badge" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`Monograma ${member.initials}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill="#0F1830" />
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${gid})`} opacity="0.22" />
      {member.badge === 'nodes' && (
        <g stroke={`url(#${gid})`} strokeWidth="2" fill="none" opacity="0.9">
          <path d="M12 46 L24 16 L40 40 L52 18" />
          <circle cx="12" cy="46" r="3" fill={c1} />
          <circle cx="24" cy="16" r="3" fill={c1} />
          <circle cx="40" cy="40" r="3" fill={c2} />
          <circle cx="52" cy="18" r="3" fill={c2} />
        </g>
      )}
      {member.badge === 'orbit' && (
        <g fill="none" stroke={`url(#${gid})`} strokeWidth="2" opacity="0.9">
          <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(-25 32 32)" />
          <ellipse cx="32" cy="32" rx="24" ry="9" transform="rotate(35 32 32)" />
        </g>
      )}
      {member.badge === 'link' && (
        <g fill="none" stroke={`url(#${gid})`} strokeWidth="2.4" opacity="0.9">
          <rect x="8" y="22" width="28" height="18" rx="9" transform="rotate(-30 22 31)" />
          <rect x="28" y="24" width="28" height="18" rx="9" transform="rotate(-30 42 33)" />
        </g>
      )}
      {member.badge === 'seal' && (
        <g fill="none" stroke={`url(#${gid})`} strokeWidth="2" opacity="0.9">
          <circle cx="32" cy="32" r="24" strokeDasharray="3 4" />
          <circle cx="32" cy="32" r="18" />
        </g>
      )}
      <text x="32" y="38.5" textAnchor="middle" fontFamily="Space Grotesk Variable, Inter Variable, sans-serif" fontWeight="700" fontSize="18" fill="#F3F7FF">
        {member.initials}
      </text>
    </svg>
  );
}

export function MemberChip({ initials }: { initials: Member['initials'] }) {
  const m = MEMBER[initials];
  return (
    <span className="member-chip">
      <Badge member={m} size={22} />
      {m.name}
    </span>
  );
}

/** Botón de navegación cruzada hacia otra aplicación. */
export function GoApp({ app, intent, children, variant = 'ghost' }: { app: AppId; intent?: string; children: ReactNode; variant?: 'ghost' | 'primary' }) {
  const { openApp } = useOS();
  return (
    <button type="button" className={`btn btn--${variant}`} onClick={() => openApp(app, intent)}>
      <AppIcon id={app} size={18} />
      {children}
    </button>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="btn btn--ghost" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(se abre en una pestaña nueva)</span>
    </a>
  );
}

/**
 * Cierre de cada app: el aprendizaje queda siempre visible (no se bloquea tras ejercicios),
 * el principio relacionado y la transición a la siguiente etapa del recorrido esencial.
 */
export function CompletionBar({ app, done, principle }: { app: AppId; done: boolean; principle?: { n: string; text: string } }) {
  const { openApp, state, tourGo } = useOS();
  const meta = APP_BY_ID[app];
  const s = stageOf(app);
  const stage = s >= 0 ? TOUR_STAGES[s] : null;
  const learning = stage ? stage.learning : meta.completion;

  let action: { label: string; run: () => void };
  if (stage) {
    const pos = stage.apps.indexOf(app);
    const sibling = stage.apps[pos + 1];
    const nextStage = TOUR_STAGES[s + 1];
    if (sibling) action = { label: `Ir a ${APP_BY_ID[sibling].name} →`, run: () => openApp(sibling) };
    else if (nextStage)
      action = {
        label: `Etapa ${s + 2} · ${nextStage.verb} →`,
        run: () => (state.tour.active ? tourGo(s + 1) : openApp(nextStage.apps[0])),
      };
    else action = { label: 'Consultar las fuentes en Archivos →', run: () => openApp('archivos') };
  } else if (state.tour.active) {
    action = { label: `Volver a la etapa ${state.tour.index + 1} →`, run: () => tourGo(state.tour.index) };
  } else {
    action = { label: 'Leer el manifiesto →', run: () => openApp('documentos') };
  }

  return (
    <div className={`completion ${done ? 'is-done' : ''}`}>
      <div className="completion__body">
        <p className="completion__eyebrow">
          <span className="completion__check" aria-hidden="true">{done ? '✓' : '→'}</span>
          {done ? 'Experiencia completada · Aprendizaje' : 'Aprendizaje'}
        </p>
        <p className="completion__msg">{learning}</p>
        {principle && (
          <p className="completion__principle">
            <Tag kind="principio">Postulado {principle.n}</Tag> «{principle.text}»{' '}
            <button type="button" className="link-btn" onClick={() => openApp('documentos', `p${principle.n}`)}>
              Leer en el manifiesto
            </button>
          </p>
        )}
      </div>
      <button type="button" className="btn btn--primary" onClick={action.run}>
        {action.label}
      </button>
    </div>
  );
}

/** Nivel 2 de lectura: profundización plegable («Comprender mejor», «Ver evidencia»…). */
export function Deeper({ title = 'Comprender mejor', hint, children, open = false }: { title?: string; hint?: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="deeper" open={open}>
      <summary>
        <span className="deeper__title">{title}</span>
        {hint && <span className="deeper__hint">{hint}</span>}
        <span className="deeper__chev" aria-hidden="true">⌄</span>
      </summary>
      <div className="deeper__body">{children}</div>
    </details>
  );
}

/** Cabecera de etapa: pregunta central y qué hacer. Solo aparece durante el recorrido esencial. */
export function StageBanner({ app }: { app: AppId }) {
  const { state } = useOS();
  const s = stageOf(app);
  if (!state.tour.active || s !== state.tour.index) return null;
  const stage = TOUR_STAGES[s];
  return (
    <div className="stage-banner" role="note" aria-label={`Etapa ${s + 1} de ${TOUR_STAGES.length}`}>
      <span className="stage-banner__n">{s + 1}</span>
      <div className="stage-banner__text">
        <p className="stage-banner__kicker">
          Etapa {s + 1} de {TOUR_STAGES.length} · {stage.verb} · {stage.title} · {stage.minutes}
        </p>
        <p className="stage-banner__q">{stage.question}</p>
        <p className="stage-banner__do">{stage.doThis}</p>
      </div>
    </div>
  );
}

/** Mensaje de bienvenida del integrante responsable de la aplicación (texto). */
export function WelcomeNote({ initials, title, text }: { initials: Member['initials']; title: string; text: string }) {
  const m = MEMBER[initials];
  return (
    <figure className="voice">
      <div className="voice__head">
        <Badge member={m} size={34} />
        <div>
          <figcaption className="voice__title">{title}</figcaption>
          <p className="voice__status">
            {m.name} · {m.role}
          </p>
        </div>
      </div>
      <blockquote className="voice__script">«{text}»</blockquote>
    </figure>
  );
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children && <div className="section-title__lead">{children}</div>}
    </header>
  );
}
