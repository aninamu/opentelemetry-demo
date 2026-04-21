// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import RouterLink from 'next/link';

export const Link = styled(RouterLink)`
  text-decoration: none;
  display: block;
`;

export const ProductCard = styled.div`
  cursor: pointer;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 3px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 4px ${({ theme }) => theme.colors.rule};
  padding: 12px;
  transition: transform 120ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 150px;
  background: ${({ $src, theme }) => `${theme.colors.parchmentDeep} url("${$src}")`} no-repeat center;
  background-size: contain;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  filter: sepia(0.4) contrast(0.95) saturate(0.85);

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 260px;
  }
`;

export const ProductName = styled.p`
  margin: 12px 0 4px;
  padding-top: 8px;
  border-top: 3px double ${({ theme }) => theme.colors.rule};
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: center;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.sizes.dSmall};
  line-height: 1.2;
`;

export const ProductPrice = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.dMedium};
  font-weight: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.ink};
  letter-spacing: 0.04em;

  &::before,
  &::after {
    content: '\u00b7';
    margin: 0 10px;
    color: ${({ theme }) => theme.colors.rule};
  }
`;
