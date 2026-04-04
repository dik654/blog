import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const claudeCodeTree: FileNode = d('claude-code', [
  d('examples', [
    d('hooks', [
      f('bash_command_validator_example.py', 'claude-code/examples/hooks/bash_command_validator_example.py', 'hooks-0'),
    ]),
    d('settings', [
      f('settings-strict.json', 'claude-code/examples/settings/settings-strict.json', 'permissions-0'),
    ]),
  ]),
  d('plugins/hookify/core', [
    f('rule_engine.py', 'claude-code/plugins/hookify/core/rule_engine.py', 'hooks-1'),
    f('config_loader.py', 'claude-code/plugins/hookify/core/config_loader.py', 'hooks-2'),
  ]),
  d('scripts', [
    f('sweep.ts', 'claude-code/scripts/sweep.ts', 'agent-0'),
  ]),
]);
