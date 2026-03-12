export default function R1CSGadgets() {
  return (
    <section id="r1cs-gadgets" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS 가젯 (Poseidon, Merkle 회로)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">가젯이란?</h3>
        <p>가젯(Gadget)은 반복적으로 사용되는 R1CS 패턴이다. 복잡한 회로를 기본 가젯의 조합으로 구성하며, native 코드와 circuit 코드의 출력이 동일해야 한다(native = circuit 원칙).</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">S-box 가젯: x → x⁵ (3개 제약)</h3>
        <p>Poseidon 해시의 핵심 비선형 연산으로, square-and-multiply로 3개 제약만 사용한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`t1 = x · x       ← 제약 1 (x²)
t2 = t1 · t1     ← 제약 2 (x⁴)
y  = t2 · x      ← 제약 3 (x⁵)

// Rust 구현
fn sbox_circuit(cs: &mut ConstraintSystem, x: Variable, x_val: Fr)
    -> (Variable, Fr) {
    let x2 = cs.alloc_witness(x_val.square());
    let x4 = cs.alloc_witness(x2_val.square());
    let x5 = cs.alloc_witness(x4_val * x_val);
    cs.enforce(from(x), from(x), from(x2));   // x * x = x²
    cs.enforce(from(x2), from(x2), from(x4)); // x² * x² = x⁴
    cs.enforce(from(x4), from(x), from(x5));  // x⁴ * x = x⁵
    (x5, x5_val)
}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Boolean 가젯: b ∈ &#123;0,1&#125; (1개 제약)</h3>
        <p>변수 b가 반드시 0 또는 1임을 강제한다. 이 제약 없이는 공격자가 b=2 같은 값으로 mux 결과를 조작할 수 있다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`제약: b · (1 - b) = 0
  A = [(b, 1)],  B = [(One, 1), (b, -1)],  C = 0

검증:
  b=0: 0·(1-0) = 0 ✓    b=1: 1·(1-1) = 0 ✓
  b=2: 2·(1-2) = -2 ✗   Fr에서 0과 1만 만족!`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Mux 가젯: 조건부 선택 (2개 제약)</h3>
        <p>bit 값에 따라 두 입력 중 하나를 선택한다. result = when_false + bit * (when_true - when_false).</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`보조 변수: t = bit · (when_true - when_false)
제약 1: bit · (when_true - when_false) = t
제약 2: (when_false + t) · 1 = result

예: bit=1, when_true=42, when_false=99
  t = 1 · (42-99) = -57
  result = 99 + (-57) = 42  ← when_true 선택 ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Poseidon 회로 제약 분해</h3>
        <p>Poseidon의 65라운드(Full 8 + Partial 57)를 R1CS로 변환한다. AddRC와 MDS는 선형 연산이지만, 선형결합을 변수로 고정하는 추가 제약이 필요하다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Full round (T=3):  AddRC 3 + S-box 9 + MDS 3 = 15 제약
Partial round:     AddRC 3 + S-box 3 + MDS 3 =  9 제약

총 제약: Full 8×15 = 120, Partial 57×9 = 513, 출력 1
합계: 634 제약 (순수 S-box만 세면 243개)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Proof 검증 회로</h3>
        <p>Merkle proof 검증은 여러 가젯의 조합이다. 각 레벨마다 Boolean(경로 방향) + Mux(입력 순서 결정) + Poseidon(해시)을 반복하고, 최종 해시가 공개 root와 일치하는지 확인한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`각 레벨: Boolean(1) + Mux×2(4) + Poseidon(634) ≈ 639 제약
깊이 4 Merkle tree: ~3,186 제약
깊이 20 Merkle tree: ~12,780 제약

가젯 조합:
  1. Boolean: 경로 비트가 {0,1}인지 강제
  2. Mux: 비트에 따라 (current, sibling) 순서 결정
  3. Poseidon: 해시 계산
  4. 등치 제약: 최종 해시 = 공개 root`}</code></pre>
      </div>
    </section>
  );
}
