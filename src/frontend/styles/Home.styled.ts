// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 0 100px;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const Content = styled.div`
  width: 100%;
  ${({ theme }) => theme.breakpoints.desktop} {
    margin-top: 100px;
  }
`;

export const HotProducts = styled.div`
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    margin-bottom: 100px;
  }
`;

export const HotProductsTitle = styled.h1`
  font-family: 'IM Fell English SC', 'IM Fell English', serif;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  letter-spacing: 0.12em;
  font-variant: small-caps;
  text-align: center;
  margin: 0 0 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.textGray};

  &::before,
  &::after {
    content: '';
    flex: 1;
    max-width: 120px;
    height: 1px;
    background: ${({ theme }) => theme.colors.borderGray};
    opacity: 0.85;
  }

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dxLarge};
    gap: 24px;

    &::before,
    &::after {
      max-width: 200px;
    }
  }
`;

export const Home = styled.div`
  @media (max-width: 992px) {
    ${Content} {
      width: 100%;
    }
  }
`;
