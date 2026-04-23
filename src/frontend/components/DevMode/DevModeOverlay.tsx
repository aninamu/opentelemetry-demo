// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDevMode } from '../../providers/DevMode.provider';
import { resolveSelectionFromElement } from './devModeSource';

const Highlighter = styled.div<{ $vis: boolean }>`
  position: fixed;
  pointer-events: none;
  z-index: 9990;
  border: 2px solid #f54e00;
  border-radius: 2px;
  background: rgba(245, 78, 0, 0.08);
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  display: ${({ $vis }) => ($vis ? 'block' : 'none')};
  box-sizing: border-box;
  transition: opacity 0.05s ease-out;
`;

function isDevModeUiNode(node: EventTarget | null): boolean {
  if (!node || !(node instanceof Element)) return false;
  return Boolean(node.closest('[data-dev-mode-exclude]'));
}

export default function DevModeOverlay() {
  const { enabled, setSelected } = useDevMode();
  const [box, setBox] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const updateHover = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) {
        setBox(null);
        return;
      }
      const el = document.elementFromPoint(clientX, clientY);
      if (!el || isDevModeUiNode(el)) {
        setBox(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setBox({
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      });
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) {
      setBox(null);
      return;
    }

    const onMove = (e: MouseEvent) => {
      updateHover(e.clientX, e.clientY);
    };

    const onClick = (e: MouseEvent) => {
      if (!enabled) return;
      const t = e.target;
      if (t && isDevModeUiNode(t)) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || isDevModeUiNode(el)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const sel = resolveSelectionFromElement(el);
      if (sel) {
        setSelected(sel);
      }
    };

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('mousemove', onMove, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [enabled, setSelected, updateHover]);

  if (!enabled) {
    return null;
  }

  return (
    <Highlighter
      $vis={box !== null}
      style={
        box
          ? { transform: `translate(${box.left}px, ${box.top}px)`, width: box.width, height: box.height }
          : { opacity: 0 }
      }
    />
  );
}
