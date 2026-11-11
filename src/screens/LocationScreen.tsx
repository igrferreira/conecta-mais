import { View } from 'react-native';
import { useState } from 'react';
import { api, LocationItem } from '../api/client';
import { AppButton, Body, ErrorState, Heading, LoadingState, OptionItem, Screen } from '../components/ui';
import { useSettings } from '../context/SettingsContext';
import { cityName } from '../constants/glossary';
import { useRequest } from '../hooks/useRequest';
import type { ScreenProps } from '../navigation/types';

export function LocationScreen({ navigation, route }: ScreenProps<'Location'>) {
  const firstRun = route.params?.firstRun;
  const settings = useSettings();
  const locations = useRequest(() => api.listLocations(), []);
  const [selected, setSelected] = useState<LocationItem | null>(settings.location);

  const confirm = () => {
    if (!selected) return;
    settings.setLocation(selected);
    if (firstRun) navigation.replace('Model', { firstRun: true });
    else navigation.goBack();
  };

  return (
    <Screen>
      <Heading level={1}>Qual a sua região?</Heading>
      <Body>
        Escolha a cidade mais próxima de você. A previsão usa um ponto de medição da internet
        nessa cidade como referência.
      </Body>
      <Body muted>O app não usa o GPS e não coleta a sua localização.</Body>

      {locations.loading ? <LoadingState slow={locations.slow} label="Carregando regiões" /> : null}
      {locations.error ? <ErrorState error={locations.error} onRetry={locations.reload} /> : null}

      {locations.data ? (
        <View style={{ gap: 8 }}>
          {[...locations.data]
            .sort((a, b) => cityName(a.probeId).localeCompare(cityName(b.probeId)))
            .map((item) => (
              <OptionItem
                key={item.probeId}
                icon="place"
                label={cityName(item.probeId)}
                description={`Ponto de medição ${item.probeId}`}
                selected={selected?.probeId === item.probeId}
                onPress={() => setSelected(item)}
              />
            ))}
        </View>
      ) : null}

      <AppButton
        label={firstRun ? 'Continuar' : 'Usar esta região'}
        onPress={confirm}
        disabled={!selected}
        hint={selected ? undefined : 'Escolha uma cidade para continuar'}
      />
    </Screen>
  );
}
