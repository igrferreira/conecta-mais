import { ReactNode, RefObject } from 'react';
import { ScrollView, ScrollViewInstance, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, outline, radius, spacing } from '../../constants/theme';
import { Heading } from './Typography';

export function Screen({
  children,
  header,
  scrollRef,
}: {
  children: ReactNode;
  header?: ReactNode;
  scrollRef?: RefObject<ScrollViewInstance | null>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: spacing.xl + insets.bottom }}
      keyboardShouldPersistTaps="handled"
    >
      {header}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

export function Card({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Heading>{title}</Heading> : null}
      {children}
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...outline,
  },
  divider: { height: 1, backgroundColor: colors.divider },
});
