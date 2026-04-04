import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const plonky3Tree: FileNode = d('plonky3', [
  d('baby-bear/src', [
    f('baby_bear.rs', 'plonky3/baby-bear/src/baby_bear.rs', 'p3-babybear'),
  ]),
  d('fri/src', [
    f('two_adic_pcs.rs', 'plonky3/fri/src/two_adic_pcs.rs', 'p3-fri-pcs'),
  ]),
  d('poseidon2/src', [
    f('lib.rs', 'plonky3/poseidon2/src/lib.rs', 'p3-poseidon2'),
  ]),
  d('keccak-air/src', [
    f('air.rs', 'plonky3/keccak-air/src/air.rs', 'p3-keccak-air'),
  ]),
  d('uni-stark/src', [
    f('config.rs', 'plonky3/uni-stark/src/config.rs', 'p3-stark-config'),
  ]),
]);
