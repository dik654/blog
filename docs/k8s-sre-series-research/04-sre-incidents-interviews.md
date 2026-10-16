# Kubernetes 운영·SRE 시리즈 — 조사 원장 04: SRE 관점·실제 장애·면접 (2026-10-16)

요청 맥락: "쿠버네티스 운영에 있어서 이런 개념 자체를 쌓는게 필요해 그리고 다른 부분들도" → "SRE 관점에서도". 이 파일은 SRE 1차 자료, 공개 장애 사후 분석, 면접·자격 범위만 다룬다. 모든 항목은 이 조사에서 직접 열어 읽은 페이지다. 열지 못한 것은 그렇게 적었다.

## 1. Google SRE 1차 자료 (sre.google)

### SLI · SLO · SLA — SRE Book ch.4 "Service Level Objectives"
URL: https://sre.google/sre-book/service-level-objectives/
- SLI: "a carefully defined quantitative measure of some aspect of the level of service that is provided."
- SLO: "a target value or range of values for a service level that is measured by an SLI."
- SLA: "an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs they contain."
- 평균 대신 percentile: 보통 요청 약 50ms, 5%가 20배 느린(약 1,000ms) 경우 평균 경보는 하루 종일 변화가 없을 수 있다. 예시 SLO 문장: "99% of `Get` RPC calls will complete in less than 100 ms."

### Error budget — SRE Book ch.3 "Embracing Risk"
URL: https://sre.google/sre-book/embracing-risk/
- 분기 SLO 99.999%이면 budget은 0.001% 실패율. 어떤 문제가 예상 쿼리의 0.0002%를 실패시키면 그 분기 budget의 20%를 쓴다.
- budget이 남아 있으면 release 진행, 소진되면 release를 일시 중단하고 테스트·복원력에 투자. 소진에 가까워지면 release 속도를 늦추거나 rollback. Product와 SRE가 함께 정하고 중립적인 monitoring이 측정 → 협상 대신 숫자로 결정.

### 다중 창·다중 소진율 경보 — SRE Workbook ch.5 "Alerting on SLOs"
URL: https://sre.google/workbook/alerting-on-slos/
- 기준 SLO: 30일 99.9%. "a constant 0.1% error rate uses exactly all of the error budget: a burn rate of 1."
- 소진한 budget 비율 = burn rate × 경보 창 길이 / SLO 기간(30일). 예: 14.4 × 1h / 720h = 2%.
- Table 5-8 (99.9% SLO 권장값):

| 대응 | 긴 창 | 짧은 창 | burn rate | 소진 budget |
|---|---|---|---|---|
| Page | 1시간 | 5분 | 14.4 | 2% |
| Page | 6시간 | 30분 | 6 | 5% |
| Ticket | 3일 | 6시간 | 1 | 10% |

- 임계값은 burn rate × (1 − SLO): 예 `job:slo_errors_per_request:ratio_rate1h{job="myjob"} > (14.4*0.001)`.
- "A good guideline is to make the short window 1/12 the duration of the long window." 짧은 창은 이미 끝난 사건에 경보가 계속 울리는 것(reset 지연)을 막는다.

### 네 가지 golden signal — SRE Book ch.6 "Monitoring Distributed Systems"
URL: https://sre.google/sre-book/monitoring-distributed-systems/
- "The four golden signals of monitoring are latency, traffic, errors, and saturation."
- "It's important to distinguish between the latency of successful requests and the latency of failed requests." 빠른 500이 평균 지연을 좋아 보이게 만든다.
- "what's broken, and why?" — what=증상, why=원인. Page는 증상(사용자 경험)에 걸고 원인 지표는 디버깅 보조로.

### Toil — SRE Book ch.5 "Eliminating Toil"
URL: https://sre.google/sre-book/eliminating-toil/
- 특성: manual, repetitive, automatable, tactical(인터럽트 주도), no enduring value(끝나도 서비스 상태가 그대로), O(n) with service growth.
- 각 SRE 시간의 50% 미만을 운영(toil)에 쓰는 것을 목표로, 나머지는 engineering project.
- k8s 연결점(가정, 글에서 그렇게 표시): 수동 `kubectl rollout restart`·노드 drain 반복은 toil 후보, controller/operator가 그 자동화의 k8s식 형태.

