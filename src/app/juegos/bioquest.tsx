/**
 * BioQuest: relaciona la química con el cuerpo humano tocando el órgano correcto en el mapa.
 * Esquema corporal simplificado y original; uso educativo, no clínico.
 */
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { GameHeader, GameOver, useGameSession } from '@/components/games/GameFrame';
import { Button, KText, Screen } from '@/components/ui';
import { alpha, Stage } from '@/components/ui/scene';
import { bioRound, BIO_QUESTIONS, ORGAN_LABEL, type BioQuestion, type Organ } from '@/core/games/extra';
import { useStudyTimer } from '@/state/useStudyTimer';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const TINT = '#F472B6';
const VB = { w: 200, h: 340 };
/** Centro de cada zona táctil en coordenadas del dibujo. */
const SPOTS: Record<Organ, [number, number]> = {
  cerebro: [100, 34],
  tiroides: [100, 80],
  pulmones: [78, 124],
  corazon: [118, 140],
  estomago: [108, 184],
  brazo: [34, 160],
  hueso: [80, 280],
};

function Body({ width }: { width: number }) {
  const { colors } = useTheme();
  const skin = alpha(colors.text, 0.16);
  return (
    <Svg width={width} height={(width * VB.h) / VB.w} viewBox={`0 0 ${VB.w} ${VB.h}`}>
      {/* Silueta */}
      <G fill={skin}>
        <Circle cx={100} cy={36} r={28} />
        <Rect x={90} y={60} width={20} height={20} rx={6} />
        <Path d="M58 84 Q100 74 142 84 L150 210 Q100 226 50 210 Z" />
        <Path d="M58 88 Q36 96 30 150 L24 214 L38 216 L46 154 L60 120 Z" />
        <Path d="M142 88 Q164 96 170 150 L176 214 L162 216 L154 154 L140 120 Z" />
        <Path d="M56 206 L96 214 L94 330 L70 330 Z" />
        <Path d="M144 206 L104 214 L106 330 L130 330 Z" />
      </G>
      {/* Órganos */}
      <Path d="M80 30 Q82 14 100 14 Q118 14 120 30 Q122 46 100 48 Q78 46 80 30 Z" fill="#F9A8D4" />
      <Path d="M100 32 Q96 24 100 16 M90 26 Q96 30 92 38 M110 26 Q104 30 108 38" stroke="#BE185D" strokeWidth={1.5} fill="none" />
      <Path d="M92 78 Q96 72 100 78 Q104 72 108 78 Q106 86 100 84 Q94 86 92 78 Z" fill="#FB923C" />
      <Ellipse cx={80} cy={126} rx={16} ry={28} fill="#93C5FD" />
      <Ellipse cx={120} cy={122} rx={15} ry={26} fill="#93C5FD" />
      <Path d="M112 134 Q112 124 120 128 Q128 124 128 134 Q128 146 120 152 Q112 146 112 134 Z" fill="#EF4444" />
      <Path d="M96 172 Q120 166 124 182 Q126 200 104 198 Q92 196 96 186 Z" fill="#FCD34D" />
      <Path d="M32 140 Q42 150 38 176" stroke="#F87171" strokeWidth={9} strokeLinecap="round" fill="none" />
      <Path d="M80 236 L80 318" stroke="#F5F8FF" strokeWidth={7} strokeLinecap="round" />
      <Circle cx={80} cy={236} r={6} fill="#F5F8FF" />
      <Path d="M120 236 L120 318" stroke="#F5F8FF" strokeWidth={7} strokeLinecap="round" />
      <Circle cx={120} cy={236} r={6} fill="#F5F8FF" />
    </Svg>
  );
}

export default function BioQuest() {
  useStudyTimer();
  const { colors } = useTheme();
  const s = useGameSession('bioquest', 8);
  const [done, setDone] = useState<string[]>([]);
  const [q, setQ] = useState<BioQuestion>(() => bioRound(Math.random));
  const [picked, setPicked] = useState<Organ | null>(null);
  const width = 220;
  const k = width / VB.w;

  if (s.finished) return <GameOver s={s} gameId="bioquest" />;

  const choose = (o: Organ) => {
    if (picked) return;
    setPicked(o);
    s.answer(o === q.organ);
  };

  return (
    <Screen>
      <GameHeader title="BioQuest" s={s} tint={TINT} />
      <Stage tint={TINT} glow="top-left">
        <KText variant="bodyLg" style={{ fontWeight: '700' }}>
          {q.prompt}
        </KText>
        <KText variant="caption" muted>
          Toca el órgano en el mapa.
        </KText>
      </Stage>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width, height: (width * VB.h) / VB.w }}>
          <Body width={width} />
          {(Object.keys(SPOTS) as Organ[]).map((o) => {
            const [x, y] = SPOTS[o];
            const size = 50;
            const state = !picked ? null : o === q.organ ? 'right' : o === picked ? 'wrong' : null;
            return (
              <Pressable
                key={o}
                onPress={() => choose(o)}
                accessibilityRole="button"
                accessibilityLabel={ORGAN_LABEL[o]}
                style={{
                  position: 'absolute',
                  left: x * k - size / 2,
                  top: y * k - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: state ? 3 : 1.5,
                  borderStyle: state ? 'solid' : 'dashed',
                  borderColor: state === 'right' ? colors.success : state === 'wrong' ? colors.danger : alpha(colors.text, 0.35),
                  backgroundColor: state === 'right' ? alpha(colors.success, 0.25) : state === 'wrong' ? alpha(colors.danger, 0.25) : 'transparent',
                }}
              />
            );
          })}
        </View>
      </View>
      {picked && (
        <Stage glow="none">
          <KText style={{ fontWeight: '800' }} color={picked === q.organ ? colors.success : colors.warning}>
            {picked === q.organ ? `¡Sí! ${ORGAN_LABEL[q.organ]}.` : `Es: ${ORGAN_LABEL[q.organ]}.`}
          </KText>
          <KText>{q.explanation}</KText>
          <KText variant="caption" muted>
            Fuente: OpenStax Anatomy and Physiology 2e ({q.source.replace('A&P 2e, ', 'sección ')}).
          </KText>
          <Button
            label={s.round + 1 >= s.rounds ? 'Ver resultado' : 'Siguiente'}
            onPress={() => {
              const nextDone = [...done, q.id].slice(-(BIO_QUESTIONS.length - 1));
              setDone(nextDone);
              setQ(bioRound(Math.random, nextDone));
              setPicked(null);
              s.next();
            }}
          />
        </Stage>
      )}
      <KText variant="caption" muted style={{ marginTop: spacing.sm }}>
        Contenido educativo: no sirve para diagnosticar ni para decidir tratamientos.
      </KText>
    </Screen>
  );
}
