import { useEffect } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityCheckResponse, api, ProbeForecast } from '../api/client';
import { APP_NAME_SPOKEN, BrandName, LogoMark } from '../components/Logo';
import { QualityChart } from '../components/QualityChart';
import {
  AppButton,
  Body,
  Card,
  Divider,
  ErrorState,
  Icon,
  ListRow,
  LoadingState,
  MetricRow,
  Screen,
} from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { ACTIVITY, ACTIVITY_ORDER, cityName, IconName, QUALITY } from '../constants/glossary';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';
import { colors, fontSize, MIN_TOUCH, radius, spacing } from '../constants/theme';
import { formatDateTime, formatMs, formatPct, isPast, spokenMs, spokenPct } from '../utils/format';

function SettingChip({ icon, label, a11yLabel, onPress }: { icon: IconName; label: string; a11yLabel: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.85 }]}
    >
      <Icon name={icon} color={colors.primary} size={18} />
      <Text style={styles.chipText}>{label}</Text>
      <Icon name="expand-more" color={colors.primary} size={18} />
    </Pressable>
  );
}

function TopBar({
  city,
  modelName,
  onChangeCity,
  onChangeModel,
}: {
  city: string;
  modelName: string;
  onChangeCity: () => void;
  onChangeModel: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.brandRow} accessible accessibilityRole="header" accessibilityLabel={APP_NAME_SPOKEN}>
        <LogoMark size={32} />
        <BrandName />
      </View>
      <View style={styles.chipRow}>
        <SettingChip icon="place" label={city} a11yLabel={`Região: ${city}. Alterar região`} onPress={onChangeCity} />
        <SettingChip icon="insights" label={modelName} a11yLabel={`Modelo: ${modelName}. Trocar modelo`} onPress={onChangeModel} />
      </View>
    </View>
  );
}

function StatusCard({ forecast }: { forecast: ProbeForecast }) {
  const q = forecast.assessment.quality;
  const info = QUALITY[q];
  const c = colors.quality[q];
  const when = formatDateTime(forecast.prediction.predictionFor);
  const past = isPast(forecast.prediction.predictionFor);
  return (
    <View
      style={styles.status}
      accessible
      accessibilityLabel={`${info.headline}. Qualidade ${info.label}, previsão para ${when}. ${forecast.recommendation.message}${
        past ? ' Esta é a última previsão disponível.' : ''
      }`}
    >
      <View style={[styles.statusTag, { backgroundColor: c.bg }]}>
        <Icon name={info.icon} color={c.fg} size={16} />
        <Text style={[styles.statusLabel, { color: c.fg }]}>Qualidade {info.label.toLowerCase()}</Text>
      </View>
      <Text style={styles.statusTitle}>{info.headline}</Text>
      <Text style={styles.statusMessage}>{forecast.recommendation.message}</Text>
      <Text style={styles.statusWhen}>
        {past ? `Última previsão disponível: ${when}` : `Previsão para ${when}`}
      </Text>
    </View>
  );
}

