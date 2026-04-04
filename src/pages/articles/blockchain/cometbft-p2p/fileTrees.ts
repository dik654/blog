import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftP2PTree: FileNode = d('cometbft', [
  d('p2p', [
    d('conn', [
      f('connection.go — MConnection · sendRoutine · recvRoutine', 'p2p/conn/connection.go', 'mconn-struct'),
    ]),
    f('switch.go — Switch · AddReactor · DialPeersAsync', 'p2p/switch.go', 'switch-struct'),
    f('peer.go — Peer · Send · TrySend', 'p2p/peer.go', 'peer-struct'),
  ]),
]);
