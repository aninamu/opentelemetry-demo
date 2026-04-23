// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

export type DevModeSelection = {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  componentName: string;
  tagName: string;
};

export type FetchLogEntry = {
  url: string;
  method: string;
  status: number;
  ts: number;
};

export const DEV_MODE_STORAGE_KEY = 'otel-demo:devMode';
