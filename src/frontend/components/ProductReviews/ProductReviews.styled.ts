// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

export const ProductReviews = styled.section`
  display: flex;
  margin: 40px 0;
  align-items: center;
  flex-direction: column;
`;

export const TitleContainer = styled.div`
  border-top: 3px double ${({ theme }) => theme.colors.rule};
  border-bottom: 1px solid ${({ theme }) => theme.colors.rule};
  padding: 24px 0 16px;
  margin: 16px 0 24px;
  text-align: center;
  width: 100%;
  position: relative;

  &::before {
    content: '\u2766';
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: ${({ theme }) => theme.colors.parchmentDeep};
    padding: 0 12px;
    color: ${({ theme }) => theme.colors.rule};
    font-size: 18px;
    font-family: ${({ theme }) => theme.fonts.display};
  }
`;

export const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-size: ${({ theme }) => theme.sizes.mLarge};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dLarge};
  }
`;

export const TitleTagline = styled.p`
  margin: 6px 0 0;
  font-style: italic;
  color: ${({ theme }) => theme.colors.textLightGray};
  font-size: ${({ theme }) => theme.sizes.mMedium};
`;

/* Summary card at the top */
export const SummaryCard = styled.section`
  width: 100%;
  padding: 20px;
  margin: 0 20px 24px;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchment};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.parchment}, inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  display: grid;
  gap: 16px;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: 280px 1fr;
    align-items: center;
  }
`;

export const AverageBlock = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;
`;

export const AverageScoreBadge = styled.div`
  min-width: 72px;
  height: 72px;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.parchment}, inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchmentDeep};
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 700;
  font-size: 28px;
  display: grid;
  place-items: center;
`;

export const StarRating = styled.span`
  color: ${({ theme }) => theme.colors.otelYellow};
  font-size: 18px;
`;

export const ScoreCount = styled.span`
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.textLightGray};
  font-size: 14px;
`;

export const ScoreDistribution = styled.div`
  display: grid;
  gap: 8px;
`;

export const ScoreRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 48px;
  align-items: center;
  gap: 8px;
`;

export const ScoreLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLightGray};
`;

export const ScoreBar = styled.div`
  position: relative;
  height: 10px;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchmentDeep};
  overflow: hidden;
`;

export const ScoreBarFill = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: repeating-linear-gradient(
    45deg,
    ${({ theme }) => theme.colors.rule},
    ${({ theme }) => theme.colors.rule} 3px,
    ${({ theme }) => theme.colors.ink} 3px,
    ${({ theme }) => theme.colors.ink} 6px
  );
`;

export const ScorePct = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.otelGray};
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const SummaryText = styled.p`
  margin: 0;
  line-height: 1.5;
`;

/* Reviews grid: 1 column mobile, 5 desktop (since there are always 5 reviews) */
export const ReviewsGrid = styled.ul`
  display: grid;
  width: 100%;
  padding: 0 20px;
  margin: 0;
  list-style: none;
  gap: 24px;
  grid-template-columns: 1fr;

  ${({ theme }) => theme.breakpoints.desktop} {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const ReviewCard = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchment};
  padding: 16px;
  display: grid;
  gap: 12px;
  box-shadow:
    inset 0 0 0 3px ${({ theme }) => theme.colors.parchment},
    inset 0 0 0 4px ${({ theme }) => theme.colors.rule};
`;

export const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ReviewerName = styled.strong`
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

export const ReviewBody = styled.p`
  margin: 0;
  line-height: 1.6;
`;

export const AskAISection = styled.section`
  width: 100%;
  padding: 20px;
  margin: 0 20px 24px;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.parchment}, inset 0 0 0 2px ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchment};
  display: grid;
  gap: 12px;
`;

export const AskAIHeader = styled.h4`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.display};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.sizes.mLarge};
  color: ${({ theme }) => theme.colors.ink};

  ${({ theme }) => theme.breakpoints.desktop} {
    font-size: ${({ theme }) => theme.sizes.dMedium};
  }
`;

export const AskAIInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
`;

export const AskAIInput = styled.input`
  width: 100%;
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  outline: none;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.ink};

  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 3px rgba(92, 74, 61, 0.25);
  }
`;

export const AskAIControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const QuickPromptButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchmentDeep};
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.parchment};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.parchment}, 0 0 0 3px ${({ theme }) => theme.colors.rule};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AskAIButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${({ theme }) => theme.colors.rule};
  background: ${({ theme }) => theme.colors.parchment};
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.parchment}, inset 0 0 0 2px ${({ theme }) => theme.colors.rule};

  &:hover {
    background: ${({ theme }) => theme.colors.parchmentDeep};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AIMessage = styled.p`
  margin: 0;
  line-height: 1.5;
  font-style: italic;
  color: ${({ theme }) => theme.colors.ink};
`;
