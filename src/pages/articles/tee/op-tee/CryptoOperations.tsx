import CryptoOperationsViz from './viz/CryptoOperationsViz';
import CryptoStateViz from './viz/CryptoStateViz';
import KeyObjViz from './viz/KeyObjViz';

export default function CryptoOperations() {
  return (
    <section id="crypto-operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 연산 &amp; 보안 키 저장</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">GlobalPlatform Crypto API</h3>
        <p>
          <strong>GP TEE Internal Core API</strong>: TA가 사용하는 표준 암호 API<br />
          <strong>제공 기능</strong>: AES, RSA, ECC, SHA, HMAC, HKDF, AEAD 전체<br />
          <strong>HW 가속</strong>: CAAM(NXP), CE(Rockchip), Crypto Engine 자동 활용<br />
          <strong>Fallback</strong>: mbedTLS / LibTomCrypt (소프트웨어 구현)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TA에서 AES 암호화 예</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ta/aes/aes_ta.c

#include <tee_api.h>

TEE_Result aes_encrypt(void *plain, size_t plain_len,
                        void *cipher, size_t *cipher_len) {
    TEE_Result res;
    TEE_OperationHandle op = TEE_HANDLE_NULL;
    TEE_ObjectHandle key_obj = TEE_HANDLE_NULL;

    // 1) Allocate operation
    res = TEE_AllocateOperation(&op, TEE_ALG_AES_CBC_NOPAD,
                                 TEE_MODE_ENCRYPT, 256);
    if (res != TEE_SUCCESS) return res;

    // 2) Allocate transient key object
    res = TEE_AllocateTransientObject(TEE_TYPE_AES, 256, &key_obj);
    if (res != TEE_SUCCESS) goto cleanup;

    // 3) Generate random key (TEE internal RNG)
    TEE_GenerateKey(key_obj, 256, NULL, 0);

    // 4) Set key to operation
    res = TEE_SetOperationKey(op, key_obj);
    if (res != TEE_SUCCESS) goto cleanup;

    // 5) Set IV
    uint8_t iv[16];
    TEE_GenerateRandom(iv, 16);
    TEE_CipherInit(op, iv, 16);

    // 6) Perform encryption
    res = TEE_CipherDoFinal(op, plain, plain_len, cipher, cipher_len);

cleanup:
    if (op != TEE_HANDLE_NULL) TEE_FreeOperation(op);
    if (key_obj != TEE_HANDLE_NULL) TEE_FreeTransientObject(key_obj);
    return res;
}`}</pre>

      </div>
      <CryptoOperationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">지원 알고리즘 카탈로그</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">알고리즘</th>
                <th className="border border-border px-3 py-2 text-left">HW 가속 (대표)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Symmetric</td>
                <td className="border border-border px-3 py-2">AES (CBC/ECB/CTR/XTS/GCM/CCM), DES, 3DES</td>
                <td className="border border-border px-3 py-2">CAAM, AES-NI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Hash</td>
                <td className="border border-border px-3 py-2">SHA-1, SHA-2 (224/256/384/512), SHA-3, MD5</td>
                <td className="border border-border px-3 py-2">SHA engine</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">MAC</td>
                <td className="border border-border px-3 py-2">HMAC, CMAC, GMAC</td>
                <td className="border border-border px-3 py-2">부분 가속</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Asymmetric</td>
                <td className="border border-border px-3 py-2">RSA-2048/3072/4096, DSA, DH</td>
                <td className="border border-border px-3 py-2">PKA engine</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ECC</td>
                <td className="border border-border px-3 py-2">P-256/384/521, Curve25519</td>
                <td className="border border-border px-3 py-2">ECDSA accelerator</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AEAD</td>
                <td className="border border-border px-3 py-2">AES-GCM, AES-CCM, ChaCha20-Poly1305</td>
                <td className="border border-border px-3 py-2">CAAM (일부)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Random</td>
                <td className="border border-border px-3 py-2">TRNG, DRBG</td>
                <td className="border border-border px-3 py-2">TRNG HW</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">암호화 상태 관리 (tee_svc_cryp.c)</h3>
      </div>
      <div className="not-prose mb-6"><CryptoStateViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// core/tee/tee_svc_cryp.c
// Crypto operation handle 관리

struct tee_cryp_state {
    uint32_t algo;              // Algorithm ID
    uint32_t mode;              // ENCRYPT/DECRYPT/MAC/...
    uint32_t state;             // Active state machine
    void *ctx;                  // Algorithm-specific context
    tee_ta_session_t *session;  // Owning TA session
};

// Operation lifecycle
//
//   [Allocated] ──SetKey──> [KeySet]
//                              │
//                              v
//   [Completed] <──DoFinal── [Initialized] <──Init──
//                              │          \\
//                              v           \\
//                          [InProgress]   update loops
//
// 상태 전이 검증
// - DoFinal 전에 반드시 Init 필요
// - Init 전에 key 설정 필수
// - 잘못된 순서 → TEE_ERROR_BAD_STATE

// Syscall 계층 (TA → kernel)
// utee_cryp_obj_alloc()
// → syscall_cryp_obj_alloc()
// → tee_svc_cryp.c 처리
// → Crypto backend 호출 (HW/SW)

// TA-TA 격리
// - 각 TA 세션마다 독립 state
// - TA 종료 시 모든 operation 해제
// - 다른 TA의 key 객체 접근 불가`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 키 객체 & HW 가속 선택</h3>
      </div>
      <div className="not-prose mb-6"><KeyObjViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// Key 객체 구조 (GP TEE API)

typedef struct __TEE_ObjectInfo {
    uint32_t objectType;       // TEE_TYPE_AES, TEE_TYPE_RSA_KEYPAIR, ...
    uint32_t objectSize;       // bits
    uint32_t maxObjectSize;
    uint32_t objectUsage;      // TEE_USAGE_ENCRYPT | ...
    uint32_t dataSize;
    uint32_t dataPosition;
    uint32_t handleFlags;
} TEE_ObjectInfo;

// Key 생성 방법
// 1) GenerateKey: TRNG로 랜덤 생성
TEE_GenerateKey(key_obj, 256, NULL, 0);

// 2) PopulateTransientObject: 평문 key 주입
TEE_Attribute attrs[1] = {{
    .attributeID = TEE_ATTR_SECRET_VALUE,
    .content = { .ref = { .buffer = key_bytes, .length = 32 } }
}};
TEE_PopulateTransientObject(key_obj, attrs, 1);

// 3) Persistent storage에서 로드
TEE_OpenPersistentObject(
    TEE_STORAGE_PRIVATE, "mykey", 5,
    TEE_DATA_FLAG_ACCESS_READ, &key_obj);

// Key는 TEE 내부에만 존재
// - TA 외부로 추출 불가 (UNEXTRACTABLE)
// - TEE_USAGE_EXTRACTABLE 플래그 없으면 read 거부
// - Secure storage는 HUK로 sealing

// HW 가속 선택 로직
// 1) algorithm 요청 들어옴
// 2) crypto driver가 지원 알고리즘 검사
// 3) 지원하면 HW 호출, 아니면 SW fallback
// 4) 투명 — TA는 알고리즘만 지정

// 성능 비교 (AES-256-CBC, 1MB)
// - SW (mbedTLS): ~50 ms
// - HW (CAAM):     ~2 ms
// - 25x 차이`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: HUK(Hardware Unique Key)의 역할</p>
          <p>
            <strong>HUK 정의</strong>:<br />
            - 칩 제조 시 eFuse에 burn된 256-bit 고유 값<br />
            - Intel SGX Root Seal Key의 ARM 버전<br />
            - SW로 직접 읽기 불가
          </p>
          <p className="mt-2">
            <strong>HUK 사용</strong>:<br />
            - Secure Storage 암호화 키 파생<br />
            - Per-TA persistent key generation<br />
            - Attestation key seed<br />
            - Device identity root
          </p>
          <p className="mt-2">
            <strong>파생 예시</strong>:<br />
            <code>TA_key = HKDF(HUK, "TA:" + TA_UUID)</code><br />
            - 다른 TA: 다른 key (격리)<br />
            - 다른 device: 다른 HUK → 다른 key (device binding)<br />
            - 같은 device, 같은 TA: 결정적 (복구 가능)
          </p>
          <p className="mt-2">
            <strong>보안 의의</strong>:<br />
            - HUK 추출 공격은 물리 decapping 필요<br />
            - 현대 칩은 anti-tamper 보호<br />
            - 수만 달러 장비 + 수주 시간 → 실전 위협 낮음
          </p>
        </div>

      </div>
    </section>
  );
}