### Postmortem — SRE Book ch.15 "Postmortem Culture"
URL: https://sre.google/sre-book/postmortem-culture/
- 작성 기준(사전 정의): 일정 기준 이상의 사용자 가시 중단·저하, "Data loss of any kind", on-call 개입(rollback·트래픽 우회), 기준 이상의 해결 시간, monitoring 실패(대개 사람이 직접 발견), 이해관계자 요청.
- Blameless: 개인·팀의 "bad or inappropriate behavior"를 탓하지 않고, 당시 정보로 최선의 판단을 했다고 가정하고 시스템·절차를 고친다.

### NALSD — SRE Workbook ch.12 "Non-Abstract Large System Design"
URL: https://sre.google/workbook/non-abstract-design/
- "a skill critical to SRE." 단계: Is it possible? → Can we do better? → Is it feasible? → Is it resilient?
- 예: 초당 50만 검색 쿼리 × 2KB ≈ 하루 86.4TB → 100TB를 64GB RAM 머신에 담으면 약 1,563대 → 단일 머신 설계 불가.
- 주의: 이 장 자체는 "면접에 나온다"고 쓰지 않는다. 면접 연결은 제3자 가이드(아래 §3)로만 말한다.

## 2. 공개 Kubernetes 장애 사후 분석 (직접 연 원문)

목록 출처: Henning Jacobs, Kubernetes Failure Stories — https://k8s.af/ (태그별 큐레이션; 개별 원문을 따로 열어 확인).

### 2-1. Reddit "You Broke Reddit: The Pi-Day Outage" (2023-03-14) — 업그레이드·label·selector·admission webhook
- 원문: https://www.reddit.com/r/RedditEng/comments/11xx5o0/you_broke_reddit_the_piday_outage/ (reddit.com 직접 접근 차단 → Wayback 사본 20260826130053을 열어 읽음)
- 타임라인: 가장 오래되고 큰 cluster(Old Reddit 경로)를 1.23→1.24로 업그레이드, 19:00 UTC 직후 시작, 약 2분 뒤 사이트 정지. 총 **314분** 중단.
- 시도: control plane 전체 껐다 켜기(효과 없음) → API server 로그에 write 타임아웃, 정확히는 **admission controller webhook 호출 타임아웃** 발견 → 전 리소스를 보는 OPA webhook 설정 삭제 → 타임아웃은 즉시 사라졌지만 cluster는 회복 안 됨 → 수 시간 뒤 rollback(**백업에서 복원**) 결정. "Restoring from a backup is scary, and we hate it."
- 근인(proximate): Calico route reflector의 nodeSelector·peerSelector가 `node-role.kubernetes.io/master`를 대상으로 함. 1.20대에 master→control-plane 용어 변경, **1.24에서 실행 중 cluster에서도 master 참조 제거** → selector가 0개 노드에 매칭 → route reflector 소멸 → pod 간 경로 전파 중단.
- 시스템적 원인(원문 표현): "Inconsistency" — cluster마다 bespoke 구성. 조치 방향: 구성 표준화·코드화, pre-production cluster 확충, cluster 수명주기 도구.
- 시리즈 연결: label/selector가 controller·DaemonSet·Service를 묶는 접착제라는 개념, 업그레이드 deprecation 확인, webhook failurePolicy.

### 2-2. Zalando "Total DNS outage in Kubernetes cluster" (2019-01-07) — CoreDNS OOMKill·ndots·재시도 폭주
- 원문: https://github.com/zalando-incubator/kubernetes-on-aws/blob/dev/docs/postmortems/jan-2019-dns-outage.md
- 흐름: 비핵심 downstream 타임아웃 → aggregation layer가 404, 클라이언트 재시도로 요청 급증 → DNS 쿼리 급증 → CoreDNS pod들이 **동시에 OOMKill** → 일정한 DNS 부하 때문에 계속 OOM 반복(회복 불가) → cluster 전체 DNS 불능 → circuit breaker 개방 → 고객 오류 **1시간 이상**.
- 근인: CoreDNS memory limit "100Mi"(과거 사용량 기준). 조치: limit "2000Mi"로 상향 후 회복.
- 기여 요인: Node.js 기본 DNS 해석에 캐시 없음, **ndots:5** 때문에 외부 이름 1회 조회가 "10 DNS queries for every single DNS lookup", HTTP 연결 수명이 짧아 재조회 증가, CoreDNS에 VPA 미적용, **cluster 내부 monitoring이 cluster 건강에 의존해 paging 지연**.
- 후속: 노드마다 dnsmasq 앞단 캐시, cluster 외부에서의 경보, paging 실패 시 직접 escalation.
- ndots 1차 확인: https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/ — Pod resolv.conf 예 `search <namespace>.svc.cluster.local svc.cluster.local cluster.local` / `options ndots:5`. (ndots 의미 자체는 이 페이지에 설명이 없음 → resolv.conf(5) man page로 따로 인용할 것: 점이 ndots보다 적은 이름은 search 도메인을 먼저 붙여 본다.)

