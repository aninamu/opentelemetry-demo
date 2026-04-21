// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Checkout = styled.div`
  margin: 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    margin: 80px 100px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 120px;

  ${({ theme }) => theme.breakpoints.desktop} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "left right"
      "items items"
      "button button";
    gap: 40px;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-area: left;
  }
`;

export const SectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  color: ${({ theme }) => theme.colors.ink};
  text-align: left;
  border-bottom: 3px double ${({ theme }) => theme.colors.rule};
  padding-bottom: 8px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-area: right;
  }

  ${SectionTitle} {
    text-align: right;
  }
`;

export const ItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-area: items;
  }
`;

export const Title = styled.h1`
  text-align: center;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.sizes.mLarge};

  ${({ theme }) => theme.breakpoints.desktop} {
    text-align: left;
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;

export const Subtitle = styled.h3`
  text-align: center;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-style: italic;
  font-weight: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.textLightGray};

  ${({ theme }) => theme.breakpoints.desktop} {
    text-align: left;
    font-size: ${({ theme }) => theme.sizes.dMedium};
  }
`;

export const OrderInfo = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;

  ${({ theme }) => theme.breakpoints.desktop} {
    justify-content: flex-start;
  }
`;

export const InfoLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.ink};
`;

export const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.ink};
`;

export const AddressText = styled.p`
  margin: 4px 0;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.textGray};
  text-align: right;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OrderItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: ${({ theme }) => theme.colors.parchment};
  border: 1px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 3px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 4px ${({ theme }) => theme.colors.rule};
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: sepia(0.4) contrast(0.95);
  border: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 4px;
  flex-shrink: 0;
`;

export const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemName = styled.h5`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.ink};
`;

export const ItemQuantity = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  font-style: italic;
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const ItemPrice = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.ink};
  text-align: right;
  white-space: nowrap;
`;

export const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.parchment};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  margin-top: 16px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.textGray};
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 3px double ${({ theme }) => theme.colors.rule};
  margin-top: 8px;
`;

export const TotalLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.ink};
`;

export const TotalAmount = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.ink};
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-area: button;
  }
`;

export const DataRow = styled.div`
  display: grid;
  width: 100%;
  justify-content: space-between;
  grid-template-columns: 1fr 1fr;
  padding: 10px 0;
  border-top: solid 1px rgba(58, 46, 38, 0.35);

  span:last-of-type {
    text-align: right;
  }
`;
