import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';

import { tabs } from './tabs-config';

/** Web: JS tab bar (renders real links); styled by the navigation theme. */
export function AppTabs() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t(tab.labelKey),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.ionicon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
