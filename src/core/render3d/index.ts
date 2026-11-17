/**
 * Motor 3D mínimo (sin dependencias, sin React) para personajes low-poly:
 * mallas reales en 3D, transformaciones, cámara en perspectiva, eliminación de caras
 * traseras, ordenación por profundidad (algoritmo del pintor) e iluminación Lambert
 * con sombreado por bandas (estilo "toon"). El resultado son polígonos 2D listos para SVG.
 *
 * Se eligió en lugar de expo-gl/three para no añadir dependencias nativas (las mejoras
 * llegan al APK instalado por EAS Update) y para que funcione igual en web y Android.
 */

export type Vec3 = [number, number, number];

export interface Face {
  /** Vértices en sentido antihorario vistos desde fuera (para el cálculo de la normal). */
  v: Vec3[];
  color: string;
  /** Sin iluminación (ojos, brillos): se dibuja con su color tal cual. */
  unlit?: boolean;
  opacity?: number;
}

export type Mesh = Face[];

// ── Álgebra ─────────────────────────────────────────────────────────────

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export function normalize(a: Vec3): Vec3 {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}

/** Normal de una cara (regla de la mano derecha sobre los tres primeros vértices). */
export function faceNormal(v: Vec3[]): Vec3 {
  return normalize(cross(sub(v[1], v[0]), sub(v[2], v[0])));
}

export const rotX = (a: number) => (p: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};
export const rotY = (a: number) => (p: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};
export const rotZ = (a: number) => (p: Vec3): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
};
export const translate = (t: Vec3) => (p: Vec3): Vec3 => add(p, t);
export const scale = (k: Vec3) => (p: Vec3): Vec3 => [p[0] * k[0], p[1] * k[1], p[2] * k[2]];

/** Aplica transformaciones en orden a toda la malla. */
export function transform(mesh: Mesh, ...fns: ((p: Vec3) => Vec3)[]): Mesh {
  return mesh.map((f) => ({ ...f, v: f.v.map((p) => fns.reduce((q, fn) => fn(q), p)) }));
}

/** Gira la malla alrededor de un pivote. */
export function rotateAround(mesh: Mesh, pivot: Vec3, ...rots: ((p: Vec3) => Vec3)[]): Mesh {
  return transform(mesh, translate([-pivot[0], -pivot[1], -pivot[2]]), ...rots, translate(pivot));
}

// ── Primitivas ──────────────────────────────────────────────────────────

/** Elipsoide (esfera escalada) con `seg` divisiones de longitud y `rings` de latitud. */
export function ellipsoid(center: Vec3, r: Vec3, color: string, seg = 10, rings = 7, extra: Partial<Face> = {}): Mesh {
  const pt = (i: number, j: number): Vec3 => {
    const th = (i / seg) * Math.PI * 2;
    const ph = (j / rings) * Math.PI;
    return [
      center[0] + r[0] * Math.sin(ph) * Math.sin(th),
      center[1] + r[1] * Math.cos(ph),
      center[2] + r[2] * Math.sin(ph) * Math.cos(th),
    ];
  };
  const faces: Mesh = [];
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < seg; i++) {
      const a = pt(i, j), b = pt(i + 1, j), c = pt(i + 1, j + 1), d = pt(i, j + 1);
      // En los polos dos vértices coinciden: se emite un triángulo.
      const v = j === 0 ? [a, c, d] : j === rings - 1 ? [a, b, c] : [a, d, c, b];
      faces.push({ v: j === 0 || j === rings - 1 ? v.reverse() : v, color, ...extra });
    }
  }
  return fixWinding(faces, center);
}

/** Cono con base circular centrada en `base`, eje hacia `tip`. */
export function cone(base: Vec3, radius: number, tip: Vec3, color: string, seg = 6, extra: Partial<Face> = {}): Mesh {
  const axis = normalize(sub(tip, base));
  const helper: Vec3 = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = normalize(cross(axis, helper));
  const w = cross(axis, u);
  const ring = Array.from({ length: seg }, (_, i): Vec3 => {
    const t = (i / seg) * Math.PI * 2;
    return add(base, add(scaleVec(u, Math.cos(t) * radius), scaleVec(w, Math.sin(t) * radius)));
  });
  const faces: Mesh = ring.map((p, i) => ({ v: [p, ring[(i + 1) % seg], tip], color, ...extra }));
  faces.push({ v: [...ring].reverse(), color, ...extra });
  const centroid = scaleVec(add(scaleVec(base, 3), tip), 0.25);
  return fixWinding(faces, centroid);
}

