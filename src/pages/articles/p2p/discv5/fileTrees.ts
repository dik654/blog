import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const gethTree: FileNode = d('go-ethereum/p2p/discover', [
  f('v5_udp.go', 'go-ethereum/p2p/discover/v5_udp.go', 'handle-unknown'),
  d('v5wire', [
    f('crypto.go', 'go-ethereum/p2p/discover/v5wire/crypto.go', 'ecdh'),
    f('encoding.go', 'go-ethereum/p2p/discover/v5wire/encoding.go'),
    f('msg.go', 'go-ethereum/p2p/discover/v5wire/msg.go'),
  ]),
]);
