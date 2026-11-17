# Auditoría KATALIZIA 2.0

Fecha: 2026-11-16 · Base auditada: commit `6dca99e` (rama `main`, repo privado `lrmrobotics-pixel/katalizia`).

Método: lectura completa de `src/` (pantallas, estado, núcleo, contenido), `app.json`, `eas.json`, `package.json`
y documentación. **No hay emulador Android en esta máquina** (sin Java ni Android SDK). Por eso las pruebas visuales
se hacen en la versión web con viewport de teléfono (375 × 812) y en el APK ya instalado por la propietaria. Este
documento no afirma resultados en Android que no se hayan observado.

## 1. Estado actual

| Aspecto | Estado |
|---|---|
| Framework | Expo SDK 58, React Native 0.88, TypeScript estricto, Expo Router (`src/app`) |
| Estado | Zustand + `persist` en AsyncStorage, con versiones y migraciones |
| Gráficos | `react-native-svg` (sprite pixel, visuales), Reanimated 4 (balanceo del gato) |
| Pruebas | Jest (jest-expo): 12 suites, 182 pruebas en verde; `tsc` y `eslint` limpios |
| Distribución | APK por EAS Build (perfil `preview`) + EAS Update (canal `preview`, `runtimeVersion` = versión de la app) |
| Web | `https://katalizia.expo.app` (EAS Hosting, se publica a mano) |
| Nube | Supabase programado pero inactivo hasta que haya claves en `.env` |
| IA | Kata en modo local (sin IA): 30 temas escritos a mano con fuentes, calculadoras reales |

Dependencias nativas actuales: todas incluidas en el APK publicado. **Mientras no se añada ninguna dependencia nativa
nueva, cualquier mejora llega al teléfono por EAS Update sin reinstalar.** Esto es una restricción de diseño de 2.0.

## 2. Inventario de pantallas

| Ruta | Función | Real / visual |
|---|---|---|
| `(tabs)/index` Inicio | saludo, Kata, nivel/XP/monedas, ritmo semanal, diagnóstico, repaso, continuar, misiones, accesos | Real; diseño en lista de tarjetas |
| `(tabs)/academia` | 12 mundos con dominio y desbloqueo; lista de unidades | Real; lista larga de tarjetas |
| `(tabs)/tutor` Kata | chat con tutor local, sugerencias, estilo de explicación | Real (local, declarado "sin IA") |
| `(tabs)/explorar` | accesos a tabla, laboratorio y 3 minijuegos | Real; solo tarjetas con texto |
| `(tabs)/yo` | gato, energía/alegría, vestuario (5 accesorios), progreso | Real; texto "Fase 3" desactualizado |
| `onboarding`, `diagnostico`, `repaso` | alta, diagnóstico de 10 preguntas, repaso espaciado SM-2 | Real |
| `leccion/[id]` | 10 pasos pedagógicos, 5 tipos de pregunta, dominio BKT | Real; mayormente texto + 4 visuales SVG estáticos |
| `tabla/index`, `tabla/[z]` | 118 elementos, búsqueda, filtros, favoritos, ficha | Real; ficha sin representación del átomo |
| `laboratorio` | pH (4 sustancias, calculado), diluciones C₁V₁ = C₂V₂, masa molar | Real; sin constructor de átomos ni energía |
| `juegos/rush`, `molecula`, `balanceo` | 3 minijuegos con récords | Real; mecánica de botones, sin escenario |
| `misiones`, `estadisticas` | misiones diarias/semanales, 14 insignias, gráficas | Real |
| `ajustes`, `cuenta` | tema, accesibilidad, recordatorios, actualizaciones, sincronización | Real |

## 3. Funcionalidades que deben conservarse

- Núcleo químico probado (`core/chemistry`): fórmulas, masa molar, balanceo, estequiometría, pH, configuración.
- Dominio real (BKT + evidencia variada + retención espaciada) y desbloqueo por umbral configurable.
- Contenido de los 12 mundos con fuentes, metáforas marcadas con sus límites y distractores con error conceptual.
- Gamificación sin culpa: XP, monedas, niveles, misiones, insignias, ritmo semanal flexible; la mascota nunca enferma.
- Persistencia local, migraciones de stores, recordatorios locales, EAS Update, sincronización opcional.
- Accesibilidad: objetivos ≥ 48 dp, etiquetas, alto contraste, tamaño de texto, movimiento reducido.
- El sprite original de Kata (pixel art 20 × 26) y sus 8 expresiones.

## 4. Problemas de UX/UI

