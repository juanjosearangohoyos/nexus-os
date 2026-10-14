/** Almacenamiento local tolerante a fallos (modo privado, cookies bloqueadas, etc.). Nunca guarda datos personales. */
const PREFIX = 'nexus-os:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible: la experiencia sigue funcionando en memoria */
  }
}

export function sessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(PREFIX + key) === '1';
  } catch {
    return false;
  }
}

export function setSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(PREFIX + key, '1');
  } catch {
    /* ignorar */
  }
}
