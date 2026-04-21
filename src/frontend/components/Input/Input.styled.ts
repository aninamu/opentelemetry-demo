// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const Input = styled.input`
  width: -webkit-fill-available;
  border: none;
  padding: 14px 16px;
  outline: none;

  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.sizes.dMedium};
  color: ${({ theme }) => theme.colors.ink};

  border-radius: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.rule};

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.parchment}, 0 0 0 3px ${({ theme }) => theme.colors.rule};
  }
`;

export const InputLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: ${({ theme }) => theme.sizes.dMedium};
  font-weight: ${({ theme }) => theme.fonts.semiBold};
  color: ${({ theme }) => theme.colors.ink};
  margin: 0;
  margin-bottom: 10px;
`;

export const Select = styled.select`
  width: 100%;
  border: none;

  padding: 14px 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.sizes.dMedium};
  color: ${({ theme }) => theme.colors.ink};

  border-radius: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.rule};
`;

export const InputRow = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

export const Arrow = styled.img.attrs({
  src: '/icons/Chevron.svg',
  alt: 'arrow',
})`
  position: absolute;
  right: 20px;
  width: 10px;
  height: 5px;
  top: 60px;
`;
