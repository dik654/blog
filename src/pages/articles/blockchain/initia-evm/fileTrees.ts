import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const minievm: FileNode = d('minievm', [
  d('x/evm', [
    d('keeper', [
      f('keeper.go', 'minievm/x/evm/keeper/keeper.go', 'mini-keeper'),
      f('msg_server.go', 'minievm/x/evm/keeper/msg_server.go', 'mini-msg-server'),
      f('context.go', 'minievm/x/evm/keeper/context.go', 'mini-create-evm'),
      f('context_utils.go', 'minievm/x/evm/keeper/context_utils.go'),
      f('precompiles.go', 'minievm/x/evm/keeper/precompiles.go', 'mini-precompile-reg'),
    ]),
    d('state', [
      f('statedb.go', 'minievm/x/evm/state/statedb.go', 'mini-statedb'),
      f('snapshot.go', 'minievm/x/evm/state/snapshot.go'),
    ]),
    d('types', [
      f('dispatch.go', 'minievm/x/evm/types/dispatch.go'),
    ]),
    d('precompiles/cosmos', [
      f('contract.go', 'minievm/x/evm/precompiles/cosmos/contract.go', 'mini-precompile'),
      f('types.go', 'minievm/x/evm/precompiles/cosmos/types.go'),
    ]),
  ]),
]);
