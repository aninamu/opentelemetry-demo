// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import styled from 'styled-components';
import { useDevMode } from '../../providers/DevMode.provider';

const Pill = styled.button`
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 10001;
  padding: 8px 14px;
  border-radius: 9999px;
  border: 1px solid #e1e0db;
  background: #f2f1ed;
  color: #26251e;
  font-family: 'Open Sans', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  &:hover {
    background: #ebeae5;
  }
`;

export default function DevModeToggle() {
  const { enabled, toggle, hydrated } = useDevMode();

  return (
    <Pill
      type="button"
      onClick={toggle}
      data-dev-mode-exclude="true"
      title="Toggle Otel dev mode (inspect + Cursor PR)"
    >
      {hydrated && enabled ? 'Dev mode: on' : 'Dev mode: off'}
    </Pill>
  );
}
