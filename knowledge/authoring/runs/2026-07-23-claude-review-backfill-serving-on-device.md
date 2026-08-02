# Claude review backfill · Serving and On-device

## Scope

Context Manager `runDelegatedPrompt`로 LLM Serving 11개와 On-device 2개를 현재 worktree에서 다시 읽혔다. 각 요청은 `claude-code:sonnet` 후보 하나만 사용했다. Codex fallback은 허용하지 않았고 실제 fallback은 0건이다.

검토 단위는 article 하나와 꼭 필요한 direct import로 제한했다. 응답 첫 prefix가 `[claude-code:sonnet <slug>]`가 아닌 결과는 Claude 프로세스가 성공했어도 검토 완료로 세지 않았다. `observability-aiops`와 `on-device-llm-runtime`의 첫 응답은 이 기준으로 폐기하고 재요청했다.

## Result

- 유효 Claude review: 13/13
- Pass: 3
- Findings: 10
- High: 3
- Medium: 8
- Low: 8
- Codex fallback: 0
- Header 불일치로 폐기한 시도: 2

| Slug | Actual header | Verdict | High | Medium | Low | Fallback |
|---|---|---:|---:|---:|---:|---:|
| `llm-disaggregated-serving` | `[claude-code:sonnet llm-disaggregated-serving]` | findings | 0 | 1 | 2 | no |
| `vllm-serving` | `[claude-code:sonnet vllm-serving]` | findings | 2 | 1 | 1 | no |
| `vllm-paged-attention` | `[claude-code:sonnet vllm-paged-attention]` | findings | 0 | 1 | 0 | no |
| `vllm-scheduler` | `[claude-code:sonnet vllm-scheduler]` | findings | 0 | 1 | 0 | no |
| `vllm-spec-decode` | `[claude-code:sonnet vllm-spec-decode]` | findings | 0 | 1 | 1 | no |
| `vllm-vlm-serving` | `[claude-code:sonnet vllm-vlm-serving]` | pass | 0 | 0 | 0 | no |
| `llm-serving-ops` | `[claude-code:sonnet llm-serving-ops]` | pass | 0 | 0 | 0 | no |
| `serving-deployment` | `[claude-code:sonnet serving-deployment]` | findings | 1 | 0 | 0 | no |
| `k8s-gpu-fleet` | `[claude-code:sonnet k8s-gpu-fleet]` | findings | 0 | 1 | 0 | no |
| `litellm-gateway` | `[claude-code:sonnet litellm-gateway]` | pass | 0 | 0 | 0 | no |
| `observability-aiops` | `[claude-code:sonnet observability-aiops]` | findings | 0 | 1 | 1 | no |
| `on-device-llm-runtime` | `[claude-code:sonnet on-device-llm-runtime]` | findings | 0 | 0 | 1 | no |
| `efficient-inference-on-device` | `[claude-code:sonnet efficient-inference-on-device]` | findings | 0 | 1 | 2 | no |

## Blocking findings

### High

1. `vllm-serving/ModelOptimization.tsx`의 FlashAttention 인용문이 linked abstract와 다르다. GPT-2는 3x이고 2.4x는 Long Range Arena 결과이며, 일반적인 20x memory 문장도 abstract 인용이 아니다.
2. `vllm-serving/SpeculativeDecoding.tsx`의 EAGLE 인용문은 linked abstract의 2.7x-3.5x와 다른 2.13x-3.06x를 verbatim처럼 표시한다.
3. `serving-deployment.tsx`는 240초를 weight-load-to-readiness로 정의하지만 같은 section의 Viz는 startup을 engine-alive에서 끝내고 readiness warmup을 별도 gate로 둔다. 3,200 arrival 계산은 맞지만 시간 구간의 의미가 충돌한다.

### Medium

1. `llm-disaggregated-serving`: GQA·MLA first-use 정의 누락.
2. `vllm-serving`: file tree가 노출한 source의 상당 부분이 전달되지 않은 CodeRef 때문에 disabled.
3. `vllm-paged-attention`: allocation ASCII diagram의 vendored source line range가 잘못됨.
4. `vllm-scheduler`: async scheduling의 `num_output_placeholders` 항 누락.
5. `vllm-spec-decode`: constructor source link가 unrendered component에만 있어 실제 page에서 접근 불가.
6. `k8s-gpu-fleet`: DRA stable release를 1.35로 잘못 기록. GA/stable은 1.34이고 1.35는 gate lock-on이다.
7. `observability-aiops`: KV·preemption·canary first-use 정의 누락.
8. `efficient-inference-on-device`: 수식의 `T_token`, `T_launch/T_sync`, `L_MTP`, `S`가 FormulaNote symbols에서 빠짐.

## Clean passes

`vllm-vlm-serving`, `llm-serving-ops`, `litellm-gateway`는 현재 범위에서 concrete defect가 없었다. 다른 글도 통과한 계산과 CodeRef가 많지만 위 결함이 있어 verdict는 findings로 유지했다.

## Audit boundary

Claude는 article source를 수정하지 않았다. High/medium finding은 도착 즉시 root 작업에 전달했다. 자세한 location, evidence, correction과 두 invalid-header 재시도 기록은 같은 이름의 JSON에 보존했다.
