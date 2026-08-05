# Generative core Claude closure

## 목적

과거 Context Manager HTTP 500으로 누락됐던 71개 article-level 검토는
`2026-07-23-claude-review-final-identity-audit`에서 true-Claude 71/71로 이미 닫혔다.
이번에는 그 원장 이후 별도로 재구성된 생성 모델 다섯 글과 두 학습 경로를 추가로 감사했다.

- `generative-theory`
- `vae`
- `gan`
- `diffusion-models`
- `dit-flow-matching-evaluation`
- `ai-generative-current-first`
- `ai-generative-core`

Context Manager 결과는 첫 transport header가 `[claude-code:sonnet`으로 시작할 때만
Claude 검토로 채택했다. Timeout, headerless response와 fallback은 제외했다.

## 검토 분할

넓은 네 요청 중 두 건은 180초 timeout으로 폐기했다.

- 생성 이론 + VAE broad audit: timeout 180410ms
- GAN + Diffusion audit: `[claude-code:sonnet · L2 · $0.0000 · 153407ms]`
- DiT·Flow와 두 path audit: `[claude-code:sonnet · L2 · $0.0000 · 126875ms]`
- 전체 UI broad audit: timeout 180495ms

실패 범위를 article 또는 한 시각 책임으로 줄인 L1 worker로 다시 보냈다.

- 생성 이론 사실 감사: `[claude-code:sonnet · L1 · $0.0000 · 119866ms]`
- VAE 수식 감사: `[claude-code:sonnet · L1 · $0.0000 · 119532ms]`
- 생성 이론 UI: `[claude-code:sonnet · L1 · $0.0000 · 104302ms]`
- VAE UI: `[claude-code:sonnet · L1 · $0.0000 · 143613ms]`
- GAN UI: `[claude-code:sonnet · L1 · $0.0000 · 137557ms]`
- Diffusion UI: `[claude-code:sonnet · L1 · $0.0000 · 87442ms]`

## 확인하고 수정한 결함

1. `LatentRoute`가 VAE와 Normalizing Flow를 같은 intractable posterior 문제의 변형처럼
   설명했다. VAE는 posterior를 encoder로 근사하고, Flow는 가역 변환과
   change-of-variables로 posterior 근사 자체를 없앤다는 경계로 고쳤다.
2. Flow likelihood 식을 별도 한글 주석 수식과 `FormulaNote`로 추가했다.
3. GAN 변형 표가 WGAN-GP를 설명하면서 원 WGAN만 인용했다. Gulrajani et al. 2017의
   gradient penalty 1차 출처를 추가했다.
4. 여섯 switcher가 `role=tab`만 선언하고 `tabpanel`, roving focus와 방향키 계약을
   제공하지 않았다. 공통 `useArticleTabs` hook을 추가하고 Arrow, Home, End,
   `aria-controls`, `aria-labelledby`, focus-visible panel을 연결했다.
5. VAE Gaussian plot, latent coverage plot과 GAN mode plot의 SVG 내부 10~11 unit
   label이 390px에서 5~7px로 축소됐다. 모든 정보 label을 12px HTML로 옮기고 SVG는
   geometry만 소유하게 했다.
6. DiT `Segmented`가 두 선택지도 세 열로 그려 빈 칸을 만들었다. 선택지 수를 CSS grid
   column 수로 직접 사용하게 했다.
7. 생성 평가가 한 축과 다섯 축 모두 고정 다섯 열을 사용했다. `auto-fit/minmax`로
   visible axis 수와 너비에 맞게 배치했다.
8. 평가 상태가 색과 비슷한 warning icon에 의존했다. `통과`, `실패`, `주의`를
   카드 안에 직접 표시했다.
9. DiT Viz의 9~10px 설명문을 모두 12px 이상으로 올리고 두 toggle의 현재 상태를
   `구조 · MMDiT`, `평가 범위 · 전체 gate`처럼 명시했다.

## 최종 Claude closure

- Flow 사실 경계: `[claude-code:sonnet · L1 · $0.0000 · 41122ms]`, PASS
- Tab contract 1차 재감사: `[claude-code:sonnet · L1 · $0.0000 · 128114ms]`,
  panel `tabIndex=0` 누락 확인 후 수정
- SVG label 재감사: `[claude-code:sonnet · L1 · $0.0000 · 25624ms]`, PASS
- DiT UI 재감사: `[claude-code:sonnet · L1 · $0.0000 · 131571ms]`,
  dynamic grid·status·font finding 확인 후 수정
- Tab contract closure: `[claude-code:sonnet · L1 · $0.0000 · 98097ms]`, PASS
- DiT UI closure: `[claude-code:sonnet · L1 · $0.0000 · 31517ms]`, PASS
- VAE SVG closure: `[claude-code:sonnet · L1 · $0.0000 · 52013ms]`, PASS
- 두 학습 경로 closure: `[claude-code:sonnet · L1 · $0.0000 · 119987ms]`, PASS

## 경로 판정

두 path는 통폐합하지 않는다.

- `ai-generative-current-first`: DiT·Flow·few-step·평가에서 시작해 DDPM, ODE,
  ViT와 VAE로 내려가는 top-down 최소 기반 경로
- `ai-generative-core`: 분포 학습의 공통 질문에서 VAE, GAN, Diffusion을 비교하는
  bottom-up taxonomy 경로

GAN을 current-first path의 강제 역사로 넣지 않는다. `diffusion-models`의 현대 구조
preview와 `dit-flow-matching-evaluation`의 다섯 축 해부는 teaser/deep-dive 관계로
유지한다.

## 작은 모델 재실행 계약

4B worker에는 한 번에 article 하나와 다음 책임 중 하나만 준다.

- formula sign과 source boundary
- 한 section의 question → mechanism → trade-off
- 한 interactive component의 상태와 responsive contract
- 한 path의 current goal → prerequisite 연결

9B reviewer에는 4B 결과와 실제 코드 일부만 주고 다음만 판정시킨다.

- 서로 다른 모델 계열을 같은 문제로 잘못 묶었는가
- formula와 prose가 서로 모순되는가
- path가 현재 목표와 최소 기반을 뒤섞는가
- control state, status와 visual label이 색·크기에만 의존하는가

최종 orchestrator는 Claude identity header, primary source, Playwright browser measurement와
screenshot을 서로 다른 증거로 유지한다.

## 검증

- Targeted ESLint: pass
- `git diff --check`: pass
- Local Playwright: 7/7
- 390/768/1440: horizontal overflow 0
- Raw LaTeX 0, KaTeX error 0
- 390px minimum formula scale: 0.82
- DiT interactive text minimum: 12px
- Production build: 8,874 modules, 18.21s, pass
- Existing large-chunk advisory only; build failure 아님
- `cm-blog.service`: active, 2026-07-24 21:23:35 KST
- Category + five article routes: HTTP 200
- Production Playwright: 7/7
