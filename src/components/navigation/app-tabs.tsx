import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useTranslation } from 'react-i18next';

import { tabs } from './tabs-config';

/**
 * iOS + Android: the platform's own tab bar (UITabBarController / Material 3 bottom navigation).
 * On iOS 26+ this is the system Liquid Glass tab bar — don't set a backgroundColor or blurEffect,
 * which would replace the glass material.
 */
export function AppTabs() {
  const { t } = useTranslation();

  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{t(tab.labelKey)}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
