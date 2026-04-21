// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const CurrencySwitcher = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 24px;
  color: ${({ theme }) => theme.colors.textLightGray};

  &::-webkit-input-placeholder,
  &::-moz-placeholder,
  :-ms-input-placeholder,
  :-moz-placeholder {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textLightGray};
  }
`;

export const SelectedConcurrency = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  text-align: center;
  font-weight: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.ink};

  position: relative;
  left: 35px;
  width: 30px;
  display: inline-block;
`;

export const Arrow = styled.img.attrs({
  src: '/icons/Chevron.svg',
  alt: 'arrow',
})`
  position: absolute;
  right: 12px;
  width: 12px;
  height: 17px;
`;

export const Select = styled.select`
  -webkit-appearance: none;
  -webkit-border-radius: 0px;
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;

  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.parchment};
  color: ${({ theme }) => theme.colors.ink};
  font-weight: ${({ theme }) => theme.fonts.regular};
  border: 1px solid ${({ theme }) => theme.colors.rule};
  width: 130px;
  height: 40px;
  flex-shrink: 0;
  padding: 1px 0 0 45px;
  font-size: 16px;
  border-radius: 0;
`;
