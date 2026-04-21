// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled, { css } from 'styled-components';

export type BroadsideLineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IBroadsideLine {
  text: string;
  size?: BroadsideLineSize;
  italic?: boolean;
  smallCaps?: boolean;
  rule?: 'single' | 'double' | 'none';
  fleuron?: boolean;
}

interface IProps {
  lines: IBroadsideLine[];
  className?: string;
}

const sizeMap: Record<BroadsideLineSize, { mobile: string; desktop: string }> = {
  xs: { mobile: '11px', desktop: '13px' },
  sm: { mobile: '14px', desktop: '16px' },
  md: { mobile: '18px', desktop: '22px' },
  lg: { mobile: '26px', desktop: '38px' },
  xl: { mobile: '34px', desktop: '56px' },
};

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Line = styled.div<{ $size: BroadsideLineSize; $italic?: boolean; $smallCaps?: boolean }>`
  font-family: ${({ theme, $smallCaps }) => ($smallCaps ? theme.fonts.display : theme.fonts.body)};
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ $size }) => sizeMap[$size].mobile};
  line-height: 1.1;
  margin: 2px 0;
  ${({ $italic }) =>
    $italic &&
    css`
      font-style: italic;
    `}
  ${({ $smallCaps }) =>
    $smallCaps &&
    css`
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    `}

  ${({ theme, $size }) => theme.breakpoints.desktop} {
    font-size: ${({ $size }) => sizeMap[$size].desktop};
  }
`;

const DoubleRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.rule};
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
  height: 4px;
  width: 100%;
  margin: 6px 0;
`;

const SingleRule = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.rule};
  width: 80%;
  margin: 6px 0;
`;

const FleuronLine = styled.div`
  color: ${({ theme }) => theme.colors.rule};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  margin: 4px 0;
  letter-spacing: 0.3em;
`;

const Broadside = ({ lines, className }: IProps) => (
  <Stack className={className}>
    {lines.map((line, index) => {
      if (line.fleuron) {
        return (
          <FleuronLine key={`f-${index}`} aria-hidden="true">
            {line.text || '\u2766 \u2766 \u2766'}
          </FleuronLine>
        );
      }
      return (
        <Line
          key={index}
          $size={line.size || 'md'}
          $italic={line.italic}
          $smallCaps={line.smallCaps}
        >
          {line.rule === 'double' ? <DoubleRule /> : null}
          {line.rule === 'single' ? <SingleRule /> : null}
          {line.text}
        </Line>
      );
    })}
  </Stack>
);

export default Broadside;
