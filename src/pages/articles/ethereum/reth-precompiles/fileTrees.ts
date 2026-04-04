import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('revm/precompile', [
    f('Precompile enum', 'revm/precompile/src/lib.rs', 'precompile-enum'),
    f('cancun() 레지스트리', 'revm/precompile/src/lib.rs', 'cancun-registry'),
    f('call() 디스패치', 'revm/precompile/src/lib.rs', 'precompile-dispatch'),
  ]),
  d('revm/precompile/bn128', [
    f('bn128_add (0x06)', 'revm/precompile/src/bn128.rs', 'bn128-add'),
    f('bn128_pairing (0x08)', 'revm/precompile/src/bn128.rs', 'bn128-pairing'),
  ]),
]);
