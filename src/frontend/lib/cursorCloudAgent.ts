// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { Agent } from '@cursor/february';
import type { Run, SDKAgent } from '@cursor/february';

const REPO = 'https://github.com/aninamu/opentelemetry-demo';
const REF = 'main';

export type CreateAgentSuccess =
  | { mode: 'sdk'; agent: SDKAgent; run: Run }
  | { mode: 'rest'; agentId: string };

/**
 * Create a cloud agent with auto-PR. Tries the February SDK first; on failure uses REST.
 */
export async function createCloudAgentWithPr(prompt: string, apiKey: string): Promise<CreateAgentSuccess> {
  try {
    const agent = Agent.create({
      apiKey,
      model: { id: 'composer-2' },
      cloud: {
        repos: [{ url: REPO, startingRef: REF }],
        autoCreatePR: true,
      },
    });
    const run = await agent.send(prompt);
    return { mode: 'sdk', agent, run };
  } catch {
    const agentId = await createAgentRest(prompt, apiKey);
    return { mode: 'rest', agentId };
  }
}

/** REST: POST /v0/agents */
export async function createAgentRest(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.cursor.com/v0/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: { text: prompt },
      source: { repository: REPO, ref: REF },
      target: { autoCreatePr: true },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Cursor API error ${res.status}`);
  }
  const data = (await res.json()) as { id?: string };
  if (!data.id) {
    throw new Error('Unexpected Cursor API response: missing id');
  }
  return data.id;
}

export async function getAgentStatusRest(agentId: string, apiKey: string) {
  const res = await fetch(`https://api.cursor.com/v0/agents/${encodeURIComponent(agentId)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(t || `Cursor API error ${res.status}`);
  }
  return (await res.json()) as {
    id?: string;
    status?: string;
    name?: string;
    summary?: string;
    target?: { prUrl?: string; url?: string; branchName?: string };
  };
}
