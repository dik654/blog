import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const gethTree: FileNode = d('p2p', [
  d('discover', [
    f('table.go', 'p2p/discover/table.go', 'geth-table-struct'),
    f('lookup.go', 'p2p/discover/lookup.go', 'geth-lookup-struct'),
    f('v4_udp.go', 'p2p/discover/v4_udp.go', 'geth-v4-udp'),
    d('v4wire', [
      f('v4wire.go', 'p2p/discover/v4wire/v4wire.go', 'geth-v4wire-packets'),
    ]),
  ]),
  d('enode', [
    f('node.go', 'p2p/enode/node.go', 'geth-node-struct'),
  ]),
]);
