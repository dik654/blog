import { Scene } from '@/components/scene/Scene';
import type { Scene as SceneSpec } from '@/components/scene/types';

type SceneKey =
  | 'GPSMap'
  | 'BackpropEfficiency'
  | 'LocalGradChain'
  | 'LocalGradStore'
  | 'TwoDiffModes'
  | 'DiffModesOverview'
  | 'DiffModeOverviewCard'
  | 'DiffModesIntro'
  | 'ForwardVsReverse'
  | 'NParamScaling'
  | 'ForwardNPass'
  | 'ReverseMode'
  | 'TrainingLoop'
  | 'ForwardPass'
  | 'ForwardMath'
  | 'Softmax'
  | 'SoftmaxExamples'
  | 'Temperature'
  | 'SoftmaxAdvanced'
  | 'CrossEntropy'
  | 'InfoTheory'
  | 'CeStability'
  | 'LabelSmoothing'
  | 'ChainRule'
  | 'ChainRuleMath'
  | 'ComputationalGraph'
  | 'ReverseModeGPS'
  | 'BackpropDeriv'
  | 'BackpropMath'
  | 'GradientUpdate'
  | 'SGDVariants'
  | 'LRScheduling'
  | 'GradTrain'
  | 'Loss'
  | 'LossComparison'
  | 'LossTaskMap'
  | 'CeIntuition'
  | 'Regularization'
  | 'L1L2'
  | 'Dropout'
  | 'RegTech';

