# Cambios KATALIZIA 2.0

Rama: `feat/katalizia-2`, fusionada en `main`.

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

- **Minijuegos nuevos** con mecánica real: PH Master (estimar pH calculado y leer indicadores), Chemistry Kitchen (diluciones y gramos de soluto, ±2 %), BioQuest (mapa del cuerpo: iones, gases y pH, con fuentes de OpenStax A&P 2e). Atom Builder = retos del laboratorio.
- **Periodic Rush**: modo zen sin cronómetro (20 preguntas, sin récord), combo visible y Kata reaccionando.
- **Explorar** rediseñado: escenario del laboratorio, tabla y 7 juegos con la habilidad que entrenan y récord.
- **Academia** como ruta visual: cada mundo con ilustración, anillo de dominio y unidades como paradas del camino.
- **Lecciones**: barra de fases DESCUBRIR → EXPLORAR → COMPRENDER → PRACTICAR → DOMINAR sobre los 10 pasos, Kata que reacciona a cada respuesta y 4 visuales interactivos nuevos (átomo explorable con isótopos de carbono, capas Z 1–20, polaridad de enlaces por ΔEN, reacción 2 H₂ + O₂ animada).
- **Tutor**: modos Profesor / Experimento (enlaza al módulo del laboratorio del tema) / Chisme científico; las analogías se marcan "no es literal". Ajustes v3 (`tutorMode`).

## Pruebas ejecutadas

- Jest completo: 16 suites, 226 pruebas en verde (nuevas: `kata`, `lab`, `extraGames`, `labLinks`).
- `tsc --noEmit` y `eslint src`: limpios.
- Web en viewport móvil 375×812: Inicio, Yo (3 estilos), laboratorio (arrastre de partículas, agua con enlaces, pH 2 con indicadores), Academia, lección con fases, BioQuest (acierto en pulmones), Chemistry Kitchen, PH Master y tutor con modos.
- **No probado**: Android real (no hay emulador en esta máquina); la tabla nueva y los visuales interactivos de los mundos 2, 4 y 5 solo se comprobaron por tipos y pruebas, no a la vista.

## Errores encontrados y corregidos

- Atributo `accessible={false}` en `<Svg>` daba aviso en web: quitado.
- Choque de nombres `kata3d.ts`/`Kata3D.tsx` en Windows: modelo renombrado a `kataModel3d.ts`.
- Brazos y cola del 3D poco visibles: reajustados.

## Pendiente

- Probar en el APK real: rendimiento del 3D en teléfonos de gama baja (si va lento, elegir pixel o 2D en Yo).
- Más visuales interactivos en los mundos 6–12 y esquemas corporales adicionales.
- Animaciones prerenderizadas o un modelo 3D con más detalle, si se decide añadir dependencias nativas (requeriría APK nuevo).
- Un aviso de desarrollo de React en web ("non-boolean attribute accessible") aparece una vez; no afecta al uso.

## Generar la versión de prueba

No se añadieron dependencias nativas, así que basta con EAS Update al APK instalado:

```bash
npx eas-cli update --channel preview --message "KATALIZIA 2.0"
```

APK nuevo (opcional): `npx eas-cli build -p android --profile preview`. Ver `docs/RELEASE.md`.
