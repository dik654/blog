import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const openclawTree: FileNode = d('openclaw/src', [
  d('agents', [
    f('pi-embedded-runner.ts', 'openclaw/src/agents/pi-embedded-runner.ts', 'oc-embedded-runner'),
    f('model-auth.ts', 'openclaw/src/agents/model-auth.ts', 'oc-model-auth'),
  ]),
  d('channels', [
    f('channel-router.ts', 'openclaw/src/channels/channel-router.ts', 'oc-channel-router'),
  ]),
  d('skills', [
    f('skill-engine.ts', 'openclaw/src/skills/skill-engine.ts', 'oc-skill-engine'),
  ]),
  d('sandbox', [
    f('sandbox-manager.ts', 'openclaw/src/sandbox/sandbox-manager.ts', 'oc-sandbox'),
  ]),
]);
