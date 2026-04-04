import type { CodeRef } from './codeRefsTypes';

export const attestationRefs2: Record<string, CodeRef> = {
  'ecall-table': {
    path: 'linux-sgx/sdk/trts/trts_internal_types.h — ecall_table_t',
    lang: 'c',
    highlight: [1, 12],
    desc: 'ECALL 테이블 구조체.\nEdger8r가 EDL 파일에서 자동 생성하며, 각 ECALL 함수의 주소와 권한 비트를 저장합니다.\nis_priv=1이면 루트 ECALL에서 호출 불가 (내부 전용).',
    code: `// sdk/trts/trts_internal_types.h (L35-51)
typedef struct {
    const void     *ecall_addr;     // ECALL 함수 포인터
    uint8_t        is_priv;         // 1이면 내부 전용 (루트 ECALL 금지)
    uint8_t        is_switchless;   // switchless ECALL 여부
} ecall_addr_t;

typedef struct {
    size_t          nr_ecall;       // 등록된 ECALL 함수 수
    ecall_addr_t    ecall_table[1]; // 가변 길이 ECALL 엔트리 배열
} ecall_table_t;

typedef struct {
    size_t  nr_ocall;               // 등록된 OCALL 함수 수
    uint8_t entry_table[1];         // 동적 진입 허용 매트릭스
} entry_table_t;`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'ecall_addr_t: 함수 주소 + 권한 플래그' },
      { lines: [8, 10], color: 'emerald', note: 'ecall_table_t: EDL에서 자동 생성된 ECALL 목록' },
      { lines: [13, 15], color: 'amber', note: 'entry_table_t: OCALL→ECALL 중첩 허용 매트릭스' },
    ],
  },
};
