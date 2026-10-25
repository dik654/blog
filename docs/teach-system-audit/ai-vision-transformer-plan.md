# Vision Transformer 재작성 계획

## 문서 카드

- 트랙: concept
- 형식: explanation
- 매체: article
- 독자: 이미지 분류 흐름은 알지만 ViT의 입력 shape가 어떻게 만들어지는지 아직 연결하지 못한 학습자
- 질문: 224×224×3 이미지는 어떻게 197개 token의 Transformer 입력이 됩니까?
- 답: 이미지를 16×16 patch 196개로 나누고, 같은 projection으로 각 patch를 D차원 token으로 바꾼 뒤 위치와 `[CLS]`를 더하면 길이 197의 sequence가 됩니다.
- 읽은 뒤 할 수 있는 일: 입력 해상도·patch 크기가 token 수와 attention 비용, checkpoint position grid에 미치는 영향을 계산하고 torchvision 구현의 shape 변화를 따라갑니다.
- 범위 밖: 특정 제품 환경의 backbone 선택, latency·memory SLO, export와 rollout 절차. `/cs/ai/vision-backbone-selection`과 `/cs/ai/transfer-learning-practice`로 연결합니다.
- 진실 상태: 논문·torchvision v0.28.0 소스로 확인한 현재 설명. 예시는 ViT-B/16의 대표 shape를 쓰지만 특정 서비스의 측정값은 아닙니다.

## 독자 순서

1. 부모 지도에서 ViT가 차지하는 위치를 찾습니다.
2. 224×224×3 → 14×14 patch grid → 196×D → 197×D → K logits 전체 경로를 먼저 봅니다.
3. patch 수와 projection shape를 한 줄씩 계산합니다.
4. 같은 변환이 torchvision에서 `Conv2d → reshape → permute → concat`으로 구현되는지 확인합니다.
5. position grid가 해상도와 함께 바뀌는 이유를 확인합니다.
6. DeiT·Swin·MAE를 기본 ViT의 서로 다른 병목에 대한 분기로 읽습니다.
7. 확인한 사실을 부모 지도에 되돌리고 실무 글로 이동합니다.

## 사실·배치 원장

| 사실 | 근거 | 배치 |
|---|---|---|
| 224÷16=14, 14×14=196, `[CLS]` 포함 197 token | ViT 구조와 산술 | 전체 경로·patch 식 |
| patch projection은 `kernel_size=stride=P`인 `Conv2d`로 구현 가능 | torchvision v0.28.0 source | 실제 코드 |
| encoder는 `[B, sequence, embedding]` 순서를 받음 | torchvision v0.28.0 source | 실제 코드 |
| DeiT는 distillation token으로 teacher 신호를 별도 경로에 둠 | Touvron et al. 2021 | 구조 분기 |
| Swin은 local shifted window와 hierarchy로 고해상도 비용을 다룸 | Liu et al. 2021 | 구조 분기 |
| MAE는 visible patch만 encoder에 넣고 작은 decoder로 복원함 | He et al. 2021 | 구조 분기 |
| 환경별 품질·latency·memory 비교는 실무 판단 | 기존 `vision-backbone-selection` | 결론 뒤 링크 |
| checkpoint·export 정합성은 실무 검증 | 기존 `transfer-learning-practice` | 결론 뒤 링크 |

## 보존 판단

- `Tradeoff.tsx`: 현재 개념 글에서 제외하고 백본 선택 실무 글로 연결합니다.
- `Practice.tsx`: position-grid resize의 일반 메커니즘만 patch 설명에 남기고 환경별 registry·export·tolerance 판단은 실무 글로 연결합니다.
- 기존 두 파일은 증거와 이전 초안으로 보존하며 이 글의 렌더 경로에서는 제거합니다.
- `Architecture.tsx`: DeiT·Swin·MAE의 공식 근거와 계산을 유지하되 기본 ViT의 어떤 병목을 바꾸는지 연결 문장을 보강합니다.
