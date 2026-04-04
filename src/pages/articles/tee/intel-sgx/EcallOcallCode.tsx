export const edlCode = `// SampleCode/SampleEnclave/Enclave/Enclave.edl (실제 파일)
enclave {
    trusted {
        // ECALL: 외부에서 엔클레이브로 진입
        // [in]: 호스트 → 엔클레이브 방향 복사
        // [out]: 엔클레이브 → 호스트 방향 복사
        public sgx_status_t ecall_encrypt(
            [in, size=len]  uint8_t* plaintext, size_t len,
            [out, size=len] uint8_t* ciphertext
        );
    };

    untrusted {
        // OCALL: 엔클레이브에서 호스트 함수 호출
        void ocall_print_string([in, string] const char* str);
        sgx_status_t ocall_get_time([out] time_t* t);
    };
};`;

export const ecallCode = `// sdk/trts/trts_ecall.cpp - 실제 ECALL 진입점

// 1. 권한 검사: 동적 진입 테이블로 ECALL 허용 여부 확인
static sgx_status_t is_ecall_allowed(uint32_t ordinal) {
    if (ordinal >= g_ecall_table.nr_ecall)
        return SGX_ERROR_INVALID_FUNCTION;

    thread_data_t *thread_data = get_thread_data();
    sgx_lfence(); // 스펙터 완화: 측면 채널 방어

    if (thread_data->last_sp == thread_data->stack_base_addr) {
        // 루트 ECALL: priv 비트만 확인
        if (g_ecall_table.ecall_table[ordinal].is_priv)
            return SGX_ERROR_ECALL_NOT_ALLOWED;
        return SGX_SUCCESS;
    }
    // 중첩 ECALL: 동적 진입 테이블에서 허용 확인
    // [ocall_index * nr_ecall + ordinal] → true/false
    return g_dyn_entry_table.entry_table[...] ? SGX_SUCCESS
                                              : SGX_ERROR_ECALL_NOT_ALLOWED;
}

// 2. 함수 주소 취득 후 실행
static sgx_status_t trts_ecall(uint32_t ordinal, void *ms) {
    if (unlikely(g_is_first_ecall)) {
        // 최초 ECALL: EDMM 페이지 보호 설정 + 전역 객체 생성자 실행
        change_protection(get_enclave_base());
        init_global_object();
        g_is_first_ecall = false;
    }
    void *addr = NULL;
    get_func_addr(ordinal, &addr);
    // 스택 무작위화 후 실제 함수 호출 (스펙터 완화)
    return random_stack_advance<0x800>((ecall_func_t)addr, ms);
}

// 3. 루트 ECALL: 랜덤 스택 오프셋으로 ROP/JIT 방어
sgx_status_t do_ecall(int index, void *ms, void *tcs) {
    // TCS가 처음이면 thread_data 초기화
    if (thread_data->stack_base_addr == thread_data->last_sp) {
        do_init_thread(tcs, false);
        sgx_wrpkru(0);                        // PKRU 초기화
        status = random_stack_advance<0x800>(trts_ecall, index, ms);
    } else {
        status = trts_ecall(index, ms);       // 중첩 ECALL
    }
    return status;
}`;

export const ocallCode = `// sdk/trts/trts_ocall.cpp

// sgx_ocall: 엔클레이브 내부에서 호스트 함수 호출
sgx_status_t sgx_ocall(const unsigned int index, void *ms) {
    if (static_cast<size_t>(index) >= g_dyn_entry_table.nr_ocall)
        return SGX_ERROR_INVALID_FUNCTION;

    // __morestack → EEXIT → 호스트 ocall bridge 실행
    // 호스트에서 EENTER 로 재진입 → asm_oret으로 반환
    return do_ocall(index, ms);  // do_ocall = __morestack (어셈블리)
}

// OCALL 반환 시 스택 포인터 검증
sgx_status_t do_oret(void *ms) {
    ocall_context_t *context = (ocall_context_t*)thread_data->last_sp;
    if (context->ocall_flag != OCALL_FLAG) abort(); // 변조 감지
    if (context->pre_last_sp > stack_base_addr)     // 범위 검증
        return SGX_ERROR_UNEXPECTED;
    thread_data->last_sp = context->pre_last_sp;
    asm_oret(last_sp, ms);  // 스택 복원 후 ECALL 컨텍스트로 귀환
}

// OCALL 컨텍스트 구조 (ocall 깊이 추적)
typedef struct {
    uintptr_t  ocall_flag;    // OCALL_FLAG 매직 (변조 감지)
    uintptr_t  pre_last_sp;   // 이전 OCALL 스택 포인터
    uintptr_t  ocall_index;   // OCALL 함수 인덱스
    uint32_t   ocall_depth;   // 중첩 OCALL 깊이
} ocall_context_t;`;
