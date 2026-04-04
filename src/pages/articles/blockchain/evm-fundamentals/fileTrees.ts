import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const gethTree: FileNode = d('go-ethereum', [
  d('core', [
    f('state_transition.go — execute()', 'core/state_transition.go', 'st-execute'),
    f('state_transition.go — preCheck()', 'core/state_transition.go', 'st-precheck'),
    f('state_transition.go — IntrinsicGas()', 'core/state_transition.go', 'intrinsic-gas'),
  ]),
  d('core/state', [
    f('journal.go — Snapshot / Revert', 'core/state/journal.go', 'snapshot-revert'),
  ]),
  d('core/vm', [
    f('evm.go — EVM struct', 'core/vm/evm.go', 'evm-struct'),
    f('evm.go — Call()', 'core/vm/evm.go', 'evm-call'),
    f('evm.go — Transfer()', 'core/vm/evm.go', 'transfer'),
    f('contracts.go — RunPrecompiledContract()', 'core/vm/contracts.go', 'precompile-run'),
    f('contract.go — NewContract()', 'core/vm/contract.go', 'new-contract'),
    f('contract.go — Contract', 'core/vm/contract.go', 'contract'),
    f('interpreter.go — Run()', 'core/vm/interpreter.go', 'interp-run'),
    f('interpreter.go — ScopeContext', 'core/vm/interpreter.go', 'scope-context'),
    f('jump_table.go — operation', 'core/vm/jump_table.go', 'jump-table'),
    f('gas_table.go — memoryGasCost()', 'core/vm/gas_table.go', 'dynamic-gas'),
    f('instructions.go — opAdd()', 'core/vm/instructions.go', 'op-add'),
    f('instructions.go — opSload()', 'core/vm/instructions.go', 'op-sload'),
    f('instructions.go — opCall()', 'core/vm/instructions.go', 'op-call'),
    f('instructions.go — opCreate()', 'core/vm/instructions.go', 'op-create'),
    f('instructions.go — opSelfdestruct()', 'core/vm/instructions.go', 'op-selfdestruct'),
    f('instructions.go — opReturn()', 'core/vm/instructions.go', 'op-return'),
    f('evm.go — Create()', 'core/vm/evm.go', 'evm-create'),
    f('evm.go — Create2()', 'core/vm/evm.go', 'evm-create2'),
    f('evm.go — DelegateCall()', 'core/vm/evm.go', 'evm-delegatecall'),
    f('evm.go — StaticCall()', 'core/vm/evm.go', 'evm-staticcall'),
    f('stack.go — Stack', 'core/vm/stack.go', 'stack'),
    f('memory.go — Memory', 'core/vm/memory.go', 'memory'),
  ]),
]);
