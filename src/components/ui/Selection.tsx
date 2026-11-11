import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../../constants/glossary';
import { colors, fontSize, MIN_TOUCH, radius, spacing } from '../../constants/theme';
import { Icon, IconBubble } from './Icon';
import { Body } from './Typography';

export function OptionItem({
  label,
  description,
  selected,
  onPress,
  icon,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: IconName;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      aria-selected={selected}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && styles.pressed]}
    >
      {icon ? (
        <IconBubble
          name={icon}
          color={selected ? colors.onPrimary : colors.primary}
          bg={selected ? colors.primary : colors.tint}
          size={20}
        />
      ) : null}
      <View style={styles.optionText}>
        <Text style={styles.optionLabel}>{label}</Text>
        {description ? (
          <Body muted style={styles.small}>
            {description}
          </Body>
        ) : null}
        {selected ? <Text style={styles.selectedText}>Selecionado</Text> : null}
      </View>
      <Icon
        name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
        color={selected ? colors.primary : colors.border}
        size={26}
      />
    </Pressable>
  );
}

export function Chip({
  label,
  accessibilityLabel,
  selected,
  onPress,
}: {
  label: string;
  accessibilityLabel?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, selected }}
      aria-checked={selected}
      aria-selected={selected}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      {selected ? <Icon name="check" color={colors.onPrimary} size={18} /> : null}
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.chipRow}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  small: { fontSize: fontSize.small },
  option: {
    minHeight: MIN_TOUCH + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  optionSelected: { borderWidth: 3, borderColor: colors.primary, backgroundColor: colors.selectedBg },
  optionText: { flex: 1, gap: 2 },
  optionLabel: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  selectedText: { fontSize: fontSize.small, fontWeight: '700', color: colors.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: MIN_TOUCH,
    minWidth: MIN_TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipLabel: { fontSize: fontSize.body, color: colors.text },
  chipLabelSelected: { color: colors.onPrimary, fontWeight: '700' },
});
