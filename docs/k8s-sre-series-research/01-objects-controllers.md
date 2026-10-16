# K8s 운영·SRE 시리즈 조사 원장 01 — 객체·컨트롤러·Node↔Pod (2026-10-16)

범위: (1) Node와 Pod의 관계, (2) Deployment→ReplicaSet→Pod·Job→Pod 생성, (3) 컨트롤러·reconcile 개념.

읽은 판: **kubernetes/kubernetes `v1.37.1`**(GitHub latest release, 2026-09-23 게시) 소스를 raw.githubusercontent.com에서 직접 받아 읽음. 문서는 **kubernetes/website `main`** 의 markdown 원문(2026-10-16 취득). 소스 경로는 모두 `https://github.com/kubernetes/kubernetes/blob/v1.37.1/<경로>` 로 열 수 있다. 줄 번호는 v1.37.1 기준.

## 1. Node ↔ Pod: 누가 무엇을 쓰고 누가 읽나

| 단계 | 사실 | 출처 |
|---|---|---|
| 배치 결정 | scheduler는 filtering → scoring 두 단계로 node를 고르고, 그 결정을 API server에 알리는 과정을 *binding* 이라 부른다. | 문서 `concepts/scheduling-eviction/kube-scheduler.md` (49, 60–72행) |
| binding 실체 | 기본 binder 플러그인은 `v1.Binding{Target: ObjectReference{Kind: "Node", Name: nodeName}}` 를 만들어 Pod의 binding 하위자원에 POST한다. 그 결과 Pod의 `spec.nodeName` 이 채워진다. | `pkg/scheduler/framework/plugins/defaultbinder/default_binder.go` (54–56행), 호출부 `pkg/scheduler/schedule_one.go` `func (sched *Scheduler) bind` (681행) |
| kubelet이 자기 Pod를 아는 법 | kubelet은 모든 namespace의 pods를 **field selector `spec.nodeName=<자기 node 이름>`** 으로 list/watch한다. 즉 kubelet은 "자기 이름이 적힌 Pod" 만 받는다. 그다음 CRI로 runtime에 sandbox·container 생성을 요청한다. | `pkg/kubelet/config/apiserver.go` 37행 `fields.OneTermEqualSelector("spec.nodeName", string(nodeName))` |
| 심장박동 두 종류 | Node heartbeat는 (a) Node `.status` 갱신, (b) `kube-node-lease` namespace의 Node별 Lease 객체 두 가지다. | 문서 `concepts/architecture/nodes.md` 188–199행 |
| Lease 갱신 주기 | kubelet `nodeLeaseDurationSeconds` 기본 **40초**, 갱신 간격 = 40 × `nodeLeaseRenewIntervalFraction` **0.25** = **10초**. | `pkg/kubelet/apis/config/v1beta1/defaults.go` 149–150행, `pkg/kubelet/kubelet.go` 236–237행·1156행 |
| status 갱신 주기 | `nodeStatusUpdateFrequency` 기본 **10초**(kubelet이 상태를 계산하는 주기). 변화가 없으면 실제 API 보고는 `nodeStatusReportFrequency` 기본 **5분**. 업데이트 실패 시 재시도 `nodeStatusUpdateRetry = 5`. | `defaults.go` 136–147행, `kubelet.go` 156행 |
| NotReady/Unknown 판정 | node lifecycle controller의 `NodeMonitorGracePeriod` 기본 **50초**(주석: HTTP2 ping 30s + read idle 15s 합보다 커야 함). 그동안 heartbeat가 없으면 Ready를 `Unknown` 으로 바꾼다. 시작 직후는 `NodeStartupGracePeriod` **60초**. 검사 주기 `--node-monitor-period` 기본 5초(문서). | `pkg/controller/nodelifecycle/config/v1alpha1/defaults.go` 40–49행, 문서 nodes.md |
| Ready=False vs Unknown | 조건 False → taint `node.kubernetes.io/not-ready`, Unknown → `node.kubernetes.io/unreachable`. | `pkg/controller/nodelifecycle/node_lifecycle_controller.go` 76–112행 |
| Pod가 떠나기까지 5분 | DefaultTolerationSeconds admission plugin이 모든 Pod에 not-ready·unreachable toleration **300초** 를 기본으로 붙인다. 그래서 Node가 Unknown이 된 뒤 약 5분이 지나야 Pod eviction이 시작된다. | `plugin/pkg/admission/defaulttolerationseconds/admission.go` 44–45행 |
| eviction 속도 제한 | `--node-eviction-rate` 0.1(10초에 node 1개), zone의 비정상 비율 ≥ `--unhealthy-zone-threshold` 0.55면 `--secondary-node-eviction-rate` 0.01로 낮추고, node ≤ `--large-cluster-size-threshold` 50인 작은 클러스터는 아예 멈춘다. | `cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go` 46–49행, 문서 nodes.md |

