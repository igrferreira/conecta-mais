import { useEffect, useState } from 'react';
import { AccessibilityInfo, Text, View } from 'react-native';
import { api } from '../api/client';
import { SlotPicker } from '../components/SlotPicker';
import {
  AppButton,
  Body,
  Card,
  Divider,
  ErrorState,
  LoadingState,
  MetricRow,
  QualityBadge,
  Screen,
} from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { cityName, QUALITY } from '../constants/glossary';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';
import { colors, fontSize } from '../constants/theme';
import { formatDateTime, formatMs, formatPct, spokenMs, spokenPct } from '../utils/format';

export function CompareScreen({ navigation }: ScreenProps<'Compare'>) {
  const { location, model, setModel } = useSettings();
  const probeId = location?.probeId ?? 0;
  const [slot, setSlot] = useState<string | undefined>();

  const timeline = useRequest(() => api.getTimeline(probeId, model!.id), [probeId, model?.id]);
  const compare = useRequest(() => api.compare(probeId, slot), [probeId, slot]);
  const models = useRequest(() => api.listModels(), []);

  useEffect(() => {
    if (compare.data && !slot) setSlot(compare.data.predictionFor);
    if (compare.data) AccessibilityInfo.announceForAccessibility('Comparação atualizada.');
  }, [compare.data]);

  const useModel = (modelId: string) => {
    const m = models.data?.find((x) => x.id === modelId);
    if (m) {
      setModel(m);
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <Body>
        Veja o que cada modelo prevê para o mesmo horário em {location ? cityName(location.probeId) : ''}.
        Os modelos podem discordar; nenhum é considerado melhor que outro.
      </Body>

      {timeline.data ? (
        <Card title="Escolha o horário">
          <SlotPicker slots={timeline.data.items.map((i) => i.predictionFor)} selected={slot} onSelect={setSlot} />
        </Card>
      ) : null}

      {compare.loading ? <LoadingState slow={compare.slow} label="Comparando modelos" /> : null}
      {compare.error ? <ErrorState error={compare.error} onRetry={compare.reload} /> : null}

      {compare.data && !compare.loading ? (
        <>
          <Body muted>Previsão para {formatDateTime(compare.data.predictionFor)}</Body>

          <Card title="Latência lado a lado">
            <Body muted>Barra menor significa resposta mais rápida.</Body>
            {(() => {
              const max = Math.max(...compare.data.models.map((x) => x.predictedAvgRttMs), 1);
              return compare.data.models.map((m) => (
                <View
                  key={m.modelId}
                  accessible
                  accessibilityLabel={`${m.modelName}: latência ${spokenMs(m.predictedAvgRttMs)}, qualidade ${
                    QUALITY[m.quality].label
                  }`}
                  style={{ gap: 4 }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <Text style={{ fontWeight: '700', color: colors.text, fontSize: fontSize.body }}>
                      {m.modelName}
                    </Text>
                    <Text style={{ color: colors.text, fontSize: fontSize.body }}>
                      {formatMs(m.predictedAvgRttMs)} - {QUALITY[m.quality].label}
                    </Text>
                  </View>
                  <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.divider }}>
                    <View
                      style={{
                        height: 12,
                        borderRadius: 6,
                        width: `${(m.predictedAvgRttMs / max) * 100}%`,
                        backgroundColor: colors.chart[m.quality],
                      }}
                    />
                  </View>
                </View>
              ));
            })()}
          </Card>

          {compare.data.models.map((m) => {
            const inUse = m.modelId === model?.id;
            return (
              <Card
                key={m.modelId}
                title={inUse ? `${m.modelName} (em uso)` : m.modelName}
                style={inUse ? { borderWidth: 2, borderColor: colors.primary } : undefined}
              >
                <QualityBadge quality={m.quality} />
                <MetricRow
                  label="Latência prevista"
                  value={formatMs(m.predictedAvgRttMs)}
                  spokenValue={spokenMs(m.predictedAvgRttMs)}
                />
                <Divider />
                <MetricRow
                  label="Perda prevista"
                  value={formatPct(m.predictedPacketLossPct)}
                  spokenValue={spokenPct(m.predictedPacketLossPct)}
                />
                {inUse ? (
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: fontSize.body }}>
                    Este é o modelo em uso.
                  </Text>
                ) : (
                  <AppButton
                    variant="secondary"
                    label="Usar este modelo"
                    accessibilityLabel={`Usar o ${m.modelName}`}
                    onPress={() => useModel(m.modelId)}
                    disabled={!models.data}
                  />
                )}
              </Card>
            );
          })}
        </>
      ) : null}
    </Screen>
  );
}
