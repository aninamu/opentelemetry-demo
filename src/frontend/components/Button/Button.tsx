// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

const Button = styled.button<{ $type?: 'primary' | 'secondary' | 'link' }>`
  background-color: ${({ theme }) => theme.colors.otelBlue};
  color: ${({ theme }) => theme.colors.white};
  display: inline-block;
  border: 3px double ${({ theme }) => theme.colors.white};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.otelBlue};
  padding: 8px 20px;
  outline: none;
  font-family: 'IM Fell English SC', 'IM Fell English', serif;
  font-weight: ${({ theme }) => theme.fonts.bold};
  font-size: 20px;
  line-height: 27px;
  border-radius: 0;
  height: 62px;
  cursor: pointer;
  letter-spacing: 0.08em;
  font-variant: small-caps;
  text-transform: lowercase;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.otelYellow};
    outline-offset: 3px;
  }

  ${({ $type = 'primary' }) =>
    $type === 'secondary' &&
    css`
      background: transparent;
      color: ${({ theme }) => theme.colors.otelBlue};
      border: 3px double ${({ theme }) => theme.colors.otelBlue};
      box-shadow: none;

      &:focus-visible {
        outline-color: ${({ theme }) => theme.colors.otelBlue};
      }
    `};

  ${({ $type = 'primary' }) =>
    $type === 'link' &&
    css`
      background: none;
      color: ${({ theme }) => theme.colors.otelBlue};
      border: none;
      box-shadow: none;
      height: auto;
      padding: 4px 0;

      &:focus-visible {
        outline-offset: 2px;
        outline-color: ${({ theme }) => theme.colors.otelBlue};
      }
    `};
`;

export default Button;
