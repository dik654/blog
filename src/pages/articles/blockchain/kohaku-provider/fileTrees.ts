import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const kohakuTree: FileNode = d('kohaku', [
  d('src', [
    f('provider.rs', 'kohaku/src/provider.rs', 'kh-provider'),
    f('oram.rs', 'kohaku/src/oram.rs', 'kh-oram'),
    f('dandelion.rs', 'kohaku/src/dandelion.rs', 'kh-dandelion'),
  ]),
]);
