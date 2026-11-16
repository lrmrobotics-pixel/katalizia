/**
 * Modelo 3D low-poly original de Kata: mismas proporciones e identidad que el sprite
 * (cabeza grande, orejas con interior rosa, gafas redondas, bata con corbata de acento).
 * Coordenadas: Y hacia arriba, Z hacia la cámara; los pies están en y ≈ −0,8.
 */
import type { KataPose } from '@/core/pet/animation';
import {
  box,
  cone,
  disc,
  ellipsoid,
  faceNormal,
  rotateAround,
  rotX,
  rotY,
  rotZ,
  scale,
  torus,
  transform,
  translate,
  type Face,
  type Mesh,
  type Vec3,
} from '@/core/render3d';

import { BASE_COLORS, type KataLook } from './catSprite';

const FUR = BASE_COLORS.F;
const FUR_LIGHT = '#EEF2FA';
const PINK = BASE_COLORS.P;
const INK = BASE_COLORS.K;
const LENS = BASE_COLORS.L;

/** Triángulo orientado hacia +Z (para el interior de las orejas). */
function frontTri(a: Vec3, b: Vec3, c: Vec3, color: string): Face {
  const v = [a, b, c];
  return { v: faceNormal(v)[2] < 0 ? [a, c, b] : v, color };
}

function eye(x: number, open: number, happy: boolean): Mesh {
  const c: Vec3 = [x, 1.25, 0.74];
  if (happy) {
    // Ojo en arco ("^"): media luna aplastada y levantada.
    return ellipsoid([x, 1.22, 0.76], [0.12, 0.05, 0.04], INK, 6, 4, { unlit: true });
  }
  const parts: Mesh = ellipsoid(c, [0.1, 0.13 * Math.max(0.06, open), 0.05], INK, 6, 4, { unlit: true });
  if (open > 0.3) parts.push(...ellipsoid([x + 0.035, 1.3, 0.79], [0.03, 0.03, 0.01], '#FFFFFF', 4, 3, { unlit: true }));
  return parts;
}

function mouth(shape: KataPose['mouth']): Mesh {
  const y = 0.86, z = 0.86;
  switch (shape) {
    case 'open':
      return [
        ...ellipsoid([0, y, z - 0.01], [0.11, 0.085, 0.03], '#7A2E45', 6, 4, { unlit: true }),
        ...ellipsoid([0, y - 0.04, z + 0.005], [0.06, 0.03, 0.02], PINK, 5, 3, { unlit: true }),
      ];
    case 'o':
      return ellipsoid([0, y - 0.01, z], [0.055, 0.07, 0.03], '#7A2E45', 6, 4, { unlit: true });
    case 'flat':
      return ellipsoid([0, y, z], [0.1, 0.018, 0.02], INK, 6, 3, { unlit: true });
    case 'wavy':
      return transform(ellipsoid([0, 0, 0], [0.1, 0.022, 0.02], INK, 6, 3, { unlit: true }), rotZ(0.35), translate([0, y, z]));
    case 'smile':
    default:
      return [
        ...transform(ellipsoid([0, 0, 0], [0.06, 0.02, 0.02], INK, 5, 3, { unlit: true }), rotZ(-0.45), translate([-0.05, y, z])),
        ...transform(ellipsoid([0, 0, 0], [0.06, 0.02, 0.02], INK, 5, 3, { unlit: true }), rotZ(0.45), translate([0.05, y, z])),
      ];
  }
}

function hat(kind: KataLook['hat']): Mesh {
  if (kind === 'birrete') {
    return [
      ...ellipsoid([0, 1.9, 0], [0.56, 0.2, 0.56], BASE_COLORS.H, 8, 4),
      ...transform(box([0, 0, 0], [1.25, 0.07, 1.25], BASE_COLORS.H), rotY(Math.PI / 4), translate([0, 2.06, 0])),
      ...ellipsoid([0, 2.12, 0], [0.07, 0.05, 0.07], BASE_COLORS.Y, 5, 3),
      ...box([0.62, 1.9, 0.0], [0.03, 0.32, 0.03], BASE_COLORS.Y),
      ...ellipsoid([0.62, 1.72, 0], [0.07, 0.07, 0.07], BASE_COLORS.Y, 5, 3),
    ];
  }
  if (kind === 'gorro') {
    return [
      ...ellipsoid([0, 1.72, -0.02], [0.92, 0.6, 0.86], BASE_COLORS.H, 10, 5),
      ...ellipsoid([0, 1.55, 0], [0.98, 0.17, 0.9], BASE_COLORS.Y, 10, 4),
      ...ellipsoid([0, 2.36, -0.02], [0.17, 0.17, 0.17], BASE_COLORS.Y, 6, 4),
    ];
  }
  return [];
}

function flask(): Mesh {
  const c: Vec3 = [0, 0, 0];
  return transform(
    [
      ...cone([c[0], -0.2, c[2]], 0.15, [c[0], 0.1, c[2]], BASE_COLORS.Q, 6),
      ...cone([c[0], -0.24, c[2]], 0.23, [c[0], 0.24, c[2]], LENS, 7, { opacity: 0.55 }),
      ...box([c[0], 0.3, c[2]], [0.1, 0.16, 0.1], LENS),
    ],
    translate([0.98, -0.16, 0.4]),
  );
}

