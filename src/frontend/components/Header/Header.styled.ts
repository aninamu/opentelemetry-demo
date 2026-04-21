// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import styled from 'styled-components';

export const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.parchment};
  color: ${({ theme }) => theme.colors.ink};
  border-top: 6px double ${({ theme }) => theme.colors.rule};
`;

export const Marquee = styled.div`
  display: none;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 11px;
  letter-spacing: 0.16em;
  color: ${({ theme }) => theme.colors.rule};
  background-color: ${({ theme }) => theme.colors.parchment};
  padding: 6px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};

  ${({ theme }) => theme.breakpoints.desktop} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
`;

export const MarqueeSide = styled.span`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.rule};
`;

export const MarqueeCenter = styled.span`
  text-align: center;
  flex: 1;
  color: ${({ theme }) => theme.colors.rule};
`;

export const NavBar = styled.nav`
  height: 88px;
  background-color: ${({ theme }) => theme.colors.parchment};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textGray};
  border-top: 1px solid ${({ theme }) => theme.colors.rule};
  border-bottom: 4px double ${({ theme }) => theme.colors.rule};
  box-shadow: 0 3px 0 -2px ${({ theme }) => theme.colors.rule};
  z-index: 1;
  padding: 0;

  ${({ theme }) => theme.breakpoints.desktop} {
    height: 110px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;

  ${({ theme }) => theme.breakpoints.desktop} {
    padding: 18px 100px;
  }
`;

export const NavBarBrand = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0;
`;

export const BrandImg = styled.img.attrs({
  src: '/images/opentelemetry-demo-logo.png',
})`
  width: 240px;
  height: auto;
  filter: sepia(0.6) saturate(0.85) contrast(1.05) hue-rotate(-10deg);
  mix-blend-mode: multiply;
`;

export const Controls = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  gap: 8px;
`;
