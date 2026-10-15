import type { FileNode } from "@/components/code/types";

export const linuxMemoryTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "mm/show_mem.c", path: "linux/mm/show_mem.c", type: "file", codeKey: "mem-available" },
      { name: "mm/page_alloc.c", path: "linux/mm/page_alloc.c", type: "file", codeKey: "alloc-slowpath" },
      { name: "mm/memcontrol.c", path: "linux/mm/memcontrol.c", type: "file", codeKey: "memcg-charge" },
      { name: "mm/internal.h", path: "linux/mm/internal.h", type: "file", codeKey: "reclaim-retries" },
      { name: "mm/oom_kill.c", path: "linux/mm/oom_kill.c", type: "file", codeKey: "oom-badness" },
      { name: "include/linux/mm_inline.h", path: "linux/include/linux/mm_inline.h", type: "file", codeKey: "file-lru" },
      { name: "fs/proc/base.c", path: "linux/fs/proc/base.c", type: "file", codeKey: "proc-oom-score" },
      { name: "Documentation/admin-guide/cgroup-v2.rst", path: "linux/Documentation/admin-guide/cgroup-v2.rst", type: "file", codeKey: "cgroup-memory-max" },
      { name: "Documentation/filesystems/proc.rst", path: "linux/Documentation/filesystems/proc.rst", type: "file", codeKey: "mem-available-doc" },
      { name: "Documentation/accounting/psi.rst", path: "linux/Documentation/accounting/psi.rst", type: "file", codeKey: "psi-doc" },
      { name: "Documentation/admin-guide/sysctl/vm.rst", path: "linux/Documentation/admin-guide/sysctl/vm.rst", type: "file", codeKey: "swappiness-doc" },
      { name: "Documentation/mm/overcommit-accounting.rst", path: "linux/Documentation/mm/overcommit-accounting.rst", type: "file", codeKey: "overcommit-modes" },
    ],
  },
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/kubelet/qos/policy.go", path: "kubernetes/pkg/kubelet/qos/policy.go", type: "file", codeKey: "kubelet-oom-adj" },
    ],
  },
};
