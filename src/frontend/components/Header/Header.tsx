// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import CartIcon from '../CartIcon';
import CurrencySwitcher from '../CurrencySwitcher';
import * as S from './Header.styled';

const Header = () => {
  return (
    <S.Header>
      <S.Marquee aria-hidden="true">
        <S.MarqueeSide>&#10070; MMXXVI &#10070;</S.MarqueeSide>
        <S.MarqueeCenter>VOX ASTRONOMI&AElig; &mdash; PUBLISHED WEEKLY AT THE OPENTELEMETRY OBSERVATORY</S.MarqueeCenter>
        <S.MarqueeSide>&#10070; N&deg; I &#10070;</S.MarqueeSide>
      </S.Marquee>
      <S.NavBar>
        <S.Container>
          <S.NavBarBrand href="/">
            <S.BrandImg />
          </S.NavBarBrand>
          <S.Controls>
            <CurrencySwitcher />
            <CartIcon />
          </S.Controls>
        </S.Container>
      </S.NavBar>
    </S.Header>
  );
};

export default Header;
