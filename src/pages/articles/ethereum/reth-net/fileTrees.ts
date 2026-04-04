import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethNetTree: FileNode = d('reth', [
  d('crates/net/network/src/session', [
    f('mod.rs — SessionManager', 'reth/crates/net/network/src/session/mod.rs', 'net-session'),
  ]),
  d('crates/net/eth-wire-types/src', [
    f('message.rs — EthMessage', 'reth/crates/net/eth-wire-types/src/message.rs', 'net-eth-wire'),
  ]),
  d('crates/net/discv4/src', [
    f('lib.rs — Discv4', 'reth/crates/net/discv4/src/lib.rs', 'net-discovery'),
  ]),
]);
