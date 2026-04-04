import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const pdpTree: FileNode = d('curio', [
  d('pdp', [
    f('pdp.go — PDP 증명 생성 & 검증', 'pdp/pdp.go', 'pdp-main'),
  ]),
]);
