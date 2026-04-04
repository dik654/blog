import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const tssLibTree: FileNode = d('tss-lib', [
  d('crypto', [
    d('paillier', [
      f('paillier.go', 'tss-lib/crypto/paillier/paillier.go', 'paillier-keygen'),
    ]),
    d('vss', [
      f('feldman_vss.go', 'tss-lib/crypto/vss/feldman_vss.go', 'vss-create'),
    ]),
    d('mta', [
      f('share_protocol.go', 'tss-lib/crypto/mta/share_protocol.go', 'mta-protocol'),
    ]),
  ]),
  d('ecdsa', [
    d('keygen', [
      f('round_1.go', 'tss-lib/ecdsa/keygen/round_1.go', 'keygen-round1'),
    ]),
    d('signing', [
      f('round_1.go', 'tss-lib/ecdsa/signing/round_1.go', 'signing-round1'),
    ]),
  ]),
]);
