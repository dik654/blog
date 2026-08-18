# Blog rewrite status

이 문서는 대화가 압축되거나 작업자가 바뀌어도 현재 범위와 완료 근거를 잃지 않기 위한 ledger다.
완료 표시는 `blog-rewrite-contract.md`의 Definition of Done을 모두 확인한 뒤에만 바꾼다.

## 공통 기반

- [x] 작성 정본: `docs/blog-rewrite-contract.md`
- [x] Viz 정본: `docs/viz-design-standard.md`
- [x] 수식 component: `ExplainedFormula`
- [x] Viz 정적 검사: `npm run audit:viz`
- [x] article 계약 감사: `npm run audit:articles`
- [x] 선수 개념·학습 질문·논문 해설 감사: `npm run audit:learning`
- [x] 전역 concept owner·canonical path·relation·stage 감사: `npm run audit:graph -- --strict`
- [x] 모든 새 concept가 정확히 한 canonical article에서만 정의되고 `canonicalHref`의 article과 owner가 일치하는지 검사하는 전역 감사
- [x] 기초과학 concept의 관측량·단위/차원·모델 전제·측정 예·한계와 물리 좌표계 누락을 막는 `scientificGrounding` 감사
- [x] 공개 catalog 전체를 대상으로 concept·stage·실제 import closure·제목 병렬 주제를 계산하는 `audit:topology` 추가

### 2026-08-15 · 아티클 경계를 고정값이 아닌 CRUD 대상으로 재개방

- [ ] 공개 route 전부를 `keep / create / split / merge / rename / delete` 관점으로 재검토하고, 독립 수업을 한 글에 압축한 route의 concept owner·본문·문제·근거를 실제 새 route로 이동
- [ ] 이전 URL을 보존하는 redirect·alias 계약과 orphan link 감사를 추가하고 split·merge·rename·delete마다 자동 검사
- [ ] 모든 `ExplainedFormula`가 generic fallback이 아니라 식의 실제 항과 연산 의도를 명시한 `annotatedFormula`·`operations`를 갖도록 전역 전환
- [x] 첫 분리 사례 `/ai/model-vram-budgeting`을 범용 VRAM 정본으로 만들고 Qwen 글은 Qwen-specific architecture 적용 예만 소유하도록 중복 축소. Public catalog 391, graph 2,309 concepts·3,390 relations·owner/invariant 0, selected learning·route·Viz·build 통과
- [x] RLHF 한 글에 섞여 있던 DPO·Constitutional AI·ORPO·KTO를 독립 public route로 분리하고 `/ai/rlhf`는 reward model·online PPO만 소유하도록 축소. 다섯 route 모두 topology `keep`, exact 6+4, explicit operation-annotated formula, 신규 keyboard Viz와 selected strict audit 통과
- [x] MCP의 protocol core·primitive·transport·production operation을 독립 public route로 분리하고 Claw MCP 구현 사례와 소유권을 분리. 네 route 모두 topology `keep`, 새 prerequisite edge 5개, exact 6+4, operation-annotated formula, 자동 재생·키보드 Viz와 selected strict audit 통과
- [x] 서버 network 한 글에 섞여 있던 workload·Ethernet, PCIe·NVLink, RDMA·RoCE, GPU collective를 네 독립 public route로 분리하고 canonical owner·evidence·선행 relation을 새 경계에 맞게 이동. 다섯 기존 수식은 항별 연산 의도를 직접 표시하고, 네 route 모두 도형 기반 자동 재생·키보드 Viz와 390/1440 실브라우저 검수를 통과
- [x] 활성화 함수 한 글의 11개 독립 concept을 기초 함수·rectifier·smooth/gated FFN 세 route로 분리하고 canonical owner·evidence·exact 6+4를 이동. `negative-slope → self-normalization → smooth gate` 비교 edge를 추가하고, 11개 수식 모두 연산 의도 주석·도형 기반 자동 재생/키보드 Viz로 교체
- [x] 지식 증류 한 글을 고전 logit/feature·cross-tokenizer sequence·student-visited on-policy·generation self-distillation 네 route로 분리. Synthetic provenance·self-generation·stop-gate concept 3개와 relation 6개를 새로 만들고 canonical owner·evidence·exact 6+4를 새 경계로 이동
- [x] 새 네 글의 수식 11개를 모두 domain-specific `annotatedFormula`와 explicit operation으로 작성하고, 공통 operation card의 KaTeX 두 줄 주석 간격·수직 padding을 전역 보강. 도형 기반 4장면 Viz는 화살표 키·Space·자동 재생을 지원하며 390/1440에서 page·Viz·KaTeX overflow와 console error 0을 확인
- [ ] 현재 전역 잔여량: public catalog 442, topology `split-review` 72·`rename-or-split-review` 2, explicit formula 156/1,082·전환 대기 926. 휴리스틱 후보는 본문 학습 질문을 확인한 뒤 실제 CRUD하며 필요한 concept·relation도 함께 확장한다.

### 2026-08-15 · WEBCAT · Ethereum future roadmap · binary-field proving · permissioned RWA markets

- [x] WEBCAT을 HTTPS·SRI·CSP와 구분하고 signed manifest → transparency log → browser local verification의 정의·형태·실패 경계를 새 정본 글과 자동 재생 Viz로 설명
- [x] Ethereum future roadmap을 post-quantum·privacy/verifiability·native rollup·spec simplification 축으로 나누고 현재 배포/채택 검토/연구 방향/실험 결과 상태로 표시
- [x] Poseidon의 ZK-friendly primitive 선택과 Binius/Flock의 conventional-hash-friendly proving 전환을 binary field 선수 개념·reduced/full-round security margin·조건부 benchmark 경계와 함께 연결
- [x] Uniswap v4 Permissioned Pools의 adapter·hook·position manager·router를 정의부터 쌓고 RWA legal claim·DvP·issuer allowlist 책임과 연결
- [x] 신규 3 route 각 기초6+심화4 역검사, graph/evidence/editorial 정합성 완료. Global learning 389/389, graph 2,299 concepts·3,364 relations·invariant 0, selected article/Viz, route tests, tsc·production build·diff-check 통과. Playwright 6 routes×390/1440에서 page·Viz·KaTeX overflow 0, console error/warning 0이며 자동 장면 전환과 모바일 다단 주석 수식을 육안 확인

### 2026-08-15 · CUDA fusion·Megakernel 바닥 지식 보강

- [x] `/gpu/cuda-perf-analysis`에 kernel launch·HBM 중간값에서 시작해 register live range·spill·occupancy를 먼저 설명하고 작은 fusion과 Megakernel을 구분
- [x] Unfused → small fusion → Megakernel pressure → FlashAttention tile → persistent work queue를 도형과 재생으로 보여 주는 신규 Viz, 32/64/128/255 registers/thread별 resident warp 계산 Viz 추가
- [x] Fusion ROI와 register-limited residency 식을 모바일 3행 식으로 나누고 각 곱·나눗셈·합·차의 의도를 KaTeX underbrace로 직접 주석 처리했으며 FlashAttention을 IO-aware tile fusion 사례로 연결
- [x] 신규 canonical concepts 4개·relation 12개, 기초6+심화4, CUDA 12.8.1·FlashAttention·Persistent Threads evidence를 갱신. Learning 386/386, graph 2,283 concepts·3,343 relations·invariant 0, article/Viz/formula/reading strict, tsc·production build·diff-check 통과. Playwright 390/1440에서 page·모든 Viz·KaTeX overflow 0, style 위반 0, console error/warning 0이며 장면 탭·자동 재생·128 registers→16/64 warps 상태 전환을 실제 확인

### 2026-08-14 · 개념별 수업 흐름·수식 연산 주석·설명형 애니메이션

- [x] 공개 386개 글 모두 본문 전에 실제 개념명·단계 연결이 항상 보이는 overview map과 `익숙한 장면 → 용어 이름과 정의 → 앞뒤 형태 → 작은 예 → 실패 경계` 스토리보드를 렌더하고, 재생 시에는 이를 5컷으로 설명하도록 변경
- [x] overview map을 텍스트 카드 목록에서 입력(평행사변형)·처리(원)·판정(마름모)·기록(원통)·상태(둥근 사각형) 도형과 SVG 화살표를 쓰는 흐름도로 교체하고, 선택한 개념의 Before → Now → Next도 같은 도형 문법으로 확대. 재생 중에는 점선 연결이 진행 방향으로 이동
- [x] 공통 수업 Viz에 이전·다음·재생·일시정지와 진행률을 추가하고, `prefers-reduced-motion`에서는 자동 전환과 motion을 비활성화
- [x] 처음 설명하는 용어와 선수 개념 카드를 모두 단일 열·본문 폭으로 바꿔 긴 설명이 좁은 다단 카드에 갇히지 않도록 교정
- [x] `ExplainedFormula` 1,037개 모두에 KaTeX `underbrace` 연산 의도 영역을 추가하고, 도메인 식은 `annotatedFormula`·`operations`로 실제 항의 곱·합·mask 이유를 식 안에서 직접 설명할 수 있게 확장
- [x] `String.raw` 없이 작성되어 JS escape에 노출됐던 KaTeX 기호 141개를 정상화하고, 동일 오류의 재유입을 `audit:formula --strict`에서 차단
- [x] `filecoin-onchain-cloud`를 dataset record, period state, payment rail 순으로 다시 정의하고 period 판정·rail ledger 갱신·최종 서비스 조합을 각각 재생 가능한 신규 Viz로 구현
- [x] 모바일 가로표로 남았던 BFT 비교축·합의 계열·Tendermint lock trace를 새 반응형 카드 Viz로 교체해 390px에서 가로 스크롤 제거
- [x] Playwright Chromium으로 386 route × 390/1440 = 772회 실제 본문 로드 검사: 개념 탭 3,437회 클릭, 수식 2,114회·연산 의도 4,586개·재생 컨트롤 778개 확인, page/Viz/KaTeX/console/page error 0
- [x] 5컷 재생 교정 뒤 390px에서 386 route를 다시 검사해 수업 Viz가 onboarding·본문보다 먼저 오고 page/Viz 폭·console error가 모두 0임을 확인
- [x] 도형 흐름 최종형을 Playwright로 공개 386 route × 390/1440 = 772 viewport 재검사: overview 도형 3,437개, 확대 도형 1,158개, 단계 1,797개와 단계 연결선 1,411개를 확인했고 누락·폭 넘침·console/page error 0

### 2026-08-14 · 용어 밀집 문단을 세로 설명으로 전환

- [x] `TermBreakdown` 공용 컴포넌트를 추가해 `용어 한 줄 → 상세 설명 → 작은 예 → 다른 필드와의 경계`를 본문 폭의 세로 목록으로 렌더
- [x] `filecoin-onchain-cloud`의 네 service 기록, dataset generation 12개 필드, store/addPieces receipt, period state 3개 값, payment rail 5개 항목을 장문 나열에서 세로 설명으로 전환
- [x] 굵게 표시한 용어가 한 문단에 세 개 이상 직접 등장하는 기존 문단 260개는 전역 article style에서 각 용어가 `— 용어`로 새 줄을 소유하도록 보강
- [x] 강조 markup이 없는 fixture·receipt·benchmark 목록도 전역 렌더 단계에서 가운데점마다 실제 줄을 나누고 `—` 항목으로 표시하도록 보강
- [x] 실제 공개 import closure 2,640개 파일을 검사하는 `audit:terms`를 추가하고 현재 `filecoin-onchain-cloud`의 밀집 문단 후보가 0임을 확인
- [x] Playwright 390px 전역 재검사에서 공개 386 route의 실제 렌더 문단 265개·용어 996개에 줄바꿈 규칙이 적용되고 page overflow·style 누락·console error가 모두 0임을 확인
- [x] plain-text 후보가 있는 168 route를 브라우저 35개 단위의 새 세션으로 재검사해 문단 227개·항목 1,360개가 실제 줄바꿈되고 overflow·invalid marker·console error가 0임을 확인
- [ ] 줄바꿈은 전역 적용됐지만, 그중 실제 새 개념 소개인 문단은 fixture 목록과 분리해 `TermBreakdown` 또는 문단별 정의 절로 계속 전환

## 새 learning contract 기준으로 다시 열어 둔 글

기존의 내용·수식·Viz 검수를 통과했더라도, 핵심 논문이 둘 이상인 전문 글은 선수 개념·학습 결과·논문 내부 해설 경로를 다시 확인한다. 특히 선수 개념은 현재 category에서 멈추지 않고 수학·통계·물리·컴퓨터 구조 등 실제로 필요한 기초까지 재귀적으로 따라간다. 정본 글·anchor·초심자 설명이 비어 있거나 `entryLevel` 글에 닿기 전에 순환하면 상위 글도 완료로 보지 않는다.

이후 범위를 전체 블로그로 확장했다. 2026-08-14 현재 실제 공개 카탈로그의 고유 article route 386개 전부에 Knowledge graph와 learning contract가 등록되어 미등록 글은 0개다. 386개 모두 새 DoD의 정확한 기초 6개+심화 4개와 본문·근거 anchor까지 strict audit를 통과했으며, 이전 문제 수 기준으로 남아 있던 구계약도 0개다. Audit는 파일시스템의 source folder나 public alias를 별도 article route로 중복 집계하지 않고 `src/content/index.ts`의 실제 공개 카탈로그를 분모로 사용하며, 새 route가 추가되면 분모도 함께 갱신한다. 또한 같은 concept를 두 글이 동시에 새 개념으로 소유하거나 concept의 `canonicalHref`가 실제 owner와 어긋나거나 새 concept가 relation edge 없이 고립되면 해당 글을 완료로 처리하지 않는다. 현재 2,283개 concept·3,343개 relation은 정본 owner 중복·경로 불일치·dangling/self/duplicate edge·고립 node가 모두 0개이며 `audit:graph --strict`를 통과한다. 완료된 정본·응용 글의 상세 근거는 아래 한 곳에서 관리한다.

### 읽기 경험 재구성 및 실제 공개 closure 감사

- [x] Learning contract 전체가 본문 앞에서 수천 px를 차지하던 순서를 `짧은 수업 안내 → 실제 본문 → 용어·개념 그래프·연습문제 복습 → 근거`로 재구성
- [x] 각 단계에 연결 문장과 작은 worked example을 노출해 정의·수식 목록이 아니라 본문으로 들어가는 설명 경로로 표시
- [x] “이 글 안에서 처음 설명하는 용어”의 중첩 4열 효과를 제거하고, 본문 크기·긴 행간의 넓은 카드로 교체
- [x] Learning·article·Viz 전역 audit를 public catalog의 실제 import closure 기준으로 강화해 미참조 legacy sibling 파일이 anchor나 Viz 통과 증거가 되지 않게 함
- [x] 강화된 closure 감사에서 발견된 `ai/backprop-optimization`의 Loss·Softmax·Cross-entropy 실제 렌더 누락을 복구
- [x] Playwright Firefox로 공개 386 route × 390/1440 = 772회 검사: 수업 안내→본문→복습 순서, 용어 카드 폭 250px 이상, page·Viz·formula·SVG overflow와 application console failure 0

### 재귀 선수 지식 경로 — 현재 닫힌 기반

- [x] `벡터·내적·norm`: scalar에서 시작해 projection·Cauchy–Schwarz의 증명 아이디어와 반례까지 연결
- [x] `함수·미분·gradient`: 함수 합성·극한·derivative·local linearity·chain rule·partial derivative·Jacobian·gradient·subgradient를 수치 예와 문제로 연결
- [x] `확률·조건부확률·기댓값·분산`: outcome·event·conditional probability·확률 chain rule과 random variable·expectation·variance·sample mean·큰 수의 법칙을 sequence model과 mini-batch gradient까지 연결
- [x] `최적화·convexity·수렴`: objective·minimizer·convexity·smoothness·strong convexity·condition number·convergence theorem의 전제와 반례를 연결
- [x] `지수·로그`: 반복 곱셈·역함수·곱의 로그·밑 변환을 surprisal과 likelihood가 읽히는 entry-level 수학 경로로 연결
- [x] `복소수·회전·Euler 공식 → DFT·FFT`: radian·단위원·복소평면·수렴급수·roots of unity에서 sampling·window·Cooley–Tukey·STFT·convolution theorem까지 연결
- [x] `문자·Unicode·UTF-8 → Tokenizer`: bit·byte·code point·grapheme·normalization·offset 좌표에서 BPE·WordPiece·SentencePiece/Unigram·checkpoint compatibility까지 연결
- [x] `행렬·rank·SVD → 분포 의미론 → Word2Vec → BERT`: linear map·orthonormal basis·truncated SVD에서 count/prediction embedding·contextual encoder·retrieval 경계까지 연결
- [x] `Image tensor → CNN`: local cross-correlation·weight sharing·spatial geometry·translation equivariance·theoretical/effective receptive field·dilation·depthwise 분해·task output 계약까지 연결
- [x] `확률·likelihood → 생성 모델 지도 → VAE`: density/sampling tractability에서 latent marginalization·ELBO·change of variables·adversarial ratio·score를 나누고, amortized inference·reparameterization·Gaussian KL·posterior collapse·IWAE·VQ-VAE까지 연결
- [x] `미분·확률 → ODE/SDE·수치적분 → Diffusion`: initial-value problem·Euler error/stability·Heun NFE·Brownian √Δt에서 DDPM noise/score·reverse SDE·probability-flow ODE·flow matching·latent diffusion·CFG까지 연결
- [x] `Activation functions`: 미적분 정본을 선수로 삼아 step·포화·ReLU·SELU·smooth gate·SwiGLU의 서로 다른 문제와 비용을 구분
- [x] `Backpropagation`: chain rule·Jacobian 정본을 VJP·reverse mode·fan-out accumulation·batched linear backward로 확장
- [x] `Optimizer`: stochastic estimate·gradient accumulation·EMA·raw moment·bias correction·adaptive preconditioning·AdamW를 확률과 최적화 정본에서 확장
- [x] `RNN → LSTM → Seq2Seq → Attention`: recurrent state와 시간축 gradient에서 시작해 gated memory·conditional sequence·autoregressive decoding·differentiable memory read까지 연결
- [x] `Cross-entropy → Attention → Transformer → SFT → RLHF`: log·expectation에서 likelihood objective를 만들고, softmax·attention read·language-model policy와 response-token supervision을 거쳐 preference update까지 선수 경로를 연결
- [x] `Autoregressive decoding → KV cache → GQA → hybrid allocator → admission`: token당 cache shape와 layer별 보존 길이·runtime group·요청 분포를 동시성 결정으로 연결
- [x] Knowledge graph 전용 `audit:graph --strict`: 2,283개 concept·3,343개 relation의 owner·canonical path·edge·고립·화면 stage coverage 통과
- [x] 공개 catalog 386개 글은 모두 canonical owner·anchor·entry-level 재귀 선수 경로·기초 6개+심화 4개 coverage 통과
- [x] 이전 learning contract 40개를 정확한 6+4 문제와 article-only 역검사 기준으로 재개방해 보완
- [x] 확률·통계 기반 글은 optimizer 소비 경로에서 필요한 범위까지 첫 canonical closure 완료
- [ ] 물리·컴퓨터 구조 기반 글은 실제 소비 글을 이관하면서 필요한 node부터 같은 방식으로 계속 확장. 분산 시스템은 process·failure·safety/liveness → SMR → permissionless PoW·PoS까지 첫 정본 경로를 닫음

- [x] Foundations·NLP: ARIMA·ECOD·LSTM time-series를 포함한 공개 catalog learning contract 재검수 완료
- [x] Generative: 생성 모델 전체 지도·deterministic autoencoder·VAE·GAN·Diffusion을 새 learning contract 기준으로 재검수
- [x] Practical ML: data augmentation·imbalanced data·GBDT·tabular/sequence modeling·transfer learning·LR scheduling·regularization·image/video/multiview·contrastive/sentence embedding·quantization·pruning·distillation·RAG·LoRA
- [x] LLM·Agents: Open-R1·ViT·YaRN·Agentic patterns·hybrid attention serving·SAE·vLLM speculative decoding 재검수 완료
- [x] From scratch: DeZero autodiff·neural-network layer·stateful layer를 고정 수치 예와 Rust ownership·resume release gate까지 재검수
- [x] 저장소 진입 지침: `AGENTS.md`

## 검수 완료한 우선 페이지

### AI / RLHF · DPO · CAI · ORPO · KTO learning contract 보강

- [x] 약어보다 먼저 feedback schema·policy update·online/offline이라는 핵심 아이디어를 제시하고 policy·SFT·preference optimization의 최소 정의를 서론에 보강
- [x] 선수 개념과 본문에서 처음 설명할 용어를 분리하고 각 canonical 기초 글로 연결
- [x] 다 읽은 뒤 답할 수 있어야 하는 질문 5개에 확인 기준과 본문 anchor를 연결
- [x] InstructGPT·PPO·DPO·CAI·ORPO·KTO 여섯 논문 모두 원문과 내부 paper reading note를 양방향으로 연결
- [x] Learning contract 등록·outcome anchor·paper explainer anchor를 검사하는 `audit:learning --strict --require-registration` 추가
- [x] desktop 1440px / mobile 390px에서 learning contract·논문 경로·수식 6개·Viz overflow 없음 확인 및 production build 통과
- [x] 지수/로그·cross-entropy·Transformer·독립 SFT 정본을 선수 글로 등록해 RLHF까지의 재귀 경로를 entry-level 글까지 닫음

### AI / 지수·로그 → Cross-entropy → Transformer → SFT

- [x] 지수/로그를 무선수 정본 글로 추가하고 반복 곱셈·역함수·곱의 로그·밑 변환을 수치 예와 기초/심화 문제로 연결
- [x] Cross-entropy의 surprisal·entropy·empirical risk·maximum likelihood·KL을 지수/로그·확률 정본에서 재귀적으로 연결
- [x] Transformer의 token embedding·position signal·attention visibility·scaled dot-product attention·residual/normalization·scaling law를 독립 concept node로 등록
- [x] SFT를 RLHF의 하위 절이 아닌 독립 정본 글로 만들고 demonstration·response-only loss mask·teacher forcing·exposure bias·packing boundary·독립 평가를 보강
- [x] FLAN·Self-Instruct·InstructGPT SFT 및 Transformer·Pre-LN·GLU·scaling 근거를 내부 해설 anchor와 연결
- [x] 1440px·390px Playwright에서 5개 글의 raw display 수식 0개, page overflow 0을 확인하고 SFT response-mask Viz의 모바일 고정 폭을 responsive grid로 수정
- [x] `audit:learning` 15개 재귀 경로, 대상 `audit:viz`, production build와 `git diff --check` 통과

### AI / LLM harness engineering

- [x] Model proposal과 runtime의 authorization·execution·observation 책임을 분리하고, 자연어 요청 → run contract → evaluation → regression → control-flow 선택의 top-down 흐름으로 재작성
- [x] Prompt·context·harness·loop·graph를 직선 계보로 제시하지 않고 2023–2026 공개 논의의 병목 이동과 용어의 불확실성을 구분
- [x] Objective·context·authority·artifact·verifier·recovery의 여섯 계약과 idempotency·receipt·checkpoint·rollback·escalation을 보강
- [x] Final artifact뿐 아니라 trajectory·side effect·operational budget을 평가하고 production trace를 재현 case·regression suite로 바꾸는 절차를 보강
- [x] OpenAI harness 사례·Anthropic workflow/agent 및 long-running harness·LangChain loop engineering 원문을 visible evidence로 연결하고 일반화 범위를 제한
- [x] 기초/심화 문제 10개와 canonical concept 10개를 실제 learning contract에 등록하고 artifact·trajectory·effect·budget Boolean acceptance 수식을 질문·아이디어·기호·전제·해석 순서로 연결
- [x] 고정 폭 control-flow 표를 flat responsive ledger로 바꿔 390px에서 가로 스크롤 없이 workflow·agent loop·checkpoint·loop stack을 비교
- [x] 구형 animated SVG·StepViz·중복 data 14개를 제거하고 flat responsibility·history·run contract·evaluation·iteration·control-flow Viz 8개로 교체
- [x] desktop 1440px / mobile 390px에서 Viz·canvas·페이지 overflow 없음과 렌더 간격을 확인하고 production build 통과

### AI / Context engineering · RAG entry · memory · compaction

- [x] Prompt 작성법에서 시작하지 않고 한 inference가 실제로 읽는 token state → selection·injection·compaction·isolation → instruction/data/enforcement → RAG provenance → working/long-term memory → source별 budget·position 평가·cache 경계의 top-down 흐름으로 보강
- [x] Output reserve를 먼저 확보하는 source별 context token 장부를 질문·아이디어·기호·전제·해석 순서의 설명형 수식으로 추가
- [x] Lost in the Middle·MemGPT 원 논문과 Anthropic context engineering·context management 공식 자료의 문제·기여·전제·claim 한계를 본문 anchor에 연결
- [x] 기초/심화 문제 10개와 canonical concept 9개를 등록하고 RAG 구현 세부·하네스 권한·compaction 구현 정본을 중복하지 않고 링크로 재사용
- [x] 기존 Viz의 표현 방식은 유지하면서 1.5px 선을 1.2px로 정리하고 SVG text bounding box·gradient·shadow를 1440px와 390px 실제 렌더에서 확인
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 15개·논문 anchor 4개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인

### AI / Agentic patterns · ReAct · plan · reflection · multi-agent

- [x] 패턴 이름 나열 대신 observable state → model proposal → runtime authorization/execution → typed observation → state update → verified exit의 최소 loop에서 시작하는 top-down 흐름을 확정
- [x] Agent state transition 수식을 질문·아이디어·기호·전제·해석 순서로 작성하고 model policy와 runtime authority가 같은 권한으로 합쳐지지 않음을 명시
- [x] Plan을 문장 목록이 아닌 dependency·artifact·owner·status·evidence state로 만들고, observation 기반 invalidation·feedback-grounded reflection과 무한 retry를 구분
- [x] Delegation artifact ownership과 manager/handoff user-facing state ownership, hook·skill·guardrail·verifier의 실행 시점·권한을 canonical concept로 분리
- [x] 기초/심화 문제 10개와 canonical concept 9개, ReAct·Reflexion·Anthropic/OpenAI 공식 가이드·agent eval 5개 reading anchor를 연결
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 11개·논문 anchor 5개·page/Viz/formula/SVG text overflow 없음·gradient/shadow 0·console warning/error 0을 확인

### AI / Agent Skills anatomy · authoring · loading · evaluation

- [x] Tool·Skill·Plugin 책임 경계에서 시작해 trigger metadata → resource layout → progressive disclosure → invocation → permission → evaluation → scope·distribution으로 내려가는 초심자용 top-down 흐름으로 재작성
- [x] OpenAI Build skills 공식 문서의 현재 SKILL.md 구조, 초기 목록 2%/8,000 characters budget, explicit·implicit invocation, repository·user·admin·system discovery와 Plugin 배포 경계를 확인일과 함께 반영
- [x] Canonical concept 9개와 기초/심화 문제 10개를 등록하고 trigger precision·recall을 질문·아이디어·기호·전제·해석이 있는 설명형 수식으로 연결
- [x] 기존 카드·directory·process·scope table의 표현 방식은 유지하면서 gradient·shadow·색면 의존을 제거하고 얇은 선·넓은 여백·responsive grid의 flat Viz 5개로 현대화
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 5개·공식 근거 anchor 1개·page/Viz/formula/text overflow 없음·console warning/error 0을 확인하고 production build 통과

### AI / MCP 2026-07-28 protocol

- [x] Adapter 비유에서 시작해 host·client·server → stateless request·discovery·explicit handle → primitive contract → transport·MRTR·cancel·subscription → authorization·retry·deprecation으로 내려가는 초심자용 top-down 흐름으로 재작성
- [x] Initialize/session 중심의 legacy 설명을 현행 요청별 namespaced `_meta`, server가 구현하는 `server/discover`, protocol 밖 explicit application handle 구조로 교체
- [x] Tool·Resource·Prompt의 control model을 구분하고 JSON Schema 2020-12, `structuredContent`, `resultType=complete/input_required`, `isError`, protocol error, deterministic list·`ttlMs`·`cacheScope`를 연결
- [x] stdio와 POST-only Streamable HTTP, 필수 routing header·body consistency, request-scoped SSE cancellation과 `subscriptions/listen`의 수명 차이를 반영
- [x] Canonical concept 15개와 기초/심화 문제 10개, MCP 2026-07-28 specification·changelog·Tools·Streamable HTTP 공식 자료의 문제·기여·전제·claim 한계를 내부 anchor로 연결
- [x] 기존 10개 Viz의 표현 방식을 유지하면서 gradient·색면 card·두꺼운 line을 제거하고 flat responsive ledger·sequence·comparison으로 현대화
- [x] desktop 1440px / mobile 390px에서 Viz 10개·paper anchor 4개·page/Viz/learning panel/code overflow 없음·console warning/error 0을 확인하고 production build 통과

### AI / Prompt engineering — request contract · ICL · reasoning · output validation

- [x] 기법 이름을 나열하기 전에 입력·출력·성공 조건·evidence boundary·검증으로 이루어진 request contract를 제시하고 system·developer·user·tool 계층과 prompt 내부 delimiter의 책임 차이를 설명
- [x] Zero-shot·few-shot을 별도 마법처럼 다루지 않고 in-context learning의 demonstration selection·coverage·order sensitivity·calibration 문제로 연결
- [x] Chain-of-thought가 정답률을 높이는 조건과 설명의 faithfulness를 분리하고, self-consistency의 answer marginalization을 질문·아이디어·기호·전제·해석 순서의 설명형 수식으로 보강
- [x] Structured output을 JSON처럼 보이는 문자열이 아니라 parse → schema → domain → policy 검증을 통과해야 하는 consumer contract로 설명하고 grammar-constrained generation 정본으로 연결
- [x] GPT-3 few-shot·Chain-of-Thought·Self-Consistency·Calibrate Before Use·CoT faithfulness 다섯 논문의 문제·핵심 기여·전제·claim 한계를 내부 reading anchor로 연결
- [x] Canonical concept 12개와 기초/심화 문제 10개를 등록하고 prompt·structured output·reasoning 설명이 다른 글에 중복되지 않도록 editorial owner를 확정
- [x] 구형 StepViz·중복 data/support 17개를 제거하고 기존 비교·흐름 표현을 유지한 flat responsive Viz 15개로 현대화
- [x] desktop 1440px / mobile 390px에서 Viz 15개·설명형 수식 1개·paper anchor 5개·page/Viz/formula overflow 없음·gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / XML prompting — delimiter · serialization · parser · security

- [x] XML tag를 만능 prompt 기법이 아니라 instruction·untrusted data·example·output의 역할을 표시하는 delimiter이자 선택 가능한 serialization으로 정의하고 runtime authorization과 분리
- [x] Root·start/end tag·proper nesting·attribute quote·reserved character escaping·CDATA 경계를 XML을 처음 보는 독자도 따라갈 수 있는 작은 예제로 설명
- [x] 여러 document·few-shot example을 container와 stable ID로 묶고 citation reference·uniqueness·referential integrity를 application/schema validator에 연결
- [x] XML로 조건·반복·tool 실행을 흉내 내지 않고 candidate만 반환한 뒤 runtime이 branch·retry·permission·side effect를 결정하는 책임 경계를 확정
- [x] Size/frame → strict parse → allowlist/schema → domain/evidence → policy → typed result의 소비자 pipeline과 error별 bounded retry·abstention·human review를 보강
- [x] W3C XML 1.0의 well-formed·DTD-valid 의미, Python XML vulnerability와 OWASP XXE의 DTD·external entity·resource exhaustion 방어를 공식 근거 4개와 내부 해설 anchor로 연결
- [x] Canonical concept 10개와 기초/심화 문제 10개를 등록하고 prompt engineering·grammar-constrained generation·sandbox security 정본과 중복 소유권을 분리
- [x] 구형 StepViz·Data·Parts·Steps 지원 파일 15개를 제거하고 기존 의미를 유지한 flat responsive Viz 10개만 남김
- [x] desktop 1440px / mobile 390px에서 Viz 10개·paper anchor/internal link 4개·page/Viz/canvas/descendant overflow 없음·gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / Agent frameworks — direct loop · durable state · recovery · migration

- [x] 제품 이름 나열 대신 환불 요청의 조회 → 정책 확인 → 승인 대기 → refund API → receipt 검증을 공통 사례로 두고 direct SDK loop에서 framework runtime이 필요해지는 실패 경계까지 top-down으로 재작성
- [x] ReAct를 private reasoning 공개가 아니라 Decide → Act → Observe → Verify의 외부 검증 가능한 state transition으로 설명하고 model proposal과 runtime authorization·effect 실행을 분리
- [x] LangChain integration과 LangGraph orchestration 책임, State·Node·Edge·field reducer, checkpointer의 thread snapshot과 store의 cross-thread data를 초심자용 예제로 연결
- [x] Checkpoint와 replay를 구분하고 refund API 성공 직후 crash 사례에서 stable idempotency key·effect receipt·status lookup으로 duplicate side effect를 막는 복구 계약을 보강
- [x] LangGraph·LlamaIndex·AutoGen AgentChat/Core·CrewAI Crew/Flow를 marketing feature 수가 아니라 state scope·persistence·interrupt·data integration·team·deployment·version 요구사항으로 비교
- [x] ReAct 원 논문과 framework 공식 문서 6개를 문제·기여·전제·근거 범위·하지 않는 주장까지 보이는 내부 anchor 7개로 연결
- [x] Canonical concept 6개와 기존 agent/harness/multi-agent 정본 관계 edge, 기초/심화 문제 10개, paired failure-injection evaluation·checkpoint migration·canary·rollback 계약을 등록
- [x] 기존 5개 Viz의 표현 의도는 유지하면서 `VizFrame` 기반 flat responsive ledger로 현대화하고 gradient·shadow·굵은 선·과한 radius를 제거
- [x] desktop 1440px / mobile 390px에서 Viz 5개·page/Viz/canvas/descendant overflow 없음·gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / Claude Code — workspace harness · context · permission · checkpoint

- [x] 제품 기능 목록 대신 로그인 실패 재현 → workspace·instruction 발견 → model proposal → permission·hook 판정 → tool execution → observation → deterministic test → checkpoint·보고의 한 실행 흐름으로 top-down 재작성
- [x] Claude model의 제안과 Claude Code host의 authorization·effect execution을 분리하고, 내부 추론을 요구하지 않는 observable loop trace로 설명
- [x] CLAUDE.md·auto memory·session context·compaction의 작성자·수명·재주입 범위를 구분하고 ancestor launch load·nested lazy load·compaction 후 root 재주입을 현재 공식 문서와 연결
- [x] Subagent를 agent 수 확대가 아니라 별도 context와 input·tool authority·artifact ownership·completion evidence를 가진 typed handoff로 정의
- [x] Built-in tool·Skill·MCP·subagent의 선택 기준, tool registry·permission·hook·verification의 책임, deny→ask→allow와 PreToolUse non-bypass를 분리
- [x] Checkpoint가 direct file edit만 추적하고 Bash·대부분의 subagent edit·external effect·symlink/hardlink·Git transaction은 복구하지 않는 범위를 failure injection으로 검증
- [x] 현행 Claude Code 공식 문서 7개를 문제·기여·version/environment 전제·근거 범위·하지 않는 주장까지 보이는 anchor로 연결하고 오래된 tool/hook 개수·YOLO 명칭·근거 없는 방어율을 제거
- [x] Canonical product concept 6개와 기존 harness/context/MCP/Skill/security 정본 edge, 기초/심화 문제 10개, paired before/after trace·version canary·rollback 계약을 등록
- [x] 기존 Viz 표현 의도를 유지한 `VizFrame` 기반 flat responsive Viz 4개로 현대화하고 desktop 1440px / mobile 390px에서 page/Viz/canvas/descendant overflow 0·gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / Qwen 한국어 일관성 — 진단 · smoothing · SFT/RL · runtime guard

