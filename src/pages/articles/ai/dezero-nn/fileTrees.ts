import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const dezeroTree: FileNode = d('dezero_rs', [
  d('src', [
    f('lib.rs — Model trait', 'src/lib.rs', 'model-trait'),
    f('lib.rs — Linear struct', 'src/lib.rs', 'linear-struct'),
    f('lib.rs — MatMulFn', 'src/lib.rs', 'matmul-fn'),
    f('lib.rs — sigmoid / tanh', 'src/lib.rs', 'activation-fn'),
    f('lib.rs — SGD optimizer', 'src/lib.rs', 'sgd'),
    f('lib.rs — Adam optimizer', 'src/lib.rs', 'adam'),
    f('lib.rs — MSE / CrossEntropy', 'src/lib.rs', 'loss-fn'),
  ]),
]);
