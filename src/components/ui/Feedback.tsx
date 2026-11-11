import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { ApiError } from '../../api/client';
import { colors, fontSize, radius, spacing } from '../../constants/theme';
import { AppButton } from './Buttons';
import { Icon } from './Icon';
import { Body } from './Typography';

export function Notice({ text, tone = 'info' }: { text: string; tone?: 'info' | 'error' }) {
  const c = tone === 'error' ? colors.error : colors.info;
  return (
    <View
      accessible
      accessibilityLabel={`${tone === 'error' ? 'Erro' : 'Aviso'}: ${text}`}
      style={[styles.notice, { backgroundColor: c.bg, borderColor: c.fg }]}
    >
      <Icon name={tone === 'error' ? 'error-outline' : 'info-outline'} color={c.fg} />
      <Text style={[styles.noticeText, { color: c.fg }]}>{text}</Text>
    </View>
  );
}

export function LoadingState({ slow, label = 'Carregando previsão' }: { slow?: boolean; label?: string }) {
  return (
    <View style={styles.loading} accessibilityLiveRegion="polite" accessible accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Body>{label}...</Body>
      {slow ? (
        <Body muted style={styles.center}>
          O servidor pode levar até 1 minuto para responder no primeiro acesso.
        </Body>
      ) : null}
    </View>
  );
}

export function ErrorState({ error, onRetry, extra }: { error: ApiError; onRetry: () => void; extra?: ReactNode }) {
  return (
    <View style={styles.error}>
      <Notice tone="error" text={error.message} />
      <AppButton label="Tentar novamente" icon="refresh" onPress={onRetry} />
      {extra}
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: { flex: 1, fontSize: fontSize.body },
  loading: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  center: { textAlign: 'center' },
  error: { gap: spacing.md },
});
