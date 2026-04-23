// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createCloudAgentForQuestion,
  createCloudAgentWithPr,
  getAgentStatusRest,
} from '../../../lib/cursorCloudAgent';

const REPO_SLUG = 'aninamu/opentelemetry-demo';
const DEFAULT_REF = 'main';

type PostBody = {
  action?: 'ask' | 'open-pr';
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

function buildPrompt(userPrompt: string, body: PostBody, action: 'ask' | 'open-pr'): string {
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
  if (action === 'ask') {
    parts.push(
      '',
      'Task mode: question answering.',
      'Answer the user question concisely using this repository context.',
      'Do not make code changes and do not open a pull request.',
      'Return a direct answer in plain text.'
    );
  } else {
    parts.push('', 'When done, open a pull request on GitHub for the changes.');
  }
  return parts.join('\n');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const requestBodyAction =
    typeof req.body === 'object' && req.body && 'action' in req.body
      ? String((req.body as { action?: string }).action ?? '')
      : null;
  // #region agent log
  fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d6013'},body:JSON.stringify({sessionId:'1d6013',runId:'initial',hypothesisId:'H1,H3,H4',location:'pages/api/dev-mode/agent.ts:handler:entry',message:'dev-mode agent handler entry',data:{method:req.method,url:req.url,nodeEnv:process.env.NODE_ENV,nextRuntime:process.env.NEXT_RUNTIME ?? null,pid:process.pid,pwd:process.cwd(),requestBodyAction},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const apiKey = process.env.CURSOR_API_KEY;
  const apiKeyTrimmedLength = apiKey?.trim().length ?? 0;
  // #region agent log
  fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d6013'},body:JSON.stringify({sessionId:'1d6013',runId:'initial',hypothesisId:'H1,H2,H4',location:'pages/api/dev-mode/agent.ts:handler:api-key-check',message:'inspected CURSOR_API_KEY in API route',data:{apiKeyPresent:Boolean(apiKey),apiKeyLength:apiKey?.length ?? 0,apiKeyTrimmedLength,pid:process.pid,pwd:process.cwd(),nodeEnv:process.env.NODE_ENV},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (!apiKey) {
    // #region agent log
    fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d6013'},body:JSON.stringify({sessionId:'1d6013',runId:'initial',hypothesisId:'H1,H4',location:'pages/api/dev-mode/agent.ts:handler:api-key-missing-return',message:'returning CURSOR_API_KEY missing error',data:{apiKeyValueType:typeof process.env.CURSOR_API_KEY,nodeEnv:process.env.NODE_ENV,nextRuntime:process.env.NEXT_RUNTIME ?? null,pid:process.pid,pwd:process.cwd(),requestBodyAction},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return res.status(500).json({ error: 'CURSOR_API_KEY is not configured on the server' });
  }

  if (req.method === 'GET') {
    // #region agent log
    fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2af4a7'},body:JSON.stringify({sessionId:'2af4a7',runId:'initial',hypothesisId:'H5',location:'pages/api/dev-mode/agent.ts:56',message:'handling GET status poll',data:{queryId:req.query?.id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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

  const action = body.action === 'ask' ? 'ask' : 'open-pr';
  const composed = buildPrompt(body.prompt, body, action);

  try {
    // #region agent log
    fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d6013'},body:JSON.stringify({sessionId:'1d6013',runId:'initial',hypothesisId:'H3',location:'pages/api/dev-mode/agent.ts:handler:before-create-agent',message:'starting cloud agent creation for dev mode request',data:{action,promptLength:composed.length,apiKeyLength:apiKey.length,apiKeyTrimmedLength,pid:process.pid},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const result =
      action === 'ask'
        ? await createCloudAgentForQuestion(composed, apiKey)
        : await createCloudAgentWithPr(composed, apiKey);

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
    // #region agent log
    fetch('http://127.0.0.1:7285/ingest/50f01c19-3880-4e53-af06-7d52d46f47d7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1d6013'},body:JSON.stringify({sessionId:'1d6013',runId:'initial',hypothesisId:'H3',location:'pages/api/dev-mode/agent.ts:handler:catch',message:'cloud agent creation failed in API handler',data:{action,errorMessage:message,pid:process.pid},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return res.status(502).json({ error: message });
  }
}
