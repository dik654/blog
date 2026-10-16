import type { FileNode } from "@/components/code/types";

export const linuxVfsWriteTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "Documentation/filesystems/vfs.rst", path: "linux/Documentation/filesystems/vfs.rst", type: "file", codeKey: "vfs-overview" },
      { name: "Documentation/filesystems/path-lookup.rst", path: "linux/Documentation/filesystems/path-lookup.rst", type: "file", codeKey: "dcache-lookup" },
      { name: "Documentation/filesystems/overlayfs.rst", path: "linux/Documentation/filesystems/overlayfs.rst", type: "file", codeKey: "overlay-copy-up" },
      { name: "Documentation/admin-guide/sysctl/vm.rst", path: "linux/Documentation/admin-guide/sysctl/vm.rst", type: "file", codeKey: "dirty-sysctl" },
      { name: "Documentation/admin-guide/ext4.rst", path: "linux/Documentation/admin-guide/ext4.rst", type: "file", codeKey: "ext4-data-modes" },
      { name: "fs/namespace.c", path: "linux/fs/namespace.c", type: "file", codeKey: "do-loopback" },
      { name: "mm/page-writeback.c", path: "linux/mm/page-writeback.c", type: "file", codeKey: "domain-dirty-limits" },
      { name: "fs/fs-writeback.c", path: "linux/fs/fs-writeback.c", type: "file", codeKey: "wb-periodic-flush" },
      { name: "fs/sync.c", path: "linux/fs/sync.c", type: "file", codeKey: "vfs-fsync" },
      { name: "fs/ext4/fsync.c", path: "linux/fs/ext4/fsync.c", type: "file", codeKey: "ext4-sync-file" },
    ],
  },
  "man-pages": {
    name: "man-pages",
    type: "dir",
    children: [
      { name: "man2/mount.2", path: "man-pages/man2/mount.2", type: "file", codeKey: "mount-bind-man" },
      { name: "man7/mount_namespaces.7", path: "man-pages/man7/mount_namespaces.7", type: "file", codeKey: "mount-propagation-man" },
      { name: "man2/fsync.2", path: "man-pages/man2/fsync.2", type: "file", codeKey: "fsync-man" },
    ],
  },
  sysstat: {
    name: "sysstat",
    type: "dir",
    children: [{ name: "man/iostat.in", path: "sysstat/man/iostat.in", type: "file", codeKey: "iostat-columns" }],
  },
};
