// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Image from 'next/image';
import styled from 'styled-components';
import Button from '../Button';

export const CartDropdown = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  background: ${({ theme }) => theme.colors.parchment};
  z-index: 1000;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule},
    0 4px 12px rgba(42, 33, 24, 0.25);

  ${({ theme }) => theme.breakpoints.desktop} {
    position: absolute;
    width: 420px;
    top: 95px;
    right: 17px;
    max-height: 600px;
  }
`;

export const Title = styled.h5`
  margin: 0px;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mxLarge};
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;

export const ItemList = styled.div`
  width: 100%;

  ${({ theme }) => theme.breakpoints.desktop} {
    max-height: 450px;
    overflow-y: auto;
  }
`;

export const Item = styled.div`
  display: grid;
  grid-template-columns: 29% 59%;
  gap: 2%;
  padding: 18px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
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

export const ItemName = styled.p`
  margin: 0px;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.ink};
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const ItemQuantity = styled(ItemName)`
  font-family: ${({ theme }) => theme.fonts.body};
  text-transform: none;
  letter-spacing: 0;
  font-style: italic;
  font-size: ${({ theme }) => theme.sizes.mMedium};
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const CartButton = styled(Button)``;

export const ContentWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    overflow-y: visible;
    flex: 0 1 auto;
    min-height: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 3px double ${({ theme }) => theme.colors.rule};

  span {
    position: absolute;
    right: 25px;
    color: ${({ theme }) => theme.colors.ink};
    cursor: pointer;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    span {
      display: none;
    }
  }
`;

export const EmptyCart = styled.h3`
  margin: 0;
  margin-top: 25px;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  color: ${({ theme }) => theme.colors.textLightGray};
  text-align: center;
`;