**running example 후보**: node `worker-2` 의 kubelet이 죽음 → 10초마다 오던 Lease 갱신이 끊김 → 50초 뒤 Ready=Unknown + unreachable taint → toleration 300초가 지나야 Pod eviction → Deployment의 ReplicaSet이 "Pod 수 부족" 을 보고 새 Pod 생성 → scheduler가 다른 node에 binding. 대략 **50 s + 300 s ≈ 6분** 동안 그 node의 Pod는 Terminating/Unknown 처럼 보인다(정확한 합은 감지 시점에 따라 달라짐; 실측 아님).

## 2. Deployment → ReplicaSet → Pod

| 사실 | 값 | 출처 |
|---|---|---|
| Deployment 기본값 | RollingUpdate `maxUnavailable` **25%**, `maxSurge` **25%**, `revisionHistoryLimit` **10**, `progressDeadlineSeconds` **600** | `pkg/apis/apps/v1/defaults.go` 34–71행 |
| 25% 반올림 방향 | `ResolveFenceposts`: surge는 **올림**(roundUp=true), unavailable은 **내림**. 둘 다 0이 되면 unavailable을 1로 강제. 예: replicas 3 → surge ceil(0.75)=1, unavailable floor(0.75)=0 → 최대 4개, 최소 3개 가용. replicas 10 → surge 3, unavailable 2. | `pkg/controller/deployment/util/deployment_util.go` 883–902행; 문서 deployment.md 266–269행("at least 75% … at most 125%") |
| 새 ReplicaSet이 생기는 조건 | rollout(새 revision)은 **`.spec.template` 이 바뀔 때에만** 일어난다. replicas만 바꾸면 기존 RS의 숫자만 바뀐다. | 문서 deployment.md 167·386행 |
| pod-template-hash | Deployment 컨트롤러가 template 해시 `ComputeHash(template, collisionCount)` 를 라벨 `pod-template-hash` 로 RS template·selector에 붙인다. 문서: "Do not change this label." | `pkg/controller/deployment/sync.go` 198–201행, 문서 deployment.md 156행 |
| 진행 정체 | `progressDeadlineSeconds` 넘기면 condition `Progressing=False reason=ProgressDeadlineExceeded`. 컨트롤러가 롤백을 자동으로 하지는 않는다(문서: higher-level orchestrator가 행동). | 문서 deployment.md 958–967, 1034행 |
| RS의 reconcile 본체 | `manageReplicas`: `diff = len(activePods) - spec.replicas`. 부족하면 생성, 많으면 삭제. 한 번에 최대 `BurstReplicas = 500`. | `pkg/controller/replicaset/replica_set.go` 74·649–720행 |
| slow start | 생성은 배치 1, 2, 4, 8 … 로 두 배씩(`SlowStartInitialBatchSize = 1`). 배치 하나가 실패하면 나머지는 시도하지 않는다. 주석 이유: quota가 낮을 때 같은 오류로 API·event 폭주 방지. | 같은 파일 669–690·876–887행, `pkg/controller/controller_utils.go` 73–87행 |
| expectations | 만든/지운 개수를 기대값으로 기록하고 informer가 관찰할 때까지 다시 세지 않음. 관찰 못 하면 `ExpectationsTimeout = 5분` 뒤 만료. | `controller_utils.go` 72·226행 |
| 줄일 때 누구를 먼저 지우나 | 1) 미배치 < 배치됨 2) Pending < Unknown < Running 3) NotReady < Ready 4) `pod-deletion-cost` 낮은 쪽 5) 같은 node에 형제가 많은 쪽 6) Ready 된 지 짧은 쪽 7) 재시작 많은 쪽 8) 더 새 Pod — 순으로 먼저 삭제. | `controller_utils.go` 841–866행 `ActivePodsWithRanks.Less` |
| 소유 관계 | RS가 만든 Pod에는 `ownerReferences`(controller=true)가 붙는다. `ClaimPods`는 selector가 맞는 **고아 Pod를 입양**하고, selector가 더 이상 맞지 않는 **소유 Pod를 놓아준다(release)**. | `pkg/controller/controller_ref_manager.go` 169–182행 |
| 교차 namespace owner | 금지. 위반 시 GC가 `OwnerRefInvalidNamespace` 경고 event. | 문서 `concepts/overview/working-with-objects/owners-dependents.md` 47–61행 |

## 3. Job → Pod

