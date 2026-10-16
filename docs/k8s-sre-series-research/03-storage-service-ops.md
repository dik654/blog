# K8s 운영·SRE 시리즈 조사 원장 03 — 스토리지·Service 종료·운영 필수 (2026-10-16)

범위: (1) PVC→PV→StorageClass→CSI, (2) Service→Pod 중 기존 글이 비운 부분(종료 흐름), (3) rollout·PDB/drain·HPA·버전 skew·ConfigMap/Secret 전파.

출처 표기: 소스는 `kubernetes/kubernetes` **release-1.34** 브랜치 raw 파일을 직접 받아 읽음. 문서는 `kubernetes/website` **main** 브랜치 markdown 원문(kubernetes.io/docs 와 동일 내용)을 직접 받아 grep 함. CSI는 `kubernetes-csi/docs` master, `container-storage-interface/spec` master. 원본 사본: 세션 scratchpad `k8s/`, `k8s/f3/`.

---

## 1. 스토리지: PVC → PV → StorageClass → CSI

### 1.1 확인한 사실 (기본값·문구)

| 항목 | 사실 | 출처 |
|---|---|---|
| 프로비저닝 두 방식 | "There are two ways PVs may be provisioned: statically or dynamically." static = 관리자가 PV 미리 생성, dynamic = 맞는 PV가 없으면 StorageClass로 새로 만듦. `storageClassName: ""` 는 dynamic을 끔 | docs/concepts/storage/persistent-volumes.md |
| 바인딩 | PVC↔PV는 1:1, ClaimRef로 양방향. "Claims will remain unbound indefinitely if a matching volume does not exist." | 같은 문서 |
| volumeBindingMode 기본값 | "When unset, `Immediate` mode is used by default." | docs/concepts/storage/storage-classes.md L173–175 |
| Immediate의 문제 | PVC 생성 즉시 바인딩·프로비저닝 → topology 제약 스토리지(존 디스크 등)는 Pod 스케줄 조건을 모른 채 만들어져 "This may result in unschedulable Pods." | 같은 문서 L177–181 |
| WaitForFirstConsumer | PVC를 쓰는 Pod가 생길 때까지 바인딩·프로비저닝 지연, Pod의 resource 요구·nodeSelector·affinity·taint/toleration에 맞춰 선택/생성 | L183–191 |
| WFFC + nodeName 함정 | "If `nodeName` is used in this case, the scheduler will be bypassed and PVC will remain in `pending` state." → `kubernetes.io/hostname` nodeSelector를 쓸 것 | L203–207 |
| WFFC 구현 | 스케줄러 volumebinding 플러그인이 PVC에 `volume.kubernetes.io/selected-node` 주석을 단다(binder.go L447 `SetMetaDataAnnotation(..., volume.AnnSelectedNode, nodeName)`); PV 컨트롤러는 그전까지 Normal 이벤트 `WaitForFirstConsumer` "waiting for first consumer to be created before binding" | pkg/scheduler/framework/plugins/volumebinding/binder.go; pkg/controller/volume/persistentvolume/pv_controller.go L307–308 |
| 스케줄 실패 문구 | "node(s) didn't find available persistent volumes to bind", "node(s) didn't match PersistentVolume's node affinity" | binder.go L65, L67 |
| SC 없음 PVC Pending 문구 | FailedBinding: "no persistent volumes available for this claim and no storage class is set" | pv_controller.go L381 |
| 기본 StorageClass | `storageclass.kubernetes.io/is-default-class: "true"`. 여러 개면 "most recently created default StorageClass". 기본 SC가 나중에 생기면 storageClassName 없는 기존 PVC에 소급 지정; 단 `""` 로 명시한 PVC는 갱신 안 됨 | storage-classes.md |
| reclaimPolicy | SC로 동적 생성된 PV: SC의 reclaimPolicy, 미지정 시 **Delete**. 수동 생성 PV 기본값은 **Retain** (core/v1 defaults.go L289–290 `PersistentVolumeReclaimRetain`). Recycle은 deprecated | storage-classes.md; pkg/apis/core/v1/defaults.go |
| Retain 뒤 상태 | PVC 삭제 → PV는 `Released`, "not yet available for another claim because the previous claimant's data remains". 재사용은 PV 삭제·데이터 정리·새 PV 생성(수동) | persistent-volumes.md L186–199 |
| PV phase | Available / Bound / Released / Failed | L765–780 |
| 접근 모드 | RWO는 **노드** 단위: "still can allow multiple pods ... when the pods are running on the same node". RWOP = 클러스터 전체에서 Pod 하나, **v1.29 stable**, CSI 전용(1.22+, csi-provisioner v3.0.0+, csi-attacher v3.3.0+) | L622–650 |
| 사용 중 보호 | PVC finalizer `kubernetes.io/pvc-protection`, PV `kubernetes.io/pv-protection` → Pod가 쓰는 PVC는 삭제 요청해도 Terminating으로 남음 | L139–163 |
| 확장 | SC `allowVolumeExpansion: true` 일 때만, 키우기만 가능("not to shrink") | storage-classes.md |

