export type Quality = 'GOOD' | 'MODERATE' | 'UNSTABLE';
export type RecommendationCode = 'NORMAL_USE' | 'REDUCE_NETWORK_USAGE' | 'PREPARE_OFFLINE';
export type ActivityType =
  | 'VIDEO_CALL'
  | 'AUDIO_CALL'
  | 'STREAMING'
  | 'FILE_UPLOAD'
  | 'WEB_BROWSING'
  | 'MESSAGING';

export interface ModelItem {
  id: string;
  name: string;
  description: string;
  groupName: string;
  algorithm: string;
  version: string;
}

export interface ModelRef {
  id: string;
  name: string;
  version: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface LocationItem {
  probeId: number;
  countryCode: string;
  asnV4: number | null;
  asnV6: number | null;
  location: GeoPoint;
}

export interface Recommendation {
  code: RecommendationCode;
  message: string;
}

export interface Assessment {
  quality: Quality;
  qualityScore: number;
}

export interface ProbeForecast {
  model: ModelRef;
  probeId: number;
  location: GeoPoint & { countryCode: string };
  prediction: {
    predictionFor: string;
    predictedAvgRttMs: number;
    predictedPacketLossPct: number;
  };
  assessment: Assessment;
  recommendation: Recommendation;
}

export interface TimelineItem {
  predictionFor: string;
  predictedAvgRttMs: number;
  predictedPacketLossPct: number;
  quality: Quality;
  qualityScore: number;
}

export interface Timeline {
  model: ModelRef;
  probeId: number;
  items: TimelineItem[];
}

export interface CompareModelItem {
  modelId: string;
  modelName: string;
  predictedAvgRttMs: number;
  predictedPacketLossPct: number;
  quality: Quality;
}

export interface CompareResponse {
  probeId: number;
  predictionFor: string;
  models: CompareModelItem[];
}

export interface ActivityCheckRequest {
  modelId: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  activity: ActivityType;
}

export interface ActivityCheckResponse {
  model: ModelRef;
  activity: ActivityType;
  suitable: boolean;
  forecast: {
    quality: Quality;
    predictedAvgRttMs: number;
    predictedPacketLossPct: number;
  };
  recommendation: Recommendation;
  metadata: { disclaimer: string; locationPrivacy: string };
}
