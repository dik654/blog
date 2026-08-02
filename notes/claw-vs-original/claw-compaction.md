# claw-compaction vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 컨텍스트 압축을 **결정론적 Rust 파이프라인**으로 설명한다.

- `compact.rs` (689 LOC) 가 단일 진입점. `compact_session(session, config) -> CompactionResult`
- 6단계: preserve_recent 분리 → 시스템 메시지 격리 → `summarize_messages()` → `format_compact_summary()` → 새 Session 조립 → 결과 반환
- **요약 생성에 LLM 호출 없음** — 정규식·HashMap·문자열 매칭으로 `Summary { scope, current_work, pending_work, tool_usage, file_candidates, timeline }` 6개 필드 직접 생성
- `<prior-context>` XML 태그로 직접 마크다운 조립
- 토큰 추정은 `bytes / 4` 단순 근사
- 트리거 3가지: 자동 (`should_compact()`), `/compact` 슬래시, `context_length_exceeded` 응답
- 보조 레이어: `SummaryCompressor` (300 LOC) — 요약 자체를 더 짧게 (`extract_key_facts` → `remove_noise` → `rank_by_relevance` → `truncate_to_budget`)
- 핵심 자랑: "토큰 비용 0, 결정론적, 0.1초 미만 실행"

## 원본 Claude Code 실제 동작

원본은 **모델 호출 기반 LLM 요약** 이고, 다단 fallback 과 hook chain 을 가진다.

### 파일 구성 (4262 LOC)

| 파일 | LOC | 역할 |
|---|---|---|
| `services/compact/compact.ts` | 1705 | 메인 `compactConversation()` — LLM 호출, 재시도, 캐시 공유 |
| `services/compact/sessionMemoryCompact.ts` | 630 | SessionMemory 우선 fallback |
| `services/compact/microCompact.ts` | 530 | 시간 기반 도구 결과 정리 |
| `services/compact/autoCompact.ts` | 351 | 자동 트리거·임계값·circuit breaker |
| `services/compact/prompt.ts` | 374 | LLM 압축 프롬프트 (`<analysis>`, `<summary>` 9 섹션) |
| `services/compact/apiMicrocompact.ts` | 153 | API 레벨 microcompact |
| `services/compact/postCompactCleanup.ts` | 77 | 사후 캐시 정리 |
| `services/compact/grouping.ts` | 63 | 메시지 라운드 그룹핑 |
| `services/compact/timeBasedMCConfig.ts` | 43 | 시간 기반 설정 |
| `services/compact/compactWarningHook.ts` | 16 | UI 경고 |
| `services/compact/compactWarningState.ts` | 18 | 경고 상태 |
| `commands/compact/compact.ts` | 287 | `/compact` 슬래시 처리 + fallback chain |

### 핵심 메커니즘

1. **LLM 호출** — `compactConversation()` 은 `queryModelWithStreaming()` 으로 모델에 직접 요약 요청. `runForkedAgent()` 로 부모 세션의 시스템 프롬프트·툴 풀을 그대로 상속(캐시 키 일치 목적)한 forked agent 가 한 턴 돌면서 텍스트 응답을 받는다. `MAX_COMPACT_STREAMING_RETRIES = 2` 로 재시도.

2. **9 섹션 구조화 프롬프트** (`prompt.ts`):
   - Primary Request and Intent
   - Key Technical Concepts
   - Files and Code Sections (full snippets)
   - Errors and fixes
   - Problem Solving
   - All user messages
   - Pending Tasks
   - Current Work (verbatim quotes)
   - Optional Next Step
   - 출력은 `<analysis>` (drafting scratchpad, 후처리에서 strip) + `<summary>` (실제 컨텍스트로 들어감)

3. **다단 fallback chain** (`commands/compact/compact.ts`):
   - 1순위: `trySessionMemoryCompaction()` — custom instructions 없을 때만, SessionMemory 추출이 가능하면 그 결과를 사용
   - 2순위: `reactiveCompact?.isReactiveOnlyMode()` — REACTIVE_COMPACT feature flag 활성 시 reactive 경로
   - 3순위: `microcompactMessages()` 로 토큰 줄인 뒤 `compactConversation()` (legacy)
   - 추가: prompt-too-long 응답 받으면 `reactiveCompactOnPromptTooLong()` 즉시 트리거

4. **Pre/Post Compact Hooks** — `executePreCompactHooks()`, `executePostCompactHooks()` 가 `customInstructions` 를 mutate 할 수 있고 사용자 정의 hook 명령어를 spawn. `/compact <args>` 인자는 hook output 과 `mergeHookInstructions()` 로 병합되어 LLM 프롬프트에 "Additional Instructions:" 로 prepend.

