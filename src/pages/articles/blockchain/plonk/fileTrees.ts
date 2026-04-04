import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const plonkTree: FileNode = d('jellyfish/primitives/src/pcs', [
  d('univariate_kzg', [
    f('srs.rs', 'jellyfish/primitives/src/pcs/univariate_kzg/srs.rs', 'kzg-srs'),
    f('mod.rs', 'jellyfish/primitives/src/pcs/univariate_kzg/mod.rs', 'kzg-commit'),
    f('verify.rs', 'jellyfish/primitives/src/pcs/univariate_kzg/verify.rs', 'kzg-verify'),
  ]),
]);

export const zkGarageTree: FileNode = d('plonk/src/proof_system', [
  d('widget', [
    f('arithmetic.rs', 'ZK-Garage/plonk/src/proof_system/widget/arithmetic.rs', 'plonk-gate'),
  ]),
  f('permutation.rs', 'ZK-Garage/plonk/src/proof_system/permutation.rs', 'plonk-copy'),
  f('prover.rs', 'ZK-Garage/plonk/src/proof_system/prover.rs', 'plonk-round1-3'),
  f('verifier.rs', 'ZK-Garage/plonk/src/proof_system/verifier.rs', 'plonk-verifier'),
]);
