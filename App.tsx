import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider } from './src/context/SettingsContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AppNavigator />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
