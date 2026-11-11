import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { IconName } from '../../constants/glossary';
import { colors, fontSize, MIN_TOUCH, radius, spacing } from '../../constants/theme';
import { Icon } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'link';

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  hint,
  accessibilityLabel,
  disabled,
  loading,
  compact,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  hint?: string;
  accessibilityLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  compact?: boolean;
}) {
  const inactive = !!(disabled || loading);
  const fg = inactive ? colors.disabledText : variant === 'primary' ? colors.onPrimary : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: inactive, busy: !!loading }}
      aria-disabled={inactive}
      aria-busy={!!loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        compact && styles.compact,
        inactive && variant !== 'link' && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : icon ? <Icon name={icon} color={fg} size={22} /> : null}
      <Text style={[styles.label, { color: fg }, variant === 'link' && styles.linkLabel]}>{label}</Text>
    </Pressable>
  );
}

export function ListRow({
  icon,
  label,
  onPress,
  hint,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  hint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Icon name={icon} color={colors.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
      <Icon name="chevron-right" color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary },
  compact: { paddingHorizontal: spacing.sm, minWidth: MIN_TOUCH },
  disabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  pressed: { opacity: 0.85 },
  label: { fontSize: fontSize.body, fontWeight: '700', textAlign: 'center', flexShrink: 1 },
  linkLabel: { textDecorationLine: 'underline' },
  row: {
    minHeight: MIN_TOUCH + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowLabel: { flex: 1, fontSize: fontSize.body, fontWeight: '600', color: colors.text },
});
