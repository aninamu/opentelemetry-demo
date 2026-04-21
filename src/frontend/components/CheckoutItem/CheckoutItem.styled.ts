// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import styled from 'styled-components';

export const CheckoutItem = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 25px;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 40% 40% 1fr;
  }
`;

export const ItemDetails = styled.div`
  display: flex;
  gap: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    padding-bottom: 0;
    padding-right: 25px;
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.colors.rule};
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  span,
  p {
    margin: 0;
    font-weight: ${({ theme }) => theme.fonts.regular};
  }
`;

export const ItemName = styled.h5`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  color: ${({ theme }) => theme.colors.ink};
`;

export const ShippingData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 25px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};

  p {
    margin: 0;
    font-weight: ${({ theme }) => theme.fonts.light};
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 0 25px;
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.colors.rule};
  }
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 25px;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding-top: 0;
  }
`;

export const ItemImage = styled(Image).attrs({
  width: '80',
  height: '80',
})`
  object-fit: contain;
  filter: sepia(0.4) contrast(0.95);
  border: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 4px;
`;

export const SeeMore = styled.a`
  color: ${({ theme }) => theme.colors.rule};
  font-style: italic;
  text-decoration: underline;
  text-underline-offset: 3px;
`;