- [x] 외국 문자가 보인다는 신고를 그대로 오류로 세지 않고 reasoning/final mismatch·정상 번역·인용·고유명사·code·수식 예외와 model/template/sampling provenance로 먼저 분류
- [x] Code point·script·grapheme·normalization·tokenizer token을 분리하고 hidden state → lm_head logit → vocabulary 전체 softmax → sampling의 초심자용 선택 경로를 보강
- [x] Prompt를 weight 변경이나 runtime enforcement로 오해하지 않도록 기본 한국어와 번역·인용 예외를 함께 둔 policy와 paired evaluation 경계를 설명
- [x] Smoothie-Qwen의 Unicode·broken token·n-gram risk, `S(r)`의 끝값·단조성·수치 예, lm_head row scaling과 음수 logit·tied weight·softmax coupling 반례를 `ExplainedFormula` 2개로 연결
- [x] 한국어 SFT의 response-token loss와 current-policy rollout RL을 분리하고 composite reward·Dr.GRPO group-centered advantage·oracle judge 충돌/오판 경계를 `ExplainedFormula` 2개로 설명
- [x] Qwen3 공식 발표·Smoothie 논문/구현·한국어 SFT/RL 논문 4개를 문제·기여·실험 전제·근거 범위·비주장까지 보이는 anchor로 연결하고 논문 숫자를 단일 snapshot으로 제한
- [x] Checker의 script 관찰과 judge의 의도 판정, calibration/independent holdout, bounded retry·축약 응답·human review를 분리
- [x] Canonical concept 8개와 기존 Unicode/tokenizer/softmax/SFT/GRPO/evaluation 정본 edge, 기초 6개·심화 4개 문제, canary·rollback 계약을 등록
- [x] 기존 표현 의도를 유지한 flat responsive Viz 7개와 mobile ledger를 390px·1440px에서 확인하고 page/Viz/formula overflow 0·gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / OpenClaw — Gateway · session · runtime · sandbox

- [x] 제품 기능 목록보다 먼저 Telegram 사용자 A와 Slack 사용자 B의 동시 요청을 고정 사례로 두고 인증·allowlist → binding → session → provider/model → runtime → tool policy/sandbox → typed reply의 실행 경로를 top-down으로 연결
- [x] Channel adapter·Gateway·binding·session·model·runtime·tool policy·sandbox의 소유 책임을 구분하고, model 출력이 reply route나 실행 권한을 바꾸지 못하도록 control plane 경계를 명시
- [x] 기본 shared DM session과 `per-channel-peer`·`per-account-channel-peer`를 비교해 다중 사용자 history 혼합 위험과 검증된 identity link의 적용 범위를 설명
- [x] Provider·model·runtime 선택 순서, explicit runtime의 fail-closed와 auto fallback, 현행 `openclaw` runtime 및 `pi`·`runEmbeddedPiAgent` deprecated alias의 migration 경계를 반영
- [x] Skill·tool·plugin·resource discovery와 workspace·sandbox workspace를 분리하고 tool policy → sandbox location → elevated exception의 판정 순서를 초심자용 반례와 함께 보강
- [x] Side effect 직후 acknowledgement 유실 사례로 idempotency key·receipt·dedupe와 event sequence gap의 state refresh를 구분하고 paired canary·rollback까지 연결
- [x] OpenClaw 공식 문서 7개를 learning reading anchor로 등록하고 protocol·security 보조 근거를 더해 문제·핵심 아이디어·전제·근거 범위·비주장을 본문에서 확인 가능하게 구성
- [x] Canonical product concept 8개와 기존 agent/harness/session/security 정본 edge, 기초 6개·심화 4개 문제를 등록하고 article-only 역검사 수행
- [x] 기존 흐름 표현을 유지한 flat responsive Viz 4개를 390px·1440px에서 확인하고 page/Viz overflow 0·Viz 내부 gradient/shadow/thick border 0·console warning/error 0을 확인

### AI / Agent 개발 기록 — artifact · Changelog · ADR · Lessons

- [x] 빈 compaction 결과가 기존 profile을 덮어쓴 고정 사례에서 시작해 raw artifact → 검증된 Changelog → 장기 decision ADR → 재사용할 Lesson의 조건부 흐름을 top-down으로 재작성
- [x] 같은 사건을 세 문서에 복제하지 않고 “무엇을 관찰했나·언제 달라졌나·왜 골랐나·지금 어떤 원칙을 적용하나”라는 질문마다 정본 하나와 stable evidence link를 두는 소유권을 확정
- [x] Changelog를 raw commit dump와 분리하고 날짜/version·사람이 이해할 결과·verification·evidence link·Unreleased 경계를 Keep a Changelog의 공개 범위 안에서 설명
- [x] ADR의 context·options·decision·consequences와 accepted/implemented/deployed·superseded 상태를 분리하고 같은 decision driver로 세 storage option을 비교
- [x] Lesson에 rule·scope·정상 exception·evidence·verification·revisit 조건을 넣고 production incident의 timeline·impact·owner action을 소유하는 Postmortem과 구분
- [x] Agent 초안의 artifact 존재·digest·접근 권한·secret/PII redaction·verifier receipt·사람 승인 경계를 보강하고 evidence 없는 인과·수치·완료 claim을 차단
- [x] Canonical concept 8개와 기존 provenance·artifact·verifier 정본 edge, 기초 6개·심화 4개 문제, Keep a Changelog·Nygard ADR·Google SRE Postmortem reading 3개를 등록
- [x] 기존 5개 Viz의 표현 의도를 유지한 flat responsive ledger로 현대화하고 390px·1440px에서 page/Viz/text overflow·gradient·shadow·thick border·console warning/error 0을 확인한 뒤 production build를 통과
- [x] 단일 글만 있는 소분류는 sidebar뿐 아니라 category page에서도 바로 해당 아티클로 이동하도록 direct navigation을 적용

### AI / Claw Code 전체 아키텍처 — 독립 공개 재구현 · 책임 경계 · parity

- [x] 제품 기능·crate 개수 나열 대신 로그인 401 오류의 요청 → session/coordinator → provider stream → registry/permission → workspace edit → deterministic test → response 경로를 고정 사례로 두고 top-down으로 재작성
- [x] Claw Code를 Anthropic Claude Code·OpenAI Codex의 비공개 내부 구조와 분리하고, pinned commit `b71afddae100ced324457337925a694686b8fef2`의 독립 공개 Rust 재구현·비제휴·비실서비스용 경계만 project claim으로 유지
- [x] Runtime state owner, provider/tool adapter, permission enforcement와 artifact ownership을 분리하고 moving `main`·오래된 `PARITY.md`의 crate·scenario·LOC 숫자를 현재 완결성 근거로 사용하지 않도록 제한
- [x] Python companion/reference를 universal oracle로 보지 않고 observable contract·canonicalization·byte/semantic comparison·intentional divergence/ADR 경계를 설명
- [x] Truncated SSE·malformed JSON·permission deny·partial write·test failure를 failure injection으로 연결하고 deterministic parity → provider contract → sandbox/filesystem integration → E2E canary·rollback의 layered verification을 구성
- [x] Canonical concept 8개와 기존 harness·observation/action loop·capability·typed observation·exit state·verification·provenance 정본 edge, 기초 6개·심화 4개 문제, pinned project/공식 근거 5개를 등록
- [x] 기존 7개 Viz의 표현 의도를 유지한 flat responsive sequence/ledger로 현대화하고 390px·1440px에서 page/Viz overflow·gradient·shadow·thick border·console warning/error 0을 확인한 뒤 production build를 통과

### AI / Claw tool system — registry · validation · permission · extension

- [x] 제품 기능 목록 대신 로그인 401 원인 조사 → read/search → 최소 edit → deterministic test라는 고정 사례로 model proposal부터 session observation까지 top-down으로 재작성
- [x] Built-in·plugin·runtime definition을 합칠 때 canonical name·source·schema·permission hint를 보존하고 duplicate name을 last-write-wins로 덮어쓰지 않는 registry 계약을 설명
- [x] JSON Schema의 구조 검증, typed/domain validation, argument별 canonical effect, actor/workspace authorization을 서로 다른 판정으로 분리
- [x] Lookup → parse → effect classification → permission enforcement → executor → typed result의 우회 불가능한 순서와 deny-before-effect를 보강
- [x] 현재 pinned implementation의 문자열 result와 success·stable error·truncation·artifact·effect receipt를 가진 hardening 목표를 분리해 구현 과장을 차단
- [x] Plugin과 MCP의 공통 model-facing surface와 서로 다른 discovery·credential·transport·restart lifecycle을 나누고 schema/executor generation race를 평가 계약으로 추가
- [x] 독립 read/search만 병렬화하고 edit와 test는 dependency·effect receipt를 따라 직렬화하는 DAG, deadline·cancel·partial effect·retry 경계를 설명
- [x] Canonical project concept 8개와 기존 schema·capability·typed observation·idempotency·verification 정본 edge, 기초 6개·심화 4개 문제, pinned/공식 근거 anchor 5개를 등록
- [x] 기존 6개 Viz의 표현 의도를 유지한 flat responsive ledger/sequence로 현대화하고 390px·1440px에서 page/Viz overflow·gradient·shadow·thick border·console warning/error 0을 확인

### AI / Claw permissions — policy · approval · enforcement

- [x] 권한 mode 목록보다 로그인 401 조사에서 read/search → edit 승인 → deterministic test라는 한 요청을 따라 model proposal과 host enforcement를 분리
- [x] Outer authority ceiling → permission mode → subject rule → approval lifetime → executor의 우회 불가능한 판정 순서를 top-down으로 설명
- [x] Pinned 구현의 5개 mode, exact/prefix/any subject matcher, no-prompter deny, Prompt deferral seam과 built-in dispatch 전 optional enforcer 경계를 반영
- [x] Approval ledger의 scope·actor·executor·expiry·use count·상태 전이와 standalone in-memory module이라는 실제 한계를 분리
- [x] Action digest·TOCTOU 재검증·policy generation receipt·crash reconciliation을 현재 구현 사실이 아닌 desired hardening 계약으로 표시
- [x] Canonical project concept 8개와 generic authorization·trajectory/effect evaluation 정본 edge, 기초 6개·심화 4개, pinned/공식 evidence 6개를 등록
- [x] 기존 표현 의도를 유지한 flat responsive Viz 3개와 learning map을 390px·1440px에서 확인하고 page/Viz/descendant overflow·gradient·shadow·thick border·console warning/error 0을 확인

### AI / Claw session — durable record · turn · fork · lifecycle

- [x] 채팅 배열이 아니라 로그인 401 조사·수정·test의 typed message·tool correlation·runtime state를 다시 이어갈 durable identity로 세션을 top-down 재작성
- [x] Pinned JSONL session record·snapshot과 revisioned event/view hardening을 분리하고 현재 구현을 완전한 event store로 과장하지 않음
- [x] User message 저장 → provider stream 조립 → tool permission·execution → tool result 저장이라는 pinned 순서와 explicit turn transaction/runtime generation snapshot gap을 구분
- [x] Tool side effect와 result persistence 사이 crash의 ambiguous completion을 stable operation identity·receipt·status lookup·reconciliation 문제로 연결
- [x] Pinned fork의 message·compaction·prompt history 복사와 desired base revision·별도 workspace·three-way merge·재검증 계약을 분리
- [x] Workspace fingerprint namespace, explicit session ref validation, JSONL append와 temp-file atomic snapshot의 실제 범위·durability 한계를 보강
- [x] Create·load·save·fork·delete·resume command와 desired pause·resume·shutdown lifecycle state machine을 서로 다른 근거 수준으로 표시
- [x] Canonical project concept 8개와 기존 checkpoint·idempotency·artifact lineage 정본 edge, 기초 6개·심화 4개 문제, pinned/generic evidence anchor 6개를 등록
- [x] 기존 4개 Viz를 flat responsive ledger로 현대화하고 실제 페이지의 learning map을 포함한 Viz 5개를 390px·1440px에서 page/Viz/descendant overflow·console warning/error 0으로 확인

### AI / Claw compaction — trigger · heuristic summary · recovery · verification

- [x] “긴 대화를 알아서 요약한다”는 기능 소개 대신 로그인 오류 조사에서 무엇을 보존하고 무엇을 줄일지 결정하는 trigger → select → summarize → verify → recover 흐름으로 top-down 재작성
- [x] Pinned `compact.rs`를 LLM·typed fact compressor로 과장하지 않고 role/tool/recent request/pending keyword/file/current-work와 160자 timeline을 조합하는 heuristic snapshot으로 설명
- [x] 별도 `summary_compression.rs`의 line normalization·dedupe·prefix priority·budget helper와 session compaction caller를 분리하고 존재하지 않는 `SummaryCompressor` 연결을 제거
- [x] Manual·automatic·error recovery trigger의 입력·budget·실패 경로를 나누고, recovery가 error-string heuristic과 4→2→1→0의 최대 네 round를 쓴다는 pinned 범위를 명시
- [x] Glob health probe는 runtime liveness 신호일 뿐 semantic fidelity 검사가 아님을 밝히고, preserved fact·pending action·tool correlation·effect receipt를 확인하는 desired hardening과 구분
- [x] Tool call/result pair, 두 번 compaction한 summary의 flatten merge, line budget, adversarial fail-closed, crash reconciliation과 1·3·5 paired release fixture를 본문만으로 풀 수 있도록 보강
- [x] Canonical project concept 8개·relation edge 15개, 기초 6개·심화 4개 문제와 pinned source evidence anchor 4개를 등록
- [x] 기존 표현 의도를 유지한 flat responsive Viz 6개와 learning map을 390px·1440px에서 확인하고 page/Viz/descendant overflow·gradient·shadow·thick border·console warning/error 0을 확인

### AI / Activation functions — ReLU 이후 선택지

- [x] 서로 다른 문제를 푸는 activation과 gated FFN을 분리
- [x] Leaky/PReLU, ELU/SELU, GELU/SiLU, SwiGLU 수식 의도와 비교 전제 설명
- [x] 주요 수식 6개 설명 순서 DOM 확인
- [x] desktop 1440px / mobile 390px overflow 확인
- [x] 함수·미분·chain rule·subgradient 선행 경로와 기초/심화 문제 7개를 learning contract로 연결
- [x] 실제 렌더 경로의 구형 고정 좌표 SVG를 flat curve·gradient·role·decision Viz로 교체하고 사용되지 않는 legacy Viz 묶음 제거
- [x] display 수식 10개가 모두 `ExplainedFormula` 내부에 있고 7개 핵심 논문 내부 해설 anchor가 존재함을 Playwright로 확인

### AI / RNN

- [x] state transition, unroll, language model, BPTT 순서로 심화
- [x] lossy state, Jacobian product, TBPTT와 clipping의 역할 구분
- [x] 주요 수식 8개 설명 순서 DOM 확인
- [x] desktop 1440px / mobile 390px overflow 확인

### AI / Perceptron

- [x] score·hyperplane·perceptron update·XOR 모순·linear collapse 설명
- [x] 실제 article entry가 import하는 Viz 5개를 flat style로 교체하고, 렌더되지 않는 legacy 보조 파일과 현재 사용 경로를 구분
- [x] 주요 수식 5개 설명 순서 DOM 확인
- [x] desktop 1440px / mobile 390px overflow 확인

### AI / Diffusion models

- [x] Gaussian forward → noise/score target → reverse SDE·probability-flow ODE → flow matching → backbone·latent·CFG의 top-down 흐름으로 재작성
- [x] ODE·SDE 용어를 바로 가정하지 않고 initial-value problem·Euler error/stability·Heun NFE·Brownian √Δt를 다루는 선수 정본 글을 새로 연결
- [x] Forward closed form·noise objective·Gaussian score·reverse SDE·probability-flow ODE·flow matching·CFG 수식 7개를 설명형 순서로 이관
- [x] DDPM·Score-SDE·Flow Matching·U-Net·LDM·CFG 원 논문 6개를 본문 reading anchor와 evidence contract에 연결
- [x] 새 concept 11개와 기초/심화 문제 7개로 score coefficient·marginal/path·step/NFE·latent reconstruction ceiling을 검사
- [x] gradient·겹친 arrow card·가로 고정 solver 표를 flat responsive Viz 7개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·본문 내부 overflow 없음과 console error 0 확인

### AI / Deterministic autoencoder

- [x] 쉬운 복사를 막는 제약이라는 핵심 아이디어에서 encoder–latent–decoder·loss·PCA 조건·활용·변형으로 내려가는 top-down 흐름으로 재작성
- [x] Forward mapping·숫자 예시·MSE·chain rule·linear AE/PCA·anomaly score·denoising objective 수식 7개를 `ExplainedFormula`로 이관
- [x] Deterministic AE·undercomplete bottleneck·identity degeneracy·reconstruction objective·linear AE/PCA·denoising·sparsity·anomaly score·MAE를 canonical concept graph에 등록
- [x] 기초/심화 문제 7개로 shape 계산·MSE·memorization 진단·PCA 전제·corruption target·threshold·variant 선택을 검사
- [x] Deep autoencoder·linear AE/PCA·denoising AE·MAE 원 논문 4개를 본문 reading anchor와 evidence contract에 연결
- [x] 실제 렌더 경로의 구형 SVG 7개를 flat responsive Viz로 교체하고, import되지 않던 legacy Steps·Data·SVG 복제 파일 28개 제거
- [x] desktop 1440px / mobile 390px에서 수식 7개·Viz 12개·논문 anchor 4개·페이지 overflow 없음과 console error 0 확인

### AI / Data augmentation

- [x] Sample 수 늘리기가 아니라 deployment variation·target map·split·evaluation을 설계하는 top-down 입구로 재작성
- [x] Augmented empirical risk·affine annotation·normalization·Mixup·CutMix 수식 5개를 `ExplainedFormula`로 이관
- [x] Label-preserving transform·target map·affine annotation·input normalization·Mixup·CutMix·tabular validity·evaluation boundary를 canonical graph에 등록
- [x] 기초/심화 문제 7개로 task별 invariance·좌표 동기화·fixture·soft target·area 반례·temporal leakage·production gate를 검사
- [x] RandAugment·Mixup·CutMix·Albumentations 근거 4개를 본문 reading anchor와 evidence contract에 연결
- [x] 기존 나열형 카드 Viz 5개를 parameter→input/target→validity와 train/validation/robustness/TTA lane이 보이는 flat Viz로 재구성
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 7개·논문 anchor 4개·페이지 overflow 없음과 console error 0 확인

### AI / Imbalanced classification

- [x] Minority 비율보다 score ranking→probability calibration→threshold decision→operational outcome을 먼저 구분하는 top-down 입구로 재작성
- [x] SMOTE interpolation·focal loss·cost-sensitive threshold·precision/recall·Fβ 수식 5개를 `ExplainedFormula`로 이관
- [x] Prevalence·ranking/decision/calibration·fold-local resampling·SMOTE·weighted risk·focal modulation·cost threshold·confusion metric·PR base-rate 관계·calibration을 canonical graph에 등록
- [x] Precision의 prevalence dependence를 theorem과 proof idea·counterexample로 명시하고 기초/심화 문제 7개로 계산·leakage·noise·운영 보고를 검사
- [x] SMOTE·Focal Loss·PR/ROC 관계·Calibration 원 논문 4개를 본문 reading anchor와 evidence contract에 연결
- [x] 기존 나열형 카드 Viz 4개를 split pipeline·loss axis·policy search·evaluation stack이 보이는 flat Viz로 재구성
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 6개·논문 anchor 4개·페이지 overflow 없음과 console error 0 확인

### AI / Feature engineering

- [x] Column 기법 목록 대신 prediction entity·cutoff·event/available time에서 출발하는 point-in-time top-down 입구로 재작성
- [x] Feature availability·cutoff·target leakage·fold-local statistic·cross-fitted target encoding·interaction·point-in-time aggregation·selection ablation·training-serving skew를 canonical graph에 등록
- [x] Cutoff feature 함수·standardization·cross-fitted target encoding·interaction slope·rolling count·permutation importance 수식 6개를 `ExplainedFormula`로 이관
- [x] 기초/심화 문제 7개로 available time·세 종류 leakage·z-score·target encoding·interaction·aggregation SQL 계약·grouped ablation/parity를 검사
- [x] Leakage in Data Mining·CatBoost·Feature Selection 원 논문 3개를 본문 reading anchor와 evidence contract에 연결
- [x] 기존 나열형 카드 Viz 6개를 cutoff timeline·fold masking·conditional slope·window boundary·evidence loop가 보이는 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 6개·Viz 7개·논문 anchor 3개·페이지 및 내부 텍스트 overflow 없음과 console warning/error 0 확인

### AI / Gradient boosting

- [x] 작은 decision tree의 piecewise-constant output에서 functional negative-gradient update로 내려가는 초심자용 top-down 입구로 재작성
- [x] Decision tree·functional boosting·shrinkage/early stop·XGBoost second-order gain/histogram·LightGBM GOSS/EFB/leaf-wise·CatBoost ordered/symmetric tree·비교 계약을 canonical graph에 등록
- [x] Tree output·pseudo-residual update·XGBoost gain·GOSS correction·ordered gradient 수식 5개를 `ExplainedFormula`로 이관
- [x] 기초/심화 문제 7개로 leaf output·squared/logistic pseudo-residual·split gain·GOSS/EFB·ordered prefix·공정 비교 계약을 검사
- [x] Friedman GBM·XGBoost·LightGBM·CatBoost 원 논문 4개를 본문 reading anchor와 evidence contract에 연결
- [x] 기존 기능 카드 Viz 5개를 숫자 boosting round·G/H split·growth allocation·ordered prefix·비교 예산표가 보이는 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 7개·논문 anchor 4개·페이지와 내부 텍스트 overflow 없음 및 console warning/error 0 확인

### AI / VAE

- [x] likelihood에서 ELBO로 내려가는 top-down 흐름과 AE 차이 보강
- [x] reparameterization·ELBO·diagonal Gaussian KL·AE objective 수식 4개 설명 순서 이관
- [x] Amortized inference·posterior family·pathwise gradient·rate–distortion·posterior collapse·latent usage·IWAE·VQ-VAE를 concept graph와 기초/심화 문제 7개로 연결
- [x] AEVB·IWAE·lagging inference·VQ-VAE 원 논문을 본문 내부 reading anchor와 evidence contract에 연결
- [x] 기존 gradient Viz를 flat style로 교체하고 component overflow 확인
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 7개·논문 anchor 4개·overflow 없음 확인

### AI / RoPE · YaRN context extension

- [x] 입력 가능 길이·위치 일반화·실제 task 성능을 분리한 top-down 입구로 재구성
- [x] RoPE rotation·relative phase·wavelength·PI·NTK-aware·NTK-by-parts·attention scaling 수식 7개 설명 순서 이관
- [x] RoPE·PI·YaRN 원 논문과 Transformers 공식 설정 문서를 본문에서 직접 연결
- [x] gradient Viz를 제거하고 frequency별 의사결정 Viz를 flat style로 추가
- [x] desktop 1440px / mobile 390px 최종 렌더·수식 순서·overflow 확인

### AI / Attention theory

- [x] attention을 differentiable lookup과 score·normalize·aggregate canonical 계산으로 재구성
- [x] additive·dot·bilinear·scaled dot-product·QKV·multi-head 수식 6개 설명 순서 이관
- [x] Bahdanau·Luong·Transformer 원 논문과 attention 해석 논쟁의 1차 문헌 연결
- [x] Q/K/V 역할·differentiable read·additive·bilinear·scaled dot-product·self-attention·multi-head를 canonical concept로 등록하고 Transformer의 중복 소유권을 선수 링크로 변경
- [x] 기초/심화 문제 6개와 논문 4개의 내부 reading anchor를 learning contract로 연결
- [x] 구형 고정 좌표 SVG를 계산 경로·score 선택·tensor trace flat Viz로 교체
- [x] desktop 1440px / mobile 390px 최종 렌더·수식 순서·overflow 확인

### AI / Backpropagation · optimization boundary

- [x] backpropagation과 optimizer의 책임을 분리한 top-down training-step 구조로 재작성
- [x] forward tape·VJP·softmax-CE fused gradient·matrix backward·SGD·AdamW 식 6개 설명 순서 이관
- [x] autodiff survey·backpropagation·AdamW·dropout의 1차 문헌을 본문에서 직접 연결
- [x] 중복된 softmax·cross-entropy 절을 canonical article link로 축약하고 구형 SVG 사용 경로 제거
- [x] desktop 1440px / mobile 390px 최종 렌더·수식 순서·overflow 확인
- [x] 함수 합성·chain rule·Jacobian·gradient의 수학 정본을 선수 경로로 연결하고 computational graph·tape·VJP·fan-out accumulation을 새 canonical concept로 등록
- [x] 기초/심화 문제 7개와 backprop·autodiff survey의 내부 paper reading anchor를 learning contract로 연결

### AI / Cross-entropy

- [x] surprisal → expectation → entropy/cross-entropy → KL → likelihood 선택 → fused gradient의 canonical 흐름으로 재작성
- [x] MSE·CE를 Gaussian·Bernoulli·Categorical likelihood 가정에서 비교하고 calibration·Brier score 경계 보강
- [x] 주요 수식 8개를 질문·아이디어·식·기호·전제·해석 순서로 이관
- [x] 사용되지 않던 구형 SVG·상세 Viz 31개를 제거하고 flat Viz 4개로 교체
- [x] article top-down flow와 실제 section metadata 순서를 일치시킴
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음 확인

### AI / FFT

- [x] DFT representation과 FFT algorithm을 분리한 top-down 흐름으로 재작성
- [x] sampling·Nyquist·bin spacing·window leakage·zero-padding의 서로 다른 역할 보강
- [x] Cooley–Tukey even/odd factorization·butterfly·복잡도 수식과 구현 locality 설명
- [x] STFT·large convolution·FNet·Hyena를 서로 다른 FFT 적용 경로로 구분하고 원문 연결
- [x] 구형 SVG 상세 Viz 12개를 제거하고 flat Viz 4개로 교체
- [x] 주요 수식 8개와 desktop 1440px / mobile 390px overflow·설명 순서 확인
- [x] 복소수·회전·Euler 공식 정본을 새로 추가하고 radian·단위원·수렴급수·roots of unity의 기초/심화 문제와 theorem 반례까지 재귀 선수 경로로 연결
- [x] Nyquist sampling·convolution theorem의 proof idea·counterexample 및 관측량·단위·측정 전제를 learning contract에 등록

### AI / LSTM

- [x] Vanilla RNN 병목 → 두 state의 계산 계약 → gate policy → direct gradient → 구조 선택의 top-down 흐름으로 재작성
- [x] 1997년 원형과 forget gate가 결합된 현대식 LSTM의 역사·수식 경계를 분리
- [x] Cell update·fused gate·direct retention·GRU 수식 4개를 질문·아이디어·식·기호·전제·해석 순서로 이관
- [x] 원 논문·Learning to Forget·GRU·architecture ablation 근거를 본문과 evidence에 연결
- [x] 구형 SVG·상세 Viz 23개를 제거하고 flat Viz 4개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Neural network · MLP

- [x] 퍼셉트론의 선형 경계 → 함수 합성 → 비선형성 → tensor contract → prediction contract → 실험 경계의 top-down 흐름으로 재작성
- [x] Universal approximation의 표현 가능성과 optimization·generalization을 분리하고 초기 signal scale까지 보강
- [x] 함수 합성·affine collapse·batch matrix·softmax likelihood·parameter count 수식 5개를 설명형 순서로 이관
- [x] 퍼셉트론·activation·backprop·cross-entropy canonical article과 책임 경계를 명시
- [x] 구형 StepViz·고정 좌표 SVG 등 legacy Viz 29개를 제거하고 flat tensor·계약 Viz 5개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Seq2Seq

- [x] P(Y|X) factorization → state handoff → autoregressive decoding → teacher forcing → attention bridge의 top-down 흐름으로 재작성
- [x] LSTM·attention canonical article과 책임을 분리하고 중복 attention 절 3개를 하나의 bridge 절로 통합
- [x] 조건부 확률·state adapter·decode score·masked NLL·attention read 수식 5개를 설명형 순서로 이관
- [x] 원 Seq2Seq·Bahdanau attention·scheduled sampling과 exposure-bias 반론 연구를 근거로 연결
- [x] 구형·중복 SVG/StepViz 45개를 제거하고 flat interface·state Viz 5개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Word2Vec

- [x] corpus pair sampling → CBOW/Skip-gram → vocabulary 병목 → SGNS → shifted PMI → 표현 경계의 top-down 흐름으로 재작성
- [x] Negative sampling을 full softmax 근사와 구분하고 noise distribution·sparse update·stationary-point 전제를 보강
- [x] Embedding lookup·CBOW·full softmax·SGNS·PMI·cosine 수식 6개를 설명형 순서로 이관
- [x] 분포 의미론·sentence embedding canonical article과 연결하고 original·SGNS·PMI·fastText 근거를 명시
- [x] 구형 animated SVG·StepViz·중복 data 27개를 제거하고 flat sampling·objective Viz 5개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / LLM post-training · RLHF · preference optimization

- [x] `/ai/rlhf`는 behavior target→feedback contract→reward model→online PPO만 소유하고 `/ai/dpo`·`/ai/constitutional-ai`·`/ai/orpo`·`/ai/kto`를 독립 학습 단위로 생성
- [x] Pairwise pair·constitution·sequence odds·binary feedback을 각 글에서 정의→작은 형태→도형 흐름→objective→평가 경계 순서로 다시 작성
- [x] Reward model·PPO KL·PPO clip·DPO·ORPO·KTO 수식 6개 모두 실제 항과 σ·log·뺄셈·ratio·clip·min의 의도를 KaTeX underbrace와 operation panel로 명시
- [x] 다섯 route의 canonical owner를 7/5/4/3/5 concepts로 나누고 각 exact basic6+advanced4·paper evidence·editorial ownership을 독립 등록
- [x] 기존 text-card method table 대신 네 방법 각각의 입력→변환→update→audit 도형 흐름 Viz를 새로 만들고 ArrowLeft/ArrowRight/Space keyboard navigation을 제공
- [x] 자동 concept lesson은 전체 map을 기본 노출하고 긴 5컷 storyboard는 선택 개념별 접힌 상세로 변경해 본문 진입 전에 장면 카드가 화면을 점유하지 않도록 축소
- [x] desktop 1440px / mobile 390px에서 page·Viz·수식 overflow와 console을 확인하고 ORPO mobile underbrace 346px를 316px로 교정

### AI / ARIMA

- [x] forecast contract → stationary representation → ARMA dynamics → temporal validation → extension boundary의 top-down 흐름으로 재작성
- [x] weak stationarity와 strict stationarity, unit-root test와 정상성 판정, moving average와 innovation memory의 혼동을 분리
- [x] 정상성·차분·ARMA·AIC/BIC·Ljung–Box·SARIMA 수식 6개를 설명형 순서로 이관
- [x] Dickey–Fuller·Ljung–Box·Hyndman–Khandakar 원문과 statsmodels 공식 구현 계약을 evidence와 본문에 연결
- [x] gradient workflow card를 forecast contract·differencing·AR/MA memory·rolling-origin·extension choice flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Generative model theory

- [x] distribution target → tractability choice → representation → sampling path → evaluation boundary의 canonical top-down 지도 재작성
- [x] explicit/implicit 이분법의 한계를 밝히고 diffusion의 score·variational·SDE·ODE 성질을 별도 canonical 글과 연결
- [x] MLE·autoregressive factorization·ELBO·change of variables·GAN minimax·score/noise relation 수식 6개를 설명형 순서로 이관
- [x] VAE·GAN·Real NVP·DDPM·NCSN·Score-SDE 원 논문을 evidence와 본문에 연결하고 theorem의 이상적 전제를 분리
- [x] 10개 canonical concept, theorem별 proof idea·counterexample, 기초/심화 문제 7개와 재귀 선수지식 contract 등록
- [x] gradient taxonomy와 구형 표를 distribution target·tractability map·autoregressive·latent·sampling flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 6개·Viz 6개·논문 anchor 6개 확인, 모바일 sampling 표의 내부 544px overflow를 responsive card로 수정

### AI / LSTM time-series forecasting

- [x] forecast contract → supervised windows → tensor/state → horizon strategy → temporal evaluation의 top-down 흐름으로 재작성
- [x] 기본 LSTM gate 설명은 canonical LSTM 글에 맡기고 window·state lifecycle·known covariate·multi-horizon 계약을 보강
- [x] Window sample·direct head·train-only scaling·quantile loss·MASE 수식 5개를 설명형 순서로 이관
- [x] PyTorch 공식 tensor 계약·rolling-origin 평가·MASE·RNN forecasting survey·DLinear·PatchTST 근거를 evidence와 본문에 연결
- [x] 구형 gradient card를 forecast window·tensor contract·horizon·leakage boundary·model ladder flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Sparse autoencoder

- [x] measurement target → superposition hypothesis → dictionary objective → quality frontier → interpretation test의 top-down 흐름으로 재작성
- [x] 일반 autoencoder와 중복을 canonical link로 분리하고 SAE feature를 사후 학습 좌표로 명확히 제한
- [x] Overcomplete decomposition·L1-ReLU·Top-K·FVE·steering 수식 5개를 설명형 순서로 이관
- [x] Anthropic monosemanticity·OpenAI scaling/evaluation·Gemma Scope·Gated SAE의 1차 연구를 evidence와 본문에 연결
- [x] gradient card를 interpretation contract·hook point·superposition·quality frontier·evidence ladder·failure modes flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / Tokenizer

- [x] text contract → pipeline → segmentation model → model compatibility → corpus evaluation의 top-down 흐름으로 재작성
- [x] grapheme·code point·UTF-8 byte와 NFC/NFD·NFKC의 보존·손실 경계를 초심자 관점에서 보강
- [x] BPE merge·Unigram path·token/byte efficiency·vocabulary parameter 수식 4개를 설명형 순서로 이관
- [x] BPE와 byte-level BPE, WordPiece training과 greedy encoding, SentencePiece toolkit과 Unigram model을 분리
- [x] Unicode 규격·HF Tokenizers pipeline·SentencePiece·tiktoken과 subword 원 논문을 evidence와 본문에 연결
- [x] gradient와 구형 연결 card를 text unit·pipeline·merge·greedy match·path·compatibility·evaluation flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / BERT

- [x] representation target → visibility contract → corruption objective → recipe evidence → transfer interface의 top-down 흐름으로 재작성
- [x] Tokenizer·Transformer·attention 기본 계산은 canonical article로 연결하고 BERT 고유 책임에 집중
- [x] Input embedding 합·padding mask·MLM loss·classification head 수식 4개를 설명형 순서로 이관
- [x] 15% selection과 80/10/10 corruption, NSP의 역사적 범위, RoBERTa·ALBERT·ELECTRA의 반례와 변경 축을 분리
- [x] BERT·RoBERTa·ALBERT·ELECTRA·Sentence-BERT 원 논문과 HF 공식 입력 계약을 evidence와 본문에 연결
- [x] gradient·구형 비교 card를 visibility·input contract·corruption·recipe evidence·task head flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / CNN

- [x] tensor/task → local operator → spatial geometry → inductive bias → system choice의 top-down 흐름으로 재작성
- [x] Cross-correlation 구현·NCHW 의미·kernel의 channel 축·padding 경계 효과·parameter/FLOPs/activation memory 차이를 보강
- [x] Local correlation·output shape·parameter count·equivariance·receptive field·depthwise cost 수식 6개를 설명형 순서로 이관
- [x] Theoretical/effective receptive field, dilation과 aliasing, exact equivariance의 성립 조건을 분리
- [x] LeNet·AlexNet·MobileNet·effective RF·dilated convolution·ConvNeXt·ViT 원 연구를 evidence와 본문에 연결
- [x] gradient·구형 비교 card를 bias·kernel window·geometry·receptive field·bottleneck·task head·prior/cost flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인

### AI / ECOD

- [x] Detection contract → marginal rank → tail evidence → aggregation contract → decision/evaluation의 top-down 흐름으로 재작성
- [x] ECDF·negative-log contribution·sample skewness·원 논문 aggregation·PyOD aggregation·contamination threshold 수식 6개를 설명형 순서로 이관
- [x] 원 논문의 max-after-sum과 PyOD 3.6.4의 sum-after-feature-max 차이를 공식 source 기준으로 명시
- [x] 새 입력 batch를 training data와 합쳐 ECDF를 재계산하는 현재 implementation contract와 batch-dependence를 보강
- [x] gradient·legacy card를 detection·rank·tail·aggregation·evaluation flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 긴 수식은 mobile 줄바꿈으로 보정

### AI / GAN

