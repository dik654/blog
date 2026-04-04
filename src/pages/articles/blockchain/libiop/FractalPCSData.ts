export const FRACTAL_CODE = `// Fractal: 홀로그래픽 IOP (전처리 지원)
// 홀로그래픽 IOP = (인덱서, 증명자, 검증자)

// 인덱서: R1CS 행렬을 row/col/val 다항식으로 분해
matrix_indexer<FieldT> A_indexer, B_indexer, C_indexer;

// 각 행렬을 3개 다항식으로 변환
polynomial<FieldT> row_poly;  // 행 인덱스 인코딩
polynomial<FieldT> col_poly;  // 열 인덱스 인코딩
polynomial<FieldT> val_poly;  // 행렬 값 인코딩

// 오라클 핸들 등록
oracle_handle row_oracle_handle_;
oracle_handle col_oracle_handle_;
oracle_handle val_oracle_handle_;`;

export const VERIFY_CODE = `// Fractal 검증자 시간: O(log N)
// 전처리 없는 시스템: O(N) 검증
// 홀로그래픽 시스템: O(log N) 검증

// 전처리 단계 (1회만 수행)
fractal_iop_parameters<FieldT> params(
  security_parameter,    // 보안 매개변수
  pow_bits,              // PoW 비트 수
  RS_extra_dimensions,   // RS 확장 차원
  make_zk,               // 영지식 활성화
  constraint_system      // R1CS 제약 시스템
);

// 인덱스 재사용: 동일 회로의 여러 증명에 활용
// 메모리 효율: 검증자 O(log N) 저장공간
// 재귀적 증명 합성(IVC) 지원`;
