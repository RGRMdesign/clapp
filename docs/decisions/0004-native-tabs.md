# 0004. Native tab bar (Liquid Glass on iOS)

- Status: accepted
- Date: 2026-10-01

## Context

On iOS 26 the system tab bar uses Liquid Glass. A JavaScript tab bar can only imitate it. We want the real platform tab bar on iOS (and Android), while web keeps real `<a>` links.

## Decision

- iOS + Android: `NativeTabs` from `expo-router/unstable-native-tabs` (UITabBarController / Material 3 bottom navigation). iOS 26+ gives Liquid Glass automatically. We don't set `backgroundColor`/`blurEffect`, which would replace the glass. `minimizeBehavior="onScrollDown"` shrinks the bar while scrolling (iOS 26+).
- Web: the JS `Tabs` from `expo-router/js-tabs` (platform file `app-tabs.web.tsx`).
- Tabs are defined once in `src/components/navigation/tabs-config.ts`: route, i18n label, SF Symbol (iOS), Material Symbol (Android), Ionicon (web).
- New dependency **expo-symbols** (Expo SDK module): Android Material Symbol icons for the native tab bar.
- `Screen` uses `contentInsetAdjustmentBehavior="automatic"` so content scrolls under the translucent bar.

## Alternatives considered

- JS tab bar with an expo-glass-effect background: looks similar but isn't the system component (no minimize behavior, no native accessibility, no iPad sidebar).
- `NativeTabs` on web as well: we keep the JS tabs because they render proper links, and the web E2E suite covers them.

## Consequences

- `NativeTabs` is still marked `unstable_` in Expo Router. Check the API on SDK upgrades.
- Liquid Glass only appears in builds made with the Xcode 26 SDK on iOS 26+ devices. Older iOS shows the classic tab bar.
- Native tab behavior can't be verified in the cloud sandbox (web only). The iOS CI job runs on `macos-26`.
