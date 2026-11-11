import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { LoadingState } from '../components/ui';
import { colors } from '../constants/theme';
import { useSettings } from '../context/SettingsContext';
import { AboutScreen } from '../screens/AboutScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { CompareScreen } from '../screens/CompareScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationScreen } from '../screens/LocationScreen';
import { ModelScreen } from '../screens/ModelScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.divider,
  },
};

export function AppNavigator() {
  const { ready, location, model } = useSettings();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
        <LoadingState label="Abrindo o app" />
      </View>
    );
  }

  const initialRouteName: keyof RootStackParamList = !location ? 'Location' : !model ? 'Model' : 'Home';

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerBackTitle: 'Voltar',
          statusBarStyle: 'dark',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{ title: 'Sua região' }}
          initialParams={initialRouteName === 'Location' ? { firstRun: true } : undefined}
        />
        <Stack.Screen
          name="Model"
          component={ModelScreen}
          options={{ title: 'Modelo de previsão' }}
          initialParams={initialRouteName === 'Model' ? { firstRun: true } : undefined}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Conecta+', headerShown: false }} />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'Sobre esta previsão', presentation: 'modal' }}
        />
        <Stack.Screen name="Timeline" component={TimelineScreen} options={{ title: 'Próximas previsões' }} />
        <Stack.Screen name="Compare" component={CompareScreen} options={{ title: 'Comparar modelos' }} />
        <Stack.Screen name="Activity" component={ActivityScreen} options={{ title: 'Planejar atividade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
