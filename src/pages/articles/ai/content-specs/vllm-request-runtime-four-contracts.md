# vLLM request runtime four contracts

## Reader outcome

독자는 vLLM 기능 이름을 외우는 대신 한 요청의 상태를 byte, token, cache identity와 commit boundary로 추적해야 한다. PagedAttention, scheduler, speculative decoding과 VLM serving은 독립 최적화 목록이 아니다. 앞 글이 만든 산출물이 다음 글의 입력이 되는 하나의 request runtime이다.

## Minimum stopping point

현재 질문의 최소 바닥은 PagedAttention과 iteration-level scheduling이다. 더 오래된 가상 메모리, queueing theory와 rejection sampling 역사는 본문의 계산이나 장애 증거가 요구할 때만 연다. 독자가 최신 serving 판단에 도달하기 전에 과거 논문을 무한히 거슬러 내려가지 않는다.

## Shared fixture and hidden transfer problem

32-layer GQA model이 8 KV heads, head dimension 128, BF16 KV와 16-token block을 사용한다. KV pool은 12 GiB다. 한 요청은 8,192-token prompt를 가지며, 한 scheduler step의 token budget은 1,024다. 이미 decode 중인 요청은 128개다. Speculative decoding은 최대 4개를 제안하며 설명용 조건부 acceptance는 0.75다. VLM 요청 하나는 processor가 576개 image embedding position을 만들고 model hidden width는 4,096, embedding dtype은 BF16이다.

본문만 읽고 다음을 판단할 수 있어야 한다.

1. KV가 token당 128 KiB, block당 2 MiB이고 12 GiB pool이 예약 전 최대 6,144 block임을 계산한다.
2. 8,192-token prompt가 512 block, 1 GiB의 KV를 요구함을 계산한다.
3. 128 decode token을 먼저 배정하면 896-token prefill chunk가 남지만 KV headroom과 admission이 별도 조건임을 설명한다.
4. Prefill과 decode가 같은 token 장부를 쓰더라도 compute·memory 특성이 같지 않음을 설명한다.
5. acceptance 0.75, K=4에서 verifier call당 기대 확정 token이 단순 근사로 3.0508이지만 이것이 곧 3.05배 속도는 아님을 설명한다.
6. 올바른 수락 확률 `min(1, p_target/q_draft)`과 recovery distribution이 target 분포를 보존하는 이유를 설명한다.
7. 576 image positions의 embedding payload가 4.5 MiB임을 계산하고 processor overhead·encoder cache·decoder KV를 분리한다.
8. stable media UUID의 encoder cache hit가 KV prefix cache hit를 자동 보장하지 않음을 설명한다.
9. VLM draft가 target의 media capability와 image token alignment를 공유하지 않을 때 speculative path를 제한한다.

## Article ownership and handoff

1. **PagedAttention · physical KV ledger**
   - 입력: model KV shape, token count, block size와 pool.
   - 출력: bytes/token, bytes/block, logical-to-physical block table, refcount와 cache identity.
   - 소유하지 않음: 다음 step에 누구를 실행할지, draft token을 확정할지.
2. **Scheduler · one-step work plan**
   - 입력: ready request, remaining token, KV headroom, encoder budget.
   - 출력: request별 scheduled token count, admission·preemption reason.
   - 소유하지 않음: target 분포를 보존하는 acceptance math.
3. **Speculative decoding · verified token commit**
   - 입력: proposer distribution, target distribution, K, draft·verify cost와 lookahead slot.
   - 출력: accepted prefix, recovery 또는 bonus token, committed/cacheable boundary.
   - 소유하지 않음: media를 model embedding으로 변환하는 processor contract.
4. **VLM serving · media-to-decoder admission**
   - 입력: raw media 또는 trusted UUID, processor contract, encoder cache와 text request.
   - 출력: aligned embedding/placeholders, encoder·KV budget, security/cache evidence.
   - 소유하지 않음: 모든 model family에 공통인 고정 image-token 수.

