import { useState } from 'react';
import { View } from 'react-native';
import { api, ModelItem } from '../api/client';
import { AppButton, Body, ErrorState, Heading, LoadingState, OptionItem, Screen } from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';

export function ModelScreen({ navigation, route }: ScreenProps<'Model'>) {
  const firstRun = route.params?.firstRun;
  const settings = useSettings();
  const models = useRequest(() => api.listModels(), []);
  const [selected, setSelected] = useState<ModelItem | null>(settings.model);

  const confirm = () => {
    if (!selected) return;
    settings.setModel(selected);
    if (firstRun) navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    else navigation.goBack();
  };

  return (
    <Screen>
      <Heading level={1}>Escolha um modelo de previsão</Heading>
      <Body>
        Os modelos podem apresentar valores ligeiramente diferentes para o mesmo horário.
        Nenhum deles é considerado superior aos demais.
      </Body>
      <Body muted>Você pode trocar de modelo ou comparar todos a qualquer momento.</Body>

      {models.loading ? <LoadingState slow={models.slow} label="Carregando modelos" /> : null}
      {models.error ? <ErrorState error={models.error} onRetry={models.reload} /> : null}

      {models.data ? (
        <View style={{ gap: 8 }}>
          {models.data.map((m) => (
            <OptionItem
              key={m.id}
              icon="insights"
              label={m.name}
              selected={selected?.id === m.id}
              onPress={() => setSelected(m)}
            />
          ))}
        </View>
      ) : null}

      <AppButton
        label={firstRun ? 'Ver previsão' : 'Usar este modelo'}
        onPress={confirm}
        disabled={!selected}
        hint={selected ? undefined : 'Escolha um modelo para continuar'}
      />
    </Screen>
  );
}