const META: Record<SceneKey, { id: string; title: string; caption: string; focus: string }> = {
  GPSMap: {
    id: 'gps-map',
    title: '경도 하나에서 도시 확률까지',
    caption: '입력 $x$ 하나가 세 도시 logit $z$ 로 갈라지고 확률 $p$ 로 바뀐다.',
    focus: '가장 작은 분류 문제. 경도 하나만 있어도 forward, loss, gradient 흐름을 끝까지 따라갈 수 있다.',
  },
  BackpropEfficiency: {
    id: 'backprop-efficiency',
    title: '중복 미분을 한 번의 역순회로 접기',
    caption: 'naive 재귀는 같은 local 미분을 반복하고, backprop 은 저장한 값을 재사용한다.',
    focus: '중간값을 저장하면 같은 노드의 gradient 를 다시 계산하지 않는다.',
  },
  LocalGradChain: {
    id: 'local-grad-chain',
    title: 'Local gradient 를 곱해 전체 gradient 만들기',
    caption: '각 노드는 자기 local 미분만 알고, downstream gradient 와 곱해 upstream 으로 보낸다.',
    focus: '복잡한 전체 미분을 작은 곱셈들의 체인으로 나눈다.',
  },
  LocalGradStore: {
    id: 'local-grad-store',
    title: 'Forward 때 저장한 값이 backward 의 재료',
    caption: '$z$, $a$, local 미분을 저장해야 backward 에서 다시 쓸 수 있다.',
    focus: 'activation memory 는 backward 계산을 위한 영수증이다.',
  },
  TwoDiffModes: {
    id: 'two-diff-modes',
    title: 'Forward mode 와 Reverse mode',
    caption: 'JVP 는 입력 방향 하나, VJP 는 출력 방향 하나를 한 sweep 으로 얻는다.',
    focus: '입력이 많고 출력 loss 가 하나면 reverse mode 가 맞다.',
  },
  DiffModesOverview: {
    id: 'diff-modes-overview',
    title: 'Autodiff 의 두 축',
    caption: '같은 계산 그래프라도 seed 를 어디서 넣느냐에 따라 비용이 달라진다.',
    focus: '방향 선택이 곧 계산량 선택이다.',
  },
  DiffModeOverviewCard: {
    id: 'diff-mode-overview-card',
    title: 'JVP vs VJP 한 장 비교',
    caption: '$Jv$ 는 열 조합, $v^T J$ 는 행 조합이다.',
    focus: '신경망 loss 는 스칼라라 필요한 행이 하나다.',
  },
  DiffModesIntro: {
    id: 'diff-modes-intro',
    title: '미분 방향을 먼저 고르기',
    caption: '출발점은 같은 그래프. forward 는 입력에서, reverse 는 loss 에서 시작한다.',
    focus: '미분법 이름보다 seed 의 위치가 먼저다.',
  },
  ForwardVsReverse: {
    id: 'forward-vs-reverse',
    title: '많은 파라미터, 하나의 loss',
    caption: '$f: \\mathbb{R}^n \\to \\mathbb{R}$ 에서 reverse 는 한 번에 $\\nabla_\\theta L$ 을 얻는다.',
    focus: '열 n 개 대신 행 1 개.',
  },
  NParamScaling: {
    id: 'n-param-scaling',
    title: '파라미터 수가 커질수록 벌어지는 비용',
    caption: 'forward mode 는 파라미터 방향마다 sweep, reverse mode 는 loss seed 하나.',
    focus: '$n$ 이 커질수록 reverse mode 의 장점이 구조적으로 커진다.',
  },
  ForwardNPass: {
    id: 'forward-n-pass',
    title: 'Forward mode 가 n 번 필요한 이유',
    caption: '$n$ 개 파라미터 각각의 방향을 따로 seed 해야 전체 gradient 가 채워진다.',
    focus: '한 번에 한 열. 전체 gradient 는 모든 열.',
  },
  ReverseMode: {
    id: 'reverse-mode',
    title: '한 번의 backward 로 모든 파라미터 gradient',
    caption: 'loss 에서 시작한 adjoint 가 그래프를 거꾸로 지나며 각 파라미터에 쌓인다.',
    focus: '공유된 downstream gradient 를 각 local gradient 와 곱한다.',
  },
  TrainingLoop: {
    id: 'training-loop',
    title: 'Forward → Loss → Backward → Update',
    caption: '$\\theta_{t+1}=\\theta_t-\\eta \\nabla_\\theta L(\\theta_t)$',
    focus: '학습은 같은 네 단계의 반복이다.',
  },
  ForwardPass: {
    id: 'forward-pass',
    title: '스칼라 입력에서 세 logit 만들기',
    caption: '$z_i=w_i x+b_i$ 를 세 뉴런에 병렬 적용한다.',
    focus: '직선 방정식 하나가 뉴런, 여러 개가 layer 다.',
  },
  ForwardMath: {
    id: 'forward-math',
    title: '스칼라 식을 배치 행렬식으로 확장',
    caption: '$h=wx+b \\to z=Wx+b \\to Z=XW+b$',
    focus: '차원만 커지고 연산 원리는 그대로다.',
  },
  Softmax: {
    id: 'softmax',
    title: 'Logit 을 확률분포로 바꾸기',
    caption: '$p_i=\\exp(z_i)/\\sum_j\\exp(z_j)$',
    focus: '점수의 크기 차이를 양수 비율로 바꾸고 합을 1 로 맞춘다.',
  },
  SoftmaxExamples: {
    id: 'softmax-examples',
    title: '같은 logit, 다른 확률 간격',
    caption: '큰 logit 은 지수화 뒤 더 빠르게 커져 높은 확률을 차지한다.',
    focus: '차이가 커질수록 winner 가 더 선명해진다.',
  },
  Temperature: {
    id: 'temperature',
    title: 'Temperature 로 분포 날카로움 조절',
    caption: '$p_i=\\mathrm{softmax}(z_i/T)$',
    focus: '$T$ 가 작으면 차이를 키우고, 크면 차이를 누른다.',
  },
  SoftmaxAdvanced: {
    id: 'softmax-advanced',
    title: '안정화된 softmax',
    caption: '$\\mathrm{softmax}(z)=\\mathrm{softmax}(z-\\max z)$',
    focus: '최댓값을 빼도 비율은 같고 overflow 는 줄어든다.',
  },
  CrossEntropy: {
    id: 'cross-entropy',
    title: '정답 확률을 loss 로 바꾸기',
    caption: '$L=-\\sum_i y_i\\log p_i$',
    focus: '정답에 준 확률이 작을수록 벌점이 크게 오른다.',
  },
  InfoTheory: {
    id: 'info-theory',
    title: '놀람값에서 cross-entropy 까지',
    caption: '$-\\log p$ 는 낮은 확률 사건일수록 큰 정보량을 준다.',
    focus: '분류 loss 는 정답 사건의 놀람값이다.',
  },
  CeStability: {
    id: 'ce-stability',
    title: 'Log-softmax 로 안정하게 합치기',
    caption: '$\\log\\mathrm{softmax}(z)=z_i-\\log\\sum_j\\exp z_j$',
    focus: 'softmax 후 log 를 따로 계산하지 않고 한 식으로 묶는다.',
  },
  LabelSmoothing: {
    id: 'label-smoothing',
    title: 'One-hot 정답을 조금 부드럽게',
    caption: '$y^{smooth}=(1-\\epsilon)y+\\epsilon/K$',
    focus: '정답 클래스만 1 로 두지 않아 과확신 gradient 를 줄인다.',
  },
  ChainRule: {
    id: 'chain-rule',
    title: '합성함수 미분을 local 곱으로 나누기',
    caption: '$\\partial L/\\partial x=(\\partial L/\\partial z)(\\partial z/\\partial x)$',
    focus: '전체 식을 한 번에 미분하지 않고 노드별 미분을 연결한다.',
  },
  ChainRuleMath: {
    id: 'chain-rule-math',
    title: '스칼라 chain 에서 VJP 로',
    caption: '벡터 함수에서는 downstream row vector 가 local Jacobian 을 왼쪽에서 곱한다.',
    focus: 'VJP 는 reverse mode 의 실제 계산 단위다.',
  },
  ComputationalGraph: {
    id: 'computational-graph',
    title: '계산 그래프의 forward 저장과 backward 누적',
    caption: '노드 값 저장 → loss seed → 역순으로 .grad 누적',
    focus: '그래프 구조가 gradient 흐름의 경로가 된다.',
  },
  ReverseModeGPS: {
    id: 'reverse-mode-gps',
    title: 'GPS 예제로 보는 reverse mode',
    caption: '도시 loss 에서 시작한 gradient 가 logit, weight, bias 로 되돌아간다.',
    focus: '출력 loss 하나가 모든 파라미터에 신호를 보낸다.',
  },
  BackpropDeriv: {
    id: 'backprop-deriv',
    title: 'Softmax + Cross-Entropy 의 gradient',
    caption: '$\\partial L/\\partial z=p-y$',
    focus: '복잡한 Jacobian 이 합쳐지면 예측 확률과 정답의 차이만 남는다.',
  },
  BackpropMath: {
    id: 'backprop-math',
    title: 'Output error 에서 weight gradient 까지',
    caption: '$\\partial L/\\partial W=x^T(p-y)$',
    focus: '입력값이 크면 같은 error 도 더 큰 weight gradient 를 만든다.',
  },
  GradientUpdate: {
    id: 'gradient-update',
    title: 'Gradient 를 빼서 loss 를 낮추기',
    caption: '$\\theta_{new}=\\theta-\\eta g$',
    focus: '$g$ 는 증가 방향이라 음수 방향으로 움직인다.',
  },
  SGDVariants: {
    id: 'sgd-variants',
    title: '진동을 줄이고 좌표별 step 을 맞추기',
    caption: 'momentum 은 방향을 평균내고, RMSProp 은 제곱 평균으로 나눈다.',
    focus: 'SGD 의 단순 step 에 기억과 좌표별 스케일을 더한다.',
  },
  LRScheduling: {
    id: 'lr-scheduling',
    title: '학습률을 시간에 따라 바꾸기',
    caption: '$\\eta_t$ 를 크게 시작해 작게 줄이면 빠른 탐색 뒤 미세 조정으로 간다.',
    focus: '같은 gradient 라도 step 크기는 학습 단계마다 달라야 한다.',
  },
  GradTrain: {
    id: 'grad-train',
    title: 'Gradient clipping 과 update loop',
    caption: '$g$ 가 너무 크면 norm 으로 잘라 안정적인 update 를 만든다.',
    focus: '폭주하는 gradient 는 방향은 보존하고 길이만 제한한다.',
  },
  Loss: {
    id: 'loss',
    title: '예측과 정답의 거리를 한 숫자로',
    caption: 'loss 는 모델 출력 전체를 update 가능한 스칼라 신호로 압축한다.',
    focus: 'backward 의 시작점은 항상 스칼라 loss 다.',
  },
  LossComparison: {
    id: 'loss-comparison',
    title: '오차 모양에 따라 gradient 모양도 달라진다',
    caption: 'MSE 는 큰 오차를 크게 벌하고, MAE 는 일정한 기울기를 준다.',
    focus: 'loss 선택은 학습 신호의 모양 선택이다.',
  },
  LossTaskMap: {
    id: 'loss-task-map',
    title: '작업에 맞는 loss 고르기',
    caption: '분류는 CE, 회귀는 MSE/MAE/Huber, 분포 비교는 KL 을 주로 쓴다.',
    focus: '출력의 의미가 loss 의 형태를 결정한다.',
  },
  CeIntuition: {
    id: 'ce-intuition',
    title: 'Cross-Entropy 의 직관',
    caption: '정답 확률을 두 배로 낮추면 $-\\log p$ 벌점이 일정량 늘어난다.',
    focus: '정답에 확신하지 못할수록 update 신호가 커진다.',
  },
  Regularization: {
    id: 'regularization',
    title: '데이터 loss 에 모델 복잡도 벌점 더하기',
    caption: '$J(\\theta)=L(\\theta)+\\lambda R(\\theta)$',
    focus: '훈련 데이터만 맞추는 방향에 복잡도 비용을 붙인다.',
  },
  L1L2: {
    id: 'l1-l2',
    title: 'L1 은 0 으로 밀고, L2 는 작게 누른다',
    caption: '$R_{L1}=\\sum|w_i|$, $R_{L2}=\\sum w_i^2$',
    focus: '벌점의 기울기 모양이 weight 의 최종 모양을 바꾼다.',
  },
  Dropout: {
    id: 'dropout',
    title: '일부 뉴런을 꺼서 co-adaptation 줄이기',
    caption: '훈련 중 mask 를 곱하고, 추론 때 전체 경로를 사용한다.',
    focus: '특정 경로 하나에만 의존하지 못하게 만든다.',
  },
  RegTech: {
    id: 'reg-tech',
    title: 'Early stopping, normalization, augmentation',
    caption: '복잡도 벌점 밖에서도 학습 경로와 데이터 모양을 조절해 과적합을 줄인다.',
    focus: 'regularization 은 목적 함수 항만이 아니라 훈련 절차 전체의 설계다.',
  },
};