### 1.2 CSI 경로 (컨트롤 플레인 → 노드)

1. **Provision**: PVC 생성 → `external-provisioner` sidecar가 CSI `CreateVolume` 호출, SC `parameters`를 `CreateVolumeRequest.parameters`로 전달 → PV 객체 생성·바인딩. (kubernetes-csi/docs book/src/external-provisioner.md L47, L70)
2. **Attach**: Pod가 노드에 배치되면 kube-controller-manager의 attach-detach controller가 `VolumeAttachment` 객체를 만들고, `external-attacher` sidecar가 이를 watch해 `ControllerPublishVolume` 호출. (external-attacher.md L46) NFS처럼 attach 개념 없는 드라이버는 CSIDriver `attachRequired: false`로 생략. (skip-attach.md L24–34)
3. **Mount (노드)**: kubelet이 노드 플러그인에 `NodeStageVolume`(노드당 1회, 전역 staging 경로 포맷·마운트) → `NodePublishVolume`(Pod 경로로 bind mount). CSI spec Figure 6: CREATED →ControllerPublish→ NODE_READY →NodeStage→ VOL_READY →NodePublish→ PUBLISHED. (container-storage-interface/spec spec.md L186–212)
4. 해제는 역순(NodeUnpublish → NodeUnstage → ControllerUnpublish → DeleteVolume[Delete 정책일 때]).

### 1.3 Multi-Attach와 "6분" (소스로 확인)

- 이벤트 문구: "Multi-Attach error ... Volume is already exclusively attached to one node and can't be attached to another" 또는 "...volume is already used by pods" — `pkg/controller/volume/attachdetach/reconciler/reconciler.go` L376–437 `reportMultiAttachError`. RWO 볼륨을 쓰는 Pod가 다른 노드로 옮겨질 때 옛 노드에서 detach가 끝나기 전 새 Pod가 뜨면 발생.
- `ReconcilerMaxWaitForUnmountDuration: 6 * time.Minute` — `attach_detach_controller.go` L92.
- **정확한 조건 (흔한 오해 정정)**: 6분이 지나면 무조건 강제 detach가 아니다. reconciler.go L214–240:
  `forceDetach := !isHealthy && maxWaitForUnmountDurationExpired && !disableForceDetachOnTimeout`. 즉 **노드가 NotReady(unhealthy)이고** 6분이 지나야 하며, 볼륨이 아직 마운트로 보고되면 `forceDetach`나 `node.kubernetes.io/out-of-service` taint 없이는 detach를 건너뛴다(L238–242). 건강한 노드에서 unmount가 안 끝나면 6분이 지나도 강제 detach 안 함.
- 노드 장애 시 실제 체감 시간은 (NotReady 판정 + Pod 축출/교체 대기 + 6분)으로 늘어난다. 앞 단계 수치(node-monitor-grace-period, 기본 toleration 300s)는 노드 생명주기 담당 원장에서 확정할 것 — 여기서 합산 수치는 확정하지 않음.
- 빠른 복구 수단: 노드가 확실히 꺼졌을 때 `node.kubernetes.io/out-of-service=nodeshutdown:NoExecute` taint (non-graceful node shutdown) → 마운트 보고 무시하고 detach.

### 1.4 StatefulSet와 PVC

- `volumeClaimTemplates`로 Pod마다 PVC(`<template>-<sts>-<ordinal>`) 생성. 기본 `podManagementPolicy: OrderedReady` (pkg/apis/apps/v1/defaults.go L101–102).
- `persistentVolumeClaimRetentionPolicy` 기본 `whenDeleted: Retain`, `whenScaled: Retain` (defaults.go L128–135) → StatefulSet을 지우거나 축소해도 PVC는 남는다(=다시 늘리면 같은 데이터 재부착). 기능 게이트 StatefulSetAutoDeletePVC: alpha 1.23, beta 1.27(기본 on), **stable 1.32** (website feature-gates/StatefulSetAutoDeletePVC.md).

