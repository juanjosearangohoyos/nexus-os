import type { SourceId } from './types';

/** Texto enriquecido mínimo: cadenas, negritas, cursivas y citas APA enlazadas. */
export type RichPart =
  | string
  | { b: string }
  | { i: string }
  | { cite: SourceId; narrative?: boolean; first?: boolean; locator?: string; claim?: string };

export type Rich = RichPart[];

export function plain(rich: Rich, citeToText?: (p: Extract<RichPart, { cite: SourceId }>) => string): string {
  return rich
    .map((p) => {
      if (typeof p === 'string') return p;
      if ('b' in p) return p.b;
      if ('i' in p) return p.i;
      return citeToText ? citeToText(p) : '';
    })
    .join('');
}
