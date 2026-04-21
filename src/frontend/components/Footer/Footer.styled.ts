// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Footer = styled.footer`
  position: relative;
  padding: 65px 9%;
  background-color: ${({ theme }) => theme.colors.otelGray};
  border-top: 3px double ${({ theme }) => theme.colors.borderGray};

  * {
    color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.sizes.dSmall};
    font-weight: ${({ theme }) => theme.fonts.regular};
    font-family: 'IM Fell English', serif;
  }

  a {
    color: ${({ theme }) => theme.colors.otelYellow};
  }
`;
