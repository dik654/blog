# Robot VLA current-first source reconstruction

Date: 2026-07-27 KST

## Objective

Robot AI 경로를 오래된 논문 목록이 아니라 현재 target에서 시작하는 유한한 source spine으로
닫는다. 공식 current source를 확인하고, 최소 공개 기준까지 내려가며, 본문만 읽어도 낯선
robot·mixed-quality data·latency 조건을 설계하고 증거 범위를 판정할 수 있게 한다.

## Observed

- 기존 track current는 π0.5였고 current/canonical 모두 내부 source article이 없었다.
- Physical Intelligence 공식 sitemap과 publication page에는 2026-04-16의 π0.7이 더 최신
  current source로 존재했다.
- π0.7은 약 5B policy와 별도 14B BAGEL 기반 world model, mixed-quality metadata,
  short visual history, 50-step action chunk와 real-time chunking을 결합한다.
- OpenVLA는 공개 재현 가능한 VLA 바닥이지만 one-image policy, discrete action token,
  느린 closed-loop cadence와 90% 미만 reliability 한계를 가진다.
- 기존 broad Claude gap audit 두 건은 다시 180초 timeout이 났다. 실패 자체는 pass로 세지 않았다.
- 390px 수식 회귀를 처음 추가했을 때 π0.7 목적식은 scale 0.73, OpenVLA cadence 식은
  scale 0.61이었다.
- 공식 OpenVLA code는 논문의 256-bin 문장보다 구체적으로 256 edges, 255 centers,
  `np.digitize`와 final-index clipping을 사용한다.

## Inference

1. Current를 π0.7로 바꾸지 않으면 사용자는 이미 바뀐 context·memory·runtime 계약을
   과거 π0.5에서 출발해 추측해야 한다.
2. π0.5·π*0.6·MEM·BAGEL을 모두 필수 article로 만들면 유한한 바닥이 사라진다. 각 source는
   π0.7이 재사용한 한 책임의 lineage로 설명하면 충분하다.
3. π0.7과 OpenVLA에 필요한 최소 개념은 Robot 실행 경로, imitation/offline learning,
   linear algebra, probability, signals/cadence와 system V&V다. POMDP·motion planning·LQR의
   전체 과정은 target source가 직접 사용하지 않는다.
4. Offline token accuracy와 rollout success 사이에는 model latency와 controller cadence가
   들어간다. 이 차이는 두 source를 연결하는 핵심 transfer insight다.
5. 긴 수식은 글자만 줄이면 사용자 요구를 다시 위반한다. 계산 순서별 행 분리가 필요하다.

## Decision

- Current: `research-pi07-2026`.
- Canonical floor: `paper-openvla-2024`.
- Mandatory concepts: `robot-ai-top-down`, `rl-imitation-offline-learning`.
- Just-in-time foundations: `linear-algebra-tensors`, `probability-information-theory`,
  `signals-systems-convolution`.
- Implementation/release: `robot-system-verification-validation-qualification`.
- Every display formula receives a Korean operation·symbol·assumption·failure `FormulaNote`.
- π0.7 Viz owns prompt disambiguation, asynchronous cadence and evidence boundary.
- OpenVLA Viz owns exact action-token reconstruction, cadence confound and rollout receipt.
- All lab labels use at least 12px text; tables are replaced by responsive evidence bands.

## Claude packets

- π0.7 source: `[claude-code:sonnet · L2 · $0.0000 · 110118ms]` — PASS.
- OpenVLA source: `[claude-code:sonnet · L2 · $0.0000 · 64485ms]` — PASS.
- Minimum route: `[claude-code:sonnet · L2 · $0.0000 · 97705ms]` — PASS.
- Lineage boundary: `[claude-code:sonnet · L2 · $0.0000 · 63399ms]` — initial MUST FIX;
  BAGEL·π0.5·MEM·π*0.6와 CFG attribution을 content spec과 article에 반영했다.
- Identity ledger arithmetic: `[claude-code:sonnet · L1 · $0.0000 · 18394ms]` — PASS.
- Post-ledger replacement logic: `[claude-code:sonnet · L1 · $0.0000 · 25784ms]` — PASS.

Broad `500-gap-audit`와 broad `robot-route`, 날짜별 broad gap audit 둘은 code 143 timeout으로
폐기했다. 위 bounded packets만 accepted review로 센다.

## Post-fix Claude closure

Broad post-fix content review 두 건도 180초 code 143으로 끝나 accepted review로 세지 않았다.
같은 범위를 mechanism/equation과 evidence/runtime으로 나눈 네 packet을 병렬 실행했다.

- π0.7 visual: `[claude-code:sonnet · L1 · $0.0000 · 110108ms]` — P0/P1 0.
- OpenVLA visual: `[claude-code:sonnet · L1 · $0.0000 · 123909ms]` — P0/P1 0.
- π0.7 mechanism: `[claude-code:sonnet · L1 · $0.0000 · 147994ms]` — P1.
  Block-causal visibility와 Knowledge Insulation stop-gradient를 한 장치처럼 쓴 문장을 분리했다.
- π0.7 mechanism recheck: `[claude-code:sonnet · L1 · $0.0000 · 48727ms]` — PASS.
- π0.7 evidence: `[claude-code:sonnet · L1 · $0.0000 · 169528ms]` — P0.
  사람이 주는 verbal coaching, BAGEL world model이 생성하는 visual subgoal, instruction trace로
  학습하는 high-level language policy를 세 단계로 분리했다.
