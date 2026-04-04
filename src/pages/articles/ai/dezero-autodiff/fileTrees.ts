import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const dezeroTree: FileNode = d('dezero_rs', [
  d('src', [
    f('lib.rs — Variable & VarInner', 'src/lib.rs', 'var-struct'),
    f('lib.rs — Function trait', 'src/lib.rs', 'function-trait'),
    f('lib.rs — Func::call()', 'src/lib.rs', 'func-call'),
    f('lib.rs — backward()', 'src/lib.rs', 'backward'),
    f('lib.rs — AddFn / MulFn', 'src/lib.rs', 'add-fn'),
    f('lib.rs — no_grad / thread_local', 'src/lib.rs', 'no-grad'),
  ]),
]);
