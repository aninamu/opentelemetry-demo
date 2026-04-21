// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const Banner = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 48px 40px 72px;
  }
`;

export const FrameWrap = styled.div`
  width: 100%;
  max-width: 560px;

  ${({ theme }) => theme.breakpoints.desktop} {
    max-width: 680px;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;

  a {
    text-decoration: none;
  }
`;

export const GoShoppingButton = styled(Button)`
  min-width: 220px;
`;

export const Signature = styled.p`
  margin: 18px 0 0 0;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.rule};
`;
