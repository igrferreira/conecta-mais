import { StyleSheet, Text, View } from 'react-native';
import type { Quality, TimelineItem } from '../api/client';
import { QUALITY } from '../constants/glossary';
import { colors, fontSize, spacing } from '../constants/theme';
import { formatDateTime, formatTime } from '../utils/format';

const ORDER: Quality[] = ['GOOD', 'MODERATE', 'UNSTABLE'];

export function QualityChart({ items, highlight }: { items: TimelineItem[]; highlight?: string }) {
  if (items.length === 0) return null;
  const sorted = [...items].sort(
    (a, b) => new Date(a.predictionFor).getTime() - new Date(b.predictionFor).getTime(),
  );
  const counts = ORDER.map((q) => ({ q, n: sorted.filter((i) => i.quality === q).length }));
  const summary =
    `Gráfico da qualidade de ${formatDateTime(sorted[0].predictionFor)} até ${formatDateTime(
      sorted[sorted.length - 1].predictionFor,
    )}. ` + counts.map(({ q, n }) => `${n} horários com qualidade ${QUALITY[q].label}`).join(', ') + '.';
  const middle = sorted[Math.floor(sorted.length / 2)];

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={summary} style={styles.wrap}>
      <View style={styles.bars}>
        {sorted.map((item) => {
          const active = item.predictionFor === highlight;
          return (
            <View
              key={item.predictionFor}
              style={[
                styles.bar,
                {
                  height: `${Math.max(10, item.qualityScore)}%`,
                  backgroundColor: colors.chart[item.quality],
                },
                active && styles.barActive,
              ]}
            />
          );
        })}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisText}>{formatTime(sorted[0].predictionFor)}</Text>
        <Text style={styles.axisText}>{formatTime(middle.predictionFor)}</Text>
        <Text style={styles.axisText}>{formatTime(sorted[sorted.length - 1].predictionFor)}</Text>
      </View>
      <View style={styles.legend}>
        {counts.map(({ q, n }) => (
          <View key={q} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: colors.chart[q] }]} />
            <Text style={styles.legendText}>
              {QUALITY[q].label} ({n})
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.axisText}>Quanto mais alta a barra, melhor a conexão prevista.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  bars: { height: 110, flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barActive: { borderWidth: 2, borderColor: colors.text },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
  axisText: { fontSize: fontSize.small, color: colors.textMuted },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  swatch: { width: 14, height: 14, borderRadius: 3 },
  legendText: { fontSize: fontSize.small, color: colors.text, fontWeight: '600' },
});
