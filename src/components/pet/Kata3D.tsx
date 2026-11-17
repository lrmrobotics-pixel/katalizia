/**
 * Estilo 3 — 3D: malla low-poly renderizada en tiempo real con el motor de `core/render3d`
 * (perspectiva, profundidad e iluminación por bandas). Si es interactivo, se gira arrastrando.
 */
import { useMemo, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import Svg, { Ellipse, Polygon } from 'react-native-svg';

import type { KataPose } from '@/core/pet/animation';
import { mRotX, mRotY, mTranslate, mul, mulAll, renderInstances } from '@/core/render3d';

import type { KataLook } from './catSprite';
import { KATA3D_BOUNDS, kataInstances } from './kataModel3d';

export function Kata3D({
  pose,
  width,
  look,
  interactive,
}: {
  pose: KataPose;
  width: number;
  look: KataLook;
  interactive: boolean;
}) {
  const height = width * 1.3;
  const [drag, setDrag] = useState({ yaw: -0.35, pitch: 0.12 });
  const start = useRef(drag);
  const dragRef = useRef(drag);
  const pan = useMemo(
    () =>
      // Los refs solo se leen dentro de los manejadores del gesto, nunca durante el render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => interactive,
        onMoveShouldSetPanResponder: (_, g) => interactive && Math.abs(g.dx) > 4,
        onPanResponderGrant: () => {
          start.current = dragRef.current;
        },
        onPanResponderMove: (_, g) => {
          const next = {
            yaw: start.current.yaw + g.dx / 70,
            pitch: Math.max(-0.35, Math.min(0.5, start.current.pitch + g.dy / 160)),
          };
          dragRef.current = next;
          setDrag(next);
        },
      }),
    [interactive],
  );

  const polygons = useMemo(() => {
    const span = KATA3D_BOUNDS.maxY - KATA3D_BOUNDS.minY;
    const distance = 8;
    const k = (height * 0.86) / span;
    const mid = (KATA3D_BOUNDS.maxY + KATA3D_BOUNDS.minY) / 2;
    // Vista: giro del arrastre, centrado vertical e inclinación de cámara.
    const view = mulAll(mRotX(drag.pitch), mTranslate([0, -mid, 0]), mRotY(drag.yaw));
    const instances = kataInstances(pose, look).map((it) => ({ mesh: it.mesh, m: mul(view, it.m) }));
    return renderInstances(instances, { distance, focal: k * distance, cx: width / 2, cy: height / 2 });
  }, [pose, look, drag, width, height]);

  return (
    <View {...(interactive ? pan.panHandlers : {})} style={{ width, height }}>
      <Svg width={width} height={height}>
        {/* Sombra de contacto: se encoge al saltar. */}
        <Ellipse
          cx={width / 2}
          cy={height * 0.95}
          rx={width * 0.3 * (1 - Math.min(0.5, pose.jump))}
          ry={width * 0.045}
          fill="#000000"
          opacity={0.22}
        />
        {polygons.map((p, i) => (
          <Polygon
            key={i}
            points={p.points}
            fill={p.fill}
            fillOpacity={p.opacity}
            stroke={p.opacity < 1 ? 'none' : p.fill}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}
