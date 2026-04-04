export const R1CS_CODE = `// R1CS 제약 시스템: A*z o B*z = C*z
// z = (1, x, w) — 공개 입력 x, 비밀 증인 w

template<typename FieldT>
struct r1cs_constraint_system {
  size_t primary_input_size;   // 공개 입력 크기
  size_t auxiliary_input_size; // 비밀 증인 크기
  std::vector<r1cs_constraint<FieldT>> constraints;

  bool is_satisfied(
    const r1cs_primary_input<FieldT>& primary,
    const r1cs_auxiliary_input<FieldT>& auxiliary
  ) const;
};`;

export const POLYNOMIAL_CODE = `// R1CS -> 다항식 IOP 변환 과정
// 1. 변수 할당을 다항식으로 인코딩
//    z(x) = Sigma z_i * L_i(x)  (라그랑주 보간)

// 2. 제약 조건을 다항식 등식으로 변환
//    A(x)*Z(x) o B(x)*Z(x) = C(x)*Z(x)
//    vanishing polynomial H에 의해:
//    (Az o Bz - Cz) = H(x) * t(x)

// 3. Reed-Solomon 인코딩 적용
//    평가 도메인 L 위에서 다항식 값 계산
//    |L| > deg(t) → 오류 정정 능력 확보

// 4. 오라클로 커밋 (머클 트리)
//    각 라운드에서 다항식 오라클 제출`;
