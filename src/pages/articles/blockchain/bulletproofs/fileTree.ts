import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const bulletproofsTree: FileNode = d('bulletproofs/src', [
  f('generators.rs', 'bulletproofs/src/generators.rs', 'pedersen-gens'),
  f('inner_product_proof.rs', 'bulletproofs/src/inner_product_proof.rs', 'ipa-create'),
  d('range_proof', [
    f('mod.rs', 'bulletproofs/src/range_proof/mod.rs', 'range-proof-struct'),
    f('dealer.rs', 'bulletproofs/src/range_proof/dealer.rs', 'dealer'),
    f('party.rs', 'bulletproofs/src/range_proof/party.rs', 'party'),
  ]),
]);
