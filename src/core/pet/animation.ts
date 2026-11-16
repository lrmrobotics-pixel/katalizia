/**
 * Poses de Kata en función del ánimo y del tiempo. Es la misma "actuación" para los
 * tres estilos (pixel, 2D y 3D): cada renderizador la interpreta con sus propios recursos.
 * Lógica pura, sin React, para poder probarla.
 */
import type { CatMood } from './wellbeing';

export type KataStyle = 'pixel' | 'cartoon' | 'tres-d';

export const KATA_STYLES: { id: KataStyle; name: string; detail: string }[] = [
  { id: 'pixel', name: 'Pixel art', detail: 'El Kata original, con animaciones retro por cuadros.' },
  { id: 'cartoon', name: 'Animación 2D', detail: 'Dibujo vectorial con cuerpo y cara animados por partes.' },
  { id: 'tres-d', name: '3D', detail: 'Modelo low-poly en tiempo real: arrástralo para girarlo.' },
];

/** Trucos especiales que se desbloquean por nivel (nunca se pierden). */
export type KataTrick = 'saludar' | 'saltar' | 'girar' | 'bailar';

export const TRICKS: { id: KataTrick; name: string; level: number }[] = [
  { id: 'saludar', name: 'Saludar', level: 1 },
  { id: 'saltar', name: 'Saltar', level: 2 },
  { id: 'girar', name: 'Girar', level: 4 },
  { id: 'bailar', name: 'Bailar', level: 6 },
];

export const TRICK_SECONDS = 1.6;

export const unlockedTricks = (level: number) => TRICKS.filter((t) => level >= t.level);

export type MouthShape = 'smile' | 'open' | 'o' | 'flat' | 'wavy';

export interface KataPose {
  /** Elevación del cuerpo (unidades del modelo ≈ altura de la cabeza / 1.6). */
  jump: number;
  /** Escala vertical del cuerpo (respiración / aplastamiento). */
  squash: number;
  /** Inclinación lateral de la cabeza (rad, + = hacia la derecha de Kata). */
  headTilt: number;
  /** Cabeceo (rad, + = mira hacia abajo). */
  headNod: number;
  /** Giro de todo el cuerpo (rad). */
  yaw: number;
  /** Balanceo lateral del cuerpo (rad). */
  sway: number;
  /** Elevación de los brazos (rad desde reposo; ≈ 2.6 = arriba). */
  armL: number;
  armR: number;
  /** Ángulo de la cola (rad). */
  tail: number;
  /** Apertura de ojos (0 cerrado, 1 normal, >1 muy abiertos); `happy` dibuja ojos en arco. */
  eyeL: number;
  eyeR: number;
  happyEyes: boolean;
  mouth: MouthShape;
  /** Orejas erguidas (0–1). */
  earPerk: number;
}

const NEUTRAL: KataPose = {
  jump: 0,
  squash: 1,
  headTilt: 0,
  headNod: 0,
  yaw: 0,
  sway: 0,
  armL: 0,
  armR: 0,
  tail: 0,
  eyeL: 1,
  eyeR: 1,
  happyEyes: false,
  mouth: 'smile',
  earPerk: 0.5,
};

const s = Math.sin;

/** Parpadeo natural: ~0,14 s cada ~3,7 s, desfasado para no parecer mecánico. */
export function isBlinking(t: number): boolean {
  const cycle = t % 3.7;
  return cycle > 3.56 || (t % 11.3 > 11.12);
}

