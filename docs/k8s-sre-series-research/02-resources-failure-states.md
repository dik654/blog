# K8s·SRE 시리즈 조사 원장 02 — 자원 요청·할당, 실패 상태, Event (2026-10-16)

읽은 판: `kubernetes/kubernetes` master(2026-10-16 시점, 최신 릴리스 태그 v1.37.1), `kubernetes/website` main. 소스 경로는 저장소 기준. 문서는 `content/en/docs/...md`를 raw로 열어 읽었다. 사본: 세션 scratchpad `k8s/`.

## 1. 요청한 자원 vs 실제 할당

### 1-1. Allocatable = Capacity − 예약 − eviction 하한
- 문서 `tasks/administer-cluster/reserve-compute-resources.md` 224–236행 예시: 노드 메모리 32Gi·CPU 16·저장 100Gi, `kubeReserved {cpu 1000m, memory 2Gi, ephemeral 1Gi}`, `systemReserved {cpu 500m, memory 1Gi, ephemeral 1Gi}`, `evictionHard {memory.available <500Mi, nodefs.available <10%}` → **Allocatable 14.5 CPU · 28.5Gi · 88Gi**. "Scheduler ensures that the total memory requests across all pods on this node does not exceed 28.5Gi". (32 − 2 − 1 − 0.5 = 28.5, 100 − 1 − 1 − 10 = 88.) 이 숫자를 running example 후보로 쓰기 좋다.
- kubeReserved·systemReserved 기본값은 없다(문서 246행 근처: 설정하지 않으면 0). 기본으로 빠지는 것은 eviction 하한뿐.
- `pkg/kubelet/eviction/defaults_linux.go` `DefaultEvictionHard`: `memory.available 100Mi`, `nodefs.available 10%`, `nodefs.inodesFree 5%`, `imagefs.available 15%`, `imagefs.inodesFree 5%`.
- `pkg/kubelet/apis/config/v1beta1/defaults.go`: `EvictionPressureTransitionPeriod` 5분, `CPUCFSQuota` true, `CPUCFSQuotaPeriod` 100ms.

### 1-2. scheduler는 사용량이 아니라 requests 합으로 판정
- `pkg/scheduler/framework/plugins/helper/resource_fit.go` 147–171행: `podRequest.MilliCPU > (Allocatable − Requested)`이면 `Reason: "Insufficient cpu"`; memory·ephemeral-storage·확장 자원(`Insufficient %v`)도 같은 식. `Requested`는 노드에 이미 배치된 Pod들의 **requests 합**이지 실측 사용량이 아니다.
- 결과: 노드 실제 CPU 사용률 20%여도 requests 합이 Allocatable에 차 있으면 새 Pod는 Pending. 반대로 requests를 작게 쓴 Pod가 많으면 스케줄은 되는데 실사용으로 노드가 터진다(→ eviction·OOM).
- FailedScheduling 메시지 형식: `pkg/scheduler/framework/types.go` 1361–1386행 `NoNodeAvailableMsg = "0/%v nodes are available"`, 주석 "A message format is `0/X nodes are available: <PreFilterMsg>. <FilterMsg>. <PostFilterMsg>.`" 예: `0/3 nodes are available: 3 Insufficient cpu. preemption: ...`.

### 1-3. limits의 집행: CPU는 throttle, memory는 OOM kill
- 문서 `concepts/configuration/manage-resources-containers.md` 36–60행: "cpu limits are enforced by CPU throttling"; "memory limits are enforced by the kernel with out of memory (OOM) kills… only happen when the kernel detects memory pressure… enforced reactively".
- CFS 주기 100ms(위 kubelet 기본). limit 0.5 CPU = 주기마다 50ms quota → 멀티스레드가 20ms 안에 50ms를 다 쓰면 나머지 80ms 정지. 평균 사용률은 낮아도 p99 지연이 튄다(문서는 메커니즘까지만, 수치 예는 의사 예시로 표시할 것).
- 같은 문서 670–721행: `Last State: Terminated / Reason: OOMKilled / Exit Code: 137`, "container in the Pod was terminated and restarted five times". 137 = 128 + SIGKILL(9).
- 컨테이너 단위 memory.oom.group=1·cgroup OOM 세부는 이미 `cloud/linux-memory-page-cache-oom`에 있음 → 링크로 넘김.

