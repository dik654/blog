# vLLM request runtime reconstruction report

## Observed

기존 네 글은 PagedAttention, scheduler, speculative decoding, VLM serving이라는 중요한 이름을 모두 갖고 있었지만, 한 요청이 실제로 어떤 상태를 다음 단계에 넘기는지는 보이지 않았다. KV cache 용량과 scheduler 처리량이 섞였고, prefill과 decode가 같은 token 장부를 쓴다는 설명이 물리적 비용까지 같다는 오해를 만들 수 있었다. Speculative decoding에는 수락 비율이 뒤집힌 설명과 보편적인 속도 향상 문구가 남아 있었으며, VLM serving은 media processor, encoder cache, decoder KV cache와 보안 경계를 한 덩어리로 다뤘다.

## Inferred

서빙 엔진의 최소 바닥은 기능 목록이 아니라 **한 요청의 상태 소유권**이다. 독자는 `byte → token → commit → media admission` 네 장부를 순서대로 추적해야 낯선 모델이나 새 vLLM 버전을 만나도 병목과 실패 소유자를 찾을 수 있다. 따라서 각 글은 다음 글이 소비하는 하나의 artifact만 만들고, 성능 수치는 architecture invariant와 workload-dependent evidence를 분리해야 한다.

## Decided

1. PagedAttention은 model KV shape에서 token·block byte와 logical-to-physical mapping을 만드는 physical KV ledger만 소유한다.
2. Scheduler는 ready request와 token·KV·encoder headroom에서 한 iteration의 work plan을 만드는 역할만 소유한다.
3. Speculative decoding은 draft proposal을 target distribution으로 검증해 cacheable committed prefix를 만드는 역할만 소유한다.
4. VLM serving은 raw media 또는 trusted identity를 processor·encoder cache를 거쳐 decoder가 받을 aligned embedding으로 바꾸고 별도 budget을 예약한다.
5. 공유 수치 fixture로 네 글의 인계를 검증하되, 설명용 수치를 모든 model과 hardware의 보편값으로 일반화하지 않는다.
6. 역사적 바닥은 PagedAttention과 iteration-level scheduling에서 끊고, virtual memory·queueing·rejection sampling의 더 오래된 계보는 본문 계산이나 장애가 요구할 때만 연다.

## Hidden transfer problem

32-layer GQA model이 8 KV heads, head dimension 128, BF16 KV, 16-token block과 12 GiB KV pool을 사용한다. 8,192-token prompt, step token budget 1,024, decode 중인 요청 128개, 최대 4개 draft token, 설명용 acceptance 0.75가 주어진다. VLM processor는 576개 image embedding position, hidden width 4,096와 BF16 output을 만든다. 새 본문만 읽고 다음을 판단할 수 있어야 한다.

- KV가 token당 128 KiB, block당 2 MiB이고 pool이 예약 전 최대 6,144 block임을 계산한다.
- 8,192-token prompt가 512 block과 1 GiB KV를 요구함을 계산한다.
- Decode 128 token을 우선 배정한 뒤 남는 896 token이 prefill 상한일 뿐, KV admission까지 자동 보장하지 않음을 설명한다.
- Prefill과 decode가 같은 token budget abstraction을 사용해도 compute-bound와 memory-bound 성질은 다를 수 있음을 설명한다.
- `K=4`, `alpha=0.75`에서 단순 기대 확정 token이 3.0508이어도 draft·verify 비용을 빼지 않은 3.05배 속도로 읽으면 안 됨을 설명한다.
- `min(1, p_target / q_draft)` 수락과 recovery distribution이 target 분포를 보존하는 경계를 설명한다.
- Image embedding payload 하한 4.5 MiB와 processor overhead, encoder workspace, decoder KV를 분리한다.
- Media UUID의 encoder cache hit와 text-prefix KV cache hit가 서로 다른 identity 계약임을 설명한다.
- Draft와 target의 media capability 또는 image-token alignment가 다르면 speculative path를 제한한다.

## Sources and boundaries

