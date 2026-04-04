export const egetkeyCode = `// sdk/selib/sgx_get_key.cpp — EGETKEY 명령어 래퍼

sgx_status_t sgx_get_key(const sgx_key_request_t *key_request,
                          sgx_key_128bit_t *key) {
    // 1. key_request는 반드시 엔클레이브 내부 메모리여야 함
    if (!sgx_is_within_enclave(key_request, sizeof(*key_request)))
        return SGX_ERROR_INVALID_PARAMETER;

    // 2. key_policy 검증: KSS 미지원 시 KSS 관련 비트 금지
    //    SGX_KEYPOLICY_MRENCLAVE | SGX_KEYPOLICY_MRSIGNER | NOISVPRODID
    const sgx_report_t *report = sgx_self_report();
    if (!(report->body.attributes.flags & SGX_FLAGS_KSS) &&
        (key_request->key_policy & KEY_POLICY_KSS))
        return SGX_ERROR_INVALID_PARAMETER;

    // 3. 512-byte 정렬 버퍼 할당 후 EGETKEY 실행
    egetkey_status_t status = do_egetkey(tmp_key_request, tmp_key);
    // → CPU가 MRENCLAVE/MRSIGNER/CPUSVN/ISVSVN 등을 혼합해 128-bit 키 생성

    // 4. 성공 시 키 복사, 실패 시 랜덤 데이터로 덮어쓰기
    if (status != EGETKEY_SUCCESS)
        sgx_read_rand((uint8_t*)key, sizeof(*key)); // 키 누출 방지
    else
        memcpy_s(key, sizeof(*key), tmp_key, sizeof(*tmp_key));
}

// key_request 구조 (봉인 정책 설정)
typedef struct {
    uint16_t key_name;     // SGX_KEYSELECT_SEAL (봉인키)
    uint16_t key_policy;   // MRENCLAVE or MRSIGNER
    uint16_t isv_svn;      // ISV 보안 버전 (업그레이드 정책)
    uint16_t reserved1;
    uint8_t  cpu_svn[16];  // CPU 마이크로코드 버전
    uint8_t  attribute_mask[16];
    uint8_t  key_id[32];   // 키 다양화 (nonce)
    uint8_t  config_svn;   // KSS 확장용
    uint8_t  reserved2[434];
} sgx_key_request_t;`;

export const sealDataCode = `// sdk/tseal/tSeal_internal.cpp

sgx_status_t sgx_seal_data_iv(
    uint32_t  aad_len,   const uint8_t *aad,     // 인증만 (평문 저장)
    uint32_t  data_len,  const uint8_t *data,     // 암호화할 데이터
    const uint8_t *iv,                             // 12-byte IV (zero)
    const sgx_key_request_t *key_req,
    sgx_sealed_data_t *out)
{
    // 1. EGETKEY로 봉인 키 파생
    sgx_key_128bit_t seal_key;
    sgx_get_key(key_req, &seal_key);

    // 2. AES-256-GCM 암호화 (스택 무작위화 포함)
    random_stack_advance<0x200>(
        sgx_rijndael128GCM_encrypt,
        &seal_key, data, data_len,
        out->aes_data.payload,          // 암호문
        iv, SGX_SEAL_IV_SIZE,           // 12-byte zero IV
        aad, aad_len,
        &out->aes_data.payload_tag);    // 16-byte GCM 태그

    // 3. AAD 평문 복사 (무결성 보호는 되나 기밀성 없음)
    memcpy(&out->aes_data.payload[data_len], aad, aad_len);
    out->plain_text_offset     = data_len;
    out->aes_data.payload_size = aad_len + data_len;
}

// 봉인 데이터 구조
typedef struct {
    sgx_key_request_t  key_request;       // 키 파생에 필요한 파라미터
    uint32_t           plain_text_offset; // AAD 시작 위치
    uint8_t            reserved[12];
    struct {
        uint8_t  payload_tag[16];         // AES-GCM 인증 태그
        uint32_t payload_size;            // 암호문 + AAD 총 크기
        uint8_t  payload[];               // 암호문 | AAD (순서대로)
    } aes_data;
} sgx_sealed_data_t;`;

export const policyCode = `// MRENCLAVE 정책: 코드가 변경되면 복호화 불가
// → 소프트웨어 업그레이드 시 마이그레이션 필요
sgx_key_request_t req = {
    .key_name   = SGX_KEYSELECT_SEAL,
    .key_policy = SGX_KEYPOLICY_MRENCLAVE,
    .isv_svn    = 1,
};

// MRSIGNER 정책: 동일 서명자면 버전 업 후에도 복호화 가능
// → 롤백 공격 방어: isv_svn 현재 버전 이상만 허용
sgx_key_request_t req = {
    .key_name   = SGX_KEYSELECT_SEAL,
    .key_policy = SGX_KEYPOLICY_MRSIGNER,
    .isv_svn    = CURRENT_ISV_SVN,  // 이 버전 미만 엔클레이브는 열람 불가
};

// 복호화: sgx_unseal_data_helper()
// → sealed_data.key_request 그대로 sgx_get_key() 재호출
// → 동일한 CPU라면 동일한 키 파생 → AES-GCM 복호화`;
