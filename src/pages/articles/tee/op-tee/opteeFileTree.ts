import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const opteeTree: FileNode = d('optee_os/core', [
  d('arch/arm/kernel', [
    f('thread_optee_smc.c',
      'optee_os/core/arch/arm/kernel/thread_optee_smc.c',
      'smc-fast-handler'),
    f('thread_optee_smc_a64.S',
      'optee_os/core/arch/arm/kernel/thread_optee_smc_a64.S',
      'smc-vector-table'),
    f('thread.c', 'optee_os/core/arch/arm/kernel/thread.c'),
    f('boot.c', 'optee_os/core/arch/arm/kernel/boot.c'),
  ]),
  d('tee', [
    f('entry_std.c',
      'optee_os/core/tee/entry_std.c',
      'entry-open-session'),
    f('tee_fs_key_manager.c',
      'optee_os/core/tee/tee_fs_key_manager.c',
      'key-init-manager'),
    f('tee_cryp_utl.c', 'optee_os/core/tee/tee_cryp_utl.c'),
    f('tee_rpmb_fs.c', 'optee_os/core/tee/tee_rpmb_fs.c'),
  ]),
]);
