import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const gethTree: FileNode = d('go-ethereum', [
  d('p2p/discover', [
    f('table.go — addIP()', 'go-ethereum/p2p/discover/table.go', 'add-ip'),
    f('table.go — addFoundNode()', 'go-ethereum/p2p/discover/table.go', 'add-found-node'),
    d('netutil', [
      f('net.go — DistinctNetSet', 'go-ethereum/p2p/discover/netutil/net.go', 'distinct-net-set'),
    ]),
  ]),
]);
