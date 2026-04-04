export const SELECTORS_CODE = `선택자 벡터 (Selector Vectors):
  q_m  — 곱셈 항 계수
  q_l  — left wire 계수
  q_r  — right wire 계수
  q_o  — output wire 계수
  q_4  — 4번째 wire 계수 (확장)
  q_c  — 상수 항

와이어 벡터 (Wire Vectors):
  w_l  — left input wire
  w_r  — right input wire
  w_o  — output wire
  w_4  — 4번째 wire (TurboComposer)`;

export const VAR_MGMT_CODE = `변수 관리:
  zero_var  = append_output_public(F::zero)
  alloc()   → Variable(index)  // private witness
  add_input() → Variable       // public input

게이트 추가:
  poly_gate(a, b, c, d, selectors)
  → w_l.push(a), w_r.push(b), w_o.push(c), w_4.push(d)
  → q_m.push(s.q_m), q_l.push(s.q_l), ...
  → perm.add_variables_to_map(a, b, c, d, n)`;

export const BUILD_FLOW_CODE = `① Variable 생성
  let x = composer.alloc(value_x);
  let y = composer.alloc(value_y);

② 게이트 추가 (와이어 + 선택자 동시 설정)
  composer.arithmetic_gate(|g| {
    g.witness(x, y, None)
     .add(F::one, F::one)       // q_l=1, q_r=1
     .out(-F::one)              // q_o=-1
  });

③ Permutation map 갱신
  perm.add_variables_to_map(x, y, out, dummy, gate_idx)`;
