export interface FoundationCurriculumItem {
  slug: string;
  question: string;
  outcome: string;
}

export interface FoundationPhase {
  id: string;
  number: string;
  title: string;
  description: string;
  items: FoundationCurriculumItem[];
}

export const foundationPhases: FoundationPhase[] = [
  {
    id: 'orientation',
    number: '00',
    title: '학습 루프 먼저 보기',
    description: '모델, 데이터, 손실, 기울기, 계산 자원이 한 학습 시스템에서 어떻게 연결되는지 먼저 본다.',
    items: [
      {
        slug: 'deep-learning-overview',
        question: '딥러닝 모델은 무엇을, 어떤 순서로 배우는가?',
        outcome: '학습 루프 전체를 그리고 이후 개념이 들어갈 자리를 설명한다.',
      },
    ],
  },
  {
    id: 'first-model',
    number: '01',
    title: '첫 모델 만들기',
    description: '입력에 가중치를 곱해 결정을 만드는 가장 작은 모델에서 다층 네트워크까지 확장한다.',
    items: [
      {
        slug: 'perceptron',
        question: '하나의 뉴런은 어떻게 선형 결정 경계를 만드는가?',
        outcome: '가중합, 편향, 결정 경계와 퍼셉트론 학습 규칙을 연결한다.',
      },
      {
        slug: 'neural-network',
        question: '뉴런을 층으로 쌓으면 계산은 어떻게 흐르는가?',
        outcome: 'tensor shape를 추적하며 다층 네트워크의 순전파를 계산한다.',
      },
      {
        slug: 'activation-functions',
        question: '왜 선형층 사이에 비선형 함수가 필요한가?',
        outcome: '활성화 함수가 표현력과 기울기 흐름에 미치는 영향을 비교한다.',
      },
    ],
  },
  {
    id: 'objective',
    number: '02',
    title: '오차를 숫자로 만들기',
    description: '모델의 예측과 정답 사이 차이를 하나의 학습 목표로 바꾼다.',
    items: [
      {
        slug: 'cross-entropy',
        question: '분류 모델의 틀린 정도를 왜 로그 확률로 측정하는가?',
        outcome: '확률, likelihood, entropy, cross-entropy의 관계를 설명한다.',
      },
    ],
  },
  {
    id: 'learning',
    number: '03',
    title: '오차에서 학습 신호 만들기',
    description: '손실을 각 파라미터의 책임으로 분배하고 실제 업데이트 규칙으로 바꾼다.',
    items: [
      {
        slug: 'backprop-optimization',
        question: '출력의 오차가 앞쪽 가중치까지 어떻게 전달되는가?',
        outcome: '연쇄 법칙과 reverse-mode autodiff로 기울기 계산 순서를 추적한다.',
      },
      {
        slug: 'optimizers',
        question: '계산한 기울기로 파라미터를 어떻게 안정적으로 바꾸는가?',
        outcome: 'SGD, Momentum, Adam, AdamW의 상태와 업데이트 차이를 판단한다.',
      },
      {
        slug: 'foundation-training-step',
        question: '같은 숫자가 forward에서 update 후 재검산까지 어떻게 이어지는가?',
        outcome: '한 binary sample의 logit, loss, gradient, SGD update와 새 loss를 같은 원장으로 계산한다.',
      },
    ],
  },
  {
    id: 'representation',
    number: '04',
    title: '표현 학습으로 확장하기',
    description: '앞에서 배운 순전파, 손실, 역전파를 하나의 작은 표현 학습 시스템으로 통합한다.',
    items: [
      {
        slug: 'autoencoder',
        question: '정답 레이블 없이도 유용한 표현을 어떻게 학습하는가?',
        outcome: '압축과 복원 목적을 통해 latent representation의 의미와 한계를 설명한다.',
      },
    ],
  },
];

export const foundationBranches = [
  {
    slug: 'fft',
    label: '수학·신호 분기',
    question: '시간·공간의 패턴을 주파수 관점으로 보면 무엇이 달라지는가?',
    note: '핵심 신경망 경로를 마친 뒤 신호 처리, convolution, spectral model로 확장할 때 읽는다.',
  },
] as const;

