import type { CodeRef } from '@/components/code/types';

const TDX_QUOTE_GEN = `// guest-agent/src/rpc_service.rs — TDX Quote 생성
async fn get_quote(request: RawQuoteArgs) -> Result<GetQuoteResponse> {
    // 1. report_data 64바이트 패딩
    let mut report_data = [0u8; 64];
    report_data[..request.report_data.len()]
        .copy_from_slice(&request.report_data);

    // 2. /dev/tdx_guest ioctl → SEAM 모듈에 Quote 요청
    let (_, quote) = tdx_attest::get_quote(&report_data, None)?;
    // → Intel QGS(Quote Generation Service)가 ECDSA-P256 서명

    // 3. RTMR Event Log 수집
    //    /sys/firmware/acpi/tables/CCEL (CC Event Log)
    let event_log = read_event_logs()?;

    Ok(GetQuoteResponse { quote, event_log,
                          report_data: report_data.to_vec() })
}`;

const TDX_VERIFY = `// kms/src/verify.rs — TDX Quote 검증
async fn verify_tdx_quote(quote_bytes: &[u8]) -> Result<VerifiedReport> {
    // 1. Quote 파싱 (v4 포맷)
    let quote = TdxQuote::parse(quote_bytes)?;

    // 2. Intel PCS에서 TCB Info 다운로드
    let tcb_info = intel_pcs::get_tcb_info(&quote.fmspc).await?;

    // 3. PCK 인증서 체인 검증
    //    PCK Cert → Platform CA → Root CA (Intel)
    verify_cert_chain(&quote.auth_data.pck_chain)?;

    // 4. ECDSA-P256 서명 검증
    quote.auth_data.verify_signature(&quote.td_report)?;

    // 5. MRTD 검증 — TD 초기 상태 해시
    assert_eq!(quote.td_report.mrtd, expected_mrtd,
               "TD measurement mismatch");

    // 6. RTMR 재생 검증 — Event Log 일치 확인
    let replayed = replay_event_log(&event_log)?;
    assert_eq!(replayed.rtmr[0], quote.td_report.rtmr[0]);

    Ok(VerifiedReport { td_report: quote.td_report,
                        tcb_status: tcb_info.status })
}`;

export const attestCodeRefs: Record<string, CodeRef> = {
  'tdx-quote-gen': {
    path: 'dstack/guest-agent/src/rpc_service.rs',
    code: TDX_QUOTE_GEN,
    highlight: [2, 19],
    lang: 'rust',
    annotations: [
      { lines: [5, 8], color: 'sky', note: 'report_data 64바이트 패딩 — nonce 또는 공개키' },
      { lines: [10, 12], color: 'emerald', note: '/dev/tdx_guest → SEAM → ECDSA-P256 서명' },
      { lines: [14, 16], color: 'amber', note: 'RTMR Event Log — 런타임 측정 이력' },
    ],
    desc:
`Guest Agent의 TDX Quote 생성 과정입니다.

/dev/tdx_guest 디바이스를 통해 SEAM 모듈에 Quote를 요청합니다.
SEAM은 TD의 측정값(MRTD, RTMR)을 포함한 TD Report를 생성하고,
Intel QGS가 ECDSA-P256으로 서명하여 Quote를 완성합니다.`,
  },

  'tdx-verify': {
    path: 'dstack/kms/src/verify.rs',
    code: TDX_VERIFY,
    highlight: [2, 25],
    lang: 'rust',
    annotations: [
      { lines: [6, 7], color: 'sky', note: 'Intel PCS에서 TCB 정보 다운로드' },
      { lines: [10, 14], color: 'emerald', note: '인증서 체인 + 서명 검증' },
      { lines: [16, 18], color: 'amber', note: 'MRTD 검증 — 코드 무결성 확인' },
      { lines: [21, 23], color: 'violet', note: 'RTMR 재생 — Event Log 일관성 확인' },
    ],
    desc:
`KMS의 TDX Quote 검증 과정입니다.

5단계 검증: Quote 파싱 → TCB 확인 → 인증서 체인 → 서명 → MRTD/RTMR
MRTD가 예상값과 다르면 변조된 코드가 실행 중이므로 키 발급을 거부합니다.`,
  },
};
