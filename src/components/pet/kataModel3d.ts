/**
 * Modelo 3D low-poly original de Kata: mismas proporciones e identidad que el sprite
 * (cabeza grande, orejas con interior rosa, gafas redondas, bata con corbata de acento).
 * Coordenadas: Y hacia arriba, Z hacia la cámara; los pies están en y ≈ −0,8.
 *
 * Rendimiento: cada pieza se teselea una sola vez por apariencia (caché) y en cada cuadro
 * solo cambian sus matrices (cabeza, orejas, brazos, cola, ojos…).
 */
import type { KataPose } from '@/core/pet/animation';
import {
  box,
  cone,
  disc,
  ellipsoid,
  faceNormal,
  flatten,
  mAround,
  mRotX,
  mRotY,
  mRotZ,
  mScale,
  mTranslate,
  mul,
  mulAll,
  rotY,
  rotZ,
  torus,
  transform,
  translate,
  type Face,
  type Instance,
  type Mat,
  type Mesh,
  type Vec3,
} from '@/core/render3d';

import { BASE_COLORS, type KataLook } from './catSprite';

const FUR = BASE_COLORS.F;
const FUR_LIGHT = '#EEF2FA';
const PINK = BASE_COLORS.P;
const INK = BASE_COLORS.K;
const LENS = BASE_COLORS.L;
const EYE_Y = 1.25;
const EYE_X = 0.36;

/** Triángulo orientado hacia +Z (para el interior de las orejas). */
function frontTri(a: Vec3, b: Vec3, c: Vec3, color: string): Face {
  const v = [a, b, c];
  return { v: faceNormal(v)[2] < 0 ? [a, c, b] : v, color };
}

