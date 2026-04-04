import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const halo2Tree: FileNode = d('halo2_proofs/src', [
  f('circuit.rs', 'halo2_proofs/src/circuit.rs', 'circuit-trait'),
  f('plonk.rs', 'halo2_proofs/src/plonk.rs', 'plonk-mod'),
  d('plonk', [
    f('keygen.rs', 'halo2_proofs/src/plonk/keygen.rs', 'keygen-vk'),
    f('prover.rs', 'halo2_proofs/src/plonk/prover.rs', 'create-proof'),
    f('verifier.rs', 'halo2_proofs/src/plonk/verifier.rs', 'verify-proof'),
    d('permutation', [
      f('keygen.rs', 'halo2_proofs/src/plonk/permutation/keygen.rs'),
      f('prover.rs', 'halo2_proofs/src/plonk/permutation/prover.rs'),
      f('verifier.rs', 'halo2_proofs/src/plonk/permutation/verifier.rs'),
    ]),
    d('lookup', [
      f('prover.rs', 'halo2_proofs/src/plonk/lookup/prover.rs'),
      f('verifier.rs', 'halo2_proofs/src/plonk/lookup/verifier.rs'),
    ]),
    d('vanishing', [
      f('prover.rs', 'halo2_proofs/src/plonk/vanishing/prover.rs'),
      f('verifier.rs', 'halo2_proofs/src/plonk/vanishing/verifier.rs'),
    ]),
  ]),
]);