function makeSpec(key: SceneKey): SceneSpec {
  const meta = META[key];

  return {
    id: `backprop-${meta.id}`,
    title: meta.title,
    caption: meta.caption,
    question: `${meta.title}에서 loss를 줄이려면 어떤 값을 저장하고, 어떤 신호를 어느 방향으로 전달해야 할까?`,
    takeaway: meta.focus,
    overview: meta.focus,
    objects: [
      {
        id: 'x',
        kind: 'vector',
        shape: [3],
        label: 'x',
        role: 'input',
        description: '입력 또는 이전 단계의 activation',
        why: '가장 단순한 출발점.\n모든 section 은 이 값이 어떤 변환을 거쳐 loss 와 gradient 로 이어지는지 보여준다.',
      },
      {
        id: 'theta',
        kind: 'matrix',
        shape: [3, 3],
        label: '\\theta',
        role: 'param',
        description: '학습되는 weight / bias 묶음',
        why: '모델이 바꿀 수 있는 숫자.\nforward 에서는 예측을 만들고, backward 에서는 loss 를 낮추는 방향을 받는다.',
      },
      {
        id: 'z',
        kind: 'vector',
        shape: [3],
        label: 'z',
        role: 'intermediate',
        description: '정규화 전 score 또는 중간값',
        why: '확률이나 loss 로 바로 쓰기 전 raw 계산 결과.\n이 값을 저장해야 backward 에서 local gradient 를 계산할 수 있다.',
      },
      {
        id: 'p',
        kind: 'distribution',
        shape: [3],
        label: 'p',
        role: 'intermediate',
        description: '예측 확률 또는 정규화된 신호',
        why: '여러 score 를 비교 가능한 분포로 만든 결과.\n합이 1 이라 정답과 직접 비교할 수 있다.',
      },
      {
        id: 'y',
        kind: 'distribution',
        shape: [3],
        label: 'y',
        role: 'input',
        description: '정답 분포',
        why: '학습 신호의 기준.\n예측 $p$ 와 차이가 클수록 loss 와 gradient 가 커진다.',
      },
      {
        id: 'L',
        kind: 'scalar',
        label: 'L',
        role: 'intermediate',
        description: '스칼라 loss',
        why: '예측이 얼마나 틀렸는지 한 숫자로 압축.\nreverse mode 는 이 스칼라에서 seed 를 넣기 때문에 파라미터가 많아도 한 번의 backward 로 충분하다.',
      },
      {
        id: 'g',
        kind: 'vector',
        shape: [3],
        label: 'g',
        role: 'intermediate',
        description: '현재 파라미터에서의 gradient',
        why: '$L$ 이 가장 빨리 증가하는 방향.\n학습은 이 방향을 빼서 loss 를 낮추는 쪽으로 이동한다.',
      },
      {
        id: 'eta',
        kind: 'scalar',
        label: '\\eta',
        role: 'param',
        description: '학습률',
        why: 'gradient 방향으로 얼마나 멀리 움직일지 정하는 step size.\n너무 크면 튀고, 너무 작으면 느리다.',
      },
      {
        id: 'thetaNext',
        kind: 'matrix',
        shape: [3, 3],
        label: '\\theta_{t+1}',
        role: 'output',
        description: '업데이트된 파라미터',
        why: '이번 step 의 학습 결과.\n다음 iteration 에서는 이 값이 다시 forward 의 파라미터가 된다.',
      },
    ],
    transitions: [
      {
        t: 0,
        op: 'project',
        inputs: ['x', 'theta'],
        produces: 'z',
        caption: '$z = f(x;\\theta)$',
        why: '가장 단순한 계산은 입력에 weight 를 곱하고 bias 를 더하는 것.\nsection 이 달라져도 첫 질문은 같다: 현재 파라미터가 어떤 중간값을 만들었나.',
        notes: [
          { target: 'x', tex: '$x$', note: '입력 또는 이전 activation. 뒤의 모든 gradient 는 이 값이 forward 에 참여했다는 사실에서 출발' },
          { target: 'theta', tex: '$\\theta$', note: '학습 대상 숫자. forward 에 쓴 값만 backward 에서 책임을 받는다' },
        ],
      },
      {
        t: 1,
        op: 'softmax',
        inputs: ['z'],
        produces: 'p',
        caption: '$p = \\mathrm{normalize}(z)$',
        why: meta.focus,
        notes: [
          { tex: '$z$', note: 'raw score. 크기 차이는 있지만 아직 비교 가능한 확률은 아님' },
          { tex: '$p$', note: '정규화된 예측 신호. softmax, norm, mask, smoothing 같은 변형은 이 단계의 구체적 선택' },
        ],
      },
      {
        t: 2,
        op: 'dot',
        inputs: ['p', 'y'],
        produces: 'L',
        caption: '$L = \\ell(p, y)$',
        why: '예측 벡터 전체를 한 숫자로 줄인다.\n스칼라 loss 가 있어야 reverse mode seed 를 하나로 시작할 수 있다.',
        notes: [
          { target: 'y', tex: '$y$', note: '정답 분포. 분류에서는 one-hot 또는 smoothing 된 target' },
          { tex: '$\\ell$', note: 'task 에 맞는 벌점 함수. CE, MSE, KL, regularized objective 가 모두 이 자리에 들어간다' },
        ],
      },
      {
        t: 3,
        op: 'multiply',
        inputs: ['L', 'z', 'theta'],
        produces: 'g',
        caption: '$g = \\nabla_\\theta L$',
        why: 'loss 에서 시작한 신호를 그래프 역순으로 보낸다.\n각 노드는 저장한 forward 값과 local 미분만 사용하고, downstream gradient 와 곱해 자기 입력 쪽 gradient 를 만든다.',
        notes: [
          { target: 'L', tex: '$L$', note: 'backward seed. 스칼라라 시작 gradient 는 1' },
          { target: 'z', tex: '$z$', note: 'forward 저장값. local gradient 계산에 필요' },
          { target: 'theta', tex: '$\\theta$', note: 'forward 에 참여한 파라미터. 여기로 gradient 가 누적된다' },
        ],
      },
      {
        t: 4,
        op: 'add',
        inputs: ['theta', 'eta', 'g'],
        produces: 'thetaNext',
        caption: '$\\theta_{t+1}=\\theta_t-\\eta g$',
        why: '$g$ 는 loss 증가 방향.\n음수 방향으로 작은 step 을 가면 현재 batch 에서 loss 가 줄어드는 쪽으로 이동한다.',
        notes: [
          { target: 'eta', tex: '$\\eta$', note: 'step size. scheduling, clipping, Adam 류 optimizer 는 이 update 를 더 안정적으로 만드는 장치' },
          { target: 'g', tex: '$g$', note: '현재 위치에서 계산한 gradient. 값이 너무 크면 clipping 으로 길이만 제한할 수 있다' },
        ],
      },
    ],
  };
}

export function makeBackpropScene(key: SceneKey) {
  return function BackpropScene() {
    return <Scene spec={makeSpec(key)} />;
  };
}
