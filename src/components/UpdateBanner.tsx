/**
 * Actualizaciones por aire (EAS Update). La app descarga las novedades al abrirse
 * y las aplica al volver a abrirla; este aviso permite aplicarlas al momento.
 * En Expo Go y en web `Updates.isEnabled` es false y no se muestra nada.
 */
import * as Updates from 'expo-updates';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, KText } from '@/components/ui';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export function UpdateBanner() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { isUpdatePending } = Updates.useUpdates();
  if (!Updates.isEnabled || !isUpdatePending) return null;
  return (
    <View
      accessibilityRole="alert"
      style={{
        position: 'absolute',
        left: spacing.md,
        right: spacing.md,
        bottom: insets.bottom + 84,
        padding: spacing.md,
        gap: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: colors.accent,
        backgroundColor: colors.surface,
      }}>
      <KText>Kata trajo una versión nueva de la app.</KText>
      <Button label="Actualizar ahora" onPress={() => void Updates.reloadAsync()} />
    </View>
  );
}