| 사실 | 값 | 출처 |
|---|---|---|
| 기본값 | completions·parallelism 둘 다 없으면 **1·1**. `backoffLimit` **6**(단 `backoffLimitPerIndex` 지정 시 MaxInt32). `completionMode` NonIndexed, `suspend` false. | `pkg/apis/batch/v1/defaults.go` 35–58행 |
| podReplacementPolicy 기본 | `podFailurePolicy` 가 있으면 **Failed**(완전히 끝난 뒤 교체), 없으면 **TerminatingOrFailed**(종료 시작 즉시 교체). | 같은 파일 60–65행 |
| 재생성 지연 | 실패 Pod 재생성은 10s, 20s, 40s … 두 배씩, 상한 **10분**. 코드: `DefaultJobPodFailureBackOff = 10*time.Second`, `MaxJobPodFailureBackOff = 10*time.Minute`. 횟수는 **마지막 성공 이후 연속 실패 수**(`failuresAfterLastSuccess`) 기준. | `pkg/controller/job/job_controller.go` 76–79행, `pkg/controller/job/backoff_utils.go` 236–276행; 문서 job.md 517–518행 "capped at ten minutes" |
| 실패를 세는 두 방식 | (a) `status.phase=Failed` Pod 수, (b) `restartPolicy=OnFailure` 면 Pending/Running Pod 안 container 재시작 수. 어느 쪽이든 backoffLimit에 닿으면 Job 실패. OnFailure면 한도 도달 시 Pod가 종료되어 디버깅이 어렵다는 문서 경고. | 문서 job.md 520–535행 |
| deadline 우선 | `activeDeadlineSeconds` 가 `backoffLimit` 보다 우선. | 문서 job.md 773행 |
| 자동 정리 | `ttlSecondsAfterFinished` 로 끝난 Job(과 Pod) 삭제. 문서는 설정을 권장(관리되지 않는 Job이 쌓임). | 문서 job.md 883–917행 |
| API 재시도 | Job 컨트롤러 workqueue는 지수 rate limiter 1s → 최대 1분(`DefaultJobApiBackOff`, `MaxJobApiBackOff`). 이건 Pod 실패 지연과 다른 층. | `job_controller.go` 71–75·262행 |

## 4. 컨트롤러·reconcile

| 사실 | 출처 |
|---|---|
| 문서 정의: control loop는 온도조절기처럼 desired state(spec)와 current state(status)를 비교해 가까이 가도록 행동한다. Job 예: "desired state는 Job이 완료되는 것". | 문서 `concepts/architecture/controller.md` 9–32·69–71행 |
| 커뮤니티 컨트롤러 지침: **"Level driven, not edge driven."** 컨트롤러는 한동안 꺼져 있다 돌아올 수 있으므로 "무엇이 바뀌었나" 가 아니라 "지금 상태가 목표와 같은가" 로 판단해야 한다. 한 번에 한 item, workqueue는 같은 key를 두 worker가 동시에 처리하지 않음을 보장, shared cache 객체를 직접 수정 금지, 오류는 위로 올려 rate-limited requeue. | `kubernetes/community` `contributors/devel/sig-api-machinery/controllers.md` 21·29·41·55행 |
| informer resync: 주기적으로 캐시의 모든 객체에 대해 Update 핸들러를 다시 호출(API 재조회 아님). | 같은 문서 59행, client-go `tools/cache/shared_informer.go` 147–163행 |
| 기본 컨트롤러 rate limiter: item별 지수 **5ms → 1000s** 와 전체 token bucket **10 qps / burst 100** 중 큰 값. | `staging/src/k8s.io/client-go/util/workqueue/default_rate_limiters.go` 50–55행 |
| RS 소유 Pod를 지우면: Pod 삭제 event → RS key가 workqueue에 들어감 → `manageReplicas` 에서 diff < 0 → 새 Pod 생성(새 이름·새 UID). "되살아난" 게 아니라 **다른 Pod**. | `replica_set.go` 649행 이하 |
| GC: 기본 **background** cascading deletion(owner 먼저 지우고 dependents는 GC가 나중에). foreground는 owner에 `deletionTimestamp`·`foregroundDeletion` finalizer를 걸고 `blockOwnerDeletion=true` dependents를 먼저 지운다. orphan 옵션은 dependents를 남긴다. | 문서 `concepts/architecture/garbage-collection.md` 78–114행, owners-dependents.md 33–39·81행 |

## 5. 흔한 오해 (정정 + 근거)

