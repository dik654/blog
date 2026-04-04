import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const omniTree: FileNode = d('omni', [
  d('octane/evmengine', [
    f('abci.go', 'omni/octane/evmengine/abci.go', 'octane-abci'),
    f('enginecl.go', 'omni/octane/evmengine/enginecl.go', 'octane-enginecl'),
  ]),
  d('halo/attest', [
    f('keeper.go', 'omni/halo/attest/keeper.go', 'octane-xmsg'),
  ]),
  d('halo/valsync', [
    f('keeper.go', 'omni/halo/valsync/keeper.go', 'octane-dual-staking'),
  ]),
]);
