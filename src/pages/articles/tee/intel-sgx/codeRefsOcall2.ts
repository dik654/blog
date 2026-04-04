import type { CodeRef } from './codeRefsTypes';

export const ocallRefs2: Record<string, CodeRef> = {
  'ocall-context': {
    path: 'linux-sgx/common/inc/internal/rts.h — ocall_context_t',
    lang: 'c',
    highlight: [1, 20],
    desc: 'OCALL 컨텍스트 구조체.\nocall_flag=0x4F434944("OCID"), 레지스터 r12-r15/rbp/rdi/rsi/rbx 보존.',
    code: `// common/inc/internal/rts.h (L40-60)
#define OCALL_FLAG 0x4F434944  // "OCID"

typedef struct _ocall_context_t
{
    uintptr_t shadow0;       // x64 shadow space
    uintptr_t shadow1;
    uintptr_t shadow2;
    uintptr_t shadow3;
    uintptr_t ocall_flag;    // 변조 감지 매직
    uintptr_t ocall_index;   // OCALL 함수 인덱스
    uintptr_t pre_last_sp;   // 이전 스택 포인터
    uintptr_t r15;           // callee-saved
    uintptr_t r14;
    uintptr_t r13;
    uintptr_t r12;
    uintptr_t xbp;
    uintptr_t xdi;
    uintptr_t xsi;
    uintptr_t xbx;
    uintptr_t reserved[3];
    uintptr_t ocall_depth;   // 중첩 깊이
    uintptr_t ocall_ret;     // 반환값
} ocall_context_t;`,
    annotations: [
      { lines: [1, 1], color: 'rose', note: 'OCALL_FLAG: "OCID" 매직 넘버' },
      { lines: [5, 8], color: 'sky', note: 'x64 ABI shadow space (4 x 8B)' },
      { lines: [9, 11], color: 'emerald', note: 'OCALL 메타데이터' },
      { lines: [12, 23], color: 'amber', note: 'callee-saved + depth' },
    ],
  },
};