## Source boundaries

- PagedAttention 논문은 logical/physical block mapping, dynamic allocation, block-level sharing과 tail waste의 이론·실험 근거다. 논문의 throughput 수치를 현재 모든 hardware와 workload의 보편값으로 쓰지 않는다.
- Orca는 iteration-level scheduling 기준점이다. 현재 vLLM V1의 exact queue policy를 설명하는 소스가 아니다.
- Sarathi-Serve는 chunked prefill로 prefill stall을 줄이는 설계와 연구 결과에 사용한다. 논문 수치를 현재 vLLM default의 보장으로 일반화하지 않는다.
- vLLM 공식 API·optimization 문서는 현재 V1의 scheduler, block pool, KV manager와 chunked prefill 구현에 사용한다. Version-sensitive config는 현재 문서 기준임을 표시한다.
- Leviathan et al.은 speculative sampling의 distribution-preserving acceptance와 recovery에 사용한다. 시스템 speedup은 draft cost, verifier kernel과 workload에 의존한다.
- vLLM speculative decoding 문서는 현재 지원 방법과 medium/low-QPS memory-bound workload라는 기대 범위를 확인하는 근거다. Method 이름과 config를 영구 API로 취급하지 않는다.
- vLLM multimodal 문서는 processor, media UUID/cache, encoder budget과 URL security 경계에 사용한다. 576 image positions는 공유 fixture일 뿐 보편값이 아니다.

## Formula contract

모든 display formula는 수식 안에 짧은 한국어 `underbrace`를 쓰고 바로 아래 `FormulaNote`에서 단위와 적용 경계를 설명한다.

- PagedAttention: KV bytes/token, block count와 tail waste.
- Scheduler: remaining work, request allocation과 global step budget. 이는 학습용 단순 장부이며 exact scheduler source를 대체하지 않는다.
- Speculative decoding: acceptance, recovery, expected emitted token과 cost-aware speedup 조건.
- VLM: media embedding payload. Processor container overhead와 encoder workspace를 포함하지 않는 하한이다.

## Visual contract

- 네 Viz 모두 같은 fixture를 사용하고 `data-vllm-runtime-viz`를 가진다.
- 직선 connector와 좁은 node box를 피하고, 입력 장부·결정 상태·출력 artifact를 인접한 row와 band로 배치한다.
- KV/storage는 violet, schedule/work는 sky, committed state는 emerald, unverified/risk는 amber 또는 rose만 사용한다.
- 390px에서 내부 horizontal scroll과 text clipping이 없어야 한다. 768px과 1440px에서 정보 밀도만 늘고 읽는 순서는 바뀌지 않는다.
- Animation은 전체 정적 본문이 닫힌 뒤 별도 pass에서 state transition에만 추가한다.

## Completion gate

- 네 글 모두 question lead, concept primer, responsive Viz, Korean-annotated display formula, misconception, capability check, primary source와 explicit handoff를 가진다.
- 잘못된 `q/p` acceptance 비율과 보편적인 `2~3x` 문구가 남지 않는다.
- `phase가 없다`는 말을 동일한 accounting abstraction으로 한정하고 prefill/decode의 compute 차이를 지우지 않는다.
- Shared fixture의 byte·block·token·embedding oracle가 본문과 browser test에서 일치한다.
- 390/768/1440px에서 document, formula와 visual overflow가 0이다.

## 4B / 9B authoring packet

4B worker는 한 article contract만 받아 `input_state`, `calculation`, `unit`, `decision`, `output_artifact`, `failure_owner`, `source_claim`, `forbidden_generalization`, `next_handoff`를 JSON으로 낸다. 9B reviewer는 네 packet과 hidden problem을 받아 `byte_oracle`, `token_budget`, `commit_boundary`, `cache_identity`, `version_sensitive_claim`, `cross_article_overlap`을 검사한다. Orchestrator만 route metadata, source freshness, browser oracle, build와 deployment를 닫는다.
