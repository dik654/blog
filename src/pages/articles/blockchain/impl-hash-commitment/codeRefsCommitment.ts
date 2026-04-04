import type { CodeRef } from '@/components/code/types';

export const commitmentCodeRefs: Record<string, CodeRef> = {
  'circuit-boolean-mux': {
    path: 'circuits/merkle.rs — enforce_boolean + mux_circuit',
    lang: 'rust',
    highlight: [1, 28],
    desc: '기본 가젯: Boolean 제약 + 조건부 선택(mux).\nMerkle 경로의 좌/우 결정에 사용.',
    code: `/// Boolean 가젯: b ∈ {0, 1}
/// 제약: b · (1 - b) = 0
fn enforce_boolean(cs: &mut ConstraintSystem, b: Variable) {
    cs.enforce(
        LinearCombination::from(b),
        LinearCombination::from(Variable::One).add(-Fr::ONE, b),
        LinearCombination::zero(),
    );
}

/// 조건부 선택: result = if bit then when_true else when_false
/// result = when_false + bit · (when_true - when_false)
fn mux_circuit(
    cs: &mut ConstraintSystem,
    bit: Variable, bit_val: Fr,
    when_true: Variable, when_true_val: Fr,
    when_false: Variable, when_false_val: Fr,
) -> (Variable, Fr) {
    let diff_val = when_true_val - when_false_val;
    let t_val = bit_val * diff_val;
    let result_val = when_false_val + t_val;

    let t = cs.alloc_witness(t_val);
    let result = cs.alloc_witness(result_val);

    // bit · (when_true - when_false) = t
    cs.enforce(LC::from(bit), LC::from(when_true).add(-Fr::ONE, when_false), LC::from(t));
    // when_false + t = result
    cs.enforce(LC::from(when_false).add(Fr::ONE, t), LC::from(Variable::One), LC::from(result));
    (result, result_val)
}`,
    annotations: [
      { lines: [1, 8], color: 'sky', note: 'b·(1-b)=0 — b=0 또는 b=1만 만족. 다른 Fr 값은 불가' },
      { lines: [11, 12], color: 'emerald', note: 'mux = 선형 보간 — bit가 boolean이면 정확히 두 값 중 하나 선택' },
      { lines: [26, 29], color: 'amber', note: '2개 제약 — boolean 1개 포함 총 3개로 조건부 선택 완성' },
    ],
  },
  'commitment': {
    path: 'commitment.rs — commit + verify_commitment',
    lang: 'rust',
    highlight: [1, 18],
    desc: '해시 기반 커밋먼트.\nC = H(value, randomness) — Poseidon의 pre-image resistance로 hiding 보장.',
    code: `/// 커밋먼트 생성
/// commit(value, randomness) = poseidon_hash(value, randomness)
///
/// Hiding: randomness가 균일 랜덤이면 value 역산 불가
/// Binding: 같은 C에 다른 (v, r) 쌍을 찾는 것 ≈ collision
pub fn commit(value: Fr, randomness: Fr) -> Fr {
    poseidon_hash(value, randomness)
}

/// 커밋먼트 검증 (open)
/// H(value, randomness) == commitment?
pub fn verify_commitment(
    commitment: Fr, value: Fr, randomness: Fr,
) -> bool {
    commit(value, randomness) == commitment
}`,
    annotations: [
      { lines: [4, 5], color: 'sky', note: 'Hiding — randomness가 비밀이면 commitment에서 value 추론 불가' },
      { lines: [5, 5], color: 'emerald', note: 'Binding — collision resistance로 보장. 같은 C에 다른 값 불가' },
      { lines: [6, 8], color: 'amber', note: 'Poseidon 한 줄 — 별도 구조 없이 해시 호출만으로 커밋먼트 완성' },
    ],
  },
};
