export default function IasDcap() {
  return (
    <section id="ias-dcap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IAS vs DCAP 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">두 시스템의 역사</h3>
        <p>
          <strong>IAS</strong>(Intel Attestation Service): 2015년 SGX 출시와 함께 도입<br />
          <strong>DCAP</strong>(Data Center Attestation Primitives): 2019년 도입, 점진적 대체<br />
          <strong>2020년</strong>: Intel이 EPID/IAS deprecation 발표<br />
          <strong>현재</strong>: DCAP이 사실상 표준 — 모든 클라우드가 DCAP 사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상세 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">IAS (EPID)</th>
                <th className="border border-border px-3 py-2 text-left">DCAP (ECDSA)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">서명 알고리즘</td>
                <td className="border border-border px-3 py-2">EPID (그룹 서명)</td>
                <td className="border border-border px-3 py-2">ECDSA P-256</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">검증 주체</td>
                <td className="border border-border px-3 py-2">Intel IAS 서버</td>
                <td className="border border-border px-3 py-2">사용자/운영자</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">온라인 필수</td>
                <td className="border border-border px-3 py-2">Yes (매 attestation)</td>
                <td className="border border-border px-3 py-2">No (PCK 캐시)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Privacy</td>
                <td className="border border-border px-3 py-2">익명성 (그룹 내)</td>
                <td className="border border-border px-3 py-2">Chip ID 노출</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Scalability</td>
                <td className="border border-border px-3 py-2">Intel 서버 한계</td>
                <td className="border border-border px-3 py-2">무제한</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">인증서 체인</td>
                <td className="border border-border px-3 py-2">간단 (IAS cert만)</td>
                <td className="border border-border px-3 py-2">4단계 (Root→PCK)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Deployment 복잡도</td>
                <td className="border border-border px-3 py-2">낮음</td>
                <td className="border border-border px-3 py-2">중간 (PCCS 운영)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Status</td>
                <td className="border border-border px-3 py-2">Deprecated</td>
                <td className="border border-border px-3 py-2">현재 표준</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">IAS 검증 흐름 (legacy)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// IAS 사용 흐름 (과거)

// 1) Enclave → Quote 생성
quote = sgx_get_quote(report, linkable=false);

// 2) HTTPS 요청 to IAS
POST https://api.trustedservices.intel.com/sgx/attestation/v4/report
Header: Ocp-Apim-Subscription-Key: <your-key>
Body: { "isvEnclaveQuote": "<base64 quote>" }

// 3) IAS 응답
{
  "id": "...",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": 4,
  "isvEnclaveQuoteStatus": "OK" | "SW_HARDENING_NEEDED" | ...,
  "isvEnclaveQuoteBody": "<base64>",
  "platformInfoBlob": "...",  // 패치 가이드
  "nonce": "..."
}

// 4) Application이 IAS 응답 검증
// - Signature from IAS report signing cert
// - isvEnclaveQuoteStatus 확인
// - Enclave measurement 확인

// 문제점
// - Intel 서버 outage → 모든 attestation 실패
// - Privacy: Intel이 모든 attestation 감사
// - Rate limit: 초당 요청 수 제한
// - 클라우드 확장성 한계`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 검증 흐름 (현재 표준)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DCAP 사용 흐름 (Intel PCCS 예)

// 사전 설정 (1회)
// 1) PCCS 서버 설정
docker run intel/pccs:latest
// → Intel PCS로부터 PCK cert 캐시

// 런타임 (매 attestation)
// 1) Enclave → Quote 생성
quote = sgx_get_quote(report, ECDSA);

// 2) 애플리케이션 내에서 검증
#include "sgx_dcap_quoteverify.h"

sgx_ql_qe_report_info_t qve_info;
sgx_ql_qv_result_t quote_verification_result;
uint32_t collateral_expiration_status;

// 옵션 1: QVE(Quote Verification Enclave) 사용
ret = sgx_qv_verify_quote(
    quote, quote_size,
    NULL,  // p_quote_collateral (optional)
    expiration_check_date,
    &collateral_expiration_status,
    &quote_verification_result,
    &qve_info,
    supplemental_data_size,
    p_supplemental_data
);

// 옵션 2: 순수 라이브러리 (no enclave)
ret = sgx_qv_verify_quote_no_enclave(
    quote, quote_size,
    collateral, ...
);

// 3) 결과 처리
switch (quote_verification_result) {
    case SGX_QL_QV_RESULT_OK:
        // 완전 유효 + 최신 TCB
        trust_enclave();
        break;
    case SGX_QL_QV_RESULT_OUT_OF_DATE:
        // TCB 패치 필요 (경고)
        log_warning();
        break;
    case SGX_QL_QV_RESULT_SW_HARDENING_NEEDED:
        // SW 완화 적용 필요
        check_sw_patches();
        break;
    case SGX_QL_QV_RESULT_REVOKED:
        // 거부!
        reject_enclave();
        break;
}

// 장점
// ✓ 인터넷 연결 불필요 (PCCS 로컬)
// ✓ Latency < 100ms (vs IAS 수초)
// ✓ 자체 정책 적용 가능
// ✓ 감사 로그 자체 관리`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">클라우드 별 DCAP 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Azure Confidential Computing
// - Microsoft Azure Attestation (MAA) service
// - Intel DCAP 백엔드 사용
// - REST API로 verify 제공
// - JWT 반환 (검증된 claims)

POST https://sharedeus.eus.attest.azure.net/attest/SgxEnclave
Body: { "quote": "<base64>", "runtimeData": {...} }
Response: JWT with claims

// Google Cloud Confidential Computing
// - Intel DCAP 표준 지원
// - Confidential VM (AMD SEV-SNP) 우선
// - Customer-managed attestation 권장

// AWS Nitro Enclaves
// - 자체 attestation 시스템 (NOT Intel DCAP)
// - KMS 통합
// - Nitro Secure Module (NSM)

// On-premise
// - PCCS Docker 운영
// - intel/pccs-* images
// - 운영자 자체 policy 관리

// 추세
// - Intel DCAP이 사실상 표준
// - 각 클라우드가 wrapper 제공
// - Cross-cloud verifier (Veraison, Attestation as Service)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">마이그레이션 고려사항</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// EPID → DCAP 마이그레이션 (기존 시스템)

// 1) 호환성 확인
//    - Intel SGX 드라이버 버전 (2.14+)
//    - Linux kernel (5.11+)
//    - OS platform (Ubuntu 20.04+)

// 2) PCCS 인프라 구축
//    - Intel PCS API key 발급
//    - PCCS docker 실행
//    - 네트워크 설정 (내부 access)

// 3) SDK 업데이트
//    - Intel SGX SDK 2.15+
//    - DCAP quote generation 라이브러리

// 4) Quote 생성 코드 변경
// Before (EPID)
sgx_get_quote(p_report, LINKABLE_SIGNATURE, &spid, ...);

// After (ECDSA/DCAP)
sgx_qe_get_quote_size(&quote_size);
sgx_qe_get_quote(p_report, quote_size, quote_buf);

// 5) Verifier 변경
// Before: HTTPS POST to IAS
// After: sgx_qv_verify_quote() locally

// 6) 정책 재검토
//    - TCB 만료 정책
//    - SW_HARDENING_NEEDED 처리
//    - Supplemental data 활용

// 권장 일정
// - 병렬 운영 (3~6개월)
// - EPID 점진적 phase-out
// - DCAP 프로덕션 검증`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 EPID가 실패했나</p>
          <p>
            <strong>EPID의 야심</strong>:<br />
            - 익명 증명 (프라이버시)<br />
            - 그룹 멤버 revocation<br />
            - 암호학적으로 정교함
          </p>
          <p className="mt-2">
            <strong>실제 문제</strong>:<br />
            ✗ Intel 중앙집중 — single point of failure<br />
            ✗ 익명성이 enterprise에는 장애물 (audit 불가)<br />
            ✗ EPID 구현 복잡 → 보안 버그<br />
            ✗ Scale 한계 (IAS 서버 부하)<br />
            ✗ Cloud-native 아키텍처와 불일치
          </p>
          <p className="mt-2">
            <strong>DCAP의 실용주의</strong>:<br />
            ✓ 표준 PKI (ECDSA, X.509) — 검증된 기술<br />
            ✓ Verifier 분산 → scale out<br />
            ✓ 기업 PKI 인프라 재활용<br />
            ✓ 오프라인 검증 (에어갭 환경)<br />
            → "boring technology wins"
          </p>
        </div>

      </div>
    </section>
  );
}
