import type { CodeRef } from './codeRefsTypes';

export const ocallRefs: Record<string, CodeRef> = {
  'sgx-ocall': {
    path: 'linux-sgx/sdk/trts/trts_ocall.cpp — sgx_ocall()',
    lang: 'c',
    highlight: [1, 12],
    desc: '엔클레이브에서 호스트 함수를 호출하는 OCALL 진입점.\nindex 검증 후 __morestack로 EEXIT → 호스트 → EENTER 복귀합니다.',
    code: `// sdk/trts/trts_ocall.cpp (L55-69)
sgx_status_t sgx_ocall(const unsigned int index,
                        void *ms)
{
    // OCALL 인덱스 범위 검증
    if((index != 0) && !is_builtin_ocall((int)index) &&
       static_cast<size_t>(index) >=
           g_dyn_entry_table.nr_ocall)
    {
        return SGX_ERROR_INVALID_FUNCTION;
    }

    // do_ocall = __morestack (어셈블리)
    // EEXIT → 호스트 bridge → EENTER → asm_oret
    sgx_status_t status = do_ocall(index, ms);
    return status;
}`,
    annotations: [
      { lines: [5, 11], color: 'sky', note: 'OCALL 인덱스 범위 검증' },
      { lines: [13, 15], color: 'emerald', note: 'EEXIT → 호스트 → EENTER 왕복' },
    ],
  },

  'do-oret': {
    path: 'linux-sgx/sdk/trts/trts_ocall.cpp — do_oret()',
    lang: 'c',
    highlight: [1, 12],
    desc: 'OCALL 반환 시 스택 포인터 검증.\nOCALL_FLAG(0x4F434944)로 변조를 감지하고 pre_last_sp 범위를 검증합니다.',
    code: `// sdk/trts/trts_ocall.cpp (L98-137)
sgx_status_t do_oret(void *ms)
{
    thread_data_t *thread_data = get_thread_data();
    uintptr_t last_sp = thread_data->last_sp;
    ocall_context_t *context =
        reinterpret_cast<ocall_context_t*>(last_sp);

    if(0 == last_sp || last_sp <= (uintptr_t)&context)
        return SGX_ERROR_UNEXPECTED;

    // 최소 1 ecall + 1 ocall 프레임 공간 확인
    if(last_sp > thread_data->stack_base_addr
                 - 30 * sizeof(size_t))
        return SGX_ERROR_UNEXPECTED;

    // OCALL_FLAG 매직 넘버 검증
    if(context->ocall_flag != OCALL_FLAG)
        return SGX_ERROR_UNEXPECTED;

    // pre_last_sp 범위 검증
    if(context->pre_last_sp > thread_data->stack_base_addr
       || context->pre_last_sp <= (uintptr_t)context)
        return SGX_ERROR_UNEXPECTED;

    thread_data->last_sp = context->pre_last_sp;
    asm_oret(last_sp, ms); // 스택 복원 후 귀환

    return SGX_ERROR_UNEXPECTED; // 도달 불가
}`,
    annotations: [
      { lines: [8, 9], color: 'sky', note: 'last_sp 기본 유효성 검증' },
      { lines: [12, 14], color: 'emerald', note: '스택 범위: 최소 프레임 공간' },
      { lines: [17, 18], color: 'rose', note: 'OCALL_FLAG 매직 넘버 변조 감지' },
      { lines: [21, 23], color: 'amber', note: 'pre_last_sp 범위 무결성 검증' },
    ],
  },
};
