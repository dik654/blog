export const hukDeriveCode = `// core/kernel/huk_subkey.c — HW Unique Key 파생

TEE_Result __huk_subkey_derive(
    enum huk_subkey_usage usage,  // 키 용도 (RPMB, SSK, TA_ENC 등)
    const void *const_data,       // 추가 다양화 데이터
    size_t const_data_len,
    uint8_t *subkey,              // 출력 파생 키
    size_t subkey_len)            // 최대 HUK_SUBKEY_MAX_LEN
{
    void *ctx = NULL;
    struct tee_hw_unique_key huk = { };   // 플랫폼 HUK (OTP)

    // 1. HMAC-SHA256 컨텍스트 초기화
    crypto_mac_alloc_ctx(&ctx, TEE_ALG_HMAC_SHA256);

    // 2. OTP에서 HUK 읽기 (Normal World 접근 불가)
    tee_otp_get_hw_unique_key(&huk);

    // 3. HUK를 HMAC 키로 사용
    crypto_mac_init(ctx, huk.data, sizeof(huk.data));

    // 4. 용도(usage enum)를 도메인 분리자로 사용
    mac_usage(ctx, usage);          // crypto_mac_update(&usage, 4 bytes)

    // 5. 추가 다양화 데이터 (예: TA UUID, 파일 이름)
    if (const_data && const_data_len)
        crypto_mac_update(ctx, const_data, const_data_len);

    // 6. HMAC 완료 -> 파생 키 출력
    crypto_mac_final(ctx, subkey, subkey_len);
    // 키 크기 <= 32 bytes (SHA256 출력 = 256-bit)
}

// 키 파생 용도 (enum huk_subkey_usage)
HUK_SUBKEY_RPMB     // RPMB(Replay Protected Memory Block) 인증 키
HUK_SUBKEY_SSK      // Secure Storage Key (파일 암호화)
HUK_SUBKEY_TA_ENC   // TA 바이너리 암호화 키
HUK_SUBKEY_PRIVACY  // 개인 정보 보호 키`;

export const hukAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '함수 시그니처 & 파라미터' },
  { lines: [16, 20] as [number, number], color: 'emerald' as const, note: 'OTP에서 HUK 읽기 + HMAC 초기화' },
  { lines: [34, 38] as [number, number], color: 'amber' as const, note: '키 파생 용도 분류' },
];

export const keyHierarchyCode = `// OP-TEE 보안 스토리지 키 계층 구조

HUK (OTP에 저장, 읽기 전용, ~128-256 bit)
    | HMAC-SHA256(HUK, usage=SSK || chip_die_id)
SSK (Secure Storage Key, 디바이스 고유)
    | HMAC-SHA256(SSK, file_path_hash)
FEK (File Encryption Key, 파일별 고유)
    | AES-GCM / AES-CTR
암호화된 TA 개인 데이터 (파일시스템 또는 RPMB에 저장)

// RPMB 키 파생 (eMMC 재전송 방지 메모리)
HUK -> HMAC-SHA256(usage=RPMB) -> 32-byte RPMB 인증 키
-> TEE가 RPMB 파티션에 HMAC-SHA256 서명으로 카운터 기반 쓰기 보호

// TA 암호화 (CFG_ENCRYPT_TA 활성화 시)
HUK -> HMAC(usage=TA_ENC || ta_uuid) -> AES-GCM 복호화 키
-> TA 바이너리를 AES-GCM으로 저장 (디스크 탈취 무효화)`;

export const keyHierarchyAnnotations = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: 'HUK -> SSK -> FEK 계층' },
  { lines: [11, 13] as [number, number], color: 'emerald' as const, note: 'RPMB 인증 키 파생' },
  { lines: [15, 17] as [number, number], color: 'violet' as const, note: 'TA 바이너리 암호화' },
];

export const gpApiCode = `// lib/libutee/include/tee_api.h — TA에서 사용하는 표준 API
// GlobalPlatform TEE Internal Core API v1.3

// 객체 핸들 (영구 저장소)
TEE_OpenPersistentObject(storageID, objectID, objectIDLen, flags, &obj);
TEE_CreatePersistentObject(storageID, objectID, objectIDLen, flags,
                           attrs, initialData, initialDataLen, &obj);

// 암호화 연산 (하드웨어 가속 지원)
TEE_AllocateOperation(&op, TEE_ALG_AES_GCM, TEE_MODE_ENCRYPT, 256);
TEE_GenerateKey(obj, 256, NULL, 0);
TEE_AEInit(op, iv, ivLen, tagLen, 0, 0);
TEE_AEEncryptFinal(op, src, srcLen, dst, &dstLen, tag, &tagLen);

// 키 파생 (TEE_DeriveKey -> HKDF/SP800-56C)
TEE_DeriveKey(op, params, paramCount, derivedKey);

// 보안 시간 (하드웨어 카운터 기반)
TEE_GetSystemTime(&time);  // re-settable 시스템 시간
TEE_GetREETime(&time);     // Normal World 시간 (신뢰도 낮음)`;

export const gpApiAnnotations = [
  { lines: [4, 7] as [number, number], color: 'sky' as const, note: '영구 저장소 객체 관리' },
  { lines: [9, 13] as [number, number], color: 'emerald' as const, note: 'AES-GCM 암호화 연산' },
  { lines: [15, 20] as [number, number], color: 'amber' as const, note: '키 파생 & 보안 시간' },
];