### 1-4. QoS와 oom_score_adj
- `pkg/kubelet/qos/policy.go`: `KubeletOOMScoreAdj -999`, `KubeProxyOOMScoreAdj -999`, `guaranteedOOMScoreAdj -997`, `besteffortOOMScoreAdj 1000`, Burstable = `1000 − 1000·memRequest/memoryCapacity`, 하한 `1000 + (−997) = 3`, 1000이면 999로. 주석 예: 노드 메모리 10% 요청 → 900.
- QoS 판정(문서 `concepts/workloads/pods/pod-qos.md` 35–80행): Guaranteed = 모든 컨테이너가 cpu·memory 모두 request = limit(>0). 하나라도 request/limit가 있으면 Burstable. 아무것도 없으면 BestEffort.
- **이미 블로그에 있음**: linux-memory-page-cache-oom이 같은 policy.go 값과 Burstable 식을 인용. K8s 글에서는 QoS를 "eviction·OOM 순위 추정"으로만 쓰고 계산은 링크.

### 1-5. node-pressure eviction 순서 (QoS가 직접 기준이 아님)
- 문서 `concepts/scheduling-eviction/node-pressure-eviction.md` 343–363행: 기준 ① 사용량이 requests를 넘었나 ② Pod Priority ③ requests 대비 사용량. 순서: requests 초과한 BestEffort·Burstable(우선순위→초과량 순) → requests 이하인 Guaranteed·Burstable(우선순위 순). **"The kubelet does not use the pod's QoS class to determine the eviction order."** DiskPressure에는 QoS 추정도 안 맞음.
- eviction은 kubelet이 Pod를 Failed(Reason Evicted)로 만드는 것이고, 커널 OOM kill(컨테이너 재시작, 137)과 다른 경로.

### 1-6. LimitRange·ResourceQuota (admission 시점)
- `concepts/policy/limit-range.md` 49·59행: LimitRange admission controller가 request/limit 기본값을 채움; "LimitRange validations occur only at Pod admission stage, not on running Pods."
- `concepts/policy/resource-quotas.md` 48–53행: 위반 시 `403 Forbidden`; cpu·memory quota가 있으면 requests/limits를 안 쓴 Pod는 생성이 거부될 수 있음. → Deployment는 성공했는데 ReplicaSet이 Pod를 못 만드는 장애(ReplicaSet event `FailedCreate`)와 연결.

## 2. 실패 상태

### 2-1. Pending
- 미배치(nodeName 없음): FailedScheduling event, `PodScheduled=False reason Unschedulable` (위 1-2 메시지). 원인 갈래: requests 부족, affinity·taint, PVC 미바인딩(volume binding), 노드 0.
- 배치 후(nodeName 있음) `ContainerCreating`: sandbox·CNI·volume mount·image pull 단계. event `FailedMount`, `FailedCreatePodSandBox`.

### 2-2. ImagePullBackOff
- `pkg/kubelet/images/types.go`: `ErrImagePull`, `ErrImagePullBackOff("ImagePullBackOff")`, `ErrInvalidImageName`, `ErrImageNeverPull`. 처음 실패 → ErrImagePull, 재시도 대기 중 → ImagePullBackOff.
- `pkg/kubelet/kubelet.go` 180·227·728행: `imageBackOffPeriod 10s`, `MaxImageBackOff 300s` (`flowcontrol.NewBackOff(10s, 300s)`).

### 2-3. CrashLoopBackOff (소스 확인)
- `pkg/kubelet/kubelet.go` 166–178행: `initialCrashLoopBackOff = 10s`, `MaxCrashLoopBackOff = v1beta1.MaxContainerBackOff`(= `pkg/kubelet/apis/config/v1beta1/defaults.go` 45행 **300s**). 1095–1100행: `flowcontrol.NewBackOff(base, boMax)` → 10·20·40·80·160·300·300초. `HasExpiredFunc`: 마지막 갱신 후 **600초(10분)** 넘게 크래시가 없으면 backoff 초기화.
- 최근 변경(KEP):
  - `KubeletCrashLoopBackOffMax`(kube_features.go 주석 `kep.k8s.io/5593`): 1.32 alpha → **1.35 beta·기본 on**. kubelet 설정 `crashLoopBackOff.maxContainerRestartPeriod`로 노드별 상한 조정. 기본값은 여전히 300s(defaults.go 312행).
  - `ReduceDefaultCrashLoopBackOffDecay`(KEP-4603): 1.33 alpha, 기본 off. 켜면 초기 1s·상한 60s(kubelet.go 169–178행).
