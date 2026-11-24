# KATALIZIA

*Química que te transforma · Aprende. Experimenta. Evoluciona.*

App móvil educativa de química (Android primero) para construir, desde cero, la base química necesaria para Medicina.

## Probar en tu teléfono Android (sin instalar nada más en el PC)

1. Instala **Expo Go** desde Google Play.
2. En esta carpeta ejecuta:

   ```bash
   npm start
   ```

3. Escanea el código QR con Expo Go (teléfono y PC en la misma red Wi-Fi).

## Otros comandos

```bash
npm run web        # versión web para revisar rápido en el navegador
npm test           # pruebas
npm run typecheck  # comprobación de tipos
npx eslint src     # lint
npm run icons      # regenerar iconos desde el sprite del gato
```

## Estado

Ver [docs/ROADMAP.md](docs/ROADMAP.md). Reglas y arquitectura: [CLAUDE.md](CLAUDE.md).

Kata funciona en **modo local (sin IA)**: 30 temas escritos a mano con fuentes.
Los datos se guardan en el dispositivo; la sincronización en la nube es opcional (ver [docs/SUPABASE.md](docs/SUPABASE.md)).

## APK para compartir y actualizaciones automáticas

Ver [docs/RELEASE.md](docs/RELEASE.md): APK por EAS Build (enlace para WhatsApp) y EAS Update
(la app se actualiza sola al cerrarla y volver a abrirla).

## Licencia

Código abierto bajo licencia [MIT](LICENSE). ¡Las contribuciones son bienvenidas!
