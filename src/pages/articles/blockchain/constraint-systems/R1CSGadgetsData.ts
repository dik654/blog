export const SBOX_CODE = `t1 = x · x       ← 제약 1 (x²)
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
}`;

export const BOOLEAN_CODE = `제약: b · (1 - b) = 0
  A = [(b, 1)],  B = [(One, 1), (b, -1)],  C = 0

검증:
  b=0: 0·(1-0) = 0 ✓    b=1: 1·(1-1) = 0 ✓
  b=2: 2·(1-2) = -2 ✗   Fr에서 0과 1만 만족!`;

export const MUX_CODE = `보조 변수: t = bit · (when_true - when_false)
제약 1: bit · (when_true - when_false) = t
제약 2: (when_false + t) · 1 = result

예: bit=1, when_true=42, when_false=99
  t = 1 · (42-99) = -57
  result = 99 + (-57) = 42  ← when_true 선택 ✓`;

export const POSEIDON_CODE = `Full round (T=3):  AddRC 3 + S-box 9 + MDS 3 = 15 제약
Partial round:     AddRC 3 + S-box 3 + MDS 3 =  9 제약

총 제약: Full 8×15 = 120, Partial 57×9 = 513, 출력 1
합계: 634 제약 (순수 S-box만 세면 243개)`;

export const MERKLE_CODE = `각 레벨: Boolean(1) + Mux×2(4) + Poseidon(634) ≈ 639 제약
깊이 4 Merkle tree: ~3,186 제약
깊이 20 Merkle tree: ~12,780 제약

가젯 조합:
  1. Boolean: 경로 비트가 {0,1}인지 강제
  2. Mux: 비트에 따라 (current, sibling) 순서 결정
  3. Poseidon: 해시 계산
  4. 등치 제약: 최종 해시 = 공개 root`;
