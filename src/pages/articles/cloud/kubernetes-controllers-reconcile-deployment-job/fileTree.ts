import type { FileNode } from "@/components/code/types";

export const k8sControllerTrees: Record<string, FileNode> = {
  kubernetes: {
    name: "kubernetes",
    type: "dir",
    children: [
      { name: "pkg/apis/apps/v1/defaults.go", path: "kubernetes/pkg/apis/apps/v1/defaults.go", type: "file", codeKey: "apps-defaults" },
      { name: "pkg/apis/batch/v1/defaults.go", path: "kubernetes/pkg/apis/batch/v1/defaults.go", type: "file", codeKey: "batch-defaults" },
      { name: "pkg/controller/deployment/util/deployment_util.go", path: "kubernetes/pkg/controller/deployment/util/deployment_util.go", type: "file", codeKey: "fenceposts" },
      { name: "pkg/controller/deployment/sync.go", path: "kubernetes/pkg/controller/deployment/sync.go", type: "file", codeKey: "new-rs-hash" },
      { name: "pkg/controller/deployment/rolling.go", path: "kubernetes/pkg/controller/deployment/rolling.go", type: "file", codeKey: "rollout-rolling" },
      { name: "pkg/controller/deployment/progress.go", path: "kubernetes/pkg/controller/deployment/progress.go", type: "file", codeKey: "progress-timeout" },
      { name: "pkg/controller/replicaset/replica_set.go", path: "kubernetes/pkg/controller/replicaset/replica_set.go", type: "file", codeKey: "manage-replicas" },
      { name: "pkg/controller/controller_utils.go", path: "kubernetes/pkg/controller/controller_utils.go", type: "file", codeKey: "delete-ranks" },
      { name: "pkg/controller/controller_ref_manager.go", path: "kubernetes/pkg/controller/controller_ref_manager.go", type: "file", codeKey: "claim-object" },
      { name: "pkg/controller/job/job_controller.go", path: "kubernetes/pkg/controller/job/job_controller.go", type: "file", codeKey: "job-failure-check" },
      { name: "pkg/controller/job/backoff_utils.go", path: "kubernetes/pkg/controller/job/backoff_utils.go", type: "file", codeKey: "job-backoff-time" },
      { name: "staging/src/k8s.io/client-go/util/workqueue/default_rate_limiters.go", path: "kubernetes/staging/src/k8s.io/client-go/util/workqueue/default_rate_limiters.go", type: "file", codeKey: "workqueue-ratelimit" },
    ],
  },
};