function ActivitySummary({ results }: { results: ActivityCheckResponse[] }) {
  const good = results.filter((r) => r.suitable).map((r) => ACTIVITY[r.activity].label);
  const bad = results.filter((r) => !r.suitable).map((r) => ACTIVITY[r.activity].label);
  const Group = ({ ok, items }: { ok: boolean; items: string[] }) => {
    if (items.length === 0) return null;
    const c = ok ? colors.quality.GOOD.fg : colors.quality.MODERATE.fg;
    const title = ok ? 'Funciona bem' : 'Pode ter dificuldades';
    return (
      <View style={styles.group} accessible accessibilityLabel={`${title}: ${items.join(', ')}`}>
        <View style={styles.groupHead}>
          <Icon name={ok ? 'check-circle' : 'error'} color={c} size={20} />
          <Text style={[styles.groupTitle, { color: c }]}>{title}</Text>
        </View>
        <Body>{items.join(', ')}</Body>
      </View>
    );
  };
  return (
    <>
      <Group ok items={good} />
      {good.length > 0 && bad.length > 0 ? <Divider /> : null}
      <Group ok={false} items={bad} />
    </>
  );
}

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { location, model } = useSettings();
  const probeId = location?.probeId ?? 0;
  const modelId = model?.id ?? '';

  const forecast = useRequest(() => api.getForecast(probeId, modelId), [probeId, modelId]);
  const timeline = useRequest(() => api.getTimeline(probeId, modelId), [probeId, modelId]);
  const instant = forecast.data?.prediction.predictionFor;

  const activities = useRequest(
    () =>
      instant && location
        ? Promise.all(
            ACTIVITY_ORDER.map((activity) =>
              api.checkActivity({
                modelId,
                latitude: location.location.latitude,
                longitude: location.location.longitude,
                dateTime: instant,
                activity,
              }),
            ),
          )
        : Promise.resolve(null),
    [instant, modelId, probeId],
  );

  useEffect(() => {
    if (forecast.data) {
      AccessibilityInfo.announceForAccessibility(
        `Previsão carregada. Qualidade ${QUALITY[forecast.data.assessment.quality].label}.`,
      );
    }
  }, [forecast.data]);

  if (!location || !model) return null;

  return (
    <Screen
      header={
        <TopBar
          city={cityName(location.probeId)}
          modelName={model.name}
          onChangeCity={() => navigation.navigate('Location')}
          onChangeModel={() => navigation.navigate('Model')}
        />
      }
    >
      {forecast.loading && !forecast.data ? <LoadingState slow={forecast.slow} /> : null}
      {forecast.error ? (
        <ErrorState
          error={forecast.error}
          onRetry={forecast.reload}
          extra={
            forecast.error.kind === 'not_found' ? (
              <AppButton variant="secondary" label="Escolher outro modelo" onPress={() => navigation.navigate('Model')} />
            ) : null
          }
        />
      ) : null}

      {forecast.data ? (
        <>
          <StatusCard forecast={forecast.data} />

          <AppButton
            label="Planejar uma atividade"
            icon="event-available"
            onPress={() => navigation.navigate('Activity', { predictionFor: instant })}
          />

          <Card title="Neste horário">
            {activities.loading ? <LoadingState label="Verificando atividades" slow={activities.slow} /> : null}
            {activities.error ? <ErrorState error={activities.error} onRetry={activities.reload} /> : null}
            {activities.data ? <ActivitySummary results={activities.data} /> : null}
          </Card>

          {timeline.data ? (
            <Card title="Ao longo do dia">
              <QualityChart items={timeline.data.items} highlight={instant} />
            </Card>
          ) : null}

          <Card title="Detalhes">
            <MetricRow
              label="Latência prevista"
              caption="Tempo de resposta (RTT)"
              value={formatMs(forecast.data.prediction.predictedAvgRttMs)}
              spokenValue={spokenMs(forecast.data.prediction.predictedAvgRttMs)}
            />
            <Divider />
            <MetricRow
              label="Perda prevista"
              caption="Dados que podem não chegar"
              value={formatPct(forecast.data.prediction.predictedPacketLossPct)}
              spokenValue={spokenPct(forecast.data.prediction.predictedPacketLossPct)}
            />
            <Divider />
            <MetricRow
              label="Pontuação"
              caption="De 0 a 100"
              value={`${forecast.data.assessment.qualityScore}`}
              spokenValue={`${forecast.data.assessment.qualityScore} de 100`}
            />
            <Body muted style={styles.small}>
              Referência: ponto de medição {forecast.data.probeId}, em {cityName(forecast.data.probeId)}.
            </Body>
          </Card>

          <Card>
            <ListRow icon="schedule" label="Próximas previsões" onPress={() => navigation.navigate('Timeline')} />
            <Divider />
            <ListRow icon="compare-arrows" label="Comparar modelos" onPress={() => navigation.navigate('Compare')} />
            <Divider />
            <ListRow icon="help-outline" label="Entenda a previsão" onPress={() => navigation.navigate('About')} />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  small: { fontSize: fontSize.small },
  topBar: { paddingHorizontal: spacing.md, gap: spacing.md },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brand: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: MIN_TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipText: { color: colors.text, fontSize: fontSize.body, fontWeight: '600' },
  status: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  statusTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusLabel: { fontSize: fontSize.small, fontWeight: '700' },
  statusTitle: { fontSize: fontSize.display, fontWeight: '700', color: colors.text, marginTop: spacing.xs },
  statusMessage: { fontSize: fontSize.body, color: colors.textMuted },
  statusWhen: { fontSize: fontSize.small, color: colors.textMuted },
  group: { gap: spacing.xs },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  groupTitle: { fontSize: fontSize.body, fontWeight: '700' },
});
