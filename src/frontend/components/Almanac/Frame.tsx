// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import styled from 'styled-components';

interface IProps {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

const Outer = styled.div<{ $compact?: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  padding: ${({ $compact }) => ($compact ? '12px' : '20px')};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: ${({ $compact }) => ($compact ? '16px' : '36px')};
  }
`;

const Inner = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 18px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 28px;
  }

  &::before,
  &::after {
    content: '\u2766';
    position: absolute;
    top: -14px;
    color: ${({ theme }) => theme.colors.rule};
    background: ${({ theme }) => theme.colors.parchment};
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
    padding: 0 8px;
    line-height: 1;
  }

  &::before {
    left: 24px;
  }

  &::after {
    right: 24px;
  }
`;

const Frame = ({ children, className, compact }: IProps) => (
  <Outer className={className} $compact={compact}>
    <Inner>{children}</Inner>
  </Outer>
);

export default Frame;
