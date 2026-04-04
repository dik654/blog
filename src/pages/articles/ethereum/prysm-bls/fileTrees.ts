import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('crypto/bls/blst', [
    f('secret_key.go — Sign()', 'crypto/bls/blst/secret_key.go', 'bls-sign'),
    f('signature.go — Verify()', 'crypto/bls/blst/signature.go', 'bls-verify'),
    f('signature.go — FastAggregateVerify()', 'crypto/bls/blst/signature.go', 'bls-fast-agg-verify'),
    f('signature.go — AggregateVerify()', 'crypto/bls/blst/signature.go', 'bls-batch'),
  ]),
]);
