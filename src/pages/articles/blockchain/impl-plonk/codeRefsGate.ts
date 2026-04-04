import type { CodeRef } from '@/components/code/types';

export const gateCodeRefs: Record<string, CodeRef> = {
  'plonk-gate': {
    path: 'plonk/arithmetization.rs — PlonkGate',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'PLONKish 게이트 구조체.\n5개 selector 계수로 게이트 유형(Add, Mul, Bool 등) 결정.',
    code: `/// PLONKish 게이트: q_L·a + q_R·b + q_O·c + q_M·a·b + q_C = 0
pub struct PlonkGate {
    pub q_l: Fr,  // left wire selector
    pub q_r: Fr,  // right wire selector
    pub q_o: Fr,  // output wire selector
    pub q_m: Fr,  // multiplication selector
    pub q_c: Fr,  // constant selector
}

impl PlonkGate {
    /// 덧셈 게이트: a + b = c
    /// 1·a + 1·b + (-1)·c + 0·a·b + 0 = 0
    pub fn addition_gate() -> Self {
        PlonkGate { q_l: Fr::ONE, q_r: Fr::ONE,
            q_o: -Fr::ONE, q_m: Fr::ZERO, q_c: Fr::ZERO }
    }

    /// 곱셈 게이트: a · b = c
    /// 0·a + 0·b + (-1)·c + 1·a·b + 0 = 0
    pub fn multiplication_gate() -> Self {
        PlonkGate { q_l: Fr::ZERO, q_r: Fr::ZERO,
            q_o: -Fr::ONE, q_m: Fr::ONE, q_c: Fr::ZERO }
    }

    /// 불린 게이트: a·(1-a) = 0  → q_L=1, q_M=-1
    pub fn boolean_gate() -> Self {
        PlonkGate { q_l: Fr::ONE, q_r: Fr::ZERO,
            q_o: Fr::ZERO, q_m: -Fr::ONE, q_c: Fr::ZERO }
    }
}`,
    annotations: [
      { lines: [2, 8], color: 'sky', note: '5개 selector — 계수 조합으로 다양한 게이트 표현' },
      { lines: [12, 16], color: 'emerald', note: 'Add: q_L=q_R=1, q_O=-1 → a+b-c=0' },
      { lines: [20, 23], color: 'amber', note: 'Mul: q_M=1, q_O=-1 → a·b-c=0' },
      { lines: [26, 29], color: 'violet', note: 'Bool: q_L=1, q_M=-1 → a-a²=0, a∈{0,1}' },
    ],
  },
  'plonk-cs': {
    path: 'plonk/arithmetization.rs — PlonkConstraintSystem',
    lang: 'rust',
    highlight: [1, 32],
    desc: '제약 시스템 전체 구조.\n변수 할당 → 게이트 추가 → copy constraint → 패딩 순서.',
    code: `pub struct PlonkConstraintSystem {
    pub values: Vec<Fr>,            // 변수 풀
    gates: Vec<GateInstance>,       // 게이트 인스턴스 목록
    copy_constraints: Vec<(WirePosition, WirePosition)>,
    pub num_public_inputs: usize,
    pub(crate) lookup_tables: Vec<Vec<Fr>>,
    pub(crate) lookup_entries: Vec<(usize, Column, usize)>,
}

impl PlonkConstraintSystem {
    /// 변수 할당 → 인덱스 반환
    pub fn alloc_variable(&mut self, value: Fr) -> WireIndex {
        let idx = self.values.len();
        self.values.push(value);
        idx
    }

    /// 게이트 추가: selector + wire 인덱스 3개
    pub fn add_gate(&mut self, gate: PlonkGate,
        a: WireIndex, b: WireIndex, c: WireIndex) {
        self.gates.push(GateInstance { gate, a, b, c });
    }

    /// Copy constraint: wire_i와 wire_j 값 동일 강제
    pub fn copy_constraint(&mut self,
        wire_i: WirePosition, wire_j: WirePosition) {
        self.copy_constraints.push((wire_i, wire_j));
    }

    /// 2의 거듭제곱으로 패딩 — 더미 게이트(0=0) 추가
    pub fn pad_to_power_of_two(&mut self) -> usize { ... }
}`,
    annotations: [
      { lines: [1, 8], color: 'sky', note: 'CS 핵심 필드 — 변수 풀, 게이트, copy, lookup' },
      { lines: [12, 16], color: 'emerald', note: 'alloc: Vec에 push → 인덱스가 변수 ID' },
      { lines: [19, 22], color: 'amber', note: 'add_gate: selector + 3 wire 인덱스를 묶어 GateInstance' },
      { lines: [25, 28], color: 'violet', note: 'copy_constraint: (column, row) 쌍으로 변수 공유 선언' },
    ],
  },
};
