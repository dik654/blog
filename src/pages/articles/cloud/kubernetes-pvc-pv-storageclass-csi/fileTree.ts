import type { FileNode } from "@/components/code/types";

export const kubernetesStorageTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/controller/volume/persistentvolume/pv_controller.go", path: "kubernetes/pkg/controller/volume/persistentvolume/pv_controller.go", type: "file", codeKey: "pv-sync-unbound" },
      { name: "pkg/controller/volume/attachdetach/attach_detach_controller.go", path: "kubernetes/pkg/controller/volume/attachdetach/attach_detach_controller.go", type: "file", codeKey: "adc-six-minutes" },
      { name: "pkg/controller/volume/attachdetach/reconciler/reconciler.go", path: "kubernetes/pkg/controller/volume/attachdetach/reconciler/reconciler.go", type: "file", codeKey: "adc-force-detach" },
      { name: "pkg/scheduler/framework/plugins/volumebinding/binder.go", path: "kubernetes/pkg/scheduler/framework/plugins/volumebinding/binder.go", type: "file", codeKey: "sched-assume-selected-node" },
      { name: "pkg/volume/csi/csi_attacher.go", path: "kubernetes/pkg/volume/csi/csi_attacher.go", type: "file", codeKey: "csi-attach-va" },
      { name: "pkg/volume/csi/csi_mounter.go", path: "kubernetes/pkg/volume/csi/csi_mounter.go", type: "file", codeKey: "csi-node-publish" },
      { name: "pkg/apis/core/v1/defaults.go", path: "kubernetes/pkg/apis/core/v1/defaults.go", type: "file", codeKey: "pv-default-retain" },
    ],
  },
  "csi-spec": {
    name: "csi-spec",
    type: "dir",
    children: [{ name: "spec.md", path: "csi-spec/spec.md", type: "file", codeKey: "csi-spec-lifecycle" }],
  },
};
