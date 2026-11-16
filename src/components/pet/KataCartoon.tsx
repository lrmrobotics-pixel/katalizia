/**
 * Estilo 2 — Animación 2D: Kata como personaje vectorial de caricatura (diseño original).
 * Cada parte (cola, cuerpo, brazos, cabeza, cejas, ojos, boca) se anima por separado
 * desde su pivote, así que hay movimiento corporal y facial, no solo cambio de imagen.
 */
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import type { KataPose } from '@/core/pet/animation';
import type { CatMood } from '@/core/pet/wellbeing';

import { BASE_COLORS, type KataLook } from './catSprite';

const INK = BASE_COLORS.K;
const FUR = BASE_COLORS.F;
const FUR_LIGHT = '#EEF2FA';
const PINK = BASE_COLORS.P;
const W = 200;
const H = 260;
const deg = (r: number) => (r * 180) / Math.PI;

/** Cejas por ánimo: [dy izquierda, dy derecha, inclinación izq., inclinación der.] en px. */
function brows(mood: CatMood): [number, number, number, number] {
  switch (mood) {
    case 'curioso':
      return [-6, 2, -3, 0];
    case 'sorprendido':
      return [-9, -9, -2, 2];
    case 'confundido':
      return [-5, 3, 4, -3];
    case 'concentrado':
      return [3, 3, 5, -5];
    case 'pensativo':
      return [-3, -5, -2, 2];
    case 'durmiendo':
      return [4, 4, 0, 0];
    default:
      return [-2, -2, -2, 2];
  }
}

