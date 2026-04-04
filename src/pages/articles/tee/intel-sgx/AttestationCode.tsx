export const ereportCode = `// sdk/selib/sgx_create_report.cpp — EREPORT 명령어 래퍼

sgx_status_t sgx_create_report(
    const sgx_target_info_t  *target_info,  // QE의 MRENCLAVE + 속성
    const sgx_report_data_t  *report_data,  // 64-byte 사용자 데이터 (예: 공개키 해시)
    sgx_report_t             *report)       // 출력: CPU가 서명한 보고서
{
    // 정적 크기 검증 (컴파일 타임)
    static_assert(sizeof(*target_info) == 512);
    static_assert(sizeof(*report_data) == 64);
    static_assert(sizeof(*report) == 432);

    // 모든 포인터는 반드시 엔클레이브 내부 메모리여야 함
    if (!sgx_is_within_enclave(target_info, sizeof(*target_info)))
        return SGX_ERROR_INVALID_PARAMETER;

    // CPU가 EREPORT 실행: MRENCLAVE/MRSIGNER/CPUSVN 포함한 보고서 생성
    // + target_info 엔클레이브(QE)만 검증 가능한 CMAC 태그 첨부
    do_ereport(&tmp_target_info, &tmp_report_data, &tmp_report);
}

// sgx_report_t 구조 (432 bytes)
typedef struct {
    sgx_report_body_t body;    // MRENCLAVE, MRSIGNER, CPUSVN, attributes, report_data
    sgx_key_id_t      key_id;  // 보고서 키 식별자
    sgx_mac_t         mac;     // CMAC: target_info 엔클레이브만 검증 가능 (128-bit)
} sgx_report_t;

// sgx_self_report(): 자신의 보고서 (target_info=NULL → CPU 자체 CMAC)
// 최초 호출 시 한 번만 생성 후 캐시 (flags=0 체크로 초기화 여부 판단)`;

export const aeQuoteCode = `// AESM 서비스 (psw/ae/aesm_service/) 가 조율하는 증명 흐름

// PCE (Provisioning Certificate Enclave) - psw/ae/pce/pce.cpp
// PPID(Platform Provisioning ID) + PCK(Provisioning Cert Key)를 프로비저닝
uint32_t get_pc_info(
    const sgx_report_t *report,           // 앱 엔클레이브 보고서
    const uint8_t *public_key,            // Intel PCS RSA-3072 공개키
    uint32_t key_size,                    // RSA_MOD_SIZE(384) + RSA_E_SIZE(4)
    uint8_t  crypto_suite,                // ALG_RSA_OAEP_3072
    uint8_t *encrypted_ppid,              // 출력: RSA-OAEP로 암호화된 PPID
    pce_info_t *pce_info,                 // 출력: PCE ISVSVN + PSVN
    uint8_t *signature_scheme)            // 출력: PCK 서명 방식
{
    // get_ppid(): EGETKEY(PPID 키)로 플랫폼 고유 ID 생성
    get_ppid(ppid);
    // Intel PCS의 RSA 공개키로 PPID 암호화 후 반환
    rsa_oaep_encrypt(public_key, ppid, encrypted_ppid);
}

// QE3 (Quoting Enclave 3) — ECDSA Quote 생성
// uae_api.cpp: oal_get_quote_ex() → AESM 소켓 → QE3 ECALL
// QE3가 앱 엔클레이브 REPORT의 CMAC을 검증 후 ECDSA로 서명

// Quote v3 구조 (ECDSA)
typedef struct {
    uint16_t version;          // 3
    uint16_t att_key_type;     // SGX_QL_ATT_KEY_TYPE_ECDSA_P256
    uint8_t  tee_type[4];      // 0x00000000 = SGX
    uint8_t  qe_svn[2];        // QE 보안 버전
    uint8_t  pce_svn[2];       // PCE 보안 버전
    uint8_t  qe_vendor_id[16]; // Intel QE UUID
    uint8_t  user_data[20];
    sgx_report_body_t isv_enclave_report;  // 앱 엔클레이브 측정값
    uint8_t  signature[];      // ECDSA-P256 서명 + QE 인증 데이터
} sgx_quote3_t;`;

export const dcapVerifyCode = `// SGX DCAP (Data Center Attestation Primitives) 원격 검증 흐름

// 검증자 측 처리 (sgx-dcap-quote-verify 라이브러리)
// 1. Quote 파싱: isv_enclave_report에서 MRENCLAVE/MRSIGNER 추출
// 2. Intel PCS에서 PCK 인증서 체인 조회:
//    PCK Cert → PCE Cert → Intel SGX Root CA
// 3. PCK로 Quote의 ECDSA 서명 검증
// 4. MRENCLAVE/MRSIGNER가 예상값과 일치하는지 확인
// 5. CPUSVN, ISVSVN이 최소 버전 이상인지 확인

// 신뢰 체인 요약
앱 엔클레이브
  → EREPORT(target=QE) → sgx_report_t (CMAC)
  → QE가 CMAC 검증 후 ECDSA 서명 → Quote
  → 검증자가 PCK 체인으로 Quote 서명 검증
  → Intel SGX Root CA가 최종 신뢰 앵커`;
