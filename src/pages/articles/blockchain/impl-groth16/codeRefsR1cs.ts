import type { CodeRef } from '@/components/code/types';

export const r1csCodeRefs: Record<string, CodeRef> = {
  'r1cs-types': {
    path: 'r1cs.rs — Variable, LinearCombination, ConstraintSystem',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'R1CS의 세 가지 핵심 타입.\nVariable: 변수 종류(One/Instance/Witness) — witness 벡터에서의 위치.\nLinearCombination: 덧셈은 선형결합으로 무료.\nConstraintSystem: 제약을 모아서 행렬로 추출.',
    code: `/// R1CS 변수 — witness 벡터에서의 위치
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Variable {
    One,            // s[0] = 1 (상수항 표현용)
    Instance(usize), // 공개 입력 — 검증자가 아는 값
    Witness(usize),  // 비공개 입력 — 증명자만 아는 값
}

/// 선형결합: Σ cᵢ · xᵢ
/// 덧셈은 항 추가로 "무료" — 새 제약 불필요
pub struct LinearCombination {
    pub terms: Vec<(Variable, Fr)>,
}

/// R1CS 제약 시스템
/// 제약: ⟨A, s⟩ · ⟨B, s⟩ = ⟨C, s⟩
pub struct ConstraintSystem {
    pub values: Vec<Fr>,      // [1, inst.., wit..]
    pub num_instance: usize,
    pub num_witness: usize,
    pub constraints: Vec<(
        LinearCombination,  // A
        LinearCombination,  // B
        LinearCombination,  // C
    )>,
}`,
    annotations: [
      { lines: [2, 7], color: 'sky', note: 'Variable — One(상수1), Instance(공개), Witness(비공개)' },
      { lines: [10, 13], color: 'emerald', note: '선형결합 — 덧셈은 항을 추가할 뿐, 새 제약 불필요' },
      { lines: [17, 28], color: 'amber', note: 'ConstraintSystem — values[0]=1, 이후 instance, witness 순' },
    ],
  },
  'r1cs-enforce': {
    path: 'r1cs.rs — enforce() + is_satisfied()',
    lang: 'rust',
    highlight: [1, 24],
    desc: 'enforce: A·B=C 제약 하나 추가.\nis_satisfied: 모든 제약을 직접 평가하여 검산.\nGroth16은 이 검산을 "값을 모르고도" 페어링으로 수행.',
    code: `/// 제약 추가: A · B = C
/// 곱셈 하나 = 제약 하나
/// 덧셈은 LinearCombination 안에서 무료
pub fn enforce(
    &mut self,
    a: LinearCombination,
    b: LinearCombination,
    c: LinearCombination,
) {
    self.constraints.push((a, b, c));
}

/// 모든 제약 만족 확인 — 디버깅/테스트용
/// 각 (A,B,C): eval(A) * eval(B) == eval(C)
pub fn is_satisfied(&self) -> bool {
    for (a, b, c) in &self.constraints {
        let a_val = a.evaluate(&self.values, self.num_instance);
        let b_val = b.evaluate(&self.values, self.num_instance);
        let c_val = c.evaluate(&self.values, self.num_instance);
        if a_val * b_val != c_val {
            return false;
        }
    }
    true
}`,
    annotations: [
      { lines: [4, 11], color: 'sky', note: 'enforce — 곱셈 하나를 (A, B, C) 선형결합 트리플로 추가' },
      { lines: [15, 25], color: 'emerald', note: 'is_satisfied — 직접 대입 검산. Groth16은 이걸 pairing으로 대체' },
    ],
  },
};
