import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { WindowId } from '../../content/types';

/** Cada aplicación se carga bajo demanda; mientras tanto se muestra un esqueleto de carga. */
export const APP_COMPONENTS: Record<WindowId, LazyExoticComponent<ComponentType>> = {
  mensajes: lazy(() => import('../../apps/mensajes/Mensajes')),
  asistente: lazy(() => import('../../apps/asistente/Asistente')),
  enlace: lazy(() => import('../../apps/enlace/Enlace')),
  pizarra: lazy(() => import('../../apps/pizarra/Pizarra')),
  noticias: lazy(() => import('../../apps/noticias/Noticias')),
  actividad: lazy(() => import('../../apps/actividad/Actividad')),
  ajustes: lazy(() => import('../../apps/ajustes/Ajustes')),
  documentos: lazy(() => import('../../apps/documentos/Documentos')),
  archivos: lazy(() => import('../../apps/archivos/Archivos')),
  about: lazy(() => import('../../apps/about/AboutNexus')),
};

export function AppSkeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Abriendo…">
      <div className="skeleton__side">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="skeleton__main">
        <span className="w60" />
        <span className="w90" />
        <span className="w80" />
        <span className="block" />
        <span className="w70" />
      </div>
      <span className="sr-only">Abriendo…</span>
    </div>
  );
}
