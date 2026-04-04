import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const sevTree: FileNode = d('linux/arch/x86', [
  d('include/asm', [
    f('sev-common.h', 'linux/arch/x86/include/asm/sev-common.h', 'rmp-entry'),
    f('sev.h', 'linux/arch/x86/include/asm/sev.h', 'vmpl-perms'),
  ]),
  d('kernel', [
    f('sev.c', 'linux/arch/x86/kernel/sev.c', 'pvalidate'),
  ]),
  d('../../drivers/virt/coco/sev-guest', [
    f('sev-guest.h', 'linux/drivers/virt/coco/sev-guest/sev-guest.h', 'attest-report'),
    f('sev-guest.c', 'linux/drivers/virt/coco/sev-guest/sev-guest.c', 'guest-request'),
  ]),
]);
