# 남은 학습 흐름과 현재 이미지 모델 지도 재구성 기록

## 목표

첫 번째 상위 5개 배치 뒤 `reviewNeeded`에 남은 세 글을 실제 학습 문서로 다시 만들고, 사용자가 추가로 지적한 Ideogram·Krea 계열을 현재 이미지·영상 모델 지도에 연결했다.

- `qwen-korean-consistency`: 한국어 출력 문제를 prompt, logit, post-training, runtime 층으로 분해하는 진단 글
- `comfyui-edit-models-flux-qwen`: 모델 이름이 아니라 tensor·condition 계약으로 workflow를 추적하는 구현 글
- `discrete-log`: 작은 수 계산에서 BSGS와 실무 보안 강도까지 올라가는 수학 기반 글
- `open-image-video-models`: Ideogram 4, Krea 2, FLUX.2, Qwen Image Edit를 현재 작업 목적에서 기반 원리까지 연결하는 지도

이 배치의 핵심은 새 모델 이름을 평면 목록에 더하는 것이 아니다. 현재 목표를 맨 위에 놓고, 그 목표를 이해하는 데 필요한 실행 구조와 최소 수학으로만 내려가게 만드는 것이다.

## 처음 관찰한 문제

1. Qwen 글은 “한국어 일관성”을 하나의 문제처럼 다뤄 prompt, 최종 답변, 공개 reasoning trace, weight-level suppression의 책임이 섞일 위험이 있었다.
2. Smoothie-Qwen과 한국어 RL 연구는 출발 모델과 개입 층이 다른데, 이를 붙여 읽으면 한 방법의 연속 실험처럼 오해할 수 있었다.
3. ComfyUI 글은 모델 비교보다 실제 graph에서 image, mask, semantic condition, appearance condition, latent가 어디로 흐르는지를 먼저 보여 줄 필요가 있었다.
4. 이산로그 글은 정의만으로는 `3^x mod 17 = 5`의 해와 BSGS의 비용을 독자가 직접 재구성하기 어려웠다.
5. 이미지 모델 지도는 Stable Diffusion 중심의 과거 분류만으로는 Ideogram 4, Krea 2, FLUX.2 같은 2026년 선택지를 설명하지 못했다.
6. 긴 한국어 underbrace가 들어간 수식은 모바일에서 자동 축소율이 0.52까지 내려가, 박스 안에 들어가도 읽기 어려웠다.
7. 기존 `zkp-math` 순서는 유한체를 먼저 강제했지만, 탑다운 독자에게는 “왜 역산이 어려운가”를 먼저 보고 필요한 유한체·타원곡선으로 내려가는 경로가 더 자연스러웠다.

## 문서 역할과 최소 바닥

### 현재 모델 지도

현재 작업을 먼저 고른다. 이미지 안의 정확한 글자와 layout이면 Ideogram, style reference와 공개 weight 실험이면 Krea, 여러 reference를 한 runtime에서 생성·편집하려면 FLUX.2, semantic·appearance 분리 편집이면 Qwen Image Edit가 첫 후보가 된다. 그다음에 ComfyUI graph, 공통 runtime, Stable Diffusion 구현 기준선, diffusion, VAE까지만 내려간다.

### Qwen 진단 글

한국어 문제를 다음 네 층으로 자른다.

1. prompt와 sampling으로 재현 조건을 고정한다.
2. logit/`lm_head` 층에서 특정 token 확률을 억제한다.
3. SFT와 RL로 공개 reasoning trace의 언어·정답·형식을 학습한다.
4. 제품 계약은 detector, retry, fallback, log로 보장한다.

이 아래로 tokenizer와 softmax를 연결하되, 글을 읽기 전에 모든 NLP 역사를 요구하지 않는다.

### 이산로그 기반 글

작은 mod 17 순환에서 출발해 BSGS의 `sqrt(n)` 시간·메모리 경계를 만든다. 이후에만 유한체와 타원곡선으로 내려간다. 암호학 역사 전체를 선행 조건으로 두지 않는다.

## 본문만으로 풀 수 있어야 하는 내부 검증 문제

이 문제들은 본문에 퀴즈로 넣지 않고 초안의 깊이를 확인하는 비공개 acceptance test로 사용했다.

1. 한국어 최종 답변은 안정적인데 공개 reasoning trace에 중국어가 섞일 때, prompt·weight·post-training·runtime 중 어디부터 검사해야 하는가?
2. temperature를 낮추는 것이 왜 원치 않는 언어 token을 제거하는 보장이 아닌가?
3. Smoothie-Qwen을 중국어 번역 서비스에 무조건 적용하면 왜 정상 요청까지 손상될 수 있는가?
4. Qwen2.5-Coder의 post-hoc suppression 결과와 Qwen3-14B의 SFT/RL 결과를 같은 실험 곡선처럼 비교하면 왜 안 되는가?
5. ComfyUI graph만 보고 semantic condition과 appearance condition이 어느 encoder·denoiser 입력으로 들어가는지 어떻게 추적할 것인가?
6. FLUX.2, FLUX.1 Kontext, Qwen Image Edit, mask inpaint 중 어떤 선택이 identity 유지 실패와 국소 편집 실패를 각각 좁히는가?
7. `3^x mod 17 = 5`를 BSGS로 풀 때 baby table, `g^-m`, giant step collision, `x=im+j`를 직접 계산할 수 있는가?
8. 256-bit elliptic-curve group이 흔히 128-bit security로 설명되는 이유와, 같은 숫자를 finite-field DLP에 그대로 적용하면 안 되는 이유는 무엇인가?
9. “open model”이라는 표현에서 API 공개, 상업 이용, 공개 weight, 로컬 실행을 어떻게 분리할 것인가?
10. 타이포그래피가 필요한 production design과 style exploration에 같은 이미지 모델을 선택하면 어떤 실패 비용이 생기는가?

