import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelIcon, type IconName } from '@/components/ui/PixelIcon';
import { useProfile } from '@/state/profile';
import { useTheme } from '@/theme/useTheme';

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Inicio', icon: 'home' },
  { name: 'academia', title: 'Academia', icon: 'book' },
  { name: 'tutor', title: 'Kata', icon: 'chat' },
  { name: 'explorar', title: 'Explorar', icon: 'flask' },
  { name: 'yo', title: 'Yo', icon: 'cat' },
];

export default function TabsLayout() {
  const onboardingDone = useProfile((s) => s.onboardingDone);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!onboardingDone) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 2,
          height: 70 + insets.bottom,
          paddingTop: 4,
          paddingBottom: 4 + insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 12, lineHeight: 14, fontWeight: '700' },
        tabBarItemStyle: { paddingVertical: 2 },
      }}>
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color }) => <PixelIcon name={t.icon} color={color as string} size={20} />,
          }}
        />
      ))}
    </Tabs>
  );
}