### 2-3. CPU limit과 CFS throttling — kubernetes/kubernetes#67577 "CFS quotas can lead to unnecessary throttling" (2018-08-20 개설, 2020-11-01 종료)
- 원문: https://github.com/kubernetes/kubernetes/issues/67577
- 증상: 사용량이 limit보다 훨씬 낮은데 throttle. 40m→100m·200m로 올려도 throttle 보고.
- 커널 사슬(이슈 댓글 기준): `51f2176d74ac` "sched/fair: Fix unlocked reads of some cfs_b->quota/period"(v3.16-rc1에서 버그 유입) → `512ac999` "Fix bandwidth timer clock drift condition"(v4.18-rc4, 또 다른 버그 유입) → `de53fd7ae` "Fix low cpu usage with high throttling by removing expiration of cpu-local slices"(수정).
- 백포트(댓글): Ubuntu 4.15.0-67+, 5.3.0-24+, RHEL7 3.10.0-1062.8.1.el7, stable 4.14.154 / 4.19.84 / 5.3.9 / 5.4-rc1. "5.4 이상이면 둘 다 포함"은 댓글 작성자의 해석임을 표시할 것.
- 주의: 커널 수정 후에도 **CFS 주기(기본 100ms) 안에서 quota를 다 쓰면 정상 동작으로 throttle**된다는 구분을 글에서 해야 함(버그 throttle vs 설계상 throttle). 주기 100ms는 커널 문서 Documentation/scheduler/sched-bwc.rst로 따로 확인 필요(이번에 열지 않음).
- 사례 원문 Omio 블로그(medium.com/omio-engineering/…)는 403으로 열지 못함 → 인용하지 않음.

### 2-4. NRE Labs (2018-12-04) — liveness probe가 건강한 etcd를 죽임
- 원문: https://oswalt.dev/2018/12/december-4-nre-labs-outage-post-mortem/ (구 keepingitclassless.net)
- 증상: `kubectl` "connection to the server …:6443 was refused", kube-apiserver 컨테이너 없음. kubelet 재시작으로 잠시 복구 → 재발. kube-system의 etcd·apiserver pod **재시작 183회**, controller-manager 91회. 작성자는 `Running`만 확인해 재시작 수를 놓침.
- cluster를 terraform으로 재생성(약 30분)해도 재발 → API server가 약 1.5–2분마다 내려감.
- 근인: kubeadm 단일 etcd static pod의 liveness probe(`etcdctl get foo`, `failureThreshold: 8`, `timeoutSeconds: 15` → 약 2분)가 실패를 보고 → kubelet이 etcd를 재시작(SIGTERM 로그). "Etcd wasn't actually unhealthy, the kubelet just thought it was." probe가 왜 실패했는지는 미해결(수동 실행은 exit 0).
- 조치: etcd manifest에서 liveness probe 제거. 후속: 단일 master monitoring 강화, 장애 안내 페이지.
- 시리즈 연결: probe 종류별 결과(liveness=재시작, readiness=endpoint 제외), 재시작 수·`--previous` 로그, 단일 etcd의 영향 범위.

### 2-5. Blue Matador "Post Mortem: Kubernetes Node OOM" (2019-06-15~16) — requests/limits 없는 DaemonSet
- 원문: https://www.bluematador.com/blog/post-mortem-kubernetes-node-oom
- 이틀 연속 production 노드 SystemOOM. 원인 메모리는 requests·limits가 없던 `fluentd-sumologic` pod. 애플리케이션 pod는 무사, 노드도 곧 회복.
- 작성자가 처음 놓친 이유: 별도 namespace라 `kubectl get pods`(기본 namespace)에 재시작이 안 보임. 교훈 "Check all your namespaces when checking for restarted pods".
- 조치: requests 128Mi/100m, limits 1024Mi/250m 설정(`kubectl top pods`로 산정), Ruby GC 변수, 후속으로 LimitRange·ResourceQuota. 디스크 I/O 급증의 근인은 미확정.
- 시리즈 연결: requests/limits·QoS(BestEffort가 먼저 희생), 노드 OOM vs 컨테이너 OOMKill 구분, LimitRange 기본값.