/** Construye la malla completa para una pose y una apariencia. */
export function buildKata3D(pose: KataPose, look: KataLook): Mesh {
  const hasCoat = look.coat !== FUR;

  // ── Cabeza (todo lo que gira con ella) ──
  let head: Mesh = [
    ...ellipsoid([0, 1.2, 0], [0.95, 0.8, 0.82], FUR, 14, 9),
    ...ellipsoid([0, 0.93, 0.56], [0.42, 0.25, 0.28], FUR_LIGHT, 8, 4),
    ...ellipsoid([0, 1.03, 0.84], [0.085, 0.06, 0.05], PINK, 6, 3),
    ...mouth(pose.mouth),
    ...eye(-0.36, pose.eyeL, pose.happyEyes),
    ...eye(0.36, pose.eyeR, pose.happyEyes),
    ...torus([-0.36, 1.25, 0.82], 0.26, 0.045, [0, 0, 1], look.glasses, 10, 3),
    ...torus([0.36, 1.25, 0.82], 0.26, 0.045, [0, 0, 1], look.glasses, 10, 3),
    ...disc([-0.36, 1.25, 0.84], 0.24, [0, 0, 1], LENS, 10, { unlit: true, opacity: 0.28 }),
    ...disc([0.36, 1.25, 0.84], 0.24, [0, 0, 1], LENS, 10, { unlit: true, opacity: 0.28 }),
    ...box([0, 1.28, 0.86], [0.22, 0.05, 0.05], look.glasses),
    ...hat(look.hat),
  ];
  // Orejas: se inclinan según `earPerk`.
  for (const side of [-1, 1]) {
    const lean = (1 - pose.earPerk) * 0.35 * side;
    const ear: Mesh = [
      ...cone([side * 0.55, 1.78, 0], 0.3, [side * 0.8, 2.42, 0.02], FUR, 5),
      frontTri([side * 0.4, 1.9, 0.22], [side * 0.68, 1.92, 0.2], [side * 0.76, 2.28, 0.1], PINK),
    ];
    head.push(...rotateAround(ear, [side * 0.55, 1.78, 0], rotZ(-lean)));
  }
  head = rotateAround(head, [0, 0.55, 0], rotX(pose.headNod), rotZ(-pose.headTilt));

  // ── Brazos (giran desde el hombro) ──
  const arm = (side: -1 | 1, raise: number): Mesh =>
    rotateAround(
      [
        ...ellipsoid([side * 0.76, 0.2, 0.14], [0.19, 0.36, 0.19], hasCoat ? look.coat : FUR, 8, 5),
        ...ellipsoid([side * 0.8, -0.13, 0.2], [0.17, 0.15, 0.17], FUR, 7, 4),
      ],
      [side * 0.62, 0.52, 0.1],
      rotZ(side * raise),
    );

  // ── Cola (cadena de esferas solapadas detrás) ──
  const tail: Mesh = [];
  for (let i = 0; i < 6; i++) {
    const k = i / 5;
    const r = 0.13 - 0.035 * k;
    tail.push(...ellipsoid([0.4 + 0.42 * k, -0.55 + 1.0 * k ** 1.6, -0.5 - 0.1 * k], [r, r, r], FUR, 6, 4));
  }

  let body: Mesh = [
    ...ellipsoid([0, 0.05, 0], [0.7, 0.72, 0.6], hasCoat ? look.coat : FUR, 10, 6),
    ...ellipsoid([-0.32, -0.7, 0.3], [0.24, 0.13, 0.3], FUR, 6, 3),
    ...ellipsoid([0.32, -0.7, 0.3], [0.24, 0.13, 0.3], FUR, 6, 3),
    ...rotateAround(tail, [0.4, -0.55, -0.5], rotY(pose.tail), rotZ(pose.tail * 0.4)),
    ...arm(-1, pose.armL),
    ...arm(1, pose.armR),
    ...head,
  ];
  if (hasCoat) body.push(...cone([0, 0.56, 0.5], 0.1, [0, 0.08, 0.6], look.coatAccent, 4));
  if (look.back === 'mochila') body.push(...box([0, 0.15, -0.6], [0.9, 0.85, 0.38], BASE_COLORS.M));
  if (look.hand === 'matraz') body.push(...rotateAround(flask(), [0.62, 0.52, 0.1], rotZ(pose.armR)));

  // Respiración/aplastamiento desde los pies, balanceo, salto y giro global.
  body = transform(
    body,
    translate([0, 0.82, 0]),
    scale([1 + (1 - pose.squash) * 0.5, pose.squash, 1]),
    translate([0, -0.82, 0]),
  );
  body = rotateAround(body, [0, -0.8, 0], rotZ(pose.sway));
  return transform(body, rotY(pose.yaw), translate([0, pose.jump, 0]));
}

/** Rango vertical del modelo (para encuadrar la cámara). */
export const KATA3D_BOUNDS = { minY: -0.85, maxY: 2.5 };
