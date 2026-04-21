// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import Button from '../Button';

export const Banner = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};

  ${({ theme }) => theme.breakpoints.desktop} {
    flex-direction: row-reverse;
    padding-bottom: 0;
    border-bottom: 3px double ${({ theme }) => theme.colors.borderGray};
  }
`;

export const BannerImg = styled.img.attrs({
  src: '/images/Banner.png',
})`
  width: 100%;
  height: auto;
  display: block;
  filter: sepia(0.25) contrast(1.02);
`;

export const ImageContainer = styled.div`
  padding: 12px;
  margin: 12px;
  border: 2px solid ${({ theme }) => theme.colors.borderGray};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.lightBorderGray};
  background: ${({ theme }) => theme.colors.backgroundGray};

  ${({ theme }) => theme.breakpoints.desktop} {
    min-width: 50%;
    margin: 24px 24px 24px 12px;
  }
`;

export const TextContainer = styled.div`
  padding: 24px 20px;
  text-align: center;
  border-top: 3px double ${({ theme }) => theme.colors.borderGray};
  border-bottom: 3px double ${({ theme }) => theme.colors.borderGray};
  margin: 0 12px 12px;

  ${({ theme }) => theme.breakpoints.desktop} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    padding: 48px 80px 48px 48px;
    margin: 24px 12px 24px 24px;
    border-top: none;
    border-bottom: none;
    border-left: 3px double ${({ theme }) => theme.colors.borderGray};
    border-right: 3px double ${({ theme }) => theme.colors.borderGray};
    text-align: center;
  }
`;

export const Title = styled.h1`
  font-family: 'IM Fell English', serif;
  font-size: ${({ theme }) => theme.sizes.mxLarge};
  font-weight: ${({ theme }) => theme.fonts.bold};
  font-style: italic;
  margin: 0 0 16px;
  line-height: 1.25;

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dxLarge};
  }
`;

export const GoShoppingButton = styled(Button)`
  width: 100%;

  ${({ theme }) => theme.breakpoints.desktop} {
    width: auto;
  }
`;
