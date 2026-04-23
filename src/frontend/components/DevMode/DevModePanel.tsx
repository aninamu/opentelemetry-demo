// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { serviceForApiPath, serviceForComponentName } from '../../dev-mode/backendMap';
import { useDevMode } from '../../providers/DevMode.provider';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(20, 18, 11, 0.25);
`;

const Panel = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10001;
  width: min(420px, 100vw);
  height: 100%;
  background: #f7f7f4;
  color: #26251e;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  font-family: 'Open Sans', system-ui, sans-serif;
  font-size: 14px;
  overflow: hidden;
`;

const Header = styled.header`
  padding: 16px 20px;
  border-bottom: 1px solid #e1e0db;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f1ed;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #26251e;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  &:hover {
    background: #ebeae5;
  }
`;

const Section = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid #e6e5e0;
`;

const Label = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(38, 37, 30, 0.6);
  margin-bottom: 6px;
`;

const Code = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
  background: #f0efeb;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e1e0db;
`;

const LinkButton = styled.a`
  display: inline-block;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f54e00;
  color: #f7f7f4;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  &:hover {
    filter: brightness(1.05);
  }
`;

const ServiceList = styled.ul`
  margin: 0;
  padding-left: 18px;
  li {
    margin: 4px 0;
  }
  a {
    color: #f54e00;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #d0cfc9;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  background: #fff;
`;

const Submit = styled.button`
  margin-top: 10px;
  padding: 10px 16px;
  background: #26251e;
  color: #f7f7f4;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    opacity: 0.92;
  }
`;

const Status = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(38, 37, 30, 0.75);
`;

const BodyScroll = styled.div`
  flex: 1;
  overflow-y: auto;
`;

function githubBlobUrl(
  fileName: string,
  line: number
): { href: string; relPath: string } | null {
  const ref = process.env.NEXT_PUBLIC_GITHUB_REF || 'main';
  const ownerRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'aninamu/opentelemetry-demo';
  if (!fileName) return null;
  const norm = fileName.replace(/\\/g, '/');
  const marker = '/src/frontend/';
  const idx = norm.indexOf(marker);
  let rel: string;
  if (idx >= 0) {
    rel = norm.slice(idx + 1);
  } else if (norm.startsWith('src/frontend/')) {
    rel = norm;
  } else {
    return null;
  }
  const lineHash = line > 0 ? `#L${line}` : '';
  const href = `https://github.com/${ownerRepo}/blob/${ref}/${rel}${lineHash}`;
  return { href, relPath: rel };
}

function treeUrlForService(service: string): string {
  const ownerRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || 'aninamu/opentelemetry-demo';
  const ref = process.env.NEXT_PUBLIC_GITHUB_REF || 'main';
  if (service === 'frontend') {
    return `https://github.com/${ownerRepo}/tree/${ref}/src/frontend`;
  }
  return `https://github.com/${ownerRepo}/tree/${ref}/src/${service}`;
}

