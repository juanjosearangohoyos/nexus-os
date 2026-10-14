import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import type { AppId, SourceId, WindowId } from '../../content/types';
import { APP_BY_ID } from '../../content/apps';
import { TOUR_STAGES, stageOf } from '../../content/tour';
import { load, save, sessionFlag, setSessionFlag } from '../../lib/storage';
import { setSoundEnabled, sfx, startAmbient, stopAmbient } from '../../lib/sound';

export interface WinState {
  id: WindowId;
  minimized: boolean;
  maximized: boolean;
  z: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Prefs {
  sound: boolean;
  ambient: boolean;
  captions: boolean;
  /** null = seguir la preferencia del sistema operativo del visitante. */
  reduceMotion: boolean | null;
  staticWallpaper: boolean;
  largeText: boolean;
}

export interface Toast {
  id: number;
  title: string;
  body?: string;
  action?: { label: string; app: AppId; intent?: string };
  tone?: 'info' | 'success' | 'attention';
}

export interface Intent {
  value: string;
  nonce: number;
}

interface OSState {
  phase: 'boot' | 'desktop';
  windows: WinState[];
  focused: WindowId | null;
  zTop: number;
  /** index = etapa del recorrido esencial (0–5). */
  tour: { active: boolean; index: number };
  /** Etapas recorridas (no confundir con aplicaciones abiertas). */
  stagesSeen: number[];
  visited: AppId[];
  overlay: null | 'launcher' | 'control';
  source: { id: SourceId; claim?: string } | null;
  toasts: Toast[];
  intents: Partial<Record<WindowId, Intent>>;
  prefs: Prefs;
}

type Action =
  | { type: 'open'; id: WindowId; intent?: string; geometry: Omit<WinState, 'id' | 'z' | 'minimized'> }
  | { type: 'close'; id: WindowId }
  | { type: 'minimize'; id: WindowId }
  | { type: 'toggleMax'; id: WindowId }
  | { type: 'focus'; id: WindowId }
  | { type: 'move'; id: WindowId; x: number; y: number }
  | { type: 'resize'; id: WindowId; w: number; h: number }
  | { type: 'place'; id: WindowId; geometry: Pick<WinState, 'x' | 'y' | 'w' | 'h' | 'maximized'> }
  | { type: 'minimizeAll' }
  | { type: 'phase'; phase: OSState['phase'] }
  | { type: 'tour'; active: boolean; index: number }
  | { type: 'overlay'; overlay: OSState['overlay'] }
  | { type: 'source'; source: OSState['source'] }
  | { type: 'toast'; toast: Toast }
  | { type: 'dismissToast'; id: number }
  | { type: 'pref'; prefs: Partial<Prefs> }
  | { type: 'resetProgress' };

const DEFAULT_PREFS: Prefs = {
  sound: false,
  ambient: false,
  captions: true,
  reduceMotion: null,
  staticWallpaper: false,
  largeText: false,
};

function reducer(state: OSState, a: Action): OSState {
  switch (a.type) {
    case 'open': {
      const z = state.zTop + 1;
      const existing = state.windows.find((w) => w.id === a.id);
      const windows = existing
        ? state.windows.map((w) => (w.id === a.id ? { ...w, minimized: false, z } : w))
        : [...state.windows, { id: a.id, minimized: false, z, ...a.geometry }];
      const visited =
        a.id !== 'about' && !state.visited.includes(a.id as AppId) ? [...state.visited, a.id as AppId] : state.visited;
      const intents = a.intent ? { ...state.intents, [a.id]: { value: a.intent, nonce: Date.now() } } : state.intents;
      return { ...state, windows, focused: a.id, zTop: z, visited, intents, overlay: null };
    }
    case 'close': {
      const windows = state.windows.filter((w) => w.id !== a.id);
      return { ...state, windows, focused: topVisible(windows) };
    }
    case 'minimize': {
      const windows = state.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w));
      return { ...state, windows, focused: topVisible(windows) };
    }
    case 'toggleMax':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, maximized: !w.maximized } : w)) };
    case 'focus': {
      if (state.focused === a.id) return state;
      const z = state.zTop + 1;
      return {
        ...state,
        zTop: z,
        focused: a.id,
        windows: state.windows.map((w) => (w.id === a.id ? { ...w, z, minimized: false } : w)),
      };
    }
    case 'move':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, x: a.x, y: a.y } : w)) };
    case 'resize':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, w: a.w, h: a.h } : w)) };
    case 'place':
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, ...a.geometry } : w)) };
    case 'minimizeAll':
      return { ...state, windows: state.windows.map((w) => ({ ...w, minimized: true })), focused: null };
    case 'phase':
      return { ...state, phase: a.phase };
    case 'tour': {
      const stagesSeen = a.active && !state.stagesSeen.includes(a.index) ? [...state.stagesSeen, a.index] : state.stagesSeen;
      return { ...state, tour: { active: a.active, index: a.index }, stagesSeen };
    }
    case 'overlay':
      return { ...state, overlay: a.overlay };
    case 'source':
      return { ...state, source: a.source };
    case 'toast':
      return { ...state, toasts: [...state.toasts.filter((t) => t.title !== a.toast.title), a.toast].slice(-3) };
    case 'dismissToast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== a.id) };
    case 'pref':
      return { ...state, prefs: { ...state.prefs, ...a.prefs } };
    case 'resetProgress':
      return { ...state, visited: [], stagesSeen: [], tour: { active: false, index: 0 } };
  }
}

