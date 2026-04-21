// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import { Broadside, Frame } from '../Almanac';
import * as S from './Banner.styled';

const Banner = () => {
  return (
    <S.Banner>
      <S.FrameWrap>
        <Frame>
          <Broadside
            lines={[
              { text: 'Vox Stellarum!', size: 'md', italic: true, smallCaps: false },
              { text: 'THE ASTRONOMY', size: 'xl', smallCaps: true, rule: 'double' },
              { text: 'SHOPPE', size: 'xl', smallCaps: true },
              { text: 'FOR THE YEAR', size: 'sm', smallCaps: true },
              { text: 'MMXXVI', size: 'lg', smallCaps: true },
              { text: 'Being the Year of our Lord, and the Era of Microservices,', size: 'sm', italic: true },
              { text: 'the Second after the Introduction of the Collector.', size: 'sm', italic: true },
              { text: '', fleuron: true },
              { text: 'A PROPHETIC HIEROGLYPHIC OF WARES', size: 'md', smallCaps: true, rule: 'single' },
              { text: 'Telescopes, Orreries, Astrolabes, &c.', size: 'sm', italic: true },
              { text: 'Sundry Instruments for the Discerning Observer', size: 'sm', italic: true },
              { text: '', fleuron: true },
              { text: 'CORRECT TABLES OF PRICES & TAXES;', size: 'sm', smallCaps: true },
              { text: 'FREE CARRIAGE upon Orders of Magnitude,', size: 'xs', italic: true },
              { text: 'PAID IN GOLD, SILVER, OR BRASS COIN.', size: 'xs', smallCaps: true },
            ]}
          />
          <S.ButtonRow>
            <Link href="#hot-products">
              <S.GoShoppingButton>Go Shoppinge</S.GoShoppingButton>
            </Link>
          </S.ButtonRow>
          <S.Signature>
            &#10070; PUBLISHED AND SOLD BY THE OPENTELEMETRY OBSERVATORY &mdash; COURT OF THE COLLECTOR &#10070;
          </S.Signature>
        </Frame>
      </S.FrameWrap>
    </S.Banner>
  );
};

export default Banner;