export default function DevModePanel() {
  const { enabled, selected, setSelected, lastFetches, hydrated } = useDevMode();
  const [prompt, setPrompt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<string>('');
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const relatedServices = useMemo(() => {
    if (!selected) return [];
    const s = new Set<string>();
    const c = serviceForComponentName(selected.componentName);
    if (c) s.add(c);
    for (const f of lastFetches) {
      try {
        const u = new URL(f.url, window.location.origin);
        const sv = serviceForApiPath(u.pathname);
        if (sv) s.add(sv);
      } catch {
        // ignore
      }
    }
    return [...s].sort();
  }, [selected, lastFetches]);

  const sourceLine = useMemo(() => {
    if (!selected?.fileName) return null;
    return githubBlobUrl(selected.fileName, selected.lineNumber);
  }, [selected]);

  const close = useCallback(() => {
    setSelected(null);
    setPrompt('');
    setAgentId(null);
    setPollStatus('');
    setPrUrl(null);
    setError(null);
  }, [setSelected]);

  // Poll for PR when we have an agent id
  useEffect(() => {
    if (!agentId || prUrl) return;
    const tick = async () => {
      try {
        const r = await fetch(`/api/dev-mode/agent?id=${encodeURIComponent(agentId)}`);
        if (!r.ok) return;
        const data = (await r.json()) as { status?: string; prUrl?: string | null; url?: string | null };
        if (data.prUrl) {
          setPrUrl(data.prUrl);
          setPollStatus('Pull request is ready');
          return;
        }
        if (data.status) {
          setPollStatus(String(data.status));
        }
        if (data.status === 'FINISHED' || data.status === 'ERROR' || data.status === 'error') {
          if (!data.prUrl) {
            setPollStatus(String(data.status));
          }
        }
      } catch {
        // ignore
      }
    };
    void tick();
    const t = setInterval(tick, 5000);
    return () => clearInterval(t);
  }, [agentId, prUrl]);

  const onSubmit = useCallback(async () => {
    if (!prompt.trim() || !selected) return;
    setSubmitting(true);
    setError(null);
    setPrUrl(null);
    setAgentId(null);
    try {
      const r = await fetch('/api/dev-mode/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
          selection: {
            fileName: selected.fileName,
            lineNumber: selected.lineNumber,
            columnNumber: selected.columnNumber,
            componentName: selected.componentName,
            tagName: selected.tagName,
          },
          services: relatedServices,
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError((data as { error?: string }).error || r.statusText);
        return;
      }
      const aid = (data as { agentId?: string }).agentId;
      if (aid) {
        setAgentId(aid);
        setPollStatus('Agent started — waiting for PR…');
      } else {
        setError('Unexpected response');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  }, [prompt, selected, relatedServices]);

  if (!hydrated || !enabled || !selected) {
    return null;
  }

  return (
    <>
      <Backdrop onClick={close} data-dev-mode-exclude="true" />
      <Panel data-dev-mode-exclude="true" onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Dev mode</Title>
          <CloseBtn type="button" onClick={close} aria-label="Close">
            ×
          </CloseBtn>
        </Header>
        <BodyScroll>
          <Section>
            <Label>Element</Label>
            <Code>
              {`<${selected.tagName}>`} · {selected.componentName}
            </Code>
            {sourceLine && (
              <>
                <Code style={{ marginTop: 8 }}>
                  {sourceLine.relPath}
                  {selected.lineNumber > 0 ? `:${selected.lineNumber}` : ''}
                </Code>
                <LinkButton href={sourceLine.href} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </LinkButton>
              </>
            )}
            {selected && !sourceLine && (
              <Status>Source file not available in this build (use next dev for React source maps).</Status>
            )}
          </Section>
          <Section>
            <Label>Related backend (heuristic)</Label>
            {relatedServices.length === 0 ? (
              <Status>Interact with the page to load data, or use a more specific component.</Status>
            ) : (
              <ServiceList>
                {relatedServices.map((svc) => (
                  <li key={svc}>
                    <a href={treeUrlForService(svc)} target="_blank" rel="noopener noreferrer">
                      {svc}
                    </a>
                  </li>
                ))}
              </ServiceList>
            )}
          </Section>
          <Section>
            <Label>Cursor: open a PR</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the change to make; a Cursor cloud agent will open a PR (requires server CURSOR_API_KEY)."
            />
            <Submit
              type="button"
              disabled={submitting || !prompt.trim()}
              onClick={onSubmit}
            >
              {submitting ? 'Launching…' : 'Open PR (Cursor)'}
            </Submit>
            {error && <Status style={{ color: '#b32' }}>Error: {error}</Status>}
            {agentId && !prUrl && <Status>{pollStatus || 'Checking status…'}</Status>}
            {prUrl && (
              <p style={{ marginTop: 8 }}>
                <LinkButton href={prUrl} target="_blank" rel="noopener noreferrer">
                  Open pull request
                </LinkButton>
              </p>
            )}
          </Section>
        </BodyScroll>
      </Panel>
    </>
  );
}
