// Exporta los íconos SVG originales de NEXUS OS a PNG (512 px y 180 px) en public/icons/png.
// Uso: npm run icons:png
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const SRC = 'public/icons';
const OUT = join(SRC, 'png');
mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.svg'))) {
  const svg = readFileSync(join(SRC, file), 'utf8');
  for (const size of [512, 180]) {
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
    const name = `${basename(file, '.svg')}${size === 512 ? '' : `-${size}`}.png`;
    writeFileSync(join(OUT, name), png);
    console.log('✓', join(OUT, name));
  }
}