각 질문의 답에 필요한 용어, 인과 구조, 식, 반례, 출처, 다음 글이 본문 안에 있는지 역으로 확인했다.

## 구현 결정

### 서사와 Viz

- 네 글 모두 `QuestionLead → ConceptPrimer → 설명 → StepViz` 순서를 고정했다.
- SVG를 축소한 거대한 전체 구조 대신, viewport에 따라 1열 또는 5열이 되는 HTML 기반 단계 흐름을 사용했다.
- visual은 장식이 아니라 현재 단계, 입력, 변환, 출력, 실패 지점을 보여 주는 실행 구조로 만들었다.
- 표 형태의 모델 fact sheet를 없애고 모델별 “무엇을 잘하는가 → 어떤 제어를 받는가 → 어떤 runtime·license 제약이 있는가” 서술로 바꿨다.

### 수식

- 모든 display 수식은 KaTeX로 렌더하고 핵심 항의 역할을 한국어 underbrace와 `FormulaNote`로 중복 설명했다.
- Smoothie scale 식을 `S_i`의 외부 결합식과 `f_gamma(r_i)`의 위험도 변환식으로 나눴다.
- RL reward는 주 보상과 보조 보상을 두 식으로 나눴다.
- BSGS는 collision 식과 `x=im+j` 복원식을 분리했다.
- 결과적으로 390px Qwen 식의 최소 scale은 0.52에서 0.97로 올라갔고, 이산로그 식은 모두 0.82 이상을 유지했다.

### 최신 모델을 기존 흐름에 넣는 방법

- Ideogram 4는 정확한 typography, layout, bounding-box 제어와 production asset 맥락에 배치했다.
- Krea 2는 style reference, moodboard 계열 제어와 Raw/Turbo 공개 weight 범위를 분리했다.
- FLUX.2는 여러 reference를 다루는 unified generation/editing runtime으로 놓고, FLUX.1 Kontext는 이전 single-reference 편집 계보로 설명했다.
- Qwen Image Edit는 semantic edit와 appearance edit의 dual conditioning 관점으로 설명했다.
- “최신 모델이 나왔다”에서 끝내지 않고 ComfyUI graph와 diffusion/VAE 기반으로 내려가는 링크를 배치했다.

## 출처와 작성 의도

