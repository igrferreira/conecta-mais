import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize } from '../constants/theme';

export const APP_NAME_SPOKEN = 'Conecta Mais';

export function LogoMark({ size = 40 }: { size?: number }) {
  const bar = size * 0.15;
  const inner = size * 0.62;
  const plus = size * 0.3;
  const stroke = Math.max(2, size * 0.075);
  const white = '#FFFFFF';
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.28 }]}
    >
      <View style={[styles.bars, { height: inner, gap: size * 0.08, marginLeft: -plus * 0.35 }]}>
        {[0.38, 0.66, 1].map((h) => (
          <View key={h} style={{ width: bar, height: inner * h, borderRadius: bar / 2, backgroundColor: white }} />
        ))}
      </View>
      <View style={{ position: 'absolute', top: size * 0.14, right: size * 0.12, width: plus, height: plus }}>
        <View
          style={{ position: 'absolute', left: (plus - stroke) / 2, width: stroke, height: plus, borderRadius: stroke, backgroundColor: white }}
        />
        <View
          style={{ position: 'absolute', top: (plus - stroke) / 2, width: plus, height: stroke, borderRadius: stroke, backgroundColor: white }}
        />
      </View>
    </View>
  );
}

export function BrandName({ size = fontSize.title }: { size?: number }) {
  return (
    <Text accessibilityLabel={APP_NAME_SPOKEN} style={[styles.name, { fontSize: size }]}>
      Conecta+
    </Text>
  );
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <View style={styles.row} accessible accessibilityRole="header" accessibilityLabel={APP_NAME_SPOKEN}>
      <LogoMark size={size} />
      <View>
        <BrandName />
        <Text style={styles.tagline}>sua conexão, um passo à frente</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  bars: { flexDirection: 'row', alignItems: 'flex-end' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontWeight: '800', color: colors.text },
  tagline: { fontSize: fontSize.small, color: colors.textMuted },
});
