import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const dezeroAdvTree: FileNode = d('dezero_rs', [
  d('src', [
    f('lib.rs — RNN struct', 'src/lib.rs', 'rnn-struct'),
    f('lib.rs — LSTM struct', 'src/lib.rs', 'lstm-struct'),
    f('lib.rs — LSTM forward', 'src/lib.rs', 'lstm-forward'),
    f('lib.rs — LayerNormFn', 'src/lib.rs', 'layer-norm-fn'),
    f('lib.rs — LayerNorm struct', 'src/lib.rs', 'layer-norm-struct'),
    f('lib.rs — DropoutFn', 'src/lib.rs', 'dropout-fn'),
    f('lib.rs — Embedding', 'src/lib.rs', 'embedding-struct'),
    f('lib.rs — EmbeddingFn', 'src/lib.rs', 'embedding-fn'),
    f('lib.rs — test_mode guard', 'src/lib.rs', 'test-mode'),
  ]),
]);
