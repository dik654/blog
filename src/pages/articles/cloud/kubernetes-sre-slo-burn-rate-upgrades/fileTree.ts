import type { FileNode } from "@/components/code/types";

export const kubernetesSreTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "cmd/kubeadm/app/phases/upgrade/policy.go", path: "kubernetes/cmd/kubeadm/app/phases/upgrade/policy.go", type: "file", codeKey: "skew-enforce" },
      { name: "cmd/kubeadm/app/constants/constants.go", path: "kubernetes/cmd/kubeadm/app/constants/constants.go", type: "file", codeKey: "skew-minimum-versions" },
      { name: "staging/src/k8s.io/api/admissionregistration/v1/types.go", path: "kubernetes/staging/src/k8s.io/api/admissionregistration/v1/types.go", type: "file", codeKey: "webhook-failure-policy" },
    ],
  },
};
