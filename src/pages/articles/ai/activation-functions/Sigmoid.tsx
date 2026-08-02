import M from '@/components/ui/math';
import SigmoidViz from './viz/SigmoidViz';
import SigmoidDetailViz from './viz/SigmoidDetailViz';
import VanishingGradientViz from './viz/VanishingGradientViz';
import SigmoidUsageViz from './viz/SigmoidUsageViz';

export default function Sigmoid() {
  return (
    <section id="sigmoid" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시그모이드 (Sigmoid)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        시그모이드는 임의의 실수 입력을 <M>{'(0, 1)'}</M> 구간의 매끄러운 S 자 곡선으로 짠다 — <M>{'\\sigma(x) = 1 / (1 + e^{-x})'}</M>.<br />
        문제 두 가지: Vanishing Gradient (도함수 최댓값 <M>{"\\sigma'(0) = 0.25"}</M>) 와 비영점 중심 출력 (<M>{'\\sigma(x) > 0'}</M> 항상).
      </p>
      <SigmoidViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sigmoid 정의 &amp; 역사</h3>
        <p>
          1800년대 logistic regression 에서 시작, 1980–90년대 신경망 표준 activation 으로 자리잡았다가
          2010년대 이후 hidden layer 에선 ReLU 로 대체. Output / Gating 에서는 여전히 핵심.
          정의는 다음 한 줄:
        </p>
        <M display>{'\\sigma(x) = \\frac{1}{\\underbrace{1 + e^{-x}}_{\\text{양수 보장 분모}}}'}</M>
        <p>
          여기서 <M>{'x \\in \\mathbb{R}'}</M> 는 뉴런의 pre-activation (가중합),
          <M>{'e \\approx 2.71828'}</M> 는 자연로그 밑,
          <M>{'\\sigma(x) \\in (0, 1)'}</M> 는 출력 (양 끝 0, 1 은 절대 도달하지 않는 점근선).
          극한은 <M>{'\\sigma(-\\infty) = 0,\\; \\sigma(0) = 1/2,\\; \\sigma(+\\infty) = 1'}</M>.
          <strong>확률 해석</strong>: Bayes' rule 에서 <M>{'P(y=1 \\mid x) = 1 / (1 + e^{-z(x)})'}</M> 로 자연스레 등장 — logistic regression 의 기원.
        </p>
        <p>
          도함수는 출력값으로만 표현되는 깔끔한 형태:
        </p>
        <M display>{"\\sigma'(x) = \\underbrace{\\sigma(x)}_{\\text{출력값}} \\cdot \\underbrace{\\bigl(1 - \\sigma(x)\\bigr)}_{\\text{1-출력}} \\;\\le\\; \\underbrace{0.25}_{x=0\\text{에서 최대}}"}</M>
        <p>
          <M>{"\\sigma'(x)"}</M> 는 <M>{'\\sigma'}</M> 의 미분.
          <M>{'\\sigma(0) = 1/2'}</M> 일 때 <M>{"\\sigma'(0) = 1/2 \\cdot 1/2 = 0.25"}</M> 로 최대값을 가지고,
          입력이 양 끝으로 멀어지면 <M>{"\\sigma'(x) \\to 0"}</M> 로 수렴 — 이 지수적 감쇠가 곧 vanishing gradient 의 원천.
          forward 에서 <M>{'\\sigma(x)'}</M> 한 값만 저장해두면 backward 에서 곱셈 한 번으로 끝나므로 구현이 매우 가볍다.
        </p>
      </div>
      <SigmoidDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Vanishing Gradient 문제</h3>
        <p>
          Chain rule 은 층마다의 local gradient 를 곱해 내려가므로, <M>{"\\sigma'"}</M> 가 항상 <M>{'\\le 0.25'}</M> 인 sigmoid 를 N 층 쌓으면:
        </p>
        <M display>{'\\underbrace{\\left\\| \\frac{\\partial L}{\\partial h_1} \\right\\|}_{\\text{초기층 gradient}} \\;\\le\\; \\underbrace{0.25^N}_{\\text{매 층 곱해지는 } \\sigma\\prime \\text{ 최댓값}} \\cdot \\underbrace{\\left\\| \\frac{\\partial L}{\\partial h_N} \\right\\|}_{\\text{출력층 gradient}}'}</M>
        <p>
          여기서 <M>{'\\partial L / \\partial h_k'}</M> 는 k 번째 층 활성값에 대한 loss 의 gradient,
          <M>{'0.25^N'}</M> 은 매 층마다 곱해지는 sigmoid 도함수의 최댓값.
          <M>{'N = 10'}</M> 이면 <M>{'0.25^{10} \\approx 9.5 \\times 10^{-7}'}</M>,
          <M>{'N = 20'}</M> 이면 <M>{'0.25^{20} \\approx 9 \\times 10^{-13}'}</M> —
          float32 정밀도 (<M>{'\\sim 10^{-7}'}</M>) 와 학습 가능 한계 (<M>{'\\sim 10^{-6}'}</M>) 를 한참 밑돈다.
          → 초기층의 gradient 가 0 이 되어 사실상 학습이 멈춘다.
        </p>
      </div>
      <VanishingGradientViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">비영점 중심 출력 문제</h3>
        <p>
          Sigmoid 출력은 항상 <M>{'\\sigma(x) > 0'}</M> 이라, 다음 층 입력 <M>{'a_i'}</M> 가 모두 양수가 된다.
          그러면 그 층 가중치 <M>{'w_i'}</M> 의 gradient 부호가 단일 upstream gradient <M>{'\\partial L / \\partial z'}</M> 의 부호로 통일된다:
        </p>
        <M display>{'\\frac{\\partial L}{\\partial w_i} = \\underbrace{\\frac{\\partial L}{\\partial z}}_{\\text{모든 } i \\text{에 동일}} \\cdot \\underbrace{a_i}_{> 0 \\text{ (sigmoid 출력)}}'}</M>
        <p>
          <M>{'a_i > 0'}</M> 이 보장되므로 <M>{'\\partial L / \\partial w_i'}</M> 의 부호는 모든 i 에 대해 같음 →
          전체 가중치가 한 번에 같은 방향으로만 움직이고, 다음 step 에서 반대 방향으로 모두 뒤집힘 →
          loss 곡면 위에서 <strong>지그재그 궤적</strong>으로 수렴이 느려진다.
          tanh 가 zero-centered 출력 (<M>{'\\tanh(x) \\in (-1, 1)'}</M>) 으로 이 문제를 해결한 게 다음 절의 핵심.
          SigmoidDetailViz Step 1 에서 이 과정을 그래프로 확인.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sigmoid 현대 사용</h3>
        <p>
          Hidden layer 에선 ReLU/GELU 에 자리 내줬지만, output / gating 에선 여전히 필수다.
          핵심은 <strong>출력이 확률로 해석된다</strong>는 점 — binary classification head 에서 <M>{'\\hat{y} = \\sigma(z) \\in (0, 1)'}</M> 로 직결.
          LSTM / GRU 의 forget · input · output gate 가 0~1 의 "밸브" 역할을 하는 것도 sigmoid 의 출력 범위 덕분이다.
        </p>
      </div>
      <SigmoidUsageViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">PyTorch 사용법</h3>
        <p>
          sigmoid + log + BCE를 직접 조합하면 수치 불안정 — BCEWithLogitsLoss가 내부에서 log-sum-exp 트릭 적용.<br />
          SigmoidDetailViz의 Step 3에서 Bad vs Good 패턴 비교.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sigmoid의 생명력</p>
          <p>
            <strong>Hidden layer 사용 종료 이유</strong>:<br />
            - Vanishing gradient (지수적 감소)<br />
            - Saturation 시 학습 정체<br />
            - exp 계산 비용<br />
            - Non-zero-centered output
          </p>
          <p className="mt-2">
            <strong>하지만 여전히 필수</strong>:<br />
            ✓ Binary classification output<br />
            ✓ LSTM/GRU gates<br />
            ✓ Attention gating<br />
            ✓ Probability calibration<br />
            ✓ Multi-label classification
          </p>
          <p className="mt-2">
            <strong>현대적 교훈</strong>:<br />
            - Activation 선택은 위치 의존<br />
            - "Output layer" vs "Hidden layer" 역할 다름<br />
            - Sigmoid는 probabilistic interpretation이 필요한 곳<br />
            - "Old is gold" 일부 구조에선 여전히 최적
          </p>
        </div>

      </div>
    </section>
  );
}
