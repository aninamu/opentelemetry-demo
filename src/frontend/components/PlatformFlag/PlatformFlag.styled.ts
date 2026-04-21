// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Block = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 110px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: ${({ theme }) => theme.sizes.mSmall};
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.otelYellow};
  border: 1px solid ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    width: 200px;
    height: 50px;
    font-size: ${({ theme }) => theme.sizes.dSmall};
  }
`;
