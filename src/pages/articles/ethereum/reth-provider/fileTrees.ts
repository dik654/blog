import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const rethProviderTree: FileNode = d('reth', [
  d('crates/storage/provider/src/providers/state', [
    f('latest.rs — StateProvider trait', 'reth/crates/storage/provider/src/providers/state/latest.rs', 'provider-trait'),
  ]),
  d('crates/revm/src/state', [
    f('bundle_state.rs — BundleState', 'reth/crates/revm/src/state/bundle_state.rs', 'bundle-state'),
  ]),
]);
