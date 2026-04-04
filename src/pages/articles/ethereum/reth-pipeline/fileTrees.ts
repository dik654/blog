import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethPipelineTree: FileNode = d('reth', [
  d('crates/stages', [
    d('api/src/pipeline', [
      f('mod.rs — Pipeline::run()', 'crates/stages/api/src/pipeline/mod.rs', 'pipeline-run'),
    ]),
    d('stages/src/stages', [
      f('headers.rs — HeadersStage', 'crates/stages/stages/src/stages/headers.rs', 'headers-stage'),
      f('bodies.rs — BodiesStage', 'crates/stages/stages/src/stages/bodies.rs', 'bodies-stage'),
      f('senders.rs — SendersStage', 'crates/stages/stages/src/stages/senders.rs', 'senders-stage'),
      f('execution.rs — ExecutionStage', 'crates/stages/stages/src/stages/execution.rs', 'execution-stage'),
      f('merkle.rs — MerkleStage', 'crates/stages/stages/src/stages/merkle.rs', 'merkle-stage'),
    ]),
  ]),
]);
