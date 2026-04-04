import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftCryptoTree: FileNode = d('cometbft', [
  d('crypto', [
    d('ed25519', [
      f('ed25519.go — Sign · Verify · Address', 'crypto/ed25519/ed25519.go', 'ed25519-sign'),
    ]),
    d('merkle', [
      f('proof.go — Proof · HashFromByteSlices', 'crypto/merkle/proof.go', 'merkle-hash'),
    ]),
    d('tmhash', [
      f('tmhash.go — Sum · SumTruncated', 'crypto/tmhash/tmhash.go', 'tmhash-sum'),
    ]),
  ]),
]);
