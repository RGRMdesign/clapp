import { render, screen, userEvent } from '@testing-library/react-native';

import { i18n } from '@/lib/i18n';

import { SettingsScreen } from '../components/settings-screen';
import { useSettingsStore } from '../store';

describe('SettingsScreen', () => {
  beforeEach(async () => {
    useSettingsStore.setState({ theme: 'system', language: null });
    await i18n.changeLanguage('en');
  });

  it('shows the current theme as selected', async () => {
    await render(<SettingsScreen />);

    expect(screen.getByRole('radio', { name: 'System' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Dark' })).not.toBeChecked();
  });

  it('updates the theme preference when an option is pressed', async () => {
    const user = userEvent.setup();
    await render(<SettingsScreen />);

    await user.press(screen.getByRole('radio', { name: 'Dark' }));

    expect(useSettingsStore.getState().theme).toBe('dark');
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
  });

  it('stores the chosen language', async () => {
    const user = userEvent.setup();
    await render(<SettingsScreen />);

    await user.press(screen.getByRole('radio', { name: 'Nederlands' }));

    expect(useSettingsStore.getState().language).toBe('nl');
  });
});
