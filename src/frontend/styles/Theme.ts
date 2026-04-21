// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { DefaultTheme } from 'styled-components';

const Theme: DefaultTheme = {
  colors: {
    // Almanac-era palette (parchment, sepia ink, colonial accents)
    otelBlue: '#3a4f6e',
    otelYellow: '#c9a968',
    otelGray: '#3a2e26',
    otelRed: '#a63d2d',
    backgroundGray: 'rgba(58, 46, 38, 0.09)',
    lightBorderGray: 'rgba(58, 46, 38, 0.22)',
    borderGray: '#5c4a3d',
    textGray: '#2a2118',
    textLightGray: '#6e5c4d',
    white: '#faf6ec',
    parchment: '#f1e7cf',
    parchmentDeep: '#e6d8b6',
    ink: '#2a2118',
    inkFaded: 'rgba(42, 33, 24, 0.6)',
    rule: '#5c4a3d',
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
    bold: '700',
    regular: '500',
    semiBold: '600',
    light: '400',
    display: "'IM Fell English SC', 'EB Garamond', Georgia, serif",
    body: "'EB Garamond', Georgia, 'Times New Roman', serif",
  },
};

export default Theme;
