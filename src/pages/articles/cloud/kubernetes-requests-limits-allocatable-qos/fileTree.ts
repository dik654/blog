import type { FileNode } from "@/components/code/types";

export const k8sResourcesTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/scheduler/framework/plugins/noderesources/fit.go", path: "kubernetes/pkg/scheduler/framework/plugins/noderesources/fit.go", type: "file", codeKey: "fits-request" },
      { name: "pkg/scheduler/framework/types.go", path: "kubernetes/pkg/scheduler/framework/types.go", type: "file", codeKey: "no-node-available-msg" },
      { name: "pkg/kubelet/eviction/defaults_linux.go", path: "kubernetes/pkg/kubelet/eviction/defaults_linux.go", type: "file", codeKey: "eviction-hard-defaults" },
      { name: "pkg/kubelet/apis/config/v1beta1/defaults.go", path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go", type: "file", codeKey: "kubelet-cfs-defaults" },
      { name: "pkg/kubelet/cm/helpers_linux.go", path: "kubernetes/pkg/kubelet/cm/helpers_linux.go", type: "file", codeKey: "cfs-quota" },
      { name: "pkg/kubelet/cm/cgroup_manager_linux.go", path: "kubernetes/pkg/kubelet/cm/cgroup_manager_linux.go", type: "file", codeKey: "cpu-weight" },
      { name: "pkg/kubelet/qos/policy.go", path: "kubernetes/pkg/kubelet/qos/policy.go", type: "file", codeKey: "kubelet-oom-adj" },
    ],
  },
  website: {
    name: "website",
    type: "dir",
    children: [
      { name: "tasks/administer-cluster/reserve-compute-resources.md", path: "website/content/en/docs/tasks/administer-cluster/reserve-compute-resources.md", type: "file", codeKey: "allocatable-example" },
      { name: "concepts/configuration/manage-resources-containers.md", path: "website/content/en/docs/concepts/configuration/manage-resources-containers.md", type: "file", codeKey: "limits-enforcement-doc" },
      { name: "concepts/workloads/pods/pod-qos.md", path: "website/content/en/docs/concepts/workloads/pods/pod-qos.md", type: "file", codeKey: "qos-rules-doc" },
      { name: "concepts/scheduling-eviction/node-pressure-eviction.md", path: "website/content/en/docs/concepts/scheduling-eviction/node-pressure-eviction.md", type: "file", codeKey: "eviction-order-doc" },
      { name: "concepts/policy/limit-range.md", path: "website/content/en/docs/concepts/policy/limit-range.md", type: "file", codeKey: "limit-range-doc" },
      { name: "concepts/policy/resource-quotas.md", path: "website/content/en/docs/concepts/policy/resource-quotas.md", type: "file", codeKey: "resource-quota-doc" },
    ],
  },
};
