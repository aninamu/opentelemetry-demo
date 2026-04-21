// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Recommendations = styled.section`
  display: flex;
  margin: 40px 0;
  align-items: center;
  flex-direction: column;
`;

export const ProductList = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px;
  flex-direction: column;
  gap: 24px;

  ${({ theme }) => theme.breakpoints.desktop} {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export const TitleContainer = styled.div`
  border-top: 3px double ${({ theme }) => theme.colors.rule};
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 22px 0 14px;
  margin: 16px 0 24px;
  text-align: center;
  width: 100%;
  position: relative;

  &::before {
    content: '\u2766';
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.colors.parchmentDeep};
    padding: 0 12px;
    color: ${({ theme }) => theme.colors.rule};
    font-size: 18px;
    font-family: ${({ theme }) => theme.fonts.display};
  }
`;

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.sizes.mLarge};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;