- [x] Generation contract → density-ratio game → generator signal → game dynamics → coverage/evaluation의 top-down 흐름으로 재작성
- [x] Pushforward·optimal discriminator·minimax·non-saturating·generator VJP·Wasserstein dual·GP·spectral norm·FID 수식 9개를 설명형 순서로 이관
- [x] JS 연결의 이상적 전제, minimax와 non-saturating gradient 차이, detach와 discriminator freeze 경계를 보강
- [x] WGAN critic의 probability 오해를 막고 weight clipping·GP·spectral normalization의 constraint 범위를 분리
- [x] gradient legacy card를 generation·density ratio·gradient signal·alternating loop·failure matrix·design axis flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 긴 수식은 mobile 의미 단위로 분할

### AI / LLM Serving Ops

- [x] Service contract → gateway policy → Ready capacity → traffic lifecycle → closed-loop operations의 top-down 흐름으로 재작성
- [x] TTFT·completion·deadline·retry amplification·Little's Law·startup budget·HPA·burn rate·canary effect 수식 9개를 설명형 순서로 이관
- [x] Runtime 내부 batching·scheduler·KV 계산은 정본 글로 연결하고 이 글은 SLO·routing·fleet·probe·rollout·control-loop 소유권으로 한정
- [x] LiteLLM·vLLM·Kubernetes probe/HPA·NVIDIA GPU Operator·Google SRE 공식 문서를 evidence에 연결
- [x] gradient·구형 card를 service path·gateway policy·retry boundary·capacity activation·deployment lifecycle·probe semantics·signal control flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 모바일 긴 수식 3개를 의미 단위로 분할

### AI / Open-R1

- [x] Reproduction contract → SFT boundary → on-policy GRPO → verifier boundary → data/evaluation의 top-down 흐름으로 재작성
- [x] SFT masked NLL·group-relative advantage·clipped policy surrogate·multi-reward·pass@1 추정·표준오차 수식 6개를 설명형 순서로 이관
- [x] Distillation·R1-Zero-like RL·multi-stage claim과 SFT token supervision·RLVR의 data 생성 시점을 분리
- [x] Reward difficulty/length bias, DAPO·Dr. GRPO normalization, 현재 TRL KL default와 sampler–trainer importance correction을 공식 자료 기준으로 보강
- [x] OpenR1-Math generation/selection 수치, 8-gram decontamination의 범위, verifier version과 filtering lineage를 보강
- [x] gradient·구형 card를 reproduction scope·SFT mask·online loop·reward boundary·data lineage·evaluation contract flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 모바일 긴 수식 3개를 의미 단위로 분할

### AI / ResNet

- [x] Optimization degradation → residual parameterization → signal/gradient path → block/shape contract → evidence/selection의 top-down 흐름으로 재작성
- [x] Overfitting·vanishing gradient·degradation을 분리하고 identity shortcut이 gradient를 절대 보장한다는 과장을 제거
- [x] Residual mapping·block Jacobian·multi-block expansion·BasicBlock·Bottleneck 수식 5개를 설명형 순서로 이관
- [x] BasicBlock·Bottleneck·projection·pre-activation과 torchvision v1.5 stride·zero-init 구현 차이를 보강
- [x] 원 ResNet·Identity Mappings·ensemble path·loss landscape·torchvision source를 evidence와 본문에 연결
- [x] 구형 card를 degradation·two-path block·shape contract·block family·claim boundary flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 모바일 긴 parameter 식은 의미 단위로 분할
- [x] Degradation·residual parameterization·identity propagation·shape contract·block family·pre-activation·evidence boundary를 canonical concept graph와 기초/심화 문제에 연결
- [x] Identity propagation theorem의 전제·proof idea와 `J_F=-I`·projection·post-activation 반례를 초심자 설명에 포함
- [x] 5개 원문/공식 source의 내부 reading anchor와 5개 수식·6개 flat Viz를 desktop 1440px / mobile 390px에서 재확인; console error 없음

### AI / Transformer architecture

- [x] Input contract → position/visibility → two mixers → output/objective → recipe/scale의 top-down 흐름으로 재작성
- [x] Token ID·position signal·attention mask·loss mask의 tensor 역할과 encoder self·causal self·cross-attention의 source 차이를 보강
- [x] Input embedding·sinusoidal PE·masked attention·attention complexity·FFN·pre/post-norm·LM objective·scaling law 수식 8개를 설명형 순서로 이관
- [x] Attention 상세 유도·tokenizer·activation·RoPE·cross-entropy는 canonical 글에 맡기고 이 글의 architecture 실행 계약과 중복을 분리
- [x] Transformer·Pre-LN·GLU FFN·pure-attention rank·scaling law·Chinchilla 원 연구를 evidence에 연결
- [x] gradient·구형 card를 execution map·input·position·attention·block·output·training·scaling flat Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 모바일 긴 attention 식 2개를 의미 단위로 분할

### AI / Distributional semantics

- [x] Representation contract → context observation → association weighting → compression objective → evaluation boundary의 top-down 흐름으로 재작성
- [x] One-hot identity와 corpus usage를 분리하고 window·direction·dependency·document context가 만드는 inductive bias를 보강
- [x] One-hot orthogonality·weighted co-occurrence·PMI/PPMI·truncated SVD·cosine·SGNS shifted-PMI 수식 6개를 설명형 순서로 이관
- [x] Word2Vec 상세 update·tokenizer·BERT contextual representation은 canonical 글에 맡기고 count·prediction 이론 연결의 소유권을 분리
- [x] Harris·LSA·SGNS factorization·GloVe·distributional comparison·Firth/Harris 재검토 연구를 evidence에 연결
- [x] 구형 SVG·StepViz와 data 20여 파일을 제거하고 measurement·context·weighting·factorization·evaluation·method bridge flat Viz 7개로 교체
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow 없음과 DOM 설명 순서 확인; 긴 co-occurrence·PMI 식은 계산 순서대로 분할

### AI / Matrix·rank·SVD

- [x] Vector 정본에서 matrix map·multiplication·rank/basis·SVD·truncated approximation으로 이어지는 초심자 수학 입구를 추가
- [x] Eckart–Young theorem의 전제·proof idea·rank 제한 반례와 기초/심화 문제를 learning contract에 연결
- [x] 분포 의미론의 duplicate SVD 설명을 정본 링크로 이관하고 desktop 1440px / mobile 390px overflow 확인

### AI / Word2Vec · BERT

- [x] Word2Vec의 pair sampling·CBOW/Skip-gram·SGNS·shifted PMI·artifact 경계와 BERT의 visibility·input packing·MLM corruption·task head를 각각 canonical graph로 연결
- [x] 두 글 모두 초심자 설명·계산 문제·심화 실험 문제와 원 논문 reading anchor를 연결
- [x] desktop 1440px / mobile 390px에서 수식·Viz·페이지 overflow와 paper anchor를 확인하고 BERT 80/10/10 branch의 React duplicate key를 수정

### AI / CNN learning contract

- [x] Image tensor → local cross-correlation → weight sharing·spatial geometry → equivariance·receptive field → architecture·task 선택의 top-down 흐름 고정
- [x] Translation equivariance의 index 치환 proof idea와 stride/padding 반례, theoretical/effective receptive field 측정 차이를 보강
- [x] Sampling·Nyquist 정본을 stride aliasing의 재귀 선수 경로로 연결하고 folder/index article도 감사기가 인식하도록 수정
- [x] LeNet·AlexNet·effective receptive field·dilated convolution·MobileNet·ConvNeXt·ViT 7개 원문을 내부 reading anchor와 연결
- [x] 6개 설명형 수식과 8개 flat Viz를 desktop 1440px / mobile 390px에서 확인; page·figure overflow 및 console error 없음

### AI / Agentic patterns

- [x] Observable run state → ReAct observation loop → plan/verification → delegation contract → extension/evaluation의 top-down 흐름으로 재작성
- [x] Model proposal과 runtime execution을 분리하고 tool schema·permission·risk·idempotency·receipt·exit condition을 보강
- [x] Plan을 dependency·artifact·owner·evidence·state transition이 있는 registry로 바꾸고 checkpoint·replanning·feedback-based reflection을 설명
- [x] Multi-agent를 지능 합성이 아닌 context·authority·artifact ownership 분리로 정의하고 manager·handoff·parallel·actor-reviewer 선택 기준을 보강
- [x] Hook·Skill·Guardrail·Verifier의 실행 시점과 권한을 분리하고 answer·trajectory·side effect의 grader stack을 연결
- [x] ReAct·Reflexion 원 논문과 Anthropic·OpenAI 공식 agent/eval 가이드를 evidence에 연결
- [x] 구형 SVG·interactive Viz 22개를 제거하고 state·pattern·observation·tool·plan·verification·delegation·orchestration·extension·evaluation flat Viz 10개로 교체
- [x] desktop 1440px / mobile 390px에서 11개 전체 Viz·텍스트·페이지 overflow 없음 확인

## 진행 중

### AI / Tabular deep learning

- [x] Heterogeneous row·schema → 강한 GBDT baseline → representation 기회 → TabNet/FT-Transformer → 운영 판정의 top-down 흐름으로 재작성
- [x] TabNet sequential sparse mask·reuse prior·masked-feature pretraining과 FT-Transformer numerical/category tokenizer·CLS column interaction을 원 논문 표기로 보강
- [x] Feature engineering·attention·GBDT 비교 계약은 canonical 글로 연결하고 중복 정의를 제거
- [x] 5개 설명형 수식, 기초/심화 문제 7개, 원 논문 2개 reading anchor와 knowledge graph ownership을 등록
- [x] Flat Viz 4개를 card 나열 대신 reading route·row별 mask matrix·token/attention trace·evidence matrix로 교체하고 desktop 1440px / mobile 390px에서 overflow·console 검수

### AI / Time features

- [x] Entity·forecast origin·horizon → observation/duration lag → window/EMA → cyclic/harmonic coordinates → rolling-origin replay의 top-down 흐름으로 재작성
- [x] Window 양끝·available time·minimum observations·history/staleness와 gap/purge information path를 재현 가능한 계약으로 보강
- [x] Cyclic coordinate의 unit-circle 거리 proof idea와 sin-only 반례, 기초/심화 문제 7개, 원 논문 2개 reading anchor를 graph에 등록
- [x] Flat Viz 5개를 card 나열 대신 forecast contract·availability ledger·window trace·cyclic geometry·rolling-origin table로 교체하고 desktop 1440px / mobile 390px에서 overflow·console 검수

### AI / Event sequence modeling

- [x] Entity·cutoff·available history → heterogeneous event token → flat compression → attention visibility·pooling → order intervention의 top-down 흐름으로 재작성
- [x] Stable tie-break·padding/loss mask·truncation evidence loss와 transition smoothing·summary collision을 계산 가능한 계약으로 보강
- [x] Whole-history와 next-event mask를 분리하고 masked mean의 분모, within-entity shuffle 진단을 설명형 수식으로 연결
- [x] 기초/심화 문제 7개, canonical concept 9개, Transformer·Time2Vec 논문 해설 경로와 editorial ownership을 등록
- [x] 구형 card Viz 4개를 availability ledger·token trace·summary collision·visibility matrix flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / PyTorch training pipeline

- [x] Reproducible run → Dataset/sampler/collate → phase/update clock·AMP → resume state closure → global metric·provenance의 top-down 흐름으로 재작성
- [x] Input wait fraction·effective batch·loss scaling·resume divergence·global metric reduction 수식 5개를 설명형 순서로 이관
- [x] Dataset/DataLoader·AMP·checkpoint·reproducibility의 현재 PyTorch 공식 API와 보장 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 7개, canonical concept 10개와 editorial ownership을 등록
- [x] 구형 card Viz 5개를 run lanes·input lineage·phase matrix·state inventory·run index flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Transfer learning practice

- [x] Pretrained handoff → parameter/buffer freeze → layerwise update → fixed/partial/full 비교 → shift adaptation·negative transfer의 top-down 흐름으로 재작성
- [x] Target objective·trainable mask·BatchNorm buffer·relative update·paired gain·shift taxonomy 수식 6개를 설명형 순서로 이관
- [x] PyTorch transfer tutorial·ULMFiT·DAPT/TAPT·DANN의 핵심 아이디어·전제·evidence 범위를 reading anchor로 연결
- [x] 기초/심화 문제 7개, canonical concept 9개와 editorial ownership을 등록
- [x] 구형 card Viz 5개를 adaptation ladder·freeze audit·parameter trace·fair comparison·shift decision flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Learning-rate scheduling

- [x] Optimizer update clock·total budget → open/metric-triggered decay → cosine/restart → OneCycle/range test → warmup/update magnitude의 top-down 흐름으로 재작성
- [x] Parameter displacement·effective update budget·step/exponential·cosine·OneCycle·piecewise warmup·Adam update 수식 7개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] PyTorch scheduler/plateau/OneCycle 현재 API와 SGDR·Super-Convergence·untuned warmup의 핵심 아이디어·전제·evidence 범위를 reading anchor로 연결
- [x] 기초/심화 문제 7개, canonical concept 9개와 editorial ownership을 등록
- [x] 구형 card·bar Viz 5개를 schedule contract·trigger trace·cosine progress·inverse momentum·warmup boundary flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Regularization practice

- [x] Observed gap 원인 audit → activation noise → parameter decay → trajectory selection → target smoothing·ablation의 top-down 흐름으로 재작성
- [x] Train/validation risk·inverted-dropout expectation/variance·SGD L2 equivalence·AdamW decoupling·early-stopping state·label-smoothing loss 수식 6개를 설명형 순서로 이관
- [x] Dropout·AdamW·early stopping·Inception label smoothing 원 연구와 PyTorch AdamW/CrossEntropyLoss 현재 API를 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 11개와 editorial ownership을 등록
- [x] 구형 card·bar Viz 5개를 diagnosis ledger·train/eval mask·update-path comparison·checkpoint trace·target distribution flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Image classification pipeline

- [x] Deployment identity group split → reproducible baseline → backbone quality–runtime budget → augmentation·resolution·pseudo-label → calibrated decision의 top-down 흐름으로 재작성
- [x] Group split risk·resolution cost·compound scaling·augmentation risk·confidence-gated pseudo-label·temperature scaling·TTA/ensemble decision 수식 7개를 설명형 순서로 이관
- [x] EfficientNet·ConvNeXt·ViT·RandAugment·FixMatch·temperature scaling 원 논문의 문제·기여·전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 9개와 editorial ownership을 등록
- [x] 구형 card Viz 4개를 identity ledger·architecture/budget table·experiment ladder·inference state transition flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Vision Transformer

- [x] Spatial prior → patch sequence contract → DeiT·Swin·MAE의 병목 분기 → paired quality–runtime selection → checkpoint parity의 top-down 흐름으로 재작성
- [x] Patch shape·projection/Conv2d 동치·distillation loss·window complexity·visible-token compute·paired gain·position-grid resize·logit parity 수식 8개를 설명형 순서로 이관
- [x] ViT·DeiT·Swin·MAE 원 논문의 문제·기여·전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 8개와 editorial ownership을 등록
- [x] 구형 card Viz 5개를 representation boundary·shape trace·architecture branch·selection ledger·checkpoint handoff flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Multi-view fusion

- [x] Episode identity·coordinate·availability·order → registered input → masked representation aggregation → pose-aware token interaction → missing-view intervention의 top-down 흐름으로 재작성
- [x] Episode set·permutation invariance·registered concat·masked gate·pose-aware token·joint attention cost·paired view-drop loss 수식 7개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] MVCNN·Set Transformer 원 논문의 핵심 아이디어·input 가정·평가 범위·과장하면 안 되는 claim을 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 9개와 editorial ownership을 등록
- [x] 구형 card Viz 4개를 episode contract table·registered sensor ledger·masked reducer trace·cross-view token ledger flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Deepfake detection

- [x] Source·identity independence → face observation lineage → conditional spatial/frequency evidence → video aggregation·benchmark → provenance·coverage의 top-down 흐름으로 재작성
- [x] Split disjointness·worst-domain risk·track coverage·branch joint error·top-k video reducer·source coverage matrix 수식 6개를 설명형 순서로 이관
- [x] FaceForensics++·Fourier discrepancy 재검토·DeepfakeBench·DFDC 원 논문의 문제·기여·전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 10개와 editorial ownership을 등록
- [x] 구형 card·가로 scroll Viz 5개를 evidence boundary·preprocessing lineage·corruption matrix·signal ledger·provenance manifest flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Video understanding

- [x] Event duration·motion rate → timestamp sampling·interval coverage → temporal convolution·SlowFast → tubelet·factorized attention·VideoMAE의 top-down 흐름으로 재작성
- [x] Observed duration·effective FPS/Nyquist·interval-union coverage·temporal receptive span·SlowFast rate/capacity·tubelet count·factorized attention cost 수식 7개를 설명형 순서로 이관
- [x] I3D·R(2+1)D·SlowFast·TimeSformer·VideoMAE 원 논문의 data·pretraining·clip·architecture·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 11개와 editorial ownership을 등록
- [x] 구형 card·colored block Viz 4개를 temporal contract·sampling ledger·operator ledger·video-token budget flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Contrastive learning

- [x] Pair 의미·불변성 → encoder/projection 경계 → NT-Xent·temperature → triplet margin·mining → supervised multi-positive → audit·downstream feedback의 top-down 흐름으로 재작성
- [x] Normalized embedding/cosine·NT-Xent·temperature weight ratio·triplet hinge·unit-vector distance 동치·SupCon·false-negative/downstream paired gain 수식 7개를 설명형 순서로 이관
- [x] SimCLR·FaceNet·Supervised Contrastive Learning 원 논문의 문제·기여·data/batch/mining 전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 11개와 editorial ownership을 등록
- [x] 구형 colored-card Viz 5개를 pair relation table·source trace·mining ledger·batch relation matrix·artifact loop ledger flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Domain adaptation & fine-tuning

- [x] Language/style·fact freshness·task behavior·system constraint 진단 → 최소 개입 선택 → DAPT/TAPT mixture·forgetting → SFT contract → entity/time/rights boundary의 top-down 흐름으로 재작성
- [x] Constraint 기반 intervention 선택·domain/general mixture·comparable perplexity·gain/forgetting·response-only SFT·group/time split·slice coverage 수식 7개를 설명형 순서로 이관
- [x] Don’t Stop Pretraining과 continual NMT catastrophic-forgetting 분석의 problem·contribution·model/corpus/task 전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 9개와 editorial ownership을 등록하고 transfer/SFT/RAG/LoRA 정본을 재사용
- [x] 구형 colored-card Viz 4개를 diagnosis matrix·DAPT run ledger·task contract ledger·domain split table flat Viz로 교체하고 desktop 1440px / mobile 390px에서 Viz·수식·페이지 overflow와 console을 검수

### AI / Sentence embeddings

- [x] Token state → masked pooling → relation objective → offline document reuse → candidate-recall 상한 → checkpoint/index 계약 → 평가·배포 선택의 top-down 흐름으로 재작성
- [x] Masked mean/L2 normalization·cross/bi online cost·candidate recall 정리·content retention·raw/index storage·multi-positive Recall/NDCG·품질–비용 지배 수식 7개를 설명형 순서로 이관
- [x] SBERT·E5·MTEB 원 논문의 문제·기여·serialization/data/task 전제·claim 한계를 내부 reading anchor로 연결
- [x] 기초/심화 문제 8개, canonical concept 9개와 editorial ownership을 등록하고 BERT·대조 학습·Tokenizer 정본을 재사용
- [x] 구형 colored-card·도형 Viz 4개를 pooling contract·retrieval stage·model-card contract·evaluation matrix flat Viz로 교체하고 desktop 1440px / mobile 390px에서 page/Viz overflow와 console을 검수

### AI / Quantization

- [x] “몇 bit인가”보다 target runtime·memory/latency/quality budget에서 시작해 method→artifact→kernel→measurement로 내려가는 top-down 흐름으로 재작성
- [x] Affine quantizer·rounding/clipping error·granularity metadata·calibration coverage·fake quantization/STE·layer reconstruction·resident-memory ledger·Amdahl 상한 수식 8개를 설명형 순서로 이관
- [x] Integer QAT·SmoothQuant·GPTQ·AWQ 원 논문과 GGUF 공식 명세의 문제·기여·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 8개, canonical concept 9개와 editorial ownership을 등록하고 bit/byte·scalar·matrix·train/validation/test 정본을 재사용
- [x] 구형 colored-card Viz 5개를 precision ledger·PTQ calibration trace·QAT forward/backward lane·GPTQ/AWQ 비교표·resident-memory ledger의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 8개·Viz·page overflow 없음, 질문→수식 순서와 console warning/error 0을 확인

### AI / Pruning

- [x] Zero 비율 소개 대신 제거 단위→mask→artifact→operator→quality/runtime evidence로 내려가는 top-down 흐름으로 재작성
- [x] Mask sparsity·sparse storage 손익분기·movement score·structured FLOPs·N:M local 제약·SparseGPT reconstruction·Wanda score·fixed-mask recovery 수식 8개를 설명형 순서로 이관
- [x] Movement Pruning·SparseGPT·Wanda 원 논문과 TensorRT 2:4 공식 문서의 문제·기여·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 8개, canonical concept 10개와 editorial ownership을 등록하고 scalar·bit/byte·matrix·gradient·split·Amdahl 정본을 재사용
- [x] 구형 colored-card Viz 5개를 pruning contract table·unstructured trace·shape/N:M ledger·LLM method table·recovery evidence loop의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 8개·Viz 6개·논문 anchor 4개·page/text overflow 없음과 console warning/error 0을 확인

### AI / Knowledge distillation

- [x] Teacher가 크다는 설명 대신 shared interface→logit distribution→mapped feature→student-tokenized sequence→student-visited prefix의 on-policy feedback→multi-teacher integration→self-generation audit의 top-down 흐름으로 재작성
- [x] Temperature probability/odds·hard/soft loss·T² gradient scale·KL 방향·feature projection·sequence NLL·slice coverage·GKD on/off-policy mixture·visited-prefix reverse KL·MOPD domain objective·inheritance warning 수식 11개를 설명형 순서로 이관
- [x] Hinton KD·FitNets·Sequence-Level KD·GKD·MOPD·Born-Again Networks 원 논문의 문제·기여·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결하고 Thinking Machines의 공개 구현 recipe를 별도 근거로 표시
- [x] 기초/심화 문제 12개, canonical concept 13개와 editorial ownership을 등록하고 probability·softmax·CE·KL·gradient·matrix·tokenizer·autoregressive decoding·split 정본을 재사용
- [x] Signal contract·temperature table·feature bridge·synthetic ledger·on/off-policy sampling comparison·generation audit의 flat Viz 6개를 유지·추가하고, 기존 가로 고정폭 ledger 3개를 모든 열이 보이는 mobile card로 수정
- [x] desktop 1440px / mobile 390px에서 수식 11개·Viz 7개(전역 흐름 포함)·논문 anchor 6개·page/Viz/formula 및 내부 ledger overflow 없음과 console warning/error 0을 확인

### AI / Compression pipeline

- [x] 기법 목록 대신 deployment bottleneck→개입 수단→hard SLA→resident capacity→stage 순서→interaction·Pareto 판정으로 내려가는 top-down 흐름으로 재작성
- [x] Hard feasibility·request concurrency·order non-commutativity·stage interaction·quality-gated Pareto 수식 5개를 설명형 순서로 이관
- [x] Deep-learning compiler survey와 MLPerf Inference 공식 가이드의 문제·측정 계약·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 8개, canonical concept 6개와 editorial ownership을 등록하고 quantization·pruning·distillation·bit/byte·train/test·Amdahl 정본을 재사용
- [x] 구형 colored-card Viz 4개를 lever boundary table·artifact chain·resident-memory ledger·paired benchmark matrix의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 5개·근거 anchor 2개·page/text overflow 없음과 console warning/error 0을 확인

### AI / RAG pipeline

- [x] 용어 목록 대신 최신·허가 source→chunk boundary→versioned index→candidate funnel→context budget→claim/citation trace의 top-down 흐름으로 재작성
- [x] Stage success·answer-span coverage·index tuple·RRF·candidate-recall 상한·context budget·Recall@k·citation precision/recall 수식 8개를 설명형 순서로 이관
- [x] RAG·DPR·RRF·lost in the middle·NDCG·Ragas 6개 원 연구의 문제·핵심 아이디어·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 11개, canonical concept 9개와 editorial ownership을 등록하고 sentence embedding·multi-positive retrieval·tokenizer·train/test 정본을 재사용
- [x] 구형 colored-card Viz 6개를 answer trace·chunk parent recovery·index manifest·candidate table·token ledger·layered evaluation matrix의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 8개·Viz 7개·근거 anchor 6개·page/text overflow 없음과 console warning/error 0을 확인

### AI / LoRA · QLoRA

- [x] 기법 소개 대신 frozen base 경계→low-rank capacity→quantized storage/compute path→token loss contract→serving artifact의 top-down 흐름으로 재작성
- [x] Trainable set·LoRA forward/shape·parameter/rank 상한·QLoRA gradient path·training-memory ledger·response-only loss·merge 동치·requantization 비선형성 수식 8개를 설명형 순서로 이관
- [x] LoRA·QLoRA 원 논문과 Hugging Face PEFT 공식 문서의 문제·핵심 아이디어·전제·claim/API version 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 8개와 editorial ownership을 등록하고 matrix rank/SVD·SFT/loss mask·quantization·bit/byte·train/test 정본을 재사용
- [x] 구형 colored-card Viz 5개를 adaptation table·matrix shape trace·precision ledger·token mask trace·artifact lineage의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 8개·Viz 6개·근거 anchor 3개·page/text overflow 없음과 console warning/error 0을 확인

### AI / Multi-agent implementation

- [x] 역할 이름 나열 대신 single-agent baseline→context·authority·artifact ownership 분리→typed worker receipt→join/reducer/replay 계약→framework mapping→설비 control 경계의 top-down 흐름으로 재작성
- [x] Baseline gain·join completeness·parallel reducer 성질·advisory/control gate 수식 4개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] LangGraph Graph API와 CrewAI Crews/Flows 현재 공식 문서의 component semantics·version 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 7개와 editorial ownership을 등록하고 RAG stage/data boundary·hard feasibility·run provenance 정본을 재사용
- [x] 구형 colored-card Viz 4개를 pattern/join matrix·state/reducer trace·flow control table·advisory/control authority path의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 4개·Viz 5개·공식 문서 anchor 2개·page overflow 없음과 console warning/error 0을 확인
- [x] 선수 지식 재귀 감사의 중복 경로를 memoize하여 동일 검사 시간을 약 2.5초로 단축

### AI / Competition workflow

- [x] 대회 팁 나열 대신 row·cutoff·metric 평가 계약→available-time EDA→OOF baseline→한 가설 paired comparison→leaderboard feedback budget·submission provenance의 top-down 흐름으로 재작성
- [x] Maximum-selection optimism·feature availability·OOF coverage·paired fold delta·adaptive feedback budget 수식 5개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Hidden Technical Debt·model-selection bias·Ladder 원 논문의 문제·핵심 아이디어·finite/adaptive 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 9개와 editorial ownership을 등록하고 train/validation/test·run/artifact provenance 정본을 재사용
- [x] 구형 colored-card Viz 5개를 decision gate table·EDA risk ledger·artifact chain·one-hypothesis trace·candidate selection table의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 6개·논문 anchor 3개·page/Viz overflow 없음과 console warning/error 0을 확인

### AI / Cross-validation

- [x] 기법 목록 대신 deployment unit·risk → fold-local preprocessing → K-fold procedure estimand → group 단위 독립성 → label-available walk-forward → CV–leaderboard mismatch audit의 top-down 흐름으로 재작성
- [x] Deployment risk·pooled OOF risk·CV procedure estimand·group disjointness·label-availability cutoff·pairwise rank agreement 수식 5개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Bates–Hastie–Tibshirani의 CV estimand 분석과 scikit-learn 공식 CV 가이드의 문제·핵심 아이디어·i.i.d./group/time 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 9개와 editorial ownership을 등록하고 expectation·train/validation/test·feature availability·selection optimism·run contract 정본을 재사용
- [x] 구형 colored-card Viz 5개를 deployment question table·OOF rotation table·group manifest·walk-forward ledger·mismatch audit의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 6개·근거 anchor 2개·page/Viz overflow 없음과 console warning/error 0을 확인

### AI / Hyperparameter tuning

- [x] Parameter/hyperparameter 입구 → search·selection·outer evaluation 계약 → random budget → Optuna history/TPE → typed feasible space → comparable fidelity/pruning → Pareto 선택의 top-down 흐름으로 재작성
- [x] Search selection·random hit probability·adaptive acquisition·TPE density ratio·log-uniform sampling·feasible set·successive halving·Pareto dominance 수식 8개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Random Search·TPE·Optuna·Hyperband 원 논문과 Optuna Study 공식 문서의 문제·핵심 아이디어·search/resource/version 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 10개와 editorial ownership을 등록하고 probability·logarithm·train/validation/test·CV risk·selection optimism·run contract 정본을 재사용
- [x] 구형 colored-card Viz 4개를 search proposal table·Optuna execution trace·typed space manifest·successive-halving resource ledger의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 8개·Viz 5개·근거 anchor 5개·page/Viz overflow 없음과 console warning/error 0을 확인

### AI / Ensemble methods

- [x] Model 수 소개 대신 row-aligned OOF error covariance → scale-preserving/rank fusion → cross-fitted stacking → oracle claim 경계 → blend data allocation → marginal gain·serving cost의 top-down 흐름으로 재작성
- [x] Error covariance·simplex average·percentile rank·cross-fitted meta matrix·Super Learner oracle comparison·blend allocation·paired marginal gain 수식 7개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Stacked Generalization·Super Learner·Ensemble Selection 원 논문과 scikit-learn StackingClassifier 공식 문서의 문제·핵심 아이디어·CV/asymptotic/library/API 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 7개와 editorial ownership을 등록하고 expectation·variance·OOF·fold-local boundary·HPO selection/Pareto·run contract 정본을 재사용
- [x] 구형 colored-card Viz 5개를 OOF error ledger·fusion contract·cross-fitted meta matrix·blend allocation·greedy decision ledger의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 7개·Viz 6개·근거 anchor 4개·page/Viz overflow 없음과 console warning/error 0을 확인

### AI / Evaluation metrics

- [x] Metric 이름 나열 대신 deployment decision unit·prediction-to-action·error cost → hierarchical reducer → regression risk/interval → classification ranking/probability/decision → query-level ranking → surrogate/selection/policy/outer 경계의 top-down 흐름으로 재작성
- [x] Expected decision cost·hierarchical reducer·MAE/RMSE·L1/L2 Bayes act·interval coverage/width·Brier properness·NDCG·query macro/traffic·train/select/report·guardrail feasible set 수식 10개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Regression Quantiles·Strictly Proper Scoring Rules·Cumulative Gain 원 논문과 scikit-learn Metrics 공식 문서의 문제·핵심 아이디어·수학/label/API 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 10개와 editorial ownership을 등록하고 expectation·conditional probability·train/validation/test·imbalanced classification·multi-positive retrieval·HPO outer evaluation 정본을 재사용
- [x] 구형 colored-card Viz 5개를 metric contract·regression penalty ledger·classification 3층·query ranked list·train/select/report 정보 경계의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 10개·Viz 6개·근거 anchor 4개·page/Viz overflow 없음과 console warning/error 0을 확인
- [x] 전역 운영 가이드 입구의 어색한 목적격 조사 조합을 제목 독립형 질문으로 수정

### AI / Experiment tracking

- [x] 도구별 기능 나열 대신 immutable experiment specification과 실제 execution attempt 분리 → content-addressed artifact → metric progress coordinate → mutable alias receipt → metadata/object-store integrity → reproduction acceptance의 top-down 흐름으로 재작성
- [x] Spec digest·artifact reference·metric progress·alias resolution·replay predicate·reproduction equivalence·hierarchical seed 수식 7개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] MLflow 원 논문과 ML reproducibility 연구를 핵심 논문으로, W&B·MLflow·PyTorch 최신 공식 문서를 도구 동작과 버전 경계의 근거로 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 9개와 editorial ownership을 등록하고 run/artifact provenance·effective update clock·probability/variance·evaluation guardrail 정본을 재사용
- [x] MLflow Model Stages deprecation을 반영해 immutable model version·mutable alias·실제 deployment receipt를 분리하고 backend store와 artifact store를 같은 recovery lifecycle로 검사하도록 보강
- [x] 구형 colored-card Viz 4개를 specification/attempt/output provenance·metric axis/alias receipt·store integrity·reproduction acceptance ladder의 flat responsive Viz로 교체
- [x] desktop 1440px / mobile 390px에서 수식 7개·Viz 5개·공식/논문 source link·page/Viz/formula overflow 없음과 console warning/error 0을 확인하고 production build를 통과

### AI / Open-R1

- [x] Checkpoint 소개 대신 distillation·R1-Zero-like RL·multi-stage reproduction scope → reasoning-trace SFT → verifier-accessible policy → GRPO relative update → verifier/data lineage → sampling evaluation의 top-down 흐름으로 보강
- [x] SFT NLL·group-relative advantage·policy-ratio clipping·multi-component reward·sampled pass@1·standard error 수식 6개를 질문·아이디어·기호·전제·해석 순서로 유지하고 일반 SFT·distillation 정본과 중복을 링크로 분리
- [x] DeepSeek-R1·DeepSeekMath/GRPO·DAPO 원 논문과 Open-R1·TRL 현재 공식 구현의 문제·핵심 아이디어·recipe/library version 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개, canonical concept 10개와 editorial ownership을 등록하고 language-model policy·SFT/mask·sequence distillation·online rollout·variance·run provenance 정본을 재사용
- [x] Original GRPO의 sample-level aggregation, DAPO의 active-token normalization, 현재 TRL loss/default와 vLLM sampler–trainer mismatch correction을 서로 다른 실행 semantics로 분리
- [x] 기존 flat Viz 6개는 표현 방식을 유지하면서 mobile 390px의 내부 spacing·text wrapping·overflow를 실화면으로 재검수
- [x] desktop 1440px / mobile 390px에서 수식 6개·Viz 7개(전역 흐름 포함)·논문/공식 anchor 8개·page/Viz/formula overflow 없음과 console warning/error 0을 확인하고 production build를 통과

### AI / Mixture-of-Experts

- [x] Dense FFN의 compute-capacity 결합 → token router·Top-k·weighted mixture → load·capacity·overflow → total/active parameter·expert-parallel dispatch → shared/fine-grained expert 확장의 top-down 정본을 신규 작성
- [x] Sparse expert mixture·softmax Top-k·균등 load/peak ratio·total/active parameter·dispatch/gather payload 수식 5개를 질문·아이디어·기호·전제·해석 순서로 작성
- [x] Sparsely-Gated MoE·GShard·Switch Transformer·DeepSeekMoE 원 논문의 문제·핵심 아이디어·architecture/task/hardware 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 8개를 먼저 등록하고 Transformer block·softmax·tensor batch의 entry-level 재귀 선수 경로를 재사용
- [x] Dense/MoE 경로·router trace·expert load·system cost·연구 계보 Viz 5개를 flat responsive 방식으로 작성하고 모바일에서 숨던 표 열을 한 화면 ledger·세로 cost card로 수정
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 5개·논문 anchor 4개·page/Viz/formula overflow 없음과 console warning/error 0을 확인하고 production build를 통과

### AI / Kimi K3 architecture

- [x] 모델 크기·benchmark 나열 대신 sequence의 KDA+Gated MLA → depth의 Block Attention Residuals → width의 Stable LatentMoE → 공개 근거의 강도와 runtime 조건을 분리하는 top-down 흐름으로 재작성
- [x] KDA state update·bounded decay·Gated MLA output gate·일반/attention residual·Block AttnRes state bound·LatentMoE 합성·SiTU-GLU·router selection·Quantile Balancing 수식 10개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Kimi K3 report·Kimi Linear·Attention Residuals 원문의 핵심 문제·방법·전제·claim 한계를 본문 paper anchor와 evidence contract에 연결하고, K2 대비 약 2.5× 종합 scaling efficiency를 개별 component의 인과 효과와 구분
- [x] 기초/심화 문제 10개와 canonical concept 11개를 등록하고 Attention·RNN state·position signal·residual·MoE·gated FFN·scaling law 정본을 재사용
- [x] 구형 gradient wrapper를 제거하고 architecture map·69/24 layer schedule·KDA state update·Block AttnRes depth memory·LatentMoE width path·Quantile router control·evidence ledger의 flat responsive Viz 7개로 교체
- [x] desktop 1440px / mobile 390px에서 수식 10개·Viz 7개·논문 anchor 3개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / Hybrid attention serving · KV cache capacity

