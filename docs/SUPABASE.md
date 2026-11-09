# Sincronización en la nube con Supabase

La app es local-first: sin configurar nada, todo se guarda en el teléfono y la pantalla de Sincronización lo dice.
Al configurar Supabase, la estudiante puede iniciar sesión con su correo (código de un solo uso, sin contraseña)
y su progreso se copia en la nube y se fusiona entre dispositivos sin perder respuestas.

## Qué se sincroniza

Respuestas (intentos), unidades superadas, repaso espaciado (se recalcula), XP, monedas, inventario, insignias,
elementos descubiertos, misiones, tiempo de estudio, récords, mascota, perfil y preferencias de aprendizaje.
**No** se sincronizan las conversaciones con Kata ni los recordatorios.

## Configuración (requiere a la propietaria)

1. Crear una cuenta y un proyecto gratis en https://supabase.com (plan Free).
2. En el proyecto: **SQL Editor** → pegar y ejecutar `supabase/migrations/0001_progress.sql`
   (crea la tabla `progress` con seguridad por filas: cada usuaria solo accede a su fila).
3. **Authentication → Providers → Email**: activado. En **Authentication → Email Templates → Magic Link**,
   incluir el código con `{{ .Token }}` para que el correo traiga el código de 6 dígitos que pide la app.
4. **Project Settings → API**: copiar `Project URL` y la clave `anon public`.
5. En `katalizia/`, copiar `.env.example` como `.env` y rellenar:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

   `.env` está en `.gitignore`. Para los APK de EAS, añadir las mismas dos variables en expo.dev →
   proyecto → **Environment variables** (entorno `preview`).

## Seguridad

- La clave `anon` es pública por diseño: lo que protege los datos son las políticas RLS de la migración.
- **Nunca** pongas la clave `service_role` en la app ni en el repositorio.
- Borrar los datos en Ajustes no borra la copia de la nube; para eso: cerrar sesión y, si se desea, eliminar el
  usuario desde el panel de Supabase (la fila se borra en cascada).

## Fusión de datos (resumen)

Ver `src/core/sync/merge.ts`. Intentos y conjuntos se unen; contadores toman el máximo; perfil, mascota y
preferencias se toman de la copia modificada más recientemente. Límite conocido: si se estudia sin conexión en
dos dispositivos a la vez, la XP de ese periodo puede contarse solo una vez (el progreso académico no se pierde).