export const foundationPaperSpine = [
  {
    concept: '퍼셉트론 뒤',
    year: '1958',
    slugs: ['paper-perceptron-1958'],
    question: 'Rosenblatt는 단순 분류기보다 더 큰 어떤 학습 시스템을 상상했는가?',
  },
  {
    concept: '역전파 뒤',
    year: '1986',
    slugs: ['paper-backprop-1986'],
    question: '출력 오차만으로 label 없는 hidden unit이 어떻게 특징을 학습하는가?',
  },
  {
    concept: '옵티마이저 뒤',
    year: '2014→2017',
    slugs: ['paper-adam-2014', 'paper-adamw-2017'],
    question: 'Gradient의 moment와 parameter decay는 왜 서로 다른 state transition인가?',
  },
  {
    concept: '표현 학습 뒤',
    year: '2006',
    slugs: ['paper-autoencoder-2006'],
    question: 'Deep nonlinear code는 PCA와 무엇이 다르고 당시 pretraining은 왜 필요했는가?',
  },
  {
    concept: '신호 분기 뒤',
    year: '1965',
    slugs: ['paper-fft-1965'],
    question: '수학적 변환을 바꾸지 않고 계산량만 줄이는 재사용 구조는 무엇인가?',
  },
] as const;

export const foundationScienceGaps = [
  {
    slug: 'linear-algebra-tensors',
    area: '선형대수와 tensor shape',
    concepts: '벡터, 행렬, 내적, 행렬곱, 전치, broadcasting',
    firstUsed: '퍼셉트론 · 신경망',
    reason: '수식을 기호로 외우지 않고 데이터와 파라미터의 차원을 직접 검산하기 위해 필요하다.',
  },
  {
    slug: 'linear-algebra-decompositions',
    area: '부분공간과 행렬 분해',
    concepts: 'span, rank, null space, least squares, eigenvalue, SVD, PCA',
    firstUsed: '분포 의미 · RNN',
    reason: '행렬이 보존·증폭·제거하는 방향과 low-rank 표현의 손실을 판단하기 위해 필요하다.',
  },
  {
    slug: 'calculus-computational-graphs',
    area: '미분과 계산 그래프',
    concepts: '도함수, 편미분, gradient, Jacobian, 연쇄 법칙',
    firstUsed: '활성화 함수 · 역전파',
    reason: '기울기가 무엇을 측정하고 어느 방향으로 전파되는지 이해하기 위해 필요하다.',
  },
  {
    slug: 'integrals-fields-conservation',
    area: '적분·장·보존법칙',
    concepts: 'Riemann sum, line·surface·volume integral, scalar·vector field, flux, divergence, control volume',
    firstUsed: '구조역학 · 열유동 · 보존적 simulation',
    reason: '공간에 분포한 density와 field를 합력·모멘트·저장량·경계 flux로 바꾸고 local balance가 global conservation으로 이어지는지 검산하기 위해 필요하다.',
  },
  {
    slug: 'differential-equations-phase-plane-numerical-integration',
    area: '미분방정식과 수치 적분',
    concepts: 'state·rate·input, Euler·RK4, local/global error, stability·stiffness, phase portrait, 양끝 경계, 사건 검출',
    firstUsed: 'Diffusion sampler · 열평형 · 로봇 궤적 · Hybrid SSM',
    reason: '현재 변화 규칙을 시간 궤적으로 복원하고 step 오차와 불안정, forward/backward 경계와 grid 사이 event를 서로 다른 실패 층으로 판단하기 위해 필요하다.',
  },
  {
    slug: 'optimization-geometry',
    area: '최적화의 기하',
    concepts: 'convexity, Hessian, condition number, line search, Lagrangian, KKT',
    firstUsed: '옵티마이저 · 제약 학습',
    reason: '같은 gradient라도 곡률과 제약에 따라 update가 달라지고 실패하는 이유를 설명하기 위해 필요하다.',
  },
  {
    slug: 'probability-information-theory',
    area: '확률과 정보 이론',
    concepts: '확률분포, 기대값, likelihood, log, entropy, KL divergence',
    firstUsed: '크로스 엔트로피',
    reason: '분류 손실을 임의의 공식이 아니라 확률 모형의 학습 목표로 읽기 위해 필요하다.',
  },
  {
    slug: 'statistics-generalization',
    area: '통계와 일반화',
    concepts: '표본, train/validation/test, bias-variance, 과적합, 불확실성',
    firstUsed: '옵티마이저 이후',
    reason: '학습 손실이 낮다는 사실과 새로운 데이터에서 잘 작동한다는 사실을 구분하기 위해 필요하다.',
  },
  {
    slug: 'signals-systems-convolution',
    area: '신호와 시스템',
    concepts: 'LTI, impulse response, convolution, frequency response, sampling, aliasing',
    firstUsed: 'CNN · 음성 · 시계열',
    reason: 'Convolution을 격자 공식이 아니라 이동 불변 시스템의 전체 응답으로 이해하고 연속 데이터를 올바르게 표본화하기 위해 필요하다.',
  },
] as const;

