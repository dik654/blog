import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const tcbFileTree: FileNode = d('sgx', [
  f('measurement.c — MRENCLAVE', 'sgx/measurement.c', 'mrenclave-measurement'),
  f('measurement.c — TPM PCR', 'sgx/measurement.c', 'tpm-pcr-extend'),
]);