- π0.7 evidence recheck: `[claude-code:sonnet · L1 · $0.0000 · 44504ms]` — PASS.
- OpenVLA mechanism/code: `[claude-code:sonnet · L1 · $0.0000 · 135261ms]` — P0.
  Full fused model의 15 GB·RTX 4090 약 6 Hz와 SigLIP-only·smaller-mixture LoRA table을 분리했다.
- OpenVLA receipt recheck: `[claude-code:sonnet · L1 · $0.0000 · 26146ms]` — PASS.
- OpenVLA evidence/cadence: `[claude-code:sonnet · L1 · $0.0000 · 111137ms]` — PASS.

첫 π0.7 mechanism packet `[claude-code:sonnet · L1 · $0.0000 · 152040ms]`는
`MUST FIX`만 반환하고 line evidence가 없어서 closure 증거로 사용하지 않았다. 같은 범위를
exact-line 형식으로 다시 요청한 147994ms packet이 actionable replacement다.

## Verification so far

- Focused ESLint: pass.
- Vite production build: pass, existing large-chunk advisory only.
- Full `tsc -b`: existing unrelated worktree errors remain; none named the new Robot VLA files.
- Focused Playwright at 390, 768 and 1440: 3/3 pass.
- Formula pairs/notes: π0.7 3/3, OpenVLA 3/3.
- Mobile formula scale after semantic line split:
  - π0.7: 1.00 for all three formulas.
  - OpenVLA: minimum 0.91; minimum KaTeX 14.35px.
- Document overflow, raw LaTeX, clipped math: 0.
- Minimum lab text: 12px.
- FormulaNote가 `\text{...}` 설명 라벨을 inline KaTeX로 다시 렌더해 한글이 네모가 되는
  pixel 회귀를 발견했다. 공통 component가 설명 라벨은 Noto Sans KR text로, 실제 기호만
  KaTeX로 렌더하도록 분리했다.
- Robot source test가 π0.7 한글 라벨 5개와 OpenVLA 라벨 4개를 exact text로 고정한다.
- 공통 formula/Viz QA: 390, 768, 1440에서 6/6 pass.

## 4B extraction packet

```yaml
source: pi07 | openvla
range: one section or appendix table
extract:
  inputs: []
  model_blocks: []
  outputs: []
  runtime_order: []
  exact_numbers: []
  explicit_limitations: []
prohibited:
  - global curriculum choice
  - cross-paper claim merge
  - deployment pass
```

4B 모델은 literal fact와 source address만 만든다. 숫자 하나마다 paper line, table 또는 official
code symbol을 붙이고, 보이지 않는 정보는 추측하지 않는다.

## 9B synthesis packet

```yaml
target_question: one private transfer problem
fact_packets: [pi07_sections, openvla_sections, official_code]
required:
  - mechanism sequence
  - why each operation exists
  - paper evidence versus reviewer inference
  - minimum predecessor boundary
  - formula and Korean note pair
  - prose before interactive viz
  - closed-loop release evidence
```

9B 모델은 completed fact packet을 합치되 source별 evidence를 섞지 않는다. Codex/orchestrator가
current identity, route edges, final prose, browser QA와 deployment를 소유한다.

## Reasoning trace

- `π0.5 current` observed → official source index stale inference → π0.7 current replacement decision
  → sitemap·paper·track link verification.
- Many predecessor names observed → mandatory history explosion inference → lineage-in-article decision
  → Claude finite-route review.
- Int8 offline accuracy comparable but rollout lower observed → policy quality alone cannot explain it
  → cadence confound decision → blocking-control appendix and 1/f Viz verification.
- Formula scale 0.61 observed → expression carries multiple operations in one line inference →
  semantic multi-line equation decision → mobile scale 1.00 verification.
- Paper says 256 bins, code creates 256 edges/255 centers observed → prose abstraction hides
  implementation boundary inference → exact tokenizer reconstruction decision → source-code audit.

Post-fix Claude factual and visual audits, production service restart, public URL checks are appended
only after their accepted outputs and measurements return.

## Production closure

- `npm run build`: pass, 8,872 modules; 기존 large-chunk advisory만 남았다.
- Focused ESLint: pass.
- Robot source Playwright: local 390/768/1440 3/3 pass.
- Top-down route/sidebar schema: 5/5 pass.
- Shared formula/Viz QA: 6/6 pass.
- `cm-blog.service`: 2026-07-27 10:38:21 KST 재시작 후 active/running.
- Public `QA_BASE_URL=https://heru.ragdoll-bigeye.ts.net` Robot test: 390/768/1440 3/3 pass.
- Public document width: π0.7/OpenVLA 모두 390/390, 1440/1440으로 horizontal overflow 0.
- Public FormulaNote labels:
  - π0.7: `조건부 학습`, `두 score의 차이`, `실패 경계`, `역수`, `배포 경계`.
  - OpenVLA: `digitize와 clip`, `합`, `Non-blocking`, `Blocking control`.
- Public script: `/lab/assets/index-LtgxD3PC.js`; local `dist/index.html` hash와 일치한다.
- Public screenshots: 390과 1440에서 두 source article의 prose→formula→note→Viz 순서,
  최소 text 크기, 잘림 없음과 interaction state를 확인했다.

Full `npm run build:tsc`는 기존 dirty worktree의 unrelated TypeScript error 때문에 실패하며,
이번 Robot VLA source 파일은 error 목록에 없다. 이 batch의 production closure에는 Vite build,
focused ESLint와 browser contract를 사용했다.
