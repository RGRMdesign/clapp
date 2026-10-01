import { AccountSection } from '@/features/auth';
import { SettingsScreen } from '@/features/settings';

export default function SettingsRoute() {
  return (
    <SettingsScreen>
      <AccountSection />
    </SettingsScreen>
  );
}
