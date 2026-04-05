import ExpectationViz from './viz/ExpectationViz';

export default function Expectation({ title }: { title?: string }) {
  return (
    <section id="expectation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '기대값: 확률을 곱한 예상치'}</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        E[X] = Σ x·P(x) — 값과 확률의 곱을 합산한 예상치.<br />
        확률 분포가 다르면 같은 능력치라도 기대값이 달라진다.
      </p>
      <ExpectationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">기대값의 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Discrete Random Variable
// E[X] = Σ x_i · P(X = x_i)

// Continuous Random Variable
// E[X] = ∫ x · f(x) dx

// 예시: 공평한 주사위
// X = {1, 2, 3, 4, 5, 6}
// P(X = i) = 1/6
// E[X] = (1+2+3+4+5+6)/6 = 3.5

// 예시: 편향된 동전 (앞 확률 0.7)
// X = 앞(1) 또는 뒤(0)
// E[X] = 1 · 0.7 + 0 · 0.3 = 0.7

// 예시: 주사위 제곱값
// Y = X²
// E[Y] = E[X²] = Σ x²·P(x)
//      = (1 + 4 + 9 + 16 + 25 + 36)/6
//      ≈ 15.17

// 주의: E[X]² ≠ E[X²]
// E[X]² = 3.5² = 12.25
// E[X²] = 15.17
// 차이 = 2.92 = Var(X) = E[X²] - E[X]²`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Expectation의 속성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Linearity (선형성)
// E[aX + bY + c] = a·E[X] + b·E[Y] + c
// → 독립 여부 무관

// 2. E[constant] = constant
// E[c] = c

// 3. E[f(X)]  일반적으로 ≠ f(E[X])
// 예: E[X²] ≠ (E[X])²
// 예: E[log X] ≠ log(E[X])   (Jensen's inequality)

// 4. 독립인 경우만
// E[XY] = E[X] · E[Y]   (X, Y 독립 시)

// 5. Conditional expectation
// E[X|Y] = f(Y)
// Law of total expectation: E[X] = E[E[X|Y]]

// Variance (분산)
// Var(X) = E[(X - E[X])²] = E[X²] - E[X]²

// Standard deviation
// σ(X) = √Var(X)

// Covariance
// Cov(X, Y) = E[(X - E[X])(Y - E[Y])]
//           = E[XY] - E[X]E[Y]`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ML에서 Expectation 활용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1. Loss function definition
// L(θ) = E_(x,y)~D[ℓ(f(x; θ), y)]
// - 전체 data distribution에 대한 loss 기대값
// - Practice: sample mean으로 근사
// L_empirical = (1/n) Σ ℓ(f(x_i), y_i)

// 2. Entropy
// H(P) = -E_(x~P)[log P(x)] = -Σ P(x) log P(x)
// = "자기 정보량의 기대값"

// 3. Cross-entropy
// H(P, Q) = -E_(x~P)[log Q(x)] = -Σ P(x) log Q(x)

// 4. Monte Carlo estimation
// E[f(X)] ≈ (1/N) Σ f(x_i)  where x_i ~ P
// - N번 sampling 후 평균
// - VAE, RL, Bayesian inference 기본

// 5. Expected Reward (RL)
// V(s) = E[Σ γ^t · R_t | s_0 = s]
// - 상태 s에서 시작하는 할인 보상 기대값

// 6. Fisher Information
// I(θ) = E[(∂log p(x;θ)/∂θ)²]
// - Parameter estimation uncertainty
// - Natural gradient 도출

// 7. Gradient expectation
// E_(x~P)[∇log p(x;θ)] = 0  (score function identity)
// - Policy gradient 도출에 사용`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Jensen's Inequality</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Jensen's Inequality
// f가 convex 함수일 때
// f(E[X]) <= E[f(X)]

// f가 concave일 때 (부등호 반대)
// f(E[X]) >= E[f(X)]

// 예시: log 함수는 concave
// log(E[X]) >= E[log X]

// 중요 결과: KL Divergence가 비음수
// KL(P||Q) = E_(x~P)[log(P(x)/Q(x))]
//          = -E_(x~P)[log(Q(x)/P(x))]
//          >= -log(E_(x~P)[Q(x)/P(x)])   (Jensen, log concave)
//          = -log(Σ P(x) · Q(x)/P(x))
//          = -log(Σ Q(x))
//          = -log(1) = 0

// 응용: ELBO (Variational Inference)
// log p(x) >= E_q[log p(x,z) - log q(z)]
// ELBO = "log evidence의 하한"
// VAE 훈련의 objective function`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Python 구현 예</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`import numpy as np

# 이산 확률변수 기대값
def discrete_expectation(values, probs):
    return np.sum(np.array(values) * np.array(probs))

# 주사위
expectation = discrete_expectation([1,2,3,4,5,6], [1/6]*6)
print(expectation)  # 3.5

# 함수의 기대값 E[f(X)]
def expectation_of_function(f, values, probs):
    return np.sum(f(np.array(values)) * np.array(probs))

e_square = expectation_of_function(lambda x: x**2, [1,2,3,4,5,6], [1/6]*6)
print(e_square)  # 15.17

# Monte Carlo estimation
def monte_carlo_expectation(f, sampler, n_samples=10000):
    samples = sampler(n_samples)
    return np.mean(f(samples))

# 표준 정규분포의 E[X²]
mc_est = monte_carlo_expectation(
    lambda x: x**2,
    lambda n: np.random.randn(n),
    n_samples=100000
)
print(mc_est)  # ≈ 1.0 (theoretical: Var(N(0,1)) = 1)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Expectation이 확률의 핵심인 이유</p>
          <p>
            <strong>통계적 결정 이론</strong>:<br />
            - 최적 결정 = expected utility 최대화<br />
            - 불확실성 하의 reasoning = expectation<br />
            - Risk-neutral decision maker의 기준
          </p>
          <p className="mt-2">
            <strong>ML에서의 역할</strong>:<br />
            - 모든 loss function은 expectation<br />
            - Training = empirical expectation 최적화<br />
            - Generalization = true expectation 추정<br />
            - Gradient descent = expected gradient 추적
          </p>
          <p className="mt-2">
            <strong>직관 vs 수식</strong>:<br />
            - E[X]는 "장기 평균값" 직관<br />
            - 개별 관찰값은 E[X]와 다를 수 있음<br />
            - 표본 크기 증가 → 평균이 E[X]로 수렴 (LLN)<br />
            - 모델 훈련 = 대수의 법칙 활용
          </p>
        </div>

      </div>
    </section>
  );
}