function topVisible(ws: WinState[]): WindowId | null {
  const v = ws.filter((w) => !w.minimized).sort((a, b) => b.z - a.z);
  return v[0]?.id ?? null;
}

const MENU_H = 34;
const DOCK_RESERVE = 104;

function computeGeometry(id: WindowId, openCount: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const compact = vw < 1100 || vh < 680;
  const isAbout = id === 'about';
  // Las ventanas crecen en monitores grandes para aprovechar el ancho disponible.
  const w = Math.min(isAbout ? 900 : Math.max(1120, Math.round(vw * 0.78)), isAbout ? 900 : 1560, vw - 120);
  const h = Math.min(isAbout ? 680 : Math.max(740, Math.round(vh * 0.8)), vh - MENU_H - DOCK_RESERVE - 12);
  const step = (openCount % 6) * 28;
  const x = Math.max(16, Math.round((vw - w) / 2) - 84 + step);
  const y = Math.max(MENU_H + 10, Math.round(MENU_H + (vh - MENU_H - DOCK_RESERVE - h) / 2) - 20 + step);
  return { x, y, w, h, maximized: compact };
}

/** Mosaico izquierda/derecha para etapas con dos aplicaciones (solo en pantallas amplias). */
function tileGeometry(side: 0 | 1) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw < 1280 || vh < 700) return null;
  const gap = 12;
  const w = Math.floor((vw - gap * 3) / 2);
  const h = vh - MENU_H - DOCK_RESERVE - 16;
  return { x: gap + side * (w + gap), y: MENU_H + 8, w, h, maximized: false };
}

interface OSApi {
  state: OSState;
  reducedMotion: boolean;
  openApp: (id: WindowId, intent?: string) => void;
  closeWin: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  toggleMax: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  move: (id: WindowId, x: number, y: number) => void;
  resize: (id: WindowId, w: number, h: number) => void;
  enterDesktop: (mode: 'tour' | 'free' | 'team' | 'settings') => void;
  showBoot: () => void;
  startTour: (from?: number) => void;
  tourGo: (index: number) => void;
  endTour: () => void;
  toDesktop: () => void;
  setOverlay: (o: OSState['overlay']) => void;
  openSource: (id: SourceId, claim?: string) => void;
  closeSource: () => void;
  toast: (t: Omit<Toast, 'id'>) => void;
  dismissToast: (id: number) => void;
  setPrefs: (p: Partial<Prefs>) => void;
  resetProgress: () => void;
}

const Ctx = createContext<OSApi | null>(null);

export function useOS(): OSApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useOS fuera de OSProvider');
  return v;
}

/** Devuelve la intención (sección o filtro) con la que se abrió una ventana. */
export function useIntent(id: WindowId): Intent | undefined {
  return useOS().state.intents[id];
}

