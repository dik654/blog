# LLM architecture와 전체 아티클 학습 흐름 재구성 보고서

이 문서는 완성 글의 요약이 아니라, 흩어진 아티클을 어떻게 하나의 학습 시스템으로 바꿨는지 재현하기 위한 판단 기록이다. 기계 판정과 파일 목록은 같은 이름의 JSON에 보존한다.

## 1. 문제를 글 하나가 아니라 세 층으로 분해했다

사용자가 지적한 핵심은 `llm-architecture-gallery`의 표가 보기 싫다는 수준이 아니었다. 모델 이름과 fact를 먼저 나열하면 독자는 각 모델이 왜 생겼고, 앞 모델에서 무엇을 물려받았으며, 어느 병목 하나를 바꿨는지 연결하지 못한다. 같은 문제가 사이드바, 분야별 목록, 개별 본문에서도 반복됐다.

따라서 구현을 세 층으로 분리했다.

1. 전체 정보 구조: 현재 목표에서 시작해 필요한 기반으로 내려가고 구현으로 닫는다.
2. 주제 경로: 각 아티클은 앞 글에서 가져올 개념, 이번 도달점, 다음 확장을 명시한다.
3. 본문 계약: 문제 -> 이전 병목 -> 실행 순서 -> 이점 -> 비용 -> 검증 순서로 설명한다.

전역 연결은 `ArticleLayout`에 두어 등록된 모든 글에 적용했다. 핵심 경로는 선언된 `learningPath`를 우선하고, 그 밖의 글은 같은 하위 주제에서 출처 글과 개념 글을 분리한 순서를 사용한다. 이 구조 덕분에 오래된 글이 아직 개별 본문 링크를 갖지 않아도 독자가 경로에서 고립되지 않는다.

## 2. LLM 아키텍처는 모델 표가 아니라 병목 계보로 다시 썼다

공통 기준점은 GPT-2 계열의 decoder-only dense Transformer다. 이후 모델은 전부 다음 질문으로 비교한다.

1. 어떤 병목 때문에 새 구조가 필요했는가.
2. Transformer에서 그대로 물려받은 계산은 무엇인가.
3. 정확히 어느 block 또는 memory contract가 바뀌었는가.
4. token 하나가 실제로 어떤 순서로 지나가는가.
5. 무엇을 얻고 어떤 비용을 치르는가.
6. 새 논문에서 반드시 확인할 공개 근거는 무엇인가.

기본 경로는 GPT-2 -> Llama 3 -> Gemma 3 -> DeepSeek V3 -> Kimi Linear 순서다. 전체 모델 catalog는 기본 경로에서 제거하고, Dense -> KV/Long Context -> Sparse MoE -> Hybrid/Linear의 선택 심화로 내렸다. 각 심화 페이지도 표를 제거하고 모델별 `필요 이유 -> 실행 순서 -> 구조 변화 -> 이점과 비용`을 시간 순서로 읽게 했다.

## 3. 최소 바닥은 가장 오래된 논문이 아니라 현재 구조를 설명할 수 있는 지점이다

학습 경로가 인용을 따라 무한히 과거로 내려가지 않도록 각 분야에 중단 조건을 둔다. LLM 아키텍처의 최소 바닥은 Transformer의 Q/K/V, multi-head attention, residual, normalization, FFN 계산이다. RNN 이전 역사나 attention 이전의 모든 언어 모델을 필수 선행으로 만들지 않는다.

새 연구가 나오면 다음 규칙을 적용한다.

- 기존 계산 계약 안에서 수치와 규모만 바뀌면 최상단 사례만 교체한다.
- attention, routing, state, memory traffic 또는 학습 신호가 바뀌면 새 개념 델타를 추가한다.
- 그 델타를 설명하는 수학·과학이 기존 기반에 없을 때만 하단 기반 글을 추가한다.
- 제품 이름만 다른 checkpoint는 기본 계보가 아니라 비교 로그에 둔다.

## 4. 수식은 렌더 성공이 아니라 독해 가능성을 검사한다

Raw LaTeX가 보이지 않는 것만으로는 충분하지 않다. 표시 수식 묶음마다 바로 뒤에 한글 `FormulaNote`가 있어야 하며, 기호 뜻뿐 아니라 그 연산이 필요한 이유를 설명한다. 여러 줄이 하나의 인과 계산을 이루면 한 묶음으로 설명할 수 있지만, 다음 제목까지 해설이 밀리면 실패다.

