import type { FileNode } from "@/components/code/types";

export const linuxProcTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "kernel/fork.c", path: "linux/kernel/fork.c", type: "file", codeKey: "unkillable-mark" },
      { name: "kernel/signal.c", path: "linux/kernel/signal.c", type: "file", codeKey: "task-ignored" },
      { name: "kernel/exit.c", path: "linux/kernel/exit.c", type: "file", codeKey: "exit-notify" },
      { name: "kernel/pid.c", path: "linux/kernel/pid.c", type: "file", codeKey: "pid-max" },
      { name: "fs/file.c", path: "linux/fs/file.c", type: "file", codeKey: "alloc-fd" },
      { name: "fs/file_table.c", path: "linux/fs/file_table.c", type: "file", codeKey: "file-max" },
      { name: "include/linux/signal.h", path: "linux/include/linux/signal.h", type: "file", codeKey: "kernel-only-mask" },
      { name: "include/linux/threads.h", path: "linux/include/linux/threads.h", type: "file", codeKey: "pid-max-consts" },
      { name: "include/uapi/linux/fs.h", path: "linux/include/uapi/linux/fs.h", type: "file", codeKey: "nofile-defaults" },
    ],
  },
  tini: {
    name: "tini",
    type: "dir",
    children: [{ name: "src/tini.c", path: "tini/src/tini.c", type: "file", codeKey: "tini-mask" }],
  },
  runc: {
    name: "runc",
    type: "dir",
    children: [{ name: "libcontainer/utils/utils.go", path: "runc/libcontainer/utils/utils.go", type: "file", codeKey: "runc-exit" }],
  },
};
