# claw-api-client vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 API client 를 **ProviderClient trait + 2 구현체 (Anthropic/OpenAI-compat) + Chunk enum + PromptCache** 로 설명한다.

- 3 provider: Anthropic, OpenAI, xAI (OpenAI 호환)
- 4 method: send_message → BoxStream<Chunk>, count_tokens, model_info, estimate_cost
- Trait Send+Sync 멀티스레드
- Chunk enum: TextDelta / ToolUseStart / ToolUseDelta / Message stop 등
- Prompt caching (Anthropic 전용): `cache_control` 마커

## 원본 Claude Code 실제 동작

원본은 **단일 통합 client + 멀티프로바이더 (Anthropic/Bedrock/Vertex/Azure Foundry/Grove) + 정교한 retry + prompt cache 와 break detection + admin/ingress endpoint** 등 ~10,500 LOC.

### 핵심 모듈

| 파일 | LOC | 역할 |
|---|---|---|
| `services/api/claude.ts` | 3419 | 메인 — `queryModelWithStreaming`, `getMaxOutputTokensForModel`, model registry |
| `services/api/withRetry.ts` | 822 | retry policy — 401/429/500 별 backoff, prompt-too-long 감지, retry budget |
| `services/api/promptCacheBreakDetection.ts` | 727 | cache hit rate 모니터링 — 갑자기 cache miss 증가 시 추적 (compact 후 알림) |
| `services/api/client.ts` | 389 | low-level HTTP client |
| `services/api/grove.ts` | ? | Grove (특수 endpoint) |
| `services/api/sessionIngress.ts` | ? | 외부 session ingress |
| `services/api/adminRequests.ts` | ? | admin API |
| `services/api/filesApi.ts` | ? | 파일 업로드 (Anthropic Files API) |
| `services/api/firstTokenDate.ts` | ? | 첫 토큰 발생 시각 추적 |
| `services/api/usage.ts` | 63 | usage tracking |
| `services/api/overageCreditGrant.ts` | ? | overage credit |
| `services/api/ultrareviewQuota.ts` | ? | quota |
| `services/api/dumpPrompts.ts` | ? | prompt 덤프 (debug) |
| `services/api/logging.ts` | ? | API logging |
| `services/api/metricsOptOut.ts` | ? | telemetry opt-out |
| `services/api/referral.ts` | ? | referral |
| `services/api/bootstrap.ts` | ? | bootstrap |
| `services/api/errors.ts`, `errorUtils.ts` | ? | error 처리 — `PROMPT_TOO_LONG_ERROR_MESSAGE`, `getPromptTooLongTokenGap` |

### 5+ Provider 지원

원본은 Anthropic 1차 클라이언트 + 다음 provider 통합:
- **Anthropic API** (1st party)
- **AWS Bedrock** — `--bedrock` flag, AWS SDK 사용
- **Google Vertex AI** — `--vertex` flag, GCP 인증
- **Azure Foundry** — Azure-hosted Claude
- **Grove** — 특수 endpoint
- **CCR (Claude Code Remote)** — 자체 서버 프록시

claw 의 OpenAI/xAI 지원은 원본에 없음. 원본은 Anthropic-only model 지원.

### 핵심 차이

1. **Retry policy 822 LOC** — 401 (auth refresh + retry), 429 (rate limit + backoff), 500 (transient retry), prompt-too-long (retry 안 함, 압축 트리거), retry budget (max consecutive failures), idempotency key.

2. **Prompt cache break detection 727 LOC** — cache hit rate 가 갑자기 떨어지면 origin 추적. compact / 시스템 프롬프트 변경 / 새 도구 추가 등이 cache key 를 깨뜨림. `notifyCompaction()` 으로 compact 후 의도된 break 알림.

3. **Bedrock / Vertex / Azure / Grove** — enterprise 멀티 클라우드. claw 의 OpenAI 호환과 정반대 방향.

4. **Files API** — Anthropic Files API 통합 — 큰 파일을 사전 업로드 후 reference. claw 에 없음.

5. **Admin API** — admin 권한 필요 endpoint (org, billing, audit log).

6. **Session ingress** — 외부 ingress endpoint 로 세션 전송.

7. **Overage credit / quota** — 사용량 한도 관리.

8. **Prompt dumping** — 디버그용 prompt 덤프 (sensitive 마스킹).

9. **First token date** — TTFT (time to first token) 추적.

10. **Metrics opt-out** — 사용자가 telemetry 끌 수 있음.

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| Provider 수 | 3 (Anthropic/OpenAI/xAI) | Anthropic + Bedrock + Vertex + Azure + Grove + CCR | 다른 방향 (OpenAI 호환 vs 멀티 클라우드 enterprise) |
| 코드 규모 | api crate ~수천 | services/api ~10,477 LOC | 단순화 |
| Retry policy | basic | 822 LOC — 401/429/500/prompt-too-long 별, retry budget, idempotency | 단순화 |
| Cache break detection | 없음 | 727 LOC — cache hit rate drop 추적, compact 후 알림 | 누락 |
| Files API | 없음 | Anthropic Files 사전 업로드 | 누락 |
| Admin API | 없음 | org/billing/audit | 누락 |
| Session ingress | 없음 | sessionIngress 외부 | 누락 |
| Quota / overage | 없음 | overageCreditGrant + ultrareviewQuota | 누락 |
| Prompt dump (debug) | 없음 | dumpPrompts + masking | 누락 |
| TTFT 추적 | 없음 | firstTokenDate | 누락 |
| Telemetry opt-out | 없음 | metricsOptOut | 누락 |
| Provider trait abstraction | claw 추가 | 원본은 model 별 분기 (provider 별 trait 없음) | **추가** (claw 가 추가) |

## 보강 제안

- "claw 는 멀티 LLM provider (Anthropic/OpenAI/xAI), 원본은 멀티 클라우드 (Anthropic/Bedrock/Vertex/Azure)" — 정반대 방향이라는 점이 흥미. 양쪽 다 정당한 설계.
- Cache break detection 한 단락 — compact 글 cross-link
- Retry policy 깊이 비교
- Files API / Admin / Session ingress 누락 명시

## 참조 파일

- `/home/heru/code/claude-analysis/src/services/api/claude.ts` (3419)
- `/home/heru/code/claude-analysis/src/services/api/withRetry.ts` (822)
- `/home/heru/code/claude-analysis/src/services/api/promptCacheBreakDetection.ts` (727)
- `/home/heru/code/claude-analysis/src/services/api/client.ts` (389)
- `/home/heru/code/claude-analysis/src/services/api/grove.ts`, `sessionIngress.ts`, `filesApi.ts`, `adminRequests.ts`
