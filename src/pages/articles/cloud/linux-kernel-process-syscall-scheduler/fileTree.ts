import type { FileNode } from "@/components/code/types";

export const linuxKernelProcessTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "arch/x86/entry/entry_64.S", path: "linux/arch/x86/entry/entry_64.S", type: "file", codeKey: "syscall-entry" },
      { name: "Documentation/arch/x86/entry_64.rst", path: "linux/Documentation/arch/x86/entry_64.rst", type: "file", codeKey: "entry-doc" },
      { name: "kernel/fork.c", path: "linux/kernel/fork.c", type: "file", codeKey: "copy-mm" },
      { name: "include/uapi/linux/sched.h", path: "linux/include/uapi/linux/sched.h", type: "file", codeKey: "clone-flags" },
      { name: "include/linux/sched.h", path: "linux/include/linux/sched.h", type: "file", codeKey: "task-states" },
      { name: "fs/proc/array.c", path: "linux/fs/proc/array.c", type: "file", codeKey: "state-letters" },
      { name: "Documentation/filesystems/proc.rst", path: "linux/Documentation/filesystems/proc.rst", type: "file", codeKey: "proc-stat-doc" },
      { name: "kernel/sched/core.c", path: "linux/kernel/sched/core.c", type: "file", codeKey: "weight-table" },
      { name: "kernel/sched/fair.c", path: "linux/kernel/sched/fair.c", type: "file", codeKey: "pick-eevdf" },
      { name: "Documentation/scheduler/sched-eevdf.rst", path: "linux/Documentation/scheduler/sched-eevdf.rst", type: "file", codeKey: "eevdf-doc" },
      { name: "Documentation/scheduler/sched-nice-design.rst", path: "linux/Documentation/scheduler/sched-nice-design.rst", type: "file", codeKey: "nice-design-doc" },
    ],
  },
  "man-pages": {
    name: "man-pages",
    type: "dir",
    children: [
      { name: "man2/syscalls.2", path: "man-pages/man2/syscalls.2", type: "file", codeKey: "syscalls-man" },
      { name: "man2/clone.2", path: "man-pages/man2/clone.2", type: "file", codeKey: "clone-man" },
      { name: "man7/sched.7", path: "man-pages/man7/sched.7", type: "file", codeKey: "sched-man-nice" },
    ],
  },
  strace: {
    name: "strace",
    type: "dir",
    children: [{ name: "doc/strace.1.in", path: "strace/doc/strace.1.in", type: "file", codeKey: "strace-options" }],
  },
};
