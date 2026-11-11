import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { colors, fontSize } from '../../constants/theme';

export function Body({
  children,
  muted,
  style,
  ...rest
}: TextProps & { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  return (
    <Text {...rest} style={[styles.body, muted && styles.muted, style]}>
      {children}
    </Text>
  );
}

export function Heading({ children, level = 2 }: { children: ReactNode; level?: 1 | 2 }) {
  return (
    <Text accessibilityRole="header" style={level === 1 ? styles.h1 : styles.h2}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: fontSize.body, color: colors.text },
  muted: { color: colors.textMuted },
  h1: { fontSize: fontSize.display, fontWeight: '700', color: colors.text },
  h2: { fontSize: fontSize.title, fontWeight: '700', color: colors.text },
});
