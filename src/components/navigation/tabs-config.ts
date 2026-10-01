import type Ionicons from '@expo/vector-icons/Ionicons';
import { type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import { type ComponentProps } from 'react';

/** Single source of truth for the app's tabs (route name, label, icon per platform). */
export type TabConfig = {
  /** Route file name inside src/app/(tabs). */
  name: 'index' | 'settings';
  labelKey: 'tabs.home' | 'tabs.settings';
  /** iOS: SF Symbol (native tab bar). */
  sf: { default: SFSymbol; selected: SFSymbol };
  /** Android: Material Symbol name (native tab bar). */
  md: AndroidSymbol;
  /** Web: Ionicons (JS tab bar). */
  ionicon: ComponentProps<typeof Ionicons>['name'];
};

export const tabs: readonly TabConfig[] = [
  {
    name: 'index',
    labelKey: 'tabs.home',
    sf: { default: 'house', selected: 'house.fill' },
    md: 'home',
    ionicon: 'home-outline',
  },
  {
    name: 'settings',
    labelKey: 'tabs.settings',
    sf: { default: 'gearshape', selected: 'gearshape.fill' },
    md: 'settings',
    ionicon: 'settings-outline',
  },
];
