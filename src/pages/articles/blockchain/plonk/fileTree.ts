export interface FileNode {
  name: string;
  type: 'dir' | 'file';
  codeKey?: string;
  children?: FileNode[];
}

const f = (name: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const plonkTree: FileNode = d('jellyfish/primitives/src/pcs', [
  d('univariate_kzg', [
    f('srs.rs', 'kzg-srs'),
    f('mod.rs', 'kzg-commit'),
    f('verify.rs', 'kzg-verify'),
  ]),
]);

export const zkGarageTree: FileNode = d('plonk/src/proof_system', [
  d('widget', [
    f('arithmetic.rs', 'plonk-gate'),
  ]),
  f('permutation.rs', 'plonk-copy'),
  f('prover.rs', 'plonk-round1-3'),
  f('verifier.rs', 'plonk-verifier'),
]);
