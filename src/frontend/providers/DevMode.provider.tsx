// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEV_MODE_STORAGE_KEY, type DevModeSelection, type FetchLogEntry } from './DevMode.types';

type DevModeContextValue = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
  selected: DevModeSelection | null;
  setSelected: (s: DevModeSelection | null) => void;
  lastFetches: FetchLogEntry[];
  clearFetches: () => void;
  hydrated: boolean;
};

const DevModeContext = createContext<DevModeContextValue | null>(null);

const MAX_FETCHES = 50;

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<DevModeSelection | null>(null);
  const [lastFetches, setLastFetches] = useState<FetchLogEntry[]>([]);

  const persist = useCallback((v: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DEV_MODE_STORAGE_KEY, String(v));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(DEV_MODE_STORAGE_KEY);
      if (raw === 'true' || raw === 'false') {
        setEnabledState(raw === 'true');
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setEnabled = useCallback(
    (v: boolean) => {
      setEnabledState(v);
      persist(v);
    },
    [persist]
  );

  const toggle = useCallback(() => {
    setEnabledState((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  }, [persist]);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;
    const orig = window.fetch.bind(window);
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await orig(input, init);
      try {
        const urlStr =
          typeof input === 'string'
            ? input
            : input instanceof Request
              ? input.url
              : String(input);
        if (urlStr.includes('/api/')) {
          setLastFetches((prev) =>
            [
              {
                url: urlStr,
                method: init?.method ?? (input instanceof Request ? input.method : 'GET'),
                status: res.status,
                ts: Date.now(),
              },
              ...prev,
            ].slice(0, MAX_FETCHES)
          );
        }
      } catch {
        // ignore
      }
      return res;
    }) as typeof window.fetch;
    return () => {
      window.fetch = orig;
    };
  }, [enabled]);

  const clearFetches = useCallback(() => setLastFetches([]), []);

  // Avoid flash: before hydration, treat as off (but toggle still works after mount)
  const displayEnabled = hydrated && enabled;

  const value = useMemo<DevModeContextValue>(
    () => ({
      enabled: displayEnabled,
      toggle,
      setEnabled,
      selected,
      setSelected,
      lastFetches: displayEnabled ? lastFetches : [],
      clearFetches,
      hydrated,
    }),
    [displayEnabled, toggle, setEnabled, selected, setSelected, lastFetches, clearFetches, hydrated]
  );

  // When dev mode is off, clear selection so the panel does not reappear spuriously
  useEffect(() => {
    if (!displayEnabled) {
      setSelected(null);
    }
  }, [displayEnabled]);

  return <DevModeContext.Provider value={value}>{children}</DevModeContext.Provider>;
}

export function useDevMode() {
  const ctx = useContext(DevModeContext);
  if (!ctx) {
    throw new Error('useDevMode must be used within DevModeProvider');
  }
  return ctx;
}