/** Toroide (anillo de las gafas) en el plano perpendicular a `normalDir`. */
export function torus(center: Vec3, R: number, r: number, normalDir: Vec3, color: string, seg = 12, tube = 4): Mesh {
  const n = normalize(normalDir);
  const helper: Vec3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = normalize(cross(n, helper));
  const w = cross(n, u);
  const pt = (i: number, j: number): Vec3 => {
    const a = (i / seg) * Math.PI * 2;
    const b = (j / tube) * Math.PI * 2;
    const dir = add(scaleVec(u, Math.cos(a)), scaleVec(w, Math.sin(a)));
    const ringC = add(center, scaleVec(dir, R));
    return add(ringC, add(scaleVec(dir, r * Math.cos(b)), scaleVec(n, r * Math.sin(b))));
  };
  const faces: Mesh = [];
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < tube; j++) {
      const v = [pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1)];
      // Orientación hacia fuera respecto al centro del tubo.
      const a = (i + 0.5) / seg * Math.PI * 2;
      const tubeC = add(center, scaleVec(add(scaleVec(u, Math.cos(a)), scaleVec(w, Math.sin(a))), R));
      const face = { v, color };
      faces.push(dot(faceNormal(v), sub(centroidOf(v), tubeC)) < 0 ? { ...face, v: [...v].reverse() } : face);
    }
  }
  return faces;
}

/** Disco plano (cristal de las gafas), una sola cara orientada hacia `normalDir`. */
export function disc(center: Vec3, radius: number, normalDir: Vec3, color: string, seg = 12, extra: Partial<Face> = {}): Mesh {
  const n = normalize(normalDir);
  const helper: Vec3 = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const u = normalize(cross(n, helper));
  const w = cross(n, u);
  const v = Array.from({ length: seg }, (_, i): Vec3 => {
    const t = (i / seg) * Math.PI * 2;
    return add(center, add(scaleVec(u, Math.cos(t) * radius), scaleVec(w, Math.sin(t) * radius)));
  });
  const face: Face = { v, color, ...extra };
  return [dot(faceNormal(v), n) < 0 ? { ...face, v: [...v].reverse() } : face];
}

/** Caja alineada con los ejes. */
export function box(center: Vec3, size: Vec3, color: string): Mesh {
  const [x, y, z] = center;
  const [w, h, d] = [size[0] / 2, size[1] / 2, size[2] / 2];
  const P = (sx: number, sy: number, sz: number): Vec3 => [x + sx * w, y + sy * h, z + sz * d];
  const quads: Vec3[][] = [
    [P(-1, -1, 1), P(1, -1, 1), P(1, 1, 1), P(-1, 1, 1)],
    [P(1, -1, -1), P(-1, -1, -1), P(-1, 1, -1), P(1, 1, -1)],
    [P(-1, 1, 1), P(1, 1, 1), P(1, 1, -1), P(-1, 1, -1)],
    [P(-1, -1, -1), P(1, -1, -1), P(1, -1, 1), P(-1, -1, 1)],
    [P(1, -1, 1), P(1, -1, -1), P(1, 1, -1), P(1, 1, 1)],
    [P(-1, -1, -1), P(-1, -1, 1), P(-1, 1, 1), P(-1, 1, -1)],
  ];
  return fixWinding(quads.map((v) => ({ v, color })), center);
}

const scaleVec = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
export function centroidOf(v: Vec3[]): Vec3 {
  const s = v.reduce((acc, p) => add(acc, p), [0, 0, 0] as Vec3);
  return scaleVec(s, 1 / v.length);
}

