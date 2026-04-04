import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const oasisCoreTree: FileNode = d('oasis-core', [
  d('go', [
    d('consensus/cometbft', [
      d('abci', [
        f('mux.go', 'oasis-core/go/consensus/cometbft/abci/mux.go', 'abci-mux'),
      ]),
      d('full', [
        f('full.go', 'oasis-core/go/consensus/cometbft/full/full.go', 'full-service'),
      ]),
    ]),
    d('keymanager/secrets', [
      f('api.go', 'oasis-core/go/keymanager/secrets/api.go', 'km-secrets-api'),
    ]),
    d('worker/compute/executor', [
      f('worker.go', 'oasis-core/go/worker/compute/executor/worker.go', 'executor-worker'),
    ]),
  ]),
  d('runtime/src', [
    f('dispatcher.rs', 'oasis-core/runtime/src/dispatcher.rs', 'dispatcher'),
  ]),
]);
