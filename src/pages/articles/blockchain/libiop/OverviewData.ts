export const IOP_ARCH_CODE = `// libiop 전체 구조
protocols/
  encoded_aurora_protocol.hpp   // Aurora (FRI 기반 IOP)
  encoded_ligero_protocol.hpp   // Ligero (직접 LDT)
  fractal_protocol.hpp          // Fractal (홀로그래픽 IOP)
  ldt/
    fri/fri_ldt.hpp             // FRI 저차 테스트
    direct_ldt.hpp              // 직접 저차 테스트
relations/
  r1cs.hpp                      // R1CS 제약 시스템 정의
  sparse_matrix.hpp             // 희소 행렬 표현
bcs/
  bcs_common.hpp                // BCS 변환 공통 로직
  hashing/blake2b.hpp           // Blake2b 해시`;

export const PCP_IOP_CODE = `// PCP vs IOP 비교
// PCP: 정적 증명 1회 제출 → 검증자가 무작위 위치 쿼리
NP = PCP[O(log n), O(1)]
증명 크기: 지수적 → 실용적이지 않음

// IOP: 다중 라운드 동적 상호작용
라운드 1: 증명자 → 오라클 pi_1 → 검증자 (쿼리 q_1)
라운드 2: 증명자 → 오라클 pi_2 → 검증자 (쿼리 q_2)
...
라운드 k: 증명자 → 오라클 pi_k → 검증자 (최종 판정)

// IOP 장점: 증명 크기 감소, 쿼리 복잡도 개선, 모듈화 설계`;
