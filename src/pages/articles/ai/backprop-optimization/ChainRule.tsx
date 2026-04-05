import ChainRuleViz from './viz/ChainRuleViz';
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

        <h3 className="text-xl font-semibold mt-6 mb-3">연쇄 법칙 수학적 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 합성 함수의 미분
// 함수 f(g(x))의 x에 대한 미분은
// df/dx = (df/dg) · (dg/dx)

// 다층 신경망에서
// L = loss, y = f(x), x = g(w), w = parameters
//
// dL/dw = dL/dy · dy/dx · dx/dw
//
// 각 층마다 local gradient 계산 후 곱함
// → 전체 gradient는 local gradient들의 product

// 예시: 2층 네트워크
// h = W1 @ x + b1
// y = relu(h)
// L = MSE(y, target)
//
// dL/dW1 = dL/dy · dy/dh · dh/dW1
// where:
//   dL/dy = 2(y - target)    // MSE derivative
//   dy/dh = relu'(h)          // ReLU derivative
//   dh/dW1 = x.T              // Linear layer`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">벡터/행렬 연쇄 법칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 스칼라 → 벡터 일반화
// y = f(x) where x ∈ R^n, y ∈ R^m
// Jacobian: J = ∂y/∂x ∈ R^(m×n)
//
// 연쇄 법칙:
// ∂z/∂x = (∂z/∂y) · J
//
// Backprop에서는
// upstream gradient: dz/dy (from next layer)
// local jacobian: dy/dx (this layer)
// downstream gradient: dz/dx = (dz/dy) · (dy/dx)

// 실무에서는 Jacobian을 명시적으로 계산하지 않음
// 대신 Jacobian-vector product (JVP) 또는
// Vector-Jacobian product (VJP)만 계산
// → 메모리 효율적
// → autograd 엔진의 핵심

// 예: Linear layer y = Wx
// dy/dx = W (Jacobian = W 자체)
// downstream = upstream · W  (matrix product)
// vs explicit Jacobian: O(mn) memory`}</pre>

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
