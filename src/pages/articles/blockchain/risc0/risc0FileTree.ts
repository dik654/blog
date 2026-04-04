import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const risc0Tree: FileNode = d('risc0/zkvm/src', [
  d('host', [
    d('server', [
      d('prove', [
        f('prover_impl.rs', 'risc0/zkvm/src/host/server/prove/prover_impl.rs', 'prover-prove'),
        f('mod.rs',          'risc0/zkvm/src/host/server/prove/mod.rs'),
        f('keccak.rs',       'risc0/zkvm/src/host/server/prove/keccak.rs'),
        f('dev_mode.rs',     'risc0/zkvm/src/host/server/prove/dev_mode.rs'),
      ]),
      d('exec', [
        f('executor.rs',  'risc0/zkvm/src/host/server/exec/executor.rs'),
        f('mod.rs',        'risc0/zkvm/src/host/server/exec/mod.rs'),
      ]),
      f('session.rs', 'risc0/zkvm/src/host/server/session.rs', 'session-struct'),
      f('mod.rs',     'risc0/zkvm/src/host/server/mod.rs'),
    ]),
    d('recursion', [
      d('prove', [
        f('mod.rs', 'risc0/zkvm/src/host/recursion/prove/mod.rs', 'recursion-lift'),
        f('zkr.rs', 'risc0/zkvm/src/host/recursion/prove/zkr.rs'),
      ]),
      f('mod.rs', 'risc0/zkvm/src/host/recursion/mod.rs'),
    ]),
    d('client', [
      d('prove', [
        f('local.rs', 'risc0/zkvm/src/host/client/prove/local.rs'),
        f('mod.rs',   'risc0/zkvm/src/host/client/prove/mod.rs'),
        f('opts.rs',  'risc0/zkvm/src/host/client/prove/opts.rs'),
      ]),
      f('env.rs', 'risc0/zkvm/src/host/client/env.rs'),
    ]),
  ]),
]);
