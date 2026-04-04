import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkPlonkTree: FileNode = d('zk_from_scratch', [
  d('crates/primitives/src', [
    f('kzg.rs — KZG 다항식 commitment (SRS, commit, open, verify)', 'kzg.rs', 'kzg-srs'),
    d('plonk', [
      f('mod.rs — Domain + 코셋 상수 K1, K2', 'plonk/mod.rs', 'plonk-domain'),
      f('arithmetization.rs — PlonkGate + ConstraintSystem', 'plonk/arithmetization.rs', 'plonk-gate'),
      f('permutation.rs — copy constraints + grand product Z(x)', 'plonk/permutation.rs', 'perm-poly'),
      f('lookup.rs — Plookup sorted merge + grand product', 'plonk/lookup.rs', 'lookup-sort'),
      f('prover.rs — 5-round prover + verifier', 'plonk/prover.rs', 'prover-rounds'),
    ]),
  ]),
]);
