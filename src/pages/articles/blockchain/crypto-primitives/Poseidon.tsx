import PoseidonSPNViz from './viz/PoseidonSPNViz';
import PoseidonRoundViz from './viz/PoseidonRoundViz';
import CodePanel from '@/components/ui/code-panel';

export default function Poseidon() {
  return (
    <section id="poseidon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poseidon Hash</h2>
      <div className="not-prose mb-8"><PoseidonSPNViz /></div>
      <h3 className="text-lg font-semibold mb-3">Poseidon 라운드 흐름</h3>
      <div className="not-prose mb-8"><PoseidonRoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SHA-256 — 비트 연산(XOR, 회전, 시프트) 기반<br />
          ZK 회로에서 각 비트를 변수로 표현 → 해시 하나에 ~25,000 R1CS 제약 필요<br />
          Poseidon — 체 산술(add, mul, pow)만 사용, ~250 제약으로 동일 작업 수행
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">SPN 구조 (Substitution-Permutation Network)</h3>
        <p>
          Poseidon — 체 원소(Fr) 단위 SPN 구조 사용<br />
          각 라운드 세 단계 구성
        </p>
        <ul>
          <li><strong>AddRoundConstants</strong> — 대칭성 파괴를 위해 상수를 더함</li>
          <li><strong>S-box (x → x&#x2075;)</strong> — 비선형성(confusion) 제공</li>
          <li><strong>MDS Matrix Mix</strong> — 확산(diffusion) 제공</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">S-box: x&#x2075;</h3>
        <p>
          S-box 지수 α=5 선택 이유 — 순열 조건 gcd(α, r-1) = 1을 만족하는 최소 홀수.
          BN254에서 α=3은 gcd(3, r-1) = 3이므로 불가
        </p>
        <CodePanel title="S-box: x → x⁵" code={`// S-box: x → x⁵ (Fr 곱셈 3회)
let x2 = x.square();   // x²
let x4 = x2.square();  // x⁴
x4 * x                 // x⁵

// R1CS 제약: 3개 (곱셈 게이트 3개)
// SHA-256의 비트 연산 하나가 ~32개 제약인 것과 비교`} defaultOpen annotations={[
          { lines: [2, 4], color: 'sky', note: '곱셈 3회로 x⁵ 계산' },
          { lines: [6, 7], color: 'emerald', note: 'SHA-256 대비 제약 수 비교' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">MDS 행렬</h3>
        <p>
          MDS(Maximum Distance Separable) 행렬 — 모든 부분행렬 det ≠ 0<br />
          최대 확산(branch number = T+1) 보장<br />
          T=3일 때 I₃ + J₃ = [[2,1,1],[1,2,1],[1,1,2]] 사용
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HADES 전략과 Sponge 구조</h3>
        <p>
          HADES 설계 — RF/2 full → RP partial → RF/2 full rounds 구성<br />
          BN254 파라미터: T=3, RF=8, RP=57, 총 65 라운드<br />
          Full round — 모든 원소에 S-box 적용<br />
          Partial round — 첫 번째 원소에만 적용, 보안 유지하면서 비용 58% 절감
        </p>
        <CodePanel title="Sponge 구조와 제약 수" code={`Sponge: state = [capacity=0, rate₀=left, rate₁=right]
  → 65 라운드 permutation
  → output = state[1]

Full round:  T=3 S-box × 3 제약 = 9 제약/라운드
Partial:     1 S-box × 3 제약   = 3 제약/라운드
총: 8×9 + 57×3 = 72 + 171 = 243 제약 ≈ 250`} defaultOpen annotations={[
          { lines: [1, 3], color: 'sky', note: 'Sponge 입출력 구조' },
          { lines: [5, 7], color: 'emerald', note: '총 ~250 제약 (SHA-256의 1/100)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">보안 보장</h3>
        <p>
          Sponge capacity=1 → 보안 비트 = min(254/2, 254) = 127 bits<br />
          RF=8 — 보간/대수적 공격 방어, RP=57 — 차분/통계적 공격 방어<br />
          Filecoin, Mina, Zcash 등 주요 프로젝트에서 표준으로 사용
        </p>
      </div>
    </section>
  );
}