정적 감사기는 표시 수식, 설명 노트, 제목의 소스 순서를 읽어 수식 묶음의 해설 여부를 판정한다. 공용 논문 재구성 scaffold가 렌더하는 출처도 원출처 블록으로 인식한다. 이 감사 결과 등록 글 557개에서 전역 연결 557개, 설명 없는 표시 수식 묶음 0개, 원출처 누락 0개다.

## 5. Viz는 색 변경이 아니라 읽는 순서와 상태 변화를 설계한다

LLM gallery의 그림은 작은 카드 안에 넣지 않고 실제 architecture image를 크게 보여 준다. 설명은 그림 옆 또는 아래에서 같은 순서로 읽히며, 모바일에서는 세로로 재배치된다. 선은 얇고 둥근 cap을 사용하고, 강조 색은 observation, memory, routing, state처럼 의미가 있을 때만 쓴다.

모든 Viz를 같은 다이어그램으로 바꾸지는 않는다. 데이터 흐름은 sequence, 구조 비교는 aligned layers, 병목은 measured bars, 시간 변화는 timeline 또는 animation이 맞다. 애니메이션은 정적 상태와 반응형 구조가 끝난 뒤 시간 순서가 인과를 추가하는 장면에만 붙인다.

## 6. 전체 아티클 적용과 점진적 보강을 분리했다

모든 글을 한 번에 다시 쓰었다고 주장하지 않는다. 이번 단계에서 모든 등록 글이 얻은 것은 다음과 같다.

- 현재 위치와 학습 단계
- 앞에서 가져올 개념
- 이번 글의 도달 질문
- 다음 글의 확장 질문
- 경로 시작점의 중단 안내
- 경로 끝의 최신 연구 추가 규칙

개별 글의 summary, prerequisites, 내부 QuestionLead, 세부 연결, causal Viz는 별도 enrichment backlog다. 감사 보고서는 이를 배포 결함과 분리해 source 경로와 우선순위를 기록한다. 이후 작업은 점수가 높은 글부터 같은 본문 계약으로 재구성하면 된다.

## 7. 4B·9B 모델로 재현하는 방법

작은 모델에는 전체 사이트를 한 prompt로 주지 않는다.

### 4B packet

한 번에 하나만 맡긴다.

- 한 모델의 predecessor와 changed block 비교
- 한 표시 수식 묶음의 직관·연산 이유·기호 해설
- 한 Viz의 input state, transition, observable, failure state
- 한 아티클 metadata의 prerequisite와 next question
- 한 viewport에서 발견된 overflow 또는 clipping 수정

입력에는 source claim, 허용 파일, 출력 schema, 금지된 과장, 검증 명령을 고정한다. 모델은 먼저 구조화된 IR을 내고 prose나 코드를 만든다.

### 9B packet

한 causal section 또는 한 모델 milestone을 맡긴다.

```text
previous contract
-> observed bottleneck
-> changed mechanism
-> execution order
-> gain and cost
-> source evidence
-> transfer question coverage
-> formula and Viz contract
-> responsive acceptance checks
```

오케스트레이터는 분야 경로 선택, 최소 바닥 결정, 비공개 최고난도 전이 문제, 출처 충돌, 공통 기호, browser QA와 배포를 유지한다. 실패는 “다시 잘 써라”가 아니라 viewport, selector, expected invariant, observed value, 허용 파일이 있는 결함 packet으로 돌려보낸다.

## 8. 검증 기준

- 등록 글 557개 모두 공통 학습 연결을 렌더한다.
- LLM gallery와 네 심화 글에는 fact sheet와 표가 없다.
- LLM gallery의 다섯 architecture image가 로드된다.
- 표시 수식 묶음은 다음 제목 전에 한글 설명을 갖는다.
- 모바일과 데스크톱에서 document overflow가 없다.
- 링크는 `/lab/blog/...` base path를 보존한다.
- 최종 build, 집중 Playwright, 공개 URL 브라우저 검증 뒤에만 배포 완료로 기록한다.

## 9. 최종 회귀에서 발견한 수식 결함과 수정 이유

최초 집중 검증은 통과했지만 전체 217개 병렬 회귀에서 360px 수식 다섯 개가 7.8~9.4px까지 축소되는 문제가 드러났다. CSS 최소 크기를 억지로 올리면 다시 잘리므로 다음 순서로 고쳤다.

