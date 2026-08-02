# Computer Vision 학습 경로 재구성 보고서

이 문서는 모델 이름을 시대순으로 늘어놓은 기록이 아니다. 최신 visual system에서 먼저 필요한 출력 계약을 정하고, detector·vision-language alignment·backbone으로 내려가며 어디에서 어떤 가정이 깨지는지를 독자가 본문만으로 판단하게 만든 과정이다. 같은 이름의 JSON은 4B·9B 모델이 한 번에 작은 계약만 맡아 후속 글을 같은 방식으로 개선하도록 만든 실행 packet이다.

## 1. 기존 구성이 체계적으로 보이지 않은 이유

기존 Computer Vision 목록에는 CNN, ResNet, ViT, DETR, CLIP과 최신 promptable 모델이 함께 있었지만 세 종류의 축이 섞여 있었다.

- **제품 질문**: 무엇을 찾고, 어떤 좌표·마스크·track을 반환할 것인가?
- **모델 계열**: detector, promptable segmentation, vision-language model 중 무엇을 쓸 것인가?
- **표현 기반**: convolution, residual path, patch token과 attention이 어떻게 feature를 만드는가?

그래서 글이 많아도 한 글의 출력이 다음 글의 입력으로 이어지지 않았다. 새 모델 논문을 읽을 때도 “무엇이 좋아졌다”는 표는 볼 수 있지만 vocabulary, coordinate frame, duplicate suppression, feature resolution, memory budget을 어디서 검산해야 하는지 알기 어려웠다.

이를 다음 네 branch로 다시 나눴다.

1. `00 · 작업 계약`: 모델보다 먼저 task, input, output, coordinate, release gate를 고정한다.
2. `01 · Promptable · Tracking`: prompt·mask·identity가 시간축에서 유지되는 조건을 읽는다.
3. `02 · Object Detection`: closed/open vocabulary, box query, matching, duplicate와 post-processing 경계를 읽는다.
4. `03 · 표현 · Backbone 기반`: CLIP alignment에서 ViT patch, ResNet residual path, CNN local operator까지 필요한 만큼 내려간다.

최소 바닥은 영상처리 역사의 첫 논문이 아니다. 현재 transfer problem을 풀 때 필요한 첫 계산 단위인 convolution에서 멈추며, sampling theory나 optics가 실제 실패 원인일 때만 더 낮은 수학·물리 글을 연다.

## 2. 글별 책임과 연결

- `vision-system-contracts`: 자연어 요구를 task, label vocabulary, geometry, latency와 abstention 계약으로 바꾼다.
- `object-detection-systems`: detector family를 나열하지 않고 closed/open vocabulary, query matching, duplicate와 release manifest로 나눈다.
- `clip-vision-language-model`: paired batch에서 image/text embedding을 정렬하는 계산과 zero-shot vocabulary의 이점, localization을 보장하지 않는 경계를 함께 설명한다.
- `deformable-detr`: dense attention 대신 여러 scale에서 선택한 sampling point만 읽는 계산과 head·point index를 복원한다.
- `vision-transformer`: image를 patch token budget으로 바꾸고 global/window/hierarchical backbone 선택이 해상도 비용을 어떻게 바꾸는지 설명한다.
- `resnet`: 단순한 “gradient vanishing 해결” 구호를 버리고 degradation problem, identity gradient path, projection shortcut과 shape contract를 구분한다.
- `cnn`: 한 output cell의 cross-correlation부터 local connectivity, weight sharing, dilation, output geometry와 receptive field를 계산한다.

`ai-computer-vision-current-first` 경로는 위 책임을 현재 작업에서 최소 기반 방향으로 잇는다. 개별 질문이 있는 기존 글은 유지하되, parent 화면은 모든 후손을 평평하게 펼치지 않고 네 branch와 authored path를 먼저 보여 준다.

## 3. 원문 근거와 주장 경계