- [Qwen3 공식 발표](https://qwenlm.github.io/blog/qwen3/): 119개 언어와 약 36조 token이라는 공개 범위만 사용하고, 공개되지 않은 언어별 학습 비율은 추정하지 않았다.
- [Smoothie-Qwen](https://arxiv.org/abs/2507.05686): token risk, nonlinear `lm_head` scaling, Qwen2.5-Coder-14B-Instruct 실험 범위와 context-insensitive 한계를 확인했다.
- [Making Qwen3 Think in Korean with Reinforcement Learning](https://arxiv.org/abs/2508.10355): Qwen3-14B, 30K SFT data, Oracle-Guided Dr.GRPO와 benchmark별 trade-off를 확인했다.
- [FLUX.2 공식 발표](https://bfl.ai/blog/flux-2): unified generation/editing, multi-reference와 model variant를 현재 workflow 설명에 사용했다.
- [FLUX.2 klein 공식 발표](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence): 4B·9B variant, 4B license와 로컬 메모리 claim의 범위를 구분했다.
- [BFL Kontext 문서](https://docs.bfl.ai/kontext/kontext_overview): FLUX.1 Kontext의 편집 위치를 FLUX.2와 혼동하지 않기 위해 사용했다.
- [Qwen Image Edit 공식 발표](https://qwenlm.github.io/blog/qwen-image-edit/), [ComfyUI Qwen tutorial](https://docs.comfy.org/tutorials/image/qwen/qwen-image-edit): semantic·appearance 편집과 실제 node workflow를 연결했다.
- [Ideogram 4 공식 발표](https://ideogram.ai/news/ideogram-4.0/): typography, layout, bounding-box, resolution, 현재 layer와 roadmap claim을 분리했다.
- [Krea 2 발표](https://www.krea.ai/blog/krea-2-image-model), [Krea 2 technical report](https://www.krea.ai/blog/krea-2-technical-report), [Krea 2 Raw weights](https://huggingface.co/krea/Krea-2-Raw): foundation model, style-reference 방향과 공개 weight 범위를 확인했다.
- [NIST SP 800-186](https://doi.org/10.6028/NIST.SP.800-186): P-256, Curve25519, Edwards25519의 security strength 설명 근거로 사용했다.

출처는 모델 이름을 많이 보이게 하기 위한 장식이 아니다. 모델 version, 공개 weight, license, benchmark처럼 바뀌는 사실을 저자의 설명과 분리하고 다음 갱신 때 다시 확인할 수 있게 하는 경계다.

## Claude 독립 검토

Claude를 `--safe-mode`, 읽기 전용, 대상 파일 한정으로 실행했다. 다음 지적을 원문과 다시 대조해 반영했다.

- FLUX.2 klein을 단일 크기처럼 쓴 부분을 4B·9B로 분리하고, Apache 2.0과 약 13GB claim은 4B에만 묶었다.
- Smoothie와 한국어 RL 연구가 서로 다른 Qwen 세대·개입 층이라는 사실을 더 명시했다.
- Ideogram의 현재 기능과 roadmap을 citation에서 분리했다.
- 이산로그 power grid의 8열 전환점을 mobile이 아닌 `md`로 올렸다.

AIME base/SFT의 동일 수치는 의심 항목으로 표시됐지만 원 논문 표에서 실제로 동일하게 보고된 것을 확인해, 오류처럼 고치지 않고 “저자 표의 동일 수치”라고 명시했다. BSGS 부호와 복원식도 원리 계산을 다시 수행해 유지했다.

## 검증 결과

- learning-flow audit: registered 567, release blockers 0, review needed 0
- 네 대상 문서: score 0, issues 없음
- targeted ESLint: 통과
- `git diff --check`: 통과
- `npm run build`: 통과, 기존 large chunk warning만 남음
- Playwright local: 390x844, 768x1024, 1440x900에서 4개 경로, 12/12 통과
- Playwright public host: 같은 4개 경로와 viewport에서 12/12 통과
- 공개 URL HTTP status: 4개 모두 200
- 검사 항목: 질문·개념·Viz 순서, H1, raw LaTeX, KaTeX 존재, formula 실제 폭과 0.70 이상 scale, 문서·요소 overflow, 모바일 table, console/page error
- 직접 시각 검토: 네 글의 mobile·desktop full-page capture 8개
- 배포: `cm-blog.service`를 2026-07-21 14:40:18 KST에 재시작하고 active 상태를 확인

`npm run build:tsc`는 이번 변경과 무관한 기존 타입 오류 때문에 전체 통과하지 않는다. 오류는 `articlesZkpMath2`, backprop Dropout, cnn BiasDetail, data augmentation, FFT, llm-serving, regularization, robot localization/motion planning, `WafVpn`에 남아 있다.

## 4B·9B 모델로 재현하는 작업 분해

### 4B: 사실과 구조를 좁게 추출

1. article metadata와 현재 learning-path 위치를 JSON으로 뽑는다.
2. 주장마다 `stable concept | volatile model fact | reported metric | author inference`를 붙인다.
3. 수식의 symbol, source string, annotation, browser scale을 수집한다.
4. question, primer, first visual, failure mode, sources, local links의 DOM 순서를 검사한다.
5. 한 문서만 처리하고 기술 판단은 하지 않는다.

### 9B: 한 문서의 인과 서사를 재구성

1. 문서 역할을 `map | teaching | workflow | reference` 중 하나로 고른다.
2. 독자가 본문만으로 풀어야 할 내부 검증 문제를 3~5개 만든다.
3. 제공된 1차 출처에서 문제, 개입 층, 실행 순서, 실패 경계, 한계를 추출한다.
4. `현재 목표 → 질문 → 최소 용어 → 계산/실행 구조 → 반례 → 선택 기준 → 다음 기반` 순서로 쓴다.
5. 각 내부 문제를 풀 때 본문 밖 지식이 필요한 지점을 gap으로 반환한다.

### 강한 모델 또는 인간 통합자

- 최신 모델을 새 독립 목록으로 늘릴지 기존 계보의 맨 위에 붙일지 결정한다.
- 공개 weight, API 공개, license, 상업 이용의 표현을 1차 출처로 판정한다.
- 더 과거로 내려가는 것을 멈출 최소 바닥을 정한다.
- 수식 분해가 정확성을 해치지 않는지 확인한다.
- full-page capture에서 정보 밀도, 대비, 텍스트 크기와 빈 공간을 직접 본다.
- 배포 후 public host에서 같은 검사를 반복한다.

기계 판독 가능한 사건 기록은 `2026-07-21-learning-audit-final-four-reconstruction.json`에 남겼다.

## 다음 갱신 규칙

새 논문이나 회사 연구 글이 나오면 먼저 기존 최상단의 선택 축을 바꾸는지 판정한다. 기존 축 안의 새 variant면 해당 모델 절에 추가하고, 새로운 condition·memory·training 개념을 요구할 때만 하단 기반 글을 추가한다. 과거 논문을 무한히 늘리지 않고, 현재 주장에 실제로 필요한 최초 기준점에서 끊는다.
