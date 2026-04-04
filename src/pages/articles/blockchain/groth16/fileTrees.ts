import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const groth16Tree: FileNode = d('arkworks-rs/groth16/src', [
  f('generator.rs', 'arkworks-rs/groth16/src/generator.rs', 'groth16-keygen'),
  f('prover.rs', 'arkworks-rs/groth16/src/prover.rs', 'groth16-create-proof'),
  f('verifier.rs', 'arkworks-rs/groth16/src/verifier.rs', 'groth16-verify'),
  f('data_structures.rs', 'arkworks-rs/groth16/src/data_structures.rs', 'groth16-vk'),
  f('lib.rs', 'arkworks-rs/groth16/src/lib.rs'),
  f('r1cs_to_qap.rs', 'arkworks-rs/groth16/src/r1cs_to_qap.rs'),
]);
