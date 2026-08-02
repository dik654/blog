# 딥러닝 전체 지도 content spec

## Goal
- 독자가 `data -> prediction -> loss -> gradient -> update`를 하나의 상태 전이로 설명한다.
- 이후 글의 개념을 고립된 용어가 아니라 학습 루프의 어느 위치를 채우는지로 판단한다.

## Hidden mastery problem
본문에 문제를 그대로 싣지 않는다. 글을 읽은 독자는 다음 상황을 스스로 해석할 수 있어야 한다.

> Batch `[32, 784]`, 2-layer classifier, cross-entropy, AdamW가 주어졌다. 한 training step에서 새로 계산되는 값과 유지되는 state를 구분하고, 어떤 tensor가 GPU에서 병렬 계산되는지 설명한다. Train loss는 감소하지만 validation loss가 증가하고 GPU utilization은 35%다. 모델 표현력, 최적화, 일반화, 시스템 효율 중 어느 문제인지 분리하고 다음에 읽을 글을 선택한다.

## Source and intent ledger
| Source | Adopted claim | Writing intent | Boundary |
|---|---|---|---|
| Deep Learning Book ch. 1, 5, 6, 8 | representation learning, empirical risk, optimization are connected but distinct | 전체 지도에서 세 문제를 섞지 않는다 | 특정 architecture를 딥러닝의 정의로 고정하지 않는다 |
| Baydin et al., *Automatic Differentiation in Machine Learning* | reverse mode propagates derivatives through a recorded computation | backprop과 optimizer를 분리한다 | autodiff가 학습 전략까지 결정한다고 쓰지 않는다 |
| PyTorch tensor/autograd docs | batch tensor operations and gradient buffers are explicit runtime state | shape와 device를 추상 용어가 아닌 실행 상태로 보여 준다 | GPU가 모든 workload를 자동 가속한다고 일반화하지 않는다 |

## Full-scope map
| Topic | Depth | Article evidence | Mastery contribution |
|---|---|---|---|
| supervised learning loop | deep | `Overview`, `LearningLoop` | step의 실행 순서 복원 |
| representation depth | deep | `Representation` | 선형 합성과 비선형 표현 구분 |
| tensor and GPU | deep | `Compute` | batch, memory, communication 병목 분리 |
| optimization vs generalization | deep | `Limits` | train/validation divergence 진단 |
| next path selection | deep | `Roadmap` | 부족한 수학·개념 글 선택 |
| architecture zoo | defer | dedicated CNN/Transformer/Diffusion paths | 첫 글에서 이름 나열을 피함 |

## Section intent
1. `Overview`: 학습 시스템의 여섯 상태를 먼저 고정한다. 독자는 parameter, prediction, loss를 같은 값으로 취급하지 않아야 한다.
2. `Representation`: depth가 유용한 이유를 함수 합성으로 설명한다. 비선형성이 없으면 깊이가 축약되는 반례가 핵심이다.
3. `LearningLoop`: 한 batch의 forward와 backward 사이에 저장되는 값을 구분한다. hidden mastery problem의 state 분류를 연다.
4. `Compute`: tensor shape, parallel operation, memory와 communication을 구분한다. utilization이 낮은 원인을 모델 이론으로 오진하지 않게 한다.
5. `Limits`: optimization success와 deployment success를 분리한다. validation 악화의 진단 축을 만든다.
6. `Roadmap`: 독자가 자신의 막힘을 개념, 수학, 시스템 중 하나로 분류하고 다음 글을 고른다.

## Coverage gate
- 각 상태는 입력, 출력, 보존 기간을 설명하는가?
- `gradient`와 `update`가 서로 다른 값이라는 숫자 예제가 있는가?
- GPU 설명은 compute, memory, communication, synchronization을 구분하는가?
- train loss 감소가 일반화를 보장하지 않는 반례가 있는가?
- 모든 다음 글 링크는 이 글에서 드러난 구체적 질문과 연결되는가?
