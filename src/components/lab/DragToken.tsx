/**
 * Ficha que se arrastra hasta una zona de destino. Si se suelta dentro, llama a `onDrop`.
 * Tocarla sin arrastrar también la añade (alternativa accesible al gesto).
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, PanResponder, View } from 'react-native';

export interface DropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function DragToken({
  children,
  getTarget,
  onDrop,
  onStart,
  label,
}: {
  children: ReactNode;
  /** Rectángulo de la zona de destino en coordenadas de ventana. */
  getTarget: () => DropRect | null;
  onDrop: () => void;
  /** Se llama al empezar el gesto (p. ej. para volver a medir la zona tras desplazar la pantalla). */
  onStart?: () => void;
  label: string;
}) {
  const [pos] = useState(() => new Animated.ValueXY());
  const cb = useRef({ getTarget, onDrop, onStart });
  useEffect(() => {
    cb.current = { getTarget, onDrop, onStart };
  });

  const pan = useMemo(
    () =>
      // Los refs solo se leen dentro de los manejadores del gesto, nunca durante el render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => cb.current.onStart?.(),
        onPanResponderTerminationRequest: () => false,
        onPanResponderMove: Animated.event([null, { dx: pos.x, dy: pos.y }], { useNativeDriver: false }),
        onPanResponderRelease: (_, g) => {
          const moved = Math.abs(g.dx) + Math.abs(g.dy) > 8;
          const t = cb.current.getTarget();
          const inside = t && g.moveX >= t.x && g.moveX <= t.x + t.w && g.moveY >= t.y && g.moveY <= t.y + t.h;
          if (!moved || inside) cb.current.onDrop();
          Animated.spring(pos, { toValue: { x: 0, y: 0 }, useNativeDriver: false, speed: 40, bounciness: 6 }).start();
        },
        onPanResponderTerminate: () => pos.setValue({ x: 0, y: 0 }),
      }),
    [pos],
  );

  return (
    <View accessible accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Toca o arrastra hasta el átomo" onAccessibilityTap={() => onDrop()}>
      <Animated.View {...pan.panHandlers} style={{ transform: pos.getTranslateTransform(), zIndex: 10 }}>
        {children}
      </Animated.View>
    </View>
  );
}
