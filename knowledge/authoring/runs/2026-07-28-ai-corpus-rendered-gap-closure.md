# AI 아티클 렌더·서사 간극 종결 기록

## 목적

AI 아티클의 내용 구조를 다시 바꾸기 전에 실제 독해를 막는 렌더 결함과
`제목 → 설명 없이 Viz`로 이어지는 서사 단절을 전수 검사했다. 이번 묶음의
완료 조건은 다음 네 가지다.

1. 모바일과 데스크톱에서 장면이 잘리거나 가로 스크롤을 만들지 않는다.
2. SVG의 `foreignObject`, 긴 식별자와 설명문이 경계 밖으로 나가지 않는다.
3. Viz 앞 문장이 실제 조작 축·단계·판정값을 정확히 예고한다.
4. 정적 검사, 렌더 감사와 독립 Claude 검증이 같은 결론을 낸다.

## 진단

- AI 297개 아티클의 정적 감사에서는 배포 차단 후보와 수식 설명 누락이 0이었다.
- 최초 전수 렌더 감사는 300개 공개 경로, 600개 viewport 검사를 수행했다.
- 실제 Viz 오류 12건과 `h2` 바로 다음에 Viz가 놓인 서사 경고 22건을 찾았다.
- HTML/CSS 기반 실험실을 빈 Viz로 오인하던 감사기 휴리스틱도 발견했다.
- 광범위한 Claude 요청은 240초 timeout과 code 143으로 끝났으므로 결과로
  인정하지 않았다. 범위를 한 아티클 또는 두 섹션으로 좁혀 다시 호출했다.

## 구현 판단

### 렌더

- 모바일에서 16:9를 강제하던 detection·vision 장면은 4:3으로 바꾸고,
  데스크톱에서만 기존 비율로 돌아가게 했다.
- 세 Claw SVG의 짧은 `foreignObject` 높이와 하단 여백을 늘렸다.
- 권한 정책의 긴 Rust 식별자와 공통 `StopRule`·`Misconception` 본문에
  `min-w-0`, 줄바꿈과 `overflow-wrap:anywhere`를 적용했다.
- 감사기는 SVG뿐 아니라 의미 있는 HTML 자식도 시각 콘텐츠로 인정한다.
- 잔여 overlap 경고를 실제 360px 캡처로 다시 분류했다. Dezero의 세 첫
  장면은 빈 좌표를 줄인 compact viewBox와 넓어진 행 간격으로 글자를 키웠다.
- vLLM 요청 생명주기는 모바일에서 여섯 단계를 한 줄로 축소하지 않고
  `HTTP → Tokenize ↓ Scheduler ← Prefill ↓ Decode → SSE`의 S자 흐름으로
  재배치했다. 데스크톱은 기존 가로 흐름을 유지하되 화살표와 본문을 분리했다.

### 서사

12개 아티클의 22개 지점에 Viz가 실제로 보여주는 질문과 조작 축을 먼저
설명하는 브리지를 추가했다. 단순한 장식 문장이 아니라 다음 계약을 지켰다.

- 고정 query와 변경 가능한 retriever를 구분한다.
- page parser, document assembly, typed block IR의 책임 경계를 구분한다.
- UI에 없는 selector, 독립 toggle, reverse traversal이나 release gate를
  글에서 약속하지 않는다.
- trace 단계, RAG release metric, rolling-origin band와 world-model contract를
  컴포넌트의 실제 이름과 순서로 쓴다.

Claude 후속 감사가 `paragraph`의 공통 `bbox`를 타입 전용 필드처럼 설명한
기존 문장까지 찾아냈다. 이를 `text·language·continuation hint`로 고치고,
`page·bbox·order`는 모든 block의 공통 source reference임을 명시했다.

## Claude 영수증 규칙

Claude 결과는 아래 조건을 모두 만족할 때만 사용했다.

- HTTP 응답이 성공한다.
- JSON의 `ok`가 `true`다.
- `decision.worker`가 `claude-code:sonnet`이다.
- `attempts[0].ok`가 `true`다.
- `result`가 비어 있지 않다.

유효한 최종 OCR 검증:

- `.codex-tmp/claude-narrative-ocr-final-postedit-2026-07-28.json`
- `.codex-tmp/claude-narrative-ocr-typed-final-2026-07-28.json`
- `.codex-tmp/claude-ai-viz-overlap-final-2026-07-28.json`
- `.codex-tmp/claude-ai-viz-permission-final-2026-07-28.json`

앞선 article 단위 검증과 post-edit PASS 영수증은
`.codex-tmp/claude-narrative-*-2026-07-27.json`과
`.codex-tmp/claude-narrative-*-postedit-2026-07-28.json`에 남겼다.