export function moodPose(mood: CatMood, t: number): KataPose {
  const p: KataPose = {
    ...NEUTRAL,
    squash: 1 + s(t * 2.2) * 0.02,
    headNod: s(t * 1.3) * 0.03,
    tail: s(t * 2.1) * 0.35,
  };
  switch (mood) {
    case 'feliz':
      return { ...p, happyEyes: true, eyeL: 0.5, eyeR: 0.5, headTilt: s(t * 1.1) * 0.07 };
    case 'curioso':
      return { ...p, headTilt: 0.26, headNod: 0.06, eyeL: 1.1, eyeR: 1.2, earPerk: 1 };
    case 'pensativo':
      return { ...p, headTilt: -0.16, headNod: -0.12, armR: 1.9 + s(t * 2) * 0.05, mouth: 'flat', eyeL: 0.85, eyeR: 0.85 };
    case 'sorprendido':
      return {
        ...p,
        jump: Math.max(0, s(t * 3)) * 0.06,
        eyeL: 1.35,
        eyeR: 1.35,
        mouth: 'o',
        armL: 0.7,
        armR: 0.7,
        earPerk: 1,
      };
    case 'confundido':
      return { ...p, headTilt: s(t * 1.4) * 0.22, eyeL: 1, eyeR: 0.45, mouth: 'wavy', earPerk: 0.2 };
    case 'celebrando': {
      const hop = Math.abs(s(t * 5));
      return {
        ...p,
        jump: hop * 0.35,
        squash: 1 - (1 - hop) * 0.08,
        armL: 2.4 + s(t * 10) * 0.2,
        armR: 2.4 - s(t * 10) * 0.2,
        happyEyes: true,
        eyeL: 0.5,
        eyeR: 0.5,
        mouth: 'open',
        tail: s(t * 6) * 0.6,
        earPerk: 1,
      };
    }
    case 'explicando':
      return {
        ...p,
        armR: 1.25 + s(t * 4) * 0.35,
        mouth: Math.floor(t * 5) % 2 === 0 ? 'open' : 'smile',
        headTilt: s(t * 1.6) * 0.06,
      };
    case 'concentrado':
      return { ...p, squash: 1 + s(t * 1.4) * 0.012, headNod: 0.12, eyeL: 0.45, eyeR: 0.45, mouth: 'flat', tail: s(t) * 0.15 };
    case 'durmiendo':
      return {
        ...p,
        squash: 1 + s(t * 1.1) * 0.035,
        headNod: 0.26,
        headTilt: 0.1,
        eyeL: 0.06,
        eyeR: 0.06,
        mouth: 'flat',
        tail: s(t * 0.6) * 0.12,
        earPerk: 0,
      };
    case 'experimentando':
      return { ...p, armR: 0.95 + s(t * 7) * 0.08, eyeL: 1.15, eyeR: 1, headNod: 0.05, headTilt: -0.08 };
  }
}

/** Superpone un truco sobre la pose (progreso 0–1). */
export function applyTrick(p: KataPose, trick: KataTrick, progress: number): KataPose {
  const k = Math.max(0, Math.min(1, progress));
  const env = s(k * Math.PI); // entra y sale suave
  switch (trick) {
    case 'saludar':
      return { ...p, armL: 2.3 + s(k * Math.PI * 6) * 0.35 * env, mouth: 'open', happyEyes: true, eyeL: 0.5, eyeR: 0.5 };
    case 'saltar':
      return { ...p, jump: env * 0.7, squash: 1 + (k < 0.12 || k > 0.88 ? -0.1 : 0.04), armL: env * 1.2, armR: env * 1.2 };
    case 'girar':
      return { ...p, yaw: p.yaw + k * Math.PI * 2, jump: env * 0.15 };
    case 'bailar':
      return {
        ...p,
        sway: s(k * Math.PI * 4) * 0.22,
        armL: 1.6 + s(k * Math.PI * 8) * 0.6,
        armR: 1.6 - s(k * Math.PI * 8) * 0.6,
        headTilt: s(k * Math.PI * 4) * 0.2,
        happyEyes: true,
        eyeL: 0.5,
        eyeR: 0.5,
        mouth: 'open',
      };
  }
}

export function kataPose(mood: CatMood, t: number, trick?: { id: KataTrick; startedAt: number } | null): KataPose {
  let p = moodPose(mood, t);
  if (trick) {
    const progress = (t - trick.startedAt) / TRICK_SECONDS;
    if (progress >= 0 && progress < 1) p = applyTrick(p, trick.id, progress);
  }
  if (isBlinking(t) && p.eyeL > 0.1) p = { ...p, eyeL: 0.06, eyeR: 0.06, happyEyes: false };
  return p;
}
