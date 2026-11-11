import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ScrollViewInstance, Text, View } from 'react-native';
import { ActivityCheckResponse, ActivityType, api, ApiError, toApiError } from '../api/client';
import { SlotPicker } from '../components/SlotPicker';
import {
  AppButton,
  Body,
  Card,
  Divider,
  ErrorState,
  Heading,
  IconBubble,
  LoadingState,
  MetricRow,
  OptionItem,
  QualityBadge,
  Screen,
} from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { ACTIVITY, ACTIVITY_ORDER, cityName, QUALITY } from '../constants/glossary';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';
import { colors, fontSize } from '../constants/theme';
import { defaultSlot, formatDateTime, formatMs, formatPct, spokenMs, spokenPct } from '../utils/format';

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.onPrimary, fontWeight: '800', fontSize: fontSize.body }}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Heading>{`Passo ${n}: ${title}`}</Heading>
      </View>
    </View>
  );
}

export function ActivityScreen({ route }: ScreenProps<'Activity'>) {
  const { location, model } = useSettings();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const timeline = useRequest(
    () => api.getTimeline(location!.probeId, model!.id),
    [location?.probeId, model?.id],
  );
  const slots = timeline.data?.items.map((i) => i.predictionFor) ?? [];

  const [activity, setActivity] = useState<ActivityType>(route.params?.activity ?? 'VIDEO_CALL');
  const [slot, setSlot] = useState<string | undefined>(route.params?.predictionFor);
  const [result, setResult] = useState<{ data?: ActivityCheckResponse; error?: ApiError; loading: boolean }>({
    loading: false,
  });

  useEffect(() => {
    if (timeline.data && (!slot || !slots.includes(slot))) setSlot(defaultSlot(slots));
  }, [timeline.data]);

  useEffect(() => setResult({ loading: false }), [activity, slot]);

  const check = async () => {
    if (!slot || !location || !model) return;
    setResult({ loading: true });
    try {
      const data = await api.checkActivity({
        modelId: model.id,
        latitude: location.location.latitude,
        longitude: location.location.longitude,
        dateTime: slot,
        activity,
      });
      setResult({ data, loading: false });
      AccessibilityInfo.announceForAccessibility(
        `Resultado: ${ACTIVITY[activity].label}, ${data.suitable ? 'adequado' : 'pode apresentar dificuldades'}. Qualidade ${
          QUALITY[data.forecast.quality].label
        }.`,
      );
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    } catch (err) {
      setResult({ error: toApiError(err), loading: false });
    }
  };

  return (
    <Screen scrollRef={scrollRef}>
      <Card>
        <StepTitle n={1} title="O que você pretende fazer?" />
        <View accessibilityRole="radiogroup" accessibilityLabel="Atividade" style={{ gap: 8 }}>
          {ACTIVITY_ORDER.map((a) => (
            <OptionItem
              key={a}
              icon={ACTIVITY[a].icon}
              label={ACTIVITY[a].label}
              selected={activity === a}
              onPress={() => setActivity(a)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <StepTitle n={2} title="Quando?" />
        {timeline.loading && !timeline.data ? <LoadingState slow={timeline.slow} label="Carregando horários" /> : null}
        {timeline.error ? <ErrorState error={timeline.error} onRetry={timeline.reload} /> : null}
        {timeline.data ? <SlotPicker slots={slots} selected={slot} onSelect={setSlot} /> : null}
      </Card>

      <AppButton
        label="Verificar atividade"
        icon="search"
        onPress={check}
        disabled={!slot}
        loading={result.loading}
      />

      {result.error ? <ErrorState error={result.error} onRetry={check} /> : null}

      {result.data ? (
        <Card style={{ borderWidth: 2, borderColor: colors.chart[result.data.forecast.quality] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <IconBubble
              name={ACTIVITY[result.data.activity].icon}
              color={colors.quality[result.data.forecast.quality].fg}
              bg={colors.quality[result.data.forecast.quality].bg}
              size={30}
            />
            <QualityBadge quality={result.data.forecast.quality} large />
          </View>
          <Heading>{result.data.suitable ? 'Adequado para esta atividade' : 'Pode apresentar dificuldades'}</Heading>
          <Body>{result.data.recommendation.message}</Body>
          <Body muted>
            Atividade: {ACTIVITY[result.data.activity].label}
            {'\n'}Horário: {slot ? formatDateTime(slot) : ''}
            {'\n'}Região: {location ? cityName(location.probeId) : ''} - {result.data.model.name}
          </Body>
          <Divider />
          <MetricRow
            label="Latência prevista"
            value={formatMs(result.data.forecast.predictedAvgRttMs)}
            spokenValue={spokenMs(result.data.forecast.predictedAvgRttMs)}
          />
          <MetricRow
            label="Perda prevista"
            value={formatPct(result.data.forecast.predictedPacketLossPct)}
            spokenValue={spokenPct(result.data.forecast.predictedPacketLossPct)}
          />
          <Text style={{ color: colors.textMuted, fontSize: fontSize.small }}>
            {result.data.metadata.disclaimer}
          </Text>
        </Card>
      ) : null}
    </Screen>
  );
}
