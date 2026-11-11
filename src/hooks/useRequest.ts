import { useEffect, useState } from 'react';
import { ApiError, toApiError } from '../api/client';

interface RequestState<T> {
  data?: T;
  error?: ApiError;
  loading: boolean;
  slow: boolean;
}

export function useRequest<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<RequestState<T>>({ loading: true, slow: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState((s) => ({ data: s.data, loading: true, slow: false }));
    const slowTimer = setTimeout(() => {
      if (active) setState((s) => ({ ...s, slow: true }));
    }, 4000);

    fn()
      .then((data) => {
        if (active) setState({ data, loading: false, slow: false });
      })
      .catch((err) => {
        if (active) setState({ error: toApiError(err), loading: false, slow: false });
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      active = false;
      clearTimeout(slowTimer);
    };
  }, [...deps, attempt]);

  return { ...state, reload: () => setAttempt((n) => n + 1) };
}