- [x] Parameter 수 비교에서 시작하지 않고 autoregressive decode state → MHA·GQA·MQA KV sharing → token당 byte → local/global layer별 보존 길이 → vLLM allocator → capacity log → workload admission의 top-down 흐름으로 재작성
- [x] Q/K/V tensor shape·token당 KV byte·layer별 hybrid KV memory·KV pool/concurrency 상한·runtime log consistency 수식 5개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] MQA·GQA·PagedAttention 원 논문의 문제·핵심 아이디어·training/runtime 전제·claim 한계를 본문 anchor와 evidence contract에 연결하고 sidebar에서 바로 찾을 수 있게 등록
- [x] 기초/심화 문제 10개와 canonical concept 8개를 등록하고 autoregressive decoding·attention Q/K/V·MHA·bit/byte의 entry-level 재귀 선수 경로를 재사용
- [x] Muse 52×2×128, Gemma local/global layer별 shape와 Qwen project config를 공식 config·project measurement로 분리하고, quantization·KV dtype·TP/PP·hybrid block 회수의 역할을 별도 계산으로 구분
- [x] 모바일에서 숨거나 가로 스크롤되던 4열 model table을 모델별 세로 ledger로 바꾸고 기존 topology·head-sharing·capacity 표현은 유지한 채 flat border·spacing·wrapping을 재검수
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 11개·논문 anchor 3개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / vLLM speculative decoding · EAGLE · native MTP

- [x] 기법 목록 대신 autoregressive target step의 memory-bound 비용 → draft·verify·commit cycle → acceptance 정의 → rejection sampling의 target 분포 보존 → proposer 설계 → production 손익분기점의 top-down 흐름으로 재작성
- [x] Acceptance/committed length·target weight-read 상각·rejection/correction probability mass·prefix tail expectation·serving speedup 수식 5개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Speculative Decoding·EAGLE·Multi-Token Prediction·SpecInfer 원 논문의 문제·핵심 아이디어·algorithm/model/system 전제·claim 한계를 본문 anchor와 evidence contract에 연결하고 sidebar에서 바로 찾을 수 있게 등록
- [x] 기초/심화 문제 10개와 canonical concept 9개를 먼저 등록하고 autoregressive decoding·확률분포·조건부확률·기댓값·KV decode state의 재귀 선수 경로를 재사용
- [x] GLM/B300의 acceptance·throughput·quantization 수치는 적용 사례 글이 소유하도록 분리하고, 일반 글에서는 native MTP objective·runtime integration·numerical acceptance·vLLM 지원 경계를 설명
- [x] 구형 gradient·oversized-radius flow와 가로 스크롤 표를 draft–verify cycle·HBM amortization·causal acceptance trace·proposer cards·serving decision ledger의 flat responsive Viz 5개로 교체
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 6개(전역 흐름 포함)·논문 anchor 4개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / vLLM serving 입문 · continuous batching

- [x] 기능 나열 대신 autoregressive request lifecycle → prefill/decode phase → TTFT·ITL latency 분해 → iteration-level batch 재구성 → token·sequence·KV hard gates → engine state ownership → DP·TP·PP → SLO goodput의 top-down 흐름으로 재작성
- [x] TTFT/E2E/TPOT·iteration hard feasibility·regular DP×TP×PP topology·SLO goodput 수식 4개를 질문·아이디어·기호·전제·해석 순서로 작성
- [x] Orca·vLLM/PagedAttention 원 논문의 문제·핵심 아이디어·system/workload 전제·claim 한계를 본문 anchor와 evidence contract에 연결하고 current V1 guide·parallelism/code 경계를 공식 문서로 고정
- [x] 기초/심화 문제 10개와 canonical concept 8개를 먼저 등록하고 autoregressive decoding·KV cache state·tensor batch의 재귀 선수 경로를 재사용
- [x] Scheduler·PagedAttention·hybrid KV·production ops의 정본 범위를 중복 작성하지 않고 내부 링크로 분리
- [x] 구형 gradient·oversized-radius Viz와 가로 스크롤 parallel table을 request lifecycle·prefill/decode·continuous batch·resource gates·engine boundary·parallel layout의 flat responsive Viz 6개로 교체
- [x] desktop 1440px / mobile 390px에서 수식 4개·Viz 7개(전역 흐름 포함)·논문 anchor 2개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / vLLM scheduler · chunked prefill · preemption

- [x] 설정 나열 대신 request target/computed progress gap → RUNNING·WAITING admission → priority·FCFS order → output state update → chunked prefill → KV pressure preemption의 top-down 흐름으로 재작성
- [x] Progress gap·token-budget 보존·priority lexicographic order·chunk 수/overhead·recomputation waste 수식 4개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Sarathi-Serve·FastServe 원 논문의 문제·핵심 아이디어·system/hardware/workload 전제·claim 한계를 본문 anchor와 evidence contract에 연결하고 현재 vLLM V1 source semantics와 구분
- [x] 기초/심화 문제 10개와 canonical concept 8개를 등록하고 request lifecycle·prefill/decode·resource feasibility·KV decode state·latency decomposition 정본을 재사용
- [x] 구형 gradient·oversized-radius Viz와 가로 스크롤 knob table을 decision contract·progress gap·closed loop·chunk timeline·knob ledger·preemption trace의 flat responsive Viz 6개로 교체
- [x] desktop 1440px / mobile 390px에서 수식 4개·Viz 7개(전역 흐름 포함)·논문 anchor 2개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / vLLM PagedAttention · BlockPool · Automatic Prefix Caching

- [x] 기능 설명 대신 unknown-length KV state → fixed-size block allocation → logical/physical address translation → reference ownership → allocation contract → chained prefix reuse의 top-down 흐름으로 재작성
- [x] Block 수/internal slack·logical address translation·reference-count invariant·new block demand·chained prefix hash·prefill miss 수식 6개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] PagedAttention·SGLang/RadixAttention 원 논문의 문제·핵심 아이디어·system/model/hardware/workload 전제·claim 한계를 본문 anchor와 evidence contract에 연결하고 vLLM hash table과 radix tree 구현을 구분
- [x] 기초/심화 문제 10개와 canonical concept 9개를 등록하고 autoregressive decode·KV state·scheduler progress·resource feasibility·KV pool capacity 정본을 재사용
- [x] 구형 gradient·oversized-radius Viz를 fragmentation·address lookup·block lifecycle·allocation contract·hash chain·APC scope의 flat responsive Viz 6개로 교체
- [x] desktop 1440px / mobile 390px에서 수식 6개·Viz 7개(전역 흐름 포함)·논문 anchor 2개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / LLM serving operations · gateway · GPU fleet · SLO control

- [x] GPU 도구 나열 대신 workload/capability/SLO contract → gateway eligibility·deadline·retry → requested Pod→Ready capacity → probe·canary·drain·HPA → error-budget action·verification의 top-down 흐름을 learning contract로 고정
- [x] TTFT decomposition·completion latency·retry deadline·load amplification·Little's law·startup budget·HPA ratio·burn rate·canary difference-in-differences 수식 9개를 질문·아이디어·기호·전제·해석 순서로 유지
- [x] Little's law 원 논문의 finite mean·stationarity·stable-boundary 전제, proof idea와 overload counterexample를 본문 anchor·theorem node·심화 문제에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 serving lifecycle·latency decomposition·SLO goodput·resource feasibility·run provenance·expectation 정본을 재사용
- [x] 모바일에서 가로 스크롤되던 gateway·signal table을 flat responsive contract/evidence ledger로 교체하고 기존 Viz의 표현 방식·여백을 유지
- [x] desktop 1440px / mobile 390px에서 수식 9개·Viz 10개(전역 흐름 포함)·논문 anchor 1개·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / GLM-5.2 · B300 kernel/runtime/MTP 최적화

- [x] 최고 tok/s 주장부터 시작하지 않고 batch-1 weight traffic → Roofline·HBM 조건부 하한 → Split-K·tcgen05/TMEM·PQ-GEMM → runtime 병목 이동 → MTP committed token → 재현 ledger의 top-down 흐름으로 보강
- [x] Arithmetic intensity·HBM streaming 하한·전체 speedup fraction·MTP cycle throughput·token당 main-weight traffic 수식 5개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] Roofline·Multi-Token Prediction 원 논문의 문제·핵심 아이디어·관측 경계/model 조건·claim 한계를 본문 해설과 speculative decoding 정본에 연결하고 GLM/B300 프로젝트 수치와 분리
- [x] 기초/심화 문제 10개와 canonical concept 9개를 등록하고 bit/byte·TP layout·draft/verify·acceptance·native MTP의 entry-level 재귀 선수 경로를 재사용
- [x] 6.65GB·53→127→37µs·0.49→1.53TB/s·7.13→4.47·108→600tok/s를 각각 HBM 항·kernel·pipeline·acceptance·service 경계로 분리하고 공개되지 않은 600–1,000tok/s는 project claim으로 제한
- [x] 모바일 가로 표를 flat measurement ledger로 교체하고 공용 단계형 Viz의 그라데이션·shadow·과한 radius·잘린 탭 문구를 flat wrapping primitive로 수정
- [x] desktop 1440px / mobile 390px에서 수식 5개·Viz 4개(전역 흐름 포함)·page/Viz/formula overflow 없음과 console warning/error 0을 확인

### AI / EUREKA retrieval embedding data · mining · distillation

- [x] 평균 benchmark 점수부터 시작하지 않고 배포 robustness axis → corpus lineage·누출 경계 → synthetic-query task/answer-position coverage → 다대다 relevance graph → positive-aware mining → query-local teacher cache·listwise KL → slice 평가의 top-down 흐름으로 재작성
- [x] Positive-relative hard-negative 경계·query-local listwise distillation·NDCG@k 수식 3개를 질문·아이디어·기호·전제·해석 순서로 이관하고 390px에서 display formula overflow를 제거
- [x] E5·Gecko·Qwen3 Embedding·position bias·multi-positive·NV-Retriever·knowledge distillation 원 논문의 문제·핵심 아이디어·실험 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 bi-encoder·contrastive pair·mining snapshot·temperature·KL·NDCG·data split 정본을 재사용
- [x] 1:1/1:N/N:1 label 표와 loss ablation 표를 모바일 responsive evidence ledger로 바꾸고, 관측된 loss 순위와 representation-drift 원인 가설을 분리
- [x] desktop 1440px / mobile 390px에서 수식 3개·Viz 5개(전역 흐름 포함)·page/Viz overflow 없음·gradient/shadow 0·console warning/error 0을 확인

### HW / GPU / 서버 네트워크 기초

- [x] Port 사양 나열 대신 workload traffic matrix → line rate·payload goodput → Ethernet compatibility·oversubscription → RDMA control/data path·memory registration → RoCE GID → GPU–HCA topology → collective measurement의 top-down 흐름으로 재작성
- [x] Payload goodput·fabric oversubscription·IPv4 subnet match·NCCL algbw/busbw 수식 4개를 질문·아이디어·기호·전제·해석 순서로 이관
- [x] IEEE 802.3·NVIDIA RoCE·CUDA GPUDirect RDMA·IBTA·nccl-tests 정본 자료의 문제·기여·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 bit·byte entry-level 정본에서 B300 switchless 응용 글이 재사용할 기반을 마련
- [x] 기존 표현 방식은 유지하면서 SVG 선을 1.2px 이하로 정리하고 가로 표를 flat responsive ledger로 교체
- [x] desktop 1440px / mobile 390px에서 수식 4개·Viz 10개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인

### HW / GPU / DGX B300 switchless RoCE cluster

- [x] 장비·비용 소개 대신 채택 경계 → physical/logical port identity → full-mesh port budget → /30 manifest → peer-aware GID·NCCL rail → collective measurement·failure domain의 top-down 흐름으로 재작성
- [x] Full-mesh cable/port 예산·deterministic /30 주소·peer-aware GID candidate·line-rate/busbw sanity ratio 수식 4개를 질문·아이디어·기호·전제·해석 순서로 작성
- [x] DGX B300 port guide·DGX OS split 절차·NCCL env·nccl-tests 의미와 Sionic topology generator·patch를 본문 reading anchor로 연결하고 공식 보장·project convention·project measurement를 분리
- [x] 기초/심화 문제 10개와 canonical concept 7개를 등록하고 Ethernet·RoCE·GPUDirect·collective·algbw/busbw 네트워크 정본을 선수 경로로 재사용
- [x] 가로 고정 port/topology/env 표를 flat responsive ledger로 교체하고 project BDF·mlx5 mapping을 장비별 inventory 결과로 제한
- [x] desktop 1440px / mobile 390px에서 수식 4개·Viz 7개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인하고 production build를 통과

### AI / Agent sandbox security

- [x] 보안 제품·CVE 나열 대신 process/container 경계 → signal-capability-impact path → root·syscall/kernel 경계 → identity·egress·storage → GPU device → workload control matrix의 top-down 흐름으로 재작성
- [x] Attack path의 모든 edge가 열릴 때 impact가 reachable하다는 Boolean 수식을 질문·아이디어·기호·전제·해석 순서로 작성하고 점수·확률식으로 오해하지 않도록 제한
- [x] gVisor·Kata·Kubernetes NetworkPolicy/ServiceAccount/PSS/seccomp·Cilium FQDN·GPU 공식 문서 8개의 architecture·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 container를 작은 VM으로 가정하지 않도록 process·namespace·cgroup부터 설명하는 entry-level 경로를 구성
- [x] Signal·workload decision 가로 표를 flat responsive ledger로 교체하고 runtime·GPU·defense card의 radius·spacing을 공통 기준에 맞춤
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 8개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인하고 production build를 통과

### AI / Agent Code Mode

- [x] Coding Agent와 혼동되는 기능 소개 대신 tool-call round trip → program IR → selective schema/data reduction → runtime control flow → capability/result/effect contract → 실행 방식 선택의 top-down 흐름으로 재작성
- [x] 반복 prompt·schema·intermediate result·decision token과 discovery·program·final result token을 비교하는 비용 수식을 질문·아이디어·기호·전제·해석 순서로 작성
- [x] Anthropic code execution with MCP·Cloudflare Code Mode·TanStack AI Code Mode 공식 문서의 구현 이름·문제·전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 agent sandbox의 process boundary·workload control matrix를 선수 경로로 재사용
- [x] 가로 decision table을 flat responsive ledger로 교체하고 code comparison·security card를 공통 radius·spacing 기준으로 정리
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 6개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인하고 production build를 통과

### AI / Grammar-constrained generation · CFG · PDA · Tree-sitter · XGrammar

- [x] Structured output 기능 소개부터 시작하지 않고 alphabet·string·language → grammar production·derivation → finite automaton의 기억 한계 → CFG·PDA stack → incremental parser → tokenizer-aware grammar compilation → decoding mask → syntax/semantics 경계의 top-down 흐름으로 재작성
- [x] Allowed token set·invalid-logit −∞ mask·masked softmax를 한 수식 블록에 묶고 질문·아이디어·기호·전제·해석 순서로 설명
- [x] Tree-sitter·XGrammar·XGrammar 2의 문제·핵심 아이디어·runtime 전제·claim 한계를 본문 reading anchor와 evidence contract에 연결
- [x] 기초/심화 문제 10개와 canonical concept 10개를 등록하고 문자·Unicode·UTF-8·tokenizer 정본을 선수 경로로 재사용
- [x] 문자 grammar와 subword token 사이의 compilation, request별 matcher state, dynamic schema mask cache, syntactic validity와 semantic/business validity의 경계를 분리
- [x] desktop 1440px / mobile 390px에서 수식 1개·Viz 6개·논문 anchor 3개·page/Viz/formula overflow 없음·gradient/shadow 0·console warning/error 0을 확인하고 production build를 통과

### 새 학습 계약 기준 재검수

- [x] AI / RLHF — contract와 6개 논문 해설 경로, 지수/로그·cross-entropy·Transformer·SFT 재귀 선수 경로까지 통과
- [x] AI / 딥러닝 전체 지도 — 무선수 입구·training loop·generalization·설명형 수식·3개 논문 해설·desktop/mobile 검수
- [x] AI / 벡터·내적·norm — scalar→vector→norm/dot product→projection→Cauchy–Schwarz의 entry-level 수학 정본, 수치 예·증명 아이디어·반례와 separability·positive margin·bounded input 전제에서의 퍼셉트론 mistake bound까지 기초 6개+심화 4개로 연결
- [x] AI / 퍼셉트론 — 수학 정본을 선수 경로로 연결하고 linear score·margin/convergence·XOR·MLP 확장·기초/심화 문제·2개 논문 해설·desktop/mobile 검수
- [x] AI / 신경망 — tensor batch·MLP 선수 경로, affine composition/collapse·hidden representation·initialization·prediction contract·기초/심화 문제·4개 논문 canonical 해설 경로
- [x] AI / RNN — sequence state·shared transition·teacher forcing·BPTT·gradient path를 top-down으로 연결하고, lossy state·shifted pair·shared-weight gradient sum·tanh saturation까지 기초 6개+심화 4개로 역검사
- [x] AI / LSTM — RNN 병목에서 dual state·soft gate·direct retention·GRU/deployment budget으로 확장하고, scalar step trace·parameter count·논문 계보·LSTM/GRU 예산 비교를 기초 6개+심화 4개로 역검사
- [x] AI / Agent Code Mode·Agent sandbox security — token 이동량과 signal→capability→boundary→impact의 구체적 초심자 문제를 추가해 각각 기초 6개+심화 4개로 재검수
- [x] AI / Competition workflow·Cross-validation·Evaluation metrics·Experiment tracking — validation 최대값 낙관·fold-local scaler·row/patient reducer·mutable alias를 수치·분류 문제로 다시 설계해 각각 기초 6개+심화 4개로 재검수
- [x] AI / Attention theory — Q·K·V 역할에서 additive·bilinear·scaled dot-product·self/multi-head로 확장하고, score·mask·projection·동일 context 반례를 기초 6개+심화 4개로 역검사; 모바일에서 넘치던 수식 7개를 단계형으로 재배치
- [x] AI / Autoencoder — encoder–latent–decoder·bottleneck·likelihood·chain rule·PCA 전제·제약/적용을 연결하고 기초 6개+심화 4개로 역검사; 모바일 수식 overflow와 KaTeX Unicode norm 경고를 제거
- [x] AI / Backpropagation·optimization — computational graph·reverse mode·fan-out accumulation·batched affine backward·optimizer intervention을 기초 6개+심화 4개로 역검사하고 모바일 수식 overflow를 제거; import closure 밖의 미참조 구형 SVG 48개를 삭제해 실제 Viz 정본만 유지
- [x] AI / Word2Vec — one-hot lookup·CBOW/Skip-gram·full/hierarchical/SGNS objective·static/contextual representation·artifact 경계를 연결하고 기초 6개+심화 4개로 역검사; desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / Cross-entropy — surprisal·empirical risk·entropy·cross-entropy·KL·likelihood 선택·stable log-sum-exp를 수치 예로 연결하고 기초 6개+심화 4개로 역검사; ContentBoundary와 desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / CNN — image tensor layout·cross-correlation·parameter sharing·spatial geometry·equivariance·receptive field·task contract를 기초 6개+심화 4개로 역검사; desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / BERT — encoder visibility·input packing·MLM corruption·task-head shape·retrieval interface를 기초 6개+심화 4개로 역검사하고 copy shortcut 반례를 보강; desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / Transformer architecture — token/position/mask 입력에서 source·visibility·attention·FFN·residual·LM head·scaling 경계까지 연결하고 position/FFN/label-shift/encoder-decoder 선택을 기초 6개+심화 4개로 역검사; desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / Supervised fine-tuning — demonstration·response-only NLL·teacher forcing·packing·독립 평가와 token/example reduction을 기초 6개+심화 4개로 역검사; 빠져 있던 ContentBoundary를 추가하고 5개 legacy figure를 공용 flat VizFrame으로 이관해 desktop/mobile Viz·수식 overflow 0 확인
- [x] AI / 활성화 함수 — ReLU 계열·smooth activation·gated FFN을 서로 다른 설계 축으로 구분하고, Leaky ReLU·ELU·SwiGLU의 수치 예와 parameter parity까지 기초 6개+심화 4개로 역검사
- [x] AI / 확률·기댓값·분산 — outcome/event에서 conditional probability·random variable·expectation·variance·LLN·mini-batch estimator까지 확장하고 독립/배반·분산 단위·표본 분산·완전상관 반례를 기초 6개+심화 4개로 역검사
- [x] AI / Claw Bash — pinned source의 실제 `sh -lc` 실행·first-token/path permission heuristic·16KiB truncation·unshare 상태를 hardening 목표와 분리하고, POSIX expansion·TOCTOU·process-group cleanup 경계를 기초 6개+심화 4개로 역검사
- [x] 공개 learning contract 390개 전부를 정확한 기초 6개+심화 4개로 통일하고 article-only 역검사·근거 anchor·graph invariant를 통과; 구계약 0개
- [x] 전역 `audit:learning --strict --require-registration --all-articles`: 공개 catalog 390/390 등록, 미등록 0개
- [x] Practical ML → LLM·Agent → Blockchain·Cryptography·P2P·HW/GPU·TEE·ISMS/AML 전체 catalog 이관 완료

- [x] `npm run audit:articles -- --strict --all-articles`로 공개 390개 실제 import closure의 material violation 0 확인
- [x] AI · Blockchain · Cryptography · P2P · HW/GPU · TEE · ISMS/AML 전체를 같은 learning·article·Viz 계약으로 감사
- [x] Public catalog route-resolution test 4/4와 772회 실제 navigation으로 sidebar/public route·canonical source closure 확인

### AI / Qwen3.6-27B hybrid architecture

- [x] 공식 model card·config에서 Qwen3.8이 아니라 Qwen3.6-27B임을 고정하고 64층을 48 Gated DeltaNet + 16 Gated Attention으로 분해
- [x] Attention·GQA·KV cache와 DeltaNet·delta rule·fast-weight state를 용어 하나씩 정의하고 작은 state Viz 뒤에 hybrid schedule로 조합
- [x] BF16 attention KV의 token당 64 KiB와 32K·128K·262K logical cache, FP32 recurrent core state의 request당 약 144 MiB를 shape·dtype·allocator 경계와 함께 계산
- [x] Recurrent decode와 chunked prefill, partial multimodal RoPE·FFN·MTP·vision token budget을 serving 흐름으로 연결
- [x] 주요 수식에 연산 의도를 underbrace로 직접 표시하고 자동 재생·키보드 조작이 가능한 새 flat Viz로 cache 성장과 state update를 시각화
- [x] 기초 6개+심화 4개, official evidence·graph owner·article-only 역검사와 390px·1440px Playwright·build·전역 audit 완료
- [x] 공식 BF16 55.56 GB·mixed-FP8 30.87 GB checkpoint payload에서 48 GiB의 32K·128K·262K known floor를 계산하고, FP8 weights≠FP8 KV·workspace 미지수를 새 VRAM Viz와 기동 log receipt로 설명
# 2026-08-15 · CRUD 중 concept graph 유기적 확장 원칙

- Article create·split·merge·rename·delete 도중 새 학습 단위나 선수·조합 경계가 드러나면 같은 변경에서 graph node·edge·canonical owner를 추가하고, 확장된 그래프로 route 경계를 다시 판단하도록 정본 계약을 보강했다.
- 현재 article 수와 최초 분할안을 고정값으로 취급하지 않는다. Graph가 새 독립 수업을 드러내면 route를 더 만들고, 중복 owner를 드러내면 병합·redirect 대상으로 되돌린다.
- 첫 적용에서 `ai/qwen36-hybrid-architecture` 하나를 architecture memory mechanism, request-state runtime, long-context deployment의 세 수업으로 분리했다. 범용 weight·dtype·GB/GiB·VRAM 계산은 `ai/model-vram-budgeting` 정본을 재사용한다.
- 2-route 중간안의 runtime이 다시 두 학습 arc를 가진다는 topology finding을 받자 `ai/qwen36-long-context-deployment`를 추가 생성했다. 이 과정에서 `qwen36-prefix-state-transaction`, `qwen36-context-support-boundary`를 graph에 새로 소유시키고 7개 관계를 연결했으며, 세 route 모두 topology keep 상태가 됐다.
- 공개 route·exact learning contract는 408개, graph는 2,322 concepts·3,430 relations·invariant 0이다. 세 route의 수식 7개는 전부 explicit operation annotation이며 390px·1440px에서 document/Viz/KaTeX overflow 0, console warning/error 0을 확인했다.
- Hybrid schedule·request lifecycle·context envelope Viz는 전체 map을 유지하면서 현재 장면을 확대하고, `ArrowLeft`·`ArrowRight`·`Space` 키와 자동 재생이 실제 동작하도록 검증했다. 전역 formula backlog 1,008개/688 legacy files와 topology split-review 86개는 다음 CRUD 반복에서 계속 줄인다.

## 2026-08-15 · CUDA optimization CRUD split

- 기존 `gpu/cuda-perf-analysis` 한 글에 섞여 있던 측정 경계, register pressure, kernel fusion, persistent kernel을 각각 독립적으로 정의→형태→예시→경계까지 닫히는 네 수업으로 분리했다.
- 분리 중 기존 graph만으로 설명되지 않던 register residency·spill path·resource release, fusion ROI, persistent worker·queue progress·shutdown drain·release gate 8개를 canonical concept로 추가하고 18개 관계를 연결했다. 기존 live-range·fusion·persistent owner도 새 정본 route로 이동했다.
- 공개 route와 exact learning contract는 408개에서 411개, graph는 2,330 concepts·3,448 relations로 늘었고 invariant failure·stage warning은 0이다. 네 route 모두 topology `keep`이며 전체 split-review는 86개에서 85개로 줄었다.
- 수식 7개는 전부 KaTeX 본문 안에 연산 의도를 붙이는 explicit operation annotation으로 작성했다. 측정 경계, live range와 resident warp, small fusion과 Megakernel, persistent work queue는 텍스트 카드가 아니라 도형·timeline·resource map으로 시각화했다.
- 모든 interactive Viz에서 `ArrowLeft`·`ArrowRight`를 지원하고 장면형 Viz는 `Space` 자동 재생을 지원한다. 390px·1440px 실제 브라우저에서 document/Viz/KaTeX overflow 0, console warning/error 0, gradient·shadow·굵은 선 0을 확인했다.
- 전역 formula backlog는 1,006개/687 legacy files다. 다음 CRUD 반복에서도 topology 후보를 읽는 동시에 formula operation annotation과 concept graph를 함께 확장한다.

## 2026-08-15 · Prompt engineering CRUD split

- 기존 `ai/prompt-engineering` 한 글에 함께 있던 request contract·회귀 평가, reasoning path·self-consistency, few-shot demonstration, structured-output validation을 각각 독립적으로 정의→형태→작은 예→실패 경계까지 닫히는 네 수업으로 분리했다.
- 분리하면서 기존 graph에 없던 `prompt-reasoning-verifier-boundary`, `few-shot-context-budget-boundary`, `prompt-output-validation-ladder`, `prompt-output-path-selection`, `prompt-output-bounded-repair` 다섯 canonical concept를 추가하고 10개 관계를 연결했다. 즉 route CRUD가 graph를 확장하고, 확장된 graph의 독립 학습 arc가 다시 네 route 경계를 검증하는 양방향 절차를 적용했다.
- 공개 route와 exact learning contract는 411개에서 414개, graph는 2,335 concepts·3,458 relations로 늘었고 invariant failure·stage warning은 0이다. 네 route 모두 topology `keep`이며 전체 split-review는 85개에서 84개로 줄었다.
- Request envelope·regression canary·reasoning branches와 verifier·few-shot context budget·parse/schema/domain/fallback을 텍스트 카드가 아니라 도형과 연결선이 있는 새 flat Viz 5개로 교체했다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 지원한다.
- Self-consistency 집계와 structured-output 운영 지표 수식 2개는 합·선택·분모·quantile·repair cost의 의도를 KaTeX 식 안 underbrace로 직접 표시하고, 별도 operation 설명도 같은 순서로 연결했다.
- 390px·1440px 실제 브라우저에서 네 route의 document/Viz/KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 전역 formula backlog는 1,004개/685 legacy files로 줄었으며 다음 CRUD 후보에서도 concept graph 확장과 수식 주석 이관을 함께 수행한다.

## 2026-08-15 · Recurrent learning CRUD split

- 기존 `ai/rnn`과 `ai/lstm` 두 글에 섞여 있던 hidden-state recurrence·language-model objective·BPTT, LSTM dual state·GRU interpolation을 `ai/rnn`, `ai/rnn-language-model`, `ai/bptt`, `ai/lstm`, `ai/gru`의 다섯 독립 수업으로 분리했다.
- 분리 과정에서 `recurrent-directionality-boundary`, `rnn-shifted-token-pair`, `gru-reset-filtered-candidate`, `gru-update-interpolation` 네 canonical concept를 추가하고 10개 관계를 연결했다. 기존 BPTT·truncation·GRU owner도 실제 설명 route로 이동해 route와 graph의 소유권을 일치시켰다.
- 공개 route와 exact learning contract는 414개에서 417개, graph는 2,339 concepts·3,468 relations로 늘었고 invariant failure·stage warning은 0이다. 새 다섯 route는 모두 topology `keep`이며 전체 split-review는 84개에서 83개로 줄었다.
- Hidden-state unrolling·shifted language objective·backward credit와 detach 경계·LSTM cell lane·GRU reset/update 보간을 도형·화살표·bar·timeline으로 표현하는 새 responsive Viz 5개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 실제로 지원한다.
- 다섯 글의 수식 13개를 전부 explicit operation annotation으로 이관했다. 특히 GRU update·gradient clipping·Jacobian product·forget retention·parameter/state byte 식에서 곱·합·나눗셈을 하는 이유를 KaTeX 식 안의 다단 underbrace로 직접 설명한다.
- 390px·1440px 실제 브라우저 10회에서 document/Viz/KaTeX overflow, clipped descendant, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 전역 formula backlog는 992개/678 legacy files로 줄었다.

## 2026-08-15 · Backpropagation learning CRUD split

- 기존 `ai/backprop-optimization` 한 글에서 computational graph·autodiff tape·VJP, softmax normalization·temperature, neural-network tensor backward를 각각 `ai/reverse-mode-autodiff`, `ai/softmax`, `ai/backprop-optimization` 세 수업으로 분리했다. Cross-entropy·optimizer·regularization 중복 section은 실제 public closure에서 제거하고 기존 정본 글로 연결했다.
- 분리 중 `autodiff-save-recompute-boundary`, `softmax-max-shift-invariance`, `softmax-temperature-scaling`, `softmax-categorical-output-boundary` 네 canonical concept가 독립 학습 단위임을 확인해 graph에 추가하고 9개 신규 관계를 연결했다. 기존 computational graph·tape·reverse mode·VJP·fan-out owner도 실제 설명 route로 이동했다.
- 공개 route와 exact learning contract는 417개에서 419개, graph는 2,343 concepts·3,477 relations로 늘었고 invariant failure·stage warning은 0이다. 세 route 모두 topology `keep`이며 전체 split-review는 83개에서 82개로 줄었다.
- Value node·operation arrow·save/recompute memory 경계, logits→shared denominator→probability bars, scalar loss→p−y→dW/db/dX를 보여 주는 새 graphical Viz 3개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 지원한다.
- 실제 public closure의 수식 6개를 모두 explicit operation annotation으로 이관했다. 긴 underbrace를 의미 단위별 KaTeX 행으로 분해해 390px에서 모든 main·operation 수식이 각각 316/316·290/290에 맞고, 전역 formula backlog는 984개/671 legacy files로 줄었다.
- 390px·1440px 실제 브라우저 6회에서 document·Viz·KaTeX overflow, clipped descendant, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했고 production build를 통과했다.

## 2026-08-15 · Deep-learning foundations CRUD split

- 기존 `ai/deep-learning-overview`가 representation·depth, supervised training loop, train·validation·test, GPU 병목까지 한꺼번에 소유하던 구조를 재검토했다. 기존 route는 representation·depth로 좁히고 `ai/supervised-learning-loop`, `ai/train-validation-test`를 새로 생성했으며 GPU 병목 owner는 기존 정본 `gpu/cuda-perf-analysis`로 이동했다.
- CRUD 중 graph에 없던 `representation-objective-bias`, `depth-optimization-boundary`, `validation-selection-feedback`, `test-set-reuse-contamination` 네 canonical concept를 추가하고 8개 관계를 연결했다. Cross-validation은 새 split 기초를 재사용하고, CUDA profiler loop는 compute·memory bottleneck 정의를 선수개념으로 재사용한다.
- 공개 route와 exact learning contract는 419개에서 421개, graph는 2,347 concepts·3,485 relations로 늘었고 owner·isolation·stage invariant는 0이다. 세 route는 각각 정확한 기초 6개+심화 4개와 article-only answer 위치를 가진다.
- Pixel→edge→part→class representation map, example pair→shared model→update loop, dataset bar→train·validation·test→reuse contamination을 텍스트 storyboard가 아닌 도형·화살표·bar의 새 Viz로 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 지원한다.
- 세 public 수식은 함수 합성, batch 평균·gradient update, observed generalization gap의 각 변환·합·나눗셈·뺄셈 의도를 KaTeX underbrace로 식 안에 직접 표시한다. 390px·1440px에서 document·Viz·visible KaTeX container overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다.

## 2026-08-15 · Function · derivative · Jacobian CRUD split

- 기존 `ai/math-functions-derivatives-gradients` 한 글에 함께 있던 function mapping·composition, derivative·local linearity·chain rule, gradient·directional derivative·Jacobian을 세 독립 수업으로 분리했다. 기존 route는 derivative 수업으로 좁히고 `ai/math-functions-composition`, `ai/math-gradients-jacobians`를 새로 생성했다.
- 분리 중 기존 graph에 없던 `function-domain-codomain`, `difference-quotient`, `jacobian-vector-product` 세 canonical concept를 추가하고 7개 관계를 연결했다. 기존 function·composition·limit·derivative·chain rule·gradient·Jacobian owner도 실제 설명 route로 이동해 CRUD와 graph ownership을 함께 갱신했다.
- 공개 route와 exact learning contract는 421개에서 423개, graph는 2,350 concepts·3,492 relations로 늘었고 owner·isolation·stage invariant는 0이다. 세 route는 topology `keep`, 각각 정확한 기초 6개+심화 4개와 article-only answer 위치를 가진다.
- Domain→intermediate→codomain 합성, secant→tangent 수렴, inner·outer rate 전달, contour→gradient→Jacobian shape를 도형·곡선·화살표·matrix map으로 표현하는 새 Viz 4개를 만들었다. 모든 장면형 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 지원한다.
- 실제 public closure의 수식 8개를 전부 explicit operation annotation으로 이관했다. Difference quotient의 빼기·나눗셈, chain rule의 local rate 곱, directional derivative의 projection·coordinate contribution, Jacobian의 input→output linear map 의도를 KaTeX 식 안에 직접 표시했고 전역 formula backlog는 983개에서 976개로 줄었다.
- 390px·1440px 실제 브라우저 6회에서 document·Viz·KaTeX overflow와 KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. Function Viz의 `→` 이동과 `Space` 자동 재생도 실제 focus 상태에서 검증했다.

## 2026-08-15 · Optimization problem · geometry · convergence CRUD split

