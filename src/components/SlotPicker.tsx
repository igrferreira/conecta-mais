import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDateTime, formatTime, groupSlots } from '../utils/format';
import { spacing } from '../constants/theme';
import { Body, Chip, ChipRow } from './ui';

export function SlotPicker({
  slots,
  selected,
  onSelect,
}: {
  slots: string[];
  selected?: string;
  onSelect: (slot: string) => void;
}) {
  const groups = useMemo(() => groupSlots(slots), [slots]);
  const groupOf = (slot?: string) => groups.find((g) => slot && g.slots.includes(slot))?.key;
  const [groupKey, setGroupKey] = useState(() => groupOf(selected) ?? groups[0]?.key);

  useEffect(() => {
    const key = groupOf(selected);
    if (key) setGroupKey(key);
  }, [selected, groups]);

  const current = groups.find((g) => g.key === groupKey) ?? groups[0];
  if (!current) return <Body muted>Nenhum horário disponível.</Body>;

  return (
    <View style={styles.wrap}>
      <Body style={styles.label}>Período do dia</Body>
      <ChipRow label="Período do dia">
        {groups.map((g) => (
          <Chip
            key={g.key}
            label={g.label}
            selected={g.key === current.key}
            onPress={() => setGroupKey(g.key)}
          />
        ))}
      </ChipRow>

      <Body style={styles.label}>Horário</Body>
      <ChipRow label={`Horários: ${current.label}`}>
        {current.slots.map((slot) => (
          <Chip
            key={slot}
            label={formatTime(slot)}
            accessibilityLabel={formatDateTime(slot)}
            selected={slot === selected}
            onPress={() => onSelect(slot)}
          />
        ))}
      </ChipRow>

      <Body muted accessibilityLiveRegion="polite">
        {selected ? `Selecionado: ${formatDateTime(selected)} (horário local)` : 'Escolha um horário.'}
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: { fontWeight: '700' },
});
