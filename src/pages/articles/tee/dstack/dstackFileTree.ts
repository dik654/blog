import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const dstackTree: FileNode = d('dstack', [
  d('vmm/src', [
    f('td_vm.rs', 'dstack/vmm/src/td_vm.rs', 'td-create'),
    f('main_service.rs', 'dstack/vmm/src/main_service.rs', 'manifest-flow'),
    f('app.rs', 'dstack/vmm/src/app.rs'),
  ]),
  d('guest-agent/src', [
    f('rpc_service.rs', 'dstack/guest-agent/src/rpc_service.rs', 'tdx-quote-gen'),
    f('main.rs', 'dstack/guest-agent/src/main.rs'),
  ]),
  d('kms/src', [
    f('crypto.rs', 'dstack/kms/src/crypto.rs', 'key-derive'),
    f('verify.rs', 'dstack/kms/src/verify.rs', 'tdx-verify'),
    f('main_service.rs', 'dstack/kms/src/main_service.rs'),
  ]),
  d('ra-tls/src', [
    f('cert.rs', 'dstack/ra-tls/src/cert.rs', 'ra-tls'),
    f('lib.rs', 'dstack/ra-tls/src/lib.rs'),
  ]),
]);