5. **자동 트리거 정확한 토큰 회계** (`autoCompact.ts`):
   - `getEffectiveContextWindowSize()` = 모델별 컨텍스트 윈도우 - max output tokens (cap 20K)
   - `AUTOCOMPACT_BUFFER_TOKENS = 13_000`, `WARNING/ERROR_THRESHOLD_BUFFER_TOKENS = 20_000`
   - `MAX_OUTPUT_TOKENS_FOR_SUMMARY = 20_000` (p99.99 of compact summary output = 17,387 tokens 데이터 기반)
   - Circuit breaker: `MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3` — 1,279 sessions 에서 50+ 연속 실패 (max 3,272) 케이스 발견 후 추가
   - `tokenCountWithEstimation()` — `tokenCountFromLastAPIResponse()` 우선, fallback 으로 추정

6. **포스트 압축 파일·스킬 재주입**:
   - `POST_COMPACT_MAX_FILES_TO_RESTORE = 5`, `POST_COMPACT_TOKEN_BUDGET = 50_000`, `POST_COMPACT_MAX_TOKENS_PER_FILE = 5_000`
   - `POST_COMPACT_SKILLS_TOKEN_BUDGET = 25_000`, `POST_COMPACT_MAX_TOKENS_PER_SKILL = 5_000` — verify=18.7KB, claude-api=20.1KB 사례 기반 per-skill cap
   - `runPostCompactCleanup()` 가 캐시 정리 (`getUserContext.cache.clear()`, `markPostCompaction()`, `notifyCompaction()`)

7. **이미지·문서 strip** — `stripImagesFromMessages()` 가 압축 호출 직전 image/document block 을 `[image]`, `[document]` 텍스트 마커로 치환. CCD 세션에서 이미지로 인한 prompt-too-long 방지.

8. **`/compact <args>` 인자 지원** — `customInstructions = args.trim()` 으로 받아 `compactConversation()` 6번째 인자로 전달, 프롬프트에 "Additional Instructions: ..." 로 prepend.

## 주요 차이점

| 항목 | 블로그(claw) 서술 | 원본 실제 | 차이 종류 |
|---|---|---|---|
| 요약 생성 메커니즘 | Rust 코드 (정규식·HashMap·문자열 매칭), LLM 호출 0 | `queryModelWithStreaming()` 으로 모델에 한 턴 forked agent 요청 | **다른 메커니즘 (본질)** |
| 출력 포맷 | `Summary { scope, current_work, pending_work, tool_usage, file_candidates, timeline }` 구조체 → 마크다운 직조립 | LLM 자유형 텍스트, `<analysis>` + `<summary>` 9 고정 섹션 (Primary Request / Key Concepts / Files / Errors / Problem Solving / All user msgs / Pending / Current Work / Next Step) | 다른 메커니즘 |
| `/compact <args>` | 인자 거부 | `customInstructions` 로 받아 hook 결과와 병합, 프롬프트에 "Additional Instructions:" prepend | 누락 |
| Fallback chain | 단일 경로 | SessionMemory → reactive → microCompact → traditional 4단 | 단순화 |
| Pre/Post compact hooks | 없음 | `executePreCompactHooks` / `executePostCompactHooks` 가 `customInstructions` mutate, userDisplayMessage 결합 | 누락 |
| 토큰 추정 | `bytes / 4` 단순 | `tokenCountWithEstimation()` — API 응답의 정확한 카운트 우선, fallback 으로 추정 | 단순화 |
| 자동 임계값 | `max_estimated_tokens` 단일 값 | `getAutoCompactThreshold()` = effective window - 13K buffer, warning 20K, error 20K, manual 3K — 모델별 동적 | 단순화 |
| Circuit breaker | 없음 | 연속 3회 실패 시 자동 비활성 (운영 데이터 기반) | 누락 |
| MicroCompact | 없음 (`SummaryCompressor` 는 요약 압축, 다른 개념) | `microcompactMessages()` 530 LOC — 시간 기반 도구 결과 정리, 압축 전 사전 단계 | 누락 |
| SessionMemory 통합 | 없음 | `trySessionMemoryCompaction()` 630 LOC — 메모리 추출과 통합된 압축 | 누락 |
| 이미지·문서 strip | 없음 | `stripImagesFromMessages()` — image/document block 을 `[image]` 텍스트로 치환 후 압축 | 누락 |
| 포스트 압축 재주입 | "최근 N개 원본 보존" 만 | 5개 파일 (50K cap, per-file 5K) + 5개 skill (25K cap, per-skill 5K) 재주입, MCP/agent listing/deferred tools attachment 갱신 | 누락 |
| Reactive compact | 없음 | `REACTIVE_COMPACT` feature flag, `reactiveCompactOnPromptTooLong()` — 401/prompt-too-long 응답 시 즉시 부분 압축 | 누락 |
| 캐시 키 보존 | N/A | `getCacheSharingParams()` 가 부모 시스템 프롬프트·툴 풀 그대로 fork 해서 prompt cache 깨지지 않게 함 | 누락 (성능 핵심) |
| Compact boundary 메시지 | `<prior-context>` XML | `createCompactBoundaryMessage()` — `SystemCompactBoundaryMessage` 타입, `getMessagesAfterCompactBoundary()` 로 REPL 스크롤백과 압축 대상 분리 | 다른 메커니즘 |
| `<prior-context>` 처리 | partition() 으로 격리, merge_compact_summaries() 가 별도 처리 | 원본은 그런 명시적 XML 태그 없음 — boundary marker 메시지로 처리 | 다른 메커니즘 |
| 실행 시간 | "0.1초 미만" | 모델 호출 1턴 + retry — 보통 수~십 수 초 | 다른 메커니즘 |

