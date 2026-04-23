// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { type ReactNode } from 'react';
import { DevModeProvider } from '../../providers/DevMode.provider';
import DevModeOverlay from './DevModeOverlay';
import DevModePanel from './DevModePanel';
import DevModeToggle from './DevModeToggle';

export default function DevModeRoot({ children }: { children: ReactNode }) {
  return (
    <DevModeProvider>
      {children}
      <DevModeToggle />
      <DevModeOverlay />
      <DevModePanel />
    </DevModeProvider>
  );
}
