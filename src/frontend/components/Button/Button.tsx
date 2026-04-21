// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

const Button = styled.button<{ $type?: 'primary' | 'secondary' | 'link' }>`
  background-color: ${({ theme }) => theme.colors.otelBlue};
  color: ${({ theme }) => theme.colors.paperHighlight};
  display: inline-block;
  border: solid 1px ${({ theme }) => theme.colors.otelBlue};
  padding: 8px 16px;
  outline: none;
  font-weight: ${({ theme }) => theme.fonts.semiBold};
  font-size: 20px;
  line-height: 27px;
  border-radius: 3px;
  height: 62px;
  cursor: pointer;

  ${({ $type = 'primary', theme }) =>
    $type === 'secondary' &&
    css`
      background: none;
      color: ${theme.colors.otelBlue};
    `};

  ${({ $type = 'primary', theme }) =>
    $type === 'link' &&
    css`
      background: none;
      color: ${theme.colors.otelBlue};
      border: none;
    `};
`;

export default Button;
