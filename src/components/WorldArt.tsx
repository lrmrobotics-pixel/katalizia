/**
 * Ilustraciones vectoriales originales de los 12 mundos (100 × 100). Cada una resume la
 * idea del mundo con un objeto científico; el color sale del propio mundo.
 */
import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, G, Line, Path, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';

const INK = '#0B1230';
const WHITE = '#F5F8FF';

function Scene({ id, c }: { id: string; c: string }) {
  switch (id) {
    case 'm1-materia': // estados de la materia: cubo de hielo, gota y vapor
      return (
        <G>
          <Rect x={18} y={52} width={22} height={22} rx={4} fill={WHITE} opacity={0.9} transform="rotate(-8 29 63)" />
          <Path d="M52 42s12 13 12 21a12 12 0 0 1-24 0c0-8 12-21 12-21Z" fill={c} />
          <Path d="M47 64a5 5 0 0 0 5 5" stroke={WHITE} strokeWidth={2.5} strokeLinecap="round" fill="none" />
          <Path d="M70 40c0-6 8-6 8 0s8 6 8 0M72 54c0-6 8-6 8 0" stroke={WHITE} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.85} />
        </G>
      );
    case 'm2-atomo':
      return (
        <G stroke={WHITE} strokeWidth={2.5} fill="none">
          <Ellipse cx={50} cy={52} rx={32} ry={12} />
          <Ellipse cx={50} cy={52} rx={32} ry={12} transform="rotate(60 50 52)" />
          <Ellipse cx={50} cy={52} rx={32} ry={12} transform="rotate(-60 50 52)" />
          <Circle cx={50} cy={52} r={7} fill={c} stroke="none" />
          <Circle cx={82} cy={52} r={3.5} fill={WHITE} stroke="none" />
          <Circle cx={34} cy={24} r={3.5} fill={WHITE} stroke="none" />
        </G>
      );
    case 'm3-tabla':
      return (
        <G>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((k) => (
              <Rect
                key={`${r}${k}`}
                x={22 + k * 15}
                y={26 + r * 13}
                width={12}
                height={10}
                rx={2}
                fill={(r + k) % 3 === 0 ? c : WHITE}
                opacity={r === 0 && (k === 1 || k === 2) ? 0 : 0.92}
              />
            )),
          )}
          <Rect x={30} y={80} width={40} height={6} rx={2} fill={WHITE} opacity={0.6} />
        </G>
      );
    case 'm4-enlaces':
      return (
        <G>
          <Line x1={34} y1={54} x2={66} y2={46} stroke={WHITE} strokeWidth={5} strokeLinecap="round" />
          <Line x1={36} y1={62} x2={68} y2={54} stroke={WHITE} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
          <Circle cx={32} cy={58} r={15} fill={c} />
          <Circle cx={68} cy={50} r={12} fill={WHITE} />
          <Circle cx={27} cy={53} r={4} fill={WHITE} opacity={0.6} />
        </G>
      );
    case 'm5-reacciones':
      return (
        <G>
          <Path d="M42 24h16M45 24v16L30 70a4 4 0 0 0 3.6 6h32.8a4 4 0 0 0 3.6-6L55 40V24" fill={WHITE} opacity={0.15} stroke={WHITE} strokeWidth={3} strokeLinejoin="round" />
          <Path d="M36 60h28l6 10a4 4 0 0 1-3.6 6H33.6a4 4 0 0 1-3.6-6Z" fill={c} />
          <Circle cx={46} cy={50} r={3} fill={WHITE} />
          <Circle cx={54} cy={42} r={2.2} fill={WHITE} />
          <Circle cx={50} cy={16} r={3} fill={WHITE} opacity={0.7} />
        </G>
      );
    case 'm6-calculos': // balanza: mol ↔ gramos
      return (
        <G stroke={WHITE} strokeWidth={3} strokeLinecap="round" fill="none">
          <Line x1={50} y1={24} x2={50} y2={76} />
          <Line x1={24} y1={34} x2={76} y2={30} />
          <Path d="M24 34 16 54h16Z" fill={c} stroke={c} />
          <Path d="M76 30l-8 20h16Z" fill={WHITE} />
          <Line x1={36} y1={78} x2={64} y2={78} />
          <Circle cx={50} cy={24} r={3} fill={WHITE} />
        </G>
      );
    case 'm7-acidos':
      return (
        <G>
          {['#F87171', '#FB923C', '#FACC15', '#4ADE80', '#22D3EE', '#60A5FA', '#A78BFA'].map((col, i) => (
            <Rect key={col} x={16 + i * 10} y={70} width={9} height={8} rx={2} fill={col} />
          ))}
          <Path d="M50 22s15 16 15 26a15 15 0 0 1-30 0c0-10 15-26 15-26Z" fill={c} />
          <Path d="M43 50a7 7 0 0 0 7 7" stroke={WHITE} strokeWidth={3} strokeLinecap="round" fill="none" />
        </G>
      );
    case 'm8-energia':
      return (
        <G>
          <Path d="M48 80c-14 0-20-10-17-20 2-7 8-10 8-18 7 4 9 10 8 15 3-3 4-7 3-11 9 6 15 14 15 21 0 8-7 13-17 13Z" fill={c} />
          <Path d="M49 78c-6 0-9-4-7-9 1-3 4-5 4-8 4 3 5 6 4 9 2-1 3-3 3-5 3 3 4 6 4 8 0 3-3 5-8 5Z" fill={WHITE} opacity={0.85} />
          <Path d="M74 26v30" stroke={WHITE} strokeWidth={6} strokeLinecap="round" />
          <Circle cx={74} cy={60} r={6} fill={WHITE} />
        </G>
      );
    case 'm9-organica': // anillo de benceno
      return (
        <G>
          <Polygon points="50,22 74,36 74,64 50,78 26,64 26,36" fill="none" stroke={WHITE} strokeWidth={3.5} strokeLinejoin="round" />
          <Circle cx={50} cy={50} r={14} fill="none" stroke={c} strokeWidth={4} />
          {[[50, 22], [74, 36], [74, 64], [50, 78], [26, 64], [26, 36]].map(([x, y]) => (
            <Circle key={`${x}${y}`} cx={x} cy={y} r={4} fill={WHITE} />
          ))}
        </G>
      );
    case 'm10-bioquimica': // doble hélice
      return (
        <G strokeLinecap="round" fill="none">
          <Path d="M36 18c28 16 0 32 28 48M64 18c-28 16 0 32-28 48" stroke={WHITE} strokeWidth={3.5} transform="translate(0 8)" />
          {[30, 40, 52, 62].map((y, i) => (
            <Line key={y} x1={40 + (i % 2) * 2} y1={y} x2={60 - (i % 2) * 2} y2={y} stroke={c} strokeWidth={3.5} />
          ))}
        </G>
      );
    case 'm11-medicina':
      return (
        <G>
          <Path d="M50 78S24 63 24 44a13 13 0 0 1 26-5 13 13 0 0 1 26 5c0 19-26 34-26 34Z" fill={c} />
          <Path d="M30 50h10l5-9 6 18 5-9h14" stroke={WHITE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </G>
      );
    case 'm12-preu': // microscopio
    default:
      return (
        <G stroke={WHITE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M44 22l10 6-12 20-10-6Z" fill={c} stroke={c} />
          <Path d="M36 52a20 20 0 1 0 30 18" />
          <Line x1={28} y1={80} x2={72} y2={80} />
          <Line x1={52} y1={56} x2={64} y2={56} />
          <Circle cx={58} cy={68} r={4} fill={WHITE} />
        </G>
      );
  }
}

export function WorldArt({ worldId, color, size = 72, locked = false }: { worldId: string; color: string; size?: number; locked?: boolean }) {
  const gid = useId().replace(/[:]/g, '');
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id={`w${gid}`} cx="35%" cy="30%" r="75%">
          <Stop offset="0" stopColor={color} stopOpacity={0.55} />
          <Stop offset="1" stopColor={INK} stopOpacity={0.95} />
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={48} fill={`url(#w${gid})`} />
      <Circle cx={50} cy={50} r={47} fill="none" stroke={color} strokeWidth={2} opacity={0.8} />
      <G opacity={locked ? 0.35 : 1}>
        <Scene id={worldId} c={color} />
      </G>
      {locked && (
        <G>
          <Circle cx={74} cy={74} r={14} fill={INK} stroke={color} strokeWidth={2} />
          <Rect x={67} y={73} width={14} height={10} rx={2} fill={WHITE} />
          <Path d="M70 73v-3a4 4 0 0 1 8 0v3" stroke={WHITE} strokeWidth={2.5} fill="none" />
        </G>
      )}
    </Svg>
  );
}
