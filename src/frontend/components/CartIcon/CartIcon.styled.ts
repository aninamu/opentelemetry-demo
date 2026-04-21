// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import styled from 'styled-components';

export const CartIcon = styled.a`
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-left: 25px;
  cursor: pointer;
`;

export const Icon = styled(Image).attrs({
  width: '24',
  height: '24',
})`
  margin-bottom: 3px;
  filter: sepia(0.6) saturate(0.85) contrast(1.05);
`;

export const ItemsCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 6px;
  left: 14px;
  width: 18px;
  height: 18px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 10px;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.colors.parchment};
  color: ${({ theme }) => theme.colors.parchment};
  background: ${({ theme }) => theme.colors.ink};
`;
