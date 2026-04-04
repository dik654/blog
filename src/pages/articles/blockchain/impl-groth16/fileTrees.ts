import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkGroth16Tree: FileNode = d('zk_from_scratch', [
  d('crates/primitives/src', [
    f('r1cs.rs — Variable, LinearCombination, ConstraintSystem, Circuit', 'r1cs.rs', 'r1cs-types'),
    f('qap.rs — Polynomial, QAP, Lagrange 보간', 'qap.rs', 'qap-convert'),
    f('groth16.rs — setup, prove, verify', 'groth16.rs', 'groth16-setup'),
  ]),
]);
