// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import { createCloudAgentWithPr, getAgentStatusRest } from '../../../lib/cursorCloudAgent';

const REPO_SLUG = 'aninamu/opentelemetry-demo';
const DEFAULT_REF = 'main';

type PostBody = {
  prompt: string;
  pageUrl?: string;
  selection?: {
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    componentName: string;
    tagName: string;
  };
  services?: string[];
};

function buildPrompt(userPrompt: string, body: PostBody): string {
  const parts = [userPrompt.trim(), '', '---', 'Context (Otel demo dev mode):', `Repository: ${REPO_SLUG} (ref: ${DEFAULT_REF})`];
  if (body.pageUrl) {
    parts.push(`Page URL: ${body.pageUrl}`);
  }
  if (body.selection) {
    const s = body.selection;
    if (s.fileName) {
      parts.push(
        `Selected element: <${s.tagName}> (React component: ${s.componentName}) at ${s.fileName}:${s.lineNumber}:${s.columnNumber}`
      );
    } else {
      parts.push(`Selected element: <${s.tagName}> (component hint: ${s.componentName}) — no source map in this build.`);
    }
  }
  if (body.services?.length) {
    parts.push(`Related backend service dirs (under src/): ${[...new Set(body.services)].join(', ')}`);
  }
  parts.push('', 'When done, open a pull request on GitHub for the changes.');
  return parts.join('\n');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'CURSOR_API_KEY is not configured on the server' });
  }

  if (req.method === 'GET') {
    const id = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : undefined;
    if (!id) {
      return res.status(400).json({ error: 'Missing query parameter: id' });
    }
    try {
      const s = await getAgentStatusRest(id, apiKey);
      return res.status(200).json({
        id: s.id,
        status: s.status,
        prUrl: s.target?.prUrl ?? null,
        url: s.target?.url ?? null,
        name: s.name,
        summary: s.summary,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return res.status(502).json({ error: message });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'GET, POST').end();
  }

  const body = (typeof req.body === 'object' && req.body) as PostBody;
  if (!body?.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()) {
    return res.status(400).json({ error: 'Missing or empty prompt' });
  }

  const composed = buildPrompt(body.prompt, body);

  try {
    const result = await createCloudAgentWithPr(composed, apiKey);

    if (result.mode === 'rest') {
      return res.status(202).json({
        agentId: result.agentId,
        runId: null,
        status: 'running',
      });
    }

    const { agent, run } = result;
    const agentId = agent.agentId;
    const runId = run.id;

    void (async () => {
      try {
        await run.wait();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('dev-mode agent run failed', e);
      } finally {
        try {
          await agent[Symbol.asyncDispose]();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('dev-mode agent dispose failed', e);
        }
      }
    })();

    return res.status(202).json({
      agentId,
      runId,
      status: 'running',
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return res.status(502).json({ error: message });
  }
}
