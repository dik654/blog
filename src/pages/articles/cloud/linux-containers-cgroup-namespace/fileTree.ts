import type { FileNode } from "@/components/code/types";

export const linuxContainerTrees: Record<string, FileNode> = {
  linux: {
    name: "linux",
    type: "dir",
    children: [
      { name: "kernel/sched/fair.c", path: "linux/kernel/sched/fair.c", type: "file", codeKey: "cfs-assign" },
      { name: "kernel/sched/core.c", path: "linux/kernel/sched/core.c", type: "file", codeKey: "cpu-max-write" },
      { name: "kernel/sched/sched.h", path: "linux/kernel/sched/sched.h", type: "file", codeKey: "weight-conversion" },
      { name: "include/linux/nsproxy.h", path: "linux/include/linux/nsproxy.h", type: "file", codeKey: "nsproxy" },
      { name: "include/uapi/linux/sched.h", path: "linux/include/uapi/linux/sched.h", type: "file", codeKey: "clone-flags" },
      { name: "include/uapi/linux/capability.h", path: "linux/include/uapi/linux/capability.h", type: "file", codeKey: "cap-numbers" },
      { name: "net/ipv4/af_inet.c", path: "linux/net/ipv4/af_inet.c", type: "file", codeKey: "bind-cap-check" },
      { name: "Documentation/admin-guide/cgroup-v2.rst", path: "linux/Documentation/admin-guide/cgroup-v2.rst", type: "file", codeKey: "cpu-max-doc" },
      { name: "Documentation/accounting/psi.rst", path: "linux/Documentation/accounting/psi.rst", type: "file", codeKey: "psi-doc" },
    ],
  },
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/kubelet/cm/helpers_linux.go", path: "kubernetes/pkg/kubelet/cm/helpers_linux.go", type: "file", codeKey: "kubelet-quota-shares" },
      { name: "pkg/kubelet/cm/cgroup_manager_linux.go", path: "kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go", type: "file", codeKey: "kubelet-cpu-weight" },
      { name: "pkg/kubelet/kuberuntime/kuberuntime_container_linux.go", path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container_linux.go", type: "file", codeKey: "kubelet-linux-resources" },
    ],
  },
  "man-pages": {
    name: "man-pages",
    type: "dir",
    children: [
      { name: "man/man7/namespaces.7", path: "man-pages/man/man7/namespaces.7", type: "file", codeKey: "namespaces-man" },
      { name: "man/man7/capabilities.7", path: "man-pages/man/man7/capabilities.7", type: "file", codeKey: "capabilities-man" },
    ],
  },
};
