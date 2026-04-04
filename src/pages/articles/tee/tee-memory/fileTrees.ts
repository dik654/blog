import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const teeMemoryTree: FileNode = d('tee/memory', [
  f('memory_isolation.c', 'tee/memory_isolation.c', 'sgx-epc'),
  d('sgx', [
    f('epc_manager.c', 'sgx/epc_manager.c', 'sgx-epc'),
    f('mee_engine.c', 'sgx/mee_engine.c'),
  ]),
  d('sev', [
    f('psp_commands.c', 'sev/psp_commands.c', 'sev-launch-update'),
    f('aes_xex.c', 'sev/aes_xex.c'),
  ]),
  d('tdx', [
    f('seamcall.c', 'tdx/seamcall.c', 'mktme-key'),
    f('mktme_config.c', 'tdx/mktme_config.c'),
  ]),
]);
