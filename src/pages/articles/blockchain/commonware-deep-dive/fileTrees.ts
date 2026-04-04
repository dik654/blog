import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const commonwareTree: FileNode = d('commonware', [
  d('runtime/src', [
    f('lib.rs — Runner trait', 'commonware/runtime/src/lib.rs — Runner trait', 'runner-trait'),
    f('lib.rs — Spawner trait', 'commonware/runtime/src/lib.rs — Spawner trait', 'spawner-trait'),
    f('lib.rs — Clock trait', 'commonware/runtime/src/lib.rs — Clock trait', 'clock-trait'),
    f('lib.rs — Network trait', 'commonware/runtime/src/lib.rs — Network trait', 'network-trait'),
    f('lib.rs — Storage trait', 'commonware/runtime/src/lib.rs — Storage trait', 'storage-trait'),
    f('lib.rs — Metrics trait', 'commonware/runtime/src/lib.rs — Metrics trait', 'metrics-trait'),
  ]),
  d('examples/bridge/src/bin', [
    f('validator.rs — main()', 'commonware/examples/bridge/src/bin/validator.rs — main()', 'bridge-main'),
  ]),
]);

export const fileTrees: Record<string, FileNode> = {
  commonware: commonwareTree,
};