1. 가장 작은 수식의 `data-math-source`, 실제 font size, scale, rendered width를 수집했다.
2. 한 줄에 여러 `underbrace`가 몰린 식을 중간량 정의와 최종 조립의 2~4줄 유도식으로 바꿨다.
3. 데이터 효과 비교, MTP loss, resident memory, 음성 latency, world-model 누적 오차의 계산 순서가 본문 설명과 일치하는지 다시 확인했다.
4. 긴 영문 전력전자 주석은 더 직접적인 한국어 용어로 줄여 390px 최소 scale을 0.87로 안정화했다.
5. 웹폰트 교체 뒤 2px가 다시 생기는 경우를 막기 위해 `document.fonts.ready`와 `loadingdone`에서 수식을 재측정한다.
6. 숨김 MathML이 만드는 가짜 `scrollWidth`와 실제 KaTeX 박스를 구분하고, 독자가 보는 `getBoundingClientRect()`를 overflow 판정에 사용했다.

최종 결과는 production build 통과, 전체 local Playwright 217/217 통과, 공개 도메인 집중 Playwright 53/53 통과다. `cm-blog.service`는 2026-07-21 00:53:10 KST에 재시작했고 공개 경로는 HTTP 200을 반환했다. 감사 결과는 등록 글 557개, 전역 연결 557개, 배포 차단 0개, 설명 없는 수식 묶음 0개다. 개별 글의 내부 깊이 보강 547개는 전역 연결 완료와 구분한 enrichment backlog로 유지한다.

## 10. Hybrid·Linear Attention은 모델 목록이 아니라 세 개의 실행 계약으로 닫았다

이 글의 시작점은 Mamba의 역사 자체가 아니라 2026년 공개 목표인 Qwen3.6의 `3 Gated DeltaNet : 1 full attention`과 FlashQLA다. 여기서 바로 과거 논문을 나열하면 다시 catalog가 되므로 먼저 현재 모델을 네 축으로 분리했다.

1. Token mixer: 현재 layer가 Gated DeltaNet인지 full attention인지 선택한다.
2. Persistent memory: 과거 token별 KV를 남기는지 고정 shape state로 압축하는지 구분한다.
3. FFN capacity: Sparse MoE의 total parameter와 active parameter를 별도 축으로 둔다.
4. Runtime: recurrent decode와 chunkwise training/prefill kernel을 구분한다.

그 뒤에 필요한 최소 역사만 역으로 붙였다. Mamba와 Mamba-2는 selective SSM과 recurrent·block 실행의 기준, DeltaNet은 같은 key의 association을 prediction error로 고치는 기준, Gated DeltaNet은 전체 감쇠와 key 방향 교정의 결합, Kimi Linear는 channel-wise KDA와 3:1 hybrid의 공개 production-scale 기준이다. S4 이전의 전체 SSM 역사와 모든 linear-attention 변형은 이 질문을 푸는 데 필수가 아니므로 기본 경로에서 끊었다.

### 원문에서 복원한 주장과 경계

- Mamba: input-dependent SSM parameter와 hardware-aware recurrent computation을 selective state의 근거로 썼다.
- Mamba-2/SSD: scalar-identity SSM과 semiseparable masked attention의 정확한 교집합만 설명했다. 모든 SSM이 softmax attention과 같다고 확장하지 않았다.
- DeltaNet: prediction error를 현재 key subspace에 쓰는 delta rule과 WY chunkwise algorithm을 연결했다.
- Gated DeltaNet: scalar decay와 delta correction이 상보적이라는 주장만 해당 논문의 실험 범위 안에서 사용했다.
- Kimi Linear: KDA의 channel-wise diagonal gate, 20 KDA + 7 MLA 공개 구성, 3:1 cadence를 사용했다. 1M context와 kernel 속도는 저자 환경에 묶인 수치로 표시했다.
- Qwen3-Next·Qwen3.6·FlashQLA: 공식 config와 공식 연구 글에서 실제 layer cadence와 kernel 주장을 확인했다.
- Preconditioned DeltaNet: 2026 연구 방향으로만 소개하고 340M·1B 실험을 production 배치 사실로 쓰지 않았다.

### 본문만으로 풀어야 하는 비공개 전이 문제

첫째, 48-layer 3:1 hybrid에서 state shape와 KV width가 주어졌을 때 32K와 128K의 persistent memory를 계산하고, 왜 절감률이 context가 길어질수록 약 75%에 가까워지는지 설명해야 한다. 둘째, 같은 unit key에 두 value를 연속 기록했을 때 additive update의 `(1,1)` collision과 beta=1 delta update의 `(0,1)` overwrite를 직접 유도해야 한다. 셋째, 논문이 “linear attention은 병렬”이라고 썼을 때 recurrent decode의 token dependency, chunk 내부 병렬 계산, chunk 경계 recurrence를 분리하고 실제 speedup을 인정하려면 어떤 kernel·hardware·sequence 조건이 필요한지 말해야 한다.

