export const LIGERO_CODE = `// Ligero: 2라운드 공개 코인 프로토콜
// 증인 w를 m x n 행렬 W로 재배열 (m ~ sqrt(N))

template<typename FieldT>
class direct_LDT_protocol {
  // 증명자가 다항식 계수를 직접 전송
  std::vector<prover_message_handle>
    prover_coefficients_handles_;
  // 검증자가 무작위 위치에서 쿼리
  std::vector<random_query_position_handle>
    query_position_handles_;
};

// 증명 크기: O(sqrt(N))
// 증명 시간: O(N log N)
// 검증 시간: O(sqrt(N))`;

export const AURORA_CODE = `// Aurora: FRI 기반 다중 라운드 IOP
// 재귀적 폴딩으로 O(log^2 N) 인수 크기 달성

template<typename FieldT>
class FRI_protocol : public multi_LDT_base<FieldT> {
  std::vector<field_subset<FieldT>> domains_;
  std::vector<localizer_polynomial<FieldT>>
    localizer_polynomials_;
  std::vector<oracle_handle_ptr> oracle_handles_;
};

// FRI 폴딩: f(x) = f_even(x^2) + x * f_odd(x^2)
// 차수 d -> d/2 -> d/4 -> ... -> 상수
// 라운드 수: O(log N), 인수 크기: O(log^2 N)`;
