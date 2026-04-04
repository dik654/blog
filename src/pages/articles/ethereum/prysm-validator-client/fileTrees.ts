import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const prysmTree: FileNode = d('prysm', [
  d('validator/client', [
    f('validator.go — Run() + RolesAt()', 'validator/client/validator.go', 'validator-loop'),
    f('validator.go — RolesAt()', 'validator/client/validator.go', 'roles-at'),
    f('runner.go — RunClient()', 'validator/client/runner.go', 'run-client'),
  ]),
]);
