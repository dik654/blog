export const quoteContentCode = `// ra-tls/src/attestation.rs
pub enum QuoteContentType<'a> {
    KmsRootCa,      // KMS 루트 CA 공개키
    RaTlsCert,      // RA-TLS 인증서 공개키
    AppData,        // 애플리케이션 정의 데이터
    Custom(&'a str), // 사용자 정의 콘텐츠 타입
}
// report_data = SHA-512("tag":content) — 기본값, 64바이트 전체 사용
// (sha256 선택 시: [0..32]=hash, [32..64]=0 패딩)`;

export const quoteGenCode = `// guest-agent/src/rpc_service.rs
async fn get_quote(request: RawQuoteArgs) -> Result<GetQuoteResponse> {
    // 1. report_data 64바이트로 패딩
    let report_data: [u8; 64] = pad64(&request.report_data)?;

    // 2. TDX Quote 요청 (tdx_attest 크레이트)
    let (_, quote) = tdx_attest::get_quote(&report_data, None)?;
    //   → /dev/tdx_guest ioctl TDX_CMD_GET_QUOTE
    //   → Intel QEMU/TDX 드라이버가 SEAM 모듈에 요청
    //   → ECDSA-P256 서명된 Quote 반환

    // 3. RTMR Event Log 읽기
    let event_log = read_event_logs()?;
    // /sys/kernel/security/integrity/ima/ascii_runtime_measurements
    // 또는 /sys/firmware/acpi/tables/CCEL (CC Event Log)

    Ok(GetQuoteResponse { quote, event_log, report_data: report_data.to_vec() })
}`;

export const quoteStructCode = `struct TdxQuote {
    header: QuoteHeader,     // version=4, att_key_type=ECDSA-P256
    td_report: TdReport,     // 256바이트
    //   ├── tee_tcb_svn: [u8; 16]  — TCB 보안 버전
    //   ├── mrseam: [u8; 48]       — SEAM 모듈 해시
    //   ├── mrtd: [u8; 48]         — TD 초기 상태 해시 (핵심!)
    //   ├── rtmr[0..3]: [u8; 48]   — Runtime Measurement Registers
    //   └── report_data: [u8; 64]  — Guest가 넣은 데이터
    signature: EcdsaP256Signature,  // Intel PCK로 서명
    auth_data: QuoteAuthData,       // PCK cert chain
}`;

export const verifyCode = `// KMS (또는 외부 Verifier)의 검증 과정
async fn verify_tdx_quote(quote: &[u8]) -> Result<VerifiedReport> {
    // 1. Intel PCS에서 TCB Info & QE Identity 다운로드
    let tcb_info = intel_pcs::get_tcb_info(&quote.fmspc).await?;

    // 2. PCK 인증서 체인 검증
    //    PCK Cert → Intermediate CA → Root CA (Intel)
    verify_cert_chain(&quote.auth_data.pck_cert_chain)?;

    // 3. Quote 서명 검증
    quote.auth_data.ecdsa_sig.verify(&quote.td_report.bytes)?;

    // 4. MRTD 검증 (코드 무결성)
    assert_eq!(quote.td_report.mrtd, EXPECTED_MRTD);

    // 5. RTMR 재생 검증 (Event Log 일치 여부)
    let replayed = replay_event_log(&event_log)?;
    assert_eq!(replayed.rtmr[0], quote.td_report.rtmr[0]);

    // 6. report_data 검증 (nonce 또는 공개키 바인딩)
    // 기본 SHA-512: hash("tag":content) = 64바이트 → report_data 전체
    assert_eq!(sha512(b"ratls-cert:", &public_key), &quote.td_report.report_data[..]);

    Ok(VerifiedReport { td_report: quote.td_report, tcb_status })
}`;

export const raTlsCode = `// X.509 인증서에 TDX Quote를 OID로 임베딩
// OID 1.2.840.113741.1337.6 = Intel TDX Quote Extension
Extension {
    oid: OID_INTEL_TDX_QUOTE,
    critical: false,
    value: DER(quote_bytes), // TDX Quote 전체
}

// 서버 공개키 → report_data에 바인딩
// report_data = SHA-512("ratls-cert:" + DER(server_public_key))

// 클라이언트: TLS 핸드셰이크 후 인증서에서 Quote 추출 → 검증
// → 코드 무결성 + 공개키 바인딩을 한 번에 확인`;
