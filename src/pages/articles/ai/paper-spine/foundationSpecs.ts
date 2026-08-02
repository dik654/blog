import type { PaperStudySpec } from './FoundationalPaperStudy';
import CooleyTukeyViz from '../fft/viz/CooleyTukeyViz';
import { Word2VecMechanismViz } from './viz/NlpPaperMechanismViz';

export const perceptron1958Spec: PaperStudySpec = {
  shortTitle: 'The Perceptron',
  citation: 'Frank Rosenblatt — The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain',
  yearVenue: '1958 · Psychological Review',
  sourceUrl: 'https://doi.org/10.1037/h0042519',
  appendixUrl: 'https://pubmed.ncbi.nlm.nih.gov/13602029/',
  before: '초기 인공 뉴런은 사람이 연결과 논리 규칙을 정하는 계산 모형에 가까웠다. 감각 입력에서 분류 규칙이 경험을 통해 어떻게 조직되는지는 별도 문제였다.',
  authorIntent: '물리 세계의 자극이 어떻게 감지되고, 어떤 형태로 기억되며, 저장된 정보가 이후 인식 행동을 어떻게 바꾸는지 하나의 학습 가능한 시스템으로 설명하려 했다.',
  thesis: '입력 연결의 가중치를 경험에 따라 강화하거나 약화하면, 명시적 규칙을 쓰지 않아도 자극을 통계적으로 구분하고 새로운 자극에 일반화하는 인식 시스템을 만들 수 있다.',
  reconstruction: [
    { label: 'Sensory field', value: 'stimulus x', note: '외부 자극의 검출' },
    { label: 'Association units', value: 'random projection', note: '중간 연결 집합' },
    { label: 'Response score', value: 'wᵀx+b', note: '흥분·억제 기여 합산' },
    { label: 'Reinforcement', value: 'Δw', note: '오류에 따른 연결 수정' },
  ],
  mechanism: [
    '감각 입력을 여러 association unit의 활동 패턴으로 바꾼다.',
    'Response unit으로 들어오는 흥분성·억제성 연결의 기여를 합쳐 선택 행동을 만든다.',
    '원하는 반응과 실제 반응이 다르면 관련 연결을 강화하거나 약화한다.',
    '반복 노출 뒤 학습하지 않은 입력에서도 같은 구분이 유지되는지를 일반화로 본다.',
  ],
  equations: [{
    latex: String.raw`s=w^\top x+b,\qquad \hat y=\mathbf 1[s\ge 0]`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{s=w^\top x+b}_{\text{입력의 부호 있는 점수}}\\[4pt]
\underbrace{\hat y=\mathbf 1[s\ge0]}_{\text{경계 통과 여부}}
\end{gathered}`,
    meaning: '현대 교과서식 축약이다. 각 입력의 기여를 내적으로 합산하고 bias가 정한 기준을 넘는지로 이진 반응을 만든다. 원 논문의 전체 확률적·연결주의 시스템을 이 한 식과 동일시하면 안 되지만, 현재 퍼셉트론 분류기의 계산 핵심은 보존한다.',
    symbols: [[String.raw`x`, '관측된 입력 특징'], [String.raw`w`, '학습되는 연결 강도'], [String.raw`b`, '결정 경계의 위치'], [String.raw`s`, '결정 전 score']],
  }],
  evidence: [
    { label: '학습 가능성', question: '고정 규칙 없이 강화 신호만으로 자극 분류가 조직되는가?', intervention: '연결 강도를 반응의 성공·실패에 따라 수정하고 반복 노출 전후의 반응을 비교한다.', observation: '반복된 강화가 특정 입력 패턴에 대한 안정된 선택 반응을 형성하는 모형을 제시한다.', supports: '가중 연결을 경험으로 학습한다는 계산 원리를 지지한다.', limit: '현대 이미지 데이터셋의 정확도나 생물학적 뇌의 실제 학습 규칙을 입증하지 않는다.' },
    { label: '일반화', question: '학습한 자극과 완전히 같지 않은 입력에도 반응이 이어지는가?', intervention: '입력 패턴의 중복과 association 연결의 통계적 구조를 바꾸어 반응 확률을 분석한다.', observation: '공유 구조가 있는 자극 사이에 반응이 일반화될 수 있음을 이론적으로 다룬다.', supports: '기억을 표본 복사가 아니라 연결 분포의 변화로 보는 관점을 지지한다.', limit: '선형 분리 불가능한 모든 문제를 해결한다는 뜻은 아니다.' },
  ],
  implementation: ['2차원 선형 분리 데이터와 XOR 데이터를 함께 만든다.', 'score, prediction, error가 보이도록 퍼셉트론 update를 한 sample씩 구현한다.', '각 update 전후의 decision boundary와 margin을 저장한다.', '선형 분리 데이터의 수렴과 XOR의 순환을 같은 seed·학습률에서 비교한다.'],
  assumptions: ['원하는 class가 하나의 hyperplane으로 분리 가능하다.', '입력 특징과 reinforcement label이 일관된 신호를 제공한다.'],
  failures: ['원 논문 전체를 현대의 단층 linear classifier 하나로 축소하면 역사적 의도와 확률적 분석을 놓친다.', '수렴 정리는 선형 분리 조건에 의존하므로 XOR 실패를 optimizer 부족으로 설명하면 안 된다.'],
  legacy: '가중치가 지식을 저장하고 오류가 연결을 수정한다는 학습 단위를 남겼다. 현대 신경망은 differentiable activation, 연속 loss, 다층 표현을 더했지만 입력·가중합·업데이트라는 뼈대는 유지한다.',
  nextReading: '다음 신경망·활성화 글에서 단일 hyperplane의 한계를 확인한 뒤, 1986년 역전파 논문에서 hidden unit의 표현을 학습하는 방식으로 넘어간다.',
  capabilities: ['Weight와 bias가 decision boundary를 어떻게 정하는지 설명한다.', '퍼셉트론 수렴 조건과 XOR 실패를 구분한다.', '원 논문의 넓은 시스템과 현대 교과서식 모델의 차이를 말할 수 있다.'],
};

export const backprop1986Spec: PaperStudySpec = {
  shortTitle: 'Learning Representations by Back-Propagating Errors',
  citation: 'Rumelhart, Hinton, Williams — Learning representations by back-propagating errors',
  yearVenue: '1986 · Nature',
  sourceUrl: 'https://www.nature.com/articles/323533a0',
  appendixUrl: 'https://www.cs.toronto.edu/~hinton/backprop.html',
  before: '출력층의 선형 결정은 학습할 수 있었지만 정답이 직접 주어지지 않는 hidden unit의 연결에 어떤 책임을 배분해야 하는지가 병목이었다.',
  authorIntent: '출력 오차를 내부 연결까지 전달해 hidden unit이 사람이 설계하지 않은 과제의 유용한 특징을 스스로 형성할 수 있음을 보이려 했다.',
  thesis: '미분 가능한 unit을 층으로 연결하고 출력 오차의 derivative를 역순으로 재사용하면 모든 weight를 효율적으로 조정하며 내부 표현을 학습할 수 있다.',
  reconstruction: [
    { label: 'Forward state', value: 'x → h → ŷ', note: '각 unit의 상태 저장' },
    { label: 'Output error', value: 'y−ŷ', note: '목표와 출력 차이' },
    { label: 'Backward signal', value: 'δ', note: '연쇄 법칙으로 전파' },
    { label: 'Weight change', value: 'Δw', note: '연결별 책임 수정' },
  ],
  mechanism: ['입력에서 출력까지 unit 상태를 계산하고 각 연결의 입력값을 저장한다.', '출력 unit에서 목표와 실제 출력의 차이를 derivative 신호로 바꾼다.', '다음 층의 error signal과 현재 연결 weight, local derivative를 곱해 hidden error를 만든다.', '각 weight에 도달한 signal과 forward input을 곱해 gradient를 얻고 반복 update한다.'],
  equations: [{
    latex: String.raw`\delta_j=f'(z_j)\sum_k w_{kj}\delta_k,\qquad \frac{\partial L}{\partial w_{ji}}=\delta_j a_i`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{c_j=\sum_k w_{kj}\delta_k}_{\text{다음 층 책임의 합}}\\[4pt]
\underbrace{\delta_j=f'(z_j)c_j}_{\text{현재 unit의 책임}}\\[4pt]
\underbrace{\dfrac{\partial L}{\partial w_{ji}}=\delta_j a_i}_{\text{연결 weight의 gradient}}
\end{gathered}`,
    meaning: 'Hidden unit j의 error signal은 다음 층에서 돌아온 신호의 가중합에 자신의 local derivative를 곱한 값이다. 같은 δj를 그 unit으로 들어온 모든 연결이 공유하고, 각 연결의 forward input ai가 개별 gradient를 정한다.',
    symbols: [[String.raw`\delta_j`, 'unit j 출력 변화가 loss에 미치는 신호'], [String.raw`f'(z_j)`, 'unit j의 local derivative'], [String.raw`w_{kj}`, 'j에서 다음 unit k로 가는 연결'], [String.raw`a_i`, 'weight wji의 forward 입력']],
  }],
  evidence: [
    { label: 'Internal code', question: 'Hidden unit이 정답 label에 직접 노출되지 않아도 유용한 특징을 만드는가?', intervention: '입력·출력 대응을 학습시킨 뒤 hidden activation이 만든 내부 code를 조사한다.', observation: 'Weight update 결과 hidden unit 사이 상호작용이 과제의 규칙성을 표현하는 사례를 제시한다.', supports: '오차 역전파가 feature learning을 가능하게 한다는 주장을 지지한다.', limit: '모든 hidden representation이 해석 가능하거나 유일한 분해임을 뜻하지 않는다.' },
    { label: 'Procedure', question: '각 weight를 따로 perturb하지 않고 모든 derivative를 계산할 수 있는가?', intervention: 'Forward에서 저장한 상태와 local derivative를 역순으로 재사용한다.', observation: 'Network의 연결 구조를 따라 출력 오차가 내부 연결의 weight change로 분해된다.', supports: '다층 network 학습에 효율적인 credit assignment 절차를 제공한다.', limit: 'Non-convex objective의 global optimum 도달을 보장하지 않는다.' },
  ],
  implementation: ['XOR을 푸는 2-2-1 MLP와 sigmoid activation을 구현한다.', 'Forward에서 z와 activation을 명시적으로 cache한다.', '출력 δ에서 hidden δ까지 손으로 계산한 값과 autograd를 비교한다.', '한 weight를 finite difference로 검사해 analytic gradient의 부호와 크기를 검증한다.'],
  assumptions: ['각 연산이 필요한 지점에서 미분 가능하고 forward graph가 알려져 있다.', 'Scalar objective가 원하는 행동 차이를 충분히 표현한다.'],
  failures: ['Backprop을 optimizer와 동일시하면 gradient 계산과 update 정책의 책임이 섞인다.', 'Gradient가 정확해도 saturation, 초기화, data, local minima 때문에 학습이 실패할 수 있다.'],
  legacy: '핵심 유산은 hidden unit도 end-to-end objective로 표현을 학습할 수 있다는 점이다. 오늘날 autograd는 같은 reverse-mode 원리를 임의의 계산 그래프와 tensor kernel에 일반화한다.',
  nextReading: '역전파 글에서 계산 그래프와 vector-Jacobian product를 구현한 뒤, optimizer 글에서 정확한 gradient를 실제 trajectory로 바꾸는 별도 문제를 다룬다.',
  capabilities: ['Hidden δ 식을 계산 순서로 전개한다.', 'Forward cache가 backward에 필요한 이유를 설명한다.', '역전파·autodiff·optimizer를 구분한다.'],
};

export const adam2014Spec: PaperStudySpec = {
  shortTitle: 'Adam',
  citation: 'Diederik P. Kingma, Jimmy Ba — Adam: A Method for Stochastic Optimization',
  yearVenue: '2014 · arXiv / ICLR 2015',
  sourceUrl: 'https://arxiv.org/abs/1412.6980',
  before: 'Momentum은 방향의 일관성을 기억하고 AdaGrad/RMSProp 계열은 좌표별 gradient scale을 조절했지만 두 상태를 하나의 간단한 stochastic optimizer로 결합하는 실용적 규칙이 필요했다.',
  authorIntent: 'Noisy·sparse gradient와 큰 parameter 공간에서 구현이 단순하고 memory 비용이 선형이며 좌표별 rescaling에 강한 first-order optimizer를 제안하려 했다.',
  thesis: 'Gradient의 1차·2차 moment 지수이동평균과 초기 편향 보정을 결합하면 stochastic objective에서 효율적인 adaptive update를 만들 수 있다.',
  reconstruction: [{ label: 'Gradient', value: 'gₜ', note: '현재 mini-batch 신호' }, { label: 'First moment', value: 'mₜ', note: '방향 EMA' }, { label: 'Second moment', value: 'vₜ', note: '제곱 크기 EMA' }, { label: 'Bias correction', value: 'm̂ₜ,v̂ₜ', note: '초기 0 편향 제거' }],
  mechanism: ['현재 mini-batch gradient를 계산한다.', 'Gradient와 squared gradient의 exponential moving average를 각각 갱신한다.', '0으로 초기화한 moving average가 초기에 작게 편향되는 효과를 step t로 보정한다.', '보정한 first moment를 second moment의 제곱근으로 나눠 좌표별 update를 만든다.'],
  equations: [{
    latex: String.raw`m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,\quad v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2`,
    meaning: 'm은 gradient 방향의 이동평균이고 v는 elementwise squared gradient의 이동평균이다. 둘은 parameter와 같은 shape의 optimizer state이며 scalar 평균이 아니다.',
    symbols: [[String.raw`g_t`, '현재 stochastic gradient'], [String.raw`m_t`, 'first moment estimate'], [String.raw`v_t`, 'second raw moment estimate'], [String.raw`\beta_1,\beta_2`, '과거 상태 보존 비율']],
  }, {
    latex: String.raw`\hat m_t=\frac{m_t}{1-\beta_1^t},\quad \hat v_t=\frac{v_t}{1-\beta_2^t},\quad \theta_t=\theta_{t-1}-\alpha\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}`,
    meaning: '초기 state가 0이라 생기는 편향을 보정한 뒤, 좌표별 최근 gradient scale로 방향 신호를 정규화한다. epsilon은 0 division을 막고 매우 작은 scale에서 update를 제한한다.',
    symbols: [[String.raw`\alpha`, 'global learning rate'], [String.raw`t`, 'optimizer update 횟수'], [String.raw`\epsilon`, '수치 안정성 상수'], [String.raw`\theta_t`, 'update 뒤 parameter']],
  }],
  evidence: [{ label: 'Noisy & sparse', question: 'Noisy하거나 sparse한 gradient에서도 안정적으로 전진하는가?', intervention: '여러 stochastic optimization task에서 다른 first-order 방법과 학습 곡선을 비교한다.', observation: 'Adam이 다양한 설정에서 경쟁력 있는 수렴 속도와 적은 tuning 요구를 보였다고 보고한다.', supports: '두 moment를 결합한 adaptive update의 실용성을 지지한다.', limit: '모든 architecture와 generalization에서 Adam이 SGD보다 우월하다는 보장은 아니다.' }],
  implementation: ['Scalar parameter 하나에서 m, v, bias correction을 step별로 출력한다.', '같은 gradient sequence에 SGD, Momentum, Adam을 적용해 update 차이를 비교한다.', 'Parameter와 m·v의 shape, dtype, device가 일치하는지 검사한다.', 'Framework Adam과 수동 구현의 첫 5 step을 수치 비교한다.'],
  assumptions: ['Gradient sample이 objective에 대한 유용한 stochastic 신호다.', '추가로 parameter당 두 state tensor를 저장할 memory가 있다.'],
  failures: ['Bias correction을 생략하면 초기 update가 의도와 달라진다.', '논문의 L2 항을 곧바로 현대 AdamW의 decoupled weight decay로 해석하면 안 된다.'],
  legacy: 'Adam은 large-scale deep learning의 기본 optimizer 중 하나가 되었지만 weight decay 결합, convergence 반례, generalization 차이는 후속 연구가 수정한 경계다.',
  nextReading: 'AdamW 논문에서 adaptive normalization 안에 L2 gradient를 섞는 것과 parameter를 직접 감쇠하는 것이 왜 달라지는지 확인한다.',
  capabilities: ['m과 v가 기억하는 정보를 구분한다.', 'Bias correction을 숫자로 계산한다.', 'Adam의 장점과 보장하지 않는 범위를 설명한다.'],
};

export const adamw2017Spec: PaperStudySpec = {
  shortTitle: 'Decoupled Weight Decay Regularization',
  citation: 'Ilya Loshchilov, Frank Hutter — Decoupled Weight Decay Regularization',
  yearVenue: '2017 · arXiv / ICLR 2019',
  sourceUrl: 'https://arxiv.org/abs/1711.05101',
  before: 'SGD에서는 L2 penalty gradient를 더하는 것과 weight를 직접 줄이는 update가 일정 조건에서 같지만, Adam처럼 좌표별로 gradient를 rescale하면 그 등가성이 깨진다.',
  authorIntent: 'Adaptive optimizer 구현에서 L2 regularization을 관습적으로 weight decay라고 부르는 혼동을 드러내고, loss gradient와 parameter shrinkage를 분리하려 했다.',
  thesis: 'Weight decay를 loss gradient 안에 넣지 않고 optimizer step과 독립적으로 parameter에 적용하면 adaptive update의 좌표별 scaling과 정규화 강도를 분리할 수 있다.',
  reconstruction: [{ label: 'Loss gradient', value: 'gₜ', note: 'task objective 신호' }, { label: 'Adam update', value: 'uₜ', note: 'moment로 rescale' }, { label: 'Decay', value: '−ηλθ', note: 'parameter 직접 축소' }, { label: 'New weight', value: 'θₜ₊₁', note: '두 효과 결합' }],
  mechanism: ['Data loss에서 gradient를 계산하고 Adam moment state를 갱신한다.', 'Adaptive normalization은 오직 data gradient update에 적용한다.', 'Weight decay 항은 정규화된 gradient에 섞지 않고 parameter 자체에 직접 적용한다.', 'Learning-rate schedule과 decay schedule의 결합을 명시적으로 관리한다.'],
  equations: [{
    latex: String.raw`\theta_{t+1}=\theta_t-\eta\,u_t-\eta\lambda\theta_t`,
    meaning: 'u는 Adam이 loss gradient로 만든 adaptive update다. Decay 항 λθ는 u를 계산하는 moment state에 들어가지 않고 별도로 parameter를 줄인다. 이것이 AdamW의 decoupling이다.',
    symbols: [[String.raw`u_t`, 'Adam moment와 normalization으로 만든 task update'], [String.raw`\lambda`, 'weight decay coefficient'], [String.raw`\eta`, 'learning rate'], [String.raw`\theta_t`, 'decay 대상 parameter']],
  }],
  evidence: [{ label: 'Decoupling', question: 'L2 penalty와 true weight decay를 adaptive optimizer에서 분리하면 tuning과 성능이 달라지는가?', intervention: 'Adam+L2와 decoupled AdamW를 regularization·learning-rate 조건에서 비교한다.', observation: 'Decoupling이 두 hyperparameter의 역할을 더 독립적으로 만들고 보고된 실험에서 generalization을 개선한다.', supports: 'Adaptive optimizer에서 L2와 weight decay가 같은 update가 아님을 지지한다.', limit: '모든 parameter에 동일 decay를 적용해야 한다거나 AdamW가 항상 최선임을 뜻하지 않는다.' }],
  implementation: ['동일 gradient sequence에서 Adam+L2와 AdamW의 한 step을 손으로 비교한다.', 'Bias·normalization parameter는 흔히 decay 대상에서 제외한다. 이 parameter들은 전체 weight matrix처럼 표현 용량을 직접 키우는 역할과 다르거나 scale-invariant한 경로에 놓일 수 있어, 같은 norm 축소를 적용해도 의도한 capacity regularization이 되지 않을 수 있기 때문이다. 다만 architecture와 recipe에 따라 validation으로 확인한다.', 'Learning rate가 바뀔 때 effective shrink factor가 어떻게 바뀌는지 기록한다.', 'Loss curve뿐 아니라 parameter norm과 validation metric을 함께 비교한다.'],
  assumptions: ['Parameter norm 축소가 과제에 유용한 inductive bias다.', 'Decay 대상과 제외 대상을 architecture에 맞게 선택한다.'],
  failures: ['AdamW를 Adam에 임의의 regularization을 더한 이름으로 설명하면 decoupling의 핵심을 놓친다.', 'Weight norm 감소만 보고 일반화가 좋아졌다고 단정할 수 없다.'],
  legacy: 'AdamW는 optimizer state update와 regularization update의 책임을 분리하는 구현 표준을 만들었다. 오늘날 많은 Transformer training recipe의 기본이지만 decay 대상, schedule, scale은 여전히 실험 변수다.',
  nextReading: 'Optimizer 글의 AdamW 실전 절에서 parameter group과 scheduler를 연결하고, 통계·일반화 글에서 validation evidence를 분리한다.',
  capabilities: ['SGD에서의 등가성과 Adam에서의 비등가성을 설명한다.', 'AdamW update를 두 항으로 분해한다.', 'Decay 제외 parameter를 정하는 이유를 말할 수 있다.'],
};

export const autoencoder2006Spec: PaperStudySpec = {
  shortTitle: 'Reducing Dimensionality with Neural Networks',
  citation: 'Hinton, Salakhutdinov — Reducing the Dimensionality of Data with Neural Networks',
  yearVenue: '2006 · Science',
  sourceUrl: 'https://doi.org/10.1126/science.1127647',
  appendixUrl: 'https://pubmed.ncbi.nlm.nih.gov/16873662/',
  before: 'PCA는 선형 projection으로 고차원 데이터를 압축할 수 있었지만, deep autoencoder를 random initialization에서 gradient descent로 안정적으로 학습하기 어려웠다.',
  authorIntent: 'Deep network를 좋은 초기 영역에 놓는 layer-wise pretraining을 사용해 작은 central code로 고차원 데이터를 비선형 복원하고 PCA보다 유용한 표현을 얻을 수 있는지 검증하려 했다.',
  thesis: 'Restricted Boltzmann machine을 층별로 사전학습한 뒤 reconstruction error로 fine-tune하면 deep autoencoder가 고차원 데이터를 낮은 차원의 비선형 code로 변환할 수 있다.',
  reconstruction: [{ label: 'High-D input', value: 'x', note: '관측 vector' }, { label: 'Pretrained encoder', value: 'fφ', note: '층별 초기화' }, { label: 'Central code', value: 'z', note: '낮은 차원' }, { label: 'Decoder', value: 'gψ(z)', note: '입력 복원' }],
  mechanism: ['각 인접 layer를 RBM으로 학습해 deep network의 weight를 순차 초기화한다.', 'Encoder weight를 펼치고 대응 decoder를 구성해 전체 autoencoder를 만든다.', '입력 자체를 target으로 reconstruction error를 계산한다.', 'Backpropagation으로 모든 encoder·decoder weight를 함께 fine-tune한다.'],
  equations: [{ latex: String.raw`z=f_\phi(x),\qquad \hat x=g_\psi(z),\qquad \min_{\phi,\psi}\sum_i L(x_i,\hat x_i)`, meaning: 'Central code z가 입력보다 낮은 차원이고 decoder가 복원해야 하므로, training은 복원에 유용한 정보가 z를 지나도록 압력을 준다. 하지만 작은 code만으로 의미나 disentanglement가 자동 보장되지는 않는다.', symbols: [[String.raw`f_\phi`, 'encoder'], [String.raw`g_\psi`, 'decoder'], [String.raw`z`, 'central low-dimensional code'], [String.raw`L`, 'reconstruction objective']] }],
  evidence: [{ label: 'PCA comparison', question: '비선형 deep code가 같은 차원의 linear PCA code보다 데이터를 잘 보존하는가?', intervention: '같은 low-dimensional code 목표에서 deep autoencoder와 PCA reconstruction·visualization을 비교한다.', observation: '논문 설정에서 deep code가 더 나은 reconstruction과 구조화된 2D embedding을 보였다고 보고한다.', supports: '비선형 encoder·decoder와 초기화가 dimensionality reduction에 유용함을 지지한다.', limit: '모든 데이터와 현대 random initialization에서도 동일 우위를 보장하지 않는다.' }],
  implementation: ['PCA와 동일 latent dimension의 작은 autoencoder를 학습한다.', 'Train/validation reconstruction error와 downstream linear probe를 분리해 측정한다.', 'Latent dimension과 decoder capacity를 바꾸어 단순 복사·정보 손실을 진단한다.', '현대 initialization만 사용한 baseline과 논문의 pretraining 의존성을 구분한다.'],
  assumptions: ['데이터가 낮은 차원의 비선형 구조를 가진다.', 'Reconstruction objective가 보존하려는 정보와 downstream 관심이 충분히 겹친다.'],
  failures: ['낮은 reconstruction error가 의미 있는 representation을 자동 보장하지 않는다.', '2006년의 layer-wise RBM pretraining을 현대 autoencoder의 필수 조건으로 일반화하면 안 된다.'],
  legacy: 'Deep unsupervised pretraining이 깊은 network optimization을 가능하게 했던 시기의 핵심 사례다. 초기화 기술은 바뀌었지만 encoder–latent–decoder와 reconstruction objective는 VAE, masked modeling, representation learning으로 이어졌다.',
  nextReading: '오토인코더 글에서 bottleneck·denoising·sparse 제약의 차이를 보고, 생성 모델 경로에서 deterministic code를 확률적 latent variable로 바꾸는 VAE로 이어간다.',
  capabilities: ['PCA와 nonlinear autoencoder의 가정을 비교한다.', '원 논문에서 pretraining이 왜 중요했는지 설명한다.', 'Reconstruction과 representation quality를 별도 지표로 평가한다.'],
};

export const fft1965Spec: PaperStudySpec = {
  mechanismViz: CooleyTukeyViz,
  shortTitle: 'An Algorithm for the Machine Calculation of Complex Fourier Series',
  citation: 'James W. Cooley, John W. Tukey — An Algorithm for the Machine Calculation of Complex Fourier Series',
  yearVenue: '1965 · Mathematics of Computation',
  sourceUrl: 'https://doi.org/10.1090/S0025-5718-1965-0178586-1',
  appendixUrl: 'https://research.ibm.com/publications/an-algorithm-for-the-machine-calculation-of-complex-fourier-series',
  before: 'N개 sample과 N개 frequency를 정의대로 모두 비교하면 O(N²) complex 연산이 필요해 큰 신호의 Fourier 계산이 비쌌다.',
  authorIntent: 'DFT 계수의 주기성과 index factorization을 이용해 같은 부분 계산을 재사용하고, 기계에서 대규모 complex Fourier series를 훨씬 적은 연산으로 계산하려 했다.',
  thesis: 'Transform 길이 N을 factor로 분해하고 작은 transform 결과를 twiddle factor로 재결합하면 같은 DFT 결과를 O(N log N) 계열의 연산으로 계산할 수 있다.',
  reconstruction: [{ label: 'Samples', value: 'x₀…xN−1', note: 'time-domain input' }, { label: 'Index factorization', value: 'N=N₁N₂', note: '작은 문제로 분할' }, { label: 'Sub-DFTs', value: 'Eₖ,Oₖ', note: '중복 계산 재사용' }, { label: 'Butterfly', value: '±ωₙᵏ', note: 'frequency bins 결합' }],
  mechanism: ['Input index를 factorized coordinate로 다시 쓴다.', '짝수·홀수 또는 일반 factor 집합의 작은 DFT를 독립적으로 계산한다.', '주기성이 같은 sub-result를 여러 output bin에서 재사용한다.', 'Twiddle factor를 곱하고 더하고 빼는 butterfly로 full transform을 조립한다.'],
  equations: [{
    latex: String.raw`X_k=E_k+\omega_N^kO_k,\qquad X_{k+N/2}=E_k-\omega_N^kO_k`,
    latexCompact: String.raw`\begin{gathered}
\underbrace{T_k=\omega_N^kO_k}_{\text{홀수 DFT의 위상 정렬}}\\[4pt]
\underbrace{X_k=E_k+T_k}_{\text{앞쪽 output}}\\[4pt]
\underbrace{X_{k+N/2}=E_k-T_k}_{\text{뒤쪽 output}}
\end{gathered}`,
    meaning: 'Radix-2의 현대식 핵심 결합이다. 짝수 sample DFT Ek와 홀수 sample DFT Ok를 한 번 계산하면 twiddle factor의 부호 대칭으로 output 두 개를 함께 만든다.',
    symbols: [[String.raw`E_k`, '짝수 index sample의 길이 N/2 DFT'], [String.raw`O_k`, '홀수 index sample의 길이 N/2 DFT'], [String.raw`\omega_N^k`, '상대 위상을 맞추는 complex root of unity'], [String.raw`N`, 'transform length']],
  }],
  evidence: [{ label: 'Operation count', question: '정확히 같은 transform을 더 적은 arithmetic으로 계산하는가?', intervention: 'Direct summation의 연산 수와 factorized algorithm의 곱셈·덧셈 수를 분석한다.', observation: 'Composite N에서 transform을 작은 transform으로 분해해 연산 수를 크게 줄이는 절차를 제시한다.', supports: 'FFT가 DFT의 근사가 아니라 계산 재사용 알고리즘이라는 점을 지지한다.', limit: '실제 wall-clock speed가 O 표기 비율과 항상 같거나 radix-2가 모든 hardware에서 최적임을 뜻하지 않는다.' }],
  implementation: ['N=8 signal의 direct DFT를 reference로 구현한다.', 'Even/odd split과 butterfly를 재귀적으로 구현한다.', 'Complex output을 tolerance 안에서 reference와 비교한다.', '연산 수, memory access, input length를 분리해 benchmark한다.'],
  assumptions: ['Transform length가 factorization 가능한 구조를 가진다.', 'Complex arithmetic의 반올림 error를 허용 가능한 tolerance로 관리한다.'],
  failures: ['FFT가 Fourier transform 자체이거나 주파수를 추정하는 별도 모델이라고 설명하면 안 된다.', 'Zero-padding으로 새로운 실제 frequency resolution이 생긴다고 해석하면 안 된다.'],
  legacy: 'DFT라는 수학적 변환과 그것을 계산하는 algorithm을 분리한 대표 사례다. 오늘날 signal processing, convolution, spectral method에서 library FFT를 쓰더라도 sampling·window·normalization 계약은 사용자가 이해해야 한다.',
  nextReading: 'FFT 글에서 sampling과 spectral leakage를 익힌 뒤 CNN convolution과 audio·time-series의 STFT로 연결한다.',
  nextLinks: [
    { slug: 'fft', label: 'FFT 계산에서 sampling으로 돌아가기', reason: '이 논문의 계산 재사용 원리를 실제 sampling, window와 spectral leakage 해석에 연결한다.' },
    { slug: 'cnn', label: 'CNN convolution으로 이어가기', reason: '주파수 변환과 convolution의 관계를 이미지의 local filter 학습으로 확장한다.' },
  ],
  capabilities: ['DFT와 FFT의 차이를 설명한다.', 'Radix-2 butterfly를 손으로 계산한다.', '복잡도와 실제 성능을 구분해 benchmark한다.'],
};

export const word2vec2013Spec: PaperStudySpec = {
  mechanismViz: Word2VecMechanismViz,
  shortTitle: 'Efficient Estimation of Word Representations',
  citation: 'Mikolov, Chen, Corrado, Dean — Efficient Estimation of Word Representations in Vector Space',
  yearVenue: '2013 · arXiv',
  sourceUrl: 'https://arxiv.org/abs/1301.3781',
  specialistEntry: {
    eyebrow: '기초 논문 원문 경로 · 2013 Word2Vec',
    title: 'Word2Vec의 계산을 먼저 익히고 논문이 바꾼 병목과 증거를 복원한다',
    description: '이 글은 단어 vector를 처음 소개하는 글이 아니라, 2013년 논문이 기존 neural language model의 어느 계산을 줄였고 무엇을 실험으로 보였는지 원문 순서로 다시 세우는 전문 읽기 단계다. 먼저 중심 단어·주변 문맥·embedding lookup과 cosine 비교를 계산해 본 뒤 논문의 주장으로 내려간다.',
    prerequisites: [
      '문장에서 중심 단어와 일정 거리 안의 주변 단어를 training pair로 만드는 법',
      '단어 ID가 embedding table의 한 행을 고르고 cosine으로 두 vector 방향을 비교한다는 점',
    ],
    links: [
      { slug: 'distributional-semantics', title: '선행 · 함께 등장한 횟수에서 의미 좌표까지', reason: '분포 가설, co-occurrence와 learned embedding이 해결하려는 공통 문제를 잡는다.' },
      { slug: 'word2vec', title: '선행 · Skip-gram·CBOW를 숫자로 계산하기', reason: 'Center·context pair, negative sampling과 embedding update를 먼저 손으로 따라간다.' },
    ],
  },
  before: 'Neural language model은 좋은 distributed representation을 만들 수 있었지만 hidden layer와 full vocabulary prediction 비용이 커 대규모 corpus에서 학습하기 어려웠다.',
  authorIntent: '복잡한 language model의 계산을 줄이고 매우 큰 text data에서 고품질 continuous word vector를 빠르게 학습하는 단순한 architecture를 제안하려 했다.',
  thesis: 'CBOW와 Skip-gram처럼 prediction objective를 단순화하면 billion-token 규모에서도 효율적으로 word vector를 학습하며 syntactic·semantic 관계가 vector geometry에 나타난다.',
  reconstruction: [{ label: 'Corpus window', value: 'wₜ₋c…wₜ₊c', note: '학습 pair 생성' }, { label: 'Lookup', value: 'E[w]', note: 'dense vector 선택' }, { label: 'Prediction', value: 'center↔context', note: '두 architecture' }, { label: 'Geometry', value: 'cosine / offset', note: '학습 결과 평가' }],
  mechanism: ['Corpus를 이동하며 중심 단어와 주변 문맥의 training example을 만든다.', 'CBOW는 주변 표현을 모아 중심을 예측하고 Skip-gram은 중심에서 주변을 예측한다.', 'Prediction error를 embedding table의 선택된 행으로 되돌려 같은 context를 가진 단어가 비슷한 update를 받게 한다.', '학습 뒤 similarity와 vector offset task로 관계 구조를 평가한다.'],
  equations: [{ latex: String.raw`\max_\theta\sum_t\sum_{-c\le j\le c,\,j\ne0}\log p_\theta(w_{t+j}\mid w_t)`, latexCompact: String.raw`\begin{aligned}\underbrace{\mathcal W_c}_{\text{주변 위치}}&=\{j:0<|j|\le c\}\\[2pt]\underbrace{J(\theta)}_{\text{학습 목표}}&=\sum_t\sum_{j\in\mathcal W_c}\log p_\theta(w_{t+j}\mid w_t)\\[2pt]\underbrace{\theta^*}_{\text{최적 embedding}}&=\arg\max_\theta J(\theta)\end{aligned}`, meaning: 'Skip-gram objective는 각 중심 단어 wt가 window 안의 context token을 높은 확률로 예측하게 한다. Window c가 커지면 더 먼 관계가 positive pair에 포함되고 계산량도 늘어난다.', symbols: [[String.raw`w_t`, '중심 token'], [String.raw`w_{t+j}`, '주변 context token'], [String.raw`c`, 'context window 반경'], [String.raw`\theta`, 'input·output embedding parameters']] }, {
    latex: String.raw`\max_\theta\sum_t\log p_\theta\!\left(w_t\,\middle|\,\frac{1}{|\mathcal W_c|}\sum_{j\in\mathcal W_c}v_{w_{t+j}}\right)`,
    latexCompact: String.raw`\begin{aligned}\underbrace{\bar v_t}_{\text{주변 표현 평균}}&=\frac1{|\mathcal W_c|}\sum_{j\in\mathcal W_c}v_{w_{t+j}}\\[2pt]\underbrace{J_{\mathrm{CBOW}}}_{\text{중심 예측 목표}}&=\sum_t\log p_\theta(w_t\mid\bar v_t)\end{aligned}`,
    meaning: 'CBOW는 Skip-gram의 화살표를 뒤집는다. 주변 token의 embedding을 한 표현으로 모아 가운데 단어를 예측하므로 한 training position에서 여러 context input을 공유해 계산할 수 있지만, 주변 순서와 서로 다른 의미 단서를 평균 과정에서 잃을 수 있다.',
    symbols: [[String.raw`\mathcal W_c`, '중심을 제외한 context 위치 집합'], [String.raw`v_{w_{t+j}}`, '각 주변 token의 input embedding'], [String.raw`\bar v_t`, '주변 embedding을 합치거나 평균한 CBOW hidden representation'], [String.raw`w_t`, '예측할 중심 token']],
  }],
  evidence: [
    { label: 'Efficiency', question: '단순화한 architecture가 큰 corpus에서 계산 비용을 낮추면서 representation 품질을 유지하는가?', intervention: '기존 neural language model과 CBOW·Skip-gram의 training complexity와 word similarity 결과를 비교한다.', observation: '논문은 큰 corpus를 짧은 시간에 학습하고 syntactic·semantic test에서 강한 vector를 얻었다고 보고한다.', supports: 'Prediction architecture 단순화가 scale과 representation quality를 함께 개선할 수 있음을 지지한다.', limit: 'Training time과 benchmark 품질은 corpus, vocabulary, dimension과 comparison setup에 묶인다.' },
    { label: '관계 geometry', question: '학습한 vector 차이가 단순 nearest-neighbor를 넘어 syntactic·semantic relation을 일관되게 담는가?', intervention: 'Country-capital, gender와 문법적 변형 같은 analogy 질문에서 vector offset으로 후보 단어를 검색한다.', observation: '논문은 여러 relation category에서 이전 표현보다 높은 정확도를 보고하고, 관계가 vector 방향 차이로 나타날 수 있음을 예시한다.', supports: 'Prediction objective가 단어 사이의 일부 관계를 선형 geometry에 배치할 수 있다는 주장을 지지한다.', limit: 'Static vector가 문맥별 다의성을 해결하거나 단어 의미를 완전하게 정의한다는 뜻은 아니며 일부 analogy 성공을 전체 의미 이해로 일반화할 수 없다.' },
  ],
  implementation: ['작은 corpus에서 vocabulary와 center-context pair를 생성한다.', 'Full softmax reference를 먼저 구현한 뒤 negative sampling과 계산량을 비교한다.', '빈도 subsampling과 window 변경이 pair 분포를 어떻게 바꾸는지 기록한다.', 'Similarity·analogy와 함께 nearest-neighbor의 반의어·편향 사례를 검사한다.'],
  assumptions: ['Corpus의 context 분포가 관심 있는 의미·기능 관계를 반영한다.', 'Tokenization과 frequency가 학습 pair를 심하게 왜곡하지 않는다.'],
  failures: ['1301.3781의 최초 architecture 설명과 후속 negative sampling 논문을 한 기여로 섞으면 안 된다.', 'Analogy 예시 몇 개만으로 embedding 전체의 의미 품질을 단정할 수 없다.'],
  legacy: '단어 표현을 lookup table의 부수 효과가 아니라 대규모 self-supervised prediction으로 학습하는 표준을 만들었다. 이후 contextual model은 하나의 단어에 고정 vector 하나만 주는 한계를 sequence-dependent representation으로 바꿨다.',
  nextReading: 'Word2Vec 글에서 negative sampling의 후속 기여를 구분한 뒤, Tokenizer와 Transformer embedding 경로로 넘어간다.',
  nextLinks: [
    { slug: 'word2vec', label: 'Word2Vec 계산으로 돌아가기', reason: 'Negative sampling을 후속 논문의 기여로 분리하고 실제 embedding update를 숫자로 계산한다.' },
    { slug: 'tokenizer', label: 'Tokenizer로 이어가기', reason: '고정 단어 vocabulary가 subword token과 현대 language-model input으로 바뀌는 경계를 읽는다.' },
  ],
  capabilities: ['CBOW와 Skip-gram의 입력·target 방향을 구분한다.', 'Window가 학습 데이터 정의라는 점을 설명한다.', 'Static embedding의 geometry와 한계를 함께 평가한다.'],
};
