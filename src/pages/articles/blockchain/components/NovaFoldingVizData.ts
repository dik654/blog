export const MAX_STEPS = 4;

export const phases = [
  { label: '초기 상태', color: 'bg-muted', desc: 'z₀: 초기값, U_acc = ⊥' },
  { label: 'Step 1', color: 'bg-blue-500', desc: 'F(z₀)=z₁, NIFS → U_acc₁ (E₁, u₁)' },
  { label: 'Step 2', color: 'bg-indigo-500', desc: 'F(z₁)=z₂, NIFS → U_acc₂ (E₂, u₂)' },
  { label: 'Step 3', color: 'bg-violet-500', desc: 'F(z₂)=z₃, NIFS → U_acc₃ (E₃, u₃)' },
  { label: '압축', color: 'bg-emerald-500', desc: 'Spartan SNARK → 수 KB 증명' },
];

export const NIFS_FORMULAS = [
  { text: 'T = A·W_acc ∘ B·W_new - u·C·W (교차항)', primary: false },
  { text: 'comm_T = Commit(T, r_blind)', primary: false },
  { text: 'r = RO(pp‖U_new‖comm_T)  ← Fiat-Shamir', primary: true },
  { text: "U_acc' = U_acc + r·U_new  (인스턴스 선형 결합)", primary: false },
  { text: "W_acc' = W_acc + r·W_new  (증인 선형 결합)", primary: false },
  { text: "E'      = E + r·T          (에러 업데이트)", primary: false },
];

export const SPARTAN_FORMULAS = [
  { text: 'RelaxedR1CS 만족 증명 → Spartan', emerald: true },
  { text: '증명 크기: ~수 KB (재귀 깊이 무관)', emerald: false },
  { text: '검증 시간: O(n) → 단일 그룹 지수 연산만 필요', emerald: false },
];
