import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('beacon-chain/p2p', [
    f('service.go — Start()', 'beacon-chain/p2p/service.go', 'p2p-start'),
    f('service.go — initDiscoveryV5()', 'beacon-chain/p2p/service.go', 'discv5-init'),
    d('peers/scorers', [
      f('service.go — Score()', 'beacon-chain/p2p/peers/scorers/service.go', 'peer-score'),
      f('service.go — Decay()', 'beacon-chain/p2p/peers/scorers/service.go', 'peer-decay'),
    ]),
  ]),
]);
