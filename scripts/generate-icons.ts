/**
 * Genera los iconos PNG de la app a partir del sprite original del gato.
 * Uso: npm run icons   (Node ≥ 23.6, ejecuta TypeScript con type stripping nativo)
 * Sin dependencias: codificador PNG mínimo con zlib.
 */
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

import { ACCESSORIES, composeCat, SPRITE_H, SPRITE_W } from '../src/components/pet/catSprite.ts';

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf: Buffer) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type: string, data: Buffer) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

function png(size: number, pixel: (x: number, y: number) => [number, number, number, number]) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixel(x, y);
      const o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const hex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const BG = hex('#070B1F');

const { grid, colors } = composeCat('feliz', { accessories: ACCESSORIES.filter((a) => a.id === 'bata-clasica') });

/** Dibuja el gato centrado ocupando `fill` (0–1) del lienzo. */
function render(size: number, fill: number, background: boolean, mono = false) {
  const scale = Math.floor((size * fill) / Math.max(SPRITE_W, SPRITE_H));
  const ox = Math.floor((size - SPRITE_W * scale) / 2);
  const oy = Math.floor((size - SPRITE_H * scale) / 2);
  return png(size, (x, y) => {
    const sx = Math.floor((x - ox) / scale);
    const sy = Math.floor((y - oy) / scale);
    const ch = sx >= 0 && sy >= 0 && sx < SPRITE_W && sy < SPRITE_H ? grid[sy][sx] : '.';
    if (ch !== '.') return mono ? [255, 255, 255, 255] : [...hex(colors[ch]!), 255];
    return background ? [...BG, 255] : [0, 0, 0, 0];
  });
}

const out = 'assets/images/';
writeFileSync(out + 'icon.png', render(1024, 0.8, true));
writeFileSync(out + 'android-icon-foreground.png', render(1024, 0.55, false));
writeFileSync(out + 'android-icon-background.png', png(1024, () => [...BG, 255]));
writeFileSync(out + 'android-icon-monochrome.png', render(1024, 0.55, false, true));
writeFileSync(out + 'splash-icon.png', render(512, 0.9, false));
writeFileSync(out + 'favicon.png', render(48, 1, true));
console.log('Iconos generados en', out);