### 1.5 흔한 실패 → 첫 확인

| 증상 | 원인 후보 | 첫 증거 |
|---|---|---|
| PVC Pending, 이벤트 FailedBinding "no storage class is set" | 기본 SC 없음 / `storageClassName` 오타 | `kubectl get sc`, PVC events |
| PVC Pending, `WaitForFirstConsumer` | 정상. 쓰는 Pod가 아직 없음 | Pod 생성 여부 |
| Pod Pending "didn't find available persistent volumes to bind" / "didn't match PersistentVolume's node affinity" | 존 불일치(Immediate로 다른 존에 생성, 로컬 PV) | PV `nodeAffinity`, Pod nodeSelector |
| Pod ContainerCreating, FailedAttachVolume "Multi-Attach error" | RWO가 옛 노드에 붙어 있음 | `kubectl get volumeattachment`, 옛 노드 상태 |
| FailedMount / MountVolume.SetUp failed | 노드 플러그인(NodeStage/Publish) 실패, fsType, 권한 | kubelet 로그, CSI node pod 로그 |
| PVC 삭제가 Terminating에 멈춤 | pvc-protection: 쓰는 Pod가 아직 있음 | `kubectl describe pvc` Used By |
| PVC 지웠는데 PV Released로 남음 | reclaimPolicy Retain | PV phase |

---

## 2. Service → Pod: 기존 글과의 경계

`cloud/kubernetes-network-packet-path` 가 이미 다루는 것(본문 grep 확인): selector(6회), EndpointSlice(6), readiness(1), kube-proxy(9), conntrack(8), Ingress/Gateway(각 10). → 시리즈는 **이 글로 링크**하고 반복하지 않는다.

비어 있는 것(본문 0회): preStop, SIGTERM, terminationGracePeriodSeconds, terminating/serving 조건, externalTrafficPolicy, headless, sessionAffinity. 시리즈에서 채울 핵심은 **Pod 종료와 트래픽 배수(drain)**.

### 2.1 Pod 종료 흐름 (docs/concepts/workloads/pods/pod-lifecycle.md L900–960)

1. 삭제 요청 → API에 deletionTimestamp + grace period 기록, 기본 **30초** (core/v1 defaults.go L228–230 `DefaultTerminationGracePeriodSeconds`).
2. kubelet: `preStop` hook 실행(grace가 0이 아닐 때). preStop 시간도 grace period 안에서 소비. 끝나지 않으면 "a small, one-off grace period extension of 2 seconds".
3. 그다음 각 컨테이너 PID 1에 TERM. 컨테이너 간 순서는 임의(사이드카 제외).
4. **동시에** 컨트롤 플레인이 EndpointSlice에서 해당 Pod를 내리기 시작. 종료 중 endpoint는 즉시 사라지지 않고 `terminating` 조건과 함께 `ready: false`(1.26 이전 호환), 실제 응답 가능 여부는 `serving` 조건 (EndpointSlice conditions v1.26 stable, endpoint-slices.md L90, L98).
5. grace 만료 시 남은 프로세스에 SIGKILL, Pod를 terminal phase로, API 객체 삭제.

→ **경쟁 조건**: TERM 전달과 endpoint 제거(→ 각 노드 kube-proxy 규칙 갱신, 외부 LB)가 병렬이라, 앱이 TERM 받자마자 리스너를 닫으면 아직 규칙이 남은 노드에서 온 새 연결이 거절된다. 흔한 완화: preStop에 짧은 sleep(수 초)로 endpoint 전파를 기다린 뒤 종료, 앱은 TERM 후 in-flight 요청을 마치고 종료. sleep 길이는 측정치가 아니라 설계값(가정)으로 표기할 것.
- PID 1 신호 처리 문제(sh 래퍼가 TERM을 자식에 안 넘김 → 30초 뒤 SIGKILL)는 Linux 시리즈 `cloud/linux-process-signals-pid1-fds`로 링크.

### 2.2 CrashLoopBackOff (같은 문서)

