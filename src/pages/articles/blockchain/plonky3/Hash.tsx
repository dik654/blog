import Poseidon2RoundsViz from '../components/Poseidon2RoundsViz';

export default function Hash({ title }: { title?: string }) {
  return (
    <section id="hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Poseidon2 & 해시 레이어'}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Plonky3는 Merkle 트리와 Fiat-Shamir 채린저에 <strong>Poseidon2</strong>를 사용한다.
          BabyBear 위에서 최적화된 퍼뮤테이션으로, ZK-friendly 설계 덕분에
          회로 내부에서도 효율적으로 해시를 증명할 수 있다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <Poseidon2RoundsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Poseidon vs Poseidon2</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Poseidon (original, 2019)
// - SNARK-friendly hash function
// - 소수 필드 위 연산
// - S-box: x^α (α = 3, 5, 7 etc.)
// - MDS matrix multiplication
// - Rate-capacity split

// Poseidon2 (2023, improvements)
// - Same security, better performance
// - Improved round constants
// - More efficient MDS (diagonal matrix)
// - 3-5x faster than Poseidon
// - Used in Plonky3, Risc Zero

// Round structure
// R_full_beginning + R_partial + R_full_ending

// Full round
// 1) Add round constants
// 2) S-box to all elements
// 3) MDS matrix multiply

// Partial round
// 1) Add round constants
// 2) S-box to 1 element only (efficiency)
// 3) MDS matrix multiply

// Round counts (BabyBear, width 16)
// - R_F = 8 (full)
// - R_P = 12 (partial)
// - Total: 20 rounds

// Circuit constraints
// Poseidon2 (BabyBear): ~120 constraints per hash
// Keccak (emulated): ~30K constraints
// → 250x more efficient`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ZK-friendly Hash의 의의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 문제: Keccak-256은 SNARK 안에서 비쌈
// - 64-bit words on 254-bit field → bit decomposition 필요
// - Logical ops (XOR, AND, NOT) → many constraints
// - 1 Keccak hash = 30K+ constraints

// 해결: Algebraic hash on native field
// - 필드 연산만 사용 (+, -, ×, power)
// - 최소 constraints
// - Recursive proof에 필수

// ZK-friendly hash 후보들
// - Poseidon / Poseidon2: 가장 인기
// - Rescue / Rescue-Prime: academic
// - Griffin / Anemoi: newer
// - Tip5: Starknet's choice

// 사용 위치
// 1) Merkle tree (field elements)
// 2) Fiat-Shamir transform
// 3) Commitment schemes
// 4) PRF in circuit

// Trade-off
// Native efficient hash vs Standard hash
// - Algebraic hash: circuit 빠름, on-chain 느림
// - Keccak: circuit 느림, on-chain 빠름
// - 대부분 시스템이 algebraic 선호 (prover 비용 우선)`}</pre>

      </div>
    </section>
  );
}