export const foundationMathBridges: Record<string, Array<{ slug: string; label: string; reason: string }>> = {
  perceptron: [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: '내적과 직선의 방향을 먼저 확인' },
  ],
  'neural-network': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: '행렬곱과 broadcasting shape를 검산' },
  ],
  'activation-functions': [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: '도함수의 부호와 크기를 먼저 확인' },
  ],
  'cross-entropy': [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'likelihood, log, entropy의 출발점 보강' },
  ],
  'backprop-optimization': [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: '연쇄 법칙, Jacobian, VJP를 숫자로 복습' },
  ],
  optimizers: [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'gradient가 현재 위치의 local 정보인 이유' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'train loss와 배포 성능을 분리해 판단' },
  ],
  'foundation-training-step': [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'p-y와 weight별 gradient의 책임을 검산' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'sigmoid, BCE와 negative log의 선택 이유를 복습' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '한 sample의 loss 감소와 validation 성능을 구분' },
  ],
  autoencoder: [
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '복원 loss와 표현 품질의 평가를 분리' },
  ],
  fft: [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'basis projection과 내적 관점 보강' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'LTI, convolution, sampling에서 Fourier가 필요한 이유' },
  ],
  word2vec: [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'dot product와 cosine normalization 복습' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: '문맥 예측 objective의 확률 해석 보강' },
  ],
  tokenizer: [
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '어휘 설계와 데이터 분포의 관계를 먼저 확인' },
  ],
  'distributional-semantics': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: '문맥 행렬, 내적, cosine geometry를 복습' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'SVD rank와 low-rank reconstruction의 손실을 판단' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: '공기 확률과 PMI의 정보량 해석을 보강' },
  ],
  rnn: [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: '시간축으로 반복되는 행렬곱의 shape를 추적' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: '시간을 펼친 연쇄 법칙과 Jacobian 곱을 복습' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: '반복 transition의 고유 방향과 안정성을 진단' },
  ],
  lstm: [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'cell state를 지나는 기울기 경로를 직접 검산' },
  ],
  seq2seq: [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: '조건부 토큰 확률과 teacher forcing objective를 해석' },
  ],
  'attention-theory': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'query-key 내적과 value의 가중합을 shape로 추적' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'score를 softmax 분포로 바꾸는 이유를 복습' },
  ],
  'transformer-architecture': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'multi-head reshape와 residual 경로의 차원을 검산' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'residual과 normalization의 기울기 경로를 추적' },
  ],
  'diffusion-models': [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Forward noise와 reverse conditional distribution의 의미를 복습' },
    { slug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 수치 적분', reason: '시간 schedule이 있는 learned field를 유한 step으로 적분할 때의 오차·안정성·solver 경계를 판단' },
  ],
  'multimodal-fusion-interleaved-context': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Visual projector의 input·output width와 batch·sequence shape를 검산' },
  ],
  'multimodal-visual-tokenization': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Latent와 code vector의 L2 거리, decoder tensor shape를 검산' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Discrete code vocabulary의 entropy와 사용률을 해석' },
  ],
  'multimodal-unified-generation-objectives': [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Next-token log likelihood와 modality별 entropy를 해석' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: '여러 loss의 gradient가 shared parameter에서 더해지는 경로를 추적' },
  ],
  'linear-algebra-decompositions': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'basis, 내적, 행렬곱 표기를 먼저 복습' },
  ],
  'optimization-geometry': [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'gradient와 Hessian이 측정하는 local 변화를 복습' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Hessian의 eigenvalue와 condition number를 해석' },
  ],
  bert: [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'masked-token likelihood와 분류 확률을 해석' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'pretraining objective와 downstream 성능을 구분' },
  ],
  'rl-pomdp-state-estimation': [
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Bayes rule, conditional likelihood와 belief normalization을 복습' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Covariance direction, observability와 matrix gain을 해석' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'State-space model, sampling, filtering과 sensor aliasing을 연결' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Posterior·hidden state의 calibration과 distribution shift를 진단' },
  ],
  'robot-dynamics-feedback-control': [
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Closed-loop eigenvalue, controllability·observability rank와 conditioning을 해석' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'LQR quadratic objective, constrained MPC와 KKT 조건을 연결' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sampling, delay, impulse response와 feedback stability의 시간축을 복습' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'State estimator uncertainty와 observation likelihood를 controller input과 구분' },
  ],
  'paper-kalman-optimal-control-1960': [
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback Control', reason: 'Plant·feedback·LQR·estimator-controller의 현대 지도를 먼저 잡고 1960 원문의 full-state 범위를 분리' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Gramian positive definiteness, controllability rank와 coordinate-invariant subspace를 해석' },
    { slug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 수치적분', reason: 'State-transition matrix, terminal boundary에서 backward로 푸는 Riccati ODE와 stability를 읽음' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Quadratic value, strict input convexity와 Hamilton-Jacobi minimization을 연결' },
  ],
  'paper-mayne-mpc-2000': [
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback', reason: 'Discrete plant, receding-horizon feedback, Lyapunov decrease와 actuator constraint의 전체 맥락을 먼저 고정' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Feasible set, constrained optimum, convex QP와 nonconvex local solution의 차이를 해석' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Linear terminal controller, quadratic value와 closed-loop mode를 검산' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sampled state transition, one-step shift, delay와 nominal plant contract를 시간축에서 추적' },
  ],
  'robot-ros2-runtime-communication': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sampling period, latency, jitter, queue와 physical deadline을 시간축에서 검산' },
    { slug: 'robot-ai-top-down', label: 'Robot AI 전체 지도', reason: 'Perception·planning·control과 ROS 2 interface의 역할 경계를 먼저 확인' },
    { slug: 'robot-localization-slam', label: 'Robot Localization & SLAM', reason: 'IMU·LiDAR·camera sample의 acquisition time, frame, covariance와 map/odom contract를 실제 message 의미로 연결' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Feedback Control', reason: 'Middleware와 executor delay가 sampled closed-loop stability budget에 들어가는 이유를 연결' },
  ],
  'paper-casini-ros2-response-time-2019': [
    { slug: 'robot-ros2-runtime-communication', label: 'ROS 2 Runtime', reason: 'QoS queue, wait set, executor, callback group과 end-to-end chain의 현재 전체 계약을 먼저 확인' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Period, jitter, time-triggered sampling delay와 event-driven response를 해석' },
    { slug: 'optimization-geometry', label: '최적화와 Fixed Point', reason: 'Supply=demand response equation과 global jitter propagation의 fixed point를 읽음' },
  ],
  'robot-embedded-realtime-control': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sampling, aliasing, delay와 hardware timer phase가 feedback loop에 들어가는 이유를 복습' },
    { slug: 'robot-ros2-runtime-communication', label: 'ROS 2 Runtime', reason: 'Host command의 identity, queue, clock과 end-to-end deadline을 MCU 경계까지 이어서 읽음' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Feedback Control', reason: 'Controller가 계산한 u_k와 실제 plant에 적용된 PWM·torque를 구분' },
  ],
  'paper-liu-layland-realtime-scheduling-1973': [
    { slug: 'robot-embedded-realtime-control', label: 'Embedded Real-Time Control', reason: 'Period·WCET·deadline·jitter·blocking과 physical latch가 실제 MCU에서 무엇인지 먼저 확인' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Periodic sampling과 one-sample delay의 physical 의미를 연결' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Sufficient condition, bound와 fixed-point response test의 논리 방향을 검산' },
  ],
  'robot-motor-drive-foc': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 좌표', reason: '세 phase vector의 projection, rotation matrix와 norm-based voltage limit를 검산' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Electrical frequency, sample/PWM delay, current-loop bandwidth와 sensor settling을 연결' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Feedback Control', reason: '상위 torque request와 inner current loop의 책임·제약을 분리' },
    { slug: 'robot-embedded-realtime-control', label: 'Embedded Real-Time', reason: 'ADC capture, target cycle, ISR/DMA와 PWM latch가 FOC 계산을 물리 시간에 고정' },
  ],
  'paper-blaschke-field-orientation-1973': [
    { slug: 'robot-motor-drive-foc', label: 'Motor Drive & FOC', reason: 'Field-parallel/torque current, electrical angle과 modern d-q implementation을 먼저 체험' },
    { slug: 'linear-algebra-tensors', label: '선형대수와 좌표', reason: '같은 physical vector를 stationary와 field-oriented coordinates로 바꾸는 operation을 검산' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Feedback Control', reason: 'Decoupling, model mismatch와 stability tradeoff를 control 관점에서 읽음' },
  ],
  'robot-power-electronics-motor-driver': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'RC precharge, LC ringing, switching transient, amplifier settling과 thermal time scale을 연결' },
    { slug: 'robot-embedded-realtime-control', label: 'Embedded Real-Time', reason: 'PWM latch, ADC aperture, hardware trip와 supervisory reset의 timing ownership을 검산' },
    { slug: 'robot-motor-drive-foc', label: 'Motor Drive & FOC', reason: 'Vector-limited voltage와 SVPWM duty가 이 글의 physical inverter input이 되는 과정을 먼저 확인' },
    { slug: 'paper-blaschke-field-orientation-1973', label: 'Blaschke Field Orientation', reason: 'Control coordinates가 실제 current/voltage converter와 physical electronics를 요구한 원전 맥락을 확인' },
  ],
  'reference-ti-tida-010956-2025': [
    { slug: 'robot-power-electronics-motor-driver', label: 'Power Electronics & Motor Driver', reason: 'DC-link, commutation, gate, sense, protection, thermal과 PCB evidence vocabulary를 먼저 고정' },
    { slug: 'robot-motor-drive-foc', label: 'Motor Drive & FOC', reason: 'PWM input, phase current와 protection이 어떤 control contract를 닫는지 연결' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '한 test point의 measured evidence와 전체 current/temperature envelope extrapolation을 구분' },
  ],
  'robot-drive-energy-braking-safety': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'DC-link RC transient, response deadline, hysteresis와 repeated thermal cycle을 시간축에서 읽음' },
    { slug: 'robot-motor-drive-foc', label: 'Motor Drive & FOC', reason: 'Torque·speed 부호와 four-quadrant regeneration이 mechanical energy를 DC bus로 되돌리는 과정을 확인' },
    { slug: 'robot-power-electronics-motor-driver', label: 'Power Electronics & Motor Driver', reason: 'DC-link capacitor, switch, current path, precharge와 independent protection의 실제 소유자를 고정' },
    { slug: 'reference-ti-tida-010956-2025', label: 'TI TIDA-010956', reason: '48 V robot inverter의 bus·sense·shutdown physical boundary 위에서 braking sink가 별도 system requirement임을 확인' },
  ],
  'reference-abb-electrical-braking-2018': [
    { slug: 'robot-drive-energy-braking-safety', label: 'Drive Energy & Braking', reason: 'Mechanical energy, bus headroom, sink allocation, chopper와 contactor contract를 먼저 세움' },
    { slug: 'robot-power-electronics-motor-driver', label: 'Power Electronics & Motor Driver', reason: 'ABB topology를 실제 DC link와 switch stress로 옮길 physical vocabulary를 복습' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'ABB의 특정 fan·90 kW example과 target robot operating envelope를 구분' },
  ],
  'robot-drive-isolation-emc-functional-safety': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Edge, capacitance, CM/DM mode, filter resonance와 response delay를 검산' },
    { slug: 'robot-power-electronics-motor-driver', label: 'Power Electronics & Motor Driver', reason: 'Switch node, isolated supply, gate loop와 PCB parasitic의 physical source를 먼저 확인' },
    { slug: 'robot-drive-energy-braking-safety', label: 'Drive Energy & Braking', reason: 'Controlled stop, stored bus, torque removal과 mechanical hold의 기능 경계를 연결' },
  ],
  'reference-ti-tida-01599-sto-2022': [
    { slug: 'robot-drive-isolation-emc-functional-safety', label: 'Isolation·EMC·STO', reason: 'Dual-channel, diagnostics, motion-safe와 safety-case vocabulary를 먼저 고정' },
    { slug: 'robot-drive-energy-braking-safety', label: 'Drive Energy & Braking', reason: 'STO와 active deceleration·energy destination을 분리' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Board-specific measurement와 final machine envelope의 extrapolation을 구분' },
  ],
  'robot-actuator-mechanics-transmission-holding-brake': [
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Second-order resonance, damping, excitation spectrum와 control bandwidth를 읽음' },
    { slug: 'robot-motor-drive-foc', label: 'Motor Drive & FOC', reason: 'Current로 만든 motor-shaft torque와 speed·thermal limit를 joint plant의 입력으로 연결' },
    { slug: 'robot-drive-energy-braking-safety', label: 'Drive Energy & Braking', reason: 'Operational deceleration과 regenerative energy를 standstill holding brake와 구분' },
    { slug: 'robot-drive-isolation-emc-functional-safety', label: 'Isolation·EMC·STO', reason: 'STO electronics와 actual motion·gravity holding의 별도 evidence contract를 복습' },
  ],
  'reference-harmonic-drive-mechatronics-2026': [
    { slug: 'robot-actuator-mechanics-transmission-holding-brake', label: 'Actuator Mechanics', reason: 'Ratio, RMS duty, stiffness, accuracy, bearing와 brake의 공통 system boundary를 먼저 세움' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Catalog average, measurement variation와 guaranteed property를 구분' },
  ],
  'paper-williamson-series-elastic-actuators-1995': [
    { slug: 'robot-actuator-mechanics-transmission-holding-brake', label: 'Actuator Mechanics', reason: 'Series compliance, stored energy, two-mass mode와 saturation trade를 현대 joint 문맥에서 먼저 확인' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Laplace transfer, natural frequency, output impedance와 sweep-sine identification을 검산' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Feedback Control', reason: 'Force feedback, feedforward, stability와 model mismatch를 control 관점에서 읽음' },
  ],
  'robot-contact-tribology-lubrication-wear': [
    { slug: 'integrals-fields-conservation', label: '적분·장·보존법칙', reason: 'Pressure distribution을 normal load로 합치고 heat storage·flux·source ledger의 domain과 단위를 고정' },
    { slug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 수치 적분', reason: 'Loss power가 temperature state를 바꾸고 다시 점도·막두께·friction rate를 바꾸는 thermal ODE의 transient·equilibrium·step error를 추적' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: '마찰-발열-점도 feedback, 회전·정지·반전과 윤활 공급의 서로 다른 시간 척도를 연결' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '정격 수명, 반복 torque, 표면 산포와 한 rig 결과의 transfer boundary를 구분' },
    { slug: 'robot-actuator-mechanics-transmission-holding-brake', label: 'Actuator Mechanics', reason: 'Torque·speed·output-bearing load·duty를 실제 gear·bearing·seal contact의 입력으로 연결' },
    { slug: 'robot-structural-mechanics-materials-fatigue-thermal', label: 'Robot Structural Mechanics', reason: 'Global force·moment·stress에서 local contact pressure, 열팽창과 damage evidence로 내려감' },
  ],
  'paper-hamrock-dowson-film-regimes-1978': [
    { slug: 'robot-contact-tribology-lubrication-wear', label: 'Contact Mechanics & Tribology', reason: 'Hertz contact, entrainment, viscosity, film regime와 lambda의 공통 vocabulary를 먼저 고정' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'Dimensionless group의 지수 민감도와 minimum/central film 식의 입력 경로를 검산' },
  ],
  'research-skf-bearing-conversion-layers-2023': [
    { slug: 'robot-contact-tribology-lubrication-wear', label: 'Contact Mechanics & Tribology', reason: 'Mixed lubrication, roughness order, running-in, friction torque와 wear mode의 의미를 먼저 익힘' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '반복 평균·표준편차, adverse variant와 railway bearing에서 robot joint로의 수치 전이를 구분' },
  ],
  'robot-system-verification-validation-qualification': [
    { slug: 'robot-ai-top-down', label: 'Robot AI 전체 지도', reason: 'Perception, planning, control, embedded, electrical and mechanical의 output/owner 경계를 먼저 고정' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Stratified result, confidence bound, independence and field transfer를 검산' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'End-to-end latency budget, transient response and monitor timing을 연결' },
    { slug: 'robot-ros2-runtime-communication', label: 'ROS 2 Runtime', reason: 'Interface schema, units, frame, clock, QoS, fault reaction and owner를 concrete runtime contract로 읽음' },
    { slug: 'robot-drive-isolation-emc-functional-safety', label: 'Isolation·EMC·STO', reason: 'Hazard control hierarchy, diagnostics, common cause and physical shutdown evidence를 연결' },
  ],
  'robot-structural-mechanics-materials-fatigue-thermal': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 좌표', reason: '3D force·moment vector, cross product, stress state and reaction balance를 검산' },
    { slug: 'integrals-fields-conservation', label: '적분·장·보존법칙', reason: '분포하중·traction을 합력과 모멘트로 바꾸고 area integral의 단위를 검산' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Static stiffness, mode, damping, excitation spectrum and controller bandwidth를 연결' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Material allowable, S-N scatter, Miner prediction and limited experiment transfer를 구분' },
    { slug: 'robot-actuator-mechanics-transmission-holding-brake', label: 'Actuator Mechanics', reason: 'Torque, output-bearing force/moment, compliance, brake and mission duty를 structural load input으로 연결' },
  ],
  'robot-fracture-mechanics-damage-tolerance': [
    { slug: 'integrals-fields-conservation', label: '적분·장·보존법칙', reason: 'Energy density와 path·area accumulation의 domain·orientation·unit을 고정하되 J-integral 자체는 상위 글에서 학습' },
    { slug: 'robot-structural-mechanics-materials-fatigue-thermal', label: 'Robot Structural Mechanics', reason: 'Load path, local stress, fatigue spectrum과 FEA evidence의 출발 상태를 먼저 고정' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Material toughness, crack-growth scatter, NDE POD와 한 시험 결과의 transfer boundary를 구분' },
  ],
  'research-nasa-preloaded-bolt-load-introduction-2025': [
    { slug: 'robot-structural-mechanics-materials-fatigue-thermal', label: 'Robot Structural Mechanics', reason: 'FBD, axial stiffness, preload, slip, gap and thermal compatibility vocabulary를 먼저 고정' },
    { slug: 'linear-algebra-tensors', label: '선형대수와 좌표', reason: 'Load-path equilibrium and stiffness matrix representation을 검산' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: '한 FEA/test joint result와 다른 geometry/preload로의 transfer boundary를 구분' },
  ],
  'paper-manson-double-linear-fatigue-1967': [
    { slug: 'robot-structural-mechanics-materials-fatigue-thermal', label: 'Robot Structural Mechanics', reason: 'Stress cycle, S-N, rainflow, Miner sum and robot mission evidence를 먼저 익힘' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Limited specimens, curve scatter, empirical coefficient and extrapolation을 비판적으로 읽음' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'Piecewise phase accumulation and transition-state execution order를 추적' },
  ],
  'robot-kinematics-coordinate-frames': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Coordinate vector, basis change와 homogeneous matrix의 방향을 검산' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Jacobian rank, null space, singular value와 pseudoinverse를 해석' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'Forward map의 local derivative가 velocity map이 되는 이유를 연결' },
  ],
  'robot-camera-geometry-calibration': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'K inverse, homogeneous projection과 rigid transform 방향을 검산' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Homography constraints의 null space, rank와 conditioning을 해석' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Reprojection fitting score, holdout error와 covariance를 구분' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Acquisition timestamp, latency, rolling shutter와 sampled transform을 연결' },
  ],
  'paper-zhang-camera-calibration-2000': [
    { slug: 'robot-camera-geometry-calibration', label: 'Robot Camera Geometry', reason: 'Pixel, K, distortion와 validation contract를 먼저 익힘' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Vb=0의 smallest singular vector와 degeneracy를 해석' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Maximum likelihood 가정과 simulation·real-data evidence 경계를 검증' },
  ],
  'robot-localization-slam': [
    { slug: 'robot-camera-geometry-calibration', label: 'Robot Camera Geometry', reason: 'Sensor frame, extrinsic과 acquisition-time observation contract를 먼저 복습' },
    { slug: 'rl-pomdp-state-estimation', label: 'POMDP와 State Estimation', reason: 'Prediction, observation likelihood, covariance와 hidden-state belief를 연결' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Information eigenvalue, gauge null space, conditioning과 sparse solve를 해석' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sampling interval, clock offset, integration, filtering과 delay를 시간축에서 검산' },
  ],
  'paper-lu-milios-scan-alignment-1997': [
    { slug: 'robot-localization-slam', label: 'Robot Localization & SLAM', reason: 'Odometry, front-end relation, pose graph, loop closure와 rebase의 전체 계약을 먼저 확인' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Normal matrix, gauge singularity, covariance inverse와 conditioning을 해석' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Maximum-likelihood energy, linearization, local minimum과 iterative update를 연결' },
  ],
  'robot-perception-scene-construction': [
    { slug: 'robot-camera-geometry-calibration', label: 'Robot Camera Geometry', reason: 'Mask pixel과 depth를 acquisition-time metric point로 바꾸는 계약을 먼저 복습' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Occupancy probability, odds, log odds와 반복 evidence를 해석' },
    { slug: 'rl-pomdp-state-estimation', label: 'POMDP와 State Estimation', reason: 'Observation, hidden state, covariance prediction과 correction을 구분' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sensor sampling, acquisition time, latency와 track freshness를 연결' },
  ],
  'paper-octomap-2013': [
    { slug: 'robot-perception-scene-construction', label: 'Robot Perception & Scene', reason: 'Range evidence가 tracking·dynamic layer·PlanningScene과 만나는 전체 계약을 먼저 확인' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Bayes odds와 log-odds additive update를 검산' },
    { slug: 'linear-algebra-tensors', label: '벡터와 공간 좌표', reason: 'Sensor origin, ray endpoint와 voxel coordinate를 같은 frame에서 추적' },
  ],
  'paper-denavit-hartenberg-1955': [
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics & Coordinate Frames', reason: 'Homogeneous transform 방향, frame contract와 open-chain FK를 먼저 고정' },
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Ordered homogeneous transform product와 frame index를 추적' },
  ],
  'paper-whitney-coordinated-control-1972': [
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics & Coordinate Frames', reason: 'Hand-coordinate twist, Jacobian column과 singularity의 현대 언어를 먼저 고정' },
    { slug: 'linear-algebra-decompositions', label: '부분공간과 행렬 분해', reason: 'Inverse, generalized inverse, rank loss와 redundancy를 해석' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'Joint rate와 hand rate를 연결하는 Jacobian을 복습' },
  ],
  'robot-motion-planning': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Configuration vector, weighted distance와 graph edge cost를 검산' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Feasible set, path cost, smoothing과 제약의 차이를 연결' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Sampling success와 probabilistic completeness의 의미를 구분' },
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics', reason: 'Joint configuration이 workspace collision geometry를 어떻게 배치하는지 복습' },
  ],
  'robot-trajectory-generation': [
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'q(s(t))의 velocity·acceleration·jerk를 chain rule로 분해' },
    { slug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Derivative continuity, sampling period와 vibration의 주파수 영향을 연결' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Fixed path 위 feasible phase-plane과 minimum-time switching을 해석' },
    { slug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 Phase Plane', reason: 'x=(ds/dt)²의 한 칸 도달 구간, 종점 controllable set과 grid convergence를 바닥부터 계산' },
    { slug: 'robot-motion-planning', label: 'Robot Motion Planning', reason: 'Time scaling을 붙일 collision-free q(s)와 scene version을 먼저 확인' },
  ],
  'paper-shin-mckay-time-optimal-1985': [
    { slug: 'robot-trajectory-generation', label: 'Robot Trajectory Generation', reason: 'Path/time 분리, torque retiming과 phase-plane Viz를 먼저 익힘' },
    { slug: 'robot-dynamics-feedback-control', label: 'Robot Dynamics & Feedback', reason: '관성·중력·토크 모델과 실제 추적 오차의 책임 경계를 연결' },
    { slug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 Phase Plane', reason: 'Forward·backward 적분, 상태 궤적, 전환점과 수치 오차를 바닥부터 확인' },
    { slug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'q_s, q_ss와 time-scaling chain rule을 검산' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Actuator inequalities가 만드는 feasible acceleration interval을 해석' },
  ],
  'paper-lozano-perez-cspace-1983': [
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Configuration coordinates와 geometric set transformation을 추적' },
    { slug: 'robot-kinematics-coordinate-frames', label: 'Robot Kinematics', reason: 'Joint point 하나가 extended robot pose 전체를 정하는 이유를 연결' },
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Set intersection, forbidden region, Minkowski sum과 path clearance를 구분' },
  ],
  'paper-kavraki-prm-1996': [
    { slug: 'paper-lozano-perez-cspace-1983', label: 'Lozano-Perez C-space', reason: 'Sampling 대상 C_free와 local path가 보존해야 할 collision predicate를 먼저 복원' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Random sampling과 finite failure probability를 해석' },
    { slug: 'linear-algebra-tensors', label: '선형대수와 Tensor Shape', reason: 'Configuration metric, neighbor set과 graph representation의 좌표 의존성을 추적' },
  ],
  'rl-safe-constrained-learning': [
    { slug: 'optimization-geometry', label: '최적화의 기하', reason: 'Lagrangian, KKT와 constrained quadratic step을 먼저 복습' },
    { slug: 'probability-information-theory', label: '확률과 정보 이론', reason: 'Expected cost와 violation probability를 구분' },
    { slug: 'statistics-generalization', label: '통계와 일반화', reason: 'Safety critic calibration과 rare-event sampling error를 진단' },
  ],
};

export const foundationCoreSlugs = foundationPhases.flatMap((phase) => phase.items.map((item) => item.slug));
