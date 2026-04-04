import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const zkevmTree: FileNode = d('zkevm-circuits/src', [
  f('evm_circuit.rs', 'zkevm-circuits/src/evm_circuit.rs', 'evm-config'),
  f('copy_circuit.rs', 'zkevm-circuits/src/copy_circuit.rs', 'copy-circuit'),
  d('evm_circuit', [
    f('execution.rs', 'zkevm-circuits/src/evm_circuit/execution.rs', 'execution-trait'),
    d('execution', [
      f('add_sub.rs', 'zkevm-circuits/src/evm_circuit/execution/add_sub.rs', 'add-sub-gadget'),
    ]),
  ]),
]);
