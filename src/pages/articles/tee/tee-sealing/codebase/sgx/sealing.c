/* ── SGX Seal Key Derivation (EGETKEY) ── */
// sealed_data_t: 봉인된 데이터 최종 구조체
typedef struct _sealed_data_t {
    sgx_key_request_t   key_request;      // 키 파생 파라미터 (512B)
    uint32_t            plain_text_offset; // AAD 오프셋
    uint8_t             reserved[12];
    sgx_aes_gcm_data_t  aes_data;         // 암호문 + MAC + IV
} sgx_sealed_data_t;

/* ── Key Derivation Tree (CPU 내부) ──
 *  Root Seal Key (칩 제조 시 퓨즈에 주입, 소프트웨어 추출 불가)
 *      ├─ MRENCLAVE 경로: KDF(Root, MRENCLAVE‖CPUSVN‖ISVSVN‖KEYID)
 *      │   → Seal Key A  (동일 바이너리 해시에서만 파생)
 *      └─ MRSIGNER 경로:  KDF(Root, MRSIGNER‖PRODID‖ISVSVN‖CPUSVN‖KEYID)
 *          → Seal Key B  (동일 서명자 + ISV_SVN 이상이면 파생)
 *  KDF = AES-CMAC(Root, label‖context‖policy_fields)
 */

// EGETKEY: CPU 마이크로코드가 Seal Key 파생
sgx_status_t sgx_get_seal_key(
    const sgx_key_request_t *request,  // key_name=SEAL, policy 포함
    sgx_key_128bit_t        *seal_key  // 출력: 128-bit Seal Key
) {
    // 1. key_request 유효성 검증
    if (request->key_name != SGX_KEYSELECT_SEAL)
        return SGX_ERROR_INVALID_PARAMETER;
    // 2. EGETKEY 하드웨어 명령어 — Root + policy fields → CMAC → 128-bit key
    int status = __builtin_ia32_egetkey(request, seal_key);
    if (status != 0) return SGX_ERROR_UNEXPECTED;
    return SGX_SUCCESS;  // seal_key에 128-bit 키 저장됨
}

/* ── sgx_seal_data_ex: 봉인 (Encrypt) ── */
sgx_status_t sgx_seal_data_ex(
    uint16_t            key_policy,   // MRENCLAVE(0x01) or MRSIGNER(0x02)
    const uint8_t      *aad,          // 추가 인증 데이터 (평문 유지)
    uint32_t            aad_len,
    const uint8_t      *plaintext,    // 봉인할 비밀 데이터
    uint32_t            text_len,
    sgx_sealed_data_t  *sealed_blob   // 출력: 봉인된 구조체
) {
    sgx_key_128bit_t seal_key;
    sgx_key_request_t req = build_key_request(key_policy);
    // Step 1: EGETKEY로 Seal Key 파생
    sgx_status_t ret = sgx_get_seal_key(&req, &seal_key);
    if (ret != SGX_SUCCESS) return ret;
    // Step 2: 12-byte IV 생성 (하드웨어 난수)
    uint8_t iv[SGX_SEAL_IV_SIZE];
    sgx_read_rand(iv, SGX_SEAL_IV_SIZE);
    // Step 3: AES-128-GCM 암호화
    ret = sgx_rijndael128GCM_encrypt(
        &seal_key, plaintext, text_len,
        sealed_blob->aes_data.payload,   // 암호문 출력
        iv, SGX_SEAL_IV_SIZE,
        aad, aad_len,
        &sealed_blob->aes_data.payload_tag // 128-bit MAC 출력
    );
    // Step 4: key_request 저장 (복호화 시 동일 키 재파생용)
    sealed_blob->key_request = req;
    memset_s(&seal_key, sizeof(seal_key), 0, sizeof(seal_key));
    return ret;
}

/* ── sgx_unseal_data: 개봉 (Decrypt) ── */
sgx_status_t sgx_unseal_data(
    const sgx_sealed_data_t *sealed_blob,  // 봉인된 데이터
    uint8_t                 *plaintext,     // 출력: 복호화된 비밀
    uint32_t                *text_len
) {
    sgx_key_128bit_t seal_key;
    // Step 1: 저장된 key_request로 동일 Seal Key 재파생
    sgx_status_t ret = sgx_get_seal_key(
        &sealed_blob->key_request, &seal_key);
    if (ret != SGX_SUCCESS) return ret;
    // Step 2: AES-128-GCM 복호화 + MAC 검증
    ret = sgx_rijndael128GCM_decrypt(
        &seal_key,
        sealed_blob->aes_data.payload, *text_len,
        plaintext,                      // 평문 출력
        sealed_blob->aes_data.iv, SGX_SEAL_IV_SIZE,
        NULL, 0,
        &sealed_blob->aes_data.payload_tag  // MAC 검증
    );
    // MAC 불일치 → SGX_ERROR_MAC_MISMATCH (변조 또는 다른 enclave)
    memset_s(&seal_key, sizeof(seal_key), 0, sizeof(seal_key));
    return ret;
}
