import { useState } from 'react';
import { useOS } from '../../components/os/OSContext';
import { AppIcon, Badge } from '../../components/ui/bits';
import { CHORAL_LINE, TEAM, type Member } from '../../content/team';
import { APP_BY_ID } from '../../content/apps';
import { asset } from '../../lib/useMedia';
import './about.css';

export default function AboutNexus() {
  const { startTour, openApp } = useOS();
  return (
    <div className="about">
      <header className="about__hero">
        <img src={asset('icons/nexus-logo.svg')} alt="" width={96} height={96} />
        <div>
          <h2>NEXUS OS</h2>
          <p className="about__version">Versión 1.0 · Octubre de 2026</p>
          <p className="about__slogan">Diferentes formas de pensar. Una nueva forma de crear.</p>
        </div>
      </header>

      <section className="about__intro">
        <p>
          Creamos NEXUS OS para explorar cómo pensamos y creamos juntos. Es un manifiesto interactivo sobre las inteligencias colectiva, artificial e híbrida, y
          sobre cómo transforman la comunicación, la creatividad y la colaboración.
        </p>
        <dl className="about__facts">
          <div>
            <dt>Proyecto</dt>
            <dd>Manifiesto de inteligencias en la cibercultura</dd>
          </div>
          <div>
            <dt>Asignatura</dt>
            <dd>Ciberculturas</dd>
          </div>
          <div>
            <dt>Institución</dt>
            <dd>Pontificia Universidad Javeriana Cali</dd>
          </div>
          <div>
            <dt>Año</dt>
            <dd>2026</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="team-title">
        <h3 id="team-title" className="about__h3">
          Equipo de desarrollo
        </h3>
        <p className="about__note">
          Los cargos son una ficción editorial del proyecto, no credenciales profesionales. Representamos a cada integrante con su monograma y una insignia
          geométrica original.
        </p>
        <ul className="about__team">
          {TEAM.map((m) => (
            <MemberCard key={m.initials} m={m} />
          ))}
        </ul>
      </section>

      <footer className="about__sign">
        <p className="about__choral">{CHORAL_LINE}</p>
        <p className="about__signature">Valentina Giraldo · Juan Román · Sebastián Camacho · Juan José Arango</p>
        <div className="pill-row">
          <button type="button" className="btn btn--primary" onClick={() => startTour(0)}>
            Iniciar recorrido
          </button>
          <button type="button" className="btn" onClick={() => openApp('documentos')}>
            Leer el manifiesto
          </button>
        </div>
      </footer>
    </div>
  );
}

function MemberCard({ m }: { m: Member }) {
  const [view, setView] = useState<'none' | 'postura' | 'resp'>('none');
  const { openApp } = useOS();

  return (
    <li className="member" style={{ ['--m1' as string]: m.colors[0], ['--m2' as string]: m.colors[1] }}>
      <div className="member__head">
        <Badge member={m} size={64} />
        <div>
          <p className="member__name">{m.name}</p>
          <p className="member__role">{m.role}</p>
          <p className="member__area">{m.area}</p>
        </div>
      </div>
      <blockquote className="member__quote">«{m.statement}»</blockquote>
      <div className="member__apps">
        {m.apps.map((a) => (
          <button key={a} type="button" className="member__app" onClick={() => openApp(a)} title={`Abrir ${APP_BY_ID[a].name}`}>
            <AppIcon id={a} size={22} />
            <span className="sr-only">Abrir {APP_BY_ID[a].name}</span>
          </button>
        ))}
      </div>
      <div className="pill-row">
        <button type="button" className="btn btn--small" aria-expanded={view === 'postura'} onClick={() => setView(view === 'postura' ? 'none' : 'postura')}>
          Leer su postura
        </button>
        <button type="button" className="btn btn--small" aria-expanded={view === 'resp'} onClick={() => setView(view === 'resp' ? 'none' : 'resp')}>
          Ver responsabilidades
        </button>
      </div>
      {view === 'postura' && (
        <div className="member__more">
          <p className="member__more-title">{m.welcomeTitle}</p>
          <p>«{m.welcomeText}»</p>
        </div>
      )}
      {view === 'resp' && (
        <ul className="member__resp">
          {m.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
