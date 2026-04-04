import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const sealingFileTree: FileNode = d('sgx-sealing', [
  d('key-derivation', [
    f('sealing.c — EGETKEY + Key Tree', 'sgx/sealing.c', 'seal-key-derivation'),
  ]),
  d('seal-unseal', [
    f('sealing.c — sgx_seal_data + unseal', 'sgx/sealing.c', 'seal-unseal'),
  ]),
]);