function Eye({ x, open, happy }: { x: number; open: number; happy: boolean }) {
  const y = 104;
  if (happy) return <Path d={`M${x - 9} ${y + 3} Q${x} ${y - 9} ${x + 9} ${y + 3}`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none" />;
  if (open < 0.15) return <Path d={`M${x - 9} ${y} Q${x} ${y + 5} ${x + 9} ${y}`} stroke={INK} strokeWidth={4} strokeLinecap="round" fill="none" />;
  const ry = 12 * open;
  return (
    <G>
      <Ellipse cx={x} cy={y} rx={9} ry={ry} fill={INK} />
      {open > 0.4 && <Circle cx={x + 3} cy={y - ry * 0.45} r={3} fill="#FFFFFF" />}
    </G>
  );
}

function Mouth({ shape }: { shape: KataPose['mouth'] }) {
  const y = 136;
  switch (shape) {
    case 'open':
      return (
        <G>
          <Path d={`M88 ${y - 2} Q100 ${y + 18} 112 ${y - 2} Z`} fill="#7A2E45" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Path d={`M93 ${y + 6} Q100 ${y + 12} 107 ${y + 6}`} fill={PINK} />
        </G>
      );
    case 'o':
      return <Ellipse cx={100} cy={y + 3} rx={6} ry={8} fill="#7A2E45" stroke={INK} strokeWidth={3} />;
    case 'flat':
      return <Line x1={91} y1={y + 2} x2={109} y2={y + 2} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />;
    case 'wavy':
      return <Path d={`M88 ${y + 2} q4 -5 8 0 t8 0 t8 0`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
    default:
      return <Path d={`M88 ${y} q6 7 12 0 q6 7 12 0`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
  }
}

/** Brazo como trazo grueso con contorno (dos trazos superpuestos) y pata al final. */
function Arm({ side, raise, color }: { side: -1 | 1; raise: number; color: string }) {
  const sx = 100 + side * 34;
  const d = `M${sx} 166 Q${sx + side * 12} 190 ${sx + side * 6} 212`;
  return (
    <G transform={`rotate(${-side * deg(raise)} ${sx} 166)`}>
      <Path d={d} stroke={INK} strokeWidth={24} strokeLinecap="round" fill="none" />
      <Path d={d} stroke={color} strokeWidth={17} strokeLinecap="round" fill="none" />
      <Circle cx={sx + side * 6} cy={214} r={10} fill={FUR} stroke={INK} strokeWidth={3.5} />
    </G>
  );
}

function Hat({ kind }: { kind: KataLook['hat'] }) {
  if (kind === 'birrete') {
    return (
      <G>
        <Path d="M62 60 Q100 40 138 60 L138 72 Q100 58 62 72 Z" fill={BASE_COLORS.H} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <Path d="M40 52 L100 30 L160 52 L100 74 Z" fill={BASE_COLORS.H} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <Circle cx={100} cy={52} r={4} fill={BASE_COLORS.Y} />
        <Path d="M100 52 L150 62 L150 86" stroke={BASE_COLORS.Y} strokeWidth={3} fill="none" />
        <Rect x={146} y={84} width={8} height={12} rx={2} fill={BASE_COLORS.Y} />
      </G>
    );
  }
  if (kind === 'gorro') {
    return (
      <G>
        <Path d="M36 82 Q40 26 100 24 Q160 26 164 82 Z" fill={BASE_COLORS.H} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <Rect x={32} y={72} width={136} height={18} rx={9} fill={BASE_COLORS.Y} stroke={INK} strokeWidth={3.5} />
        <Circle cx={100} cy={20} r={12} fill={BASE_COLORS.Y} stroke={INK} strokeWidth={3.5} />
      </G>
    );
  }
  return null;
}

function Flask() {
  return (
    <G transform="translate(140 186)">
      <Path d="M-6 0 L6 0 L6 14 L20 40 Q22 46 16 46 L-16 46 Q-22 46 -20 40 L-6 14 Z" fill={BASE_COLORS.L} fillOpacity={0.6} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <Path d="M-13 30 L13 30 L18 40 Q19 43 15 43 L-15 43 Q-19 43 -18 40 Z" fill={BASE_COLORS.Q} />
      <Circle cx={-4} cy={-6} r={3} fill={BASE_COLORS.L} />
      <Circle cx={3} cy={-14} r={2} fill={BASE_COLORS.L} />
    </G>
  );
}

export function KataCartoon({ mood, pose, width, look }: { mood: CatMood; pose: KataPose; width: number; look: KataLook }) {
  const hasCoat = look.coat !== FUR;
  const body = hasCoat ? look.coat : FUR;
  const [bl, br, tl, tr] = brows(mood);
  const blush = mood === 'feliz' || mood === 'celebrando' || pose.happyEyes;
  // Giro 2D: se aplana horizontalmente y se voltea a mitad de vuelta (técnica clásica de animación).
  const turn = Math.cos(pose.yaw);
  const sx = Math.abs(turn) < 0.08 ? 0.08 * Math.sign(turn || 1) : turn;
  const squashX = 1 + (1 - pose.squash) * 0.6;

  return (
    <Svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
      <G transform={`translate(0 ${-pose.jump * 70})`}>
        <G transform={`translate(100 252) scale(${sx * squashX} ${pose.squash}) rotate(${deg(pose.sway)}) translate(-100 -252)`}>
          {/* Cola */}
          <G transform={`rotate(${deg(pose.tail) * 0.6} 134 232)`}>
            <Path d="M134 232 Q186 222 176 168" stroke={INK} strokeWidth={19} strokeLinecap="round" fill="none" />
            <Path d="M134 232 Q186 222 176 168" stroke={FUR} strokeWidth={12} strokeLinecap="round" fill="none" />
          </G>
          {look.back === 'mochila' && <Rect x={48} y={168} width={104} height={66} rx={14} fill={BASE_COLORS.M} stroke={INK} strokeWidth={3.5} />}

          {/* Cuerpo y bata */}
          <Path d="M66 158 Q48 236 70 250 L130 250 Q152 236 134 158 Q100 146 66 158 Z" fill={body} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {hasCoat && (
            <G>
              <Path d="M84 154 L100 196 L116 154" stroke={INK} strokeWidth={3} fill={FUR_LIGHT} strokeLinejoin="round" />
              <Path d="M95 166 L105 166 L108 200 L100 210 L92 200 Z" fill={look.coatAccent} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
              <Circle cx={112} cy={220} r={3} fill={INK} />
              <Circle cx={112} cy={234} r={3} fill={INK} />
              <Path d="M118 204 L130 204" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
            </G>
          )}
          <Ellipse cx={78} cy={250} rx={18} ry={8} fill={FUR} stroke={INK} strokeWidth={3.5} />
          <Ellipse cx={122} cy={250} rx={18} ry={8} fill={FUR} stroke={INK} strokeWidth={3.5} />

          <Arm side={-1} raise={pose.armL} color={body} />
          <G transform={`rotate(${-deg(pose.armR)} 134 166)`}>
            {look.hand === 'matraz' && <Flask />}
          </G>
          <Arm side={1} raise={pose.armR} color={body} />

          {/* Cabeza */}
          <G transform={`rotate(${deg(-pose.headTilt)} 100 152) translate(0 ${pose.headNod * 22})`}>
            {[-1, 1].map((side) => {
              const lean = (1 - pose.earPerk) * 14 * side;
              return (
                <G key={side} transform={`rotate(${lean} ${100 + side * 46} 74)`}>
                  <Path
                    d={`M${100 + side * 30} 62 L${100 + side * 62} 20 L${100 + side * 70} 84 Z`}
                    fill={FUR}
                    stroke={INK}
                    strokeWidth={4}
                    strokeLinejoin="round"
                  />
                  <Path d={`M${100 + side * 40} 62 L${100 + side * 60} 36 L${100 + side * 63} 72 Z`} fill={PINK} />
                </G>
              );
            })}
            <Ellipse cx={100} cy={108} rx={72} ry={58} fill={FUR} stroke={INK} strokeWidth={4} />
            <Ellipse cx={100} cy={130} rx={32} ry={19} fill={FUR_LIGHT} />
            {blush && (
              <G>
                <Ellipse cx={56} cy={130} rx={11} ry={6} fill={PINK} opacity={0.55} />
                <Ellipse cx={144} cy={130} rx={11} ry={6} fill={PINK} opacity={0.55} />
              </G>
            )}
            <Path d="M94 121 L106 121 L100 128 Z" fill={PINK} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <Mouth shape={pose.mouth} />
            <Eye x={74} open={pose.eyeL} happy={pose.happyEyes} />
            <Eye x={126} open={pose.eyeR} happy={pose.happyEyes} />
            {/* Gafas científicas */}
            <Circle cx={74} cy={104} r={21} fill={BASE_COLORS.L} fillOpacity={0.22} stroke={look.glasses} strokeWidth={5.5} />
            <Circle cx={126} cy={104} r={21} fill={BASE_COLORS.L} fillOpacity={0.22} stroke={look.glasses} strokeWidth={5.5} />
            <Path d="M95 102 Q100 97 105 102" stroke={look.glasses} strokeWidth={5} fill="none" />
            <Path d="M62 92 L68 88" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
            <Path d="M114 92 L120 88" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
            {/* Cejas */}
            <Line x1={64} y1={76 + bl - tl} x2={84} y2={76 + bl + tl} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <Line x1={116} y1={76 + br + tr} x2={136} y2={76 + br - tr} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            <Hat kind={look.hat} />
          </G>
        </G>
      </G>
    </Svg>
  );
}
