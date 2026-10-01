/**
 * Colors come from src/theme/tokens.js and are exposed as CSS variables (light + dark),
 * so components only use semantic classes (bg-background, text-foreground, …) and dark
 * mode / re-theming work everywhere. Never use raw palette colors (bg-blue-500) in components.
 *
 * @type {import('tailwindcss').Config}
 */
const plugin = require('tailwindcss/plugin');

const { colors } = require('./src/theme/tokens');

const toVars = (scheme) =>
  Object.fromEntries(
    Object.entries(colors[scheme]).map(([name, rgb]) => [`--color-${name}`, rgb.join(' ')]),
  );

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: Object.fromEntries(
        Object.keys(colors.light).map((name) => [
          name,
          `rgb(var(--color-${name}) / <alpha-value>)`,
        ]),
      ),
      borderRadius: {
        DEFAULT: '10px',
        lg: '16px',
      },
      maxWidth: {
        content: '800px',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({ ':root': toVars('light'), '.dark:root': toVars('dark') });
    }),
  ],
};
