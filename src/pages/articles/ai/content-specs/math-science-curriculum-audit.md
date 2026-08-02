# Math & Science 커리큘럼 공백 감사

## 감사 목적과 현재 상태

혁펜하임 공개 커리큘럼을 그대로 복제하지 않고, 현재 블로그의 상위 AI 글을 읽다 막히는 계산을 해결할 최소 기반이 실제 글과 복귀 경로로 연결되어 있는지 검증한다.

- 공개 커리큘럼 비교 기준일: `2026-07-18`
- 블로그 구현 재감사일: `2026-07-31`
- 현재 원칙: 수학 9편을 일렬로 완주하지 않는다. `모양 · 변화 · 판단 · 기억` 중 현재 막힌 관점 하나만 고르고, 각 글의 중단 기준을 통과하면 상위 목표로 돌아간다.

## 확인한 공개 경로

- `LEVEL 0: AI를 위한 기초 수학`: 함수, 로그, 극한, 미분, 연쇄 법칙, 편미분, 확률변수, 평균·분산.
- `보이는 선형대수학`: 부분공간, rank, least squares, eigen decomposition, PCA, SVD, pseudoinverse, QR·Cholesky.
- `탄탄한 컨벡스 최적화`: convexity, gradient/Newton/quasi-Newton, Lagrangian, KKT, duality, interior point.
- `퍼펙트 신호 및 시스템`: LTI, convolution, impulse response, Fourier, sampling, Laplace/Z transform, filter.
- `트이는 강화 학습`: MDP, Bellman, MC/TD, value/policy method, DQN에서 PPO·DDPG까지.
- 권장 상위 흐름: 딥러닝과 구현 기반에서 고전 모델, Transformer 이후 구조와 Diffusion으로 올라간다.

## 2026-07-31 구현 대조

| 계산 병목 | 구현된 최소 글 | 상위 복귀점 | 상태 |
| --- | --- | --- | --- |
| Tensor의 모양과 연산 가능 여부 | `linear-algebra-tensors` | 신경망, Attention, Embedding | 닫힘 |
| 반복 방향과 압축 손실 | `linear-algebra-decompositions` | RNN, PCA, low-rank 구조 | 닫힘 |
| 한 점의 민감도와 책임 분배 | `calculus-computational-graphs` | 역전파, autograd, robot path chain rule | 닫힘 |
| 분포한 기여와 보존 원장 | `integrals-fields-conservation` | 구조·열유동, control volume, conservative simulation | 닫힘 |
| 변화 규칙에서 시간 궤적 | `differential-equations-phase-plane-numerical-integration` | Diffusion sampler, thermal dynamics, robot trajectory, SSM | 닫힘 |
| 곡률·제약 아래 update | `optimization-geometry` | Optimizer, constrained learning·control | 닫힘 |
| 불확실성을 비용으로 바꾸기 | `probability-information-theory` | Cross-entropy, generative likelihood, token distribution | 닫힘 |
| 표본 점수에서 배포 주장 | `statistics-generalization` | 모델 평가, calibration, 실험 설계 | 닫힘 |
| 시간 입력과 system memory | `signals-systems-convolution` | CNN, Audio, Time Series, S4·Mamba | 닫힘 |
| 순차 의사결정 | `rl-mdp-bellman`부터 분기별 current-first 경로 | RLHF·RLVR, policy, offline·model-based·safe RL | 별도 RL 지도에서 닫힘 |

## 경로 구조 결정

단일 `ai-math-foundations` 순차 경로는 모든 수학을 선수 과목처럼 보이게 만들었다. 이를 다음 네 declared path로 분리한다.

- `ai-math-shape-foundations`: 선형대수 -> 행렬 분해
- `ai-math-change-foundations`: 미분 -> 적분·보존 -> 미분방정식
- `ai-math-evidence-foundations`: 최적화 -> 확률·정보 -> 통계·일반화
- `ai-math-signal-foundations`: 신호와 시스템 한 편에서 시작하고, FFT는 필요할 때 별도 분기로 연다.

목록 화면과 글 하단 이전·다음 이동은 같은 경로를 사용해야 한다. 특히 `적분·장·보존법칙`을 목록에서 누락하거나, 선택한 병목 밖의 수학 글을 다음 필수 단계처럼 제시하지 않는다.

## 내부 전이 시험

글을 공개하기 전 작성자는 본문을 보지 않고 어려운 전이 문제를 먼저 만든다. 정답 자체를 본문에 문제 형태로 넣는 것이 아니라, 완성된 본문만 읽은 독자가 다음 판단을 재구성할 수 있는지 검사한다.

- `모양`: attention 또는 broadcasting 식에서 각 축의 의미와 사라지는 축을 검산한다.
- `변화`: local derivative, 공간 적분, 시간 적분을 혼동하지 않고 보존·오차·안정성 실패를 분리한다.
- `판단`: 같은 gradient에서 곡률과 제약의 영향을 설명하고, likelihood 개선과 배포 일반화 주장을 구분한다.
- `기억`: convolution, recurrent state, sampling과 aliasing을 하나의 시간축 계약으로 설명한다.

본문만으로 이 전이가 안 되면 공식이나 용어를 더 추가하지 않는다. 직관, 작은 숫자 계산, 단위·shape 검산, 실패 반례, 상위 글 복귀 bridge 중 빠진 층을 보강한다.

## 현재 제외 범위와 개방 조건

- LU, QR, Cholesky, Sherman-Morrison은 수치 안정성이나 online estimation이 실제 상위 목표의 병목이 될 때 연다.
- Laplace·Z transform, pole-zero, filter design은 control·audio 경로에서 frequency-domain 설계가 필요할 때 연다.
- Interior-point solver 구현은 KKT 조건을 실제 constrained solver의 iteration과 연결해야 할 때 연다.
- PDE, continuum mechanics와 finite-element weak form은 보존법칙 글로 해결되지 않는 simulation 경로가 생길 때 연다.
- MDP와 Bellman은 수학 목록에 다시 섞지 않는다. 순차 의사결정의 관측·행동·보상 계약을 가진 RL 지도에서만 연다.

## 완료 판정

각 글은 다음 네 조건을 모두 만족할 때만 `최소 기반 닫힘`으로 본다.

1. 기호를 자연어로 설명할 수 있다.
2. 작은 숫자 예제를 손으로 계산할 수 있다.
3. shape, 단위, 확률 질량, 보존량 또는 수치 오차 중 해당 불변량을 검산할 수 있다.
4. 어느 상위 글로 돌아가야 하며 무엇이 아직 범위 밖인지 말할 수 있다.

구조 점수나 수식 개수만으로 내용 검증을 대신하지 않는다. Codex 정적·브라우저 QA와 Claude 의미 교차 검증도 별도 영수증으로 유지한다.
