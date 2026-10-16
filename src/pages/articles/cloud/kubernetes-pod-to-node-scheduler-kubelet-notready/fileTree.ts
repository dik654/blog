import type { FileNode } from "@/components/code/types";

export const k8sPodNodeTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/scheduler/schedule_one.go", path: "kubernetes/pkg/scheduler/schedule_one.go", type: "file", codeKey: "schedule-pod" },
      { name: "pkg/scheduler/framework/plugins/defaultbinder/default_binder.go", path: "kubernetes/pkg/scheduler/framework/plugins/defaultbinder/default_binder.go", type: "file", codeKey: "default-binder" },
      { name: "pkg/kubelet/config/apiserver.go", path: "kubernetes/pkg/kubelet/config/apiserver.go", type: "file", codeKey: "kubelet-watch" },
      { name: "pkg/kubelet/apis/config/v1beta1/defaults.go", path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go", type: "file", codeKey: "kubelet-defaults" },
      { name: "pkg/kubelet/kubelet.go", path: "kubernetes/pkg/kubelet/kubelet.go", type: "file", codeKey: "kubelet-lease-ctl" },
      { name: "staging/src/k8s.io/component-helpers/apimachinery/lease/controller.go", path: "kubernetes/staging/src/k8s.io/component-helpers/apimachinery/lease/controller.go", type: "file", codeKey: "lease-sync" },
      { name: "pkg/controller/nodelifecycle/config/v1alpha1/defaults.go", path: "kubernetes/pkg/controller/nodelifecycle/config/v1alpha1/defaults.go", type: "file", codeKey: "nlc-defaults" },
      { name: "pkg/controller/nodelifecycle/node_lifecycle_controller.go", path: "kubernetes/pkg/controller/nodelifecycle/node_lifecycle_controller.go", type: "file", codeKey: "nlc-grace" },
      { name: "plugin/pkg/admission/defaulttolerationseconds/admission.go", path: "kubernetes/plugin/pkg/admission/defaulttolerationseconds/admission.go", type: "file", codeKey: "toleration-defaults" },
      { name: "cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go", path: "kubernetes/cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go", type: "file", codeKey: "eviction-rates" },
    ],
  },
};
