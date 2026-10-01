/**
 * Single source of truth for color tokens (RGB channels), light + dark.
 * Consumed by tailwind.config.js (→ CSS variables / className utilities) and by
 * src/theme/navigation.ts (→ React Navigation theme). CommonJS so Tailwind can require it.
 */
const colors = {
  light: {
    background: [255, 255, 255],
    foreground: [17, 17, 19],
    surface: [244, 244, 246],
    muted: [228, 228, 233],
    'muted-foreground': [96, 100, 108],
    border: [220, 221, 226],
    primary: [32, 138, 239],
    'primary-foreground': [255, 255, 255],
    danger: [220, 38, 38],
    'danger-foreground': [255, 255, 255],
  },
  dark: {
    background: [10, 10, 11],
    foreground: [237, 237, 240],
    surface: [28, 28, 31],
    muted: [46, 49, 53],
    'muted-foreground': [176, 180, 186],
    border: [52, 54, 58],
    primary: [82, 165, 255],
    'primary-foreground': [10, 10, 11],
    danger: [248, 113, 113],
    'danger-foreground': [10, 10, 11],
  },
};

module.exports = { colors };
