import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cosmosEvmTree: FileNode = d('cosmos-evm', [
  d('x/vm/keeper', [
    f('keeper.go', 'cosmos-evm/x/vm/keeper/keeper.go', 'ev-keeper'),
  ]),
  d('x/feemarket/keeper', [
    f('keeper.go', 'cosmos-evm/x/feemarket/keeper/keeper.go', 'ev-feemarket'),
  ]),
  d('x/erc20', [
    f('ibc_middleware.go', 'cosmos-evm/x/erc20/ibc_middleware.go', 'ev-erc20-middleware'),
    f('token_pair.go', 'cosmos-evm/x/erc20/types/token_pair.go', 'ev-token-pair'),
  ]),
]);
