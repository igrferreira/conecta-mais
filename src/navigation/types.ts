import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ActivityType } from '../api/client';

export type RootStackParamList = {
  Location: { firstRun?: boolean } | undefined;
  Model: { firstRun?: boolean } | undefined;
  Home: undefined;
  About: undefined;
  Timeline: undefined;
  Compare: undefined;
  Activity: { predictionFor?: string; activity?: ActivityType } | undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