1. **"Deployment가 관리하는 Pod를 `kubectl edit` 로 고치면 컨트롤러가 즉시 되돌린다."** → 반만 맞다. Pod는 대부분 필드가 불변이고 image·activeDeadlineSeconds·terminationGracePeriodSeconds·tolerations(추가만)·schedulingGates 정도만 바뀐다. ReplicaSet은 **개수만** 맞추고 "기존 Pod를 새 template에 맞추려 하지 않는다". 그래서 Pod의 image를 직접 바꾸면 그 Pod는 바뀐 채로 남다가, 삭제·재생성될 때 template대로 돌아온다. 반면 **라벨**을 바꿔 selector에서 빠지면 RS가 그 Pod를 release하고 새 Pod를 하나 더 만든다(격리 디버깅 기법). — 문서 pods/_index.md 229–255행, replicaset.md 317·335행, controller_ref_manager.go 169–172행.
2. **"Job 재시도 지연 상한은 6분."** → 현재 문서·코드 모두 **10분**(`MaxJobPodFailureBackOff = 10*time.Minute`). 옛 문서·블로그에 6분 표기가 남아 있을 수 있음(과거 판 문구는 직접 확인 안 함 — *미검증*).
3. **"node가 죽으면 Pod는 즉시 다른 node로 옮겨진다."** → 감지 50초 + 기본 toleration 300초 뒤에야 eviction이 시작되고, Pod는 "이동" 이 아니라 **삭제 후 컨트롤러가 새로 생성**한다. 컨트롤러 없는 bare Pod는 그냥 사라진다. 작은 클러스터(≤50 node)에서 zone 전체가 비정상이면 eviction 자체가 멈춘다. — 위 1절 표.
4. **"`kube-controller-manager --pod-eviction-timeout` 으로 5분을 조정한다."** → 설정 구조체에 `PodEvictionTimeout`(기본 5분)이 남아 있지만 v1.37.1 `node_lifecycle_controller.go` 에는 참조가 없다. 실제 5분은 DefaultTolerationSeconds 300초에서 나오며 `--default-not-ready-toleration-seconds`·`--default-unreachable-toleration-seconds`(kube-apiserver admission) 또는 Pod의 toleration으로 조정한다. — `nodelifecycle/config/v1alpha1/defaults.go` 37–38행, `kube-controller-manager/config/v1alpha1/types.go` 424–425행, admission.go 44–56행. (플래그 제거 시점은 *미검증*.)
5. **"replicas만 바꿔도 rollout 이력이 생긴다 / rollback 대상이 된다."** → 새 revision은 `.spec.template` 이 바뀔 때만. scale은 revision을 만들지 않는다. — 문서 deployment.md 167·386행.
6. (보조) **"maxSurge 25%, replicas 3이면 0.75개라 surge가 0."** → surge는 올림이라 1, unavailable은 내림이라 0. — `ResolveFenceposts`.

## 6. 블로그 기존 커버리지 (2026-10-16, `/usr/bin/grep -c -i`)

파일: `src/pages/articles/cloud/kubernetesData.ts`(request-path 글의 본문 데이터), `kubernetes-request-path-and-cka.tsx`(16줄 조립 파일), `kubernetes-network-packet-path.tsx`, `CkaInteractiveLab.tsx`.

| 키워드 | Data | request-path | packet-path | CkaLab |
|---|---|---|---|---|
| ReplicaSet / ownerReference / pod-template-hash | 0 | 0 | 0 | 0 |
| maxSurge / maxUnavailable | 0 | 0 | 0 | 0 |
| backoffLimit / ttlSecondsAfterFinished / podFailurePolicy | 0 | 0 | 0 | 0 |
| garbage / cascad / informer / reconcil | 0 | 0 | 0 | 0 |
| Lease (kube-node-lease 0) | 1 | 0 | 3 | 0 |
| kubelet | 16 | 0 | 0 | 5 |
| nodeName | 3 | 0 | 0 | 1 |
| Binding | 4 | 0 | 0 | 0 |
| control loop / desired | 2 / 3 | 0 | 1 / 0 | 0 |

이미 있는 것: scheduler가 binding을 기록하고 kubelet이 CRI·CNI·CSI로 sandbox를 만든다는 책임 경계(Data 173–182행), Node NotReady에서 kubelet·containerd 확인 명령과 예시 출력(75–94행, "실측 아님" 표기), "원하는 상태와의 차이를 반복해서 줄인다" 한 문단(171행), Deployment desired 3 / ready 2 사례(154행).
없는 것: RS 계층·ownerReferences·입양/release, rollout 반올림·revision 조건·ProgressDeadlineExceeded, Job 기본값·지수 backoff·podReplacementPolicy·ttl, GC 전파 정책, Lease 주기와 50 s/300 s 타임라인, level-triggered·workqueue·expectations·slow start.

## 7. 확인 못 한 것
- 각 기본값이 바뀐 버전 이력(예: NodeMonitorGracePeriod 40s→50s 시점, Job 상한 6분→10분 시점)은 릴리스 노트를 열지 않았다.
- `--pod-eviction-timeout` 플래그가 kube-controller-manager에서 언제 제거·무시되었는지 미확인(위 4번은 v1.37.1 소스에 참조 없음까지만 확인).
- 위 타임라인 숫자(≈6분)는 소스 기본값의 합이며 실측이 아니다.