/** Asegura que todas las normales apuntan hacia fuera de un sólido convexo. */
function fixWinding(faces: Mesh, inside: Vec3): Mesh {
  return faces.map((f) => (dot(faceNormal(f.v), sub(centroidOf(f.v), inside)) < 0 ? { ...f, v: [...f.v].reverse() } : f));
}

// ── Color ───────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Multiplica el brillo de un color (k ≥ 0) y lo devuelve en hex. */
export function shade(hex: string, k: number): string {
  const [r, g, b] = hexToRgb(hex);
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x * k)));
  return `#${[c(r), c(g), c(b)].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

// ── Cámara y render ─────────────────────────────────────────────────────

export interface Camera {
  /** Distancia de la cámara al origen sobre el eje +Z (mirando hacia −Z). */
  distance: number;
  /** Distancia focal en unidades de pantalla. */
  focal: number;
  /** Centro de la imagen en pantalla. */
  cx: number;
  cy: number;
}

export interface RenderedPolygon {
  points: string;
  fill: string;
  opacity: number;
  depth: number;
}

export interface RenderOptions {
  light?: Vec3;
  ambient?: number;
  /** Número de bandas de luz (0 = sombreado continuo). */
  bands?: number;
}

/** Proyecta un punto en perspectiva. Y crece hacia arriba en el mundo y hacia abajo en pantalla. */
export function project(p: Vec3, cam: Camera): [number, number, number] {
  const z = cam.distance - p[2];
  const k = cam.focal / Math.max(0.01, z);
  return [cam.cx + p[0] * k, cam.cy - p[1] * k, z];
}

export function render(mesh: Mesh, cam: Camera, opts: RenderOptions = {}): RenderedPolygon[] {
  const light = normalize(opts.light ?? [-0.5, 0.8, 0.9]);
  const ambient = opts.ambient ?? 0.42;
  const bands = opts.bands ?? 4;
  const out: RenderedPolygon[] = [];
  for (const f of mesh) {
    const n = faceNormal(f.v);
    const c = centroidOf(f.v);
    // Cara trasera: la normal se aleja de la cámara.
    const toCam = sub([0, 0, cam.distance], c);
    if (dot(n, toCam) <= 0) continue;
    let k = 1;
    if (!f.unlit) {
      let diff = Math.max(0, dot(n, light));
      if (bands > 0) diff = Math.round(diff * bands) / bands;
      k = ambient + (1 - ambient) * diff * 1.08;
    }
    const pts = f.v.map((p) => project(p, cam));
    out.push({
      points: pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
      fill: shade(f.color, k),
      opacity: f.opacity ?? 1,
      depth: pts.reduce((s, p) => s + p[2], 0) / pts.length,
    });
  }
  // Pintor: primero lo más lejano.
  return out.sort((a, b) => b.depth - a.depth);
}

// ── Render rápido por instancias (geometría fija + matriz por pieza) ────
//
// La geometría se teselea una sola vez; en cada cuadro solo se multiplica cada vértice
// por la matriz afín de su pieza. Evita crear miles de objetos por cuadro en el teléfono.

/** Matriz afín 3×4 por filas: [r00 r01 r02 tx  r10 r11 r12 ty  r20 r21 r22 tz]. */
export type Mat = number[];

export const IDENTITY: Mat = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];

/** a·b (primero se aplica b). */
export function mul(a: Mat, b: Mat): Mat {
  const o = new Array<number>(12);
  for (let r = 0; r < 3; r++) {
    const a0 = a[r * 4], a1 = a[r * 4 + 1], a2 = a[r * 4 + 2];
    o[r * 4] = a0 * b[0] + a1 * b[4] + a2 * b[8];
    o[r * 4 + 1] = a0 * b[1] + a1 * b[5] + a2 * b[9];
    o[r * 4 + 2] = a0 * b[2] + a1 * b[6] + a2 * b[10];
    o[r * 4 + 3] = a0 * b[3] + a1 * b[7] + a2 * b[11] + a[r * 4 + 3];
  }
  return o;
}

export const mulAll = (...ms: Mat[]) => ms.reduce((acc, m) => mul(acc, m), IDENTITY);

export function mRotX(a: number): Mat {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0];
}
export function mRotY(a: number): Mat {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0];
}
export function mRotZ(a: number): Mat {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0];
}
export const mTranslate = (t: Vec3): Mat => [1, 0, 0, t[0], 0, 1, 0, t[1], 0, 0, 1, t[2]];
export const mScale = (k: Vec3): Mat => [k[0], 0, 0, 0, 0, k[1], 0, 0, 0, 0, k[2], 0];
/** Aplica `m` alrededor de un pivote. */
export const mAround = (pivot: Vec3, m: Mat): Mat => mulAll(mTranslate(pivot), m, mTranslate([-pivot[0], -pivot[1], -pivot[2]]));

export function applyMat(m: Mat, p: Vec3): Vec3 {
  return [
    m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[3],
    m[4] * p[0] + m[5] * p[1] + m[6] * p[2] + m[7],
    m[8] * p[0] + m[9] * p[1] + m[10] * p[2] + m[11],
  ];
}

export interface Instance {
  mesh: Mesh;
  m: Mat;
}

/** Aplana instancias a una malla normal (para pruebas y exportación). */
export const flatten = (instances: Instance[]): Mesh =>
  instances.flatMap(({ mesh, m }) => mesh.map((f) => ({ ...f, v: f.v.map((p) => applyMat(m, p)) })));

const shadeCache = new Map<string, string>();
function shadeCached(hex: string, k: number): string {
  const key = `${hex}|${k.toFixed(3)}`;
  let v = shadeCache.get(key);
  if (!v) {
    v = shade(hex, k);
    shadeCache.set(key, v);
  }
  return v;
}

const r1 = (x: number) => Math.round(x * 10) / 10;

/** Versión rápida de `render` para instancias. Mismo resultado visual. */
export function renderInstances(instances: Instance[], cam: Camera, opts: RenderOptions = {}): RenderedPolygon[] {
  const light = normalize(opts.light ?? [-0.5, 0.8, 0.9]);
  const ambient = opts.ambient ?? 0.42;
  const bands = opts.bands ?? 4;
  const out: RenderedPolygon[] = [];
  const xs: number[] = [], ys: number[] = [], zs: number[] = [];
  for (const { mesh, m } of instances) {
    for (const f of mesh) {
      const n = f.v.length;
      let cx = 0, cy = 0, cz = 0;
      for (let i = 0; i < n; i++) {
        const p = f.v[i];
        const x = m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[3];
        const y = m[4] * p[0] + m[5] * p[1] + m[6] * p[2] + m[7];
        const z = m[8] * p[0] + m[9] * p[1] + m[10] * p[2] + m[11];
        xs[i] = x; ys[i] = y; zs[i] = z;
        cx += x; cy += y; cz += z;
      }
      cx /= n; cy /= n; cz /= n;
      // Normal con los tres primeros vértices.
      const ux = xs[1] - xs[0], uy = ys[1] - ys[0], uz = zs[1] - zs[0];
      const vx = xs[2] - xs[0], vy = ys[2] - ys[0], vz = zs[2] - zs[0];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
      if (nx * -cx + ny * -cy + nz * (cam.distance - cz) <= 0) continue;
      let k = 1;
      if (!f.unlit) {
        let diff = Math.max(0, nx * light[0] + ny * light[1] + nz * light[2]);
        if (bands > 0) diff = Math.round(diff * bands) / bands;
        k = ambient + (1 - ambient) * diff * 1.08;
      }
      let pts = '';
      let depth = 0;
      for (let i = 0; i < n; i++) {
        const zz = cam.distance - zs[i];
        const kk = cam.focal / Math.max(0.01, zz);
        pts += `${i ? ' ' : ''}${r1(cam.cx + xs[i] * kk)},${r1(cam.cy - ys[i] * kk)}`;
        depth += zz;
      }
      out.push({ points: pts, fill: shadeCached(f.color, k), opacity: f.opacity ?? 1, depth: depth / n });
    }
  }
  return out.sort((a, b) => b.depth - a.depth);
}
