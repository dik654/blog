import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('reth-mev', [
    f('MevPayloadBuilder', 'reth-mev/src/builder.rs', 'mev-builder'),
    f('build_payload()', 'reth-mev/src/builder.rs', 'mev-build'),
  ]),
  d('reth-mev/flashbots', [
    f('register_validator()', 'reth-mev/src/flashbots.rs', 'relay-register'),
    f('get_header() — 입찰 요청', 'reth-mev/src/flashbots.rs', 'relay-get-header'),
    f('get_payload() — 블록 수신', 'reth-mev/src/flashbots.rs', 'relay-get-payload'),
  ]),
]);