- 문서 `concepts/workloads/pods/pod-lifecycle.md` 122–222행: CrashLoopBackOff는 "상태"라기보다 backoff 대기 중임을 나타내는 표시; RESTARTS 200 예시; 원인(앱 오류·설정·리소스·liveness 오설정). 진단: `kubectl logs --previous`, `describe`의 Last State·Exit Code.

### 2-4. Node NotReady → Pod 축출까지의 시계
- kubelet(`pkg/kubelet/apis/config/v1beta1/defaults.go` 136–150행): `NodeStatusUpdateFrequency 10s`, `NodeStatusReportFrequency 5m`(변화 없을 때), `NodeLeaseDurationSeconds 40`. 하트비트 두 종류: Node `.status`와 `kube-node-lease` 네임스페이스의 Lease(문서 `concepts/architecture/nodes.md` 190–199행).
- node lifecycle controller(`pkg/controller/nodelifecycle/config/v1alpha1/defaults.go`): `NodeMonitorPeriod 5s`, **`NodeMonitorGracePeriod 50s`**(v1.31까지 40s, 커밋 f8bf6b97b8 2024-07-23 "Update Node Monitor Grace Period default duration to 50s", v1.32.0부터 50s — 두 태그 파일 직접 대조), `NodeStartupGracePeriod 60s`. 50s 근거 주석: HTTP2 ping timeout 30s + read idle 15s보다 커야 함. kube-controller-manager 참조 문서도 `Default: 50s`.
- grace를 넘기면 Ready=Unknown → taint `node.kubernetes.io/unreachable:NoExecute`(NotReady면 `not-ready`). `plugin/pkg/admission/defaulttolerationseconds/admission.go` 44–45행: 모든 Pod에 두 taint에 대한 toleration **300s** 자동 부여 → 그 뒤 축출. 따라서 노드가 꺼지고 Pod가 다른 노드에서 다시 뜨기까지 대략 50s + 300s ≈ 6분(+ 재배치·시작 시간). `PodEvictionTimeout 5m` 필드는 taint 기반 축출 이후 사실상 tolerationSeconds가 대신함(문서 taint-and-toleration 344–352행).

### 2-5. Probe 기본값과 재시작 폭풍
- `pkg/apis/core/v1/defaults.go` 275–288행 `SetDefaults_Probe`: `timeoutSeconds 1`, `periodSeconds 10`, `successThreshold 1`, `failureThreshold 3`(initialDelaySeconds 기본 0). → liveness 기본은 10초 간격 3번 실패(최대 약 30초)면 재시작.
- 문서 `tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md`: startupProbe는 `failureThreshold * periodSeconds` 동안 liveness를 막음(308행); caution(355–359행) "readiness and liveness probes do not depend on each other".
- 폭풍 메커니즘(소스 사실의 조합 — 글에서 의사 예시로 표시): liveness가 DB 같은 공용 의존성을 확인하면 DB 30초 장애에 replica 전부가 동시에 재시작 → 재시작 중 readiness false로 EndpointSlice에서 모두 빠짐 → 서비스 전체 5xx, 복구 후에도 CrashLoopBackOff 대기(10→20→40s)가 회복을 늦춤. 대안: 의존성 확인은 readiness로, liveness는 프로세스 자체 교착만.
- timeoutSeconds 1초 기본: GC pause·CPU throttle(1-3)로 1초를 넘기면 3번 연속에 재시작 — throttle과 liveness가 연결되는 실제 경로.

## 3. Event 읽기