### 2-6. loveholidays "When GKE ran out of IP addresses" — autoscaler가 IP 한도에 막힘
- 원문: https://deploy.live/blog/when-gke-ran-out-of-ip-addresses/
- 증상: 수 분이면 끝나던 배포가 약 1시간 정지, 새 pod 절반이 Pending, scheduler 메시지 "0/256 nodes are available"(CPU·메모리 부족). Cluster Autoscaler가 노드를 못 늘림.
- 메커니즘: pod용 secondary range /16 = 65,536 IP. GKE 기본 노드당 최대 110 pod → 노드당 2배 이상으로 올림한 /24(256 IP) 예약 → 65,536/256 = **256노드 상한**. 팀 기대치는 65,536/110 ≈ 595노드.
- 조치: pod 밀도가 낮아도 되는 node pool의 max pods per node 축소(IP 사용 약 30% 절감), 일부 노드 대형화(장애 반경 증가 trade-off).
- 디버그: `kubectl describe -n kube-system configmap cluster-autoscaler-status`, `kubectl get node NODE -ojson | jq .status.allocatable.pods`.
- 시리즈 연결: Pending의 원인이 "자원 부족"으로 보여도 autoscaler 쪽 한도일 수 있음, Allocatable의 pods 항목.

### 2-7. Datadog 2023-03-08 — systemd 업데이트가 Cilium 경로 삭제
- 이미 `docs/linux-server-series-research.md` §실제 장애 사례에 정리. 링크만: https://www.datadoghq.com/blog/engineering/2023-03-08-deep-dive-into-platform-level-impact/

열지 못했거나 이번에 쓰지 않은 것: Omio CPU throttling 블로그(403), Jetstack webhook 장애 글(404, URL 이전 추정), Monzo 2017 etcd/linkerd 영상(영상이라 원문 확인 안 함).

### 사례 → 개념 매핑 (시리즈 설계용)
| 사례 | 주 개념 | 증상 | 확인 경로 |
|---|---|---|---|
| Reddit Pi-Day | label·selector, 업그레이드 deprecation, admission webhook | 전체 라우팅 붕괴, API write 타임아웃 | API server 로그, selector 매칭 노드 수 |
| Zalando DNS | memory limit·OOMKill, ndots, 재시도 증폭 | cluster 전체 DNS 불능 | OOMKilled 이유, 재시작 수, DNS QPS |
| #67577 | CPU limit·CFS quota | limit 미만인데 지연 | `nr_throttled`·`throttled_time`(cgroup cpu.stat) |
| NRE Labs | liveness probe, static pod, etcd 단일점 | apiserver 2분 주기 소실 | RESTARTS 열, probe 설정 |
| Blue Matador | requests/limits 부재, QoS, namespace | 노드 SystemOOM | 전 namespace 재시작, `kubectl top` |
| loveholidays | autoscaler, pod CIDR, Allocatable pods | Pending, "0/256 nodes" | autoscaler status configmap |
| Datadog | 노드 OS 변경과 CNI | 노드 오프라인 | (Linux 시리즈) |

## 3. 면접·자격 범위

### CKA 공식 범위 — Linux Foundation (Kubernetes v1.37, 2시간, 실기)
URL: https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/ · 커리큘럼 PDF 저장소 https://github.com/cncf/curriculum (현재 `CKA_Curriculum_v1.37.pdf`, `CKAD_Curriculum_v1.37.pdf`. 문서 major.minor = Kubernetes 버전)

| 영역 | 비중 | 시리즈와 겹치는 항목 |
|---|---|---|
| Troubleshooting | 30% | cluster·node 진단, control plane 진단, 자원 사용 monitoring, container 출력 스트림, service·networking 진단 |
| Cluster Architecture, Installation & Configuration | 25% | RBAC, kubeadm, cluster lifecycle, HA control plane, Helm·Kustomize, CNI·CSI·CRI, CRD·operator |
| Services & Networking | 20% | Pod 간 연결, NetworkPolicy, ClusterIP·NodePort·LoadBalancer와 endpoints, Gateway API, Ingress, CoreDNS |
| Workloads & Scheduling | 15% | rolling update·rollback, ConfigMap·Secret, workload autoscaling, self-healing primitive, admission·scheduling(resource limits, node affinity) |
| Storage | 10% | StorageClass·dynamic provisioning, volume type·access mode·reclaim policy, PV·PVC |

