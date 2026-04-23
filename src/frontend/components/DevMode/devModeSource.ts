// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { DevModeSelection } from '../../providers/DevMode.types';

type ReactFiber = {
  _debugSource?: { fileName: string; lineNumber: number; columnNumber?: number };
  type?: { name?: string; displayName?: string } | string;
  return?: ReactFiber | null;
};

function getFiberKey(node: Element | null): string | undefined {
  if (!node) return undefined;
  return Object.keys(node).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
}

function componentNameFromFiber(f: ReactFiber | null | undefined): string {
  if (!f?.type) return '';
  const t = f.type;
  if (typeof t === 'string') return t;
  return (t.displayName || t.name || '') as string;
}

/**
 * Walk from a DOM node up React fibers to find the first `_debugSource` (file:line).
 */
export function resolveSelectionFromElement(el: Element | null): DevModeSelection | null {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
  const key = getFiberKey(el);
  if (!key) return null;
  const fiber = (el as unknown as Record<string, ReactFiber>)[key] as ReactFiber | undefined;
  if (!fiber) return null;

  let current: ReactFiber | null | undefined = fiber;
  let best: { fileName: string; lineNumber: number; columnNumber: number } | null = null;
  let bestName = '';

  while (current) {
    if (current._debugSource) {
      best = {
        fileName: current._debugSource.fileName,
        lineNumber: current._debugSource.lineNumber,
        columnNumber: current._debugSource.columnNumber ?? 0,
      };
      const n = componentNameFromFiber(current);
      if (n) bestName = n;
      break;
    }
    current = current.return ?? null;
  }

  if (!best) {
    return {
      fileName: '',
      lineNumber: 0,
      columnNumber: 0,
      componentName: componentNameFromFiber(fiber) || el.tagName.toLowerCase(),
      tagName: el.tagName.toLowerCase(),
    };
  }

  return {
    fileName: best.fileName,
    lineNumber: best.lineNumber,
    columnNumber: best.columnNumber,
    componentName: bestName || componentNameFromFiber(fiber) || el.tagName.toLowerCase(),
    tagName: el.tagName.toLowerCase(),
  };
}
