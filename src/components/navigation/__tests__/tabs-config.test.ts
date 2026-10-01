import { existsSync } from 'node:fs';
import { join } from 'node:path';

import en from '@/lib/i18n/locales/en.json';
import nl from '@/lib/i18n/locales/nl.json';

import { tabs } from '../tabs-config';

const lookup = (messages: Record<string, unknown>, key: string) =>
  key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], messages);

describe('tabs config', () => {
  it.each(tabs.map((tab) => [tab.name, tab] as const))('%s has a route file', (name) => {
    expect(existsSync(join(__dirname, '../../../app/(tabs)', `${name}.tsx`))).toBe(true);
  });

  it.each(tabs.map((tab) => [tab.labelKey] as const))('%s is translated in en and nl', (key) => {
    expect(typeof lookup(en, key)).toBe('string');
    expect(typeof lookup(nl, key)).toBe('string');
  });

  it('uses distinct icons for the selected state on iOS', () => {
    for (const tab of tabs) expect(tab.sf.selected).not.toBe(tab.sf.default);
  });
});