1. Todas las pantallas son columnas de `Card` con borde + título + párrafo + botón: monótono, aspecto de web adaptada.
2. No hay ilustraciones propias por mundo; los mundos solo se distinguen por un color.
3. Inicio mezcla 7 bloques del mismo peso visual; no hay una acción principal clara.
4. Kata tiene un único estilo y una sola animación (balanceo + parpadeo). Sus reacciones no están en lecciones ni juegos de forma sistemática.
5. Lecciones: mucho texto pasivo; solo 4 visuales y ninguno interactivo.
6. Laboratorio: formularios con steppers; falta escenario y resultados visuales (sin color de indicador, sin partículas).
7. Ficha de elemento sin representación del átomo; no se pueden comparar elementos.
8. Se usan caracteres "✓ ○ ⏱" como iconografía en algunas pantallas.
9. Texto desactualizado: "Fase 3/Fase 6" en `yo` y `tabla/[z]` (las funciones ya existen o no están planificadas así).

## 5. Problemas de navegación

- Las 5 pestañas funcionan; la pestaña "Kata" es el tutor, pero la personalización de Kata está en "Yo": correcto pero sin acceso cruzado.
- Laboratorio y juegos solo se alcanzan desde Explorar; no hay accesos rápidos visuales en Inicio.
- La tabla periódica usa celdas de 46 dp con desplazamiento horizontal: legible, pero sin vista por familias.

## 6. Oportunidades de mejora (priorizadas)

1. **Kata con tres estilos** reales (pixel, 2D vectorial animado por partes, 3D en tiempo real) compartiendo estado, ánimo y accesorios.
2. **Inicio como centro de operaciones**: encabezado con Kata, progreso animado, misión principal ilustrada, mapa de mundos, continuar, accesos rápidos.
3. **Ilustraciones vectoriales propias** para los 12 mundos (reutilizadas en Inicio y Academia).
4. **Laboratorio**: constructor de átomos, constructor de moléculas con enlaces y validación de valencia, indicadores de pH con color, simulación de temperatura/velocidad (Arrhenius).
5. **Lecciones**: visuales interactivos (átomo explorable) y etiquetas de fase DESCUBRIR → DOMINAR sobre los 10 pasos existentes.
6. **Tabla**: átomo de Bohr en la ficha, vista por familias, comparación de dos elementos.
7. **Juegos**: escenario, modo sin tiempo, combos visibles, reacciones de Kata.

## 7. Riesgos técnicos

| Riesgo | Mitigación |
|---|---|
| 3D en tiempo real con `expo-gl`/`three` añade dependencias nativas → obliga a reinstalar el APK; peso ≈ 1 MB+ de JS y riesgo en web/GPU de gama baja | Motor 3D propio y pequeño en TypeScript: malla low-poly real, rotación, proyección en perspectiva, ordenación por profundidad e iluminación Lambert, dibujado con `react-native-svg`. Sin dependencias nuevas, funciona en web y Android, lógica probada en Jest. Se declara como "3D low-poly en tiempo real". |
| Rendimiento de SVG con cientos de polígonos en Android | Mallas de ≤ 400 caras, recálculo solo al girar o por animación a ~20 fps, `reduceMotion` lo congela |
| Animaciones 2D con transformaciones SVG distintas en web y nativo | Cada parte del personaje 2D va en su propia capa `Animated.View` (transformaciones de Reanimated, fiables en ambas plataformas) |
| Cambios de forma en stores persistidos | `version` + `migrate` en cada store tocado; pruebas de migración |
| Datos científicos nuevos (indicadores, Arrhenius) | Solo datos con fuente (OpenStax Chemistry 2e); simplificaciones escritas en pantalla |
| Sin emulador Android | Pruebas en web móvil + pruebas unitarias; la propietaria valida en el APK real tras el EAS Update |

## 8. Plan de implementación

| Fase | Entregable | Estado |
|---|---|---|
| 1 Auditoría | este documento | hecho |
| 2 Diseño e Inicio | nuevos primitivos (panel con degradado, acciones rápidas, anillo de XP), ilustraciones de mundos, Inicio rediseñado | en esta entrega |
| 3 Kata | `KataAvatar` con 3 estilos, selector con vista previa, 10 ánimos, animaciones por estilo, preferencia persistida | en esta entrega |
| 4 Academia visual | mapa de mundos ilustrado, fases DESCUBRIR→DOMINAR, átomo interactivo en lecciones | en esta entrega (parcial) |
| 5 Laboratorio | constructor de átomos, constructor de moléculas, indicadores de pH, temperatura y velocidad | en esta entrega |
| 6 Juegos | mejoras de Rush (sin tiempo, combos, Kata); nuevos juegos | parcial; ver `cambios_katalizia.md` |
| 7 Tabla y Explorar | átomo de Bohr, comparación, Explorar visual | en esta entrega |
| 8 Tutor y gamificación | modos Profesor / Experimento / Chisme, celebración animada | en esta entrega (parcial) |
| 9 Optimización | pruebas web móvil, unitarias, lint, tipos | al cierre |
| 10 Compilación | EAS Update al APK instalado (sin dependencias nativas nuevas); APK nuevo opcional | al cierre |

Las funciones que no queden listas se documentan como pendientes; no se muestran botones ni estilos sin implementar.
