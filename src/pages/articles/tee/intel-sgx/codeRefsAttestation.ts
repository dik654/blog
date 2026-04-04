import type { CodeRef } from './codeRefsTypes';

export const attestationRefs: Record<string, CodeRef> = {
  'target-info': {
    path: 'linux-sgx/common/inc/sgx_report.h — sgx_target_info_t',
    lang: 'c',
    highlight: [1, 14],
    desc: 'EREPORT의 대상 엔클레이브 정보 구조체.\nQE(Quoting Enclave)의 MRENCLAVE와 속성을 지정하면,\nCPU가 해당 QE만 검증 가능한 CMAC 태그를 생성합니다.',
    code: `// common/inc/sgx_report.h (L74-84)
typedef struct _target_info_t
{
    sgx_measurement_t mr_enclave;   // (  0) 대상 엔클레이브의 MRENCLAVE
    sgx_attributes_t  attributes;   // ( 32) 대상 엔클레이브 속성
    uint8_t           reserved1[2]; // ( 48)
    sgx_config_svn_t  config_svn;   // ( 50) CONFIGSVN
    sgx_misc_select_t misc_select;  // ( 52) MISCSELECT
    uint8_t           reserved2[8]; // ( 56)
    sgx_config_id_t   config_id;    // ( 64) CONFIGID
    uint8_t           reserved3[384]; // (128) → 총 512B
} sgx_target_info_t;`,
    annotations: [
      { lines: [4, 5], color: 'sky', note: 'mr_enclave + attributes: QE 신원 지정' },
      { lines: [7, 10], color: 'emerald', note: 'config_svn + misc_select: KSS 확장 필드' },
      { lines: [11, 11], color: 'amber', note: '384B 패딩 → 512B 정렬 (EREPORT 요구사항)' },
    ],
  },

  'quote-structure': {
    path: 'linux-sgx/common/inc/sgx_quote.h — sgx_quote_t',
    lang: 'c',
    highlight: [1, 14],
    desc: 'SGX Quote 구조체 (EPID 버전).\nQE가 앱 엔클레이브의 EREPORT를 CMAC 검증 후\nEPID/ECDSA 서명으로 변환한 원격 증명 토큰입니다.',
    code: `// common/inc/sgx_quote.h (L80-92)
typedef struct _quote_t
{
    uint16_t            version;        //   0: Quote 버전
    uint16_t            sign_type;      //   2: 서명 유형
    sgx_epid_group_id_t epid_group_id;  //   4: EPID 그룹 ID
    sgx_isv_svn_t       qe_svn;         //   8: QE 보안 버전
    sgx_isv_svn_t       pce_svn;        //  10: PCE 보안 버전
    uint32_t            xeid;           //  12: 확장 EPID ID
    sgx_basename_t      basename;       //  16: 기본 이름 (32B)
    sgx_report_body_t   report_body;    //  48: 앱 엔클레이브 측정값
    uint32_t            signature_len;  // 432: 서명 길이
    uint8_t             signature[];    // 436: EPID/ECDSA 서명
} sgx_quote_t;`,
    annotations: [
      { lines: [4, 9], color: 'sky', note: 'Quote 헤더: 버전, 서명 유형, QE/PCE 보안 버전' },
      { lines: [11, 11], color: 'emerald', note: 'report_body: 앱 엔클레이브의 MRENCLAVE/MRSIGNER 포함' },
      { lines: [12, 13], color: 'amber', note: '가변 길이 서명: EPID(~1KB) 또는 ECDSA-P256(64B)' },
    ],
  },

  'att-key-id': {
    path: 'linux-sgx/common/inc/sgx_quote.h — sgx_ql_att_key_id_t',
    lang: 'c',
    highlight: [1, 14],
    desc: 'DCAP(Data Center Attestation Primitives) 증명 키 식별자.\nQE의 MRSIGNER, 제품 ID, 알고리즘 ID로 증명 키를 식별합니다.\nalgorithm_id가 ECDSA-P256이면 DCAP 모드로 동작합니다.',
    code: `// common/inc/sgx_quote.h (L113-124)
typedef struct _sgx_ql_att_key_id_t {
    uint16_t  id;                   // 구조체 ID
    uint16_t  version;              // 구조체 버전
    uint16_t  mrsigner_length;      // MRSIGNER 유효 바이트 수
    uint8_t   mrsigner[48];         // QE 서명자 해시 (SHA-256/384)
    uint32_t  prod_id;              // QE 제품 ID
    uint8_t   extended_prod_id[16]; // 확장 제품 ID
    uint8_t   config_id[64];        // QE CONFIG ID
    uint8_t   family_id[16];        // QE 패밀리 ID
    uint32_t  algorithm_id;         // 증명 키 알고리즘 (ECDSA-P256 등)
} sgx_ql_att_key_id_t;`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'id + version: 구조체 버전 관리' },
      { lines: [5, 6], color: 'emerald', note: 'mrsigner: QE 엔클레이브의 서명자 식별' },
      { lines: [7, 10], color: 'amber', note: '제품/구성 ID: 특정 QE 빌드 식별' },
      { lines: [11, 11], color: 'violet', note: 'algorithm_id: ECDSA-P256(DCAP) vs EPID(레거시)' },
    ],
  },

};
