# Ideogram 4 · Krea 2 current-model branches

## 왜 이 작업을 했는가

`open-image-video-models` 한 글 안에서 최신 모델 이름과 표를 나열하면 모델을 고르는 데는 도움이 되지만,
왜 구조가 달라졌고 어떤 입력·학습·배포 계약을 지켜야 하는지는 설명하지 못한다. 이번 작업은 최신 목표에서
공통 image runtime으로 내려갔다가 서로 다른 두 사례로 다시 올라오는 독립 branch를 만든다.

- Ideogram 4: typography와 layout을 “예쁜 sample”이 아니라 exact text·box·palette·rights gate로 읽는다.
- Krea 2: 넓은 style distribution을 data, architecture, curriculum, post-training과 RAW→Turbo handoff로 읽는다.
- 두 글 모두 공통 runtime → 모델 사례 → 재현 workflow의 3단계 학습 경로를 가진다.

## 조사와 근거 경계

### Ideogram 4

- 공식 release, repository, prompting, architecture, inference, licensing 문서만 현재 사실의 근거로 사용했다.
- Structured JSON, y-first 0–1000 bbox, palette, Qwen3-VL 13-layer feature, 34-block single stream,
  Euler flow preset과 공개 weight·code·commercial right의 분리를 본문 소유 범위로 정했다.
- Editable text와 movable layer는 현재 capability가 아니라 후속 roadmap으로 분리했다.

### Krea 2

- 공식 technical report, repository, prompting과 licensing 문서만 현재 사실의 근거로 사용했다.
- Data filtering과 caption enrichment, Qwen3-VL multi-layer feature, single-stream ablation,
  256→512→1024 curriculum, SFT→preference→RL과 RAW/Turbo 설정을 본문 소유 범위로 정했다.
- Krea product의 prompt expander·style reference와 공개 core checkpoint를 같은 기능으로 쓰지 않았다.
- Repository code의 Apache license와 model weight의 Krea Community License를 분리했다.

## 자체 문제에서 본문으로 역설계

각 `content-spec.md`에 실제 독자가 틀리기 쉬운 hard question을 먼저 적었다. 문제를 본문에 그대로 싣기
위해서가 아니라, 완성된 본문만 읽고 다음 판단을 할 수 있는지 검사하기 위한 hidden evaluation이다.

- Ideogram: Unicode exact match, bbox 좌표 순서, caption schema, text feature 깊이, sampler preset,
  2K 비용, 공개와 상업 권리, roadmap의 시간 경계를 판정할 수 있는가.
- Krea: Diversity와 noise를 구분하고, GQA 설명을 KV cache로 오해하지 않으며, resolution·precision curriculum,
  reward 경계, RAW 52/CFG 3.5와 Turbo 8/CFG 0/mu 1.15를 섞지 않을 수 있는가.

## 정보 구조 결정

- `ai-open-models-krea`, `ai-open-models-ideogram`을 독립 leaf로 추가했다.
- Sidebar 순서는 기준 runtime → Krea 2 → Z-Image → Ideogram 4 → Illustrious XL로 잡았다.
- 기존 `open-image-video` current track의 목표 글은 hub로 유지하고 두 모델을 선택 사례로 연결했다.
- Hub의 중복 설명과 별도 citation block은 줄이고 전용 글의 “구조부터 읽기” 링크를 남겼다.
- 두 모델을 하나의 공통 필수 경로에 넣지 않았다. 서로 다른 제작 실패를 해결하는 선택 branch이기 때문이다.

## Viz 추론 기록

초기 Scene은 다섯 stage card에 각 설명을 모두 넣었다. 모바일에서는 현재 stage만 보여 읽기 쉬웠지만,
데스크톱 article column에서는 제목과 설명이 말줄임표로 잘렸다. 시각 감사 뒤 다음처럼 역할을 다시 나눴다.

- 상단 rail: 모든 단계의 아이콘과 짧은 이름만 보여 전체 위치를 잃지 않는다.
- 하단 active panel: 현재 단계의 상세, 변환·관측·실패 또는 release evidence를 읽는다.
- 모바일: 현재 단계 하나와 1/5 위치를 보여 폭을 고정한다.
- 비활성 단계 opacity를 높여 전체 흐름이 사라지지 않게 했다.
- Krea의 마지막 장면은 RAW와 Turbo의 수치 계약을 두 lane으로 직접 비교한다.
- 768px 시각 감사에서 다섯 rail label이 단어 중간에서 꺾여, 900px 미만은 현재 stage·evidence 하나로 재배치하고
  900px 이상에서만 전체 rail을 보이게 했다.
- Ideogram은 natural/JSON, exact text, style, y-first box, palette와 guidance branch를 실제로 바꾸고 납품 계약을
  계산하는 lab을 추가했다. Branch 전환 시 개념 token 배열에서 text-token 묶음이 실제로 사라지는 상태도 표시한다.
- Krea는 RAW/Turbo, LoRA·Train/Inference, steps, CFG, mu와 resolution을 바꾸고 잘못된 조합의 정확한 위반을
  보여 주는 artifact lab을 추가했다. RAW의 빈 `mu`는 누락이 아니라 자동 timestep shift임을 조작부에 명시했다.

## 수식 계약

- Ideogram display formula 3개: bbox normalization, joint attention, step별 CFG를 포함한 Euler flow update.
- Krea display formula 2개: resolution curriculum compute, classifier-free guidance의 실제 실행 분기.
- 모든 display formula는 같은 `data-formula-pair` 안에서 바로 다음 한국어 `FormulaNote`와 1:1로 연결한다.
- 수식 안의 핵심 연산은 한국어 underbrace로 설명하고, 본문에 raw LaTeX가 노출되지 않게 한다.
- Krea 공식 `sampling.py`를 대조해 `CFG 0`을 표준 식에 0을 대입하는 것으로 설명하지 않았다. `guidance=0`은
  unconditional encoding·model pass를 생략하고 `v_c`를 반환하며, 양수일 때만 `v_c+s(v_c-v_u)`를 실행한다.