- 재시작 지연 "10s, 20s, 40s, …", "capped at 300 seconds (5 minutes)", "Once a container has executed for 10 minutes without any problems, the kubelet resets" (L387–389).
- CrashLoopBackOff는 독립 phase가 아니라 컨테이너 waiting reason(STATUS 열에 보임, L122). 알파 게이트 `ReduceDefaultCrashLoopBackOffDecay`(1s 시작)·`KubeletCrashLoopBackOffMax`가 있으나 기본값은 위와 같음(L551–599).
- 조사: `kubectl logs --previous`, `describe`의 Last State(exit code, OOMKilled), events.

---

## 3. 운영 필수

### 3.1 Deployment rollout / rollback

- 기본값 (pkg/apis/apps/v1/defaults.go L56–71): `maxUnavailable: 25%`, `maxSurge: 25%`, `revisionHistoryLimit: 10`, `progressDeadlineSeconds: 600`.
- 새 revision은 "if and only if the Deployment's Pod template (`.spec.template`) is changed" (deployment.md L167, L386). replicas 변경·HPA 스케일은 rollout이 아님.
- ReplicaSet 이름 해시 = `pod-template-hash` 라벨 (L134, L159). Deployment → ReplicaSet → Pod 소유 사슬.
- 진행 정체 시 condition `Progressing=False`, `reason: ProgressDeadlineExceeded` (L958). **자동 롤백하지 않는다** — 상위 오케스트레이터/사람이 `kubectl rollout undo deployment/x [--to-revision=N]` (L554, L564). revisionHistoryLimit 0이면 undo 불가.

### 3.2 PDB, drain, Eviction API

- `kubectl drain`은 Eviction API를 쓰고, PDB를 위반하면 API가 **429 Too Many Requests** (docs/concepts/scheduling-eviction/api-eviction.md L75).
- 예: replicas 3, `minAvailable: 2` → 한 번에 1개만 축출 (safely-drain-node.md L118–123).
- 흔한 고착: 새 Pod가 Ready가 안 되면 Eviction이 429/500만 반환하며 drain이 영원히 멈춤 (api-eviction.md L103–107).
- **PDB가 막지 못하는 것**: "deleting deployments or pods bypasses Pod Disruption Budgets" (disruptions.md L62–64); 비자발적 장애(노드 다운)는 막지 못하지만 예산에는 계산됨; Deployment/StatefulSet의 rolling update는 PDB의 제한을 받지 않음(maxUnavailable이 담당) (L130–135). 예산 기준 replicas는 ownerReferences로 찾은 워크로드의 `.spec.replicas` (L125–127).

### 3.3 HPA

- 공식: `desiredReplicas = ceil[currentReplicas × currentMetricValue / desiredMetricValue]` (docs hpa.md L136).
- 실제 코드: tolerance 안이면 현재 유지, 아니면 `ceil(usageRatio × readyPodCount)` — **ready Pod 수 기준** (pkg/controller/podautoscaler/replica_calculator.go L111–118). 누락 metric Pod는 축소 시 100%(또는 목표치)로, 확대 시 0%로 채워 재계산, 미준비 Pod는 확대 시 0%; 방향이 뒤집히면 스케일 안 함 (L121–160).
- Utilization은 **requests 대비** 비율. 컨테이너에 request가 없으면 계산 불가(hpa.md L92–98, `calculateRequests` 오류).
- 컨트롤러 기본값 (pkg/controller/podautoscaler/config/v1alpha1/defaults.go L40–53): sync 15s, downscale stabilization **5분**, CPU initialization 5분, initial readiness delay 30s, tolerance **0.1** (`isWithin`: 0.9 ≤ ratio ≤ 1.1, replica_calculator.go L56–57).
- behavior 기본 (pkg/apis/autoscaling/v2/defaults.go L28–63): scale-up stabilization 0, 15초마다 max(4 Pod, 100%); scale-down 15초마다 100%, 창은 플래그(5분).
- per-HPA `tolerance` 필드: 게이트 HPAConfigurableTolerance alpha 1.33–1.34, beta 1.35–1.36(기본 off), stable 1.37 (website feature-gates 파일 기준).

### 3.4 클러스터 업그레이드 version skew (website content/en/releases/version-skew-policy.md)

- 지원 브랜치: 최근 3개 minor (L28).
- HA apiserver끼리 1 minor 이내 (L46).
- kubelet: apiserver보다 **새로우면 안 됨**, 최대 3 minor 낮게 가능(1.25 미만 kubelet은 2) (L55–56). kube-proxy 동일 + kubelet과 ±3 (L77–81).
- controller-manager·scheduler·ccm: apiserver보다 새로우면 안 되고 같거나 1 minor 낮게 (L103–105).
- kubectl: apiserver ±1 (L130).
- apiserver는 minor를 건너뛰어 올리면 안 됨 (L192). → 순서: control plane(apiserver 먼저) → 노드(kubelet) 한 minor씩.

