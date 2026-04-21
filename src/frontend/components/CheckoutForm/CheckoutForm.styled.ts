// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const CheckoutForm = styled.form``;

export const StateRow = styled.div`
  display: grid;
  grid-template-columns: 35% 55%;
  gap: 10%;
`;

export const Title = styled.h1`
  margin: 0;
  margin-bottom: 24px;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.sizes.mLarge};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;

export const CardRow = styled.div`
  display: grid;
  grid-template-columns: 35% 35% 20%;
  gap: 5%;
`;

export const SubmitContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-direction: column-reverse;

  ${({ theme }) => theme.breakpoints.desktop} {
    flex-direction: row;
    justify-content: end;
    align-items: center;
    margin-top: 67px;
  }
`;

export const CartButton = styled(Button)`
  padding: 14px 35px;
  font-weight: ${({ theme }) => theme.fonts.regular};
  width: 100%;

  ${({ theme }) => theme.breakpoints.desktop} {
    width: inherit;
  }
`;

export const EmptyCartButton = styled(Button)`
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.otelRed};
  width: 100%;

  ${({ theme }) => theme.breakpoints.desktop} {
    width: inherit;
  }
`;
