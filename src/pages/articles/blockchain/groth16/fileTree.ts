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

export const groth16Tree: FileNode = d('arkworks-rs/groth16/src', [
  f('generator.rs', 'groth16-keygen'),
  f('prover.rs', 'groth16-create-proof'),
  f('verifier.rs', 'groth16-verify'),
  f('data_structures.rs', 'groth16-vk'),
  f('lib.rs'),
  f('r1cs_to_qap.rs'),
]);
