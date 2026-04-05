import CodePanel from '@/components/ui/code-panel';
import GadgetCostViz from './viz/GadgetCostViz';
import { SBOX_CODE, BOOLEAN_CODE, MUX_CODE, POSEIDON_CODE, MERKLE_CODE } from './R1CSGadgetsData';

export default function R1CSGadgets() {
  return (
    <section id="r1cs-gadgets" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS 가젯 (Poseidon, Merkle 회로)</h2>
      <div className="not-prose mb-8"><GadgetCostViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">가젯이란?</h3>
        <p>가젯(Gadget)은 반복적으로 사용되는 R1CS 패턴입니다.
        <br />
          복잡한 회로를 기본 가젯의 조합으로 구성합니다.
        <br />
          native 코드와 circuit 코드의 출력이 동일해야 합니다(native = circuit 원칙).</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">S-box 가젯: x → x⁵ (3개 제약)</h3>
        <p>Poseidon 해시의 핵심 비선형 연산입니다.
        <br />
          square-and-multiply(제곱-곱셈 방식)로 3개 제약만 사용합니다.</p>
        <CodePanel
          title="S-box 가젯 (Rust)"
          code={SBOX_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'square-and-multiply 3단계' },
            { lines: [6, 15], color: 'emerald', note: 'Rust 회로 구현' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Boolean 가젯: b ∈ &#123;0,1&#125; (1개 제약)</h3>
        <p>변수 b가 반드시 0 또는 1임을 강제합니다.
        <br />
          이 제약 없이는 공격자가 b=2 같은 값으로 mux 결과를 조작할 수 있습니다.</p>
        <CodePanel
          title="Boolean 제약"
          code={BOOLEAN_CODE}
          annotations={[
            { lines: [1, 2], color: 'violet', note: '제약 정의' },
            { lines: [4, 6], color: 'amber', note: '0과 1만 만족하는 이유' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Mux 가젯: 조건부 선택 (2개 제약)</h3>
        <p>bit 값에 따라 두 입력 중 하나를 선택합니다.
        <br />
          result = when_false + bit * (when_true - when_false) 공식을 사용합니다.</p>
        <CodePanel
          title="Mux 가젯"
          code={MUX_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '보조 변수와 2개 제약' },
            { lines: [5, 7], color: 'emerald', note: '구체적 예시' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Poseidon 회로 제약 분해</h3>
        <p>Poseidon의 65라운드(Full 8 + Partial 57)를 R1CS로 변환합니다.
        <br />
          AddRC와 MDS(Maximum Distance Separable 행렬)는 선형 연산이지만, 선형결합을 변수로 고정하는 추가 제약이 필요합니다.</p>
        <CodePanel title="Poseidon 제약 수 분석" code={POSEIDON_CODE} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Proof 검증 회로</h3>
        <p>Merkle proof 검증은 여러 가젯의 조합입니다.
        <br />
          각 레벨마다 Boolean(경로 방향) + Mux(입력 순서 결정) + Poseidon(해시)을 반복합니다.
        <br />
          최종 해시가 공개 root와 일치하는지 확인합니다.</p>
        <CodePanel
          title="Merkle Proof 검증 회로 구성"
          code={MERKLE_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '깊이별 제약 수' },
            { lines: [5, 8], color: 'emerald', note: '가젯 조합 순서' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">가젯 라이브러리와 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// R1CS Gadget Cookbook
//
// 1) Range check (0 <= x < 2^n):
//
//    Bit decomposition:
//      x = sum(b_i * 2^i, i=0..n-1)
//      each b_i: boolean constraint
//
//    Cost: n + 1 constraints (n booleans + 1 combine)
//
//    Example (n=64):
//      65 constraints
//
//    Optimization: chunked range checks
//      4-bit chunks: 16 values each
//      lookup table (Plonkish) → O(n/4) constraints

// 2) Comparison (a < b):
//
//    Standard: range check of (b - a - 1)
//    255 constraints for field element
//
//    Better: bit-decompose both, compare bit-by-bit
//    ~512 constraints but cleaner

// 3) Conditional assignment:
//
//    if cond then a else b:
//      Boolean(cond)
//      result = cond * a + (1-cond) * b
//
//    Cost: 2 constraints (boolean + mux)

// 4) ECDSA signature verification:
//
//    Scalar mult on BN254 base field
//    (foreign-field arithmetic expensive)
//
//    Naive: ~1.5M constraints
//    Optimized: ~400K constraints
//    With custom gates (Plonkish): ~50K
//
//    Tricks:
//      - Window NAF scalar mult
//      - Endomorphism (GLV)
//      - Precomputed tables

// 5) Hash functions comparison:
//
//    SHA-256:
//      - Byte-oriented, not ZK-friendly
//      - ~25,000 R1CS constraints per block
//      - Needed for Ethereum/Bitcoin compat
//
//    Keccak-256:
//      - Similar to SHA-3, bit-heavy
//      - ~150,000 constraints
//      - Needed for Ethereum state
//
//    Poseidon:
//      - ZK-friendly algebraic hash
//      - ~250 constraints (t=3, 2 inputs)
//      - MDS + S-box (x^5 or x^17)
//      - Used in: Zcash Orchard, Mina, Filecoin
//
//    Rescue-Prime:
//      - Alternating S-box rounds
//      - ~300 constraints
//      - Provable security arguments
//
//    MiMC:
//      - Original ZK-friendly hash
//      - ~600 constraints
//      - Deprecated in favor of Poseidon

// 6) Merkle proof cost analysis:
//
//    Depth 20 Merkle tree:
//      Per level: Boolean + Mux + Poseidon
//                 1 + 2 + 250 = 253 constraints
//      Total: 20 * 253 = 5060 constraints
//
//    Depth 32 (Ethereum MPT):
//      32 * 253 = 8096 constraints
//
//    With Plonkish custom gates:
//      Poseidon: ~40 gates (vs 250)
//      → 10x reduction
//
//    Sparse Merkle Tree proofs:
//      Fixed depth (256 for full addressing)
//      256 * 253 = 64,768 constraints

// 7) Circuit composition patterns:
//
//    Groth16 (circuit-specific):
//      Constraints locked per circuit
//      Can't change without new trusted setup
//
//    Plonk (universal):
//      Single setup, reusable circuits
//      Circuit described at prove time
//
//    Recursive composition (Nova, folding):
//      Verify previous proof inside circuit
//      IVC (Incrementally Verifiable Computation)
//      → constant-size proof for unbounded computation

// 8) Testing gadgets:
//
//    Satisfiability test:
//      Generate valid witness
//      cs.is_satisfied() → true
//
//    Negative test:
//      Modify witness
//      cs.is_satisfied() → false
//
//    Constraint count assertion:
//      cs.num_constraints() matches expected
//
//    Fuzz test:
//      Random inputs
//      Compare native vs circuit output
//      Catches off-by-one in bit decomposition`}
        </pre>
      </div>
    </section>
  );
}
