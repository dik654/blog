export const cryptoStateCode = `// core/tee/tee_svc_cryp.c — 암호화 상태 관리
struct tee_cryp_state {
    TAILQ_ENTRY(tee_cryp_state) link;  // 연결 리스트
    uint32_t algo;    // 알고리즘 ID (TEE_ALG_AES_GCM 등)
    uint32_t mode;    // 동작 모드 (ENCRYPT/DECRYPT/SIGN/VERIFY)
    vaddr_t key1;     // 첫 번째 키 주소
    vaddr_t key2;     // 두 번째 키 (XTS 등)
    void *ctx;        // 암호화 컨텍스트
    tee_cryp_ctx_finalize_func_t ctx_finalize;
    enum cryp_state state;  // INITIALIZED / UNINITIALIZED
};

// 지원 알고리즘 (core/crypto/)
// 대칭키: AES (ECB/CBC/CTR/XTS/GCM/CTS), SM4
// 비대칭: RSA (1024-4096), ECC (P-256/384/521, Curve25519)
// 해시: SHA-1/224/256/384/512, SM3, MD5
// KDF: HKDF, PBKDF2, Concat KDF`;

export const cryptoStateAnnotations = [
  { lines: [2, 10] as [number, number], color: 'sky' as const, note: '암호화 상태 구조체' },
  { lines: [13, 16] as [number, number], color: 'emerald' as const, note: '지원 알고리즘 목록' },
];

export const keyObjCode = `// 보안 키 객체 (tee_cryp_obj_secret)
struct tee_cryp_obj_secret {
    uint32_t key_size;    // 실제 키 크기 (비트)
    uint32_t alloc_size;  // 할당된 크기
    // uint8_t data[alloc_size] — 실제 키 데이터
};

// 키 속성 플래그
#define TEE_TYPE_ATTR_REQUIRED    BIT(1)  // 필수 속성
#define TEE_TYPE_ATTR_GEN_KEY_REQ BIT(5)  // 키 생성 필수

// HW 가속 선택 (conf.mk)
CFG_CRYPTOLIB_NAME=tomcrypt   // LibTomCrypt (기본)
CFG_CRYPTOLIB_NAME=mbedtls    // mbedTLS
// 플랫폼별 HW 가속: CAAM (i.MX), CE (STM32)
// -> crypto_driver_init()에서 자동 탐지`;

export const keyObjAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '키 객체 메모리 레이아웃' },
  { lines: [8, 9] as [number, number], color: 'emerald' as const, note: '키 속성 플래그' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: 'HW/SW 암호화 라이브러리 선택' },
];
