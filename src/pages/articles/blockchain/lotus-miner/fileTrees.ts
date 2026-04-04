import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const minerTree: FileNode = d('lotus/storage', [
  d('pipeline', [f('states.go', 'lotus/storage/pipeline/states.go', 'sector-states')]),
  d('wdpost', [f('wdpost_run.go', 'lotus/storage/wdpost/wdpost_run.go', 'winning-post')]),
]);
