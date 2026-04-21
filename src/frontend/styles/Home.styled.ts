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
    margin-top: 48px;
  }
`;

export const HotProducts = styled.div`
  margin-bottom: 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    margin-bottom: 100px;
  }
`;

export const HotProductsTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;

export const HotProductsTagline = styled.p`
  text-align: center;
  font-style: italic;
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.textLightGray};
  margin: 0 0 12px 0;
  font-size: ${({ theme }) => theme.sizes.mMedium};
`;

export const Home = styled.div`
  @media (max-width: 992px) {
    ${Content} {
      width: 100%;
    }
  }
`;
