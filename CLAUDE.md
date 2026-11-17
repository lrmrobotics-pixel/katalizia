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

APK y actualizaciones por aire: ver `docs/RELEASE.md` (EAS Build perfil `preview` + EAS Update canal `preview`).
Sincronización en la nube: ver `docs/SUPABASE.md` (inactiva sin `.env`; la UI lo indica).
No hay Java/Android SDK en la máquina de desarrollo: no compilar localmente con `expo run:android`.

## Stack

Expo SDK 58 · React Native 0.88 · TypeScript estricto · Expo Router (rutas en `src/app`) ·
Zustand + AsyncStorage (local-first) · react-native-svg (pixel art) · Reanimated · Jest (jest-expo).

## Arquitectura

```
src/
  app/            rutas Expo Router: (tabs)/ inicio, academia, tutor, explorar, yo · onboarding · ajustes ·
                  tabla/ · leccion/[id] · diagnostico · repaso · estadisticas · misiones · laboratorio ·
                  juegos/ (rush, molecula, balanceo) · cuenta (sincronización)
  core/           lógica pura sin React (100 % testeable)
    chemistry/    fórmulas, masa molar, balanceo, estequiometría, pH, unidades, config. electrónica
    learning/     tipos del currículo, dominio (BKT), repetición espaciada (SM-2), desbloqueos
    gamification/ XP, niveles, monedas, continuidad semanal flexible, misiones e insignias
    games/        lógica de minijuegos (comprueba con el núcleo químico)
    notifications/ plan puro de recordatorios (estudio y bienestar)
    sync/         instantánea y fusión de progreso entre dispositivos
    pet/          bienestar sin culpa, poses compartidas de los 3 estilos de Kata, mensajes
    render3d/     motor 3D low-poly propio (proyección, profundidad, luz) dibujado con SVG
    lab/          lógica del laboratorio (átomos, valencias, indicadores, Arrhenius)
  content/        currículo (12 mundos) y, desde Fase 3, lecciones/preguntas con fuentes
  data/           datos científicos estructurados (118 elementos)
  state/          stores Zustand persistidos (settings, profile, learning, rewards, pet)
  theme/          tokens, paletas, useTheme (modo, contraste, tamaño de texto, movimiento reducido)
  components/     ui/ primitivos y escenarios (scene.tsx, SciIcon) · pet/ KataAvatar (pixel, 2D, 3D) · lab/ módulos · games/ marco común · WorldArt
  services/ai/    interfaz TutorProvider + LocalTutor (sin IA, 30 temas); un proveedor real solo vía backend
  services/cloud/ cliente Supabase (solo clave anon) y sincronización automática
  services/notifications.ts  recordatorios locales con expo-notifications
  components/lesson/ QuestionView (5 tipos de pregunta), Visuals (SVG con límites del modelo)
  content/world1/ unidades con 10 pasos pedagógicos; diagnostic.ts
  content/worldN.ts mundos 2–12, escritos con los ayudantes de content/build.ts
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
11. No copiar personajes comerciales. Kata es original en sus 3 estilos (`components/pet/`). Usar siempre `KataAvatar`.
12. Mientras no haya dependencias nativas nuevas, las mejoras llegan al APK por EAS Update. El 3D usa `core/render3d`, no expo-gl.

## Contenido académico

- Unidades nuevas: usar `unit()`, `sc()`, `mc()`, `num()`, `match()`, `order()` de `content/build.ts`.
- Cada unidad: `steps` con los 10 pasos en orden fijo (lo verifica `core/__tests__/content.test.ts`).
- Cada concepto: ≥ 3 preguntas (mínimo de intentos para el dominio; lo verifica `worlds.test.ts`).
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
| expo-updates | actualizaciones por aire (EAS Update) al abrir la app |
| expo-notifications | recordatorios locales de estudio y bienestar (sin push remoto) |
| @supabase/supabase-js | sincronización opcional del progreso (login por código al correo, RLS) |
| react-native-url-polyfill | requerido por supabase-js en React Native |

## Estado

Ver `docs/ROADMAP.md` (fases, hecho/pendiente, decisiones abiertas).