- PyTorch `Conv2d` 공식 문서: 실제 구현의 cross-correlation, stride·padding·dilation·groups와 output shape 정의에 사용했다. convolution이 자동으로 translation invariance를 보장한다고 확대하지 않았다.
- He et al. `Deep Residual Learning`과 `Identity Mappings in Deep Residual Networks`: degradation experiment, residual update와 identity path에 사용했다. 모든 최적화 문제를 shortcut 하나가 해결한다고 쓰지 않았다.
- Liu et al. `A ConvNet for the 2020s`: 현대 convolutional backbone의 설계 비교에 사용했다. ConvNeXt가 모든 데이터·예산에서 Transformer보다 우월하다고 일반화하지 않았다.
- Dosovitskiy et al. `An Image is Worth 16x16 Words`: patch embedding, class token과 encoder 구조에 사용했다. 원 논문의 large-scale pretraining 결과를 작은 데이터의 보편 법칙으로 옮기지 않았다.
- Liu et al. `Swin Transformer`: shifted window와 hierarchical representation의 역할에 사용했다. window attention 자체가 장면 전체 관계를 언제나 보존한다고 쓰지 않았다.
- Radford et al. `CLIP`: paired contrastive objective와 zero-shot transfer 범위에 사용했다. image-level alignment를 detection·grounding 보증으로 바꾸지 않았다.
- Caron et al. `DINOv2`: pretraining objective와 backbone architecture를 분리해 읽는 사례로 사용했다. 모든 downstream task의 automatic production readiness로 확대하지 않았다.
- Carion et al. `DETR`, Zhu et al. `Deformable DETR`, Grounding DINO와 SAM 공식 원문: set prediction, sparse sampling, open-set grounding과 promptable mask의 책임을 구분하는 데 사용했다.

## 4. 본문만으로 풀어야 하는 비공개 전이 문제

### CNN fixture

3840×2160 생산 영상에서 폭 2px인 scratch를 찾아야 하지만 입력을 224×224로 축소한 뒤 정확도가 높게 나온다. 독자는 평균 정확도보다 먼저 scratch가 sampling 과정에서 사라지는지, kernel의 실제 입력 연결이 무엇인지, stride·padding·dilation이 output size와 receptive field를 어떻게 바꾸는지 계산해야 한다. 결론은 큰 backbone 교체보다 input crop·tiling·native-resolution contract를 먼저 고치는 것이다.

### ResNet fixture

56×56×64 feature를 28×28×128 stage로 바꾸면서 residual addition을 해야 한다. 독자는 identity shortcut을 그대로 더할 수 없음을 shape로 판별하고 stride 2 projection shortcut을 선택해야 한다. 또한 shortcut이 왜 gradient의 additive path를 만들지만 학습 성공을 자동 보증하지 않는지 설명해야 한다.

### ViT fixture

1024×1024 영상을 P=16과 P=8로 처리한다. 독자는 token 수가 4,096에서 16,384로 4배, dense attention pair가 16배가 됨을 계산하고 작은 defect가 필요하다고 무조건 P=8을 고르는 대신 tiling, window/hierarchical attention과 feature pyramid 조건을 비교해야 한다.

### System fixture

사용자가 “화면의 빨간 부품을 계속 추적해 불량이면 정지”라고 요구한다. 독자는 red가 fixed class인지 text prompt인지, box·mask·track 중 출력이 무엇인지, pixel coordinate가 resize 전후 어느 frame인지, latency와 false stop 비용, confidence가 낮을 때 abstain/review/stop 중 무엇을 할지 release manifest로 고정해야 한다.

## 5. 수식과 Viz 계약

모든 표시 수식은 수식 내부 한글 역할 주석과 바로 뒤 `FormulaNote`를 가진다. 모바일에서는 긴 의미 단위를 `aligned` 행으로 분리하고, 최소 최종 글자 12px와 horizontal overflow 1px 이하를 browser oracle로 고정했다.

- `ConvolutionProbeLab`: 한 output cell을 선택하면 실제 receptive patch와 kernel product를 함께 표시한다.
- `ConvolutionGeometryLab`: stride·padding·dilation을 바꾸면 output size와 receptive field가 같이 변한다.
- `ResidualPathLab`: plain, identity residual, projection residual을 전환해 data path와 gradient path를 분리한다.
- `ResidualStageLab`: channel·resolution이 바뀔 때 addition shape contract가 통과하는지 판정한다.
- `PatchBudgetLab`: input size와 patch size에 따른 token·attention pair 비용을 비교한다.
- `VisionBackboneLab`: global, window, hierarchical backbone의 context, cost와 output contract를 같은 화면에서 비교한다.
- System·Detection·CLIP labs: vocabulary, coordinates, duplicate, retrieval와 grounding failure를 실제 조작 상태로 노출한다.

고정 폭 SVG와 장식용 직선을 새 foundation 글에서 제거하고 CSS grid, `min-width: 0`, 안정된 panel dimension과 semantic color를 사용했다. 색은 구조=파랑, 통과=초록, 보류=주황, 실패=빨강 역할에만 쓴다. 자동 animation은 전체 본문 재구성이 끝난 뒤 개념 전환을 설명하는 곳에만 추가한다.

## 6. Context-manager 협업 기록

사용자 지시대로 direct Claude CLI는 사용하지 않았다.

