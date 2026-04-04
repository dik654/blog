export interface FileNode {
  name: string;
  type: 'dir' | 'file';
  path?: string;
  codeKey?: string;
  children?: FileNode[];
}

const f = (name: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const sp1Tree: FileNode = d('sp1/crates', [
  d('core/executor/src', [
    f('vm.rs', 'vm-struct'),
    f('opcode.rs', 'opcode-enum'),
    f('instruction.rs'),
    f('state.rs'),
    f('record.rs'),
    f('syscall_code.rs'),
  ]),
  d('prover/src', [
    f('lib.rs', 'prover-entry'),
    f('components.rs'),
    f('recursion.rs'),
    f('verify.rs'),
    f('shapes.rs'),
  ]),
  d('sdk/src', [
    f('lib.rs', 'sdk-entry'),
    f('prover.rs', 'sdk-prover'),
    f('client.rs'),
    d('cpu', [f('mod.rs', 'cpu-prover')]),
    d('env', [f('mod.rs')]),
  ]),
]);
