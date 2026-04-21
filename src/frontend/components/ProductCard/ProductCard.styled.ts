// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import RouterLink from 'next/link';

export const Link = styled(RouterLink)`
  text-decoration: none;
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 150px;
  background: ${({ $src }) => `url("${$src}")`} no-repeat center;
  background-size: contain;
  border: 1px solid ${({ theme }) => theme.colors.borderGray};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lightBorderGray};
  background-color: ${({ theme }) => theme.colors.backgroundGray};

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 300px;
  }
`;

export const ProductCard = styled.div`
  cursor: pointer;
  padding-bottom: 8px;
`;

export const ProductName = styled.p`
  margin: 0;
  margin-top: 12px;
  font-family: 'IM Fell English SC', 'IM Fell English', serif;
  font-size: ${({ theme }) => theme.sizes.dSmall};
  font-variant: small-caps;
  letter-spacing: 0.06em;
`;

export const ProductPrice = styled.p`
  margin: 0;
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.lightBorderGray};
  font-family: 'IM Fell English', serif;
  font-size: ${({ theme }) => theme.sizes.dMedium};
  font-weight: ${({ theme }) => theme.fonts.bold};
`;
