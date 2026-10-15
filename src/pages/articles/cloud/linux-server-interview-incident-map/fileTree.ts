import type { FileNode } from "@/components/code/types";

export const linuxLoadTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "include/linux/sched/loadavg.h", path: "linux/include/linux/sched/loadavg.h", type: "file", codeKey: "load-constants" },
      { name: "kernel/sched/loadavg.c", path: "linux/kernel/sched/loadavg.c", type: "file", codeKey: "global-load" },
      { name: "kernel/sched/core.c", path: "linux/kernel/sched/core.c", type: "file", codeKey: "contributes-to-load" },
      { name: "kernel/sched/sched.h", path: "linux/kernel/sched/sched.h", type: "file", codeKey: "uninterruptible-count" },
      { name: "include/linux/sched.h", path: "linux/include/linux/sched.h", type: "file", codeKey: "task-states" },
      { name: "fs/proc/loadavg.c", path: "linux/fs/proc/loadavg.c", type: "file", codeKey: "proc-loadavg" },
    ],
  },
};
