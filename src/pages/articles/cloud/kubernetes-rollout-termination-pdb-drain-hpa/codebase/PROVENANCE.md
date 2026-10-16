# Kubernetes rollout · termination · PDB · drain · HPA source snapshots

Retrieved 2026-10-17. Full unmodified files (byte-for-byte).

- Kubernetes v1.37.1 (tag object d2b770f4c94636a992534a8d3156b6b2d8e82ac3, commit f78e722310e50bcaca9276be22276d9e91d91308). License: Apache-2.0 — see `kubernetes/LICENSE`.

`kubernetes/` (and `csi-spec/` where present) are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. Timeline numbers in the article are read from these defaults; no cluster was run and no latency was measured.

- `kubernetes/LICENSE/LICENSE` — 11358 bytes; SHA256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/LICENSE/LICENSE)
- `kubernetes/pkg/apis/apps/v1/defaults.go` — 5387 bytes; SHA256 `87cca7e08b3f39c2cd907a9149a140d2655843a403366ac80cf3cfbef920c0b4`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/apis/apps/v1/defaults.go)
- `kubernetes/pkg/apis/autoscaling/v2/defaults.go` — 4941 bytes; SHA256 `287edfaaa2794b0e9ba2464df8471488bfdd8f91f6455e96b197ed84bc43f08b`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/apis/autoscaling/v2/defaults.go)
- `kubernetes/pkg/apis/core/v1/defaults.go` — 21268 bytes; SHA256 `95f7ccc5c2f1416e96761df8b23dfb19fa41f3afaa85f69486b9d715ff7a55d0`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/apis/core/v1/defaults.go)
- `kubernetes/pkg/controller/deployment/util/deployment_util.go` — 41731 bytes; SHA256 `dc99b521ebbf40045e464a4ab22995fc0ca53b1611ea13bc2cf32061aa97c6ff`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/controller/deployment/util/deployment_util.go)
- `kubernetes/pkg/controller/disruption/disruption.go` — 37235 bytes; SHA256 `0c1dc87ccc5b33fb907d89fc56b935efd40d45d2cb9bdb1f1836620d2e47df30`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/controller/disruption/disruption.go)
- `kubernetes/pkg/controller/podautoscaler/config/v1alpha1/defaults.go` — 2431 bytes; SHA256 `7934785cad4fb053ed28a0b750790484c3c87b34e6e1facb40569990a6753df5`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/controller/podautoscaler/config/v1alpha1/defaults.go)
- `kubernetes/pkg/controller/podautoscaler/horizontal.go` — 74562 bytes; SHA256 `99ff78f6d9ea4216861c76ef445a0e1a75b5de2f622642bc81b3ba8679e07e73`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/controller/podautoscaler/horizontal.go)
- `kubernetes/pkg/controller/podautoscaler/replica_calculator.go` — 24154 bytes; SHA256 `082174c324328c4bbb421926fa8a7dd9e847b90ae6b6aa303436182ea4a7b01f`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/controller/podautoscaler/replica_calculator.go)
- `kubernetes/pkg/kubelet/kuberuntime/kuberuntime_container.go` — 62285 bytes; SHA256 `80c123a39a9e9f47c669e802cd6b5f0fd16965e0de2e1c25df5c5f9dcbdd8e3b`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/kuberuntime/kuberuntime_container.go)
- `kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go` — 107176 bytes; SHA256 `0ed7bd462cf3bbe043bc54fc0ccaf7db17fd642d42f3caf0b1a9625ac655fe97`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/kubelet/kuberuntime/kuberuntime_manager.go)
- `kubernetes/pkg/registry/core/pod/storage/eviction.go` — 20509 bytes; SHA256 `bf75e699f0f57c38b5bda8fc6b0a73488ec9625e61f354de3b5877befd337db3`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/pkg/registry/core/pod/storage/eviction.go)
- `kubernetes/staging/src/k8s.io/endpointslice/utils.go` — 15381 bytes; SHA256 `3a5a7e0599be5af2eaef7a7dd2954218b62a86203892333775ec5a06535746cb`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/staging/src/k8s.io/endpointslice/utils.go)
- `kubernetes/staging/src/k8s.io/kubectl/pkg/drain/drain.go` — 16798 bytes; SHA256 `76dfbcaa050248bdf679a062d33ec9bd5f2c92476c23f55ca7f69fcca63f2c07`; [pinned original](https://raw.githubusercontent.com/kubernetes/kubernetes/v1.37.1/staging/src/k8s.io/kubectl/pkg/drain/drain.go)
