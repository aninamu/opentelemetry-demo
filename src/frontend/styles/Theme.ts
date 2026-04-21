// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { DefaultTheme } from 'styled-components';

const Theme: DefaultTheme = {
  colors: {
    otelBlue: '#7a2e1f',
    otelYellow: '#b8963d',
    otelGray: '#2b1d10',
    otelRed: '#a94442',
    backgroundGray: 'rgba(139, 106, 58, 0.12)',
    lightBorderGray: 'rgba(139, 106, 58, 0.35)',
    borderGray: '#8b6a3a',
    textGray: '#2b1d10',
    textLightGray: '#5c4a38',
    white: '#f1e6cf',
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
    regular: '400',
    semiBold: '600',
    light: '400',
  },
};

export default Theme;
