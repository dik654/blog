import type { CodeRef } from '@/components/code/types';

export const circuitCodeRefs: Record<string, CodeRef> = {
  'poseidon-circuit': {
    path: 'circuits/poseidon.rs — sbox_circuit + poseidon_hash_circuit',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'S-box의 R1CS 변환.\nx⁵를 3개 제약으로 표현: x²=t1, t1²=t2, t2·x=y.',
    code: `/// S-box 가젯: y = x⁵
/// 3개의 보조 변수와 3개의 제약:
///   t1 = x * x      (x²)
///   t2 = t1 * t1     (x⁴)
///   y  = t2 * x      (x⁵)
fn sbox_circuit(
    cs: &mut ConstraintSystem, x: Variable, x_val: Fr,
) -> (Variable, Fr) {
    let x2_val = x_val.square();
    let x4_val = x2_val.square();
    let x5_val = x4_val * x_val;

    let t1 = cs.alloc_witness(x2_val);
    let t2 = cs.alloc_witness(x4_val);
    let y = cs.alloc_witness(x5_val);

    // x * x = t1
    cs.enforce(
        LinearCombination::from(x),
        LinearCombination::from(x),
        LinearCombination::from(t1),
    );
    // t1 * t1 = t2
    cs.enforce(LC::from(t1), LC::from(t1), LC::from(t2));
    // t2 * x = y
    cs.enforce(LC::from(t2), LC::from(x), LC::from(y));

    (y, x5_val)
}`,
    annotations: [
      { lines: [1, 5], color: 'sky', note: 'x⁵를 중간 변수로 분해 — R1CS는 A·B=C 형태만 허용' },
      { lines: [13, 15], color: 'emerald', note: '보조 변수(witness) 할당 — 검증자가 모르는 중간 값' },
      { lines: [17, 26], color: 'amber', note: '3개 제약 — S-box 하나당 곱셈 3회. full round는 9개, partial은 3개' },
    ],
  },
  'merkle-circuit': {
    path: 'circuits/merkle.rs — MerkleProofCircuit',
    lang: 'rust',
    highlight: [1, 38],
    desc: 'Merkle 증명을 R1CS 회로로 표현.\nboolean + mux + Poseidon 가젯을 조합.',
    code: `/// Merkle proof 검증 회로
pub struct MerkleProofCircuit {
    pub root: Fr,          // 공개 입력
    pub key: Fr,           // 비공개 입력
    pub value: Fr,         // 비공개 입력
    pub siblings: Vec<Fr>, // 비공개 입력
    pub depth: usize,
    pub params: PoseidonParams,
}

impl Circuit for MerkleProofCircuit {
    fn synthesize(&self, cs: &mut ConstraintSystem) {
        let root_var = cs.alloc_instance(self.root);

        let (mut cur_var, mut cur_val) = poseidon_hash_circuit(
            cs, self.key, self.value, &self.params,
        );

        for level in 0..self.depth {
            let sib_var = cs.alloc_witness(self.siblings[level]);
            let bit_val = if get_bit(&key_repr, level) { Fr::ONE } else { Fr::ZERO };
            let bit_var = cs.alloc_witness(bit_val);

            enforce_boolean(cs, bit_var);
            let (_, left_val) = mux_circuit(cs, ...);
            let (_, right_val) = mux_circuit(cs, ...);

            (cur_var, cur_val) = poseidon_hash_circuit(
                cs, left_val, right_val, &self.params,
            );
        }

        cs.enforce(LC::from(cur_var), LC::from(Variable::One), LC::from(root_var));
    }
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'root만 공개(instance), 나머지는 비공개(witness) — ZK의 핵심' },
      { lines: [15, 17], color: 'emerald', note: 'Poseidon 회로 재사용 — 리프 해시를 회로 내에서 재계산' },
      { lines: [24, 26], color: 'amber', note: 'boolean + mux — 비트에 따라 left/right 선택을 제약으로 강제' },
      { lines: [33, 33], color: 'violet', note: '최종 등치 제약 — 재계산한 루트 == 공개 입력 루트' },
    ],
  },
};
