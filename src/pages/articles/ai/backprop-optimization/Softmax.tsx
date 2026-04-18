import SoftmaxViz from './viz/SoftmaxViz';
import SoftmaxExamplesViz from './viz/SoftmaxExamplesViz';
import TemperatureViz from './viz/TemperatureViz';
import SoftmaxAdvancedViz from './viz/SoftmaxAdvancedViz';

export default function Softmax() {
  return (
    <section id="softmax" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">소프트맥스: 숫자를 확률로</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h값의 범위가 자유로움 → 0~1 확률로 변환 필요.<br />
        Softmax: y_i = e^h_i / Σe^h_j — 큰 값은 확대, 작은 값은 축소.
      </p>
      <SoftmaxViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Softmax 수학적 정의 & 예시</h3>
        <p>
          <code>p_i = exp(x_i) / Σ exp(x_j)</code> — 입력 크기 차이에 따라 증폭 정도가 극단적으로 달라짐<br />
          속성: Monotonic (순서 보존), Translation invariant (<code>softmax(x+c)=softmax(x)</code>), Not scale invariant (큰 스케일에선 극단값만 남음)
        </p>
      </div>
      <SoftmaxExamplesViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Temperature Scaling — 분포 조절</h3>
        <p>
          <code>softmax(x/T)</code> — T→0이면 argmax에 수렴, T→∞면 uniform으로 수렴<br />
          T=1은 표준, 작을수록 sharp, 클수록 flat
        </p>
      </div>
      <TemperatureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">수치 안정 · LogSoftmax · 변형</h3>
        <p>
          exp overflow 문제와 해법, LogSoftmax의 수학적 근거, 실전 패턴, 그리고 용도별 변형.
        </p>
      </div>
      <SoftmaxAdvancedViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Softmax의 기원과 의미</p>
          <p>
            <strong>Boltzmann Distribution</strong>: Statistical mechanics에서 유래<br />
            p(state) ∝ exp(-E / kT)<br />
            - Softmax = -x가 energy인 Boltzmann<br />
            - Temperature가 유사한 역할<br />
            - Physical intuition
          </p>
          <p className="mt-2">
            <strong>왜 exp인가?</strong>:<br />
            - Maximum entropy under constraint → exponential family<br />
            - Non-negative 보장<br />
            - Scale-invariant 성질 (translation)<br />
            - Gradient가 깔끔 (ŷ - y with CE)
          </p>
          <p className="mt-2">
            <strong>대안 가능?</strong>:<br />
            - sigmoid/n: 간단하지만 확률 아님<br />
            - squaring: 음수 문제<br />
            - argmax: differentiable 아님<br />
            → Softmax가 여러 측면에서 최적
          </p>
        </div>

      </div>
    </section>
  );
}
