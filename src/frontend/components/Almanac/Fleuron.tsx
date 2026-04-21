// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

interface IProps {
  glyph?: string;
  className?: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 14px 0;
  color: ${({ theme }) => theme.colors.rule};
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 4px;
    border-top: 1px solid ${({ theme }) => theme.colors.rule};
    box-shadow: 0 3px 0 -2px ${({ theme }) => theme.colors.rule};
  }
`;

const Glyph = styled.span`
  color: ${({ theme }) => theme.colors.rule};
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.2em;
`;

const Fleuron = ({ glyph = '\u2766', className }: IProps) => (
  <Wrapper className={className} aria-hidden="true">
    <Glyph>{glyph}</Glyph>
  </Wrapper>
);

export default Fleuron;
