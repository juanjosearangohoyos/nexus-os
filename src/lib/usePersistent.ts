import { useEffect, useState } from 'react';
import { load, save } from './storage';

/**
 * Estado que sobrevive al cerrar y reabrir una ventana (y a recargar la página).
 * Se usa para conservar los avances locales de cada aplicación.
 */
const memory = new Map<string, unknown>();

export function usePersistent<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (memory.has(key)) return memory.get(key) as T;
    return load(key, initial);
  });

  useEffect(() => {
    memory.set(key, value);
    save(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function clearPersistent(prefix: string): void {
  for (const k of [...memory.keys()]) if (k.startsWith(prefix)) memory.delete(k);
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('nexus-os:' + prefix)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignorar */
  }
}
