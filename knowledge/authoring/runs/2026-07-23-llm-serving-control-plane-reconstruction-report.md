# LLM Serving control-plane reconstruction report

## Observed

기존 `Serving Ops`, `Deployment`, `Kubernetes GPU Fleet`, `LiteLLM Gateway`, `Observability` 글은 각각 정보량이 충분했지만, 한 model release가 어느 제어기를 거쳐 traffic을 받고 장애에서 복구되는지 이어서 읽기 어려웠다. `Running`, `Ready`, warm capacity가 섞였고 desired replica와 allocatable·usable GPU가 같은 숫자처럼 보였다. Retry와 fallback, TTFT와 TPOT, metric과 원인, mitigation과 recovery evidence도 글 사이에서 소유자가 분명하지 않았다.

## Inferred

운영 글의 최소 바닥은 제품 목록이 아니라 **상태와 소유권의 인계**다. 독자는 `목표·소유자 → rollback 가능한 release → schedulable device lease → route decision → 관측으로 닫힌 복구`를 따라가야 새 Kubernetes나 gateway 기능이 나와도 failure owner를 찾을 수 있다. 같은 장애를 다섯 글에서 재사용하되, 각 글은 하나의 독립 판단과 다음 글이 소비할 artifact만 소유해야 한다.

## Decided

1. Serving Ops는 workload·SLO·release identity에서 ownership map과 조사 순서를 만든다.
2. Deployment는 immutable manifest, startup/readiness, warmup, canary와 rollback target을 소유한다.
3. GPU Fleet는 resource claim에서 compatible allocatable device, ready evidence와 capacity deficit reason을 만든다.
4. Gateway는 auth·capability·quota·health·cost를 평가해 route, retry·fallback·cooldown reason과 trace evidence를 만든다.
5. Observability는 gateway·runtime·GPU·Kubernetes·release 신호를 엮어 bounded action, observation window와 undo decision으로 incident를 닫는다.
6. Kubernetes DRA, OpenTelemetry GenAI attributes와 vendor API는 현재 버전의 evidence로만 쓰고 영구적인 보편 계약으로 승격하지 않는다.

## Hidden transfer problem

32-layer GQA canary가 replica당 GPU 1개를 요구한다. Desired replica는 8, compatible allocatable GPU는 6, 현재 5개는 Ready, 1개는 warmup-unready, 2개는 Pending이다. Startup은 240초, ingress는 800 requests/min이다. TTFT p95는 0.45초에서 1.4초로 증가하지만 TPOT은 안정적이고 queue가 증가하며 GPU utilization은 중간이다. 설명용 primary 비용은 request당 0.002달러, fallback은 0.008달러이고 10%가 fallback으로 간다. 새 본문만 읽고 다음을 판단할 수 있어야 한다.

- Desired 8, allocatable 6, 현재 ready capacity 5를 서로 다른 장부로 설명한다.
- Pending 2개를 단순한 replica 부족이 아니라 compatible device admission failure로 분류한다.
- `(800 / 60) × 240 = 3,200`으로 cold-start 동안 도착하는 request를 계산한다.
- TTFT와 queue만 악화되고 TPOT이 안정적이면 decode kernel보다 admission·prefill·queue·readiness를 먼저 확인한다.
- `0.9 × 0.002 + 0.1 × 0.008 = 0.0026`과 baseline 대비 30% 비용 증가를 계산한다.
- 10% 실패에 retry 1회를 추가하면 800 request가 880 attempt로 늘며, retry와 fallback을 함께 무제한 적용하면 부하와 비용이 증폭됨을 설명한다.
- Scale-out, traffic shift, rollback 어느 것도 관측 창과 undo condition 없이 자동 복구가 아님을 설명한다.

## Sources and boundaries

- Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)와 [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) 문서는 controller, readiness와 autoscaling semantics의 근거다. Model quality나 warmup 완료를 자동 보장하지 않는다.
- Kubernetes [device plugin](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)과 [DRA](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/) 문서를 함께 사용했다. DRA가 Kubernetes 1.35에서 stable이라는 사실을 모든 cluster가 이미 사용한다는 뜻으로 확대하지 않았다.
- NVIDIA [GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/), [MIG](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-mig.html), [time-slicing](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-sharing.html) 문서는 device lifecycle과 sharing boundary의 근거다. Time slicing에 MIG와 같은 memory·fault isolation이 있다고 쓰지 않았다.
- LiteLLM [router](https://docs.litellm.ai/docs/routing)와 [virtual keys](https://docs.litellm.ai/docs/proxy/virtual_keys)는 retry, fallback, cooldown, budget 기능의 현재 근거다. Logical alias를 semantic compatibility evidence로 취급하지 않았다.
- vLLM [metrics](https://docs.vllm.ai/en/latest/design/metrics/)는 TTFT, inter-token latency, queue와 KV lifecycle을 분리하는 근거다. 정확한 metric 이름은 version-sensitive하다.
- OpenTelemetry [GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/)과 Prometheus [alerting rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)는 trace correlation과 alert state의 근거다. Prompt·response content는 민감정보가 될 수 있어 기본 수집 대상으로 가정하지 않았다.

## Claude collaboration

사용자 지시대로 context-manager `/api/chat`에 `model=claude-sonnet-4-6`, `fresh=true`로 기술·학습 흐름 검토를 요청했다. 공통 장애 fixture, 다섯 article ownership, 숫자 oracle, 최신 기능의 과장 위험을 포함한 bounded packet으로 구현 전과 구현 후 재시도했다. Context-manager 인증과 model override는 통과했지만 provider가 HTTP 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고 Claude 검토가 반영되었다고 주장하지 않는다. 복구 후 같은 packet으로 재검토할 수 있도록 content spec과 이 보고서에 질문을 보존했다.

## Changed

- 다섯 글을 하나의 canary incident와 artifact handoff로 다시 작성하고 각 글의 소유권, 오해, capability check와 다음 글 연결을 명시했다.
- 공통 Viz 여섯 종류를 추가해 release, capacity, admitted route, pending/risk 상태를 같은 색 의미와 읽기 순서로 표시했다.
- Cold-start arrival, fleet capacity bound, fallback cost, retry amplification, SLO bad-event budget와 burn ratio를 KaTeX 수식과 한글 항 설명으로 작성했다.
- DRA와 device plugin, MIG와 time slicing, retry와 fallback, TTFT와 TPOT, metric과 hypothesis를 구분하고 version boundary를 본문에 남겼다.
- Category metadata와 authored path를 `ownership → release → capacity → route → recovery` 순서로 맞췄다.

## Verified

- 전용 Playwright: 로컬 8/8 통과.
- 관련 vLLM·disaggregated serving·authored path 회귀: 로컬 56/56 통과.
- 390px에서 formula scale은 Deployment 1.00, Fleet 0.84, Gateway 1.00·1.00, Observability 0.97·1.00이고 formula·Viz·document overflow는 0.
- 390px에서 큰 Fleet와 Observability Viz를 각각 606px, 671px로 압축하고 sticky header 겹침 없이 읽히는지 시각 검사했다.
- 768px과 1440px에서 article handoff와 Viz 읽기 순서를 확인했고 console·page error는 0.
- Production build: 9,355 modules, 성공.
- `audit:learning-flow`: 등록 589개, AI formula gap·release blocker 0. 전체 corpus에는 non-AI formula blocker 29개와 enrichment backlog 529개가 남아 있다.
- `cm-blog.service`는 `2026-07-23 11:10:31 KST`에 새 빌드로 활성화됐다.
- 공개 category와 다섯 article URL 모두 HTTP 200이며 공개 Playwright 8/8을 통과했다.

## 4B · 9B handoff

4B worker는 한 글만 받고 `target_slo`, `input_artifact`, `controller_or_policy`, `numeric_oracle`, `output_evidence`, `failure_owner`, `source_claim`, `version_boundary`, `forbidden_inference`, `next_handoff`를 JSON으로 낸다. 제품 기능 목록이 아니라 입력 상태를 누가 판단하고 어떤 evidence를 다음 단계에 넘기는지 적는다.

9B reviewer는 다섯 packet과 hidden transfer problem을 받아 `release_identity`, `ready_vs_running`, `desired_vs_allocatable`, `claim_vs_device`, `retry_vs_fallback`, `metric_vs_hypothesis`, `action_guardrail`, `rollback_evidence`, `cross_article_overlap`을 검사한다. Desired를 곧 capacity로, Running을 곧 Ready로, alias를 곧 compatible route로, alert를 곧 원인으로 쓰는 packet은 반려한다. Orchestrator만 source freshness, category metadata, responsive·formula browser oracle, build, deployment와 public regression을 닫는다.
