const gray = {
  900: '#18181B',
  800: '#27272A',
  600: '#52525B',
  500: '#6E6E78',
  400: '#8A8A93',
  200: '#E4E4E7',
  100: '#F4F4F5',
  50: '#FAFAFA',
};

export const colors = {
  background: gray[50],
  surface: '#FFFFFF',
  text: gray[900],
  textMuted: gray[600],
  primary: gray[900],
  onPrimary: '#FFFFFF',
  border: gray[400],
  divider: gray[200],
  selectedBg: gray[100],
  disabledBg: gray[200],
  disabledText: gray[600],
  info: { bg: gray[100], fg: gray[800] },
  error: { bg: '#FBEFEF', fg: '#991B1B' },
  quality: {
    GOOD: { bg: '#F1F7F3', fg: '#166534' },
    MODERATE: { bg: '#FAF6EC', fg: '#854D0E' },
    UNSTABLE: { bg: '#FBEFEF', fg: '#991B1B' },
  },
  chart: {
    GOOD: '#3D8B5C',
    MODERATE: '#A9762A',
    UNSTABLE: '#BF4B4B',
  },
  tint: gray[100],
} as const;

export const outline = { borderWidth: 1, borderColor: gray[200] } as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const fontSize = { small: 14, body: 16, large: 18, title: 20, display: 26 } as const;

export const MIN_TOUCH = 48;

export const radius = { md: 10, lg: 14, pill: 999 } as const;
