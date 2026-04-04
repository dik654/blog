import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const dydxTree: FileNode = d('dydx-v4', [
  d('protocol/x/clob/memclob', [
    f('memclob.go', 'protocol/x/clob/memclob/memclob.go', 'dx-memclob'),
    f('match_order.go', 'protocol/x/clob/memclob/match_order.go', 'dx-match-order'),
    f('taker_match.go', 'protocol/x/clob/memclob/taker_match.go', 'dx-taker-match'),
  ]),
  d('protocol/app', [
    f('app.go', 'protocol/app/app.go', 'dx-module-lifecycle'),
  ]),
  d('indexer/services', [
    f('ender.ts', 'indexer/services/ender/ender.ts', 'dx-indexer-ender'),
    f('api.ts', 'indexer/services/comlink/api.ts', 'dx-api'),
  ]),
]);
