import SigmoidViz from './viz/SigmoidViz';
import SigmoidDetailViz from './viz/SigmoidDetailViz';
import VanishingGradientViz from './viz/VanishingGradientViz';
import SigmoidUsageViz from './viz/SigmoidUsageViz';

export default function Sigmoid() {
  return (
    <section id="sigmoid" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시그모이드 (Sigmoid)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        σ(x) = 1/(1+e^-x) — 매끄러운 S자 곡선, 출력 0~1.<br />
        문제: Vanishing Gradient(σ&apos; 최대 0.25) + 비영점 중심 출력.
      </p>
      <SigmoidViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sigmoid 정의 & 역사</h3>
        <p>
          1800년대 logistic regression에서 시작, 1980-90년대 신경망 표준 activation으로 자리잡음.<br />
          2010년대 이후 hidden layer에선 ReLU로 대체 — output/gating에서 여전히 핵심.
        </p>
      </div>
      <SigmoidDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Vanishing Gradient 문제</h3>
        <p>
          σ'(x) 최대값 0.25 → N층 쌓으면 gradient ∝ 0.25ᴺ로 지수적 감쇠<br />
          20층이면 1e-12 수준, 학습 한계(1e-6) 훨씬 아래
        </p>
      </div>
      <VanishingGradientViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">비영점 중심 출력 문제</h3>
        <p>
          Sigmoid 출력은 항상 양수 → gradient 부호가 같아져 weight 업데이트가 지그재그.<br />
          SigmoidDetailViz의 Step 1에서 이 과정을 시각적으로 확인.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sigmoid 현대 사용</h3>
        <p>
          Hidden layer에선 ReLU/GELU에 자리 내줌 — 하지만 Output/Gating에선 여전히 필수
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
