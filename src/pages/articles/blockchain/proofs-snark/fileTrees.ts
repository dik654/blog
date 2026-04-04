import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const snarkTree: FileNode = d('bellperson', [
  d('src/groth16/prover', [
    f('native.rs — Groth16 증명 생성', 'src/groth16/prover/native.rs', 'snark-prover'),
  ]),
]);
