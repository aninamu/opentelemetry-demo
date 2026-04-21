// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../components/Button';

export const ProductDetail = styled.div`
  padding: 24px 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 64px 100px;
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  background-color: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  padding: 20px;
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 40% 60%;
    gap: 48px;
    padding: 40px;
  }
`;

export const Image = styled.div<{ $src: string }>`
  width: 100%;
  height: 240px;
  background: ${({ $src }) => `url("${$src}")`} no-repeat center;
  background-size: contain;
  filter: sepia(0.4) contrast(0.95) saturate(0.85);
  border: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 12px;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 500px;
    background-position: top;
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
`;

export const AddToCart = styled(Button)`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  width: 100%;
  font-size: ${({ theme }) => theme.sizes.dSmall};
  font-weight: ${({ theme }) => theme.fonts.regular};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dMedium};
    width: 260px;
  }
`;

export const Name = styled.h5`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.dMedium};
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
    line-height: 1.15;
  }
`;

export const Text = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  line-height: 1.55;
`;

export const Description = styled(Text)`
  margin: 0;
  color: ${({ theme }) => theme.colors.textGray};
  font-weight: ${({ theme }) => theme.fonts.regular};
  font-style: italic;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dMedium};
  }
`;

export const ProductPrice = styled(Text)`
  font-weight: ${({ theme }) => theme.fonts.bold};
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }

  &::before,
  &::after {
    content: '\u00b7 ';
    color: ${({ theme }) => theme.colors.rule};
    margin: 0 4px;
  }
`;
