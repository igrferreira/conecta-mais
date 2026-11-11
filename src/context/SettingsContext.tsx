import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import type { LocationItem, ModelItem } from '../api/client';

const STORAGE_KEY = '@conecta-mais/settings';

interface StoredSettings {
  location: LocationItem | null;
  model: ModelItem | null;
}

interface SettingsContextValue extends StoredSettings {
  ready: boolean;
  setLocation: (location: LocationItem) => void;
  setModel: (model: ModelItem) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredSettings>({ location: null, model: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ location: null, model: null, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<SettingsContextValue>(() => {
    const update = (patch: Partial<StoredSettings>) =>
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    return {
      ...settings,
      ready,
      setLocation: (location) => update({ location }),
      setModel: (model) => update({ model }),
    };
  }, [settings, ready]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings precisa estar dentro de SettingsProvider');
  return ctx;
}