- 기존 `ai/math-optimization-convexity` 한 글에 섞여 있던 objective·constraint·minimizer, convexity·smoothness·curvature, gradient descent·step size·convergence·stopping을 세 독립 수업으로 나눴다. 기존 route는 함수 구조로 좁히고 `ai/math-optimization-objectives`, `ai/math-gradient-descent-convergence`를 새로 생성했다.
- CRUD 과정에서 `optimization-feasible-set`, `descent-lemma`, `optimization-stopping-signal` 세 canonical concept를 새로 만들고 9개 관계를 연결했다. Objective→feasible set→minimizer, smoothness→descent lemma→safe step·convergence, stationary point→operational stop의 소유권을 실제 설명 route와 일치시켰다.
- 공개 route와 exact learning contract는 423개에서 425개, graph는 2,353 concepts·3,501 relations로 늘었고 owner·isolation·stage invariant는 0이다. 세 route는 모두 topology `keep`이며 각각 정확한 기초 6개+심화 4개와 article-only answer 위치를 가진다.
- Objective curve와 feasible interval·두 minimizer, chord·tangent·curvature range, learning-rate별 iteration path와 stopping boundary를 곡선·점·범위·궤적으로 표현하는 새 animated Viz 3개를 만들었다. `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- 실제 public closure의 수식 9개를 모두 explicit operation annotation으로 작성했다. Argmin과 minimum의 선택·재평가, projection, chord gap, descent lemma의 linear prediction·quadratic allowance, condition number, update·contraction·gap bound·stopping signal의 연산 의도를 KaTeX 식 안에 직접 표시해 전역 formula backlog를 976개에서 971개로 줄였다.
- 390px·1440px 실제 브라우저 6회에서 document·Viz·formula·KaTeX overflow와 clipped descendant, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 전체 425개 learning·reading·graph 감사, route-resolution test, TypeScript와 production build도 통과했다.

## 2026-08-15 · Probability · expectation · sampling CRUD split

- 기존 `ai/math-probability-expectation-variance` 한 글에 섞여 있던 experiment·event·conditioning, random-variable mapping·expectation, variance·finite-sample estimator·mini-batch noise를 세 독립 수업으로 분리했다. 기존 route는 경우와 조건부확률로 좁히고 `ai/math-random-variables-expectation`, `ai/math-variance-sampling`을 새로 생성했다.
- CRUD 과정에서 `probability-independence`, `expectation-linearity`, `standard-deviation`, `sample-variance-estimator` 네 canonical concept를 추가하고 8개 관계를 연결했다. Random variable·expectation·variance·sample mean·LLN·stochastic-gradient owner를 실제 설명 route로 이동하고, 다른 글의 재사용 링크도 새 정본 경계에 맞춰 분리했다.
- 공개 route와 exact learning contract는 425개에서 427개, graph는 2,357 concepts·3,509 relations로 늘었고 owner·isolation·stage invariant는 0이다. 세 route는 모두 topology `keep`이며 각각 정확한 기초 6개+심화 4개와 article-only answer 위치를 가진다.
- Coin-outcome tree→event→conditioning→chain rule, outcome→numeric value→induced mass→expectation, center→squared deviation→sample mean→1/B noise→gradient estimator를 도형·선·분포·bar로 표현하는 새 animated Viz 3개를 만들었다. 모든 Viz에서 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태로 검증했다.
- 실제 public closure의 수식 14개를 모두 explicit operation annotation으로 작성했다. Intersection 선택·conditional renormalization·chain product, value-mass 합산·weighted center·linearity, squared deviation·n−1 correction·1/B·Chebyshev·mini-batch expectation의 각 연산 의도를 KaTeX 식 안에 직접 표시하고 모바일 다단식으로 정리해 전역 backlog를 971개에서 959개로 줄였다.
- 390px·1440px 실제 브라우저 6회에서 document·Viz·모든 main/operation KaTeX overflow와 clipped descendant, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 전체 427개 learning·reading·graph 감사, route-resolution test, TypeScript와 production build도 통과했다.

## 2026-08-15 · GAN distribution · dynamics · critic · evaluation CRUD split

- 기존 `ai/gan` 한 글에 섞여 있던 implicit generator와 discriminator signal, two-player training dynamics, Wasserstein critic constraint, conditional generation과 evaluation을 네 독립 수업으로 분리했다. 기존 route는 분포 게임의 출발점으로 좁히고 `ai/gan-training-dynamics`, `ai/gan-wasserstein-critics`, `ai/gan-conditional-evaluation`을 새로 생성했다.
- 기존 canonical concept 12개의 owner를 실제 설명 route로 이동했다. Graph를 route 목록의 사후 장부로 두지 않고 `implicit distribution → adversarial signal → alternating game → function constraint → conditional evaluation` 흐름을 다시 읽어, condition별 metric 관계와 optimizer convergence·critic smoothness의 경계를 설명하는 관계 3개를 추가했다.
- 공개 route와 exact learning contract는 427개에서 430개, graph relation은 3,509개에서 3,512개로 늘었고 2,357 concepts의 owner·isolation·stage invariant는 0이다. 네 route는 각각 exact 기초 6개+심화 4개와 article-only answer 위치를 가지며 topology에서 모두 `keep`이다. 전체 split-review는 78개에서 77개로 줄었다.
- Latent→generator→real/fake comparison, D/G alternating update와 mode coverage, point-mass→Lipschitz critic→GP/SN, condition→feature cloud→quality/coverage를 새 animated graphical Viz 4개로 만들었다. 모바일은 넓은 SVG를 축소하지 않고 같은 장면을 세로 도형 흐름으로 재배치했으며, 별도의 concept composition map도 route마다 연결했다.
- 실제 public closure의 수식 12개를 모두 explicit operation annotation으로 작성했다. Density-ratio의 분모, non-saturating negative log, VJP pullback, bilinear game update, Wasserstein supremum, GP square penalty, spectral rescale, conditional pairing, FID mean·covariance, generative precision·recall의 연산 의도를 KaTeX 식 안에 직접 표시해 전역 backlog를 959개에서 950개로 줄였다.
- 390px·1440px 실제 브라우저 8회에서 document·Viz·ExplainedFormula·모든 main/operation KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 네 animated Viz 모두 `ArrowRight` 장면 이동과 `Space` 자동 재생을 실제 focus 상태에서 검증했고, 전체 learning·reading·graph·article·Viz 감사와 TypeScript·production build를 통과했다.

## 2026-08-15 · Diffusion discrete · continuous · latent CRUD split

- 기존 `ai/diffusion-models` 한 글에 섞여 있던 Gaussian training pair·prediction target·score, reverse SDE·probability-flow ODE·flow matching·solver, latent bottleneck·CFG·release evaluation을 세 독립 수업으로 분리했다. 기존 route는 discrete diffusion 기초로 좁히고 `ai/diffusion-continuous-time`, `ai/latent-diffusion-guidance`를 새로 생성했다.
- CRUD 중 본문에는 있었지만 graph에 없던 `diffusion-training-sampling-contract`, `learned-field-solver-contract`, `latent-diffusion-component-contract`, `conditional-diffusion-release-gate` 네 canonical concept를 추가했다. 기존 owner 11개를 실제 설명 route와 section으로 이동하고 총 12개 관계를 더해, graph가 세 학습 arc의 경계를 다시 검증하도록 했다.
- 공개 route와 exact learning contract는 430개에서 432개, graph는 2,361 concepts·3,524 relations로 늘었고 owner·isolation·stage invariant는 0이다. 세 route는 모두 topology `keep`이며 전체 split-review는 77개에서 76개로 줄었다.
- Training pair와 iterative sampling, random reverse path와 deterministic flow path, pixel→latent→guided denoiser→decoder pipeline을 도형·cloud·연결선·receipt ledger로 표현하는 새 animated Viz 3개와 concept composition map 3개를 연결했다. 모든 장면형 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 지원한다.
- 실제 public closure의 수식 12개를 모두 explicit operation annotation으로 작성했다. Signal/noise variance 합성, cumulative schedule, score correction, same-marginal ODE, flow velocity, solver error·NFE, latent compression·scale, CFG incremental direction, multi-axis release AND의 연산 의도를 KaTeX 식 안에 직접 표시해 전역 backlog를 950개에서 943개로 줄였다.
- 390px·1440px 실제 브라우저 6회에서 document·Viz·formula·모든 main/operation KaTeX overflow, uncontained descendant, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 세 animated Viz 모두 `ArrowRight` 장면 이동과 `Space` 자동 재생을 검증했고 전체 learning·reading·graph·article·Viz 감사와 route-resolution test·TypeScript를 통과했다.

## 2026-08-15 · Kimi K3 sequence · depth · width CRUD split

- 기존 `ai/kimi-k3-architecture` 한 글에 섞여 있던 KDA–MLA sequence memory, Attention Residuals depth routing, Stable LatentMoE width·activation·load를 네 독립 수업으로 분리했다. 기존 route는 전체 축 지도와 configuration·evidence 경계로 좁히고 `ai/kimi-k3-sequence-mixer`, `ai/kimi-k3-depth-routing`, `ai/kimi-k3-latent-moe`를 새로 생성했다. 사용되지 않는 legacy section 5개와 legacy Viz/data 10개는 삭제했다.
- CRUD 과정에서 세 축의 관계 자체가 독립 정본임을 확인해 `kimi-k3-axis-factorization` canonical concept를 추가하고 4개 관계를 연결했다. 기존 KDA 5개·AttnRes 2개·LatentMoE 3개 concept owner도 실제 설명 route로 이동했다. 공개 route와 exact contract는 432개에서 435개, graph는 2,362 concepts·3,528 relations로 늘었고 invariant·stage warning은 0이다.
- Token stream에 sequence→depth→width를 한 축씩 붙이는 전체 Viz, retain→delta correction→read→MLA를 보여 주는 state Viz, depth source와 pseudo-query 가중합 Viz, 7,168→3,584→expert→7,168 width Viz를 새 flat animated 도형으로 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 지원하며 네 route topology는 모두 `keep`이다. 전체 split-review는 76개에서 75개로 줄었다.
- 실제 public closure의 수식 8개를 explicit operation annotation으로 다시 썼다. KDA의 `v−Sk`가 중복 누적 대신 예측 오차만 고치는 이유, decay의 clip→exp→product, depth softmax·weighted sum, ceiling과 source-state 차수, latent projection·SiTU soft cap·quantile bias의 연산 의도를 KaTeX 식 안 underbrace로 직접 표시해 전역 backlog를 943개에서 933개로 줄였다.
- 390px·1440px 실제 브라우저 8회에서 document·Viz·main/operation KaTeX overflow, uncontained descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. Sequence Viz의 `기억 유지→오차 수정→현재 읽기` 화살표 이동과 자동 재생도 실제 focus 상태에서 검증했고, 전체 435개 learning·reading·graph·article·Viz·formula 감사와 route-resolution test·TypeScript를 통과했다.

## 2026-08-15 · Gradient Boosting family CRUD split

- 기존 `ai/gradient-boosting` 한 글에 섞여 있던 piecewise tree·functional gradient·shrinkage, XGBoost second-order objective·histogram, LightGBM GOSS·EFB·leaf-wise growth, CatBoost ordered learning·symmetric tree를 네 독립 수업으로 분리했다. 기존 route는 boosting 함수의 공통 기초와 공정 비교 경계로 좁히고 `ai/xgboost-tree-objective`, `ai/lightgbm-efficient-trees`, `ai/catboost-ordered-learning`을 새로 생성했다. 사용되지 않는 legacy section 6개와 legacy Viz 5개는 삭제했다.
- 기존 11개 canonical concept의 연결 component가 이미 네 학습 arc를 충분히 드러냈으므로 인위적인 node를 추가하지 않았다. 대신 route 내부에 빠져 있던 GOSS row 축→EFB column 축→leaf growth budget과 ordered gradient→symmetric function family 관계 3개를 보강해 graph가 progressive 본문 순서를 다시 검증하게 했다.
- 공개 route와 exact learning contract는 435개에서 438개, graph relation은 3,528개에서 3,531개로 늘었고 2,362 concepts의 owner·isolation·stage invariant는 0이다. 네 route는 모두 topology `keep`이며 전체 split-review는 75개에서 74개로 줄었다.
- Leaf region→negative gradient→additive ensemble, G·H row→histogram→split gain, row·column·leaf의 서로 다른 비용 축, permutation prefix→gradient→symmetric tree를 새 flat animated 도형 Viz 4개로 만들었다. 모바일에서는 연결 화살표를 세로 방향으로 전환하고 모든 Viz가 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 지원한다.
- 실제 public closure의 수식 6개를 전부 explicit operation annotation으로 작성했다. Indicator activation, loss derivative 반전, shrinkage, leaf curvature normalization, child-parent split comparison, GOSS sampling 보정, prefix exclusion·prediction·loss slope의 각 의도를 KaTeX 식 안에 직접 표시해 전역 backlog를 933개에서 928개로 줄였다.
- 390px·1440px 실제 브라우저 8회에서 document·Viz·formula·main/operation KaTeX overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. CatBoost 식은 prefix 생성→현재 row prediction→loss slope→부호 반전의 다단식으로 교정했고, 장면 0→1과 재생 false→true의 키보드 상태 전이도 검증했다.

## 2026-08-15 · Code Mode pattern · runtime contracts CRUD split

- 기존 `ai/agent-code-mode`의 10개 concept를 graph component와 failure owner로 다시 읽었다. Tool 왕복→program IR→선택 schema→local reduction→token cost→실행 방식 선택은 기존 route에 남기고, runtime control→capability→result disclosure→partial external effect는 새 `ai/code-mode-runtime-contracts`로 분리했다.
- 기존 concept 4개의 canonical owner를 새 route로 이동하고, graph에 없던 `deterministic runtime control → capability binding → result contract` 내부 관계 2개를 보강했다. 공개 route와 exact learning contract는 438개에서 439개, relation은 3,531개에서 3,533개가 됐으며 2,362 concepts의 owner·isolation·stage invariant는 0이다.
- 반복 model→tool→result 왕복과 sandbox program·local row reduction·bounded result, program control flow와 capability gate·result receipt·다섯 write의 partial outcome을 새 flat animated 도형 Viz 2개로 표현했다. Legacy section 5개와 data/Viz 4개를 actual closure에서 삭제했고 두 route 모두 topology `keep`이 되어 전체 split-review는 74개에서 73개로 줄었다.
- Cost formula는 round 한 번→round 합→program 고정비→bounded result→선택 순서로, result formula는 project→redact→row gate→byte gate→receipt 순서로, retry formula는 committed→unknown→blocked→retry 순서로 나눠 모든 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 formula backlog는 928개에서 927개로 줄었다.
- 390px·1440px 실제 브라우저 4회에서 document·Viz·main/operation KaTeX overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. Runtime Viz의 장면 0→1과 Space 재생 false→true 전이도 실제 focus 상태에서 검증했다.

## 2026-08-15 · Container · runtime · GPU · deployment sandbox CRUD split

- 기존 `ai/agent-sandbox-security` 한 글에 섞여 있던 process·namespace·cgroup·attack path, seccomp·gVisor·Kata runtime, GPU device path, Kubernetes identity·egress·storage를 네 독립 수업으로 분리했다. 기존 route는 container 보안 기초로 좁히고 `ai/sandbox-runtime-isolation`, `ai/sandbox-gpu-isolation`, `ai/sandbox-deployment-controls`를 새로 생성했으며 legacy section 7개와 legacy Viz 2개를 actual closure에서 삭제했다.
- CRUD 과정에서 기존 graph가 한 node에 숨기던 namespace/cgroup, syscall/application kernel/guest kernel, ioctl proxy/VFIO, ServiceAccount token/RBAC을 각각 독립 canonical concept로 올렸다. 신규 concept 9개와 relation 11개를 추가하고 기존 10개 owner를 실제 설명 route로 이동해 공개 route·exact contract는 439→442개, graph는 2,362→2,371 concepts·3,533→3,544 relations가 되었으며 invariant·stage warning은 0이다.
- Host process 위 namespace view·cgroup meter·attack path, syscall 처리 위치가 seccomp→Sentry→guest kernel로 바뀌는 경로, nvproxy와 VFIO/IOMMU의 두 GPU path, Pod를 identity·egress·storage·release gate로 감싸는 구조를 새 flat animated 도형 Viz 4개로 표현했다. 모든 Viz에서 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태로 검증했다.
- Headroom·attack-path AND·runtime acceptance·GPU generation·RBAC authorization의 수식 5개를 모두 domain-specific `annotatedFormula`와 explicit operation으로 작성했다. 390px에서 긴 attack-path·RBAC 주석을 의미 단위 다단식으로 교정해 모든 main/operation KaTeX가 각각 316/316·290/290에 맞았다.
- 5단계 이상 `ConceptLadderViz`가 desktop grid row 끝에서 11px 넘치던 공통 문제를 단일 `grid-flow-col` composition으로 교정했다. 390px·1440px 실제 브라우저 8회에서 document·모든 Viz canvas·formula overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0이며 8 screenshots를 육안 검수했다. 전체 learning·reading·graph·article·Viz·formula 감사와 route test·TypeScript를 통과했다.

## 2026-08-15 · Development records · Changelog · ADR · Lessons CRUD split

- 기존 `ai/agent-devlog-patterns` 한 글에 섞여 있던 raw evidence·claim, Changelog, ADR, Lessons를 네 독립 학습 arc로 분리했다. 기존 route는 `Evidence → 질문별 정본 → 조건부 승격 → Agent review` 허브로 좁히고 `ai/agent-changelog-evidence`, `ai/architecture-decision-records`, `ai/engineering-lessons-ledger`를 새로 생성했다. 사용되지 않는 legacy section 5개와 텍스트 카드형 Viz 6개는 삭제했다.
- CRUD 과정에서 graph를 사후 목록이 아니라 경계 설계 도구로 사용했다. 기존 Changelog·ADR·Lesson owner를 실제 설명 route로 이동하고 `notability·audience`, `verification·publication`, `stable evidence link`, `decision-driver comparability`, `accepted·implemented separation`, `supersession history`, `scope·exception·test`, `provisional lesson threshold` 여덟 canonical concept와 12개 관계를 추가했다.
- 공개 route·exact learning contract는 442→445개, graph는 2,371→2,379 concepts·3,544→3,556 relations로 늘었고 owner·canonical path·isolation·stage invariant는 0이다. 네 route는 각각 기초 6개+심화 4개와 article-only answer 위치를 가지며 topology `keep`이고 전체 split-review는 72→71개로 줄었다.
- Evidence→Change→Decision→Rule, Audience→Verify→Publish→Trace, Context→Options→Decision→History, Observe→Narrow→Test→Maintain을 flat 도형 pipeline으로 보여 주는 새 animated Viz 4개를 만들었다. 모바일은 세로 흐름, desktop은 가로 흐름으로 재배치하며 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- 이 배치에는 계산 수식이 없어 설명과 무관한 식을 인위적으로 추가하지 않았다. 전역 formula 감사는 1,082개 중 explicit operation annotation 156개, 대기 926개·636 files 상태로 그대로 통과했다.
- 390px·1440px 실제 브라우저 8회에서 document·모든 Viz·descendant overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인하고 8 screenshots를 육안 검수했다. 전체 445개 learning·reading·graph·article·Viz·formula·term·topology 감사, route-resolution test, TypeScript와 production build를 통과했다.

## 2026-08-15 · RNN · language-model graph-guided CRUD correction

- `ai/rnn-language-model`의 기존 topology `merge-review`를 보고 처음에는 `ai/rnn`으로 병합했지만, 합친 결과가 7 concept·7 stage의 `split-review`가 되는 것을 즉시 확인했다. 병합을 유지하지 않고 두 route를 각각 완결된 4-stage 수업으로 되돌렸다. CRUD 결정을 고정 route 수나 첫 heuristic에 맞추지 않고 graph→route→graph로 재검증한 사례다.
- LM 본문에는 이미 hidden state에서 vocabulary score를 만드는 계산이 있었지만 graph에는 독립 이름이 없었다. 이를 `vocabulary-logit-head` canonical concept로 승격하고 lossy state·shifted target·softmax·RNN-LM에 4개 관계로 연결했다. Graph는 2,380 concepts·3,560 relations가 되었고 445 public routes·exact contracts의 owner·isolation·stage invariant는 0이다.
- 두 route는 topology `keep`이 되었고 전역 summary는 keep 372·rename-or-split-review 2·split-review 71이다. RNN은 state transition→lossy state→unroll→direction, RNN-LM은 shifted pair→vocabulary logit head→probability→NLL/PPL을 각각 소유한다.
- 기존 텍스트 카드 중심 Viz를 현재 input·이전 state 원, 공유 transition 마름모, time rail, causal/bidirectional arrow, shifted token rail, state 육각형, vocabulary probability bar, loss 원형 pipeline으로 다시 그렸다. Active 장면에는 pulse animation을 넣고 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- 두 route의 기존 수식 5개는 모두 operation별 `annotatedFormula`·`operations` 계약을 유지한다. 390px·1440px 실제 브라우저 4회에서 document·Viz·모든 descendant·formula overflow, console warning/error, gradient·shadow·굵은 선이 모두 0이며 두 route의 정적 learning·graph·article·Viz·term·route·TypeScript 검사를 통과했다.

## 2026-08-15 · KV fundamentals · hybrid allocation · serving capacity CRUD split

- 기존 `ai/hybrid-attention-serving` 한 글의 graph를 다시 읽어 `Q·K·V와 MHA/GQA/MQA의 token byte`, `local/global retention과 physical block allocation`, `weight·KV pool·runtime log와 admission`의 세 독립 질문을 확인했다. 기존 공개 route를 삭제하고 `ai/kv-cache-fundamentals`, `ai/hybrid-kv-cache-allocation`, `ai/llm-serving-capacity` 세 route로 생성·분리했다.
- 이 배치에서는 graph에 이미 존재하던 여덟 canonical concept가 세 connected learning arc를 정확히 드러냈으므로 인위적인 node를 추가하지 않았다. 대신 각 owner href·stage·evidence를 실제 설명 route로 이동했다. 공개 route·exact contract는 445→447개가 되었고 graph는 2,380 concepts·3,560 relations, owner·isolation·stage invariant 0을 유지한다.
- Fundamentals에는 현재 Q/K/V 원, 과거 K/V cell, lookup·append arrow를 갖는 전용 animated Viz를 새로 만들었다. `ArrowLeft`·`ArrowRight`로 `현재 token→과거 cache→조회→append`를 이동하고 `Space`로 자동 재생한다. Hybrid allocation과 capacity 글은 layer pattern·retention curve·runtime log 비교를 별도 도형 Viz로 연결한다.
- 세 public closure의 수식 5개를 모두 explicit operation annotation으로 이관했다. Q와 K/V의 서로 다른 head 축, K/V tensor 수와 dtype byte의 곱, layer별 visibility와 저장 byte의 합, KV pool/token byte·request length의 연속 나눗셈 의도를 KaTeX 식 안의 underbrace와 의미 단위 다단식으로 직접 표시했다. 전역 formula backlog는 926→921개로 줄었다.
- 390px·1440px 실제 브라우저 6회에서 document·custom Viz·모든 visible KaTeX overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 키보드 선택은 `현재 token→과거 cache`, Space는 `흐름 재생→일시정지`로 실제 상태 전이가 일어났고 focused Viz·formula 및 full-page screenshots를 육안 검수했다.

## 2026-08-15 · Agent loop · plan · delegation · extension CRUD split

- 기존 `ai/agentic-patterns` 한 글의 9개 concept를 graph 연결 arc로 다시 읽어 `state·action·observation·exit`, `plan·replanning·reflection`, `delegation·manager/handoff`, `hook·skill·guardrail·verifier`의 네 독립 수업으로 분리했다. 기존 공개 route와 legacy section 5개·텍스트 카드형 Viz 10개를 삭제하고 `ai/agent-loop-foundations`, `ai/agent-plan-replanning`, `ai/agent-delegation-contracts`, `ai/agent-extension-boundaries`를 생성했다.
- 기존 canonical concept가 이미 네 arc를 정확히 표현하므로 새 node를 인위적으로 추가하지 않았다. 아홉 owner href·stage·evidence와 모든 backlink를 실제 설명 route로 이동했다. 공개 route·exact contract는 447→450개, graph는 2,380 concepts·3,560 relations·invariant 0을 유지하며 네 route 모두 topology `keep`, 전체 split-review는 70→69개다.
- Observable state→proposal→runtime gate→typed observation, Task→artifact→downstream→replan, pinned input→delegate→receipt→state owner, Hook→Skill→Guardrail→Verifier를 서로 다른 도형·arrow·receipt 구조의 새 responsive Viz로 만들었다. 네 Viz 모두 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- Agent loop 수식은 proposal sampling→authorization→execution→state commit의 네 연산 의도를 KaTeX 식 안의 다단 underbrace로 직접 표시했다. 기존 raw 설명식을 explicit operation annotation으로 이관해 전역 대기 수식은 921→920개, source files는 633→632개가 됐다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·descendant·visible KaTeX overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. Desktop에서 회전 diamond와 마지막 document의 외접 폭이 6~20px 넘던 문제를 발견해 도형 크기·grid 배치를 교정하고 8 screenshots를 재촬영·육안 검수했다.

## 2026-08-15 · Autoencoder objective · theorem · corruption · anomaly CRUD split

- 기존 `ai/autoencoder`의 graph를 복원 계약, linear AE–PCA 정리, denoising·masking, anomaly calibration의 네 학습 arc로 다시 읽었다. 기존 route는 input·latent·reconstruction·identity failure 기초로 좁히고 `ai/linear-autoencoder-pca`, `ai/denoising-masked-autoencoders`, `ai/reconstruction-anomaly-detection` 세 route를 생성했다. Legacy section 7개와 legacy Viz 7개는 삭제했다.
- 기존 canonical concept 9개가 이미 네 arc와 별도 SAE 경계를 드러냈으므로 인위적인 node는 추가하지 않았다. 대신 8개 owner href를 실제 route로 이동하고, `sparse-autoencoder-penalty` owner는 이미 dictionary frontier·L1/Top-K·collapse를 깊게 설명하는 `ai/sparse-autoencoder`로 옮겼다. 공개 route·exact contract는 450→453개, graph는 2,380 concepts·3,560 relations·invariant 0을 유지한다.
- Input grid→latent bottleneck→reconstruction→validation, centered cloud→rank-k path→principal plane, clean grid→corruption mask→visible evidence→missing content, reconstruction→score gauge→threshold→drift를 도형·화살표·pulse로 보여 주는 새 animated Viz 4개를 만들었다. 네 Viz 모두 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- 실제 public closure의 수식 7개를 모두 explicit operation annotation으로 작성했다. 함수 합성·dimension 제한, residual→square→feature/batch 평균, rank-k 합성·argmin·SVD subspace, corruption sampling·clean target, visible set·masked loss, score→threshold→indicator의 연산 의도를 KaTeX 식 안에 직접 표시해 전역 backlog는 920→913개로 줄었다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·모든 main/operation KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 검수에서 Framer Motion circle radius 오류, desktop grid 23px overflow, 모바일 수식 5개 overflow와 anomaly KaTeX brace error를 발견해 의미 단위 다단식·고정 radius·명시 grid로 교정하고 screenshots를 재촬영·육안 검수했다. Topology는 `keep` 383·split-review 68로 개선됐다.

## 2026-08-15 · Regularization diagnosis · dropout · decay · stopping · smoothing CRUD split

- 기존 `ai/regularization-practice` 한 글에 섞여 있던 observed gap 진단, dropout activation noise, L2·AdamW parameter update, early-stopping trajectory selection, label-smoothing target distribution을 다섯 독립 학습 arc로 분리했다. 기존 route는 gap 원인 감사와 one-axis ablation 정본으로 좁히고 `ai/dropout-regularization`, `ai/weight-decay`, `ai/early-stopping`, `ai/label-smoothing` 네 route를 생성했으며 legacy section·표형 Viz 10개를 삭제했다.
- CRUD 과정에서 graph component가 이미 다섯 경계를 정확히 표현하고 있음을 확인해 인위적인 concept는 추가하지 않았다. 기존 canonical concept 11개의 owner·canonical href·stage·evidence를 실제 설명 route로 이동했다. 공개 route·exact learning contract는 453→457개, graph는 2,380 concepts·3,560 relations·invariant 0을 유지하고 topology는 `keep` 388·split-review 67이 됐다.
- Train/validation risk→gap→원인 감사→one-axis 비교, activation→Bernoulli mask→inverted scale→eval, penalty→SGD shrink→AdamW→parameter groups, validation event→best→counter→restore, one-hot→uniform→mixture→soft-target composition을 도형·bar·arrow·timeline으로 표현하는 새 animated Viz 5개를 만들었다. 760-unit desktop 좌표계를 모바일에서 축소하던 1차 구현은 육안검수에서 label이 작다고 판단해 360-unit responsive 좌표계와 max-width layout으로 다시 조정했다.
- 실제 public closure의 수식 11개를 모두 explicit operation annotation으로 작성했다. Gap subtraction, paired seed difference, mask multiplication과 1/q 평균 보정, L2 derivative·multiplicative shrink, adaptive task direction과 direct decay 분리, set union/intersection coverage, best/counter transition, stop index·argmin restore, uniform mass distribution, soft-target cross-entropy와 Mixup composition의 각 연산 의도를 KaTeX 식 안에 직접 표시했다. 모바일에서 넘친 6개 식은 의미 단위 다단식으로 교정해 전역 explicit annotation은 169→180개, backlog는 913→907개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 중복 SVG node key와 학습문항 checklist의 반복 값 key도 고유 index를 포함하도록 교정했다. 다섯 Viz의 `ArrowRight` 장면 이동과 `Space` 재생 전이를 실제 focus 상태에서 검증하고 full-page·focused screenshots를 육안 검수했다. 전체 learning·graph·reading·article·Viz·term·formula 감사, route-resolution test, TypeScript와 production build를 통과했다.

## 2026-08-15 · BERT visibility · input · MLM · objective · task-head CRUD split

- 기존 `ai/bert` 한 글에 섞여 있던 양방향 encoder visibility, input packing, MLM corruption, NSP·SOP·RTD 비교, downstream task head를 다섯 독립 학습 arc로 분리했다. 기존 route는 query가 양쪽 실제 key를 읽어 contextual state를 만드는 기초로 좁히고 `ai/bert-input-packing`, `ai/bert-mlm-corruption`, `ai/bert-pretraining-objectives`, `ai/bert-task-heads` 네 route를 생성했다. 사용되지 않는 legacy section 4개와 텍스트·표 중심 Viz 5개는 삭제했다.
- CRUD 과정에서 graph를 먼저 connected component로 읽었다. 기존 9개 canonical concept가 다섯 경계를 이미 정확히 표현했기 때문에 node 수를 늘리지는 않고 owner·canonical href·stage·evidence를 실제 설명 route로 이동했다. 공개 route·exact learning contract는 457→461개, graph는 2,380 concepts·3,560 relations·invariant 0을 유지하며 topology는 `keep` 393·split-review 66으로 개선됐다.
- Token→visibility gate→contextual state, special token→position→segment→padding, target selection→80·10·10 corruption→encode→restore, NSP→SOP→RTD→controlled comparison, sequence→token→span→retrieval을 박스·원·마름모·저장소·화살표로 표현하는 새 responsive animated Viz 5개를 만들었다. 모든 Viz에서 `ArrowLeft`·`ArrowRight` 장면 왕복과 `Space` 자동 재생을 실제 focus 상태로 확인했다.
- 실제 public closure의 수식 8개를 explicit operation annotation으로 작성했다. Visible-key 선택, query-key score, 허용 key softmax, contextual value 결합, embedding row 합성, target selection과 branch probability, selected-position NLL, pair BCE, RTD label·loss, sequence/token/span projection의 연산 의도를 KaTeX 식 안 underbrace로 직접 표시해 전역 explicit annotation은 180→188개, backlog는 907→903개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·HTML box·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. Full-page·focused Viz·formula screenshots를 육안 검수했고 다섯 글의 정확한 기초 6+심화 4, 전역 learning·graph·article·Viz·term·formula·route test, TypeScript와 production build를 통과했다.

## 2026-08-15 · CNN operator · equivariance · receptive field · depthwise · spatial-task CRUD split

- 기존 `ai/cnn` 한 글에 섞여 있던 image tensor·local operator·shared geometry, translation equivariance, theoretical/effective receptive field·dilation, depthwise·pointwise factorization, task spatial output을 다섯 독립 학습 arc로 분리했다. 기존 route는 image grid에서 output cell을 만드는 기초로 좁히고 `ai/cnn-translation-equivariance`, `ai/cnn-receptive-fields`, `ai/depthwise-separable-convolution`, `ai/vision-task-spatial-contracts` 네 route를 생성했다. Legacy section 6개와 카드·표 중심 Viz 7개는 삭제했다.
- CRUD 전에 graph의 실제 edge를 읽어 `image→cross-correlation→sharing/geometry`, `sharing+geometry→equivariance`, `geometry→RF→effective/dilation`, `cross-correlation→depthwise`, `RF+geometry→task contract`의 다섯 component를 확인했다. 기존 canonical concept 10개가 이를 충분히 표현하므로 인위적 node는 추가하지 않고 owner·href·stage·evidence만 이동했다. 공개 route·exact contract는 461→465개, graph는 2,380 concepts·3,560 relations·invariant 0을 유지하며 topology는 `keep` 398·split-review 65가 됐다.
- Pixel grid·kernel window·feature map, input shift·shared detector·response peak, nested theoretical span·effective target·dilated gaps, dense→depthwise→pointwise→runtime, feature→class·box·mask·release를 grid·window·map·gate·target과 화살표로 표현하는 새 responsive animated Viz 5개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 왕복과 `Space` 자동 재생을 지원한다.
- 실제 public closure의 수식 6개를 explicit operation annotation으로 작성했다. Patch 선택→offset 곱→local 합, dilation span→padding room→stride count, translation→shared sum→index 치환, jump·RF 누적, dense→depthwise+pointwise→기준량당 비율, task별 spatial output axis의 연산 의도를 KaTeX 식 안 underbrace로 직접 표시해 explicit annotation은 188→194개, backlog는 903→897개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·HTML box·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 처음 넘친 local-operator 47px와 depthwise 6px 수식은 의미 단위 주석으로 줄여 316/316에 맞추고 full-page·focused screenshots를 육안 검수했다. 다섯 글 exact 6+4, 전역 learning·graph·article·Viz·term·formula·route test, TypeScript와 production build를 통과했다.

## 2026-08-15 · Validation question · fold state · OOF · group · time · feedback CRUD split

- 기존 `ai/cross-validation` 한 글에 섞여 있던 deployment estimand, fold-local fitted state, pooled OOF risk와 procedure estimand, group disjointness, label availability·gap·purge, CV–leaderboard adaptation을 여섯 독립 학습 arc로 분리했다. 기존 route는 배포 질문과 validation risk 기초로 좁히고 `ai/fold-local-validation`, `ai/oof-risk-estimation`, `ai/grouped-validation`, `ai/walk-forward-validation`, `ai/validation-feedback-audit` 다섯 route를 생성했으며 legacy section 5개와 텍스트·표 중심 Viz 5개를 삭제했다.
- CRUD 과정에서 `fold-local-transform-boundary`가 이미 `feature-engineering`이 소유하던 `fold-local-statistic`과 같은 fitted-state 경계를 중복 정의한다는 점을 확인했다. 중복 node를 삭제하고 정본 owner를 새 fold-local 글로 이동했다. 대신 실제 학습 순서에서 빠졌던 `label availability → temporal gap·purge`, `adaptive feedback budget → protocol adaptation audit` 관계 2개를 추가했다. 공개 route·exact contract는 465→470개, graph는 2,380→2,379 concepts·3,560→3,562 relations가 되었고 owner·isolation·stage invariant는 0이다.
- 배포 target→unit→risk→split, row manifest→fitted state→validation transform→refit, held fold→unseen prediction→pooled risk→procedure, rows→shared cause→disjoint groups→evidence count, origin→available time→purge→advance, score parity→rank direction→adaptation→frozen holdout을 도형·arrow·timeline으로 표현하는 새 responsive animated Viz 6개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 자동 재생을 실제 focus 상태에서 지원한다.
- 실제 public closure의 수식 7개를 모두 explicit operation annotation으로 작성했다. Learning procedure→new-unit loss→expectation, train-only center/scale→validation transform, held-fold exclusion→row loss→weighted pooling, group set→intersection, unique group count, event→horizon→reporting delay→origin admission, candidate subtraction→tolerant sign→pair indicator→agreement의 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 explicit annotation은 194→201개, 대기 수식은 897→892개가 됐다.
- 390px·1440px 실제 브라우저 12회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 risk 식 29px와 label-availability 식 14px 내부 overflow를 발견해 underbrace 문구를 의미 단위로 줄여 316/316에 맞췄다. Focused Viz·formula와 full-page screenshots를 육안 검수했으며 topology는 `keep` 405·split-review 63으로 개선됐다.

## 2026-08-15 · Evaluation contract · selection bias · availability · experiment · submission CRUD split

- 기존 `ai/competition-workflow` 한 글에 섞여 있던 평가 계약, 반복 후보 선택 편향, prediction-time feature availability, 첫 complete baseline artifact, paired experiment, external submission feedback를 여섯 독립 학습 arc로 분리했다. 기존 route는 prediction 한 행·target·metric 역할을 고정하는 기초로 좁히고 `ai/model-selection-bias`, `ai/prediction-time-feature-availability`, `ai/competition-baseline`, `ai/paired-experiment-design`, `ai/competition-submission-control` 다섯 route를 생성했다. Legacy section 5개와 텍스트·표 중심 Viz 5개는 삭제했다.
- Graph CRUD는 article CRUD와 함께 수행했다. 기존 9개 canonical concept가 여섯 arc를 충분히 표현하므로 가짜 node는 추가하지 않고 owner·href·stage를 실제 설명 route로 이동했다. `validation-protocol-adaptation-audit`와 submission control 사이에서 드러난 prerequisite cycle은 submission의 실제 선행 개념인 `model-selection-maximum-optimism`으로 교정했다. 공개 route·exact contract는 470→475개이며 graph는 2,379 concepts·3,562 relations, owner·isolation·stage invariant 0을 유지한다.
- Prediction row→cutoff→target→roles, latent true score→finite observation→maximum selection→independent verification, event time→availability time→admission comparison→trace, data snapshot→split manifest→OOF→submission artifact, failure slice→one hypothesis→paired delta→gate, submission→feedback count→freeze→manifest를 도형·arrow·receipt로 표현하는 새 responsive animated Viz 6개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 자동 재생을 실제 focus 상태에서 지원한다.
- 실제 public closure의 수식 6개를 explicit operation annotation으로 작성했다. Metric denominator, maximum optimism, event-time·availability-time admission, OOF coverage, paired difference와 external feedback budget의 연산 의도를 KaTeX 식 안 underbrace와 다단식으로 직접 표시해 전역 explicit annotation은 201→207개, 대기 수식은 892→887개가 됐다.
- 390px·1440px 실제 브라우저 12회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 여섯 Viz의 ArrowRight 상태 전이와 Space 재생 전이, full-page·focused screenshots를 육안 검수했다. Topology는 `keep` 411·split-review 62로 개선됐다.

## 2026-08-15 · Context state · instruction · provenance · memory · window CRUD split

- 기존 `ai/context-engineering` 한 글의 graph를 `이번 generation의 context state`, `instruction·untrusted data·runtime enforcement`, `retrieval provenance·freshness`, `working state·memory·artifact·compaction`, `token budget·position utilization·prefix cache`의 다섯 독립 학습 arc로 다시 읽었다. 기존 route는 저장소→선택→직렬화→model read 기초로 좁히고 `ai/context-instruction-boundaries`, `ai/context-provenance-freshness`, `ai/agent-memory-lifecycle`, `ai/context-window-optimization` 네 route를 생성했다. 사용되지 않는 legacy section 5개와 legacy Viz/data 22개는 삭제했다.
- Article CRUD와 graph CRUD를 같은 변경으로 수행했다. 기존 canonical concept 9개의 owner·href·stage·backlink를 실제 설명 route로 이동하고, 선택된 context가 출처·freshness 검사를 받아야 한다는 `context-curation-lifecycle → context-source-provenance-freshness` relation을 추가했다. 개념을 늘리기 위한 가짜 node는 만들지 않았다. 공개 route·exact contract는 475→479개, graph는 2,379 concepts·3,563 relations이며 owner·isolation·stage invariant는 0이다.
- 외부 저장소→selector→ordered token→generation, instruction/data/runtime/effect receipt, fragment receipt→canonical version, working state→memory/artifact→resume, token ledger→position curve→prefix reuse를 서로 다른 도형 Viz로 만들었다. 다섯 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 재생·일시정지를 지원한다. 넓은 desktop canvas를 단순 축소하지 않고 모바일 장면별 camera와 별도 lane·token ledger 도형을 사용해 현재 용어가 읽히도록 했다.
- 실제 public closure의 수식 5개를 모두 explicit operation annotation으로 작성했다. 후보 선택→직렬화, instruction/data/runtime gate, source·revision·freshness 판정, compaction 필수 key 복원율, control/evidence/output reserve/headroom의 각 연산 의도를 KaTeX 식 안의 underbrace와 의미 단위 다단식으로 직접 표시했다. 전역 explicit annotation은 207→212개, 대기 수식은 887→886개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 모바일 camera에서 다음 장면의 텍스트가 잘려 보이던 문제와 context/window 수식 overflow를 교정하고 full-page·focused screenshots를 재촬영·육안 검수했다. 다섯 Viz의 ArrowRight 상태 전이와 Space `자동 재생→일시정지→자동 재생` 전이를 실제 focus 상태에서 확인했으며 topology는 `keep` 416·`rename-or-split-review` 2·`split-review` 61로 개선됐다.

## 2026-08-15 · Contrastive pair · SimCLR · triplet · supervised · evaluation CRUD split

- 기존 `ai/contrastive-learning`의 11개 canonical concept을 graph edge로 다시 읽어 `pair 의미·projection handoff`, `두 view·NT-Xent·temperature`, `unit geometry·triplet margin·versioned mining`, `label multi-positive`, `false-negative audit·downstream paired evaluation`의 다섯 독립 학습 arc를 확인했다. 기존 route는 pair contract 기초로 좁히고 `ai/simclr-infonce`, `ai/triplet-metric-learning`, `ai/supervised-contrastive-learning`, `ai/contrastive-evaluation` 네 route를 생성했다. Legacy section 5개와 텍스트 중심 Viz 5개는 삭제했다.
- Graph CRUD는 node 수를 늘리지 않고 기존 11개 owner·canonical href·stage를 실제 설명 route로 이동하는 방식으로 수행했다. Pair→NT-Xent·triplet·multi-positive, triplet→miner→pair audit→downstream loop의 기존 meaningful edge가 다섯 route의 선수 순서를 이미 충분히 표현했으므로 가짜 relation도 추가하지 않았다. 공개 route·exact contract는 479→483개, graph는 2,379 concepts·3,563 relations·owner/isolation/stage invariant 0을 유지한다.
- Pair relation→encoder→projection, augmentation views→2B 후보→positive probability, unit circle→triplet→margin→miner receipt, label batch→P(i)→positive 평균→empty guard, candidate→audit→paired test→revision을 각각 새 responsive animated Viz로 만들었다. 단순 desktop 축소에서 mobile label이 7~9px로 작아지는 문제를 육안으로 발견해 responsive SVG font와 비활성 흐름 대비를 별도로 보강했다.
- 실제 public closure의 수식 6개를 모두 explicit operation annotation으로 작성했다. Encoder·projection·normalization·dot product, temperature scaling·self 제외 후보 합·positive normalization·negative log, cosine–distance 전개, positive/negative 거리 차감·margin 추가·hinge 절단, positive set·candidate 합·positive 합산·개수 평균, false-negative 비율·paired subtraction·seed 평균의 연산 의도를 식 안에 직접 표시했다. 전역 explicit annotation은 212→218개, 대기 수식은 886→879개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·모든 KaTeX overflow와 KaTeX error·console warning/error·gradient·shadow·굵은 선이 0임을 확인했다. 최초 검수에서 triplet 대표식 96px, SupCon 대표식 22px overflow를 발견해 의미 단위 다단식으로 교정했다. 다섯 Viz의 ArrowRight 전환과 Space `자동 재생→일시정지`를 실제 focus 상태에서 확인하고 full-page·focused Viz·formula screenshots를 육안 검수했으며 topology는 `keep` 421·`rename-or-split-review` 2·`split-review` 60으로 개선됐다.

## 2026-08-15 · Augmentation meaning · image · mixing · tabular · evaluation CRUD split

- 기존 `ai/data-augmentation` 한 글에 섞여 있던 label-preserving transformation·target map·augmented risk, image coordinate·photometric·normalization, Mixup·CutMix·Mosaic, tabular synthesis, clean·robust·TTA release를 다섯 독립 학습 arc로 분리했다. 기존 route는 허용 변화 기초로 좁히고 `ai/image-augmentation-transforms`, `ai/mixup-cutmix`, `ai/tabular-data-synthesis`, `ai/augmentation-evaluation` 네 route를 생성했으며 legacy section 6개와 legacy Viz 5개를 삭제했다.
- Article CRUD 중 graph에서 실제 설명이 빠져 있던 transformed visibility, photometric contract, Mosaic annotation composition, tabular constraint ledger·split locality·utility/privacy, policy artifact·TTA inverse map·release gate 아홉 canonical concept와 relation 14개를 추가했다. 기존 9개 owner·href도 새 정본으로 이동해 공개 route·exact contract는 483→487개, graph는 2,388 concepts·3,577 relations·invariant 0이 되었다.
- Deployment→transform→target→risk, image coordinate→clip→color→normalization, source→Mixup/CutMix/Mosaic→target, schema→constraint→train-only→privacy, policy→clean/robust→inverse map→release를 각각 도형·mask·canvas·gate·arrow로 표현한 새 responsive animated Viz 5개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 재생·일시정지를 지원한다.
- 실제 public closure의 수식 7개를 explicit operation annotation으로 작성했다. Transform/sample expectation, affine corner→bbox→clip→visible ratio, channel center→scale, Mixup source 몫→input/target 합, CutMix mask→pixel count→area target, split-local interpolation→constraint admission, TTA view→inverse coordinate→평균의 각 연산 의도를 식 안에 직접 표시했다. Legacy 미주석 식 5개를 제거해 전역 explicit annotation은 218→225개, 대기 수식은 879→874개로 줄었다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 대표식 네 개가 17–74px 넘친 문제와 Unicode lambda KaTeX warning을 의미 단위 다단식과 표준 기호로 교정했다. Focused Viz·formula와 full-page screenshots를 육안 검수했고 topology는 `keep` 426·`rename-or-split-review` 2·`split-review` 59로 개선됐다.

## 2026-08-15 · Domain decision · continued pretraining · task update · data governance CRUD split

- 기존 `ai/domain-finetuning` 한 글의 graph를 `gap→intervention`, `corpus→checkpoint`, `demonstration→update scope→behavior gate`, `shared cause→rights→claim`의 네 학습 arc로 다시 읽었다. 기존 route는 RAG·weight adaptation의 선택 기초로 좁히고 `ai/continued-pretraining`, `ai/domain-task-finetuning`, `ai/domain-data-governance` 세 route를 생성했으며 legacy section 4개와 표 형태 Viz 4개를 파일까지 삭제했다.
- Article CRUD와 graph CRUD를 같은 작업에서 반복했다. 기존 9개 owner·canonical href를 실제 설명 route로 이동하고, 본문을 분리하자 드러난 retrieval–weight 저장 경계, corpus preparation manifest, update-scope receipt, behavior release gate, deployment-claim boundary 다섯 canonical concept와 12개 관계를 추가했다. 공개 route·exact contract는 487→490개, graph는 2,393 concepts·3,589 relations이며 owner·isolation·stage invariant는 0이다.
- 실패 sample→gap→후보→release, domain/general corpus→mixture→checkpoint→frontier, demonstration→loss mask→full/LoRA/head→behavior gate, entity group→split→rights lineage→coverage를 표가 아닌 도형·arrow·mask·timeline으로 표현한 새 responsive animated Viz 4개를 만들었다. 네 Viz의 `ArrowRight` 장면 전이를 실제 focus 상태에서 검증했고 `Space` 자동 재생 UI도 공통 scene contract로 제공한다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Constraint filtering→argmax, corpus expectation→λ contribution→합, surprisal→token 평균→exponentiation, gain·forgetting subtraction→AND gate, response mask→NLL→평균, non-compensating behavior gate, group intersection→time cutoff, slice set→독립 group count→coverage의 각 연산 의도를 KaTeX 식 안에 직접 표시했다. Legacy 미주석 식 7개를 제거해 전역 explicit annotation은 225→233개, 대기 수식은 874→867개로 줄었다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·ExplainedFormula·모든 main/operation KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 corpus-mixture 주석 식이 7px 넘친 문제를 의미 단위의 짧은 주석으로 교정해 316/316에 맞췄다. Full-page·focused Viz·formula screenshots를 육안 검수했으며 topology는 `keep` 430·`rename-or-split-review` 2·`split-review` 58로 개선됐다.

## 2026-08-15 · Sentence vector · bi-encoder · serving · evaluation CRUD split

- 기존 `ai/sentence-embeddings` 한 글에 섞여 있던 token→sentence vector, bi-encoder retrieval, input→index serving artifact, multi-positive evaluation을 네 독립 학습 arc로 분리했다. 기존 route는 pooling과 relation 기초로 좁히고 `ai/bi-encoder-retrieval`, `ai/embedding-serving-contract`, `ai/embedding-evaluation` 세 route를 생성했으며 legacy section 4개와 표·카드 중심 Viz 4개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 작업에서 반복했다. 기존 canonical concept 9개의 owner·href를 실제 설명 route로 이동하고, 분리 과정에서 빠져 있던 `sentence-embedding-artifact`, similarity의 사실성 경계, retrieve–rerank composition, compatible index-generation receipt, multi-positive label snapshot 다섯 concept과 meaningful relation 13개를 추가했다. 공개 route·exact contract는 490→493개, graph는 2,398 concepts·3,602 relations이며 owner·isolation·stage invariant는 0이다.
- Token states→mask→pooling→relation, cross pair→offline document vectors→ANN candidates→rerank, role serialization→tokenizer→embedding batch→index generation, relevant set→coverage→ranking→quality/cost release를 도형·화살표·vector point·rank bar로 표현한 새 responsive animated Viz 4개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 지원하며 실제 focus 상태에서 다음 장면 전환을 확인했다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Mask 곱→valid 합→평균→unit normalization, cosine 분모 제거, cross/offline/online 비용 분리, candidate-set subset 상한, content token 차감→retention, vector scalar 수→byte→index overhead, Recall·gain·discount·NDCG, slice gate→Pareto dominance의 연산 의도를 식 안 underbrace로 직접 표시했다. Legacy 미주석 식을 제거해 전역 explicit annotation은 233→241개, 대기 수식은 867→860개로 줄었다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·모든 main/operation KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 다섯 대표식이 1–253px 넘친 문제를 짧은 의미 행으로 재작성해 모두 316/316에 맞추고 full-page·focused Viz·formula screenshots를 육안 검수했다. Topology는 `keep` 434·`rename-or-split-review` 2·`split-review` 57로 개선됐다.

## 2026-08-15 · Word2Vec pair · objectives · sampling · subword CRUD split

- 기존 `ai/word2vec` 한 글에 섞여 있던 word ID→dual table→window→pair 생성, CBOW·Skip-gram·hierarchical softmax, SGNS·noise·subsampling, fastText·static release를 네 독립 학습 arc로 분리했다. 기존 route는 pair 생성 기초로 좁히고 `ai/word2vec-prediction-objectives`, `ai/word2vec-negative-sampling`, `ai/subword-static-embeddings` 세 route를 생성했으며 legacy section 4개와 기존 Viz 5개를 삭제했다.
- Article CRUD와 graph CRUD를 함께 반복했다. 기존 canonical concept 10개의 owner·href를 실제 설명 route로 이동했고, 한 word가 center와 context 역할에서 다른 parameter를 읽는 `word2vec-dual-embedding-table`, corpus·tokenizer·window·filter·seed를 재현하는 `word-context-pair-sampling-receipt` 두 concept을 추가했다. Pair receipt가 CBOW·Skip-gram·SGNS의 관측 입력이 되고 fastText 계산이 static release를 만드는 관계까지 보강했다.
- 공개 route·exact learning contract는 493→496개, graph는 2,400 concepts·3,610 relations이며 owner·isolation·stage invariant는 0이다. 네 route는 각각 entry-level·assumed knowledge 0·기초 6개+심화 4개이고 topology는 모두 `keep`이다. 전체 topology는 `keep` 438·`rename-or-split-review` 2·`split-review` 56으로 개선됐다.
- ID row→input/output table→window→pair receipt, context↔center prediction→tree path, positive/noise rows→sigmoid loss→sparse update, word→character n-grams→bucket 합→release manifest를 서로 다른 도형·arrow·tree·artifact 구조의 새 responsive animated Viz 4개로 만들었다. 끝 단계의 receipt와 manifest도 축약 기호가 아닌 읽을 수 있는 artifact 상자로 표현했고 네 Viz 모두 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 지원한다.
- 실제 public closure의 수식 7개를 explicit operation annotation으로 작성했다. One-hot lookup·dual table score, dynamic-window 포함 확률, CBOW 평균·softmax, Skip-gram pair loss, SGNS positive/noise 부호, 3/4 noise normalization, subword n-gram→hash→bucket→합성의 각 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 explicit annotation은 241→248개, 대기 수식은 860→856개가 됐다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 SGNS 두 식과 subword 식이 2–168px 넘친 문제를 의미 단위의 짧은 다단식으로 교정해 모두 316/316에 맞췄고 full-page 8장과 focused Viz를 육안 검수했다.

## 2026-08-15 · Deepfake split · preprocessing · frequency · video decision · governance CRUD split

- 기존 `ai/deepfake-detection` 한 글에 섞여 있던 source-independent 평가, face preprocessing lineage, conditional frequency evidence, video-level aggregation, dataset governance를 다섯 독립 학습 arc로 분리했다. 기존 route는 source group과 worst-domain risk 기초로 좁히고 `ai/deepfake-preprocessing-lineage`, `ai/deepfake-frequency-evidence`, `ai/deepfake-video-decisions`, `ai/deepfake-dataset-governance` 네 route를 생성했으며, actual closure에서 제외된 legacy section 5개와 legacy Viz 5개는 파일까지 삭제했다.
- Article CRUD와 graph CRUD를 같은 작업에서 수행했다. 기존 10개 canonical concept의 정의와 10개 meaningful relation이 이미 다섯 arc를 충분히 연결하므로 가짜 node·edge를 추가하지 않고 owner·canonical href·stage·editorial backlink를 실제 설명 route로 이동했다. 공개 route·exact contract는 496→500개, graph는 2,400 concepts·3,610 relations이며 owner·isolation·stage invariant는 0이다.
- Source/derivative→group store→split→domain bars, frame→detect decision→identity track→crop receipt, pixel grid→spectrum→corruption→joint-error overlap, temporal scores→reducer→parity→decision, source/person→consent→derivative grid→dataset manifest를 각각 도형과 화살표로 표현한 새 responsive animated Viz 5개를 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 지원한다.
- 실제 public closure의 새 수식 6개를 모두 explicit operation annotation으로 작성했다. Group key→split intersection→pass, domain sample 선택→loss 평균→maximum, valid crop indicator→coverage, RGB/frequency error indicators→곱→joint mean, score 정렬→top-k 선택→평균, coverage cell 선택→source unique→count의 각 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 explicit annotation은 248→254개, 대기 수식은 856→850개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·모든 KaTeX overflow, clipped descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 다섯 Viz의 ArrowRight 장면 전환과 Space 자동 재생 상태를 실제 focus 상태에서 검증하고 full-page 10장과 mobile focused Viz 5장을 육안 검수했다. Topology는 `keep` 443·`rename-or-split-review` 2·`split-review` 55로 개선됐다.

## 2026-08-15 · Video observation · clip sampling · convolution · transformer CRUD split

- 기존 `ai/video-understanding` 한 글의 11개 canonical concept를 `시간축 관측·aliasing`, `clip interval coverage·deterministic replay`, `temporal convolution·I3D·R(2+1)D·SlowFast`, `tubelet·factorized attention·VideoMAE`의 네 독립 학습 arc로 다시 읽었다. 기존 route는 관측 기초로 좁히고 `ai/video-clip-sampling`, `ai/video-convolution-architectures`, `ai/video-transformers` 세 route를 생성했으며 legacy section 4개와 텍스트 중심 Viz 4개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복으로 수행했다. 기존 11개 owner·canonical href·stage를 실제 설명 route로 이동하고, 분리 뒤 드러난 deterministic replay→temporal receptive span·tubelet contract, temporal span→I3D, R(2+1)D↔SlowFast, factorized cost↔VideoMAE의 관계 5개를 추가했다. 공개 route·exact contract는 500→503개, graph는 2,400 concepts·3,615 relations이며 owner·isolation·stage invariant는 0이다.
- Source timeline→stride→effective sample rate→aliasing gate, duration→clip intervals→coverage union→replay receipt, sampled frames→temporal operators→Slow/Fast paths, frame grid→tubelets→space/time interactions→visible-token encoder를 도형·timeline·arrow로 표현한 새 responsive animated Viz 4개로 만들었다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 실제 focus 상태에서 지원한다.
- 실제 public closure의 대표 수식 9개를 explicit operation annotation으로 작성했다. Frame index→seconds, stride→effective FPS, Nyquist boundary, interval union coverage, temporal receptive span, SlowFast rate·channel ratio, tubelet count, joint/factorized interaction cost, visible-token masking의 연산 의도를 KaTeX 식 안의 underbrace와 의미 단위 다단식으로 직접 표시했다. 전역 수식은 1,106개 중 explicit 263개, 대기 843개가 됐다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, clipped descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 검수에서 SlowFast 식이 모바일에서 9px 넘고 Unicode α·β·τ가 KaTeX text-mode warning을 내던 문제를 수학 기호와 의미 단위 다단식으로 교정했다. Full-page·focused Viz 16장을 육안 검수했으며 topology는 `keep` 447·`rename-or-split-review` 2·`split-review` 54로 개선됐다.

## 2026-08-15 · Image identity · backbone budget · training stage · decision CRUD split

- 기존 `ai/image-classification-pipeline` 한 글의 9개 canonical concept를 `source derivative→identity group→baseline receipt`, `resolution cost→compound scaling→runtime frontier`, `resolution handoff→pseudo-label consistency`, `logit→calibration→aggregation→action`의 네 독립 학습 arc로 다시 읽었다. 기존 route는 data boundary 기초로 좁히고 `ai/image-backbone-scaling`, `ai/image-training-stages`, `ai/image-probability-decisions` 세 route를 생성했으며 legacy section 4개와 표 중심 Viz 4개를 삭제했다.
- 기존 concept 9개가 네 arc를 충분히 설명해 가짜 node를 추가하지 않았다. 대신 baseline receipt→backbone comparison, baseline receipt→resolution stage, pseudo-label generation→decision artifact 관계 3개를 추가하고 owner·canonical href·stage·evidence를 실제 route로 이동했다. 공개 route·exact contract는 503→506개, graph는 2,400 concepts·3,618 relations이며 invariant·stage warning은 0이다.
- Derivative image grid→identity diamond→group split→receipt, pixel grid→CNN/ViT→scaling knobs→frontier, baseline store→resolution stage→weak/strong view→release gate, logit bars→temperature→TTA/ensemble→action을 새 responsive animated 도형 Viz 4개로 만들었다. 모든 Viz의 `ArrowRight` 장면 전환과 `Space` 자동 재생을 실제 focus 상태에서 검증했다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Identity projection·set intersection·zero-overlap gate, paired quality gain·latency gate, patch count·global pair cost, compound scaling, effective batch·exposure, pseudo-label admission·CE, temperature softmax·NLL selection, TTA·ensemble·threshold의 연산 의도를 식 안에 직접 표시했다. Legacy 미주석 식 7개를 제거해 전역 수식은 1,107개 중 explicit 271개, 대기 836개가 됐다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, clipped descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 검수에서 temperature 대표식이 모바일에서 13px 넘친 문제를 `scale→exp mass→sum→normalize→select T` 다단식으로 분해했다. Full-page·focused Viz 16장을 육안 검수했으며 topology는 `keep` 451·`rename-or-split-review` 2·`split-review` 53으로 개선됐다.

## 2026-08-15 · Metric contract · regression · classification · ranking · selection CRUD split

- 기존 `ai/evaluation-metrics` 한 글에 섞여 있던 decision-cost·hierarchical reducer, residual penalty·point/interval target, classifier ranking·probability·threshold, ranked-list relevance·query population, surrogate·guardrail·outer report를 다섯 독립 학습 arc로 분리했다. 기존 route는 metric 이름 이전의 decision contract 기초로 좁히고 `ai/regression-metrics`, `ai/classification-metrics`, `ai/ranking-metrics`, `ai/metric-selection-protocol` 네 route를 생성했으며 legacy section 5개와 표·카드 중심 Viz 5개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 10개 owner를 실제 설명 route로 이동하고, 분리 뒤 설명의 출발점에서 비어 있던 `regression residual·penalty`, `classification three-layer evaluation`, `threshold expected cost`, `ranked-list evaluation unit`, `metric-selection receipt` 다섯 concept과 12개 meaningful relation을 추가했다. 공개 route·exact contract는 506→510개, graph는 2,405 concepts·3,630 relations이며 owner·isolation·stage invariant는 0이다.
- Prediction→policy→action→cost→unit/slice, residual axis→penalty curves→mean/median→interval, score dots→calibration frequency→threshold→report, ranked bars→gain·discount→macro/traffic, train→validation→feasible gate→test를 도형·축·화살표로 표현한 새 responsive animated Viz 5개를 만들었다. 각 custom Viz를 직접 focus해 `ArrowRight` 장면 전환과 `Space` 재생·일시정지를 검증했다.
- 기존 public closure의 수식 10개를 모두 explicit operation annotation으로 전환하고 threshold expected-cost 식 1개를 추가했다. Residual subtraction→absolute/square→mean/root, conditional risk→derivative/median, interval hit→coverage/width, Bernoulli branches→regret, threshold→error branch→cost, relevance→gain→discount→normalization, query score→macro/traffic, fit→select→outer report, guardrail indicator→AND→feasible argmin의 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 수식은 1,108개 중 explicit 282개, 대기 826개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, clipped descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 검수에서 mobile KaTeX 5개가 3–283px 넘고 selection annotation의 Unicode Greek warning이 발생한 문제를 의미 단위 다단식과 안전한 annotation text로 교정했다. Full-page screenshots 10장을 육안 검수했으며 topology는 `keep` 456·`rename-or-split-review` 2·`split-review` 52로 개선됐다.

## 2026-08-15 · Tuning contract · adaptive search · space · pruning · Pareto CRUD split

- 기존 `ai/hyperparameter-tuning` 한 글에 섞여 있던 trial selection·random budget, adaptive proposal·TPE, typed conditional search space, multi-fidelity pruning, multi-objective selection을 다섯 독립 학습 arc로 분리했다. 기존 route는 configuration·trial·study와 outer evaluation 기초로 좁히고 `ai/adaptive-hyperparameter-search`, `ai/search-space-design`, `ai/multi-fidelity-pruning`, `ai/multi-objective-hpo` 네 route를 생성했으며 legacy section 4개와 legacy Viz 4개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개의 owner·href·stage를 실제 설명 route로 이동하고, 분리 뒤 빠져 있던 `pruning-false-negative-audit`와 `hpo-pareto-selection-receipt` 두 concept 및 관계 5개를 추가했다. 공개 route·exact contract는 510→514개, graph는 2,407 concepts·3,635 relations이며 owner·isolation·stage invariant는 0이다.
- Contract→trials→validation→outer report, observed scatter→good/other density→proposal, typed root→conditional branch→feasibility gate, rung별 candidate race, hard constraint→Pareto frontier→approval을 각각 다른 도형 문법의 responsive animated Viz 5개로 만들었다. 모든 custom Viz를 직접 focus해 `ArrowRight` 장면 전환과 `Space` 재생·일시정지를 확인했다.
- 실제 public closure의 수식 10개를 모두 explicit operation annotation으로 작성했다. Budget gate→validation argmin→outer risk, miss complement→N회 곱, history→acquisition→proposal, TPE cohort→conditional densities→ratio, log-space 위치→복원, branch/resource gates→AND, 후보 축소·resource 확대, prune/finalist indicators→miss rate, tolerance gates→dominance, repeat indicators→stability proportion의 각 연산 의도를 식 안에 표시했다. 전역 수식은 1,110개 중 explicit 292개, 대기 818개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·ExplainedFormula·모든 KaTeX overflow, KaTeX error, clipped descendant, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 설명 수식 8개가 3–143px 넘친 문제를 작은 의미 행으로 재작성해 모두 316/316 안에 맞췄다. Full-page screenshots 10장을 육안 검수했으며 topology는 `keep` 461·`rename-or-split-review` 2·`split-review` 51로 개선됐다.

## 2026-08-15 · Experiment provenance · curve · registry · reproduction CRUD split

- 기존 `ai/experiment-tracking` 한 글에 섞여 있던 specification·attempt·artifact provenance, learning-curve coordinate, metadata/object store·alias·deployment, equality·seed·clean-room 재현을 네 독립 학습 arc로 분리했다. 기존 route는 provenance 기초로 좁히고 `ai/learning-curve-tracking`, `ai/model-artifact-registry`, `ai/reproducible-ml-execution` 세 route를 생성했으며 legacy section 4개와 텍스트 중심 Viz 4개를 파일까지 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 9개의 owner·canonical href·stage를 실제 설명 route로 이동했다. 기존 meaningful relation 15개가 provenance→registry와 equality→clean-room 흐름을 이미 충분히 표현해 가짜 node·edge는 추가하지 않았다. 공개 route·exact contract는 514→517개, graph는 2,407 concepts·3,635 relations이며 owner·isolation·stage invariant는 0이다.
- Immutable inputs→spec→attempt→artifact→report, metric curve→공통 token budget 정렬, backend/object store→integrity→alias→endpoint, equality ladder→seed tree→fresh runner→acceptance를 도형과 화살표로 표현한 responsive animated Viz 4개를 새로 만들었다. 모든 custom Viz를 직접 focus해 `ArrowRight` 01→02 이동과 `Space` 재생·일시정지를 확인했다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Encode→hash→attempt tuple, bytes hash→digest equality→artifact reference, processed-unit normalization→coordinate tuple, distance→argmin→paired delta, store checks→AND, alias resolve→digest→receipt, absolute/relative tolerance→global AND, seed tuple→hash→mod의 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 수식은 1,111개 중 explicit 300개, 대기 811개가 됐다.
- 390px·1440px 실제 브라우저 8회에서 document·custom Viz·canvas·ExplainedFormula·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 대표 주석식 세 개가 23–43px 넘친 문제를 짧은 의미 행으로 다시 써 모두 316/316에 맞췄다. Full-page 8장과 mobile focused Viz 4장을 육안 검수했고 topology는 `keep` 465·`rename-or-split-review` 2·`split-review` 50으로 개선됐다.

## 2026-08-15 · Imbalance prevalence · resampling · loss · threshold · evaluation CRUD split

- 기존 `ai/imbalanced-data` 한 글에 섞여 있던 class prevalence·세 출력 층, fold-local resampling·SMOTE, class weight·focal loss, cost·capacity threshold, confusion·PR·calibration을 다섯 독립 학습 arc로 분리했다. 기존 route는 base rate와 ranking·probability·action 분리 기초로 좁히고 `ai/imbalance-resampling`, `ai/imbalance-loss-weighting`, `ai/cost-sensitive-thresholding`, `ai/imbalanced-classification-evaluation` 네 route를 생성했으며 legacy section 5개와 legacy Viz 4개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개의 owner·href·stage·evidence를 실제 설명 route로 이동하고, 분리하면서 드러난 prevalence→resampling/weight, resampling/focal→calibration, threshold→confusion ledger 관계 5개를 추가했다. 공개 route·exact contract는 517→521개, graph는 2,407 concepts·3,640 relations이며 owner·isolation·stage invariant는 0이다.
- Population dots→ranking→probability→action, train/validation split→sample 노출→SMOTE geometry, sample loss→class weight→focal modulation→noise audit, 두 cost line→교차 threshold→capacity gate, confusion cells→precision/recall→prevalence shift→calibration을 서로 다른 도형·축·화살표로 표현한 새 responsive animated Viz 5개를 만들었다. 모든 Viz에서 `ArrowRight` 장면 전환과 `Space` 재생·일시정지를 실제 focus 상태로 확인했다.
- 실제 public closure의 수식 11개를 모두 explicit operation annotation으로 작성했다. Base-rate baseline, ranking·calibration·action, fold admission·SMOTE interpolation, weighted risk·focal factor, Bayes cost·capacity-constrained selection, precision·recall, prevalence-sensitive precision, ECE의 각 연산 의도를 KaTeX 식 안에 직접 표시했다. 전역 수식은 1,117개 중 explicit 311개, 대기 806개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·ExplainedFormula·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 base-rate·precision/recall·ECE 대표식 3개가 7–45px 넘친 문제를 의미 단위 다단식으로 바꿔 모두 316/316에 맞췄다. Full-page 10장과 mobile focused Viz 5장을 육안 검수했으며 topology는 `keep` 470·`rename-or-split-review` 2·`split-review` 49로 개선됐다.

## 2026-08-15 · SGD update · momentum memory · Adam state CRUD split

- 기존 `ai/optimizers` 한 글에 함께 있던 SGD update contract·effective batch, EMA·momentum velocity, Adam raw moments·bias correction·adaptive preconditioning을 세 독립 학습 arc로 분리했다. 기존 route는 gradient estimate와 SGD의 한 update 기초로 좁히고 `ai/momentum-optimizer`, `ai/adam-optimizer` 두 route를 생성했으며, actual closure에서 제외된 legacy section 6개와 legacy Viz/data 28개를 파일까지 삭제했다. AdamW는 이미 정본 설명을 소유한 `ai/weight-decay`와 중복 route를 만들지 않았다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 concept 8개의 owner·canonical href·stage를 실제 설명 route로 이동하고, `decoupled-weight-decay`가 기존 정본 `decoupled-adaptive-weight-decay`와 중복됨을 확인해 전자를 삭제한 뒤 두 relation을 정본으로 redirect했다. 공개 route·exact contract는 521→523개, graph는 2,407→2,406 concepts·3,640 relations이며 owner·isolation·stage invariant는 0이다.
- Loss→gradient→learning-rate displacement, noisy gradient→EMA bars→velocity, signed/squared gradient→bias correction→coordinate preconditioner를 도형·arrow·bar·state box로 표현하는 responsive animated Viz 3개를 새로 만들었다. 각 Viz는 `ArrowLeft`·`ArrowRight` 장면 이동과 `Space` 재생·일시정지를 지원하며 실제 focus 상태에서 01→02 전환과 자동 재생을 확인했다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Effective batch, SGD displacement, EMA decay, momentum velocity, Adam first/second raw moment, 초기화 bias correction, coordinate-wise preconditioning의 각 연산 의도를 KaTeX 식 안에서 의미 단위로 직접 표시했다. 전역 수식은 1,120개 중 explicit 319개, 대기 801개가 됐다.
- 390px·1440px 실제 브라우저 6회에서 document·custom Viz·canvas·ExplainedFormula·KaTeX error·console error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 Adam 대표식 두 개가 1–32px 넘친 문제를 짧은 의미 행과 substack으로 교정해 모든 식을 316/316에 맞췄다. Full-page와 mobile focused Viz screenshots를 육안 검수했으며 topology는 `keep` 473·`rename-or-split-review` 2·`split-review` 48로 개선됐다.

## 2026-08-15 · Schedule clock · decay · cosine · OneCycle · warmup CRUD split

- 기존 `ai/lr-scheduling` 한 글의 9개 canonical concept를 `update clock·resume`, `open-loop·metric decay`, `cosine·warm restart`, `range test·OneCycle`, `warmup·relative update`의 다섯 독립 학습 arc로 분리했다. 기존 route는 schedule contract 기초로 좁히고 `ai/lr-decay-policies`, `ai/cosine-restart-scheduling`, `ai/one-cycle-scheduling`, `ai/warmup-scheduling` 네 route를 생성했으며 legacy section 5개와 legacy Viz 5개를 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복에서 수행했다. 기존 9개 owner·canonical href·stage를 실제 설명 route로 이동하고, 분리 뒤 빠져 있던 `schedule contract → metric trigger`, `open-loop ↔ metric-trigger contrast`, `warmup composition → cosine local clock` relation 3개를 추가했다. 가짜 node는 만들지 않아 공개 route·exact contract는 523→527개, graph는 2,406 concepts·3,640→3,643 relations이며 owner·isolation·stage invariant는 0이다.
- Micro-batch→optimizer update→clock→receipt, clock-driven·metric-driven decay, cosine cycle·restart state, range-test instability→OneCycle phase, warmup→main local clock→relative update를 도형·curve·arrow·state box로 표현하는 responsive animated Viz 5개를 새로 만들었다. 다섯 Viz 모두 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 실제 focus 상태에서 지원한다.
- 실제 public closure의 수식 10개를 explicit operation annotation으로 작성하고 legacy 미주석 수식 7개를 제거했다. Effective batch·schedule function, step/exponential·plateau state, cosine interpolation·restart state, log-range multiplier·phase progress, warmup local clock·relative update의 각 연산 의도를 식 안에 직접 표시했다. 전역 수식은 1,123개 중 explicit 329개, 대기 794개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 최초 모바일 검수에서 cosine 주석식 2px와 warmup 주석식 1px overflow를 발견해 state·norm 계산을 짧은 의미 행으로 분해했고 모두 316/316에 맞췄다. Full-page·focused Viz·formula screenshots를 육안 검수했으며 topology는 `keep` 478·`rename-or-split-review` 2·`split-review` 47로 개선됐다.

## 2026-08-15 · Quantizer · PTQ · QAT · weight-only · deployment CRUD split

- 기존 `ai/quantization` 한 글에 섞여 있던 affine codebook·rounding/clipping, scale sharing·calibration coverage, fake-quant·STE, GPTQ·AWQ reconstruction, dtype별 weight·resident memory·kernel speedup을 다섯 독립 학습 arc로 분리했다. 기존 route는 숫자 하나의 encode/decode 기초로 좁히고 `ai/ptq-calibration`, `ai/quantization-aware-training`, `ai/weight-only-quantization`, `ai/quantized-model-deployment` 네 route를 생성했으며 legacy section 5개와 조악한 legacy Viz 5개를 actual closure뿐 아니라 파일에서도 삭제했다.
- Article CRUD와 graph CRUD를 같은 반복으로 수행했다. 기존 canonical concept 9개의 owner·canonical href·stage를 실제 설명 route로 이동했고, 새 graph node를 억지로 만들지 않았다. 대신 method·format 경계가 exact dtype weight ledger의 선행 조건이고 measured startup receipt가 Amdahl release를 평가한다는 relation 2개만 추가했다. 공개 route·exact contract는 527→531개, graph는 2,406 concepts·3,643→3,645 relations이며 owner·isolation·stage invariant는 0이다.
- 실수축→scale→round/clip→복원, checkpoint→observer→slice validation→artifact, float master→fake quant→loss→STE, X·W/W-hat→output error→GPTQ/AWQ→artifact 층, dtype ledger→known floor→startup peak→runtime gate를 각각 새 responsive animated SVG로 표현했다. 모든 Viz는 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 지원하며 legacy Viz는 재사용하지 않았다.
- 실제 public closure의 수식 11개를 모두 explicit operation annotation으로 작성했다. 실수를 code 좌표로 나누는 이유, zero-point를 빼고 scale을 곱하는 복원, group metadata, saturation normalization·worst slice, fake-quant forward·STE gate, activation을 weight error에 곱하는 reconstruction, AWQ equivalent scaling, parameter bit→byte, resident-memory 합산, Amdahl time 분해의 각 연산 의도를 식 안 underbrace에 직접 표시했다. Legacy 미주석 식 8개를 제거해 전역 수식은 1,126개 중 explicit 340개, 대기 786개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas overflow, gradient·shadow·굵은 선, console warning/error가 0임을 확인했다. 최초 모바일 검수에서 긴 annotated 식 5개가 22–189px 넘고 세 식의 nested row annotation이 KaTeX error를 만든 문제를 작은 의미 행으로 분해해 모든 대표식·operation 식을 316/316 또는 290/290에 맞추고 error 0으로 교정했다. Full-page 10장과 focused Viz 10장을 재촬영·육안 검수했으며 topology는 `keep` 483·`rename-or-split-review` 2·`split-review` 46으로 개선됐다.

## 2026-08-15 · Pruning mask · unstructured · structured · one-shot · deployment CRUD split

- 기존 `ai/pruning` 한 글에 붙어 있던 mask·density, individual-weight score·sparse storage, channel shape·N:M, SparseGPT·Wanda calibration, fixed-mask recovery·runtime release를 다섯 독립 학습 arc로 분리했다. 기존 route는 mask와 removal unit 기초로 좁히고 `ai/unstructured-pruning`, `ai/structured-pruning`, `ai/one-shot-llm-pruning`, `ai/pruning-recovery-deployment` 네 route를 생성했으며 legacy section 5개와 legacy Viz 5개를 파일까지 삭제했다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개의 owner·href·stage를 실제 설명 route로 이동했고, 분리 과정에서 “숫자 0”과 “실제 계산 제거” 사이에 빠져 있던 `pruning-removal-unit-runtime-contract` 한 concept과 meaningful relation 5개를 추가했다. 공개 route·exact contract는 531→535개, graph는 2,407 concepts·3,650 relations이며 owner·isolation·stage invariant는 0이다.
- Weight matrix→mask→weight/N:M/channel handoff, score→mask→value/index→kernel, channel shape→dense GEMM과 N:M eligibility, prompt→X→SparseGPT/Wanda→held-out gate, checkpoint→masked recovery→build→release를 도형·cell·fork·artifact line으로 표현한 새 responsive animated Viz 5개를 만들었다. 기존 조악한 Viz는 재사용하지 않았고 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 실제 focus 상태에서 검증했다.
- 실제 public closure의 수식 9개를 모두 explicit operation annotation으로 작성했다. Mask 곱→남은 수→density→sparsity, dense/sparse byte→index·metadata→임계 density, gradient×weight movement, dimension retention 곱, local N:M group AND, activation norm×weight score, X×weight error reconstruction, fixed mask의 parameter·optimizer-state projection, sparse tactic Amdahl 합산의 연산 의도를 식 안에 직접 표시했다. Legacy 미주석 식 8개를 제거해 전역 수식은 1,127개 중 explicit 349개, 대기 778개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 sparse-storage 대표식이 1px 넘친 문제를 value/index payload와 metadata 합산의 별도 의미 행으로 나눠 316/316에 맞췄다. Full-page 10장과 mobile focused Viz 5장을 육안 검수했으며 topology는 `keep` 488·`rename-or-split-review` 2·`split-review` 45로 개선됐다.

## 2026-08-15 · Generative map · autoregressive · latent · flow · adversarial · score CRUD split

- 기존 `ai/generative-theory` 한 글에 섞여 있던 observation·distribution·평가, autoregressive chain rule, latent marginalization·ELBO, normalizing-flow Jacobian, GAN density ratio, score·diffusion parameterization을 여섯 독립 학습 arc로 분리했다. 기존 route는 생성 문제와 family 선택 지도로 좁히고 `ai/autoregressive-generative-models`, `ai/latent-variable-generative-models`, `ai/normalizing-flows`, `ai/adversarial-density-ratios`, `ai/score-based-generative-models` 다섯 route를 생성했으며 legacy section 4개와 legacy Viz 5개를 파일까지 삭제했다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개가 여섯 arc의 정의·조합을 충분히 표현하고 relation 19개도 prerequisite→tractability→evaluation 흐름을 이미 연결하므로 가짜 node·edge를 추가하지 않았다. 대신 owner·canonical href·stage·evidence를 실제 설명 route로 이동했다. 공개 route·exact contract는 535→540개, graph는 2,407 concepts·3,650 relations이며 owner·isolation·stage invariant는 0이다.
- Observation→distribution→density/sampler→release, prefix token chain, latent branches→marginal→encoder→ELBO, base cell→가역 변환→Jacobian receipt, real/generated samples→optimal discriminator, Gaussian score→noise predictor→reverse direction을 서로 다른 도형·arrow·state 구조의 responsive animated Viz 6개로 새로 만들었다. 기존 조악한 Viz는 재사용하지 않았고 모든 custom Viz에서 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 실제 focus 상태로 확인했다.
- 실제 public closure의 수식 8개를 모두 explicit operation annotation으로 작성했다. Sample probability를 곱하고 log 합·평균 NLL로 바꾸는 이유, prefix conditional을 곱하는 이유, latent branch joint를 곱하고 숨은 branch를 더하는 이유, ELBO의 subtraction·gap addition, inverse Jacobian volume 보정, real density를 두 source 합으로 나누는 이유, Gaussian score의 minus, predicted noise의 부호 반전과 noise-scale division을 KaTeX 식 안에 직접 표시했다. Legacy 미주석 식 6개를 제거해 전역 수식은 1,129개 중 explicit 357개, 대기 772개가 됐다.
- 390px·1440px 실제 브라우저 12회에서 document·custom Viz·canvas·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 대표 주석식 8개가 9–311px 넘친 문제를 짧은 의미 행과 직접 이유 주석으로 분해해 main formula는 316/316, operation formula는 290/290에 맞췄다. 시작·마지막 장면 focused Viz와 full-page screenshots를 육안 검수했으며 topology는 `keep` 494·`rename-or-split-review` 2·`split-review` 44로 개선됐다.

## 2026-08-15 · Formal language · CFG/PDA · incremental parser · token mask · serving CRUD split

- 기존 `ai/grammar-constrained-generation` 한 글에 섞여 있던 alphabet·string·derivation, finite-state 한계·CFG recursion·PDA stack, Tree-sitter incremental parsing, grammar-tokenizer compilation·logit mask, dynamic schema cache·semantic policy를 다섯 독립 학습 arc로 분리했다. 기존 route는 formal language 기초로 좁히고 `ai/cfg-pushdown-automata`, `ai/incremental-parsing-tree-sitter`, `ai/grammar-tokenizer-decoding`, `ai/structured-generation-serving` 네 route를 생성했으며 legacy section 5개와 legacy Viz/data 4개를 파일까지 삭제했다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개의 owner·canonical href·stage·evidence를 실제 설명 route로 이동했다. 기존 relation이 대부분의 선수 흐름을 이미 표현해 node를 억지로 늘리지 않았고, dynamic schema cache 뒤에도 semantic approval이 필요하다는 `dynamic-schema-mask-cache → syntactic-semantic-validity-boundary` relation 1개만 보강했다. 공개 route·exact contract는 540→544개, graph는 2,407 concepts·3,651 relations이며 owner·isolation·stage invariant는 0이다.
- Symbol→alphabet→string→language→derivation, finite state→recursive production→push/pop stack, source→CST→edit reuse와 decoder 대비, grammar state·token bytes→bitmask→masked logits, request schema→compile key→sequence matcher→semantic policy를 도형·arrow·stack·mask로 표현한 responsive animated Viz 5개를 새로 만들었다. 기존 조악한 Viz는 재사용하지 않았고 실제 focus 상태에서 `ArrowRight` 장면 이동과 `Space` 자동 재생을 확인했다.
- 새 수식 3개를 explicit operation annotation으로 작성했다. 괄호를 열 때 미해결 의무를 더하고 닫을 때 최근 의무를 빼는 이유, token 전체 validity 수집→금지 logit −∞→exponentiation→softmax normalization, schema·tokenizer·engine identity를 각각 확인한 뒤 AND로 cache hit를 만드는 이유를 KaTeX 식 안에 직접 표시했다. 전역 수식은 1,131개 중 explicit 360개, 대기 771개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. 첫 모바일 검수에서 serving cache 주석식이 9px 넘친 문제를 네 의미 행으로 분해해 모든 main formula를 316/316, operation formula를 290/290에 맞췄다. Full-page screenshots 10장을 육안 검수했고 topology는 `keep` 499·`rename-or-split-review` 2·`split-review` 43으로 개선됐다.

## 2026-08-15 · Harness boundary · run contract · verification · ablation · control CRUD split

- 기존 `ai/llm-harness` 한 글에 섞여 있던 model/runtime 경계, run contract·context·capability·artifact, layered verification·effect evaluation, failure-layer ablation, workflow·agent·checkpoint·개선 loop를 다섯 독립 학습 arc로 분리했다. 기존 route는 proposal→authorization→execution→typed observation 기초로 좁히고 `ai/agent-run-contract`, `ai/agent-verification`, `ai/harness-failure-ablation`, `ai/agent-control-boundaries` 네 route를 생성했으며 actual closure에서 빠진 legacy section 5개와 legacy Viz 8개를 파일까지 삭제했다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 10개의 owner·canonical href·stage·cross-link를 실제 설명 route로 이동했다. 기존 relation 9개가 boundary→contract→verification→ablation→control의 선수 흐름을 이미 충분히 표현하므로 node·edge를 숫자 채우기용으로 추가하지 않았다. 공개 route·exact contract는 544→548개, graph는 2,407 concepts·3,651 relations이며 owner·isolation·stage invariant는 0이다.
- Proposal→runtime gate→executor→observation, objective/acceptance→context/capability→artifact/verifier→recovery, deterministic→environment→rubric→human, replay→layer→single change→release gate, workflow/agent→checkpoint→canary를 도형·arrow·layer·receipt로 표현한 새 responsive animated Viz 5개를 만들었다. 기존 조악한 Viz는 재사용하지 않았고 공통 scene control에서 `ArrowLeft`·`ArrowRight`와 `Space` 재생·일시정지를 지원한다.
- 새 수식 3개를 explicit operation annotation으로 작성했다. Run contract 필수 field를 AND로 묶는 이유, artifact·trajectory·effect·budget을 평균내지 않는 이유, candidate 개선에서 baseline을 빼고 기존 success regression gate와 결합하는 이유를 KaTeX 식 안 underbrace와 operation 식으로 직접 표시했다. 전역 수식은 1,133개 중 explicit 363개, 대기 770개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·canvas·대표식·operation 식 overflow, console warning/error, gradient·shadow·굵은 선이 모두 0임을 확인하고 full-page screenshot 10장을 육안 검수했다. Custom Viz에 focus한 뒤 `ArrowRight` 장면 이동과 `Space` 자동 재생 전환도 실제로 확인했다. Topology는 `keep` 504·`rename-or-split-review` 2·`split-review` 42로 개선됐다.

## 2026-08-15 · Claude Code product boundary CRUD split

- 기존 `ai/claude-code` 한 글에 섞여 있던 workspace harness, instruction·memory, subagent handoff, permission decision, hook lifecycle, checkpoint recovery를 여섯 독립 학습 arc로 분리했다. 기존 route는 model proposal과 runtime effect의 경계로 좁히고 `ai/claude-code-instructions-memory`, `ai/claude-code-subagents`, `ai/claude-code-permissions`, `ai/claude-code-hooks`, `ai/claude-code-checkpointing` 다섯 route를 생성했다. Actual import closure에서 빠진 legacy section·data·code reference·복제 source·legacy Viz 27개는 파일까지 삭제했다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 6개의 owner·canonical href·stage·editorial ownership·official evidence를 실제 설명 route로 이동했다. 기존 relation chain이 workspace→instruction·delegation→permission·hook→checkpoint 경계를 이미 충분히 표현하므로 숫자 채우기용 node·edge는 추가하지 않았다. 공개 route·exact contract는 548→553개, graph는 2,407 concepts·3,651 relations이며 owner·isolation·stage invariant는 0이다.
- Prompt→model→runtime→verify, source stack→current context→runtime gate, main→subagent→receipt→main verification, proposal→deny/ask/allow+hook, event→matcher→handler→output, tracked edit→rewind와 outside effect를 도형·arrow·scope box로 표현한 새 responsive animated Viz 6개를 만들었다. 기존 조악한 Viz는 재사용하지 않았고 흐름 전체를 옅게 유지하면서 현재 장면을 강조한다.
- 새 수식 6개를 explicit operation annotation으로 작성했다. Proposal·gate/execution·observation update, ordered instruction concatenation, handoff completeness AND, deny→ask→allow precedence, event·matcher·argument-filter resolution, file effect와 direct-edit trace의 교집합을 KaTeX 식 안 underbrace와 operation 식으로 직접 설명했다. 전역 수식은 1,139개 중 explicit 369개, 대기 770개가 됐다.
- 390px·1440px 실제 브라우저 12회에서 document·custom Viz·canvas·KaTeX error·console warning/error·gradient·shadow·굵은 선이 모두 0임을 확인했다. Permission 주석식의 첫 모바일 419px overflow를 네 의미 행으로 나눠 316/316으로 교정했다. Full-page 12장과 focused Viz·formula를 육안 검수했고 `ArrowRight` 장면 이동과 `Space` 재생·일시정지도 실제 확인했다. Topology는 `keep` 510·`rename-or-split-review` 2·`split-review` 41로 개선됐다.
- 기존 `reth-eip4844` 한 글에 섞여 있던 admission gate·BlobStore 수명주기·excess blob-gas fee feedback·reorg reinsert·release gate를 네 독립 학습 arc로 분리했다. 기존 route는 blob·commitment·transaction·sidecar 네 artifact 분리와 versioned-hash binding으로 좁히고 `reth-blob-admission`, `reth-blob-storage`, `eip4844-blob-fee`, `reth-blob-reorg-release` 네 route를 생성했다. `Overview.tsx`·`BlobPool.tsx`·`BlobStore.tsx`·`Kzg.tsx`·`BlobGas.tsx`·`Lifecycle.tsx`와 `codeRefs`·`fileTrees`·`codebase` legacy 파일은 실제 import closure에서 빠졌으므로 삭제하지 않고 참고 자료로만 남겼다.
- Article CRUD와 concept-graph CRUD를 같은 반복에서 수행했다. 기존 canonical concept 5개(`reth-blob-staged-admission`, `reth-blobstore-lifecycle`, `eip4844-excess-blob-gas-feedback`, `reth-blob-reorg-retention-boundary`, `reth-blob-release-gate`)의 canonical href를 새 route의 실제 설명 section으로 옮겼다. `eip4844-versioned-hash-binding`의 href도 삭제된 `#kzg` anchor에서 남은 글의 `#versioned-binding`으로 고쳤다. Editorial ownership manifest의 `reth-eip4844` 항목을 네 owns 항목으로 좁히고 `reth-blob-admission`·`reth-blob-storage`·`eip4844-blob-fee`·`reth-blob-reorg-release` 네 항목을 새로 등록했다. 기존 relation chain이 split→admit→retain→recover→release 경계를 이미 충분히 표현하므로 숫자 채우기용 node·edge는 추가하지 않았다. 공개 route·exact contract는 553→557개, graph는 2,407 concepts·3,651 relations이며 owner·isolation·stage invariant는 0이다.
- 큰 data를 execution transaction과 분리하는 boundary, bounded decode부터 KZG·resource gate까지의 admission 순서, key·bytes·digest·generation의 BlobStore artifact, parent excess·usage·target의 fee feedback, orphaned body와 sidecar receipt의 reorg reinsert를 각각 도형·gate·AND 흐름으로 표현한 새 responsive animated Viz 5개(`BlobBoundaryViz`, `BlobAdmissionViz`, `BlobStoreLifecycleViz`, `BlobFeeFeedbackViz`, `BlobReorgReleaseViz`)를 만들었다. 기존 조악한 `BlobGas`·`BlobPool`·`BlobStore`·`Kzg`·`Lifecycle` Viz는 재사용하지 않았다.
- 새 수식 5개를 explicit operation annotation으로 작성했다. Versioned-hash concatenation, admission AND gate, verified-hit AND 조건, excess update의 saturating subtraction, fast-reinsert AND/NOT 흐름을 KaTeX 식 안 underbrace와 operation 식으로 직접 설명했다. 전역 수식은 explicit 369→374개, 대기 770→768개가 됐다.
- 390px·1440px 실제 브라우저 10회에서 document·custom Viz·KaTeX error·console warning/error가 모두 0임을 확인했다. Reorg reinsert 식의 첫 모바일 395/316 overflow는 세 번째 underbrace 주석을 줄여 316/316으로 교정했다. Full-page 10장을 육안 검수했다. Topology의 `reth-eip4844` split-review 항목이 이번 분리로 해소되어 전체 `split-review`는 41→40으로 줄었다.
- 사용자 피드백으로 `ModernArticle` 패턴이 코드 분석형 글에서 실제 오픈소스 근거를 빼먹는다는 문제를 확인하고, `blog-rewrite-contract.md`에 `2.3 코드 분석형 글의 소스 근거`(CodeSidebar·CodeViewButton 필수), 수식 섹션에 explicit operation의 이유와 그래프 병행 기준을 추가했다. `reth-eip4844` 계열 5개 글에 `CodeSidebar`를 다시 연결하고, `validate_stateless`·`validate_eip4844`·`validate_blob_sidecar`·`BlobStore` trait·`insert_one`/`get_one`·delete/cleanup·`InMemoryBlobStore`·`BlobStoreCanonTracker`·reorg 재사용 검사·header blob-gas 불변식 두 개·`calc_excess_blob_gas`·`fake_exponential`·versioned-hash 계산까지 15개 CodeViewButton으로 실제 Reth 함수·줄 번호에 연결했다. 새 codeRefs·fileTree 파일 9개를 만들었고 기존 legacy codeRefs 파일은 그대로 참고용으로 남겼다.
- `eip4844-blob-fee`의 `integer-fee` section에 빠져 있던 fake-exponential recurrence의 `ExplainedFormula`를 새로 작성하고, excess/price 관계가 그래프로 더 잘 읽힌다는 피드백에 따라 `mafs` 기반 `BlobFeeCurveChart`(무차원화한 excess→price 지수 곡선, worked example 참조점 포함)를 추가했다. mafs 기본 테마가 site light/dark와 무관하게 검정 고정인 것을 발견해 `.themed-mafs` scoped override(비layer 규칙, mafs core.css도 layer 밖이라 그래야 이긴다)로 site token을 따르게 고쳤다.
- `tsc`, `build`, `audit:graph --strict`, 5개 글 각각 `audit:learning --strict --require-registration`, `audit:viz --strict`, route 회귀 테스트, 변경 파일 lint, Playwright 10회(1440/390px, CodeSidebar 열기·코드 가시성·console·overflow)가 모두 통과했다. Light/dark 모드 모두 육안 확인했다.
- 사용자가 `blockchain/reth`(Reth 아키텍처 개요)의 `RethArchitectureViz`를 지적했다 — 이름과 달리 실제로는 `<ol>` 텍스트 카드 5개였다(SVG·연결선·재생 없음). `viz-design-standard.md` 기준(Box·Arrow·AnimatedSceneControls, gradient/shadow 금지)에 맞춰 ingest→validate→execute→canonicalize→persist/read 5단계를 실제 애니메이션 SVG diagram으로 새로 작성했다. `Overview.tsx`의 호출부는 그대로 두고 컴포넌트만 교체해 diff를 최소화했다. `audit:learning --require-registration blockchain/reth`, `audit:graph --strict`, `audit:viz --strict`, Playwright 1440/390px(overflow 0, console 0) 전부 통과했다.
- 사용자가 CONCEPT FLOW MAP의 FOCUS storyboard(모든 공개 글 상단에 공유되는 `ArticleLessonFlowViz`)에서 컷을 넘길 때마다 viz 높이가 갑자기 바뀌어 불편하다고 지적했다. 컷마다 정의·형태·예시·경계 section이 mount/unmount되며 실측 높이가 1039px→976px처럼 널뛰는 것을 확인했고, 원인 section을 감싼 `motion.div`에 `layout="size"`를 추가해 높이 변화를 부드럽게 보간하게 했다(`prefers-reduced-motion`에서는 duration 0). 이 컴포넌트는 557개 공개 글 전체가 공유하므로 reth 계열 5개 + reth 외 대표 페이지에서 회귀를 확인했다.
- 사용자가 `ai/diffusion-models`에 L_simple의 ELBO 유도(MLE→ELBO 분해→closed-form posterior→mean-matching→ε reparameterization)가 빠져 있다고 지적했다. 확인 결과 이 글은 forward process·cumulative schedule·최종 loss는 정확했지만 그 사이를 잇는 유도 전체가 DDPM 논문 citation 한 줄로만 대체돼 있었다. `audit:graph`는 "이미 등록된 concept끼리의 정합성"만 검사하므로 애초에 유도 자체가 concept으로 등록되지 않으면 통과한다는 근본 원인을 확인하고, `blog-rewrite-contract.md`에 `2.4 결과 공식의 유도 완전성`(AI/ML에 한정하지 않고 암호학·물리·통계·분산 시스템 전체에 적용, DoD 체크리스트 1항목 추가)을 신설했다. `diffusion-variational-bound`·`diffusion-posterior-mean-matching` 두 concept을 knowledge graph에 등록하고 신규 `loss-derivation` section(ExplainedFormula 2개 + closed-form posterior LearningTerm)을 본문에 추가했다. Exercise는 정확히 6+4 고정 제약에 맞춰 기존 2개(스케줄 계산·ops 진단)를 신규 2개로 교체했다. `\text{}` 안에 literal ε·θ를 넣어 KaTeX가 "No character metrics" 경고를 내던 걸 발견해 단어로 바꿔 고쳤다. `tsc`, `build`, `audit:graph --strict`, `audit:learning --require-registration`, `audit:formula`, route 회귀 테스트, lint, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과했다.
- 사용자가 범위를 한 번 더 넓혔다 — "이해"뿐 아니라 "실제 구현"까지 어떤 concept이든 블로그만 읽고 가능해야 한다는 요구. `blog-rewrite-contract.md`에 `2.5 구현 가능성`을 신설(2.4 유도 완전성과 짝을 이루는 별도 축 — "왜 맞는가"와 "어떻게 짜는가"는 다른 질문이며, AI/ML에 한정하지 않고 암호 프로토콜·분산 합의처럼 절차가 핵심인 모든 concept에 적용). 언어 무관 pseudocode를 위한 `AlgorithmBlock`(`@/components/ui/algorithm-block`) 컴포넌트를 새로 만들었다 — CodeSidebar(실제 오픈소스가 어떻게 구현했는가)와 역할을 분리해, 이 컴포넌트는 "개념 자체를 처음부터 구현하려면 어떤 절차인가"를 담당한다. `diffusion-models`의 `loss-derivation` section 끝에 DDPM Training(6단계)·Sampling(3단계) 두 AlgorithmBlock을 추가해 이 글만 읽고 학습 loop와 생성 loop를 둘 다 코드로 옮길 수 있게 했다. 새 knowledge-graph concept은 없다(이미 등록된 `diffusion-training-sampling-contract` concept의 구현 절차를 채운 것). `tsc`, `build`, `audit:graph --strict`, `audit:learning`, `audit:viz`, lint, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과했다.
- 이번엔 사용자가 diffusion-models 자체("Diffusion 기초")가 실제로 다 커버하는지 되물었다. 검증 결과 (1) 방금 만든 Training AlgorithmBlock에 EMA weight update가 빠져 있었고(자체 발견 회귀), (2) latent-diffusion-guidance는 CFG만 있고 그게 대체한 원조 classifier guidance가 비교 대상으로도 없었고, (3) schedule section은 ᾱₜ 계산 mechanics만 있고 linear vs cosine 설계 선택(Improved DDPM이 linear의 문제를 고친 이유)이 없었고, (4) diffusion-continuous-time의 probability-flow ODE가 DDIM과 명시적으로 안 이어져 있었다(legacy 파일에만 "DDIM" 언급 존재, 실제 live page엔 없음). 넷 다 고쳤다: Training AlgorithmBlock에 EMA step 추가, latent-diffusion-guidance에 classifier guidance LearningTerm+비교 문단 추가, diffusion-models schedule section에 linear/cosine LearningTerm 추가, diffusion-continuous-time probability-flow section에 DDIM=discrete Euler step LearningTerm 추가. 사용자는 이 gap이 diffusion 고유 문제가 아니라 site 전반 패턴일 수 있다고 지적해, ai-foundations·ai-nlp·ai-generative·ai-vision·ai-llm-theory·ai-timeseries(~94개 글) 전체를 11개 클러스터로 나눠 병렬 에이전트로 같은 방식(concept마다 표준 기법 목록과 대조)으로 감사했다. math-foundations 클러스터는 에이전트 내부 위임 실패로 18개 중 3개만 실제 감사됨(재작업 필요). 나머지 10개 클러스터에서 확인된 gap 약 25개(20개 글) — 반복되는 패턴은 "이름은 나오는데 실제로 구현 가능한 절차·공식이 없다"였다. 우선순위 1번(diffusion이 참조하는 ELBO 정본 `latent-variable-generative-models`가 결과만 있고 Jensen 부등식 단계가 없음), 2번(`rlhf`의 PPO 식이 요구하는 advantage Â_t를 만드는 GAE 유도가 없음), 3번(`dpo`가 "Bradley–Terry에 대입하면 partition function이 상쇄된다"고 주장만 하고 실제 대입을 안 보여줌)을 처리했다 — 각각 새 ExplainedFormula 추가(Jensen 부등식 importance-weighting 유도, TD residual→GAE 재귀합, closed-form optimal policy→Bradley–Terry 대입→Z(x) 상쇄). `\text{}` 안 literal β 재발(같은 실수) 발견 후 즉시 교정. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(2개 글), lint, route 회귀 테스트, Playwright 3개 글 × 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 ~22개 gap은 우선순위대로 이어서 처리 예정.
- 우선순위 4·5번을 처리했다. `gan`: non-saturating loss는 이미 있었지만 실제 minimax alternating training loop(D를 k step 먼저, non-saturating G step)가 없어 AlgorithmBlock 추가. `vae`: training loop가 4박스 설명 카드뿐이라 encoder forward→reparameterize→decoder→L_recon+L_KL(closed-form)→backprop까지 실제 AlgorithmBlock으로 교체 추가. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(2개), `audit:viz --strict`, route 회귀 테스트, Playwright 2개 글 × 1440/390px 전부 통과. 남은 ~20개 gap 계속.
- 우선순위 6·7·8번을 처리했다. `gan-wasserstein-critics`: weight clipping의 capacity 문제가 citation 필드 한 줄뿐이라 실제 설명 문단 추가, gradient penalty의 interpolation 샘플링(x̂=εx+(1−ε)x̃) 자체가 수식에 없어 추가. `momentum-optimizer`: 사이트 전체에 Nesterov 언급이 전무해 look-ahead update 식과 함께 TermBreakdown 추가. `reverse-mode-autodiff`: reverse mode를 선호하는 이유가 비교 대상(forward-mode JVP, 수치미분) 없이 주장만 있어 둘 다 TermBreakdown으로 추가. `\text{}` 안 literal ε 재발 또 발견해 즉시 교정(세 번째) — 이 실수가 반복되는 패턴이라 계약에 정적 검사 추가를 고려할 만함. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(3개), lint, route 회귀 테스트, Playwright 3개 글 × 1440/390px 전부 통과. 남은 ~17개 gap 계속.
- 우선순위 9·10번을 처리했다. `cnn`: pooling이 Viz 라벨로만 존재하고 정의·공식이 전무해 max/average pooling TermBreakdown 추가(같은 output-size 식을 공유하되 aggregation만 다름을 명시). `resnet`: BatchNorm이 이름만 반복되고 메커니즘이 전무해 batch statistics→정규화→학습 가능한 γ·β 복원까지 ExplainedFormula 추가(train/eval mode 통계 차이 포함), post-activation(v1)과 pre-activation(v2) block의 정확한 연산 순서가 조각으로만 흩어져 있어 AlgorithmBlock으로 나란히 비교 추가. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(2개), lint, route 회귀 테스트, Playwright 2개 글 × 1440/390px 전부 통과. 남은 ~15개 gap 계속. 사용자가 감사 방법론을 한 번 더 일반화 — "표준 기법 목록과 대조"보다 "실제 정본 구현체(PyTorch·NumPy 등)와 대조"가 더 구체적인 완결성 기준이라는 지적. Math-foundations 재감사(15개 미완료분)에 이 기준을 적용할 예정. 계약 2.5절에 "표준 라이브러리 실제 구현과 대조"를 명시적 감사 기준으로 추가했다.
- 우선순위 11번(`score-based-generative-models`)을 처리했다 — diffusion의 noise-score identity(ε-prediction 특수 사례)만 있고, 그게 근거하는 일반 원리인 denoising score matching(tractable conditional score q_σ(x|x0)를 맞추는 것이 marginal score 학습과 같다는 Vincent 2011의 결과)이 없었다. ExplainedFormula로 추가.
- Math-foundations 18편을 새 방법론(실제 PyTorch/NumPy 구현체와 대조)으로 재감사 완료 — 이번엔 위임 실패 없이 한 agent가 전부 직접 확인했다. 14편은 문제 없음, 4편에서 실제 구현체 대조 gap 확인: `math-vectors-inner-products`(zero-vector 수학적 전제만 있고 `torch.nn.functional.normalize`의 eps 안정화 관례 없음), `math-matrices-svd`(full vs reduced SVD shape 구분 없음 — `full_matrices` 파라미터), `math-exponents-logarithms`(log-sum-exp/exp overflow 대응이 "다른 문제"라고 언급만 하고 실제로 안 풂 — 가장 흔한 수치안정화 패턴 미해결), `math-variance-sampling`(n−1 보정은 잘 설명했지만 `numpy.var`(ddof=0)와 `torch.var`(ddof=1) 기본값이 다르다는 실전 함정 언급 없음). 네 gap 모두 처리: `math-vectors-inner-products` Projection에 normalize eps 관례 추가, `math-matrices-svd` Svd에 full/reduced shape TermBreakdown 추가, `math-exponents-logarithms` Overview에서 log-sum-exp 언급을 softmax 정본 글로 실제 연결(이미 거기 max-subtraction trick이 있어 중복 대신 링크), `math-variance-sampling`에 numpy/torch ddof 기본값 불일치 문장 추가. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(4개), lint, route 회귀 테스트, Playwright 4개 글 × 1440/390px 전부 통과. 사용자 지시로 이후 남은 gap은 중단 없이 연속 처리.
- 우선순위 12·13번을 처리했다. `grammar-tokenizer-decoding`: A(s)={i:valid(s,vi)}가 정의만 있고, 5만~15만 vocabulary를 매 decode step마다 어떻게 효율적으로 계산하는지(이 글의 핵심 크럭스)가 없어서 trie 기반 grammar-walk pruning AlgorithmBlock 추가. `cfg-pushdown-automata`: 괄호 깊이 카운터 하나뿐이고 실제 CFG→PDA 표준 construction(stack에 grammar symbol을 쌓고 nonterminal은 production으로 치환, terminal은 input과 매칭)이 없어서 AlgorithmBlock 추가. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(2개), lint, route 회귀 테스트, Playwright 2개 글 × 1440/390px 전부 통과.
- 우선순위 14·15번을 처리했다. `mixture-of-experts`: routing bias·capacity와 나란히 auxiliary loss가 "쏠림을 억제한다"고 문단으로만 설명되고 실제 Switch-Transformer/GShard load-balancing loss 식(hard 배정 비율 f_i, soft router 확률 P_i, 이 둘을 곱해 더한 L_aux=αNΣf_iP_i가 균등 분배에서 최소가 되는 이유)이 없어서 ExplainedFormula 추가. `sparse-autoencoder`: "dead latent"가 release-gate 체크리스트와 citation 문제 필드에 이름만 등장하고 왜 죽는지(encoder가 학습 activation에 한 번도 반응하지 않아 ReLU/Top-K gate가 0에 고정되고 gradient가 영원히 끊기는 메커니즘)와 실무에서 어떻게 되살리는지(주기적 reinit, revival auxiliary loss)가 전무해 TermBreakdown 추가. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(2개), lint(사전 존재하던 무관한 `\m` escape 경고 1건 확인, 이번 diff와 무관), route 회귀 테스트, Playwright 2개 글 × 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 우선순위 gap(`transformer-architecture`·`bert-mlm-corruption`·`word2vec-prediction-objectives`·`word2vec-negative-sampling`·`autoencoder` 계열·`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 16번(`transformer-architecture`)을 처리했다. Training recipe section이 "AdamW와 warmup을 쓴다"는 나열 수준이었고 (1) `TrainingRecipeViz`가 "warmup · peak LR · decay"를 라벨로만 보여줄 뿐 실제 Noam schedule 식이 없었고, (2) dropout이 site 어디서도 정확한 위치(sub-layer residual 직전, embedding+positional 합 직후) 없이 언급조차 없었고, (3) weight initialization(Xavier uniform, embedding scale, depth 기반 residual projection 보정)이 전무했고, (4) label smoothing이 이름조차 없었다. `Training.tsx`에 Noam LR schedule ExplainedFormula(warmup 선형 증가 항과 역제곱근 감쇠 항을 min으로 잇는 이유)와 dropout 배치·weight init TermBreakdown을 추가했고, `LinearSoftmax.tsx`의 기존 next-token cross-entropy 식 바로 뒤에 label smoothing ExplainedFormula(one-hot을 (1-ε)·δ+ε/K로 바꿔 정답 logit이 무한히 커지지 않게 만드는 이유)를 추가했다. 이 과정에서 LaTeX macro가 든 `symbol` 필드를 plain 문자열로 써 JS 이스케이프가 한 겹 부족해지는 새 실수를 발견해(런타임에 `\epsilon` 대신 깨진 문자로 렌더링될 뻔함) `String.raw` 백틱으로 즉시 교정했다 — 사이트 관례(`symbol: String.raw\`...\``)를 벗어난 첫 사례라 기록해 둔다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`bert-mlm-corruption`·`word2vec-prediction-objectives`·`word2vec-negative-sampling`·`autoencoder` 계열·`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 17번(`bert-mlm-corruption`)을 처리했다. 80/10/10 비율 자체와 그 기대값 계산은 이미 정확했지만 "왜 [MASK] 하나만 쓰지 않는가"라는 설계 이유가 어디에도 없었다. TermBreakdown 두 항목을 추가했다 — (1) [MASK]는 downstream fine-tuning·inference 입력에 절대 등장하지 않는 인공 기호라 100% [MASK]로만 corruption하면 pretrain/finetune input 분포가 어긋난다는 점, (2) unchanged·random branch가 없으면 model이 "선택 안 된 위치는 보이는 값이 곧 정답"이라 안심해 그 자리의 contextual representation을 깊게 만들 필요가 없어지므로, 겉보기에 멀쩡한 token도 오염됐을 수 있다는 불확실성을 남겨 모든 위치의 representation을 강건하게 만든다는 점. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`word2vec-prediction-objectives`·`word2vec-negative-sampling`·`autoencoder` 계열·`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 18번(`word2vec-prediction-objectives`)을 처리했다. Hierarchical softmax section이 "path decision probabilities의 곱"이라는 문장뿐이고 실제 leaf 확률 곱 공식도, tree를 어떻게 구성하는지도 없었다(binary tree라고만 하고 Huffman이라는 이름조차 없었음). ExplainedFormula로 root-to-leaf sigmoid 곱 공식(각 internal node에서 기준 자식 여부로 부호를 정하고 그 node의 벡터와 input word 벡터 내적에 sigmoid를 씌운 값들을 path를 따라 곱함)을 추가했다. 이어서 AlgorithmBlock으로 Huffman tree 구성 절차(frequency 기준 min-heap에서 가장 작은 두 node를 반복해서 묶음)를 추가하고, 뒤에 이 greedy 병합이 가중 경로 길이를 최소화한다는 Huffman의 고전적 보장과, 자연어 frequency의 극단적 skew 때문에 흔한 단어에 짧은 경로를 몰아주는 것이 balanced tree보다 학습 1회당 평균 sigmoid 연산 수를 더 줄인다는 이유를 문단으로 연결했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`word2vec-negative-sampling`·`autoencoder` 계열·`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 19번(`word2vec-negative-sampling`)을 처리했다. Frequent-word subsampling section이 "고빈도 token occurrence 일부를 제거한다"는 TermBreakdown 설명뿐이고 실제 discard-probability 식이 전무했다(negative sampling의 3/4 power 식은 이미 있었으나 subsampling 식만 빠져 있었음). ExplainedFormula로 P_discard(w)=1-√(t/f(w)) 식(threshold 대비 relative frequency 비율을 만들고 제곱근으로 완만하게 한 뒤 1에서 빼 흔한 단어일수록 큰 폐기 확률로 뒤집는 이유)을 추가했다. Contract 2.5의 "실제 구현체와 대조" 기준에 따라 원 논문 식과, 공개된 word2vec.c의 keep-probability 식이 수학적으로 다르다고 알려져 있다는 실전 재현 함정도 assumptions에 남겼다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`autoencoder` 계열·`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 20번(`autoencoder` 계열 — `autoencoder`·`linear-autoencoder-pca`·`denoising-masked-autoencoders`·`reconstruction-anomaly-detection` 4편 중 대표 정본 `FoundationArticle.tsx`)을 처리했다. 두 gap을 확인했다 — (1) tied/untied encoder-decoder weight가 계열 전체에서 전무했고(linear-autoencoder-pca의 "encoder와 decoder를 M으로 묶는다"는 표현은 weight tying이 아니라 두 linear map의 합성이라 다른 개념), (2) BCE loss가 "Bernoulli probability를 예측한다"는 문장으로만 언급되고 실제 식은 MSE만 완전히 유도돼 있었다. Bottleneck section에 tied weights(W_d=W_e^T로 decoder weight를 encoder의 transpose로 고정해 parameter를 절반으로 줄이고 PCA와 비슷한 정규화 효과를 내는 이유, nonlinear activation이 있으면 정확한 inverse가 아니라는 경계)와 untied weights를 비교하는 TermBreakdown을 추가했다. Reconstruction section의 MSE ExplainedFormula 바로 뒤에 BCE ExplainedFormula(coordinate별 negative log-likelihood를 합산·평균하는 이유, 예측이 정답과 반대 극단일 때 log가 발산해 MSE보다 날카로운 gradient를 만드는 이유)를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`deep-learning-overview`·`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 21번(`deep-learning-overview`)을 처리했다. Depth composition ExplainedFormula(h_1=φ_1(x), h_2=φ_2(h_1), ŷ=φ_3(h_2))는 있었지만 φᵢ가 왜 nonlinear여야 하는지가 사이트 어디에도 없었다 — depth·representation reuse·depth-separation 이론까지 다루면서도 "선형 층만 쌓으면 층 하나와 표현력이 같다"는 가장 기초적인 이유가 빠져 있었다. 기존 formula 바로 뒤에 두 번째 ExplainedFormula를 추가해, φᵢ를 선형(Wᵢh)이라 가정하면 h_2=W_2(W_1x)=(W_2W_1)x=Wx로 행렬 결합법칙에 따라 두 층의 합성이 다시 하나의 선형 map으로 붕괴한다는 걸 증명하고, 이것이 activation function이 존재하는 근본 이유라고 interpretation에 명시했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 남은 gap(`constitutional-ai`)은 중단 없이 이어서 처리.
- 우선순위 22번(`constitutional-ai`, 이번 감사 목록의 마지막 항목)을 처리했다 — SL-CAI(critique·revise supervised phase)와 RL-CAI(AI preference RL phase) 두 단계가 citation block과 본문에 "critique하고 revise한다", "AI preference를 RL에 쓴다" 정도의 한 문장으로만 반복 언급되고 실제 절차는 어디에도 없었다. `alignment-methods/ConstitutionalAI.tsx`에 AlgorithmBlock 두 개를 추가했다 — SL-CAI(초기 model 응답 생성→constitution에서 원칙 sampling→critique→revise를 여러 원칙에 걸쳐 반복→최종 수정본으로 pretrained model을 supervised fine-tuning)와 RL-CAI(SL-CAI model에서 응답 쌍 sampling→AI feedback model이 원칙 기준으로 비교 판정→preference data 누적→reward model 학습→PPO 등으로 RL fine-tuning). 이 글은 `constitutional-ai` route에서만 재사용되는 걸 확인했다. Python heredoc으로 여러 줄 code 문자열을 만들다 `\n` escape가 실제 개행으로 치환되며 문자열이 깨지는 새 실수가 있었고(비raw python 문자열의 흔한 함정) 곧바로 `\n` escape로 교정했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과. 이로써 AI 이론 완결성 감사(~25개 gap, 20개 글)에서 확인된 우선순위 목록을 모두 처리했다. 다음 단계로 vLLM 4개 글(`vllm-serving`·`vllm-scheduler`·`vllm-paged-attention`·`vllm-spec-decode`)에 실제 오픈소스 근거(CodeSidebar) 연결 작업을 이어서 시작한다.

## 2026-08-18 · vLLM CodeSidebar 소스 근거 연결

- vLLM 4개 글 전체에 CodeSidebar·CodeViewButton·codeRefs·fileTree가 전무하다는 걸 확인했다(reth-eip4844와 동일한 gap). vLLM은 실존하는 오픈소스이므로 `v0.27.1` tag(가장 최근 non-rc 정식 릴리스)를 기준으로 실제 GitHub raw source를 받아 검증한 뒤, reth와 같은 방식(진짜 함수·변수명·제어 흐름은 보존하되 본문이 다루는 범위로 발췌·trim하고 한글 주석을 추가)으로 vendoring하기로 정했다. 원본 `scheduler.py`의 `schedule()`은 encoder input·speculative decode·DP prefill balancing·mamba 정렬까지 합쳐 800줄이 넘는 단일 method라, 본문이 이미 다루는 두 hard feasibility 조건(token budget, KV block 확보)만 남기고 나머지는 주석으로 명시해 생략했다.
- `vllm-serving`(첫 번째 글)을 먼저 끝까지 완성해 site 전체에 처음 쓰는 Python CodeSidebar 배선 패턴을 검증했다. 이 article family는 reth-eip4844처럼 단일 `ModernArticle.tsx`가 아니라 top-level assembly(`vllm-serving.tsx`)가 `Overview`·`EngineLoop`·`ServingArchitecture` 세 section 파일을 조립하는 구조라, `reth-txpool.tsx`가 쓰던 기존 site 관례(top-level에 `useCodeSidebar`+`CodeSidebar`를 두고 `onCodeRef` prop을 각 section에 내려주는 패턴)를 그대로 따랐다. `EngineLoop.tsx`의 "Iteration-level scheduling의 hard feasibility" `ExplainedFormula`(n_tok≤B_tok, n_seq≤B_seq, M_KV^need≤M_KV^free) 바로 뒤에 실제 `Scheduler.schedule()`의 RUNNING queue 순회 발췌(token budget 차감 → KV block 할당 시도 → 실패 시 낮은 우선순위 request preempt 후 재시도)를 연결하는 `CodeViewButton` 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) + CodeSidebar가 실제로 열리고 코드·경로가 렌더되는지 별도 클릭 테스트까지 전부 통과. 나머지 3개 글(`vllm-scheduler`·`vllm-paged-attention`·`vllm-spec-decode`)에 같은 패턴을 이어서 적용한다.
- `vllm-scheduler`(두 번째 글, section 3개: ScheduleMethod·PrefillDecode·Preemption)를 완성했다. 실제 `Scheduler.schedule()`·`_preempt_request`·`Request.__lt__`·`PriorityRequestQueue`(모두 v0.27.1)를 검증하며 확인한 점: (1) ScheduleMethod의 priority lexicographic order 식이 실제 `Request.__lt__`와 정확히 일치했고, 실제 코드는 식에 없는 request_id→object id 추가 tie-break으로 완전한 전순서를 보장한다는 사실도 함께 발견해 annotation에 남겼다. (2) PrefillDecode의 `C=⌈P/c⌉` 식의 c가 실제로는 `long_prefill_token_threshold`라는 config 값이고, chunk로 자른 뒤에도 남은 token_budget으로 한 번 더 clip한다는 순서까지 실제 코드로 확인했다. (3) Preemption의 recomputation-waste 식이 가정한 "재개 시 counter가 0으로 리셋된다"는 전제가 실제 `_preempt_request`의 `num_computed_tokens=0` 대입과 정확히 일치했다. Section 4개 중 3개(ScheduleMethod·PrefillDecode·Preemption)에 CodeViewButton 4개(priority-ordering, priority-queue는 file tree로만 연결, preempt-chunk, preempt-request)를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 3개를 각각 새 페이지에서 클릭해 코드·경로가 렌더되는지 확인(모두 katexErrors 0, console 0) 전부 통과. 나머지 2개 글(`vllm-paged-attention`·`vllm-spec-decode`)에 이어서 적용한다.
- `vllm-paged-attention`(세 번째 글, section 3개: BlockPoolSection·KVCacheManagerSection·PrefixCaching)을 완성했다. 실제 `BlockPool.touch`/`free_blocks`·`hash_block_tokens`·`SingleTypeKVCacheManager.get_num_blocks_to_allocate`(모두 v0.27.1)를 검증하며 확인한 점: (1) BlockPoolSection의 `evictable(b) ⟹ ref(b)=0` 불변식이 실제로는 `touch()`(참조 생기면 free queue에서 제거)와 `free_blocks()`(ref_cnt가 정확히 0이 될 때만 free queue로 복귀)라는 두 함수의 짝으로 구현돼 있었다. (2) PrefixCaching의 `H_i=Hash(H_{i-1}, x_i, e_i)` 식이 실제 `hash_block_tokens()`의 `(parent_block_hash, curr_block_token_ids_tuple, extra_keys)` 튜플 해싱과 정확히 일치했다. (3) KVCacheManagerSection의 `m^alloc=max(0, ⌈n/B⌉-m^owned)` 식은 실제 `get_num_blocks_to_allocate()`의 `cdiv` 계산과 일치했지만, 실제 코드는 hybrid model(SWA·chunked-local)의 admission cap 분기를 추가로 갖고 있어 그 부분은 명시적으로 생략(주석 표기)했다 — 본문이 이미 "단일 full-attention cache group을 설명하는 개념 식"이라고 스스로 경계를 그은 것과 정확히 일치. Section 3개 전체에 CodeViewButton 3개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 3개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 마지막 글(`vllm-spec-decode`)에 이어서 적용한다.
- `vllm-spec-decode`(네 번째이자 마지막 글, DraftVerify section)를 완성했다. 실제 `RejectionSampler`의 `rejection_random_sample_kernel`(v0.27.1, Triton GPU kernel)을 검증했다 — production 코드는 batch 전체를 병렬 처리하는 kernel이라 pointer 인자·synthetic-mode·greedy 조기 종료 분기를 갖고 있어, 이를 생략하고 한 request 관점의 순수 로직만 남긴 Python 버전으로 발췌했다(원 파일 상단 주석에 생략 사실을 명시). 확인한 점: (1) DraftVerify의 `a(x)=min(1,p(x)/q(x))` accept 판정이 실제로는 `target_prob/draft_prob >= uniform_prob`라는 미리 뽑아 둔 uniform 난수와의 비교 하나로 구현돼 있었고, 이 둘이 확률적으로 동치라는 이유를 annotation에 남겼다. (2) `I_i=∏R_j`(첫 거부 이후 prefix 중단) 식이 실제로는 `rejected` flag 하나로 구현되어 있었다 — 한 번 거부되면 이후 loop가 판정 없이 넘어가고, 전부 수락됐을 때만 bonus token을 추가한다는 점까지 정확히 일치했다. EagleMtp section은 설계 공간 비교(EAGLE·MTP·SpecInfer)와 손익분기식 위주라 특정 함수 하나로 환원되지 않아 이번엔 grounding 대상에서 제외했다(과도한 발췌보다 실제로 대응되는 부분만 정확히 근거를 다는 편이 낫다고 판단). CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과.
- 이로써 vLLM 4개 글 전체에 CodeSidebar 소스 근거 연결을 마쳤다 — 총 12개 CodeViewButton, vendored 실제 vLLM v0.27.1 소스 8개 파일(scheduler.py 2벌·request.py·request_queue.py·block_pool.py·kv_cache_utils.py·single_type_kv_cache_manager.py·rejection_sampler.py). 매 grounding마다 본문 수식·불변식을 실제 코드와 1:1로 대조하는 과정에서 (a) 논문/개념 formula에는 없는 실제 구현만의 추가 규칙(우선순위 tie-break, hybrid model admission cap)을 발견해 annotation으로 남기거나, (b) 코드가 본문 주장을 정확히 뒷받침한다는 사실을 확인할 수 있었다 — 둘 다 이 작업이 단순 장식이 아니라 실질적인 완결성 검증이었음을 보여준다. AI 카테고리의 오픈소스 구현체 기반 code-grounding 감사(사용자가 명시적으로 스코프한 "AI에서 오픈소스 구현체들") 대상은 이것으로 완료했다.
- 사용자가 "transformer, diffusion 등 읽고 나면 수식·코드 이해와 구현이 다 가능한지" 물어, 확인 없이 단정하는 대신 실제 코드를 점검했다. `transformer-architecture`는 InputEmbedding·QKVComputation(attention+mask)·FeedForward(pre/post-norm 포함)·LinearSoftmax·Training(schedule·dropout·init·label smoothing) 등 조각마다 ExplainedFormula가 이미 충분히 있었지만, 이 조각들을 실제로 한 줄씩 이어 붙여 "token ID에서 logits까지" 만드는 단일 AlgorithmBlock이 없었다 — 즉 "왜 맞는가"는 있는데 "어떻게 조립해서 짜는가"의 마지막 한 단계가 빠져 있었다(diffusion-models는 이 조립형 AlgorithmBlock이 이미 있어 대조군이 됨). `Summary.tsx`에 embedding+PE → (attention residual → FFN residual) × num_layers → 최종 norm → output projection까지, 앞 section들이 정의한 정확한 기호(A=softmax(QKᵀ/√d_k+M), y_pre=x+F(Norm(x)), FFN(x_t)=W_2φ(W_1x_t+b_1)+b_2, z_t=h_tW_vocab+b)를 그대로 참조하는 forward-pass AlgorithmBlock을 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px(katexErrors 0, console 0, overflow 0) 전부 통과.
- 사용자가 "코드 이해가 실제 프로덕션 코드를 읽는 걸 말한다면 transformer/diffusion에는 그게 없다"고 지적하며 범위를 넓혀 달라고 요청했다. vLLM 4편처럼 한 편당 실제 오픈소스 조사·발췌·검증에 시간이 상당히 든다는 점을 안내하고 범위를 물어, "주요 아키텍처/알고리즘 글만(15~20편, PyTorch 코어·torchvision·HuggingFace 등에서 실제 코드 근거)"로 확정했다. 첫 번째로 `transformer-architecture`를 완성했다 — PyTorch v2.13.0(최신 stable release)을 기준으로 실제 소스를 검증하며 `torch.nn.functional.scaled_dot_product_attention`의 공식 문서(docstring)에 실린 "Efficient implementation equivalent to the following" 참조 구현이 QKVComputation의 A=softmax(QKᵀ/√d_k+M), Y=AV 식과 정확히 일치함을 확인했고, `torch.nn.modules.transformer.TransformerEncoderLayer.forward`의 `norm_first` 분기(및 `_sa_block`·`_ff_block`)가 FeedForward의 y_pre=x+F(Norm(x))/y_post=Norm(x+F(x)) 식과 방금 추가한 forward-pass AlgorithmBlock 둘 다를 실제 코드로 정확히 뒷받침한다는 것도 확인했다. 원본 forward는 fused fastpath(NestedTensor·autocast·hook 감지) 최적화 분기가 크게 자리잡고 있어 그 부분은 명시적으로 생략(주석 표기)하고 실제 residual+norm 계산만 발췌했다. CodeViewButton 2개(QKVComputation·Summary)를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 남은 "주요 아키텍처" 목록(diffusion-models·cnn·resnet·attention-theory·bert·rnn·lstm·gan·vae 등)에 같은 패턴을 이어서 적용한다.
- 두 번째로 `diffusion-models`를 완성했다. HuggingFace diffusers v0.39.0(최신 stable release)의 `DDPMScheduler.add_noise`·`step`을 검증했다. `add_noise`는 Training AlgorithmBlock의 `x_t = √ᾱ_t·x0 + √(1-ᾱ_t)·ε` closed-form 줄과 완전히 동일했다. `step`은 Sampling AlgorithmBlock의 μ_θ 식과 다른 parameterization을 썼다 — article은 DDPM 논문 formula 11(ε_θ를 직접 대입해 정리한 식)을, diffusers는 formula 15로 x̂0을 먼저 복원한 뒤 formula 7로 mean을 합성하는 방식을 쓰는데, 대수적으로 같은 값을 내는 서로 다른 표현이라는 점을 annotation에 명시했다 — 실제 코드 대조가 아니었다면 놓쳤을 차이다. `step()`은 원래 v_prediction·thresholding·learned-variance 등 여러 설정 분기를 갖고 있어 article이 다루는 epsilon-prediction 경로만 남기고 나머지는 생략(주석 표기)했다. "t=1이면 z=0"이라는 article의 결정론적 마지막 step 처리도 실제 코드의 `if t > 0` 분기와 정확히 일치했다. CodeViewButton 2개(Training·Sampling AlgorithmBlock 각각 바로 뒤)를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 남은 목록(cnn·resnet·attention-theory·bert·rnn·lstm·gan·vae 등)에 이어서 적용한다.
- 세 번째로 `cnn`을 완성했다. PyTorch v2.13.0을 검증했다. Convolution formula(Y=b+ΣWX)는 `F.conv2d`가 native fused kernel이라 직접 대응하는 pure-Python 코드가 없지만, `nn.Unfold` 공식 문서(docstring)가 "Convolution is equivalent with Unfold + Matrix Multiplication + Fold"라는 실행 가능한 참조 예제를 `(F.conv2d(inp,w)-out).abs().max()` 검증 코드와 함께 직접 싣고 있다는 걸 확인해, 이 문서 예제를 grounding으로 썼다 — patch 추출(Unfold)→행렬곱→재배치(Fold) 세 단계가 article의 P_cuv 선택→M_ocuv 곱→Y_opq 합산과 정확히 대응한다. H_out 식은 실행 코드 대신 `Conv2d` class 공식 docstring의 Shape 명세를 grounding으로 썼다 — article의 H_out=⌊(H+2P-D(K-1)-1)/S+1⌋과 LaTeX까지 byte 단위로 동일해, "계산 코드는 아니지만 공식 계약 자체가 근거"라는 점을 desc에 명시했다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 남은 목록(resnet·attention-theory·bert·rnn·lstm·gan·vae 등)에 이어서 적용한다.
- 네 번째로 `resnet`을 완성했다. torchvision v0.28.0의 `BasicBlock`·`Bottleneck.forward`와 `zero_init_residual`을 검증했다. Architecture의 [v1] post-activation AlgorithmBlock이 실제 forward 순서(conv→bn→relu 반복 후 identity를 더하고 마지막에 ReLU)와 정확히 일치했고, 이미 본문이 언급했던 두 세부사항(ResNet v1.5의 stride를 3×3 conv에 두는 변형, zero_init_residual로 마지막 BN weight를 0으로 초기화)이 실제 코드 주석·구현에도 그대로 있음을 확인했다 — 특히 v1.5 stride 배치는 torchvision 소스 주석이 논문과 NVIDIA 참조까지 명시하며 본문 설명과 문장 단위로 일치했다. [v2] pre-activation 쪽은 torchvision core가 기본 제공하지 않는 별도 논문(Identity Mappings, He et al. 2016) 구현이라는 걸 실제 코드 대조로 확인해 grounding에서 명시적으로 뺐다(v1만 grounding). CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(attention-theory·bert·rnn·lstm·gan·vae·word2vec 등)에 이어서 적용한다.
- 다섯 번째로 `attention-theory`를 완성했다. transformer-architecture가 이미 SDPA 자체(A=softmax(QKᵀ/√d_k+M), Y=AV)를 grounding했으므로, 중복을 피하고 이 글만의 SelfAttention section(Q=XW_Q/K/V 투영과 multi-head split·concat·W_O)을 grounding 대상으로 골랐다. PyTorch v2.13.0의 `_in_projection_packed`(self-attention 분기)와 `multi_head_attention_forward`의 head 분할·SDPA·병합 부분을 검증했다. Q,K,V projection은 article처럼 세 개의 별도 행렬이 아니라 [3E,E] packed weight 하나로 한 번의 linear 연산에서 만든다는 걸 확인해 annotation에 남겼다(수학적으로는 동일). Multi-head 부분은 view로 head를 나누고 head마다 SDPA(transformer-architecture 글과 같은 함수)를 호출한 뒤 permute+reshape로 다시 합치고 out_proj를 통과시키는 순서가 article의 Q_h,K_h,V_h→a_h→Concat→YW_O와 정확히 일치했다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 남은 목록(bert·rnn·lstm·gan·vae·word2vec 등)에 이어서 적용한다.
- 여섯 번째로 `bert`를 완성했다. HuggingFace transformers v5.15.0을 검증했다. `eager_attention_forward`가 article의 s_ij=q_i^⊤k_j/√d → additive mask → softmax → h_i=Σα_ij·v_j 순서와 정확히 일치했다. Visible-key set V_i={j:m_j=1}이 실제로 어디서 오는지 확인하려고 파고들었더니, 최신 transformers는 causal·padding·packed-sequence mask를 vmap 기반 factory로 조합하는 훨씬 복잡한 시스템으로 리팩터링되어 있었지만, padding mask만 떼어 보면 `padding_mask_function`의 핵심 규칙은 `return padding_mask[batch_idx, kv_idx]` 한 줄로 article의 V_i 정의와 그대로 같았다 — 복잡한 real 구현 뒤에 숨은 간단한 규칙을 확인한 사례. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 남은 목록(rnn·lstm·gan·vae·word2vec 등)에 이어서 적용한다.
- 일곱 번째로 `rnn`을 완성했다. PyTorch v2.13.0의 `RNNCell`을 검증했다. 실제 elementwise 연산(a_t=W_ih·x+b_ih+W_hh·h+b_hh, tanh)은 `_VF.rnn_tanh_cell`이라는 native(C++) 함수 하나로 실행돼 CNN 때처럼 pure-Python 계산 코드는 없었지만, class의 공식 docstring이 `h'=tanh(W_ih x+b_ih+W_hh h+b_hh)`을 정확히 명시하고 있어(article의 a_t=W_xh x_t+W_hh h_{t-1}+b_h, h_t=tanh(a_t)와 변수 이름만 다른 같은 식) 이를 grounding으로 삼고, `__init__`의 실제 weight_ih·weight_hh shape와 forward의 실제 dispatch 호출까지 함께 보여 "수식 자체는 문서가, wiring은 실제 코드가 근거"라는 걸 desc에 명시했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(lstm·gru·gan·vae·word2vec·seq2seq 등)에 이어서 적용한다.
- 여덟 번째로 `lstm`을 완성했다. PyTorch v2.13.0의 `LSTMCell`을 검증했다. 공식 docstring이 명시한 네 gate 식(i,f,g,o)이 Gates의 f_t=σ(a_f), i_t=σ(a_i), g_t=tanh(a_g), o_t=σ(a_o)와 정확히 일치했고, cell/hidden update(c'=f⊙c+i⊙g, h'=o⊙tanh(c'))도 Overview의 C_t=f_t⊙C_{t-1}+i_t⊙g_t, h_t=o_t⊙tanh(C_t)와 그대로 일치했다. 흥미롭게도 Gates.tsx가 이미 "gate 네 개를 별도 matmul로 그려도 구현에서는 하나로 fuse하는 이유"라는 문장을 갖고 있었는데, 실제 코드의 `num_chunks=4`(weight_ih shape가 `4*hidden_size`)가 정확히 이걸 보여줘 기존 서술이 실제 구현과 딱 맞아떨어짐을 확인했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(gru·gan·vae·word2vec·seq2seq 등)에 이어서 적용한다.
- 아홉 번째로 `gru`를 완성했다(`lstm/Variants.tsx`를 공유하는 구조라 두 글에 걸쳐 영향). PyTorch v2.13.0 `GRUCell`을 검증하다가 실제 코드 대조가 아니었으면 놓쳤을 진짜 불일치를 발견했다 — article의 candidate 식 h̃_t=tanh(W_hx_t+U_h(r_t⊙h_{t-1})+b_h)는 reset gate를 h_{t-1}에 먼저 곱한 뒤 행렬곱(U_h)을 적용하는 반면, 실제 PyTorch의 n=tanh(W_in x+b_in+r⊙(W_hn h+b_hn))은 행렬곱을 먼저 계산한 결과 전체에 reset gate를 곱한다 — 행렬곱이 elementwise 곱에 분배되지 않으므로 이 둘은 대수적으로 다른 함수다. Article은 이미 "reset 적용 위치는 구현마다 다르다"는 경고를 갖고 있었는데, 이 경고를 막연한 문구에서 구체적인 실제 사례(PyTorch nn.GRUCell)로 교체했다. `Variants.tsx`가 `lstm`과 `gru` 두 글에서 재사용되므로 `onCodeRef`/`codeRefs`를 optional prop으로 만들어 gru.tsx만 실제로 버튼을 렌더링하게 했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`(gru·lstm 둘 다), lint(0 error), route 회귀 테스트, Playwright 두 route 모두 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(gan·vae·word2vec·seq2seq 등)에 이어서 적용한다.
- 열 번째로 `gan`을 완성했다. torch/torchvision·transformers 코어가 아니라 공식 `pytorch/examples` repo의 `dcgan/main.py`(commit cc8e404, 2025-05-13 기준, tag가 없는 rolling repo라 commit SHA로 고정)를 검증했다. Training AlgorithmBlock의 D→G 순서, 두 번의 D backward(real/fake), non-saturating G loss가 실제 코드와 정확히 일치했다 — 특히 `fake.detach()`가 D update에서 G의 계산 그래프까지 역전파하지 않게 끊는 지점, 그리고 non-saturating trick이 실제로는 "G step에서 label을 real로 뒤집어 BCE를 최소화"하는 형태로 구현되어 article이 이미 설명한 "log(1-D(G(z)))를 내리는 대신 log D(G(z))를 올림"과 정확히 동치임을 확인했다. Article이 다음 section에서 예고했던 "detach와 움직이는 상대"가 정확히 이 두 번째 D(fake) 호출에서 detach 유무 차이임을 실제 코드로 확인했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(vae·word2vec·seq2seq 등)에 이어서 적용한다.
- 열한 번째로 `vae`를 완성했다. 공식 `pytorch/examples`의 `vae/main.py`(commit fcce71c)를 검증했다. reparameterize()가 article의 z=μ+σ⊙ε와, loss_function의 BCE+KLD가 article의 L_recon+L_KL과 정확히 일치했다 — 특히 KLD 계산식(`-0.5*sum(1+logvar-mu.pow(2)-logvar.exp())`)은 article의 L_KL=-½Σ(1+log σ²-μ²-σ²)와 부호까지 완전히 같았고, 실제 코드 주석이 같은 VAE 논문(Kingma & Welling 2014) Appendix B를 인용하고 있어 유도 출처까지 일치를 확인했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(vae/Training.tsx의 사전 존재하던 무관한 `\p`·`\m` escape 경고 2건 확인, 이번 diff와 무관), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과. 남은 목록(word2vec·seq2seq 등)에 이어서 적용한다.
- 열두 번째로 `word2vec`을 완성했다. PyTorch v2.13.0의 `nn.Embedding`을 검증했다. article이 이미 "구현은 같은 결과를 sparse gather로 계산합니다"라고 명시한 문장이 실제로 참인지 확인했다 — `Embedding.forward`→`F.embedding`→`torch.embedding`(native) 경로 전체가 one-hot vector를 실제로 만들거나 W와 matmul하지 않고 index 기반 gather만 수행했고, 공식 docstring도 "simple lookup table...using indices"라고 이미 그렇게 설명하고 있어 article의 주장과 정확히 일치했다. v_w=o_w^⊤W라는 수식은 개념 설명이고 실제 실행 경로가 아니라는 점을 annotation에 명시했다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과.
- 사용자가 "진행해"로 계속을 확인해 13번째로 `vision-transformer`를 완성했다. torchvision v0.28.0의 `VisionTransformer`를 검증했다. PatchEmbedding의 두 번째 식(patch flatten+matmul ≡ Conv2d(kernel=stride=P))이 실제 `conv_proj = nn.Conv2d(in_channels=3, out_channels=hidden_dim, kernel_size=patch_size, stride=patch_size)` 그 자체였다 — CNN 글에서 다뤘던 "Unfold+matmul ≡ conv2d" 등가성의 반대 방향(실제 ViT 구현이 matmul 대신 Conv2d를 쓰는 이유)을 확인한 셈이다. 첫 번째 식의 Z_0=[e_cls;e_1;...;e_N]도 `forward()`의 `torch.cat([batch_class_token, x], dim=1)`과 정확히 일치했다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과.
- 14번째로 `mixture-of-experts`를 완성했다. HuggingFace transformers v5.15.0의 Mixtral 구현(`MixtralTopKRouter`·`MixtralExperts.forward`)을 검증했다. Router 식(z=W_r x, p_i=softmax, T_k(x)=TopK(p,k))이 실제 코드와 정확히 일치했지만, article 식에는 없는 실제 세부사항을 발견했다 — 실제 구현은 top-k 선택 뒤 그 k개만 다시 정규화해 합을 1로 맞춘다(전체 n개 기준 softmax 값을 그대로 mixture weight로 쓰지 않음). Combine 식(y(x)=Σp_i(x)E_i(x))도 실제 `index_add_` 기반 dispatch→compute→combine 루프와 정확히 일치했고, 이미 본문이 설명했던 "expert별로 정렬해 연속 buffer를 만들고 dispatch·combine한다"는 문장이 실제 코드의 one-hot mask+index_add_ 패턴 그 자체임을 확인했다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(사전 존재하던 무관한 `\m` escape 경고 1건 확인, 이번 diff와 무관), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과.
- 15번째로 `adam-optimizer`를 완성했다. PyTorch v2.13.0의 `torch.optim.adam._single_tensor_adam`을 검증했다. RNN/LSTM과 달리 이 핵심 연산은 native 함수 하나로 뭉쳐 있지 않고 실제로 순수 PyTorch tensor 연산(lerp_, mul_, addcmul_, addcdiv_)으로 작성돼 있어 article의 m_t, v_t, bias correction, θ 업데이트 네 식과 한 줄씩 정확히 대조할 수 있었다. article 식에는 없는 실제 구현 최적화도 발견했다 — m̂_t를 별도 tensor로 만드는 대신 그 bias correction을 learning rate 쪽으로 접어 넣은 step_size로 계산해(η·m̂_t = step_size·m_t와 수학적으로 동일) tensor 할당을 하나 줄인다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과. 이로써 "주요 아키텍처/알고리즘" 목표 범위(15~20편)의 하한을 달성했다.
- 사용자가 "더 이어가"로 계속을 확인해 16번째로 `momentum-optimizer`를 완성했다. PyTorch v2.13.0의 `torch.optim.sgd._single_tensor_sgd`를 검증했다. Adam처럼 이 핵심 연산도 순수 tensor 연산(mul_, add_)으로 작성돼 있어 v_t=β v_{t-1}+g_t, θ_{t+1}=θ_t-η v_t와 한 줄씩 정확히 대조됐다. 이 글이 이미 갖고 있던 hedge("구현마다 look-ahead를 적용하는 순서가 다를 수 있어 실제 library 문서와 대조해야 합니다")를 실제 PyTorch 코드로 구체화했다 — article이 소개한 classic Nesterov(θ_{t-1}-β v_{t-1} 지점에서 gradient를 다시 계산)와 달리 실제 PyTorch는 새로 만든 v_t를 momentum 배율로 현재 gradient에 더하는 Sutskever formulation을 써서, look-ahead 지점의 gradient를 다시 구하지 않고도 대수적으로 동등한 효과를 낸다. CodeViewButton 2개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 2개 클릭 테스트(모두 katexErrors 0, console 0) 전부 통과.
- 17번째로 `kv-cache-fundamentals`를 완성했다. HuggingFace transformers v5.15.0의 `repeat_kv` — GQA/MQA를 쓰는 모든 모델이 공통으로 재사용하는 유틸 함수 — 를 검증했다. 실제 shape(batch, num_key_value_heads, seqlen, head_dim)이 article의 K,V∈R^{T×H_KV×D_head}와 정확히 일치했고, article이 prose로만 설명한 group 크기 g=H_Q/H_KV가 실제 코드에서는 `n_rep` 인자로 그대로 등장해 각 KV head를 n_rep번 복제(`expand`+`reshape`)함으로써 H_Q=H_KV×g를 만든다는 걸 확인했다. `expand`가 실제 memory를 복사하지 않고 broadcast view만 만든다는 점도 annotation에 남겼다. CodeViewButton 1개를 추가했다. `tsc`, `build`, `audit:graph --strict`, `audit:learning`, lint(0 error), route 회귀 테스트, Playwright 1440/390px + 버튼 클릭 테스트(katexErrors 0, console 0) 전부 통과.
