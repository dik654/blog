import type { CodeRef } from './codeRefsTypes';

export const sealingRefs: Record<string, CodeRef> = {
  'key-request': {
    path: 'linux-sgx/common/inc/sgx_key.h — sgx_key_request_t',
    lang: 'c',
    highlight: [1, 16],
    desc: 'EGETKEY 명령어에 전달되는 키 요청 구조체.\nkey_name은 키 유형(봉인/보고서/프로비저닝), key_policy는 MRENCLAVE/MRSIGNER 중 선택합니다.\n구조체 크기는 512 바이트로 고정됩니다.',
    code: `// common/inc/sgx_key.h (L82-94)
// 키 유형 상수
#define SGX_KEYSELECT_SEAL    0x0004

// 키 정책 상수
#define SGX_KEYPOLICY_MRENCLAVE  0x0001  // 코드 해시 바인딩
#define SGX_KEYPOLICY_MRSIGNER   0x0002  // 서명자 해시 바인딩

typedef struct _key_request_t
{
    uint16_t        key_name;        // 키 유형 선택
    uint16_t        key_policy;      // 측정값 바인딩 정책
    sgx_isv_svn_t   isv_svn;         // ISV 보안 버전
    uint16_t        reserved1;
    sgx_cpu_svn_t   cpu_svn;         // CPU 마이크로코드 버전
    sgx_attributes_t attribute_mask; // 속성 마스크
    sgx_key_id_t    key_id;          // 키 다양화 nonce (32B)
    sgx_misc_select_t misc_mask;     // MISC 마스크
    sgx_config_svn_t  config_svn;    // CONFIGSVN (KSS)
    uint8_t         reserved2[434];  // 패딩 → 총 512B
} sgx_key_request_t;`,
    annotations: [
      { lines: [2, 7], color: 'sky', note: '키 유형/정책 상수: 봉인 키는 0x0004, 정책은 MRENCLAVE or MRSIGNER' },
      { lines: [11, 12], color: 'emerald', note: 'key_name + key_policy: CPU가 키 파생 시 사용할 측정값 결정' },
      { lines: [13, 15], color: 'amber', note: 'ISV/CPU 보안 버전: 롤백 방어에 사용' },
      { lines: [16, 20], color: 'violet', note: '키 다양화 + 패딩: 512B 정렬 (EGETKEY 요구사항)' },
    ],
  },

  'sealed-data': {
    path: 'linux-sgx/common/inc/sgx_tseal.h — sgx_sealed_data_t',
    lang: 'c',
    highlight: [1, 14],
    desc: '봉인된 데이터 구조체.\nkey_request에 키 파생 파라미터를 저장하고, aes_data에 AES-GCM 암호문과 인증 태그를 저장합니다.\n복호화 시 key_request를 그대로 EGETKEY에 전달하면 동일한 키가 파생됩니다.',
    code: `// common/inc/sgx_tseal.h (L48-62)
#define SGX_SEAL_TAG_SIZE  SGX_AESGCM_MAC_SIZE  // 16B
#define SGX_SEAL_IV_SIZE   12

typedef struct _aes_gcm_data_t
{
    uint32_t payload_size;             // 암호문 + AAD 총 크기
    uint8_t  reserved[12];
    uint8_t  payload_tag[16];          // AES-GCM 인증 태그
    uint8_t  payload[];               // 암호문 | AAD (순서대로)
} sgx_aes_gcm_data_t;

typedef struct _sealed_data_t
{
    sgx_key_request_t  key_request;   // 키 파생 파라미터 (512B)
    uint32_t     plain_text_offset;   // AAD 시작 오프셋
    uint8_t      reserved[12];
    sgx_aes_gcm_data_t aes_data;      // AES-GCM 데이터
} sgx_sealed_data_t;`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: '상수: 인증 태그 16B, IV 12B (AES-GCM 표준)' },
      { lines: [5, 10], color: 'emerald', note: 'AES-GCM 데이터: payload_tag으로 무결성 검증' },
      { lines: [13, 18], color: 'amber', note: '봉인 구조체: key_request 보존 → 복호화 시 동일 키 재파생' },
    ],
  },

};
