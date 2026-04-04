import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethTree: FileNode = d('reth', [
  d('crates/chainspec/src', [
    f('spec.rs — ChainSpec struct', 'crates/chainspec/src/spec.rs', 'chainspec-struct'),
    f('spec.rs — MAINNET static', 'crates/chainspec/src/spec.rs', 'mainnet-spec'),
    f('spec.rs — make_genesis_header', 'crates/chainspec/src/spec.rs', 'make-genesis'),
    f('api.rs — EthChainSpec trait', 'crates/chainspec/src/api.rs', 'eth-chainspec-trait'),
  ]),
  d('crates/ethereum-forks/src', [
    f('hardfork.rs — ForkCondition', 'crates/ethereum-forks/src/hardfork.rs', 'fork-condition'),
  ]),
]);
