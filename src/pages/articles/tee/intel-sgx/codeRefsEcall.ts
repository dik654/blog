import type { CodeRef } from './codeRefsTypes';

export const ecallRefs: Record<string, CodeRef> = {
  'is-ecall-allowed': {
    path: 'linux-sgx/sdk/trts/trts_ecall.cpp — is_ecall_allowed()',
    lang: 'c',
    highlight: [1, 10],
    desc: 'ECALL 권한 검사. 루트 ECALL은 priv 비트, 중첩 ECALL은 동적 진입 테이블 매트릭스를 조회.',
    code: `// sdk/trts/trts_ecall.cpp (L77-106)
static sgx_status_t is_ecall_allowed(uint32_t ordinal) {
    if(ordinal >= g_ecall_table.nr_ecall)
        return SGX_ERROR_INVALID_FUNCTION;
    thread_data_t *thread_data = get_thread_data();
    sgx_lfence(); // 스펙터 v1 완화
    if(thread_data->last_sp == thread_data->stack_base_addr) {
        // 루트 ECALL: is_priv 비트만 확인
        if (g_ecall_table.ecall_table[ordinal].is_priv)
            return SGX_ERROR_ECALL_NOT_ALLOWED;
        return SGX_SUCCESS;
    }
    // 중첩 ECALL: OCALL 컨텍스트에서 ocall_index 추출
    ocall_context_t *context =
        reinterpret_cast<ocall_context_t*>(thread_data->last_sp);
    if(context->ocall_flag != OCALL_FLAG)
        abort(); // 변조 시 즉시 중단
    uintptr_t ocall_index = context->ocall_index;
    return (g_dyn_entry_table.entry_table[
        ocall_index * g_ecall_table.nr_ecall + ordinal]
        ? SGX_SUCCESS : SGX_ERROR_ECALL_NOT_ALLOWED);
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'ordinal 범위 검증' },
      { lines: [6, 6], color: 'rose', note: 'sgx_lfence(): 스펙터 v1 완화' },
      { lines: [7, 12], color: 'emerald', note: '루트 ECALL: priv 비트 확인' },
      { lines: [14, 21], color: 'amber', note: '중첩 ECALL: 동적 진입 테이블 조회' },
    ],
  },
  'trts-ecall': {
    path: 'linux-sgx/sdk/trts/trts_ecall.cpp — trts_ecall()',
    lang: 'c',
    highlight: [1, 8],
    desc: 'ECALL 실행 함수. 최초 ECALL 시 EDMM 보호 + 전역 생성자 실행.',
    code: `// sdk/trts/trts_ecall.cpp (L260-317)
typedef sgx_status_t (*ecall_func_t)(void *ms);
static sgx_status_t trts_ecall(uint32_t ordinal, void *ms) {
    sgx_status_t status = SGX_ERROR_UNEXPECTED;
    if (unlikely(g_is_first_ecall)) {
        thread_data_t *td = get_thread_data();
        if (td->last_sp != td->stack_base_addr)
            return SGX_ERROR_ECALL_NOT_ALLOWED;
        sgx_spin_lock(&g_ife_lock);
        if (g_is_first_ecall) {
            if(EDMM_supported)
                change_protection(get_enclave_base());
            init_global_object();
            g_is_first_ecall = false;
        }
        sgx_spin_unlock(&g_ife_lock);
    }
    void *addr = NULL;
    status = get_func_addr(ordinal, &addr);
    if(status == SGX_SUCCESS) {
        sgx_lfence();
        status = ((ecall_func_t)addr)(ms);
    }
    return status;
}`,
    annotations: [
      { lines: [5, 8], color: 'sky', note: '최초 ECALL: 중첩 방지' },
      { lines: [9, 16], color: 'emerald', note: 'EDMM 권한 + 전역 생성자 1회' },
      { lines: [18, 23], color: 'amber', note: 'sgx_lfence 후 함수 호출' },
    ],
  },
  'do-ecall': {
    path: 'linux-sgx/sdk/trts/trts_ecall.cpp — do_ecall()',
    lang: 'c',
    highlight: [1, 8],
    desc: 'ECALL 최상위 진입. random_stack_advance<0x800>()으로 ROP 방어.',
    code: `// sdk/trts/trts_ecall.cpp (L391-484)
sgx_status_t do_ecall(int index, void *ms, void *tcs) {
    if(ENCLAVE_INIT_DONE != get_enclave_state())
        return SGX_ERROR_UNEXPECTED;
    thread_data_t *td = get_thread_data();
    if(td->stack_base_addr == td->last_sp) {
        do_init_thread(tcs, false);
        td = get_thread_data();
        sgx_wrpkru(0); // PKU 초기화
        return random_stack_advance<0x800>(
            trts_ecall, index, ms);
    }
    return trts_ecall(index, ms); // 중첩 ECALL
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: '초기화 완료 확인' },
      { lines: [6, 9], color: 'emerald', note: 'TCS 초기화 + PKRU 클리어' },
      { lines: [10, 11], color: 'violet', note: '랜덤 스택 오프셋 (0~2048B)' },
      { lines: [13, 13], color: 'amber', note: '중첩: 직접 호출' },
    ],
  },
};
