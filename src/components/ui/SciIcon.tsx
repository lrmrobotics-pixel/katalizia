/** Iconografía vectorial original de KATALIZIA (trazo redondeado, 24 × 24). */
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

export type SciIconName =
  | 'atom'
  | 'flask'
  | 'game'
  | 'table'
  | 'kata'
  | 'review'
  | 'target'
  | 'trophy'
  | 'bell'
  | 'coin'
  | 'bolt'
  | 'map'
  | 'molecule'
  | 'thermo'
  | 'drop'
  | 'chart'
  | 'gear'
  | 'lock'
  | 'check'
  | 'play'
  | 'heart'
  | 'spark';

export function SciIcon({ name, color, size = 24 }: { name: SciIconName; color: string; size?: number }) {
  const p = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  let body;
  switch (name) {
    case 'atom':
      body = (
        <G {...p}>
          <Ellipse cx={12} cy={12} rx={10} ry={4} />
          <Ellipse cx={12} cy={12} rx={10} ry={4} transform="rotate(60 12 12)" />
          <Ellipse cx={12} cy={12} rx={10} ry={4} transform="rotate(-60 12 12)" />
          <Circle cx={12} cy={12} r={1.6} fill={color} />
        </G>
      );
      break;
    case 'flask':
      body = (
        <G {...p}>
          <Path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" />
          <Path d="M7 15h10" />
        </G>
      );
      break;
    case 'game':
      body = (
        <G {...p}>
          <Path d="M6 8h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6L14 15h-4l-1 .6A4 4 0 0 1 2 13v-1a4 4 0 0 1 4-4Z" />
          <Path d="M7 11v3M5.5 12.5h3" />
          <Circle cx={16} cy={11.5} r={0.8} fill={color} />
          <Circle cx={18} cy={13.5} r={0.8} fill={color} />
        </G>
      );
      break;
    case 'table':
      body = (
        <G {...p}>
          <Rect x={2} y={4} width={4} height={4} rx={1} />
          <Rect x={18} y={4} width={4} height={4} rx={1} />
          <Rect x={2} y={10} width={4} height={4} rx={1} />
          <Rect x={7} y={10} width={10} height={4} rx={1} />
          <Rect x={18} y={10} width={4} height={4} rx={1} />
          <Rect x={4} y={17} width={16} height={3} rx={1} />
        </G>
      );
      break;
    case 'kata':
      body = (
        <G {...p}>
          <Path d="M4 10 3 3l5 3.5h8L21 3l-1 7" />
          <Path d="M4 10c0 6 3.5 10 8 10s8-4 8-10" />
          <Circle cx={8.5} cy={12} r={2.2} />
          <Circle cx={15.5} cy={12} r={2.2} />
          <Path d="M10.7 12h2.6M11 16.5c.6.5 1.4.5 2 0" />
        </G>
      );
      break;
    case 'review':
      body = (
        <G {...p}>
          <Path d="M20 12a8 8 0 0 1-14.3 4.9M4 12A8 8 0 0 1 18.3 7.1" />
          <Path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" />
        </G>
      );
      break;
    case 'target':
      body = (
        <G {...p}>
          <Circle cx={12} cy={12} r={9} />
          <Circle cx={12} cy={12} r={5} />
          <Circle cx={12} cy={12} r={1.4} fill={color} />
        </G>
      );
      break;
    case 'trophy':
      body = (
        <G {...p}>
          <Path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
          <Path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 21h8M9 17h6v4H9z" />
        </G>
      );
      break;
    case 'bell':
      body = (
        <G {...p}>
          <Path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Z" />
          <Path d="M10 21a2 2 0 0 0 4 0" />
        </G>
      );
      break;
    case 'coin':
      body = (
        <G {...p}>
          <Circle cx={12} cy={12} r={9} />
          <Path d="M12 7v10M9.5 9.5c0-1 1.1-1.7 2.5-1.7s2.5.7 2.5 1.8c0 2.6-5 1.4-5 4.2 0 1.1 1.1 1.9 2.5 1.9s2.5-.7 2.5-1.7" />
        </G>
      );
      break;
    case 'bolt':
      body = <Path {...p} d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill={color} fillOpacity={0.25} />;
      break;
    case 'map':
      body = (
        <G {...p}>
          <Path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" />
          <Path d="M9 4v13.5M15 6.5V20" />
        </G>
      );
      break;
    case 'molecule':
      body = (
        <G {...p}>
          <Line x1={8} y1={14} x2={12} y2={8} />
          <Line x1={16} y1={14} x2={12} y2={8} />
          <Circle cx={12} cy={7} r={3.5} />
          <Circle cx={6.5} cy={16.5} r={3} />
          <Circle cx={17.5} cy={16.5} r={3} />
        </G>
      );
      break;
    case 'thermo':
      body = (
        <G {...p}>
          <Path d="M10 4a2 2 0 0 1 4 0v10.3a4 4 0 1 1-4 0V4Z" />
          <Circle cx={12} cy={17.5} r={1.6} fill={color} />
          <Path d="M12 9v7" />
        </G>
      );
      break;
    case 'drop':
      body = <Path {...p} d="M12 3s7 7.6 7 12a7 7 0 0 1-14 0c0-4.4 7-12 7-12Z" />;
      break;
    case 'chart':
      body = (
        <G {...p}>
          <Path d="M4 20V4M4 20h16" />
          <Path d="M8 16v-4M12 16V8M16 16v-6" />
        </G>
      );
      break;
    case 'gear':
      body = (
        <G {...p}>
          <Circle cx={12} cy={12} r={3} />
          <Path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
        </G>
      );
      break;
    case 'lock':
      body = (
        <G {...p}>
          <Rect x={5} y={11} width={14} height={10} rx={2} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </G>
      );
      break;
    case 'check':
      body = <Path {...p} d="m5 12.5 4.5 4.5L19 7.5" strokeWidth={2.6} />;
      break;
    case 'play':
      body = <Path {...p} d="M8 5v14l11-7L8 5Z" fill={color} />;
      break;
    case 'heart':
      body = <Path {...p} d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20Z" />;
      break;
    case 'spark':
      body = <Path {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />;
      break;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body}
    </Svg>
  );
}
