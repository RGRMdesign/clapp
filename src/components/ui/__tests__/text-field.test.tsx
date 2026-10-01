import { render, screen, userEvent } from '@testing-library/react-native';
import { useState } from 'react';

import { TextField } from '../text-field';

function ControlledField(props: { error?: string; hint?: string }) {
  const [value, setValue] = useState('');
  return <TextField label="Email" value={value} onChangeText={setValue} {...props} />;
}

describe('TextField', () => {
  it('is labelled and accepts typed text', async () => {
    const user = userEvent.setup();
    await render(<ControlledField />);

    const input = screen.getByLabelText('Email');
    await user.type(input, 'ada@example.com');

    expect(input).toHaveDisplayValue('ada@example.com');
  });

  it('shows the error as an alert', async () => {
    await render(<ControlledField error="Enter a valid email" hint="We never share it" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(screen.queryByText('We never share it')).not.toBeOnTheScreen();
  });

  it('shows the hint when there is no error', async () => {
    await render(<ControlledField hint="We never share it" />);

    expect(screen.getByText('We never share it')).toBeOnTheScreen();
    expect(screen.queryByRole('alert')).not.toBeOnTheScreen();
  });
});