## 검증

- Targeted ESLint: PASS.
- Vite production build: PASS.
- Playwright `tests/ideogram-krea-model-contract.spec.ts`: mobile 390×844, tablet 768×1024,
  desktop 1440×900을 포함해 10개 PASS.
- `cm-blog.service` 재시작 뒤 공개 Ideogram·Krea article과 두 sidebar leaf가 모두 HTTP 200을 반환했다.
- 같은 Playwright 10개를 `https://heru.ragdoll-bigeye.ts.net`에 다시 실행해 10개 PASS했다.
- Formula/FormulaNote count, KaTeX error, raw LaTeX, document·formula·Viz overflow, Scene step 5,
  두 interactive lab의 pass/invalid state, 학습 경로 3단계, leaf 단독 소유, top-down concept link,
  공식 source link와 hub 내부 link를 검사했다.
- Font loading과 math ResizeObserver가 안정된 뒤 formula overflow를 측정한다.
- Desktop/mobile/tablet screenshot을 직접 읽고 잘린 stage label, 낮은 inactive contrast와 768px rail 압박을 수정했다.
- Repository 전체 `tsc -b`는 이번 범위 밖 기존 파일들의 type error로 실패했다. 이번 범위는 targeted ESLint와
  Vite production build에서 통과했으며, 기존 error 목록은 배포 결과를 통과로 바꾸지 않고 별도 residual risk로 남긴다.

## Context Manager · Claude receipt

넓은 pre-implementation 요청은 Context Manager 500 이후 작은 사실·경계·서사·Viz packet으로 분할했다.
응답 envelope가 `ok=true`, worker가 `claude-code:sonnet`, 첫 attempt가 성공하고 substantive result가 있는 실행만
채택했다. HTTP 200이어도 code 143, empty result, timeout이면 검증 완료로 세지 않았다.

- 넓은 Ideogram/Krea pre-audit와 Krea web-fetch packet은 code 143 timeout으로 REJECT했다.
- Ideogram의 좁은 기술 사실 packet, IA wiring packet과 file-split content packet은 실제 Sonnet 응답만 채택했다.
- 별도 병렬 감사 A(IA)와 B(Formula/Viz)는 첫 attempt Sonnet으로 PASS했다. 여기서 나온 leaf 독점성,
  top-down rendered link, math settle test gap 세 개를 모두 반영했다.
- 더 강한 Viz packet은 기존 정적 StepViz가 조작 가능한 상태·invalid-combo 계산을 갖지 않았다고 REJECT했다.
  이 지적을 수용해 두 contract lab을 구현했다.
- File-split 감사에서 Magic Prompt/Hive 배포 경계, Qwen3-VL frozen text-only, attention 곱셈 이유,
  Krea diversity 문장과 curriculum 용어 설명을 보강했다.
- 마지막 delta 감사에서 MRoPE 첫 정의, 폐쇄망·Hive·권리 gate hidden question, RAW/Turbo를 정의 전에
  사용하던 도입 순서를 수정했다.
- 수정 뒤 `final-two-open-recheck`를 다시 보냈고 HTTP 200, top-level `ok=true`,
  first-attempt `claude-code:sonnet`, verdict `ACCEPT`를 받았다. 같은 검증에서 Ideogram token-lane 구조 변화와
  Krea RAW `mu=auto` 설명까지 PASS했다. 이 호출은 500·143·timeout·fallback이 아니다.
- Krea의 넓은 독립 web-source packet 두 개는 원래 `code=143` 실패로 보존했다. 이후 공식 URL별로 RAW runtime,
  Turbo·LoRA, architecture, training 네 packet으로 축소해 다시 검증했고, 네 호출 모두 HTTP 200,
  `ok=true`, first-attempt Sonnet, content `ACCEPT`를 받았다. 따라서 실패를 성공으로 바꾸지 않고 실제로
  재검증된 최소 claim 범위만 source ACCEPT로 닫았다.
- 원장:
  `.codex-tmp/claude-postimplementation-ideogram-krea-parallel-2026-07-28/receipt-ledger.md`,
  `.codex-tmp/claude-postimplementation-ideogram-krea-2026-07-28/`,
  `.codex-tmp/claude-final-delta-ideogram-krea-2026-07-28/results/final-two-open-recheck.json`,
  `.codex-tmp/claude-final-delta-ideogram-krea-2026-07-28/results/krea-source-micro/`.

## 작은 모델로 재현할 때

1. 목표 모델 하나와 공식 source 최대 네 개로 입력을 좁힌다.
2. 현재 기능, architecture/training, runtime, license, roadmap을 서로 다른 claim bucket으로 나눈다.
3. 본문 전에 hard question과 source claim boundary를 먼저 만든다.
4. 공통 runtime에서 이미 설명한 내용은 링크하고, 모델 고유 delta만 깊게 쓴다.
5. Viz는 “모델 전체 그림”보다 실패 소유자를 찾는 4~6 stage trace로 만든다.
6. Formula마다 직관·연산 이유·symbol 의미를 즉시 붙인다.
7. 독립 reviewer는 파일을 수정하지 않고 사실, 누락, 학습 순서, responsive layout을 각각 판정한다.
8. 넓은 검증이 실패하면 packet을 article/fact/viz 단위로 줄이고 모든 retry를 receipt ledger에 남긴다.
