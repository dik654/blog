import ChainRuleViz from './viz/ChainRuleViz';
import ChainRuleMathViz from './viz/ChainRuleMathViz';
import ComputationalGraphViz from './viz/ComputationalGraphViz';

export default function ChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연쇄 법칙: 층별로 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        전체 식을 한번에 미분하면 복잡 → 층별로 쪼개서 미분한 뒤 곱한다.<br />
        dL/dm = dL/dh × dh/dm — 역전파의 본질.
      </p>
      <ChainRuleViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">연쇄 법칙 — 수학에서 VJP까지</h3>
        <p>
          합성 함수 미분 → 다층 네트워크 적용 → Jacobian 일반화 → autograd 최적화.
        </p>
      </div>
      <ChainRuleMathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Computational Graph 관점</h3>
        <p>
          신경망 = <strong>Computational Graph</strong> (각 노드=연산, 각 엣지=데이터 흐름)<br />
          Reverse-mode autodiff: Forward로 중간값 저장 → Backward로 역방향 gradient 전파<br />
          PyTorch <code>tensor.backward()</code>가 이 과정을 자동화
        </p>
      </div>
      <ComputationalGraphViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 연쇄 법칙이 딥러닝을 가능하게 한 이유</p>
          <p>
            <strong>이론적 기여</strong>: 수백 층 네트워크의 gradient 계산을 O(층수) 시간에 처리<br />
            <strong>대안 없음</strong>: 모든 parameter 조합을 시도하는 건 O(2^n) — 불가능<br />
            <strong>역전파(Backprop)</strong> = 연쇄 법칙을 computational graph에 체계적으로 적용한 것
          </p>
          <p className="mt-2">
            <strong>Vanishing/Exploding Gradient</strong>:<br />
            - 연쇄 법칙 = 많은 local gradient들의 곱<br />
            - 각 값이 &lt;1이면 지수적 감소 (vanish)<br />
            - 각 값이 &gt;1이면 지수적 증가 (explode)<br />
            - 해결: ReLU, batch norm, residual connection
          </p>
        </div>

      </div>
    </section>
  );
}
