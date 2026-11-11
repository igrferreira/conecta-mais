import { View } from 'react-native';
import { AppButton, Body, Card, Heading, QualityBadge, Screen } from '../components/ui';
import { APP_VERSION, DISCLAIMER, LOCATION_PRIVACY, QUALITY, TERMS } from '../constants/glossary';
import { Logo } from '../components/Logo';
import type { Quality } from '../api/client';
import type { ScreenProps } from '../navigation/types';

export function AboutScreen({ navigation }: ScreenProps<'About'>) {
  return (
    <Screen>
      <Card title="O que esta previsão representa">
        <Body>{DISCLAIMER}</Body>
        <Body>
          Os valores são estimativas feitas a partir de medições antigas. A conexão real pode ser
          diferente, por exemplo pelo Wi-Fi da sua casa ou pela sua operadora.
        </Body>
      </Card>

      <Card title="Privacidade da localização">
        <Body>{LOCATION_PRIVACY}</Body>
      </Card>

      <Card title="O que cada qualidade significa">
        {(Object.keys(QUALITY) as Quality[]).map((q) => (
          <View key={q} style={{ gap: 8 }}>
            <QualityBadge quality={q} />
            <Body>{QUALITY[q].description}</Body>
          </View>
        ))}
      </Card>

      <Card title="O que isso significa?">
        {TERMS.map((t) => (
          <View key={t.term} style={{ gap: 4 }}>
            <Heading>{t.term}</Heading>
            <Body>{t.definition}</Body>
          </View>
        ))}
      </Card>

      <Card>
        <Logo />
        <Heading>Sobre o aplicativo</Heading>
        <Body>
          O Conecta+ tem como objetivo auxiliar o planejamento de atividades que dependem
          da internet, apresentando de forma clara e acessível a qualidade de conexão prevista para
          cada horário.
        </Body>
        <Body muted>
          Fonte dos dados: medições históricas da rede pública RIPE Atlas, processadas por modelos
          preditivos e disponibilizadas pela Internet Quality API. Versão {APP_VERSION}.
        </Body>
      </Card>

      <AppButton label="Fechar" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
