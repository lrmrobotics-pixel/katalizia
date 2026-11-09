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

Kata funciona en **modo local (sin IA)** hasta que se configure un backend con un proveedor de IA.
Todos los datos se guardan solo en el dispositivo.
