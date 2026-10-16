import type { FileNode } from "@/components/code/types";

export const k8sPodStatesTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/kubelet/kubelet.go", path: "kubernetes/pkg/kubelet/kubelet.go", type: "file", codeKey: "crashloop-constants" },
      { name: "pkg/kubelet/kuberuntime/kuberuntime_manager.go", path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go", type: "file", codeKey: "do-backoff" },
      { name: "staging/src/k8s.io/client-go/util/flowcontrol/backoff.go", path: "kubernetes/staging/src/k8s.io/client-go/util/flowcontrol/backoff.go", type: "file", codeKey: "backoff-next" },
      { name: "pkg/kubelet/apis/config/v1beta1/defaults.go", path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go", type: "file", codeKey: "max-container-backoff" },
      { name: "pkg/kubelet/images/types.go", path: "kubernetes/pkg/kubelet/images/types.go", type: "file", codeKey: "image-pull-errors" },
      { name: "pkg/apis/core/v1/defaults.go", path: "kubernetes/pkg/apis/core/v1/defaults.go", type: "file", codeKey: "probe-defaults" },
      { name: "pkg/controlplane/apiserver/options/options.go", path: "kubernetes/pkg/controlplane/apiserver/options/options.go", type: "file", codeKey: "event-ttl" },
      { name: "staging/src/k8s.io/client-go/tools/record/events_cache.go", path: "kubernetes/staging/src/k8s.io/client-go/tools/record/events_cache.go", type: "file", codeKey: "event-aggregation" },
      { name: "pkg/features/kube_features.go", path: "kubernetes/pkg/features/kube_features.go", type: "file", codeKey: "crashloop-feature-gates" },
    ],
  },
  website: {
    name: "website",
    type: "dir",
    children: [
      { name: "concepts/workloads/pods/pod-lifecycle.md", path: "website/content/en/docs/concepts/workloads/pods/pod-lifecycle.md", type: "file", codeKey: "status-vs-phase-doc" },
      { name: "tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md", path: "website/content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md", type: "file", codeKey: "startup-probe-doc" },
      { name: "tasks/debug/debug-application/debug-pods.md", path: "website/content/en/docs/tasks/debug/debug-application/debug-pods.md", type: "file", codeKey: "pending-waiting-doc" },
    ],
  },
};
