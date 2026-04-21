// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { DefaultTheme } from 'styled-components';

const Theme: DefaultTheme = {
  colors: {
    otelBlue: '#6b2d2d',
    otelYellow: '#b8860b',
    otelGray: '#2c2419',
    otelRed: '#8b3a3a',
    backgroundGray: 'rgba(92, 77, 60, 0.12)',
    lightBorderGray: 'rgba(139, 115, 85, 0.45)',
    borderGray: '#5c4d3c',
    textGray: '#2a2218',
    textLightGray: '#6b5d4a',
    white: '#f4f0e6',
    paperHighlight: '#faf6ee',
  },
  breakpoints: {
    desktop: '@media (min-width: 768px)',
  },
  sizes: {
    mxLarge: '22px',
    mLarge: '20px',
    mMedium: '14px',
    mSmall: '12px',
    dxLarge: '58px',
    dLarge: '40px',
    dMedium: '18px',
    dSmall: '16px',
    nano: '8px',
  },
  fonts: {
    bold: '800',
    regular: '500',
    semiBold: '700',
    light: '400',
  },
};

export default Theme;
