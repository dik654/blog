import CodePanel from '@/components/ui/code-panel';
import { FRI_CODE, FRI_ANNOTATIONS } from './FRIData';

export default function FRI({ title }: { title?: string }) {
  return (
    <section id="fri" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Linear Codes (Ligero/Brakedown)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Linear Codes</strong> 기반 PCS는 오류 정정 부호와 해시 함수만을 사용하여
          양자 컴퓨터에 대한 강한 저항성을 제공합니다.<br />
          대수적 구조에 의존하지 않으므로 투명한 설정이 가능합니다.
        </p>

        <h3>Linear Codes PCS 구현</h3>
        <CodePanel title="RS 인코딩 + Merkle Tree" code={FRI_CODE}
          annotations={FRI_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">FRI (Fast Reed-Solomon IOP)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FRI Protocol (Ben-Sasson et al. 2018)
//
// 목적: 다항식 low-degree 증명
//   Prover가 commit한 f가 실제로
//   차수 ≤ d인 다항식의 evaluation인지 증명
//
// STARK의 핵심 primitive
//
// 기본 아이디어: Folding
//
// 1. Reed-Solomon Encoding
//    f: evaluations over domain D = {g^0, g^1, ..., g^(N-1)}
//    |D| = blowup × d (예: ρ=1/4면 4배)
//
// 2. Merkle Tree commit
//    RS evaluations를 Merkle Tree로 커밋
//
// 3. Folding (재귀적 축소)
//    f(x) = f_even(x²) + x · f_odd(x²)
//
//    Fold with random α:
//    f'(y) = f_even(y) + α · f_odd(y)  where y = x²
//
//    |D'| = |D| / 2
//    degree halved
//
// 4. Repeat until constant
//    log(n) rounds
//
// 5. Query phase
//    Random positions에서 consistency 체크
//    Soundness error: (1-δ)^q (q queries)

// Algebraic Linking Identity:
//   f_even(x²) = (f(x) + f(-x)) / 2
//   f_odd(x²)  = (f(x) - f(-x)) / (2x)
//
//   Each fold: f_even과 f_odd의 random linear combo

// 복잡도:
//   Commit: O(N log N)
//   Prove:  O(N log N)
//   Verify: O(log² N)
//   Proof:  O(log² N) hashes + O(log N) values

// STARK에서 활용:
//   AIR → Trace polynomial
//   → RS encoding
//   → FRI low-degree test
//   → Batched across constraints

// 구현체:
//   - StarkWare (Cairo)
//   - Risc0 (RISC-V VM)
//   - Winterfell
//   - Plonky2 (FRI + Goldilocks)
//   - Stone (prover)

// Linear Codes 변형:
//   Ligero, Brakedown: 해시만 사용
//   - O(log² n) proof
//   - No trusted setup
//   - Post-quantum`}
        </pre>
      </div>
    </section>
  );
}
