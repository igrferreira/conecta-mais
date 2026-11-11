import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { api, TimelineItem } from '../api/client';
import { QualityChart } from '../components/QualityChart';
import {
  Body,
  Card,
  Chip,
  ChipRow,
  ErrorState,
  Icon,
  LoadingState,
  Divider,
  QualityBadge,
  Screen,
} from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { cityName, QUALITY } from '../constants/glossary';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';
import { colors, fontSize, MIN_TOUCH, radius, outline, spacing } from '../constants/theme';
import {
  formatDateTime,
  formatMs,
  formatPct,
  formatShortDate,
  formatTime,
  groupSlots,
  isPast,
  spokenMs,
  spokenPct,
} from '../utils/format';

export function TimelineScreen({ navigation }: ScreenProps<'Timeline'>) {
  const { location, model } = useSettings();
  const timeline = useRequest(
    () => api.getTimeline(location!.probeId, model!.id),
    [location?.probeId, model?.id],
  );
  const [groupKey, setGroupKey] = useState<string>('all');

  const items = timeline.data?.items ?? [];
  const groups = useMemo(() => groupSlots(items.map((i) => i.predictionFor)), [items]);
  const visible =
    groupKey === 'all'
      ? items
      : items.filter((i) => groups.find((g) => g.key === groupKey)?.slots.includes(i.predictionFor));
  const best = items
    .filter((i) => i.quality === 'GOOD')
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, 3)
    .sort((a, b) => new Date(a.predictionFor).getTime() - new Date(b.predictionFor).getTime());
  const allPast = items.length > 0 && items.every((i) => isPast(i.predictionFor));

  const open = (item: TimelineItem) => navigation.navigate('Activity', { predictionFor: item.predictionFor });

  return (
    <Screen>
      {timeline.loading && !timeline.data ? <LoadingState slow={timeline.slow} label="Carregando previsões" /> : null}
      {timeline.error ? <ErrorState error={timeline.error} onRetry={timeline.reload} /> : null}

      {items.length > 0 ? (
        <>
          <Body muted>
            {model?.name} - {location ? cityName(location.probeId) : ''}
            {'\n'}
            {formatDateTime(items[0].predictionFor)} até {formatDateTime(items[items.length - 1].predictionFor)}
            {allPast ? ' (últimos dados disponíveis)' : ''}
          </Body>

          <Card title="Visão do dia">
            <QualityChart items={items} />
            <Divider />
            <Body>
              <Text style={styles.bold}>Melhores horários: </Text>
              {best.length === 0
                ? `nenhum com qualidade ${QUALITY.GOOD.label}.`
                : best.map((i) => formatDateTime(i.predictionFor)).join('; ')}
            </Body>
          </Card>

          <Body style={styles.bold}>Filtrar por período do dia</Body>
          <ChipRow label="Filtrar por período do dia">
            <Chip label="Todos" selected={groupKey === 'all'} onPress={() => setGroupKey('all')} />
            {groups.map((g) => (
              <Chip key={g.key} label={g.label} selected={groupKey === g.key} onPress={() => setGroupKey(g.key)} />
            ))}
          </ChipRow>

          <View style={styles.list}>
            {visible.map((item) => (
              <Pressable
                key={item.predictionFor}
                onPress={() => open(item)}
                accessibilityRole="button"
                accessibilityLabel={`${formatDateTime(item.predictionFor)}: qualidade ${
                  QUALITY[item.quality].label
                }. Latência ${spokenMs(item.predictedAvgRttMs)}, perda ${spokenPct(item.predictedPacketLossPct)}.`}
                accessibilityHint="Abre o planejamento de atividade para este horário"
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <View style={styles.when}>
                  <Text style={styles.time}>{formatTime(item.predictionFor)}</Text>
                  <Body muted style={styles.small}>{formatShortDate(item.predictionFor)}</Body>
                </View>
                <View style={styles.rowBody}>
                  <QualityBadge quality={item.quality} />
                  <Body muted style={styles.small}>
                    Latência {formatMs(item.predictedAvgRttMs)} | Perda {formatPct(item.predictedPacketLossPct)}
                  </Body>
                </View>
                <Icon name="chevron-right" color={colors.textMuted} />
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },
  small: { fontSize: fontSize.small },
  list: { gap: spacing.sm },
  row: {
    minHeight: MIN_TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...outline,
  },
  pressed: { opacity: 0.85 },
  when: { minWidth: 56, alignItems: 'center' },
  time: { fontSize: fontSize.large, fontWeight: '700', color: colors.text },
  rowBody: { flex: 1, gap: spacing.xs },
});
