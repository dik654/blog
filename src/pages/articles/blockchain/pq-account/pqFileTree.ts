import type { FileNode } from '@/components/code/types';

export const entryPointTree: FileNode = {
  name: 'erc4337', type: 'dir', children: [
    { name: 'EntryPoint.sol', type: 'file', children: [
      { name: 'handleOps()', type: 'file', codeKey: 'handle-ops' },
      { name: '_validatePrepayment()', type: 'file', codeKey: 'validate-prepayment' },
      { name: '_executeUserOp()', type: 'file', codeKey: 'execute-userop' },
    ]},
  ],
};

export const dilithiumTree: FileNode = {
  name: 'dilithium', type: 'dir', children: [
    { name: 'src', type: 'dir', children: [
      { name: 'keygen.rs', type: 'file', children: [
        { name: 'keygen()', type: 'file', codeKey: 'dilithium-keygen' },
      ]},
      { name: 'sign.rs', type: 'file', children: [
        { name: 'sign()', type: 'file', codeKey: 'dilithium-sign' },
      ]},
      { name: 'verify.rs', type: 'file', children: [
        { name: 'verify()', type: 'file', codeKey: 'dilithium-verify' },
      ]},
    ]},
  ],
};
