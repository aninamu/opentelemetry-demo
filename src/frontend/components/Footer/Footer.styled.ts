// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Footer = styled.footer`
  position: relative;
  padding: 48px 9% 32px;
  background-color: ${({ theme }) => theme.colors.parchment};
  border-top: 4px double ${({ theme }) => theme.colors.rule};
  box-shadow: 0 -3px 0 -2px ${({ theme }) => theme.colors.rule};
  text-align: center;

  * {
    color: ${({ theme }) => theme.colors.ink};
    font-size: ${({ theme }) => theme.sizes.dSmall};
    font-weight: ${({ theme }) => theme.fonts.regular};
  }

  a {
    color: ${({ theme }) => theme.colors.rule};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  & > div > p:first-of-type {
    font-family: ${({ theme }) => theme.fonts.display};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: ${({ theme }) => theme.sizes.mMedium};
    margin: 0 0 6px 0;
  }

  & > div > p:nth-of-type(2) {
    font-style: italic;
    font-size: ${({ theme }) => theme.sizes.mSmall};
    color: ${({ theme }) => theme.colors.textLightGray};
    margin: 0 0 24px 0;
  }

  & > p {
    font-family: ${({ theme }) => theme.fonts.display};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: ${({ theme }) => theme.sizes.mMedium};
    margin: 0;
    padding-top: 14px;
    border-top: 1px solid ${({ theme }) => theme.colors.rule};
    position: relative;
  }

  & > p::before {
    content: '\u2766';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.colors.parchment};
    padding: 0 10px;
    color: ${({ theme }) => theme.colors.rule};
    font-family: ${({ theme }) => theme.fonts.display};
  }
`;