### 3.5 ConfigMap / Secret 갱신 전파 (docs/concepts/configuration/configmap.md L196–208)

- 볼륨 마운트: 결국 갱신되지만 지연 = kubelet sync period + 캐시 전파 지연(watch 기본/ttl/직접). kubelet `syncFrequency` 기본 **1분** (pkg/kubelet/apis/config/v1beta1/defaults.go L76–77).
- **환경변수로 쓰면 자동 갱신 안 됨, Pod 재시작 필요** (L205).
- **subPath 마운트는 갱신을 받지 않음** (L208).
- `immutable: true`(v1.19+) 는 되돌릴 수 없고 kubelet watch를 닫아 apiserver 부하를 줄임 (L59, L299–325).
- ConfigMap 수정은 Pod template 변경이 아니므로 Deployment rollout을 일으키지 않음 → 흔한 패턴: template annotation에 설정 해시, 또는 `kubectl rollout restart`.

---

## 4. 흔한 오해 → 정정

| 오해 | 정정 | 근거 |
|---|---|---|
| RWO = Pod 하나만 쓸 수 있다 | 노드 하나. 같은 노드의 여러 Pod는 동시 사용 가능. Pod 하나로 제한은 RWOP | persistent-volumes.md L622–628 |
| PVC Pending은 항상 오류 | WFFC에서는 쓰는 Pod가 생길 때까지 정상 Pending | storage-classes.md, pv_controller.go L307 |
| PVC 지우면 디스크도 지워진다 | 동적 생성 기본 Delete지만 수동 PV 기본은 Retain, Retain이면 Released로 남음 | core/v1 defaults.go L289, persistent-volumes.md |
| StatefulSet 지우면 PVC도 지워진다 | 기본 Retain(whenDeleted·whenScaled) | apps/v1 defaults.go L128–135 |
| Multi-Attach는 6분 지나면 자동 해결 | 노드가 unhealthy일 때만 6분 뒤 강제 detach. 건강한 노드의 unmount 지연은 기다림 | reconciler.go L214–242 |
| 진행 기한(600s) 넘으면 자동 롤백 | condition만 바뀜. 롤백은 `rollout undo` | deployment.md L958–967 |
| PDB가 있으면 Pod 삭제·노드 장애도 막는다 | Eviction API만 막음. 직접 delete·노드 장애·롤링 업데이트는 못 막음 | disruptions.md L62–64, L130–135 |
| HPA는 실제 CPU 코어 사용량으로 판단 | requests 대비 비율. request 없으면 계산 실패 | hpa.md L92–98 |
| HPA는 currentReplicas에 비율을 곱한다 | 코드는 ready Pod 수 × 비율, 누락·미준비 Pod 보정, 0.1 tolerance | replica_calculator.go L111–160 |
| ConfigMap 바꾸면 Pod에 바로 반영 | 볼륨은 최대 ~sync 1분+캐시 지연, env·subPath는 반영 안 됨 | configmap.md L196–208 |
| SIGTERM을 받으면 트래픽이 이미 끊겨 있다 | endpoint 제거와 TERM이 동시에 시작 → 전파 지연 동안 새 연결 도착 가능 | pod-lifecycle.md L913–949 |
| terminationGracePeriodSeconds는 SIGTERM 이후 시간 | preStop 실행 시간도 포함(초과 시 2초 1회 연장) | pod-lifecycle.md L913–922 |
| kubelet을 먼저 올려도 된다 | kubelet은 apiserver보다 새로우면 안 됨 → control plane 먼저 | version-skew-policy.md L55 |

## 5. 확인 못 한 것 / 다음 원장 몫

- 노드 장애 → Pod 교체 → 강제 detach까지의 합산 시간: node-lifecycle 기본값(node-monitor-grace-period, not-ready/unreachable toleration 300s)과 합쳐야 함. 노드·스케줄링 담당 원장에서 확정.
- 국내/해외 기업 SRE 면접에서 이 주제들이 나오는 빈도: 이 슬라이스에서는 조사하지 않음.
- HPA tolerance 게이트 단계는 website main(2026-10 시점) 기준. 클러스터 실제 버전에 따라 다름.
