import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const joltTree: FileNode = d('jolt/src', [
  d('zkvm', [
    f('prover.rs', 'jolt/src/zkvm/prover.rs', 'jolt-prover'),
    f('proof_serialization.rs', 'jolt/src/zkvm/proof_serialization.rs', 'jolt-proof'),
    d('instruction', [
      f('mod.rs', 'jolt/src/zkvm/instruction/mod.rs', 'jolt-instruction'),
    ]),
  ]),
  d('subprotocols', [
    f('sumcheck.rs', 'jolt/src/subprotocols/sumcheck.rs', 'jolt-sumcheck'),
  ]),
]);
