export default function Poseidon() {
  return (
    <section id="poseidon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon Hash</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SHA-256은 비트 연산(XOR, 회전, 시프트)에 기반하여 ZK 회로에서 각 비트를 변수로 표현해야 하므로
          하나의 해시에 약 25,000개의 R1CS 제약이 필요합니다. 반면 Poseidon은 체 산술(add, mul, pow)만
          사용하여 약 250개의 제약으로 동일한 작업을 수행합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">SPN 구조 (Substitution-Permutation Network)</h3>
        <p>
          Poseidon은 체 원소(Fr) 단위의 SPN 구조를 사용합니다. 각 라운드는 세 단계로 구성됩니다.
        </p>
        <ul>
          <li><strong>AddRoundConstants</strong> — 대칭성 파괴를 위해 상수를 더함</li>
          <li><strong>S-box (x → x&#x2075;)</strong> — 비선형성(confusion) 제공</li>
          <li><strong>MDS Matrix Mix</strong> — 확산(diffusion) 제공</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">S-box: x&#x2075;</h3>
        <p>
          S-box 지수 α=5가 선택된 이유는 순열 조건 gcd(α, r-1) = 1을 만족하는 가장 작은 홀수이기 때문입니다.
          BN254에서 α=3은 gcd(3, r-1) = 3이므로 불가능합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// S-box: x → x⁵ (Fr 곱셈 3회)
let x2 = x.square();   // x²
let x4 = x2.square();  // x⁴
x4 * x                 // x⁵

// R1CS 제약: 3개 (곱셈 게이트 3개)
// SHA-256의 비트 연산 하나가 ~32개 제약인 것과 비교`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">MDS 행렬</h3>
        <p>
          MDS(Maximum Distance Separable) 행렬은 모든 부분행렬의 det ≠ 0을 만족하여
          최대 확산(branch number = T+1)을 보장합니다.
          T=3일 때 I₃ + J₃ = [[2,1,1],[1,2,1],[1,1,2]]를 사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HADES 전략과 Sponge 구조</h3>
        <p>
          HADES 설계에서는 RF/2 full rounds → RP partial rounds → RF/2 full rounds로 구성됩니다.
          BN254 파라미터: T=3, RF=8, RP=57, 총 65 라운드. Full round는 모든 원소에 S-box를 적용하고,
          partial round는 첫 번째 원소에만 적용하여 보안은 유지하면서 비용을 58% 절감합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Sponge: state = [capacity=0, rate₀=left, rate₁=right]
  → 65 라운드 permutation
  → output = state[1]

Full round:  T=3 S-box × 3 제약 = 9 제약/라운드
Partial:     1 S-box × 3 제약   = 3 제약/라운드
총: 8×9 + 57×3 = 72 + 171 = 243 제약 ≈ 250`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">보안 보장</h3>
        <p>
          Sponge의 capacity=1일 때 보안 비트 = min(254/2, 254) = 127 bits.
          RF=8은 보간/대수적 공격을, RP=57은 차분/통계적 공격을 방어합니다.
          Poseidon은 Filecoin, Mina, Zcash 등 주요 프로젝트에서 표준으로 사용됩니다.
        </p>
      </div>
    </section>
  );
}
