// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import RouterLink from 'next/link';

export const Ad = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.colors.parchmentDeep};
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.colors.parchmentDeep},
    inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ theme }) => theme.sizes.dMedium};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
  padding: 36px 24px;

  * {
    color: ${({ theme }) => theme.colors.ink};
    margin: 0;
    cursor: pointer;
  }

  &::before {
    content: '\u2766  ADVERTISEMENT  \u2766';
    display: block;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: ${({ theme }) => theme.colors.rule};
    margin-bottom: 12px;
  }
`;

export const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.ink};
  text-decoration: none;
`;