- 보존: `pkg/controlplane/apiserver/options/options.go` 129·162행 `EventTTL: 1 * time.Hour`, 플래그 `--event-ttl`. 1시간 지나면 etcd에서 사라지므로 장애 직후 수집.
- 집계(client-go `tools/record/events_cache.go` 36–48·185행): 같은 (source, object, type, reason) 묶음이 10분(600s) 안에 10개를 넘으면 메시지를 `"(combined from similar events): "`로 합침; 같은 이벤트 반복은 count 증가로 기록; 객체별 spam filter burst 25, 이후 300초에 1개. → `kubectl describe`의 `x15 over 3m` 표기.
- events.k8s.io/v1(`staging/src/k8s.io/api/events/v1/types.go`): `Series{Count, LastObservedTime}`로 반복을 표현, core/v1 count는 `deprecatedCount`. 새 broadcaster(`tools/events/event_broadcaster.go` 50–52행): series 종료 6분, TTL 갱신 30분, 큐 1000(가득 차면 버림 → event는 손실될 수 있는 best-effort 신호).
- 읽는 순서: `kubectl get events --field-selector involvedObject.name=<pod> --sort-by=.metadata.creationTimestamp` (기존 kubernetesData.ts 52행에 이미 있음), owner 체인(Deployment→ReplicaSet→Pod)마다 event를 따로 본다(FailedCreate는 ReplicaSet에, FailedScheduling·BackOff는 Pod에, NodeNotReady는 Node에).

## 4. 흔한 오해 → 정정

1. "노드 CPU 사용률이 낮은데 왜 Pending?" → scheduler는 사용량이 아니라 requests 합 vs Allocatable(resource_fit.go 147행).
2. "Allocatable = 노드 스펙" → Capacity − kube/systemReserved − evictionHard(기본 memory 100Mi 등). 예: 32Gi → 28.5Gi.
3. "eviction 순서 = QoS 순서" → 문서가 명시적으로 부정. 사용량>requests 여부·Priority·초과량.
4. "CPU limit을 넘으면 죽는다" → CPU는 throttle(100ms 주기 quota), 죽는 건 memory(137 OOMKilled). 둘 다 "limit"이지만 증상이 다름.
5. "CrashLoopBackOff는 계속 재시작 중" → 대부분의 시간은 backoff 대기(최대 300s, 10분 무크래시 시 초기화). 1.35부터 노드별 상한 설정 가능.
6. "노드가 죽으면 Pod가 바로 옮겨간다" → grace 50s + toleration 300s ≈ 6분. StatefulSet Pod는 노드가 확인될 때까지 이름 중복 때문에 더 늦을 수 있음(→ StatefulSet 담당 원장에서 확인).
7. (보너스) "liveness로 DB 연결 확인" → 공용 의존성 장애가 전 replica 재시작으로 증폭.

## 5. 기존 블로그 커버리지 (/usr/bin/grep 확인)

| 항목 | kubernetesData.ts | CkaInteractiveLab.tsx | linux-memory-page-cache-oom |
|---|---|---|---|
| requests/limits | "request나 node capacity" 1문장 | limit 4회(실습 맥락) | requests 2·limit 4 |
| Allocatable·eviction 하한 | 0 | 0 | 0 |
| QoS·oom_score_adj | 0 | 0 | **상세(policy.go 값·Burstable 식·oom.group)** |
| OOMKilled·137 | 0 | 0 | 6·10회 |
| CrashLoopBackOff | 0 | 0 | 0 |
| liveness/startup probe | 0 | 0 | 0 |
| readiness | 8(EndpointSlice 맥락) | 0 | 0 |
| Event 보존·집계 | "보존 기간이 짧을 수 있다" 1문장(44행) | describe·events 7회 | 0 |
| CPU throttle·CFS | 0 | 0 | 0 |
| ResourceQuota·LimitRange | 0 | 0 | 0 |
| NotReady 시계(50s·300s) | NotReady 진단 예시만(75–93행) | NotReady 4 | 0 |

→ 새 글에서 채울 공백: Allocatable 계산, requests 기반 스케줄, CPU throttle, CrashLoopBackOff 시계, probe 기본값·폭풍, Node 장애 6분 시계, Event TTL·집계, quota admission. QoS·OOM 계산은 linux 글로 링크.
