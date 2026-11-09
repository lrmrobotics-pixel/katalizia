# KATALIZIA — guía para Claude Code

App móvil educativa de química (Android primero, iOS viable) para una estudiante que se prepara para Medicina.
Eslogan: "Química que te transforma". Idioma de la app: español.

## Comandos

```bash
npm start            # servidor Expo (escanear QR con Expo Go en Android)
npm run android      # abre en emulador/dispositivo Android conectado
npm test             # pruebas Jest (jest-expo)
npm run typecheck    # tsc --noEmit
npx eslint src       # lint (eslint-config-expo, incluye reglas del React Compiler)
npm run icons        # regenera iconos PNG desde el sprite del gato
```

APK de prueba: `npx eas-cli build -p android --profile preview` (requiere cuenta Expo; ver docs/ROADMAP.md).
No hay Java/Android SDK en la máquina de desarrollo: no compilar localmente con `expo run:android`.

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript estricto · Expo Router (rutas en `src/app`) ·
Zustand + AsyncStorage (local-first) · react-native-svg (pixel art) · Reanimated · Jest (jest-expo).

## Arquitectura

```
src/
  app/            rutas Expo Router: (tabs)/ inicio, academia, tutor, explorar, yo · onboarding · ajustes ·
                  tabla/ · leccion/[id] · diagnostico · repaso
  core/           lógica pura sin React (100 % testeable)
    chemistry/    fórmulas, masa molar, balanceo, estequiometría, pH, unidades, config. electrónica
    learning/     tipos del currículo, dominio (BKT), repetición espaciada (SM-2), desbloqueos
    gamification/ XP, niveles, monedas, continuidad semanal flexible
    pet/          bienestar de la mascota (sin culpa)
  content/        currículo (12 mundos) y, desde Fase 3, lecciones/preguntas con fuentes
  data/           datos científicos estructurados (118 elementos)
  state/          stores Zustand persistidos (settings, profile, learning, rewards, pet)
  theme/          tokens, paletas, useTheme (modo, contraste, tamaño de texto, movimiento reducido)
  components/     ui/ primitivos · pet/ sprite y PixelCat
  services/ai/    interfaz TutorProvider + LocalTutor (sin IA); un proveedor real solo vía backend
  components/lesson/ QuestionView (5 tipos de pregunta), Visuals (SVG con límites del modelo)
  content/world1/ unidades con 10 pasos pedagógicos; diagnostic.ts
```

## Reglas del proyecto (obligatorias)

1. Exactitud científica: no inventar datos. Todo dato o contenido lleva fuente (comentario en `data/` o `sources` en cada unidad).
   Fuentes preferentes: OpenStax Chemistry 2e / Biology 2e, IUPAC (Gold Book, CIAAW), NIST, ACS, Lehninger, Harper.
2. Separar siempre: explicación sencilla · analogía (marcada como metáfora, con sus límites) · definición formal · aplicación.
3. Nada de culpa: descansar nunca rompe rachas diarias, quita XP, monedas, inventario ni progreso. El gato nunca enferma ni se entristece.
4. Dominio real: desbloquear exige umbral (configurable, 80 % por defecto) + evidencia mínima + variedad + retención espaciada (`core/learning/mastery.ts`).
5. Honestidad: funciones no implementadas usan `<ComingSoon phase={n} />`. Nunca simular IA, notificaciones o sync que no existan.
6. Seguridad: ninguna API key en la app. Proveedores de IA solo vía backend. Ningún dato personal real en el repo.
7. Accesibilidad: objetivos táctiles ≥ 48 dp (`MIN_TOUCH`), texto ≥ 13 (lectura ≥ 16), `accessibilityLabel` en controles, respetar `reduceMotion`.
8. Temas médicos: solo educativos; nunca diagnóstico ni indicaciones de tratamiento.
9. Lógica nueva → en `core/` con pruebas. Cálculos químicos siempre con pruebas contra valores de libro.
10. Dependencias nuevas: justificar en este archivo. Usar `npx expo install` para versiones compatibles.
11. No copiar personajes comerciales. El gato es un sprite original (`components/pet/catSprite.ts`).

## Contenido académico

- Cada unidad: `steps` con los 10 pasos en orden fijo (lo verifica `core/__tests__/content.test.ts`).
- Cada distractor de opción múltiple lleva `misconception`; cada concepto se evalúa con ≥ 2 tipos de evidencia.
- Las respuestas numéricas deben poder recalcularse con `core/chemistry`.
- Verificar en web: `npm run web` y viewport móvil; el lanzador está en `../.claude/launch.json`.

## Convenciones

- Alias `@/` → `src/`. Archivos de lógica en camelCase; componentes en PascalCase; rutas en minúsculas.
- Textos de UI en español neutro. Comentarios en español.
- Stores: `persist` con `version`; al cambiar forma, añadir `migrate`.
- Colores solo desde `useTheme().colors` o `CATEGORY_COLORS`; nada de hex sueltos en pantallas (salvo color del mundo).

## Dependencias y por qué

| Paquete | Motivo |
|---|---|
| expo-router | navegación por archivos, tabs + stack |
| zustand | estado global mínimo con middleware `persist` |
| @react-native-async-storage/async-storage | persistencia local compatible con Expo Go |
| react-native-svg | sprite pixel del gato, iconos, futura tabla/gráficos |
| @expo-google-fonts/press-start-2p | fuente pixel solo para títulos cortos (no para lectura) |
| jest-expo, @testing-library/react-native | pruebas |
| eslint, eslint-config-expo | lint (instalado por `expo lint`) |

## Estado

Ver `docs/ROADMAP.md` (fases, hecho/pendiente, decisiones abiertas).