function mouthMesh(shape: KataPose['mouth']): Mesh {
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

function hatMesh(kind: KataLook['hat']): Mesh {
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

interface Parts {
  head: Mesh;
  ears: [Mesh, Mesh];
  eyeOpen: Mesh;
  eyeHappy: Mesh;
  highlight: Mesh;
  mouths: Record<KataPose['mouth'], Mesh>;
  arms: [Mesh, Mesh];
  flask: Mesh;
  tail: Mesh;
  body: Mesh;
}

const cache = new Map<string, Parts>();

function partsFor(look: KataLook): Parts {
  const key = JSON.stringify(look);
  const hit = cache.get(key);
  if (hit) return hit;
  const hasCoat = look.coat !== FUR;
  const coat = hasCoat ? look.coat : FUR;
  const ear = (side: number): Mesh => [
    ...cone([side * 0.55, 1.78, 0], 0.3, [side * 0.8, 2.42, 0.02], FUR, 5),
    frontTri([side * 0.4, 1.9, 0.22], [side * 0.68, 1.92, 0.2], [side * 0.76, 2.28, 0.1], PINK),
  ];
  const arm = (side: number): Mesh => [
    ...ellipsoid([side * 0.76, 0.2, 0.14], [0.19, 0.36, 0.19], coat, 8, 5),
    ...ellipsoid([side * 0.8, -0.13, 0.2], [0.17, 0.15, 0.17], FUR, 7, 4),
  ];
  const tail: Mesh = [];
  for (let i = 0; i < 6; i++) {
    const k = i / 5;
    const r = 0.13 - 0.035 * k;
    tail.push(...ellipsoid([0.4 + 0.42 * k, -0.55 + 1.0 * k ** 1.6, -0.5 - 0.1 * k], [r, r, r], FUR, 6, 4));
  }
  const body: Mesh = [
    ...ellipsoid([0, 0.05, 0], [0.7, 0.72, 0.6], coat, 10, 6),
    ...ellipsoid([-0.32, -0.7, 0.3], [0.24, 0.13, 0.3], FUR, 6, 3),
    ...ellipsoid([0.32, -0.7, 0.3], [0.24, 0.13, 0.3], FUR, 6, 3),
  ];
  if (hasCoat) body.push(...cone([0, 0.56, 0.5], 0.1, [0, 0.08, 0.6], look.coatAccent, 4));
  if (look.back === 'mochila') body.push(...box([0, 0.15, -0.6], [0.9, 0.85, 0.38], BASE_COLORS.M));
  const flask: Mesh =
    look.hand === 'matraz'
      ? transform(
          [
            ...cone([0, -0.2, 0], 0.15, [0, 0.1, 0], BASE_COLORS.Q, 6),
            ...cone([0, -0.24, 0], 0.23, [0, 0.24, 0], LENS, 7, { opacity: 0.55 }),
            ...box([0, 0.3, 0], [0.1, 0.16, 0.1], LENS),
          ],
          translate([0.98, -0.16, 0.4]),
        )
      : [];
  const parts: Parts = {
    head: [
      ...ellipsoid([0, 1.2, 0], [0.95, 0.8, 0.82], FUR, 14, 9),
      ...ellipsoid([0, 0.93, 0.56], [0.42, 0.25, 0.28], FUR_LIGHT, 8, 4),
      ...ellipsoid([0, 1.03, 0.84], [0.085, 0.06, 0.05], PINK, 6, 3),
      ...torusRing(-EYE_X, look.glasses),
      ...torusRing(EYE_X, look.glasses),
      ...disc([-EYE_X, EYE_Y, 0.84], 0.24, [0, 0, 1], LENS, 10, { unlit: true, opacity: 0.28 }),
      ...disc([EYE_X, EYE_Y, 0.84], 0.24, [0, 0, 1], LENS, 10, { unlit: true, opacity: 0.28 }),
      ...box([0, 1.28, 0.86], [0.22, 0.05, 0.05], look.glasses),
      ...hatMesh(look.hat),
    ],
    ears: [ear(-1), ear(1)],
    // Ojo centrado en el origen: se escala en Y según la apertura y se coloca con su matriz.
    eyeOpen: ellipsoid([0, 0, 0], [0.1, 0.13, 0.05], INK, 6, 4, { unlit: true }),
    eyeHappy: ellipsoid([0, -0.03, 0.02], [0.12, 0.05, 0.04], INK, 6, 4, { unlit: true }),
    highlight: ellipsoid([0.035, 0.05, 0.05], [0.03, 0.03, 0.01], '#FFFFFF', 4, 3, { unlit: true }),
    mouths: {
      smile: mouthMesh('smile'),
      open: mouthMesh('open'),
      o: mouthMesh('o'),
      flat: mouthMesh('flat'),
      wavy: mouthMesh('wavy'),
    },
    arms: [arm(-1), arm(1)],
    flask,
    tail,
    body,
  };
  cache.set(key, parts);
  return parts;
}

function torusRing(x: number, color: string): Mesh {
  return torus([x, EYE_Y, 0.82], 0.26, 0.045, [0, 0, 1], color, 10, 3);
}

/** Piezas con su matriz para una pose (lo que se dibuja en cada cuadro). */
export function kataInstances(pose: KataPose, look: KataLook): Instance[] {
  const P = partsFor(look);
  // Global: aplastamiento desde los pies → balanceo → giro → salto.
  const squash = mulAll(mTranslate([0, -0.82, 0]), mScale([1 + (1 - pose.squash) * 0.5, pose.squash, 1]), mTranslate([0, 0.82, 0]));
  const G = mulAll(mTranslate([0, pose.jump, 0]), mRotY(pose.yaw), mAround([0, -0.8, 0], mRotZ(pose.sway)), squash);
  const H = mul(G, mAround([0, 0.55, 0], mul(mRotZ(-pose.headTilt), mRotX(pose.headNod))));
  const out: Instance[] = [
    { mesh: P.body, m: G },
    { mesh: P.tail, m: mul(G, mAround([0.4, -0.55, -0.5], mul(mRotZ(pose.tail * 0.4), mRotY(pose.tail)))) },
    { mesh: P.arms[0], m: mul(G, mAround([-0.62, 0.52, 0.1], mRotZ(-pose.armL))) },
    { mesh: P.arms[1], m: mul(G, mAround([0.62, 0.52, 0.1], mRotZ(pose.armR))) },
    { mesh: P.head, m: H },
    { mesh: P.mouths[pose.mouth], m: H },
  ];
  if (P.flask.length) out.push({ mesh: P.flask, m: mul(G, mAround([0.62, 0.52, 0.1], mRotZ(pose.armR))) });
  ([-1, 1] as const).forEach((side, i) => {
    const lean = (1 - pose.earPerk) * 0.35 * side;
    out.push({ mesh: P.ears[i], m: mul(H, mAround([side * 0.55, 1.78, 0], mRotZ(-lean))) });
    const open = side < 0 ? pose.eyeL : pose.eyeR;
    const place: Mat = mTranslate([side * EYE_X, EYE_Y, 0.74]);
    if (pose.happyEyes) out.push({ mesh: P.eyeHappy, m: mul(H, place) });
    else {
      out.push({ mesh: P.eyeOpen, m: mulAll(H, place, mScale([1, Math.max(0.06, open), 1])) });
      if (open > 0.3) out.push({ mesh: P.highlight, m: mul(H, place) });
    }
  });
  return out;
}

/** Malla completa ya transformada (pruebas y usos sin animación). */
export function buildKata3D(pose: KataPose, look: KataLook): Mesh {
  return flatten(kataInstances(pose, look));
}

/** Rango vertical del modelo (para encuadrar la cámara). */
export const KATA3D_BOUNDS = { minY: -0.85, maxY: 2.5 };
