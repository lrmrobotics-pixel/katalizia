# KATALIZIA — hoja de ruta

Leyenda: ✅ hecho y verificado · 🟡 parcial · ⬜ pendiente

Verificación: `npm test` (Jest, 12 suites, 182 pruebas), `npm run typecheck`, `npx eslint src`, y recorrido manual en
la versión web (`npm run web`) con viewport móvil. **No se ha probado aún en un Android físico** (Expo Go o APK).

## Fase 1 — Fundación ✅

- ✅ Expo SDK 58 + TypeScript estricto + Expo Router (pestañas + stack)
- ✅ Sistema de diseño: tokens, 3 paletas, oscuro/claro/sistema, alto contraste, tamaño de texto, movimiento reducido
- ✅ Gato pixel art original, 8 expresiones, 5 accesorios; iconos generados desde el sprite
- ✅ Núcleo químico probado (masa molar, balanceo, estequiometría, pH, unidades, configuración electrónica)
- ✅ Persistencia local con migraciones (`settings` v2, `rewards` v2)
- ✅ Git: commits por bloque en la rama `main` (repositorio local; remoto privado pendiente de `gh auth login`)

## Fase 2 — Experiencia principal ✅

- ✅ Onboarding, dashboard (nivel, ritmo semanal, misiones de hoy, repaso, continuar), ajustes
- ✅ Pantalla "Mi progreso": precisión, tiempo de estudio, actividad de 14 días, dominio por mundo, tipos de evidencia
- ⬜ Pruebas de navegación con `expo-router/testing-library`

## Fase 3 — Academia ✅

- ✅ Motor de lección de 10 pasos, 5 tipos de pregunta, pistas, errores conceptuales, repaso de errores
- ✅ Dominio BKT + evidencia variada + retención; desbloqueo por prerrequisitos; SM-2; diagnóstico
- ✅ **Los 12 mundos con contenido**: 25 unidades, 158 preguntas, fuentes por unidad (OpenStax, IUPAC/CIAAW, BIPM, Lehninger)
- ✅ Pruebas que recalculan las respuestas numéricas con el núcleo químico (`core/__tests__/worlds.test.ts`)
- 🟡 Cada mundo tiene 1 módulo (2 unidades); los temas restantes de `topics` quedan para ampliar

## Fase 4 — Tutor ✅ (modo local)

- ✅ `LocalTutor` sin IA (la UI lo indica): 30 temas de los 12 mundos, estilos sencillo/formal/chisme
- ⏸ Proveedor de IA real: **decisión de la propietaria: no por ahora** (la interfaz `TutorProvider` queda lista)

## Fase 5 — Mascota y gamificación ✅

- ✅ Mascota, vestuario, XP, monedas, continuidad semanal sin culpa
- ✅ Misiones diarias (3 rotativas) y semanales; 14 insignias con criterios explícitos (derivadas, sin estado oculto)
- ✅ Recordatorios locales de estudio y de bienestar (agua, pausas, estiramientos, vista, postura), desactivados por defecto
- 🟡 Recordatorios: lógica probada; falta probarlos en un teléfono real (en web no existen y la UI lo dice)

## Fase 6 — Juegos y laboratorio ✅

- ✅ Tabla periódica de 118 elementos
- ✅ Minijuegos: **Periodic Rush**, **Molecular Lab**, **Balance Express** (récords y XP; fallar nunca resta)
- ✅ Laboratorio virtual: simulador de pH (fuerte/débil), diluciones C₁V₁ = C₂V₂, calculadora de masa molar
- ⬜ Tabla: electronegatividad, radios e ionización por elemento (con fuente)
- ⬜ Más simulaciones: átomo de Bohr, valoraciones

## Fase 7 — Lanzamiento 🟡

- ✅ `eas.json` (perfil `preview` → APK) y `expo-updates` (descarga al abrir, aplica al reabrir; aviso "Actualizar ahora")
- ✅ Sincronización Supabase lista en código (login por código al correo, RLS, fusión sin pérdidas); **inactiva hasta configurar**
- ⬜ Cuenta Expo + `eas init` + primer APK (ver `docs/RELEASE.md`)
- ⬜ Proyecto Supabase + `.env` (ver `docs/SUPABASE.md`)
- ⬜ Auditoría de accesibilidad y rendimiento en dispositivo real

## Decisiones tomadas

1. Tutor: modo local por ahora (sin IA de pago).
2. Sincronización en la nube: sí, con Supabase.
3. APK compartible + actualizaciones automáticas: sí, con EAS Build + EAS Update.
4. Git con repositorio privado.

## Pendiente de la propietaria

1. Cuenta de Expo y `npx eas-cli login` (para el APK y las actualizaciones).
2. Proyecto de Supabase y sus dos claves públicas (para la sincronización).
3. `gh auth login` (para crear el repositorio privado en GitHub y subir el código).
4. Identificador Android definitivo (`com.katalizia.app` es provisional; cambiarlo después del primer APK obliga a reinstalar).

## Limitaciones conocidas

- Balanceo: sin cargas iónicas ni semirreacciones redox.
- pH: actividad ≈ concentración, 25 °C, especies monopróticas.
- Superpesados (Z ≥ 104): datos predichos, marcados en la UI.
- Sincronización: XP estudiada sin conexión en dos dispositivos a la vez puede contarse una sola vez.
- Tiempo de estudio: se mide con la pantalla abierta y en primer plano, máx. 60 min por sesión.