function hashApp(): AppId | null {
  const m = window.location.hash.match(/^#\/([a-z]+)/);
  if (m && m[1] in APP_BY_ID) return m[1] as AppId;
  return null;
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, (): OSState => ({
    phase: sessionFlag('booted') ? 'desktop' : 'boot',
    windows: [],
    focused: null,
    zTop: 10,
    tour: (() => {
      const t = load('tour', { active: false, index: 0 });
      return { active: t.active, index: Math.max(0, Math.min(TOUR_STAGES.length - 1, t.index)) };
    })(),
    stagesSeen: load<number[]>('stagesSeen', []).filter((n) => n >= 0 && n < TOUR_STAGES.length),
    visited: load<AppId[]>('visited', []),
    overlay: null,
    source: null,
    toasts: [],
    intents: {},
    prefs: { ...DEFAULT_PREFS, ...load<Partial<Prefs>>('prefs', {}), sound: false, ambient: false },
  }));

  const stateRef = useRef(state);
  stateRef.current = state;
  // Ruta con la que se cargó la página (se captura antes de que el hash se sincronice).
  const initialApp = useRef<AppId | null>(hashApp());

  const systemReduce = useSystemReducedMotion();
  const reducedMotion = state.prefs.reduceMotion ?? systemReduce;

  // Persistencia (sin datos personales).
  useEffect(() => save('prefs', { ...state.prefs, sound: false, ambient: false }), [state.prefs]);
  useEffect(() => save('visited', state.visited), [state.visited]);
  useEffect(() => save('tour', state.tour), [state.tour]);
  useEffect(() => save('stagesSeen', state.stagesSeen), [state.stagesSeen]);

  // Clases globales de accesibilidad.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', reducedMotion);
    root.classList.toggle('large-text', state.prefs.largeText);
    root.classList.toggle('no-captions', !state.prefs.captions);
  }, [reducedMotion, state.prefs.largeText, state.prefs.captions]);

  useEffect(() => {
    setSoundEnabled(state.prefs.sound);
    if (state.prefs.sound && state.prefs.ambient) startAmbient();
    else stopAmbient();
  }, [state.prefs.sound, state.prefs.ambient]);

  const openApp = useCallback((id: WindowId, intent?: string) => {
    const s = stateRef.current;
    const existing = s.windows.find((w) => w.id === id);
    if (!existing || existing.minimized) sfx.open();
    if (s.phase === 'boot') {
      setSessionFlag('booted');
      dispatch({ type: 'phase', phase: 'desktop' });
    }
    dispatch({ type: 'open', id, intent, geometry: computeGeometry(id, s.windows.length) });
    // Si el recorrido está activo y se abre una app de otra etapa, el indicador la sigue.
    const k = id === 'about' ? -1 : stageOf(id as AppId);
    if (s.tour.active && k >= 0 && k !== s.tour.index) dispatch({ type: 'tour', active: true, index: k });
  }, []);

  const closeWin = useCallback((id: WindowId) => {
    sfx.close();
    dispatch({ type: 'close', id });
  }, []);
  const minimize = useCallback((id: WindowId) => {
    sfx.minimize();
    dispatch({ type: 'minimize', id });
  }, []);
  const toggleMax = useCallback((id: WindowId) => dispatch({ type: 'toggleMax', id }), []);
  const focus = useCallback((id: WindowId) => dispatch({ type: 'focus', id }), []);
  const move = useCallback((id: WindowId, x: number, y: number) => dispatch({ type: 'move', id, x, y }), []);
  const resize = useCallback((id: WindowId, w: number, h: number) => dispatch({ type: 'resize', id, w, h }), []);

  const toastCounter = useRef(1);
  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastCounter.current++;
    dispatch({ type: 'toast', toast: { ...t, id } });
  }, []);
  const dismissToast = useCallback((id: number) => dispatch({ type: 'dismissToast', id }), []);

  const tourGo = useCallback(
    (index: number) => {
      const s = stateRef.current;
      const clamped = Math.max(0, Math.min(TOUR_STAGES.length - 1, index));
      const stage = TOUR_STAGES[clamped];
      // Las ventanas de otras etapas se minimizan al Dock (se conservan sus avances).
      s.windows
        .filter((w) => !w.minimized && !stage.apps.includes(w.id as AppId))
        .forEach((w) => dispatch({ type: 'minimize', id: w.id }));
      dispatch({ type: 'tour', active: true, index: clamped });
      // Etapas con dos apps: se abren en mosaico; la primera queda enfocada.
      [...stage.apps].reverse().forEach((app) => {
        openApp(app);
        const side = stage.apps.length > 1 ? (stage.apps.indexOf(app) as 0 | 1) : null;
        const tile = side === null ? null : tileGeometry(side);
        if (tile) dispatch({ type: 'place', id: app, geometry: tile });
      });
    },
    [openApp],
  );

  const startTour = useCallback((from = 0) => tourGo(from), [tourGo]);
  const endTour = useCallback(() => dispatch({ type: 'tour', active: false, index: stateRef.current.tour.index }), []);
  const toDesktop = useCallback(() => {
    sfx.minimize();
    dispatch({ type: 'minimizeAll' });
  }, []);

  const enterDesktop = useCallback(
    (mode: 'tour' | 'free' | 'team' | 'settings') => {
      setSessionFlag('booted');
      dispatch({ type: 'phase', phase: 'desktop' });
      const pending = initialApp.current ?? hashApp();
      initialApp.current = null;
      if (mode === 'tour') startTour(0);
      else if (mode === 'team') openApp('about');
      else if (mode === 'settings') dispatch({ type: 'overlay', overlay: 'control' });
      else if (pending) openApp(pending);
      window.setTimeout(
        () =>
          toast({
            title: 'Se ha encontrado una actualización de principios: DOCUMENTOS 1.0',
            body: 'Publicamos nuestros principios. Puedes leerlos, examinarlos y cuestionarlos.',
            action: { label: 'Leer cuando quieras', app: 'documentos' },
            tone: 'info',
          }),
        mode === 'tour' ? 2600 : 1200,
      );
    },
    [openApp, startTour, toast],
  );

  const showBoot = useCallback(() => dispatch({ type: 'phase', phase: 'boot' }), []);
  const setOverlay = useCallback((o: OSState['overlay']) => dispatch({ type: 'overlay', overlay: o }), []);
  const openSource = useCallback((id: SourceId, claim?: string) => {
    sfx.click();
    dispatch({ type: 'source', source: { id, claim } });
  }, []);
  const closeSource = useCallback(() => dispatch({ type: 'source', source: null }), []);
  const setPrefs = useCallback((p: Partial<Prefs>) => dispatch({ type: 'pref', prefs: p }), []);
  const resetProgress = useCallback(() => dispatch({ type: 'resetProgress' }), []);

  // Enrutado por hash compatible con GitHub Pages (sin 404 al recargar).
  useEffect(() => {
    if (state.phase !== 'desktop') return;
    const target = state.focused && state.focused !== 'about' ? `#/${state.focused}` : '#/';
    if (window.location.hash !== target) window.history.replaceState(null, '', target);
  }, [state.focused, state.phase]);

  useEffect(() => {
    const onHash = () => {
      const id = hashApp();
      if (id && stateRef.current.focused !== id) openApp(id);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [openApp]);

  // Si se recarga en una ruta de app con la sesión ya iniciada, abrir esa app.
  useEffect(() => {
    if (state.phase === 'desktop' && state.windows.length === 0 && initialApp.current) {
      openApp(initialApp.current);
      initialApp.current = null;
    }
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const api = useMemo<OSApi>(
    () => ({
      state,
      reducedMotion,
      openApp,
      closeWin,
      minimize,
      toggleMax,
      focus,
      move,
      resize,
      enterDesktop,
      showBoot,
      startTour,
      tourGo,
      endTour,
      toDesktop,
      setOverlay,
      openSource,
      closeSource,
      toast,
      dismissToast,
      setPrefs,
      resetProgress,
    }),
    [state, reducedMotion, openApp, closeWin, minimize, toggleMax, focus, move, resize, enterDesktop, showBoot, startTour, tourGo, endTour, toDesktop, setOverlay, openSource, closeSource, toast, dismissToast, setPrefs, resetProgress],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

function useSystemReducedMotion(): boolean {
  const q = '(prefers-reduced-motion: reduce)';
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false);
  const [v, setV] = useReducer((_: boolean, n: boolean) => n, undefined, get);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setV(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return v;
}