이 문제를 풀기 위해 숫자를 본문과 Viz 양쪽에 고정했다. State 한 층은 `0.25 MiB`, 32K KV 한 층은 `128 MiB`, 36 state + 12 attention은 `1,545 MiB`, 48 all-attention은 `6,144 MiB`다. 128K에서는 각각 `6,153 MiB`와 `24,576 MiB`다. Alpha가 0.8이면 10 step retention은 `10.74%`, 20 step은 `1.15%`다. 이 값들은 실제 Qwen 메모리 재현이 아니라 구조를 비교하는 교육용 장부이며 convolution buffer, allocator, normalization·gate state, workspace를 의도적으로 제외했다.

### Viz와 수식 판단

`StateMemoryLedgerLab`은 48칸의 `S,S,S,A` cadence와 32K·128K 메모리 장부를 같은 화면에서 바꾼다. `DeltaRuleMemoryLab`은 2x2 state, write step, read result를 노출해 collision과 overwrite를 눈으로 검산하게 한다. `LinearAttentionExplorer`는 recurrent decode와 chunkwise training을 전환해 “완전 병렬”이라는 과장을 막는다. 색은 state, attention, 경고라는 역할에만 쓰고, 모바일 메모리 지표는 두 열로 압축하되 최종 감소율은 전체 폭에 두었다.

표시 수식 14개에는 모두 한글 `underbrace`와 바로 뒤 `FormulaNote`를 붙였다. 최초 회귀에서 exact-overwrite 식이 390px에서 `11.67px`까지 줄어든 것을 발견해 수학 정보는 유지하고 내부 라벨을 `같은 key 재조회 / 이전값 / 새 목표 / 단위 key`로 줄였다. 최종 최소 KaTeX 글자는 `12.68px`이고 formula·document overflow는 0이다.

### 협업, 검증, 배포 기록

Context-manager의 `ai-researcher`에 원문 사실성과 학습 깊이 감사를 네 차례 요청했고, 마지막에는 `ui-design-researcher`에 세 viewport의 정보 위계 감사를 별도로 요청했다. 모든 요청이 같은 `Provider error: All providers failed` 500 오류로 끝났다. 사용자의 경계에 따라 direct Claude CLI로 우회하지 않았고, 원문 TeX·공식 config·공식 연구 글을 직접 대조한 결과와 실패 trace를 이 기록에 남겼다.

2026-07-22 최종 결과는 targeted ESLint와 `git diff --check`, production build, local Hybrid+learning-flow Playwright 23/23, public Hybrid+learning-flow Playwright 23/23 통과다. 390·768·1440px에서 세 Viz, 14 수식·14 설명, 다섯 causal chapter, 표 0개, 수치 oracle, 링크·이미지·console error를 검사했다. `cm-blog.service`를 23:16:59 KST에 재시작했고 article과 chunk가 local·public 모두 HTTP 200을 반환했다. 배포 chunk는 `llm-architecture-hybrid-linear-64nEvFXN.js`, SHA-256은 `406560cd0b14da4cc38feac26732b02b67caeb8f48b20a8c3b320f7b0e6f11ac`다.

## 11. 최신 구조 질문은 네 기반 글 뒤 실제 보고서에서 검산하도록 닫았다

`llm-architecture-gallery`에는 과거 model catalog를 만들던 70개 이상의 `rowsRaw` 문자열과 분류 helper가 렌더되지 않은 채 남아 있었다. 이 자료를 다시 표나 card로 살리면 독자는 이름을 많이 보지만 새 보고서의 구조를 스스로 읽지는 못한다. 따라서 dead catalog를 제거하고 gallery의 역할을 2026년 변화에서 읽을 축을 정한 뒤 `Dense -> KV -> Sparse MoE -> Hybrid·State -> 실제 보고서 검산`으로 내려가는 출발점으로 제한했다.

사이드바에도 같은 순서를 `00`부터 `05`까지 분리했다. 카테고리 본문에는 여섯 글 전체를 보여 주는 학습 rail을 추가해, 어느 하위 페이지에 들어가도 현재 위치와 남은 단계가 보인다. 이때 `research-` 접두어를 모두 선택 원문으로 접어 버리는 기존 휴리스틱 때문에 DeepSeek 보고서가 목록에서 사라지는 결함을 발견했다. `curriculumRole: core | source`를 추가해 원문 자체와 원문을 재구성한 필수 사례 글을 URL 이름과 무관하게 구분했다.