### 이전 500·timeout 누락 대조

`.codex-tmp` 전체를 같은 strict 조건으로 다시 스캔했을 때 `ok:false`인 과거 API
envelope는 23개였다. 이들은 성공으로 세지 않고 다음의 더 좁은 영수증으로
대체됐는지 대조했다.

- broad Viz closure → responsive / SVG 두 bounded retry
- broad narrative closure → article·section 단위 narrative와 post-edit retry
- RAG·V-JEPA·Janus·Chinchilla·PPO → canonical retry / retry2
- Attention·DeepSeek·Promptable vision·Janus runtime → math/evidence/code/Viz 분할 retry
- multimodal·pretraining·world model → contract/facts/handoff post-edit retry
- top-down tracks·Knowledge Systems·category renderer·mobile search → final retry와
  closure queue

대조 결과 23개 모두 뒤의 strict-valid receipt가 같은 범위를 소유했다. request
payload와 manifest 파일은 receipt가 아니므로 실패 수에서 제외했다. 원본 목록은
`.codex-tmp/claude-failed-envelopes-2026-07-28.txt`, 전체 strict 분류는
`.codex-tmp/claude-invalid-receipts-2026-07-28.tsv`에 남겼다.

## 작은 모델용 재현 절차

4B·9B 모델에는 “전체 블로그를 검토하라”는 한 요청을 주지 않는다. 다음처럼
입력과 판정을 기계적으로 좁힌다.

1. 감사기가 오류 후보를 `route + viewport + element`로 추린다.
2. 모델에는 한 bridge와 바로 아래 한 component만 제공한다.
3. 약속한 명사, 조작 가능 변수, 단계 순서와 판정값을 표로 대조시킨다.
4. `PASS` 또는 파일·줄·실패 시나리오가 있는 단일 finding만 허용한다.
5. 수정 후 같은 범위로 다시 검증하고, 유효 영수증 조건을 프로그램이 검사한다.
6. 마지막에만 Playwright 전수 감사로 국소 판정의 누락을 확인한다.

이 구조에서는 작은 모델이 장문의 전역 맥락을 기억할 필요가 없다. 정적
감사기가 후보를 찾고, 모델은 두 짧은 계약의 의미 일치만 판정하며, 브라우저
감사가 최종 사실을 확인한다.

## 최종 검증

- Production build: pass. 기존 large-chunk warning만 유지된다.
- Focused ESLint와 `git diff --check`: pass.
- 12개 서사 대상: 24 viewport, 64 visual surface, error 0, warning 0.
- AI 서사 전수: 300 route, 600 viewport, 2,030 visual surface, error 0,
  heading-directly-to-Viz warning 0.
- 원래 오류가 있던 7개 Viz 경로: 14 viewport, 98 surface, 62 SVG,
  error 0, warning 0.
- Dezero·vLLM 잔여 경고 4개 경로: 8 viewport, 46 surface, 45 SVG,
  error 0, warning 0.
- Claude Code 권한 장면: 2 viewport, 8 surface, 6 SVG, error 0, warning 0.
- vLLM·권한 장면의 모든 9개 step을 360px에서 전환했다. visible SVG는 매
  step 1개이고, SVG 밖 text·surface overflow·document overflow는 모두 0이었다.
- AI Viz 최종 전수: 300 route, 600 viewport, 2,030 surface, 645 SVG,
  error 0, warning 0.

## Production 배포

- `cm-blog.service`: 2026-07-28 09:44:22 KST 재시작, active/running.
- `dist/index.html`, service-local HTML, public HTTPS HTML SHA-256:
  `fd0851cf608c1761740c6c174c9ec468adf64ae116a9115853adb28cc46c17d8`.
- AI category와 이번 변경의 23개 article route: 모두 HTTP 200.
- initial JS/CSS와 preload asset 9개: 모두 HTTP 200.
- legacy `/blog/`: `/lab/blog/`로 308.
- 공개 Playwright: 10개 핵심 route × desktop/mobile = 20회, runtime error,
  document/surface overflow와 KaTeX error 0.
- 공개 360px 상호작용: vLLM 5단계 + 권한 모드 4단계 = 9회, visible scene
  SVG 1개, SVG 밖 text·surface/document overflow 0.
- 공개 QA:
  - `.codex-tmp/public-ai-route-qa-2026-07-28.json`
  - `.codex-tmp/public-ai-interaction-qa-2026-07-28.json`
  - `.codex-tmp/public-vllm-serving-mobile-final-2026-07-28.png`
  - `.codex-tmp/public-claude-code-mobile-final-2026-07-28.png`
