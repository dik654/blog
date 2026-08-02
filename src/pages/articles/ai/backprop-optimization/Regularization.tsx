import M from '@/components/ui/math';
import RegularizationScene from './viz/RegularizationScene';
import L1L2Scene from './viz/L1L2Scene';
import DropoutScene from './viz/DropoutScene';
import RegTechScene from './viz/RegTechScene';

export default function Regularization() {
  return (
    <section id="regularization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">정규화 기법</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        과적합(overfitting) 방지 — 훈련 loss 는 줄었지만 테스트 loss 가 안 준다면 모델이 데이터를 <strong>외운 것</strong>.<br />
        Regularization 은 <M>{'L_{\\text{total}} = L_{\\text{data}} + \\lambda R(\\theta)'}</M> 로 <strong>의도적 방해</strong>를 걸어 일반화를 유도한다.
      </p>
      <RegularizationScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">전체 목적 함수</h3>
        <M display>{'L_{\\text{total}}(\\theta) = \\underbrace{\\frac{1}{N}\\sum_{i=1}^{N} \\ell(f_\\theta(x_i), y_i)}_{\\text{data loss } L_{\\text{data}}} + \\lambda \\underbrace{R(\\theta)}_{\\text{penalty}}'}</M>
        <p>
          <M>{'L_{\\text{data}}'}</M> 는 평균 예측 오차 (CE, MSE 등). <M>{'R(\\theta)'}</M> 는 파라미터 자체에 부과하는 페널티 — "모델이 지나치게 복잡해지지 마라" 는 제약.<br />
          <M>{'\\lambda \\in \\mathbb{R}^+'}</M> 는 regularization strength, 스칼라. <M>{'\\lambda = 0'}</M> 이면 제약 없음, 크면 파라미터가 <M>R</M> 을 최소화하는 방향으로 강하게 당겨진다.
          현실 값은 <M>{'10^{-5} \\sim 10^{-3}'}</M>, hyperparameter search 로 조정.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">L1 vs L2 Regularization</h3>
        <p>
          가장 흔한 두 가지 페널티:
        </p>
        <M display>{'\\underbrace{R_{L_2}(\\theta) = \\tfrac{1}{2}\\|\\theta\\|_2^2 = \\tfrac{1}{2}\\sum_i \\theta_i^2}_{\\text{유클리드 norm² (smooth, weight decay)}}, \\quad \\underbrace{R_{L_1}(\\theta) = \\|\\theta\\|_1 = \\sum_i |\\theta_i|}_{\\text{맨해튼 norm (sparse 유도)}}'}</M>
        <p>
          <M>{'\\|\\theta\\|_2'}</M> 는 유클리드 norm (벡터 길이), <M>{'\\|\\theta\\|_1'}</M> 는 맨해튼 norm (절댓값 합). 둘 다 <M>{'\\theta_i'}</M> 가 0 일 때 최소.
        </p>
        <p>
          Gradient 를 비교하면 차이가 선명해진다:
        </p>
        <M display>{'\\underbrace{\\nabla R_{L_2} = \\theta}_{\\text{크기 비례 감쇠 (큰 weight 강하게)}}, \\quad \\underbrace{\\nabla R_{L_1} = \\mathrm{sign}(\\theta)}_{\\pm 1 \\text{ 상수 — 작은 weight 도 0 으로 끌어감}}'}</M>
        <p>
          <strong>L2</strong>: gradient 크기가 <M>{'|\\theta_i|'}</M> 에 비례 → 큰 가중치는 세게, 작은 가중치는 약하게 줄임. 결과적으로 모든 <M>{'\\theta_i'}</M> 가 <strong>작아지지만 0 은 아님</strong>.
          Update 에 대입하면 <M>{'\\theta_{t+1} = (1 - \\eta\\lambda)\\theta_t - \\eta \\nabla L_{\\text{data}}'}</M> — 매 step <M>{'(1 - \\eta\\lambda)'}</M> 만큼 <strong>지수 감소</strong>.
          이 때문에 "weight decay" 라고 부른다.<br />
          <strong>L1</strong>: gradient 크기가 <M>{'\\theta_i'}</M> 와 무관하게 <M>{'\\pm 1'}</M> 고정 → 작은 <M>{'\\theta_i'}</M> 도 일정 속도로 0 으로 끌어당김.
          결과적으로 많은 <M>{'\\theta_i = 0'}</M> 인 <strong>sparse solution</strong>. Feature selection 효과.
        </p>
        <p>
          기하학적으로 같은 얘기: 제약 조건 <M>{'R(\\theta) \\le c'}</M> 의 등값선이 L2 는 원, L1 은 마름모.
          등값 loss 타원이 제약 영역과 만나는 접점이 L1 의 경우 축 위에 걸릴 확률이 높다 (꼭짓점이 축 위에 있으므로) → 어떤 축은 0.
        </p>
      </div>

      <L1L2Scene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          이 Scene은 L1 (마름모) 과 L2 (원) 제약 영역이 loss 등값선과 어디서 만나는지 보여준다.
          "L1 이 왜 sparse 해지는가" 는 말로 설명해도 안 와닿지만 꼭짓점에 걸리는 모습을 한 번 보면 잊히지 않는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Dropout</h3>
        <p>
          Dropout 은 L1/L2 처럼 페널티를 걸지 않는다. 대신 <strong>훈련 시 뉴런을 확률 <M>p</M> 로 랜덤하게 죽인다</strong>:
        </p>
        <M display>{'h_i^{\\text{train}} = \\underbrace{\\frac{1}{1 - p}}_{\\text{inverted scale (기댓값 보존)}} \\cdot \\underbrace{m_i}_{\\text{Bernoulli mask}} \\odot \\underbrace{h_i}_{\\text{원래 활성값}}, \\quad m_i \\sim \\mathrm{Bernoulli}(1 - p)'}</M>
        <p>
          <M>{'h_i'}</M> 는 i 번째 뉴런의 활성값 (forward 중간 출력). <M>{'m_i \\in \\{0, 1\\}'}</M> 는 샘플마다 독립적으로 뽑는 mask — <M>{'1-p'}</M> 확률로 1 (생존), <M>p</M> 확률로 0 (제거).<br />
          <M>{'p \\in [0, 1)'}</M> 는 dropout rate. 보통 <M>{'p = 0.1 \\sim 0.5'}</M>.<br />
          <M>{'1/(1-p)'}</M> 스케일이 붙는 이유는 <strong>inverted dropout</strong> — 훈련 시 활성값 기댓값을 <M>{'E[h^{\\text{train}}] = h'}</M> 로 유지해
          추론 시엔 <strong>mask 없이 full network</strong> 를 그대로 쓸 수 있게 한다.
        </p>
        <p>
          왜 효과적인가: 각 mini-batch 마다 다른 sub-network 가 훈련되므로 <strong>지수적으로 많은 모델의 ensemble</strong> 을 암묵적으로 학습.
          뉴런들이 서로의 존재에 과도하게 의존하는 co-adaptation 을 방지 — 각 뉴런이 <strong>독자적으로 유용한 feature</strong> 를 추출해야 살아남는다.
        </p>
      </div>

      <DropoutScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          위 Scene은 같은 네트워크에서 훈련 iteration 마다 mask 가 어떻게 바뀌는지, 그리고 추론 시엔 모든 노드가 살아있는지 보여준다.
          "ensemble" 이 비유가 아니라 수학적 사실임을 확인하는 단계.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">BatchNorm · Early Stopping · Data Augmentation</h3>
        <p>
          <strong>Batch Normalization</strong> 은 각 레이어의 활성값을 배치 단위로 표준화:
        </p>
        <M display>{'\\hat{h}_i = \\frac{\\overbrace{h_i - \\mu_\\mathcal{B}}^{\\text{평균 빼기 (centering)}}}{\\underbrace{\\sqrt{\\sigma_\\mathcal{B}^2 + \\epsilon}}_{\\text{표준편차 나누기 (scaling)}}}, \\quad y_i = \\underbrace{\\gamma}_{\\text{학습되는 scale}} \\hat{h}_i + \\underbrace{\\beta}_{\\text{학습되는 shift}}'}</M>
        <p>
          <M>{'\\mu_\\mathcal{B} = \\frac{1}{B}\\sum_i h_i'}</M> 는 배치 평균, <M>{'\\sigma_\\mathcal{B}^2 = \\frac{1}{B}\\sum_i (h_i - \\mu_\\mathcal{B})^2'}</M> 는 배치 분산 (둘 다 feature 별로).<br />
          <M>{'\\epsilon \\approx 10^{-5}'}</M> 는 0 분산 방지용 작은 상수.<br />
          <M>{'\\gamma, \\beta'}</M> 는 학습 가능한 scale · shift 파라미터 (feature 별 스칼라). 정규화를 과하게 걸지 않고 모델이 원하는 분포로 되돌릴 자유를 준다.<br />
          효과: internal covariate shift 감소, gradient 흐름 안정, 더 큰 <M>{'\\eta'}</M> 허용, 약한 regularization 효과 (배치 noise).
        </p>
        <p>
          <strong>Early Stopping</strong>: 매 epoch 마다 validation loss 를 측정, <M>{'L_{\\text{val}}'}</M> 이 <M>k</M> epoch 연속 개선되지 않으면 훈련 종료.
          가장 단순하지만 강력한 regularization — "최적 모델 용량"을 자동으로 찾는 셈.
        </p>
        <p>
          <strong>Data Augmentation</strong>: 입력 <M>x</M> 에 task-preserving 변환 (이미지의 경우 random crop/flip/color jitter, 텍스트의 경우 synonym replacement 등) 을 적용.
          수학적으로는 <M>x</M> 의 분포를 불변 변환 <M>{'T \\sim \\mathcal{T}'}</M> 로 확장해 <M>{'\\mathbb{E}_{T} [\\ell(f_\\theta(T(x)), y)]'}</M> 를 최소화하는 것.
          모델이 <strong>불변성</strong>을 학습하도록 강제 → 자연스러운 inductive bias.
        </p>
      </div>

      <RegTechScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          위 Scene은 BatchNorm 의 분포 정렬 · Early stopping 의 validation curve · Augmentation 의 입력 변형을 같은 시간축에서 함께 보여준다.
          각각은 다른 층위에서 작동하지만 최종 목표 (일반화 성능) 는 같다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 정규화는 귀납적 편향(inductive bias)</p>
          <p>
            <strong>철학적 관점</strong>: regularization = "모델에게 특정 가정을 강제"<br />
            - L2: "weights should be small" — 부드러운 함수 선호 (<M>{'\\|\\theta\\|'}</M> 가 작으면 Lipschitz 상수가 작다)<br />
            - L1: "few weights should matter" — sparse 함수 선호<br />
            - Dropout: "no single neuron is indispensable" — 중복·분산 표현 선호<br />
            - BatchNorm: "features should have similar scale" — 잘 조건화된 landscape 선호<br />
            - Augmentation: "model should be invariant to <M>{'T'}</M>" — task 구조적 대칭성 반영
          </p>
          <p className="mt-2">
            <strong>조합 전략 (modern DL)</strong>:<br />
            - Always: Weight decay (L2) 작게 <M>{'(\\lambda = 10^{-4} \\sim 10^{-5})'}</M><br />
            - Always: Batch/Layer Norm (Transformer 는 LayerNorm)<br />
            - Often: Dropout <M>{'(p = 0.1 \\sim 0.5)'}</M><br />
            - Always: Data augmentation (domain-specific)<br />
            - Always: Early stopping (safety net)
          </p>
          <p className="mt-2">
            <strong>스케일 고려</strong>:<br />
            - 작은 모델: 강한 regularization 필요 (capacity 대비 데이터가 많으니 쉽게 외운다)<br />
            - 대형 LLM: 적은 regularization (데이터 자체가 엄청나서 외우기 어렵고, weight decay 만으로 충분)<br />
            - Transfer learning: regularization 줄이기 (pre-trained 가깝게 유지해야 도메인 지식이 보존됨)
          </p>
        </div>
      </div>
    </section>
  );
}