### Gallery와 보고서의 역할을 나눴다

Gallery의 최신 상단 근거는 DeepSeek-V4, Moonshot Attention Residuals, Gemma 4 12B다. 이 글은 새로운 모델 이름을 모두 설명하지 않고 입력 경계, 문맥 혼합, 용량 배분, 상태 저장, 깊이 혼합이라는 판독 축을 준다. DeepSeek-V3.2 보고서는 이 축을 실제 23쪽 기술 보고서에 적용해 DSA, stable RL, agent synthesis와 context runtime을 별도 주장으로 검산하는 사례다. 같은 목적의 새 글을 추가하지 않고 기존 보고서를 필수 경로의 마지막 단계로 옮긴 이유다.

### 본문만으로 풀어야 하는 비공개 전이 문제

첫째, `L=131,072`, `k=2,048`에서 DSA core의 정밀 비교는 dense core의 `1/64`, 선택 비율은 `1.5625%`임을 계산해야 한다. 다만 모든 후보를 보는 작은 indexer, top-k gather, kernel과 memory traffic이 남으므로 end-to-end가 64배 빠르다고 말하면 실패다. 둘째, rollout과 training에서 같은 표면 token이 서로 다른 MoE expert를 지나면 conditional action path와 support가 달라지므로 단순 importance ratio의 전제가 흔들린다는 점을 설명해야 한다. 셋째, 합성 agent의 database, tool API, hidden solution과 verifier를 분리하고 direct database access, shared shortcut, seen-environment memorization을 막는 test를 설계해야 한다. 넷째, BrowseComp의 평균 step `140 -> 364`와 score `53.4 -> 60.2`를 `2.60x`, `+6.8 point`로 계산한 뒤 total token, wall time, tool cost와 state loss는 별도 근거가 필요하다고 말해야 한다.

### Viz는 단계와 수치의 검산 도구로 바꿨다

`DeepSeekV32StudyViz`는 Sparse Attention, Stable RL, Agent Synthesis, Context Runtime 네 모드를 분리한다. 각 모드에서 네 실행 단계를 누르면 그 단계가 무엇을 계산하고 다음 단계에 어떤 state를 넘기는지 별도 패널에서 읽는다. 아래 수치 장부는 구조 설명과 원문 수치를 분리하고, invariant와 failure는 같은 화면에서 대조한다. 모바일은 촘촘한 1열, 태블릿은 2x2, 데스크톱은 화살표가 있는 4열이다. 첫 스크린샷에서 모바일·태블릿 카드의 빈 높이와 불필요한 세로 화살표를 확인해 이 구조로 다시 줄였다.

표시 수식은 5개이고 바로 뒤 한글 `FormulaNote`도 5개다. 360px 첫 회귀에서 KL indexer 식이 `11.8798px`까지 줄어든 것을 확인했고, 공통 논문 scaffold의 모바일 시작 크기를 13px로 높여 공개 환경 최소 `12.1917px`, 수식 overflow 0을 확보했다. 임계값을 낮춰 통과시키지 않았다.

### 협업, 검증, 배포 기록

Context-manager의 `curator`와 `ui-design-researcher`에 정보 구조와 Viz 감사를 세 차례 요청했지만 모두 `Provider error: All providers failed` 500으로 끝났다. Direct Claude CLI로 우회하지 않았고 실패를 기록했다. 이후 공식 DeepSeek 보고서·release note, DeepSeek-V4 report, Moonshot 공식 repository, Google 공식 Gemma 발표를 대조했다.

최종 결과는 targeted ESLint, `git diff --check`, production build, local 27/27과 public 27/27 Playwright 통과다. 360·390·768·1440px에서 학습 rail, sidebar 순서, 5 수식·5 설명, 네 mode·각 네 stage, 수치 oracle, 내부 기반 링크, overflow와 console error를 검사했다. 시각 증거는 `qa-results/current-report-20260722`에 남겼다. `cm-blog.service`는 2026-07-22 23:38:57 KST에 재시작했고 article과 chunk가 local·public HTTP 200을 반환했다. 배포 chunk는 `research-deepseek-v3-2-2025-BLM5WPb3.js`, SHA-256은 `7fd4d6481fd0528ff0f2265d0163275de8e1b16d2bef1a264ec73e161e85fca6`다.
