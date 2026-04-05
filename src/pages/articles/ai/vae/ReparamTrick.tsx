import ReparamViz from './viz/ReparamViz';

export default function ReparamTrick() {
  return (
    <section id="reparam-trick" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reparameterization Trick</h2>
      <div className="not-prose mb-8"><ReparamViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-2xl">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 필요한가?</h3>
        <p>
          인코더가 μ와 σ를 출력했다.<br />
          여기서 z를 직접 샘플링하면?
          <strong>확률적 연산은 미분이 안 된다.</strong>
          역전파가 끊기므로 학습 불가.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">해결: 노이즈를 분리</h3>
        <p>
          랜덤성을 외부로 빼는 트릭. ε ~ N(0,1)에서 먼저 샘플한 뒤,
          <strong>z = μ + σ × ε</strong>로 변환하면 μ와 σ에 대한 그래디언트가 흐른다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">숫자로 확인</h3>
        <ul>
          <li>σ₁ = exp(0.5 × (-0.8)) = exp(-0.4) = <strong>0.670</strong></li>
          <li>σ₂ = exp(0.5 × (-1.2)) = exp(-0.6) = <strong>0.549</strong></li>
          <li>ε = [0.5, -0.3] (N(0,1)에서 랜덤 샘플)</li>
          <li>z₁ = 0.35 + 0.670 × 0.5 = <strong>0.685</strong></li>
          <li>z₂ = -0.12 + 0.549 × (-0.3) = <strong>-0.285</strong></li>
        </ul>
        <p>
          이제 z = [0.685, -0.285]를 디코더에 전달한다.<br />
          매번 ε이 달라지므로 같은 입력이라도 살짝 다른 z가 나온다.<br />
          이것이 VAE의 "생성" 능력의 원천이다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reparameterization Trick 수학적 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 문제 정의
//
// VAE loss에서:
//   L = E_{z~q(z|x)}[log p(x|z)] - KL(q||p)
//
// 기대값 E_{z~q}[...] 안의 z 샘플링이 문제
// - 확률적 노드는 미분 불가
// - dL/dμ, dL/dσ 계산 불가
// - 역전파 끊김
//
// Monte Carlo 추정 시도:
//   L ≈ (1/M) Σ log p(x|z_m), z_m ~ N(μ, σ²)
//
//   여전히 z_m이 (μ, σ²)의 함수로 명시되지 않음
//   → gradient 흐름 불가

// 해결: Reparameterization
//
// z ~ N(μ, σ²) 를
// z = μ + σ · ε,  ε ~ N(0, 1) 로 변환
//
// 핵심 아이디어:
//   - 랜덤성 ε을 외부에서 샘플링 (고정)
//   - z는 (μ, σ, ε)의 결정론적 함수
//   - μ, σ에 대한 gradient 계산 가능
//
// 수학적 증명:
//   z = μ + σε
//   E[z] = μ + σ·E[ε] = μ (E[ε]=0)
//   Var[z] = σ² · Var[ε] = σ² (Var[ε]=1)
//   → z ~ N(μ, σ²)  ✓ (분포 같음)

// Gradient 흐름:
//   dL/dμ = dL/dz · dz/dμ = dL/dz · 1
//   dL/dσ = dL/dz · dz/dσ = dL/dz · ε
//   dL/dε = dL/dz · σ  (ε은 상수로 취급)
//
//   모든 필요한 gradient 존재
//   → backprop 가능

// PyTorch 구현:
def reparameterize(mu, logvar):
    std = torch.exp(0.5 * logvar)       # σ = exp(log σ² / 2)
    eps = torch.randn_like(std)          # ε ~ N(0, I)
    z = mu + eps * std                   # z = μ + σ·ε
    return z`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">일반 Reparameterization</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 다른 분포들의 Reparameterization
//
// 1. Gaussian N(μ, σ²):
//    z = μ + σ·ε, ε ~ N(0, 1)
//
// 2. Uniform U(a, b):
//    z = a + (b-a)·u, u ~ U(0, 1)
//
// 3. Exponential Exp(λ):
//    z = -log(u) / λ, u ~ U(0, 1)
//
// 4. Laplace L(μ, b):
//    z = μ - b·sign(u)·log(1 - 2|u|), u ~ U(-0.5, 0.5)
//
// 5. Gumbel-Softmax (discrete):
//    softmax((log π + g) / τ)
//    g_i = -log(-log(u_i)), u_i ~ U(0, 1)
//    τ = temperature (0에 가까울수록 one-hot)
//
// 6. Categorical:
//    Gumbel-Softmax trick 사용
//    VQ-VAE는 straight-through estimator 사용

// 핵심 조건:
//   "샘플링 = 간단한 분포(noise) + 결정론적 변환"
//
// 적용 불가능한 경우:
//   - Mixture 모델 (여러 컴포넌트 선택)
//   - 일반 discrete 분포 → Gumbel trick 필요
//   - 복잡한 조건부 분포

// 중요성:
//   - VAE의 학습 가능성 보장
//   - Flow 기반 모델의 핵심
//   - Variational inference 전반에 응용`}
        </pre>
        <p className="leading-7">
          요약 1: Reparameterization은 <strong>랜덤성 분리</strong>로 역전파 가능성 확보.<br />
          요약 2: <strong>z = μ + σ·ε</strong> (ε는 상수) — Gaussian의 핵심 트릭.<br />
          요약 3: 다른 분포도 <strong>noise + 변환</strong> 형태면 적용 가능 — Gumbel-Softmax 등.
        </p>
      </div>
    </section>
  );
}
