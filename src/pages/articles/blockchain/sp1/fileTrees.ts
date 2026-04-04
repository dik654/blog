import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const sp1FileTree: FileNode = d('sp1/crates', [
  d('core/executor/src', [
    f('vm.rs', 'sp1/crates/core/executor/src/vm.rs', 'vm-struct'),
    f('opcode.rs', 'sp1/crates/core/executor/src/opcode.rs', 'opcode-enum'),
    f('instruction.rs', 'sp1/crates/core/executor/src/instruction.rs'),
    f('state.rs', 'sp1/crates/core/executor/src/state.rs'),
    f('record.rs', 'sp1/crates/core/executor/src/record.rs'),
    f('syscall_code.rs', 'sp1/crates/core/executor/src/syscall_code.rs'),
  ]),
  d('prover/src', [
    f('lib.rs', 'sp1/crates/prover/src/lib.rs', 'prover-entry'),
    f('components.rs', 'sp1/crates/prover/src/components.rs'),
    f('recursion.rs', 'sp1/crates/prover/src/recursion.rs'),
    f('verify.rs', 'sp1/crates/prover/src/verify.rs'),
    f('shapes.rs', 'sp1/crates/prover/src/shapes.rs'),
  ]),
  d('sdk/src', [
    f('lib.rs', 'sp1/crates/sdk/src/lib.rs', 'sdk-entry'),
    f('prover.rs', 'sp1/crates/sdk/src/prover.rs', 'sdk-prover'),
    f('client.rs', 'sp1/crates/sdk/src/client.rs'),
    d('cpu', [f('mod.rs', 'sp1/crates/sdk/src/cpu/mod.rs', 'cpu-prover')]),
    d('env', [f('mod.rs', 'sp1/crates/sdk/src/env/mod.rs')]),
  ]),
]);
