import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const bellpersonTree: FileNode = d('bellperson/src', [
  d('gpu', [
    f('multiexp.rs', 'bellperson/src/gpu/multiexp.rs', 'bp-gpu-multiexp'),
  ]),
  d('groth16', [
    f('proof.rs', 'bellperson/src/groth16/proof.rs', 'bp-proof'),
    f('verifier.rs', 'bellperson/src/groth16/verifier.rs', 'bp-verifier'),
    f('generator.rs', 'bellperson/src/groth16/generator.rs', 'bp-generator'),
    d('prover', [
      f('native.rs', 'bellperson/src/groth16/prover/native.rs', 'bp-groth16-prover'),
    ]),
  ]),
]);
