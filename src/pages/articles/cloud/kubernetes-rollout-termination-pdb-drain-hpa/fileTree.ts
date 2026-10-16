import type { FileNode } from "@/components/code/types";

export const kubernetesRolloutTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/kubelet/kuberuntime/kuberuntime_container.go", path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go", type: "file", codeKey: "kubelet-kill-container" },
      { name: "pkg/kubelet/kuberuntime/kuberuntime_manager.go", path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go", type: "file", codeKey: "kubelet-min-grace" },
      { name: "staging/src/k8s.io/endpointslice/utils.go", path: "kubernetes/staging/src/k8s.io/endpointslice/utils.go", type: "file", codeKey: "eps-conditions" },
      { name: "pkg/apis/core/v1/defaults.go", path: "kubernetes/pkg/apis/core/v1/defaults.go", type: "file", codeKey: "pod-grace-default" },
      { name: "pkg/apis/apps/v1/defaults.go", path: "kubernetes/pkg/apis/apps/v1/defaults.go", type: "file", codeKey: "deploy-defaults" },
      { name: "pkg/controller/deployment/util/deployment_util.go", path: "kubernetes/pkg/controller/deployment/util/deployment_util.go", type: "file", codeKey: "deploy-fenceposts" },
      { name: "pkg/controller/disruption/disruption.go", path: "kubernetes/pkg/controller/disruption/disruption.go", type: "file", codeKey: "pdb-expected" },
      { name: "pkg/registry/core/pod/storage/eviction.go", path: "kubernetes/pkg/registry/core/pod/storage/eviction.go", type: "file", codeKey: "eviction-429" },
      { name: "staging/src/k8s.io/kubectl/pkg/drain/drain.go", path: "kubernetes/staging/src/k8s.io/kubectl/pkg/drain/drain.go", type: "file", codeKey: "drain-retry" },
      { name: "pkg/controller/podautoscaler/replica_calculator.go", path: "kubernetes/pkg/controller/podautoscaler/replica_calculator.go", type: "file", codeKey: "hpa-replicas" },
      { name: "pkg/controller/podautoscaler/horizontal.go", path: "kubernetes/pkg/controller/podautoscaler/horizontal.go", type: "file", codeKey: "hpa-stabilize" },
      { name: "pkg/controller/podautoscaler/config/v1alpha1/defaults.go", path: "kubernetes/pkg/controller/podautoscaler/config/v1alpha1/defaults.go", type: "file", codeKey: "hpa-defaults" },
      { name: "pkg/apis/autoscaling/v2/defaults.go", path: "kubernetes/pkg/apis/autoscaling/v2/defaults.go", type: "file", codeKey: "hpa-v2-behavior" },
    ],
  },
};
