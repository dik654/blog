import type { FileNode } from '@/components/code/types';

export const railgunTree: FileNode[] = [
  {
    name: 'contracts', type: 'dir', children: [
      { name: 'RailgunSmartWallet.sol', type: 'file', codeKey: 'rg-shield' },
      { name: 'Commitment.sol', type: 'file', codeKey: 'rg-commitment' },
      { name: 'Verifier.sol', type: 'file', codeKey: 'rg-verifier' },
    ],
  },
];