- [PagedAttention 논문](https://arxiv.org/abs/2309.06180)은 logical·physical block mapping, dynamic allocation, block sharing과 tail waste의 근거다. 논문의 throughput 수치를 현재 모든 hardware의 보편값으로 사용하지 않았다.
- [Orca OSDI 논문](https://www.usenix.org/conference/osdi22/presentation/yu)은 iteration-level scheduling의 기준점이다. 현재 vLLM V1의 정확한 queue policy를 대신하지 않는다.
- [Sarathi-Serve 논문](https://arxiv.org/abs/2403.02310)은 chunked prefill이 prefill stall을 줄이는 설계 근거다. 저자 실험 수치를 현재 vLLM의 보장으로 승격하지 않았다.
- [vLLM optimization 문서](https://docs.vllm.ai/en/stable/configuration/optimization/)는 현재 V1의 chunked prefill, decode 우선과 prefill·decode 자원 특성에 사용했다. Version-sensitive 동작임을 본문에 남겼다.
- [Speculative Decoding 원 논문](https://proceedings.mlr.press/v202/leviathan23a.html)은 distribution-preserving acceptance와 recovery의 근거다. 시스템 speedup은 별도의 cost model로 제한했다.
- [vLLM speculative decoding 문서](https://docs.vllm.ai/en/latest/features/speculative_decoding/)는 현재 지원 범위, memory-bound workload 기대와 numerical precision 경계를 확인하는 데 사용했다. 방법 이름과 API를 영구 계약으로 취급하지 않았다.
- [vLLM multimodal 문서](https://docs.vllm.ai/en/latest/features/multimodal_inputs/)는 processor, UUID cache, embedding shape와 media URL security 경계의 근거다. 576 positions는 공유 fixture일 뿐 보편값이 아니다.

## Claude collaboration

사용자 지시대로 context-manager `/api/chat`에 `model=claude-sonnet-4-6`, `fresh=true`로 독립 경계 검토, primary-source research 검토와 구현 후 반례 검토를 요청했다. Context-manager의 인증과 routing은 성공했지만 provider가 세 번의 재시도 뒤 HTTP 500 `Provider error: All providers failed`를 반환했다. Direct Claude CLI로 우회하지 않았고 Claude 결과가 반영되었다고 주장하지 않는다. Provider가 복구되면 동일한 bounded packet으로 재검토할 수 있도록 content spec과 이 보고서에 경계를 보존했다.

## Changed

- 네 글을 `physical KV ledger → one-step work plan → verified token commit → media-to-decoder admission` 순서의 한 요청 추적으로 재작성했다.
- 공통 responsive Viz 네 종류를 추가해 입력, 계산, 결정과 출력 artifact가 화면 폭과 무관하게 같은 읽기 순서를 유지하게 했다.
- KV byte, scheduler budget, speculative acceptance·recovery·cost와 media payload 수식에 한국어 underbrace와 `FormulaNote`를 적용했다.
- 잘못된 speculative acceptance 비율, 보편적인 속도 향상, prefix hash와 chunked prefill에 관한 과한 일반화를 수정했다.
- Category metadata와 authored path를 같은 인계 순서로 맞추고 capability check와 다음 글 handoff를 각 글에 넣었다.

## Verified

- 전용 Playwright: 로컬 7/7, 공개 배포본 7/7 통과.
- 관련 disaggregated serving·authored path 회귀: 로컬 48/48 통과.
- 390px에서 display formula scale은 PagedAttention 1.00, Scheduler 0.89, Speculative Decoding 1.00·0.91, VLM Serving 0.87이고 formula·Viz·document overflow는 0.
- 768px과 1440px에서 Viz 읽기 순서, 내부 폭과 article handoff를 확인했고 console·page error는 0.
- Production build: 9,389 modules, 성공.
- `audit:learning-flow`: 등록 589개, AI formula gap·release blocker·review-needed 0. 전체 corpus에는 non-AI formula blocker 29개와 enrichment backlog 529개가 남아 있다.
- `cm-blog.service`는 `2026-07-23 10:45:29 KST`에 새 빌드로 활성화됐다.
- 공개 category와 네 article URL 모두 HTTP 200.

## 4B · 9B handoff

4B worker는 한 글만 받고 `input_state`, `calculation`, `unit`, `decision`, `output_artifact`, `failure_owner`, `source_claim`, `forbidden_generalization`, `next_handoff`를 JSON으로 낸다. 기능 이름이나 장점 목록 대신 입력 장부가 어떤 계산과 판정을 거쳐 다음 artifact가 되는지 적는다.

9B reviewer는 네 packet과 hidden transfer problem을 받아 `byte_oracle`, `token_budget`, `commit_boundary`, `cache_identity`, `version_sensitive_claim`, `cross_article_overlap`을 검사한다. Active token을 곧 throughput으로, expected committed token을 곧 speedup으로, media cache hit를 곧 KV cache hit로 쓰는 packet은 반려한다. Orchestrator만 source freshness, route metadata, responsive browser oracle, build와 deployment를 닫는다.
