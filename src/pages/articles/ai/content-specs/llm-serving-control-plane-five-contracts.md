# LLM serving control plane: five contracts

## Reader outcome

독자는 Kubernetes, LiteLLM, Prometheus 제품 목록을 외우는 대신 하나의 model release가 artifact에서 ready capacity, admitted traffic, correlated evidence와 bounded recovery로 바뀌는 과정을 추적한다.

## Minimum stopping point

최소 바닥은 Kubernetes controller·probe·resource claim, gateway policy와 SLO다. 더 오래된 distributed systems, queueing theory와 control theory는 실제 rollout 또는 incident 계산이 요구할 때만 연다. 최신 운영 판단보다 과거 계보가 먼저 나오지 않는다.

## Shared incident

- 32-layer GQA model canary
- desired replica 8, GPU 1개/replica
- model startup 240s
- advertised allocatable에서 사용 중 device와 배치 정책을 제외한 scheduler-feasible free GPU 6개
- 현재 5 Ready, 1 warmup-unready, 2 Pending
- ingress 800 requests/min
- TTFT p95 0.45s → 1.4s, TPOT stable
- queue rising, GPU utilization moderate
- primary cost 0.002/request, fallback cost 0.008/request인 설명용 fixture
- 10% request가 fallback으로 이동

본문만 읽고 다음을 판단할 수 있어야 한다.

1. Desired 8, scheduler-feasible free 6과 현재 ready capacity 5를 서로 다른 장부로 찾는다.
2. 두 Pending은 pod replica 부족이 아니라 device admission·policy failure임을 찾는다.
3. 240초 cold start 동안 3,200 request가 도착한다는 queue pressure 하한을 계산한다.
4. TTFT와 queue만 오르고 TPOT이 안정적이면 decode kernel보다 admission·prefill·queue·readiness를 먼저 조사한다.
5. Capability 검사 뒤 10%를 primary 호출 없이 직접 fallback하면 평균 request cost가 0.0026임을 계산한다.
6. Primary 실패 뒤 10%가 fallback하고 primary attempt도 전액 과금된 설명용 fixture라면 평균 비용이 0.0028임을 계산한다.
7. Retry와 fallback을 동시에 무제한 적용하면 부하와 비용이 증폭됨을 설명한다.
8. Scale-out, traffic shift, rollback 중 무엇을 실행해도 idempotency key, observation window와 undo condition이 필요함을 설명한다.

## Article ownership

1. **Ops hub · target and ownership map**
   - 입력: workload, SLO, release identity.
   - 출력: deployment·fleet·gateway·observability ownership map과 incident hypothesis order.
2. **Deployment · rollback-ready release**
   - 입력: immutable model/runtime manifest, desired capacity와 probes.
   - 출력: startup·readiness·warmup·traffic gate를 통과한 release revision과 rollback target.
3. **GPU fleet · schedulable capacity lease**
   - 입력: model resource claim, device class/extended resource, isolation과 topology requirement.
   - 출력: allocated device identity, ready node/operator evidence와 capacity deficit reason.
4. **Gateway · route decision evidence**
   - 입력: authenticated request, tenant policy, logical model capability, healthy candidates와 budget.
   - 출력: selected deployment, retry/fallback/cooldown reason, cost and trace attributes.
5. **Observability · verified recovery**
   - 입력: correlated gateway, runtime, GPU, Kubernetes and release signals.
   - 출력: symptom hypothesis, bounded action, observation result, rollback or close decision.

## Source boundaries

- Kubernetes Deployment, startup/readiness/liveness probes and HPA documents own controller and scaling semantics, not model-quality release gates.
- Kubernetes DRA core became GA and default-enabled in v1.34, and cannot be disabled from v1.35. It provides ResourceClaim/DeviceClass style allocation. Device plugin extended resources remain a supported current path; do not describe DRA as universally deployed.
- NVIDIA GPU Operator owns driver, toolkit, device plugin, GFD, DCGM and MIG-manager lifecycle. Operator readiness does not prove a model pod is warm or a route is safe.
- MIG provides hardware memory and fault isolation for supported profiles; time slicing multiplexes access without MIG-equivalent memory/fault isolation.
- LiteLLM documentation owns current router, retry, fallback, cooldown, virtual-key and budget features. A model alias is not semantic compatibility evidence.
- vLLM metrics own engine-level names and definitions. OpenTelemetry GenAI attributes are version-sensitive and content fields may contain sensitive data.
- A latency name does not define one clock: frontend TTFT, scheduled-to-first-token timing, queue duration, ITL samples and request-level TPOT stay separate.
- Prometheus metrics use bounded release/channel/error labels. Request, attempt, Pod and device identities belong in traces, logs or entity joins; temporal correlation is not a direct request-to-GPU join.
- Kubernetes Pending is a Pod phase, not a capacity reason. PodScheduled conditions, FailedScheduling events, ResourceClaim allocation and container startup state own the diagnosis.

## Formula contract

- Deployment: cold-start arrival pressure `A_cold = lambda * t_start`.
- Fleet: advertised allocatable, scheduler-feasible free, allocated identity, current health, warm capacity and topology groups stay separate.
- Gateway: logical cost is the sum of actual attempts; direct capability fallback, post-failure fallback and retry amplification stay separate.
- Observability: eligible/good SLI denominator, SLO bad-event budget, short/long-window burn ratio and missing-data policy.
- Every display equation uses Korean underbrace and adjacent FormulaNote.

## Visual contract

- Six control-plane labs expose `data-serving-control-viz`; observability adds latency-clock and causal recovery state labs while reusing the incident fixture.
- No arrows crossing cards. Use ledger rows, stage bands and evidence ladders.
- Release is sky, device capacity violet, admitted route emerald, pending/risk amber or rose.
- 390px has no horizontal scroll, clipped code, forced tiny labels or sticky-header overlap.
- Animation is deferred; later motion may only reveal an existing state transition and must honor reduced motion.

## 4B / 9B packet

4B worker: `target_slo`, `sli_denominator`, `metric_surface`, `missing_data_policy`, `release_cohort`, `input_artifact`, `controller_or_policy`, `numeric_oracle`, `output_evidence`, `failure_owner`, `source_claim`, `version_boundary`, `forbidden_inference`, `next_handoff`.

9B reviewer: `release_identity`, `ready_vs_running`, `desired_vs_allocatable`, `claim_vs_device`, `retry_vs_fallback`, `metric_vs_hypothesis`, `label_cardinality`, `join_strength`, `action_guardrail`, `rollback_evidence`, `cross_article_overlap`.

Orchestrator: source freshness, category/path metadata, browser overflow and formula oracle, build, deployment and public regression.
