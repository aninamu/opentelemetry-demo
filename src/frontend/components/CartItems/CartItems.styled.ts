// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const CartItems = styled.section`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  padding: 16px 24px;
`;

export const CardItemsHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 100px auto;
  gap: 24px;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.ink};
  padding-bottom: 8px;
  border-bottom: 3px double ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 1fr auto auto;
  }
`;

export const CartItemImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 4px;
  filter: sepia(0.4) contrast(0.95);

  ${({ theme }) => theme.breakpoints.desktop} {
    width: 120px;
    height: 120px;
  }
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 150px 100px auto;
  gap: 24px;
  padding: 24px 0;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 1fr auto auto;
  }
`;

export const CartItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    flex-direction: row;
    gap: 24px;
  }
`;

export const PriceContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.fonts.display};
`;

export const DataRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 24px 0;
  gap: 24px;
  border-top: 3px double ${({ theme }) => theme.colors.rule};
  margin-top: 8px;
`;

export const TotalText = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.ink};
`;
