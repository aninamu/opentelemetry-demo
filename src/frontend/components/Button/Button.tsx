// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

const Button = styled.button<{ $type?: 'primary' | 'secondary' | 'link' }>`
  background-color: ${({ theme }) => theme.colors.parchment};
  color: ${({ theme }) => theme.colors.ink};
  display: inline-block;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  padding: 10px 22px;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: ${({ theme }) => theme.fonts.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 18px;
  line-height: 1.2;
  border-radius: 0;
  height: 58px;
  cursor: pointer;
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  transition: background-color 120ms ease, color 120ms ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.parchment};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ $type = 'primary' }) =>
    $type === 'secondary' &&
    css`
      background: transparent;
      color: ${({ theme }) => theme.colors.ink};
      box-shadow: none;
      border-width: 1px;
    `};

  ${({ $type = 'primary' }) =>
    $type === 'link' &&
    css`
      background: none;
      color: ${({ theme }) => theme.colors.ink};
      border: none;
      box-shadow: none;
      text-decoration: underline;
      text-underline-offset: 4px;
      height: auto;
      padding: 4px 8px;
      font-size: 14px;

      &:hover:not(:disabled) {
        background: none;
        color: ${({ theme }) => theme.colors.rule};
      }
    `};
`;

export default Button;
