// Control editorial automático de NEXUS OS.
// Comprueba que la interfaz no muestre claves internas [Fxx], que no haya Wikipedia/Wikimedia,
// que cada fuente tenga URL y que existan los archivos multimedia referenciados.
// Uso: npm run check:content
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const errors = [];
const warnings = [];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk('src').filter((f) => /\.(tsx?|css)$/.test(f));
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  // Las claves internas solo pueden aparecer en el campo `internal` de sources.ts.
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (/\[F\d{2}b?\]/.test(line)) errors.push(`${f}:${i + 1} muestra una clave interna [Fxx] como cita.`);
    if (/wikipedia|wikimedia/i.test(line)) errors.push(`${f}:${i + 1} menciona Wikipedia/Wikimedia.`);
    if (/lorem ipsum/i.test(line)) errors.push(`${f}:${i + 1} contiene texto de relleno.`);
  });
}

// Fuentes: URL presente y DOI coherente.
const sources = readFileSync('src/content/sources.ts', 'utf8');
const blocks = sources.split(/\n  (?=[a-zA-Z0-9]+: \{\n)/).slice(1);
let count = 0;
for (const b of blocks) {
  const id = b.match(/^([a-zA-Z0-9]+):/)?.[1];
  if (!id) continue;
  count++;
  const url = b.match(/url: '([^']+)'/)?.[1];
  if (!url) errors.push(`Fuente ${id} sin URL.`);
  const doi = b.match(/doi: '([^']+)'/)?.[1];
  if (doi && !b.includes(`https://doi.org/${doi}`)) warnings.push(`Fuente ${id}: el DOI no aparece en formato https://doi.org/ en la referencia.`);
  if (/status: 'verificada con observaciones'/.test(b) && !/note:/.test(b)) errors.push(`Fuente ${id} con observaciones pero sin nota editorial.`);
}

// Multimedia referenciada.
const media = [
  'public/media/img/nasa-hd137010b-concepto.jpg',
  'public/media/video/nexus-os-introduccion.mp4',
  'public/media/video/nexus-os-introduccion.webm',
  'public/media/video/nexus-os-introduccion.es.vtt',
  'public/media/video/nexus-os-introduccion-poster.jpg',
  'public/media/audio/nexus-arranque.mp3',
  'public/icons/nexus-logo.svg',
  'public/icons/favicon.svg',
  ...['mensajes', 'asistente', 'enlace', 'pizarra', 'noticias', 'actividad', 'ajustes', 'documentos', 'archivos'].map((a) => `public/icons/${a}.svg`),
];
for (const m of media) if (!existsSync(m)) errors.push(`Falta el archivo multimedia ${m}.`);

console.log(`Fuentes revisadas: ${count}. Archivos de código revisados: ${files.length}. Multimedia esperada: ${media.length}.`);
warnings.forEach((w) => console.warn('Aviso:', w));
if (errors.length) {
  errors.forEach((e) => console.error('Error:', e));
  process.exit(1);
}
console.log('✓ Control editorial superado.');
