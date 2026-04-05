import ZKHashViz from './viz/ZKHashViz';

export default function ZKFriendly() {
  return (
    <section id="zk-friendly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK 친화 해시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SHA-256은 비트 연산 기반 &rarr; R1CS 제약 ~25,000.
          Poseidon은 체 연산만 사용 &rarr; ~300 제약(80배 효율).
        </p>
      </div>
      <div className="not-prose"><ZKHashViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZK-Friendly Hash Functions</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Arithmetic Hash Functions for ZK
//
// 문제:
//   SHA-256을 ZK circuit에서 증명하려면
//   - ~25,000 R1CS constraints per hash
//   - Merkle proof 20 levels → 500,000 constraints
//   - 비트 연산 (XOR, AND, ROT)이 field에서 비쌈
//
// 해결: Field-friendly hash
//   Field 연산만 사용 (add, mul, S-box)
//   → Constraint 수 수백 배 감소

// Poseidon Hash (2019):
//   - Field: F_p (큰 prime)
//   - State: t field elements (보통 3)
//   - Rounds: R_F (full) + R_P (partial)
//   - S-box: x^5 (일반적)
//
// 한 라운드:
//   1. AddRoundConstants
//   2. S-box (x^5)
//      - Full rounds: 모든 element에
//      - Partial rounds: 첫 element만
//   3. MixLayer (MDS matrix)
//
// 파라미터 (128-bit security):
//   t=3, R_F=8, R_P=57
//   ~300 constraints per hash
//
// 80배 이상 효율 (vs SHA-256)

// 다른 ZK-friendly hashes:
//
// MiMC (2016):
//   - 최초 ZK 해시
//   - x^3 또는 x^5 S-box
//   - 단순, 오래된 분석
//
// Rescue / Rescue-Prime:
//   - STARK-friendly
//   - Starkware 사용
//   - S-box: x^α and x^(1/α)
//
// Griffin (2022):
//   - 최신, 더 효율적
//   - Round 수 감소
//
// Reinforced Concrete (2022):
//   - Lookup-based
//   - Plonkish arithmetization 친화적

// 성능 비교 (constraint per hash):
//   SHA-256:       25,000+ (R1CS)
//   MiMC:          1,000~2,000
//   Poseidon:      ~300
//   Rescue:        ~288
//   Griffin:       ~194
//   Reinforced Concrete: ~50 (lookup tables)

// 사용 프로젝트:
//   Zcash:        Pedersen, Poseidon
//   Dusk Network: Poseidon
//   Aleo:         Poseidon
//   Starknet:     Poseidon, Pedersen
//   Mina:         Poseidon (Pasta curves)
//   Filecoin:     Poseidon (SNARK proofs)

// Trade-offs:
//   ✓ ZK circuit 효율
//   ✗ Native 계산 느림 (SHA-256 대비)
//   ✗ 분석 역사 짧음 (보수적 파라미터)
//   ✗ Side-channel 공격 연구 부족`}
        </pre>
      </div>
    </section>
  );
}
