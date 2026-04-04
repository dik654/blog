import type { CodeRef } from './codeRefsTypes';

export const sealingRefs2: Record<string, CodeRef> = {
  'report-body': {
    path: 'linux-sgx/common/inc/sgx_report.h — sgx_report_body_t',
    lang: 'c',
    highlight: [1, 18],
    desc: 'EREPORT가 생성하는 보고서 본문 구조체.\nCPU가 하드웨어 수준에서 mr_enclave, mr_signer, cpu_svn 등을 채웁니다.\nreport_data 64바이트는 사용자가 자유롭게 설정 (예: 공개키 해시).',
    code: `// common/inc/sgx_report.h (L93-118)
typedef struct _report_body_t
{
    sgx_cpu_svn_t    cpu_svn;       // (  0) CPU 보안 버전
    sgx_misc_select_t misc_select;  // ( 16) SSA.MISC 필드
    uint8_t          reserved1[12];
    sgx_isvext_prod_id_t
                     isv_ext_prod_id;// ( 32) 확장 제품 ID
    sgx_attributes_t attributes;    // ( 48) 엔클레이브 속성
    sgx_measurement_t mr_enclave;   // ( 64) 코드 측정값 (SHA-256)
    uint8_t          reserved2[32];
    sgx_measurement_t mr_signer;    // (128) 서명자 측정값
    uint8_t          reserved3[32];
    sgx_config_id_t  config_id;     // (192) CONFIGID
    sgx_prod_id_t    isv_prod_id;   // (256) 제품 ID
    sgx_isv_svn_t    isv_svn;       // (258) ISV 보안 버전
    sgx_config_svn_t config_svn;    // (260) CONFIG 보안 버전
    uint8_t          reserved4[42];
    sgx_isvfamily_id_t isv_family_id;// (304) 패밀리 ID
    sgx_report_data_t report_data;  // (320) 사용자 데이터 (64B)
} sgx_report_body_t;

typedef struct _report_t            // 432 bytes
{
    sgx_report_body_t body;
    sgx_key_id_t      key_id;       // (384) 키 다양화
    sgx_mac_t         mac;          // (416) CMAC 128-bit
} sgx_report_t;`,
    annotations: [
      { lines: [4, 5], color: 'sky', note: 'CPU 보안 버전: 마이크로코드 패치 수준 반영' },
      { lines: [10, 12], color: 'emerald', note: 'MRENCLAVE + MRSIGNER: 엔클레이브 신원 증명 핵심 필드' },
      { lines: [15, 17], color: 'amber', note: 'ISV 버전 정보: 롤백 방어 + 최소 버전 정책' },
      { lines: [23, 27], color: 'violet', note: 'sgx_report_t: body + key_id + CMAC 태그 (432B)' },
    ],
  },
};
