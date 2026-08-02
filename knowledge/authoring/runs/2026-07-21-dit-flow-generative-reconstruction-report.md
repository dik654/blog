# DiT·Flow Matching·생성 평가 재구성 보고서

## 1. 관찰

생성 모델 분류에는 생성 이론, VAE, GAN, Diffusion과 여러 공개 모델 글이 있었지만, 최신 image model을 읽을 때 필요한 backbone, probability path, training target, numerical solver와 평가 budget이 한 흐름으로 연결되지 않았다. `Diffusion Models`의 현대 계보 표는 이름과 한 줄 요약을 주었지만, 독자가 새 모델의 실제 차이를 판정하기에는 부족했고 기존 기초 설명과 현재 연구 사이의 경계도 모호했다.

## 2. 비공개 전이 문제

동일 제품 후보로 DDPM U-Net 30 NFE, rectified-flow MMDiT 28 NFE, teacher trajectory를 배운 four-step student를 받았다고 가정했다. 세 번째 후보는 prompt마다 9장을 만들고 reranker가 고른 결과만 제시한다. 작성된 글만으로 무엇이 동시에 바뀌었는지, 어느 ablation이 필요한지, NFE와 wall-clock이 왜 다른지, 품질·coverage·composition·runtime gate와 versioned manifest를 어떻게 설계할지 판단할 수 있어야 한다. 이 문제는 본문에 문제 문항으로 노출하지 않고 section coverage 검사에만 사용했다.

## 3. 범위 결정

- 새 글은 표현 공간, backbone, path·target, solver, 평가 계약의 다섯 축을 소유한다.
- DDPM forward/reverse, U-Net, CFG의 기초는 기존 `Diffusion Models`가 소유한다.
- ODE의 Euler·Heun·오차는 수치 적분 글, patch attention은 ViT, latent bottleneck은 VAE로 내려간다.
- GAN은 별도 minimax 학습 문제이므로 current-first diffusion 경로의 강제 선행으로 묶지 않는다.
- Ideogram, Krea, FLUX 같은 제품·모델은 이름 목록으로 필수 글을 만들지 않고 공개된 다섯 계약과 관측 가능한 runtime evidence가 달라질 때만 현재 글 위에 추가한다.

## 4. 1차 근거에서 확인한 사실

- DiT는 VAE latent를 patch token으로 바꾸고 Transformer block에서 timestep·class condition을 주입한다. 해상도, VAE factor와 patch size가 token 수와 dense attention pair를 함께 바꾼다.
- MMDiT는 image와 text stream의 projection·normalization·MLP를 분리하고 joint attention에서 정보를 교환한다.
- Conditional Flow Matching은 전체 marginal field를 직접 계산하는 대신 data-noise pair에서 바로 계산한 conditional velocity를 회귀하며, training target 생성에 ODE simulation이 필요 없다는 뜻이지 generation에 solver가 사라진다는 뜻이 아니다.
- Straight conditional path도 여러 coupling이 중간 위치에서 교차하면 marginal field는 휘거나 모호해질 수 있다.
- Solver step, NFE와 end-to-end wall-clock은 서로 다른 측정값이다. Guidance batching, model size, kernel, precision, VAE와 hardware를 함께 pin해야 한다.
- Few-step student는 기존 checkpoint의 timestep list만 줄인 artifact가 아니다. Teacher trajectory, student target과 weight가 모두 달라질 수 있다.
- FID 하나는 fidelity와 coverage, compositional binding, human preference와 runtime을 분리하지 못한다. Best-of-k는 model weight가 아니라 candidate budget과 reranker를 합친 system 평가다.

## 5. 구현과 검증

다섯 Viz는 설계 계약 비교, latent-to-token 비용, conditional path crossing, solver·NFE trade-off, multi-gate release와 best-of-k budget을 각각 독립적인 상태 변화로 보여 준다. 다섯 display 수식은 항 역할을 수식 안에 한글로 표시하고 바로 아래에서 계산 의도와 기호를 설명한다. 평가 gate의 pass·fail은 특정 모델 실측치가 아닌 가상 후보라는 표기를 추가했다.

Focused ESLint와 production build가 통과했다. Playwright에서 생성 category의 현재-first topology, 다섯 Viz, formula note, KaTeX parse, interaction과 source 구분을 검사해 3개 집중 검사가 통과했다. 390, 768, 1440px에서 document와 다섯 figure의 horizontal overflow는 0이었고, 390px formula minimum scale은 0.82였다. 개별 desktop·mobile screenshot으로 선 두께, label wrapping, 여백과 정보 계층을 확대 검토했다.

Learning-flow audit는 등록 572, global continuity 572, authored path assignment 242를 기록했다. 전체 corpus의 formula gap 137, missing prerequisites 411, local connection backlog 465는 후속 P3·P2 작업으로 남는다.

## 6. Claude 협업 기록

첫 wide review는 출력 없이 종료되어 검토 성공으로 세지 않았다. 범위를 content spec과 단일 본문으로 줄인 Claude Sonnet 검토는 blocker를 찾지 않았고, CFG 미정의, adaLN-Zero mechanism, mixed precision, reverse integration의 Δt 부호, local truncation error가 초심자에게 비약이 될 수 있다고 지적했다. 다섯 항목을 모두 본문에 풀어 썼다. 시각 계약은 Claude 판단으로 대체하지 않고 Playwright interaction, 수치 overflow와 실제 screenshot으로 별도 검증했다.

## 7. 작은 모델 재실행 경계

4B worker에는 한 번에 source claim 하나와 다섯 계약 중 한 축만 준다. 출력은 `claim`, `why`, `equation_terms_ko`, `boundary`, `required_visual_state`로 제한한다. 9B reviewer에는 다섯 worker 결과와 비공개 전이 문제를 주고, 동시 변경 축, 잘못된 인과 귀속, history over-expansion, metric blind spot과 missing manifest field만 검사시킨다. 전체 route order, notation 통일, responsive layout과 release 판정은 상위 orchestrator가 담당한다.
