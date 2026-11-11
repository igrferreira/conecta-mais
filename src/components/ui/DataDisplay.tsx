import { StyleSheet, Text, View } from 'react-native';
import type { Quality } from '../../api/client';
import { QUALITY } from '../../constants/glossary';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import { Icon } from './Icon';
import { Body } from './Typography';

export function QualityBadge({ quality, large }: { quality: Quality; large?: boolean }) {
  const info = QUALITY[quality];
  const c = colors.quality[quality];
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Qualidade ${info.label}`}
      style={[styles.badge, large && styles.badgeLarge, { backgroundColor: c.bg, borderColor: c.fg }]}
    >
      <Icon name={info.icon} color={c.fg} size={large ? 30 : 22} />
      <Text style={[styles.badgeText, large && styles.badgeTextLarge, { color: c.fg }]}>{info.label}</Text>
    </View>
  );
}

export function MetricRow({
  label,
  value,
  spokenValue,
  caption,
}: {
  label: string;
  value: string;
  spokenValue?: string;
  caption?: string;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${spokenValue ?? value}${caption ? `. ${caption}` : ''}`}
      style={styles.row}
    >
      <View style={styles.rowText}>
        <Body>{label}</Body>
        {caption ? (
          <Body muted style={styles.small}>
            {caption}
          </Body>
        ) : null}
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 36,
  },
  badgeLarge: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 56 },
  badgeText: { fontSize: fontSize.body, fontWeight: '700' },
  badgeTextLarge: { fontSize: fontSize.display },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowText: { flexGrow: 1, flexShrink: 1, flexBasis: 160 },
  small: { fontSize: fontSize.small },
  value: { fontSize: fontSize.large, fontWeight: '700', color: colors.text },
});