주의: 블로그 기존 `cloud/kubernetes-request-path-and-cka`(kubernetesData.ts)는 시간 배분을 "Troubleshooting 30% 12시간 …"으로 적어 두었다. 비중은 현재 공식과 같음을 이번에 재확인. 버전 문구가 있으면 v1.37로 맞는지 확인할 것.

### 공개 질문 모음 — 커뮤니티 (자기 작성 질문지, 회사 공식 아님)
URL: https://github.com/bregman-arie/devops-exercises/blob/master/topics/kubernetes/README.md (본문 108k자 중 앞 100k자 읽음)
사용자가 준 8개 항목과 그대로 겹치는 실제 질문(원문 그대로):
- Pod/Node: "True or False? A single Pod can be split across multiple nodes", "What happens to running pods if if you stop Kubelet on the worker nodes?"
- Deployment/ReplicaSet: "What happens after you edit a deployment and change the image?", "What will happen when a Pod, created by ReplicaSet, is deleted directly with `kubectl delete po ...`?", "Is it possible to delete ReplicaSet without deleting the Pods it created?"
- 자원: "What happens what pods are using too much memory? (more than its limit)", "True or False? Memory is a compressible resource…", "What QoS classes are there?"
- 상태: "…you see the status is "CrashLoopBackOff". What could possibly went wrong and what do you do to confirm?", "You try to run a Pod but it's in "Pending" state. What might be the reason?"
- Service: "Describe in detail what happens when you create a service", "How readiness probe status affect Services when they are combined?"
- Storage: "True or False? Persistent Volume must be available to all nodes because the pod can restart on any of them"
- Controller: "What is the control loop? How it works?"
- 시나리오: "Users unable to reach an application running on a Pod on Kubernetes. What might be the issue and how to check?"
- 이 질문지 자체도 Event·PV/PVC 항목이 얇다(관찰). 빈도 통계는 없음 → 글에서 "자주 나온다"는 수치 주장 금지, "공개 질문지에 이런 질문이 있다"로만.

### SRE 면접 형식 — 기존 원장 재사용
`docs/linux-server-series-research.md` §면접 표(aced.io Google SRE 가이드: 45분 production troubleshooting, NALSD 성격의 설계 라운드; Meta PE 후기 = Glassdoor 등 익명 자기보고)를 그대로 링크한다. 국내 대기업 공식 k8s/SRE 질문 목록은 이번에도 찾지 않았고 확인된 것 없음.

## 4. 블로그 기존 SRE·관측 커버리지 (중복 회피용)

| 글 | 이미 다루는 것 | 시리즈에서의 처리 |
|---|---|---|
| `ai/serving-latency-metrics-and-slo` | SLO, error budget 정의, "실패율 ÷ 허용 실패율" 소진 속도, percentile, LLM 지표(TTFT 등) | SLI·SLO 정의와 percentile은 링크. k8s 쪽은 Service·Pod 수준 SLI 선택만 |
| `ai/llm-serving-ops` (Observability.tsx) | "Page는 GPU 상태가 아니라 error budget 소진 속도에 건다", burn rate(99.9%에서 1% 실패 → 10), 긴/짧은 window 결합, 저트래픽 최소 event 수 | burn rate 기본은 링크. **Workbook Table 5-8의 14.4/6/1 세 줄과 1/12 짧은 창 규칙은 블로그에 아직 없음** → 시리즈 SRE 글의 본문 후보 |
| `cloud/cloud-reliability-observability-iac` (systemsData.ts) | RPO 15분·RTO 60분 가정 사례, 목표·관측·변경·복구 고리, 백업 복구 연습 | RPO/RTO는 링크. error budget·postmortem·toil 단어는 이 글에 0회 → 시리즈가 채움 |
| `cloud/kubernetes-request-path-and-cka`, `cloud/kubernetes-network-packet-path` | Pending 진단 순서, Node NotReady, Event 조회, Service→EndpointSlice→kube-proxy | 링크·선행 글로 사용 |

블로그에 없는 것(시리즈 후보): golden signal 4개, toil 정의와 50%, postmortem 작성 기준·blameless, NALSD, 다중 창 경보 표, k8s 실제 장애 6건의 개념 매핑.