1. Computer Vision의 IA·원문·본문 감사를 context-manager `ai-researcher`에 두 차례 새 요청했으나 모두 HTTP 500 `Provider error: All providers failed`로 끝났다.
2. `Claude only, do not substitute` 조건으로 `cm_route_delegate`를 요청했을 때 routing shell은 응답했지만 실제 Claude 결과 없이 `CLAUDE_UNAVAILABLE`만 반환했다. 다른 모델의 리뷰를 Claude 리뷰로 간주하지 않았다.
3. CNN·ResNet·ViT 재작성 뒤 독립 감사를 다시 `ai-researcher`에 요청했으나 같은 provider 500이 반복됐다.

따라서 Claude가 내용을 검토했다고 기록하지 않는다. 이번 배치는 원 논문·공식 문서의 claim boundary, 세 비공개 전이 문제, 157개 Playwright 회귀와 21개 viewport audit로 닫았다. Provider가 복구되면 같은 bounded packet을 재전송해 독립 감사를 추가한다.

## 7. 4B·9B 모델용 재현 packet

4B 모델에는 한 계산 또는 한 실패 경계만 준다.

```text
제품 질문 1개
-> primary source excerpt와 허용 claim 1개
-> 금지 extrapolation 1개
-> input/output shape fixture 1개
-> 계산 또는 decision 1개
-> failure state 1개
-> interactive Viz state 1개
-> formula annotation·390px overflow·console oracle
```

예: “56×56×64를 28×28×128로 바꾸는 residual block”만 주고 shortcut type, shape invariant, 잘못된 addition state와 테스트를 생성하게 한다.

9B 모델에는 한 artifact handoff를 준다.

```text
task contract
-> model family decision
-> representation geometry
-> competing design and trade-off
-> hard transfer fixture
-> abstention/release rule
-> source boundary
-> prose/formula/Viz/test packet
```

오케스트레이터는 네 branch 순서, 공통 용어, minimum stopping line과 배포 증거를 유지한다. 작은 모델 출력은 장문 prose보다 먼저 `claim/evidence/boundary/input/output/invariant/failure/viz_state/test` JSON으로 받아 검산한다.

## 8. 추론을 구현으로 바꾼 과정

숨은 사고 과정을 복제하지 않고 재현 가능한 의사결정만 남긴다.

1. **관찰**: model·task·backbone 목록이 한 level에 섞여 다음 글로 넘어갈 이유가 보이지 않았다.
2. **가설**: 제품 output contract에서 representation primitive로 내려가면 최신 논문과 기반 글이 같은 축으로 연결된다.
3. **근거 분리**: detection, open vocabulary, alignment, patch, residual, convolution의 원문 claim을 각각 허용 범위와 함께 고정했다.
4. **최소 바닥 설정**: 현재 fixture를 풀 수 있는 convolution에서 멈추고 더 과거의 역사는 기본 경로에서 숨겼다.
5. **전이 문제 설계**: 해상도 손실, residual shape mismatch, quadratic patch budget을 정답 암기 없이 계산하게 했다.
6. **구현**: sidebar metadata, authored learning path, 세 foundation 본문, system/detection/CLIP 본문과 responsive lab을 같은 계약으로 바꿨다.
7. **검증**: formula pairing, font, scale, document overflow, interaction, raw table, console, route order를 Playwright로 고정했다.
8. **배포 기록**: bundle hash와 local/public contract를 남겨 재배포 여부를 추측하지 않게 한다.

## 9. 검증과 현재 상태

- Production Vite build: 통과.
- 관련 정보 구조·본문·수식 회귀: `157/157` 통과.
- Foundation 재구성 전용: `9/9` 통과.
- Formula/Viz QA: `4/4` 통과.
- Computer Vision visual audit: 7 routes × 3 viewports, error 0, warning 0.
- Computer Vision narrative audit: 7 routes × 3 viewports, error 0, warning 0.
- 수동 시각 검토: 390, 768, 1440px. 문서·수식 잘림 없음.
- `git diff --check`: 통과.
- `build:tsc`: 기존 corpus의 unrelated type error 때문에 실패. 이번 파일은 Vite production build와 browser contract를 통과했다.
- 공개 Computer Vision contract: `19/19` 통과.
- 공개 HTTP: category와 핵심 article 6개 모두 200.
- `cm-blog.service` 재시작: 2026-07-23 02:16:11 KST.
- 공개 route chunk 7개의 SHA-256이 로컬 production build와 모두 일치했다.

전체 corpus의 다음 미완료 경로가 남아 있으므로 formal goal은 완료 처리하지 않는다.