## 블로그 보강 제안

블로그가 이미 강한 부분 (결정론적 파이프라인의 6단계 분해, 구조화 Summary 의 장점 callout) 은 그대로 두되 다음을 추가하면 정확성과 깊이가 동시에 올라간다.

1. **Overview 도입부에 "원본과의 의도적 차이" callout 추가** — "claw 는 LLM 호출 없는 결정론 압축이라는 의도적 갈라짐을 선택. 원본은 `queryModelWithStreaming()` 호출로 9 섹션 LLM 요약을 받는다" 한 단락. 이게 핵심 차이라 명시하면 오히려 claw 의 설계 의도가 부각됨.

2. **CompactPipeline.tsx 마지막에 "원본 fallback chain" 비교 섹션 추가** — 원본의 4단 fallback (SessionMemory → reactive → micro → traditional) 그림 한 장. claw 는 단일 경로라는 점을 대비.

3. **`/compact <args>` 처리 보강** — 현재 블로그가 "거부" 라고 명시한다면, "원본은 인자를 받아 hook 결과와 병합 후 LLM 프롬프트에 prepend" 라고 한 줄.

4. **Pre/Post Compact Hooks 누락 명시** — `claw-hooks` 글에서 다룰 가능성이 있지만, 압축 글에서도 한 줄 — "원본은 `executePreCompactHooks` / `executePostCompactHooks` 가 customInstructions 와 userDisplayMessage 를 mutate".

5. **포스트 압축 파일/스킬 재주입 섹션 신설** — 원본의 `POST_COMPACT_MAX_FILES_TO_RESTORE = 5`, skill 재주입 cap 같은 운영 데이터 기반 상수 소개. 압축 후에도 컨텍스트가 무너지지 않게 하는 핵심 트릭.

6. **Circuit breaker 일화 callout** — "1,279 sessions had 50+ consecutive failures (up to 3,272)" 같은 BQ 코멘트는 그 자체로 운영 인사이트. claw 는 이런 보호장치가 없다고 한 줄.

7. **토큰 회계 정밀도 비교** — 블로그가 "bytes / 4" 를 "안전 마진" 으로 합리화하는데, 원본의 `tokenCountFromLastAPIResponse()` 우선 + 모델별 동적 임계값을 한 표로 대비하면 trade-off 가 더 분명해짐.

## 참조한 원본 파일

- `/home/heru/code/claude-analysis/src/services/compact/compact.ts` (1705 LOC, 메인)
- `/home/heru/code/claude-analysis/src/services/compact/prompt.ts` (374 LOC, 9 섹션 LLM 프롬프트)
- `/home/heru/code/claude-analysis/src/services/compact/autoCompact.ts` (351 LOC, 임계값·circuit breaker)
- `/home/heru/code/claude-analysis/src/services/compact/sessionMemoryCompact.ts` (630 LOC)
- `/home/heru/code/claude-analysis/src/services/compact/microCompact.ts` (530 LOC)
- `/home/heru/code/claude-analysis/src/services/compact/postCompactCleanup.ts` (77 LOC)
- `/home/heru/code/claude-analysis/src/commands/compact/compact.ts` (287 LOC, fallback chain + reactive)
- `/home/heru/code/claude-analysis/services/Compact_Service.md`
- `/home/heru/code/claw-code/PARITY.md` ("Session compaction behavior matching" 미체크 항목)
