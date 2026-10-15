import type { FileNode } from "@/components/code/types";

export const diskFullTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "fs/namei.c", path: "linux/fs/namei.c", type: "file", codeKey: "unlinkat" },
      { name: "include/linux/fsnotify.h", path: "linux/include/linux/fsnotify.h", type: "file", codeKey: "d-delete-notify" },
      { name: "fs/dcache.c", path: "linux/fs/dcache.c", type: "file", codeKey: "d-delete" },
      { name: "fs/file_table.c", path: "linux/fs/file_table.c", type: "file", codeKey: "fput" },
      { name: "fs/inode.c", path: "linux/fs/inode.c", type: "file", codeKey: "iput-final" },
      { name: "include/linux/fs.h", path: "linux/include/linux/fs.h", type: "file", codeKey: "drop-inode" },
      { name: "fs/ext4/namei.c", path: "linux/fs/ext4/namei.c", type: "file", codeKey: "ext4-unlink" },
      { name: "fs/ext4/super.c", path: "linux/fs/ext4/super.c", type: "file", codeKey: "ext4-statfs" },
      { name: "fs/ext4/balloc.c", path: "linux/fs/ext4/balloc.c", type: "file", codeKey: "root-reserve" },
      { name: "fs/ext4/ialloc.c", path: "linux/fs/ext4/ialloc.c", type: "file", codeKey: "inode-enospc" },
    ],
  },
  coreutils: {
    name: "coreutils",
    type: "dir",
    children: [{ name: "src/df.c", path: "coreutils/src/df.c", type: "file", codeKey: "df-fields" }],
  },
};
