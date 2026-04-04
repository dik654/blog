import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const ipcTree: FileNode = d('ipc', [
  d('gateway', [
    f('subnet.go — 서브넷 생성 & 체크포인팅', 'gateway/subnet.go', 'ipc-subnet'),
  ]),
]);
