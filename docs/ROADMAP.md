# KATALIZIA — hoja de ruta

Leyenda: ✅ hecho y verificado · 🟡 parcial · ⬜ pendiente

Verificación: `npm test` (Jest, 7 suites), `npm run typecheck`, `npx eslint src`, y recorrido manual en la
versión web (`npm run web`) con viewport móvil. No se ha probado aún en un Android físico (requiere Expo Go).

## Fase 1 — Fundación ✅

- ✅ Expo SDK 58 + TypeScript estricto + Expo Router (pestañas + stack)
- ✅ Sistema de diseño: tokens, 3 paletas, oscuro/claro/sistema, alto contraste, tamaño de texto, movimiento reducido
- ✅ Componentes: `Screen`, `Card`, `Button`, `ProgressBar`, `Chip`, `ComingSoon`, `StateView`, `PixelIcon`
- ✅ Gato pixel art original (20×26), 8 expresiones, parpadeo, animación idle, 5 accesorios
- ✅ Iconos de app generados desde el sprite (`npm run icons`), splash animado
- ✅ Modelo de datos: mundo → módulo → unidad → pasos/preguntas, con fuentes por unidad
- ✅ Núcleo químico probado: masa molar (paréntesis, hidratos), balanceo algebraico exacto, gramos↔moles,
  molaridad, dilución, reactivo limitante, rendimiento, pH (fuerte, débil, amortiguador), unidades SI,
  notación científica, cifras significativas, configuración electrónica de los 118 elementos
- ✅ Persistencia local (Zustand + AsyncStorage) con rehidratación probada

## Fase 2 — Experiencia principal 🟡
- ✅ Onboarding (nombre, objetivos, ritmo semanal)
- ✅ Dashboard: saludo de Kata, nivel/XP/monedas, ritmo semanal sin culpa, diagnóstico, repaso del día, continuar
- ✅ Ajustes: perfil, apariencia, estilo de explicación, meta semanal, umbral de dominio, borrar datos
- 🟡 Progreso: resumen en "Yo"; falta pantalla de estadísticas (tiempo de estudio, historial, evolución)
- ⬜ Pruebas de navegación con `expo-router/testing-library`

## Fase 3 — Academia 🟡
- ✅ Motor de lección con los 10 pasos pedagógicos, metáforas marcadas con sus límites, visuales SVG con límites del modelo
- ✅ 5 tipos de pregunta: opción única, múltiple, numérica (coma/punto/notación científica), ordenar, emparejar
- ✅ Pistas progresivas; cada distractor explica su error conceptual; detecta errores de potencia de 10
- ✅ Repaso de errores al final de cada unidad; evaluación con umbral sin pistas; repetir unidad si no se alcanza
- ✅ Dominio BKT + evidencia variada + retención espaciada; desbloqueo por prerrequisitos (unidades y mundos)
- ✅ Repetición espaciada SM-2 y pantalla de repaso adaptativo (prioriza preguntas falladas)
- ✅ Diagnóstico inicial (10 preguntas, 3 áreas) → recomendaciones; nunca desbloquea contenido
- ✅ Mundo 1: 3 unidades (materia y cambios · sustancias y mezclas · medición y densidad), 26 preguntas, fuentes OpenStax/BIPM/IUPAC
- ⬜ Mundo 1: falta unidad de notación científica avanzada/cifras significativas como unidad propia
- ⬜ Mundos 2–12: contenido (estructura y temario ya definidos en `content/curriculum.ts`)

## Fase 4 — Tutor 🟡
- ✅ Capa `services/ai` con interfaz `TutorProvider` (sin acoplar a proveedor)
- ✅ `LocalTutor` (NO es IA, la UI lo indica): 7 temas, estilos sencillo/formal/chisme, cambio de estrategia,
  masa molar paso a paso, balanceo con pista antes de la solución
- ✅ Chat con historial persistido, sugerencias, borrar conversación
- ⬜ Backend proxy + proveedor de IA real — **requiere decisión y credenciales**

## Fase 5 — Mascota y gamificación 🟡
- ✅ Alimentar, jugar, curiosidades, vestuario con compra/equipar; bienestar con piso, sin castigos
- ✅ XP, niveles, monedas, continuidad semanal flexible
- ⬜ Misiones diarias/semanales, insignias con criterios, laboratorio decorable
- ⬜ Notificaciones locales (expo-notifications) y recordatorios de bienestar

## Fase 6 — Juegos y laboratorio 🟡
- ✅ Tabla periódica: 118 elementos, búsqueda, filtros por familia, favoritos, detalle, configuración electrónica
- ⬜ Tabla: electronegatividad, radios, ionización (con fuente), usos, importancia biológica, tendencias visuales
- ⬜ Minijuegos (mínimo dos para la v1: Molecular Lab y Periodic Rush)
- ⬜ Simulaciones: pH, disoluciones, balanceo interactivo, átomo de Bohr

## Fase 7 — Lanzamiento ⬜
- `eas.json` con perfil `preview` (APK) y build en la nube; auditoría de accesibilidad y rendimiento

## Decisiones abiertas (requieren al propietario)
1. Proveedor de IA para Kata y dónde alojar el backend (coste mensual).
2. ¿Sincronización en la nube (Supabase) o solo local?
3. Cuenta Expo para compilar el APK con EAS Build.
4. Identificador Android definitivo (`com.katalizia.app` es provisional).
5. ¿Inicializar repositorio git y hacer commits por fase?

## Limitaciones conocidas
- Balanceo: sin cargas iónicas ni semirreacciones redox.
- pH: actividad ≈ concentración, 25 °C, especies monopróticas.
- Superpesados (Z ≥ 104): datos predichos, marcados en la UI.
- Un concepto necesita ≥ 3 respuestas; los de pocas preguntas se completan vía repaso espaciado.
