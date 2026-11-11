import type { MaterialIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ActivityType, Quality } from '../api/client';

export type IconName = ComponentProps<typeof MaterialIcons>['name'];

export const QUALITY: Record<
  Quality,
  { label: string; icon: IconName; description: string; headline: string }
> = {
  GOOD: {
    label: 'Boa',
    icon: 'check-circle',
    description: 'A conexão deve funcionar bem para a maioria das atividades.',
    headline: 'Conexão tranquila por aqui',
  },
  MODERATE: {
    label: 'Moderada',
    icon: 'error',
    description: 'A conexão pode apresentar alguma instabilidade, como lentidão ou pequenos cortes.',
    headline: 'Pode haver oscilações',
  },
  UNSTABLE: {
    label: 'Instável',
    icon: 'warning',
    description: 'É provável que haja travamentos, quedas ou muita lentidão.',
    headline: 'Melhor se preparar',
  },
};

export const ACTIVITY_ORDER: ActivityType[] = [
  'VIDEO_CALL',
  'AUDIO_CALL',
  'STREAMING',
  'FILE_UPLOAD',
  'WEB_BROWSING',
  'MESSAGING',
];

export const ACTIVITY: Record<ActivityType, { label: string; icon: IconName }> = {
  VIDEO_CALL: { label: 'Chamada de vídeo', icon: 'videocam' },
  AUDIO_CALL: { label: 'Chamada de áudio', icon: 'call' },
  STREAMING: { label: 'Assistir streaming', icon: 'live-tv' },
  FILE_UPLOAD: { label: 'Enviar arquivo', icon: 'upload-file' },
  WEB_BROWSING: { label: 'Navegar na web', icon: 'language' },
  MESSAGING: { label: 'Enviar mensagens', icon: 'chat' },
};

export const TERMS: { term: string; definition: string }[] = [
  {
    term: 'Latência (RTT)',
    definition:
      'Tempo que os dados levam para ir até um servidor e voltar, medido em milissegundos (ms). Valores mais altos deixam chamadas e páginas mais lentas.',
  },
  {
    term: 'Perda de pacotes',
    definition:
      'Parte dos dados que pode não chegar ao destino, em porcentagem. Valores mais altos podem causar cortes na voz, imagem congelada ou falhas.',
  },
  {
    term: 'Jitter',
    definition:
      'Variação da latência ao longo do tempo. Quando é alto, a conexão fica "irregular", o que atrapalha chamadas e jogos. Esta versão da previsão não informa o jitter.',
  },
  {
    term: 'Probe',
    definition:
      'Pequeno equipamento da rede RIPE Atlas que mede a internet em um local. A previsão usa a probe da região escolhida como referência, não o seu aparelho.',
  },
  {
    term: 'Modelo de previsão',
    definition:
      'Programa que aprende com medições antigas para estimar como a conexão deve estar em cada horário. O aplicativo oferece quatro modelos; nenhum é considerado superior aos demais.',
  },
];

export const APP_VERSION = '1.0';

export const CITY_BY_PROBE: Record<number, string> = {
  900001: 'São Paulo (SP)',
  900002: 'Rio de Janeiro (RJ)',
  900003: 'Belo Horizonte (MG)',
  900004: 'Brasília (DF)',
  900005: 'Salvador (BA)',
  900006: 'Recife (PE)',
  900007: 'Fortaleza (CE)',
  900008: 'Curitiba (PR)',
  900009: 'Porto Alegre (RS)',
  900010: 'Manaus (AM)',
};

export function cityName(probeId: number): string {
  return CITY_BY_PROBE[probeId] ?? `Região da probe ${probeId}`;
}

export const DISCLAIMER =
  'A previsão está associada à probe RIPE Atlas selecionada como referência geográfica e não representa uma medição direta do seu aparelho.';

export const LOCATION_PRIVACY =
  'As coordenadas públicas das probes recebem proteção de privacidade do RIPE Atlas e não devem ser tratadas como a localização exata de ninguém. Este app não usa o GPS e não coleta sua localização.';
