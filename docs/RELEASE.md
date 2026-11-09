# Publicar KATALIZIA: APK para compartir y actualizaciones automáticas

Se usan dos servicios gratuitos de Expo (plan Free):

- **EAS Build** compila el APK en la nube. No hace falta Android Studio ni Java en el PC.
- **EAS Update** envía cambios de código (pantallas, contenido, correcciones) a los teléfonos que ya tienen la app.
  La app descarga la novedad al abrirse y la aplica la **siguiente vez que se abre** (o al pulsar "Actualizar ahora").

## Una sola vez (requiere a la propietaria)

1. Crear una cuenta gratis en https://expo.dev/signup.
2. En una terminal, dentro de `katalizia/`, iniciar sesión:

   ```bash
   npx eas-cli login
   ```

3. Vincular el proyecto y configurar las actualizaciones (esto escribe el `projectId` y la URL de updates en `app.json`):

   ```bash
   npx eas-cli init
   npx eas-cli update:configure
   ```

## Generar el APK para compartir

```bash
npx eas-cli build -p android --profile preview
```

- Tarda unos 10–20 min en la cola gratuita. Al terminar, EAS da un **enlace de descarga** y un QR.
- Ese enlace (o el archivo `.apk` descargado) se puede compartir por WhatsApp. En el teléfono hay que permitir
  "instalar apps de origen desconocido" la primera vez.
- Solo hay que volver a compilar el APK cuando cambian dependencias nativas o la versión de `app.json`.

## Enviar una actualización sin reinstalar

```bash
npx eas-cli update --channel preview --message "Describe el cambio"
```

Los teléfonos con el APK del canal `preview` la descargan al abrir la app y la aplican al volver a abrirla.

### Cuándo NO basta una actualización

`runtimeVersion` usa la política `appVersion`: los APK solo aceptan updates con la misma `version` de `app.json`.
Si se añade un módulo nativo (p. ej., un paquete nuevo de Expo con código nativo) hay que:

1. Subir `version` en `app.json` (p. ej., 1.0.0 → 1.1.0).
2. Compilar y compartir un APK nuevo.

## Perfiles (`eas.json`)

| Perfil | Uso | Salida |
|---|---|---|
| `preview` | Compartir con la estudiante / pruebas | APK instalable, canal `preview` |
| `production` | Google Play (futuro) | AAB, canal `production` |

## Probar sin compilar

Con Expo Go (Google Play) y `npm start` se puede probar todo salvo las actualizaciones por aire
(Expo Go no las usa) y, en Android, algunas funciones de notificaciones.
