import type {
  ActivityCheckRequest,
  ActivityCheckResponse,
  CompareResponse,
  LocationItem,
  ModelItem,
  ProbeForecast,
  Timeline,
} from './types';

export * from './types';

export const API_BASE_URL = 'https://internet-quality-api.onrender.com/api/v1';

const REQUEST_TIMEOUT_MS = 75_000;

export type ApiErrorKind = 'timeout' | 'network' | 'not_found' | 'bad_request' | 'server';

const ERROR_MESSAGES: Record<ApiErrorKind, string> = {
  timeout:
    'O servidor demorou demais para responder. Ele pode estar iniciando. Tente novamente em alguns segundos.',
  network: 'Não foi possível falar com o servidor. Verifique sua internet e tente novamente.',
  not_found: 'Não há previsões disponíveis para esta região com o modelo escolhido.',
  bad_request: 'Não foi possível fazer esta consulta. Revise as escolhas e tente novamente.',
  server: 'O servidor encontrou um problema. Tente novamente mais tarde.',
};

export class ApiError extends Error {
  kind: ApiErrorKind;
  constructor(kind: ApiErrorKind) {
    super(ERROR_MESSAGES[kind]);
    this.kind = kind;
  }
}

export function toApiError(err: unknown): ApiError {
  return err instanceof ApiError ? err : new ApiError('network');
}

async function request<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method: init?.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(controller.signal.aborted ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    if (response.status === 404) throw new ApiError('not_found');
    if (response.status === 400 || response.status === 422) throw new ApiError('bad_request');
    throw new ApiError('server');
  }
  return (await response.json()) as T;
}

export const api = {
  listModels: () => request<{ items: ModelItem[] }>('/models').then((r) => r.items),

  listLocations: () => request<{ items: LocationItem[] }>('/locations').then((r) => r.items),

  getForecast: (probeId: number, modelId: string) =>
    request<ProbeForecast>(
      `/forecasts/probes/${probeId}?model_id=${encodeURIComponent(modelId)}`,
    ),

  getTimeline: (probeId: number, modelId: string, limit = 100) =>
    request<Timeline>(
      `/forecasts/probes/${probeId}/timeline?model_id=${encodeURIComponent(modelId)}&limit=${limit}`,
    ),

  compare: (probeId: number, predictionFor?: string) =>
    request<CompareResponse>(
      `/forecasts/probes/${probeId}/compare` +
        (predictionFor ? `?prediction_for=${encodeURIComponent(predictionFor)}` : ''),
    ),

  checkActivity: (body: ActivityCheckRequest) =>
    request<ActivityCheckResponse>('/activity/check', { method: 'POST', body }),
};
