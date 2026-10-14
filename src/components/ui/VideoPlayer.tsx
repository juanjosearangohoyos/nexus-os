import { useEffect, useRef, useState } from 'react';
import { useOS } from '../os/OSContext';
import { asset } from '../../lib/useMedia';

/** Reproductor de video real (WebM/MP4) con subtítulos WebVTT. Sin reproducción automática. */
export function VideoPlayer({ src, poster, captions, title, description }: { src: string; poster: string; captions: string; title: string; description: string }) {
  const { state } = useOS();
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    for (const t of Array.from(v.textTracks)) t.mode = state.prefs.captions ? 'showing' : 'hidden';
  }, [state.prefs.captions]);

  return (
    <figure className="video">
      {failed ? (
        <div className="video__error" role="alert">
          No pudimos cargar el video. Intenta nuevamente o revisa la transcripción en docs/GUIONES_Y_TRANSCRIPCIONES.md.
        </div>
      ) : (
        <video
          ref={ref}
          controls
          preload="metadata"
          playsInline
          poster={asset(poster)}
          onError={() => setFailed(true)}
          onLoadedMetadata={(e) => {
            for (const t of Array.from(e.currentTarget.textTracks)) t.mode = state.prefs.captions ? 'showing' : 'hidden';
          }}
          aria-describedby="video-desc"
        >
          <source src={asset(`${src}.webm`)} type="video/webm" />
          <source src={asset(`${src}.mp4`)} type="video/mp4" />
          <track kind="captions" srcLang="es" label="Español" src={asset(captions)} default />
        </video>
      )}
      <figcaption>
        <strong>{title}</strong>
        <span id="video-desc">{description}</span>
      </figcaption>
    </figure>
  );
}
