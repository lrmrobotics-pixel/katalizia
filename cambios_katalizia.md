# Cambios KATALIZIA 2.0

Rama: `feat/katalizia-2` (no fusionada en `main`, no publicada por EAS Update todavía).

## Hecho

- **Auditoría**: `AUDITORIA_KATALIZIA_2.md`.
- **Kata en 3 estilos** (selector con vista previa en Yo; preferencia guardada en `usePet().style`, migración v1→v2; progreso, accesorios y bienestar intactos):
  - Pixel art: sprite original + animación por cuadros (respiración, chispas, idea, zzz, burbujas, pregunta, caminar, saludar).
  - Animación 2D: personaje vectorial con cuerpo, brazos, cola, cabeza, cejas, ojos y boca animados por partes.
  - 3D: modelo low-poly real con motor propio (`src/core/render3d`): perspectiva, ocultación de caras traseras, profundidad, luz por bandas; se gira arrastrando. Sin dependencias nativas nuevas.
  - 10 ánimos compartidos (`core/pet/animation.ts`), 4 trucos desbloqueables por nivel y expresiones desbloqueables.
  - Accesorios nuevos (gafas doradas, gafas violeta, matraz) visibles en los tres estilos.
- **Inicio rediseñado**: escenario con Kata y mensaje dinámico (`core/pet/messages.ts`), indicador de avisos, anillo de nivel, barra de XP animada, ritmo semanal, misión principal ilustrada, mapa de 12 mundos con ilustraciones originales (`WorldArt`), continuar, accesos rápidos y misiones.
- **Primitivos visuales**: `Stage`, `ProgressRing`, `GlowBar`, `ActionTile`, `StatPill`, iconos vectoriales `SciIcon`.
- **Laboratorio (7 módulos)**: constructor de átomos con arrastre y retos; constructor de moléculas (arrastrar, enlaces simple/doble/triple, valencias de Lewis); pH con predicción y 3 indicadores; balanceador con recuento de átomos; disoluciones con color; energía y velocidad (Arrhenius, catalizador); masa molar con composición. Cada módulo declara sus simplificaciones y fuente.
- **Tabla periódica**: vistas Tabla / Familias / Lista, comparación de dos elementos, elementos descubiertos resaltados; ficha con átomo de capas animado y retos relacionados.

## Pruebas ejecutadas

- Nuevas suites: `src/core/__tests__/kata.test.ts` (motor 3D, poses, accesorios) y `lab.test.ts` (átomos, moléculas, indicadores, Arrhenius): en verde.
- `tsc --noEmit`: limpio tras el último cambio.
- Web en viewport móvil 375×812: Inicio, Yo (3 estilos), laboratorio (arrastre de partículas, agua con enlaces y arrastre de átomos, pH 2 con indicadores) verificados visualmente.
- **No ejecutado aún**: suite completa de Jest tras los últimos cambios, `eslint`, la tabla nueva en el navegador, pruebas en Android real.

## Errores encontrados y corregidos

- Atributo `accessible={false}` en `<Svg>` daba aviso en web: quitado.
- Choque de nombres `kata3d.ts`/`Kata3D.tsx` en Windows: modelo renombrado a `kataModel3d.ts`.
- Brazos y cola del 3D poco visibles: reajustados.

## Pendiente

- Juegos nuevos (PH Master, Chemistry Kitchen, BioQuest) y mejoras de Periodic Rush (modo sin tiempo, combos visibles, Kata reaccionando).
- Explorar con diseño visual nuevo.
- Academia como ruta visual, fases DESCUBRIR→DOMINAR en lecciones, átomo interactivo en lecciones, Kata reaccionando a respuestas.
- Tutor con modos Profesor / Experimento / Chisme.
- Lint, suite completa, revisión en Android.

## Generar la versión de prueba

No se añadieron dependencias nativas, así que basta con EAS Update al APK instalado:

```bash
npx eas-cli update --channel preview --message "KATALIZIA 2.0"
```

APK nuevo (opcional): `npx eas-cli build -p android --profile preview`. Ver `docs/RELEASE.md`.
