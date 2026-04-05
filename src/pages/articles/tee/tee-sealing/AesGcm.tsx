import AesGcmViz from './viz/AesGcmViz';

export default function AesGcm() {
  return (
    <section id="aes-gcm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AES-GCM 봉인/개봉 흐름</h2>
      <div className="not-prose mb-8"><AesGcmViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">AEAD — 기밀성 + 무결성</h3>
        <p>
          <strong>AES-128-GCM</strong>: 실제 sealing에서 사용되는 AEAD 알고리즘<br />
          <strong>AEAD</strong>(Authenticated Encryption with Associated Data): 기밀성 + 무결성 동시 제공<br />
          <strong>하드웨어 가속</strong>: AES-NI + PCLMULQDQ로 매우 빠름<br />
          <strong>NIST SP 800-38D</strong> 표준 — 방대한 검증
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GCM 모드 동작 원리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// GCM = CTR mode encryption + GHASH authentication

// Input:
//   K: 128-bit key
//   IV: 96-bit initialization vector (nonce, 12B)
//   P: plaintext (variable length)
//   A: additional authenticated data (AAD)

// Output:
//   C: ciphertext (same length as P)
//   T: 128-bit authentication tag

// CTR encryption
// counter_0 = IV || 0x00000001
// counter_i = IV || i  (i = 1, 2, ...)
// C[i] = P[i] ⊕ AES_K(counter_i)

// GHASH (authentication)
// H = AES_K(0^128)  // hash subkey
// Y[0] = 0^128
// For each block of (A || 0-pad || C || 0-pad || len(A) || len(C)):
//     Y[i+1] = (Y[i] ⊕ X[i]) · H  (GF(2^128) multiplication)

// Final tag
// T = GHASH ⊕ AES_K(counter_0)

// 성능
// - Intel AES-NI: ~1 cycle per byte
// - PCLMULQDQ: GHASH 가속
// - 64B cache line 기준: ~30ns (L1 hit)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">봉인 과정 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// sgx_seal_data 구현 (linux-sgx/sdk/tseal/tSeal.cpp)

sgx_status_t sgx_seal_data_ex(
    uint16_t key_policy,
    sgx_attributes_t attribute_mask,
    sgx_misc_select_t misc_mask,
    uint32_t additional_MACtext_length,
    const uint8_t *p_additional_MACtext,
    uint32_t text2encrypt_length,
    const uint8_t *p_text2encrypt,
    uint32_t sealed_data_size,
    sgx_sealed_data_t *p_sealed_data
) {
    // 1) Key request 설정
    sgx_key_request_t req = {
        .key_name = SGX_KEYSELECT_SEAL,
        .key_policy = key_policy,
        .attribute_mask = attribute_mask,
        .misc_mask = misc_mask,
    };

    // 2) Random KeyID 생성 (각 seal마다 fresh)
    sgx_read_rand(req.key_id, SGX_KEYID_SIZE);

    // 3) CPUSVN 및 ISV_SVN 설정 (현재 값)
    sgx_self_report_data(&report);
    req.cpu_svn = report.body.cpu_svn;
    req.isv_svn = report.body.isv_svn;

    // 4) EGETKEY
    sgx_key_128bit_t seal_key;
    sgx_get_key(&req, &seal_key);

    // 5) IV는 0으로 고정 (안전 이유)
    uint8_t iv[12] = {0};
    // ← KeyID가 매번 다르므로 (key, iv) 쌍은 유니크
    // ← Nonce reuse 공격 방어

    // 6) AES-GCM 암호화
    sgx_rijndael128GCM_encrypt(
        &seal_key,
        p_text2encrypt, text2encrypt_length,
        p_sealed_data->aes_data.payload,
        iv, 12,
        p_additional_MACtext, additional_MACtext_length,
        &p_sealed_data->aes_data.payload_tag  // MAC
    );

    // 7) Metadata 저장
    p_sealed_data->key_request = req;
    p_sealed_data->plain_text_offset = text2encrypt_length;
    p_sealed_data->payload_size = text2encrypt_length + additional_MACtext_length;

    return SGX_SUCCESS;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">개봉 과정 — MAC 검증 우선</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// sgx_unseal_data 구현

sgx_status_t sgx_unseal_data(
    const sgx_sealed_data_t *p_sealed_data,
    uint8_t *p_additional_MACtext,
    uint32_t *p_additional_MACtext_length,
    uint8_t *p_decrypted_text,
    uint32_t *p_decrypted_text_length
) {
    // 1) Key request를 sealed data에서 그대로 가져옴
    sgx_key_request_t req = p_sealed_data->key_request;
    // ← CPUSVN, ISV_SVN, KeyID 모두 봉인 시점 값

    // 2) EGETKEY로 동일 키 재파생
    sgx_key_128bit_t seal_key;
    sgx_status_t ret = sgx_get_key(&req, &seal_key);
    if (ret != SGX_SUCCESS) return ret;
    // ← MRENCLAVE/MRSIGNER가 다르면 여기서 다른 키 → 복호화 실패

    // 3) IV 복원 (0으로 고정)
    uint8_t iv[12] = {0};

    // 4) AES-GCM 복호화 + MAC 검증 (atomically)
    ret = sgx_rijndael128GCM_decrypt(
        &seal_key,
        p_sealed_data->aes_data.payload,
        payload_size,
        p_decrypted_text,
        iv, 12,
        p_sealed_data->aes_data.payload + plain_text_offset,
        additional_MACtext_length,
        &p_sealed_data->aes_data.payload_tag  // MAC 비교
    );

    if (ret == SGX_ERROR_MAC_MISMATCH) {
        // 변조 탐지!
        return SGX_ERROR_MAC_MISMATCH;
    }

    return SGX_SUCCESS;
}

// MAC mismatch 의미
// - Ciphertext 변조
// - AAD 변조
// - IV/Key 불일치 (잘못된 enclave)
// - 다른 CPU에서 복사 시도
// - Downgrade 공격`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">sealed_data_t 구조체</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// sgx_tseal.h

typedef struct _sealed_data_t {
    sgx_key_request_t  key_request;       // 512 bytes — 키 파생 파라미터
    uint32_t           plain_text_offset; // AAD 시작 위치
    uint8_t            reserved[12];
    sgx_aes_gcm_data_t aes_data;          // 암호문 + MAC
} sgx_sealed_data_t;

typedef struct _aes_gcm_data_t {
    uint32_t payload_size;      // encrypted data size
    uint8_t  reserved[12];
    uint8_t  payload_tag[16];   // 128-bit MAC
    uint8_t  payload[];         // flexible array
} sgx_aes_gcm_data_t;

// 전체 크기
// = sizeof(key_request)      // 512
// + 4 (plain_text_offset)
// + 12 (reserved)
// + 4 (payload_size)
// + 12 (reserved)
// + 16 (MAC)
// + plaintext_size
// + aad_size
// = 560 + plaintext + aad bytes

// 예: 32B 마스터 키 sealing
// -> 560 + 32 = 592 bytes on disk`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">고급: Sealing + Key Rotation</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 주기적 key rotation 패턴

class SealedKeyStore {
    // 현재 세대 마스터 키 (sealed)
    sealed_data_t *current_master;

    // 이전 세대 (rotation 중)
    sealed_data_t *previous_master;

    void rotate() {
        // 1) 새 마스터 생성
        uint8_t new_master[32];
        sgx_read_rand(new_master, 32);

        // 2) 현재 데이터 언실
        uint8_t current_master_plaintext[32];
        sgx_unseal_data(current_master, NULL, NULL,
                        current_master_plaintext, &len);

        // 3) 새 마스터로 모든 데이터 재암호화
        for (entry in key_store) {
            uint8_t plaintext[entry.size];
            aes_gcm_decrypt(entry.data, current_master_plaintext, plaintext);
            aes_gcm_encrypt(plaintext, new_master, &entry.data);
        }

        // 4) 새 마스터를 MRSIGNER로 재봉인
        sealed_data_t *new_sealed = sgx_seal_data(
            new_master, SGX_KEYPOLICY_MRSIGNER);

        // 5) 이전 세대 → previous_master에 백업
        previous_master = current_master;
        current_master = new_sealed;

        // 6) 일정 유예 후 previous 삭제
        schedule_delete(previous_master, 30_days);
    }
};`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: IV를 왜 0으로 고정했나</p>
          <p>
            <strong>일반적 GCM 사용</strong>:<br />
            - 각 메시지마다 random IV (96-bit)<br />
            - Nonce reuse 절대 금지 (catastrophic failure)
          </p>
          <p className="mt-2">
            <strong>SGX sealing의 특수성</strong>:<br />
            - KeyID가 32B (256-bit) 랜덤<br />
            - (Key, KeyID) 쌍 자체가 유니크<br />
            - 동일 Key로 여러 번 seal해도 KeyID가 다르므로 Seal Key 다름<br />
            - 따라서 IV는 고정 가능
          </p>
          <p className="mt-2">
            <strong>이점</strong>:<br />
            ✓ IV 저장 불필요 (12B 절약)<br />
            ✓ 구현 단순화<br />
            ✓ 보안 동일 (KeyID가 effective nonce)
          </p>
          <p className="mt-2">
            <strong>주의</strong>:<br />
            ✗ Intel SGX SDK 외부에서 seal 구현 시 이 trick 주의<br />
            ✗ KeyID 생성이 random하지 않으면 위험<br />
            ✗ 다른 TEE(TDX, CCA)는 다른 convention 사용
          </p>
        </div>

      </div>
    </section>
  );
}
