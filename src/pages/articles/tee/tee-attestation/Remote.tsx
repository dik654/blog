export default function Remote() {
  return (
    <section id="remote" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 (EPID/DCAP)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Remote Attestation의 구조</h3>
        <p>
          <strong>원격 증명</strong>: 로컬 증명의 확장 — 네트워크 너머 검증 가능<br />
          <strong>Quoting Enclave(QE)</strong>: EREPORT → Quote 변환, 외부 전송 가능한 서명 생성<br />
          <strong>2가지 방식</strong>: EPID(old, deprecated) vs DCAP(new, current)<br />
          <strong>Verifier 위치</strong>: Intel 서버(EPID) vs 자체 운영(DCAP)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EPID 방식 (2015~2020)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// EPID (Enhanced Privacy ID)
// - 그룹 서명 기반 (Brickell-Li 2007)
// - Intel의 특화 기술

// 특성
// - "그룹"에 서명 key 할당
// - 개별 platform 익명 (unlinkability)
// - 그러나 invalid 멤버 revoke 가능

// 작동 방식
// Group_public_key = PK_G
// Each chip has: private_key PK_i (member of group)
// Each signature: σ = Sign(PK_i, msg)
// Verifier checks: Verify(PK_G, σ, msg) = true
//                 without learning which i

// IAS (Intel Attestation Service)
// - Intel 운영 중앙 verifier
// - HTTPS API
// - attestation report 제출 → 검증 결과 반환

// 흐름
// 1. App enclave → Quote 생성 (via QE)
// 2. Quote를 IAS에 POST
// 3. IAS가 EPID 그룹 서명 검증
// 4. IAS가 서명된 결과 반환
// 5. Verifier가 IAS 응답 확인

// 제약
// ✗ Intel 서버 필수 (온라인만)
// ✗ Intel이 모든 attestation 봄 (privacy)
// ✗ Scalability 한계 (single PoC)
// → 2020년 EPID deprecated`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 방식 (2019~현재)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DCAP (Data Center Attestation Primitives)
// - ECDSA 기반
// - 분산 검증 (no single point)

// 핵심 개념
// - PCK (Provisioning Certification Key): 각 CPU chip 고유
// - Attestation Key (AK): runtime 생성, PCK로 보증됨
// - PCS (Provisioning Certification Service): AMD/Intel 운영 CA

// 인증서 체인
// Intel Root CA (in CPU eFuse)
//     ↓ signs
// Intel SGX Root CA
//     ↓ signs
// Platform CA
//     ↓ signs
// PCK Cert (per-chip, per-TCB)
//     ↓ signs
// Attestation Key
//     ↓ signs
// Quote

// 오프라인 검증
// 1) 운영자가 PCK cert를 한 번 다운로드 (PCS)
// 2) 캐시에 저장 (예: Intel PCCS 서버)
// 3) Quote 받으면 로컬 캐시로 검증
// 4) PCS 재방문 불필요 (TCB 갱신 시만)

// 장점
// ✓ Intel 서버 의존성 제거
// ✓ 분산 verifier 가능
// ✓ Scale out 용이 (cache)
// ✓ Privacy 개선 (Intel이 individual quotes 못 봄)

// 현재 표준
// - Intel SGX: DCAP
// - Intel TDX: DCAP 확장
// - AMD SEV-SNP: VCEK (유사 구조)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DCAP 인프라 구성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 전형적인 DCAP 배포

// 1) Provisioning Service (Intel 운영)
// URL: https://api.trustedservices.intel.com/sgx/certification/v4/
// Endpoints:
//   GET /pckcert?encrypted_ppid=...
//   GET /pckcrl?ca=processor
//   GET /tcb?fmspc=...
//   GET /qe/identity

// 2) PCCS (Provisioning Certificate Caching Service)
// - 운영자가 자체 운영
// - Intel PCS를 proxy + cache
// - 내부 네트워크에서 오프라인 접근

// Docker 예
docker run -p 8081:8081 intel/pccs:latest \\
    -e API_KEY=<intel-pcs-api-key>

// 3) QVL (Quote Verification Library)
// - 오픈소스 (intel-sgx-ssl)
// - Quote 파싱 및 검증
// - 정책 적용

// 4) Application 통합
quote_bytes = recv_quote()
result = qvl_verify_quote(quote_bytes, cert_chain)

switch (result.status) {
    case UpToDate:         // 최신 TCB
    case OutOfDate:        // 패치 필요
    case SWHardeningNeeded: // SW 완화 적용 필요
    case Revoked:          // 거부
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Quote 구조 (SGX DCAP v3)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SGX Quote 3.0 구조

struct sgx_quote3 {
    struct quote_header header;
        u16 version;        // 3
        u16 att_key_type;   // 2 (ECDSA P-256)
        u32 tee_type;       // 0 = SGX
        u16 qe_svn;
        u16 pce_svn;
        u32 vendor_id;      // Intel
        u8  user_data[20];

    struct report_body body;
        u8  cpu_svn[16];
        u32 misc_select;
        u8  attributes[16];
        u8  mr_enclave[32];
        u8  mr_signer[32];
        u16 isv_prod_id;
        u16 isv_svn;
        u8  report_data[64];

    u32 signature_data_len;
    struct signature_data {
        u8 ecdsa_sig[64];          // ECDSA P-256
        u8 ecdsa_attestation_key[64];
        struct qe_report;
        u8 qe_report_sig[64];
        u8 cert_data[];             // PCK cert chain
    };
};

// 크기: 기본 ~4KB (cert chain 포함)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 사용 사례별 패턴</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">사용 사례</th>
                <th className="border border-border px-3 py-2 text-left">권장 방식</th>
                <th className="border border-border px-3 py-2 text-left">Nonce</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">TLS handshake (RA-TLS)</td>
                <td className="border border-border px-3 py-2">DCAP + X.509 ext</td>
                <td className="border border-border px-3 py-2">TLS random</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">키 배포</td>
                <td className="border border-border px-3 py-2">DCAP + nonce</td>
                <td className="border border-border px-3 py-2">Fresh random</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">블록체인 오라클</td>
                <td className="border border-border px-3 py-2">DCAP</td>
                <td className="border border-border px-3 py-2">Block hash</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">서비스 등록</td>
                <td className="border border-border px-3 py-2">DCAP (once)</td>
                <td className="border border-border px-3 py-2">Service nonce</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">법적 감사</td>
                <td className="border border-border px-3 py-2">DCAP with long-term archive</td>
                <td className="border border-border px-3 py-2">Audit event ID</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DCAP의 패러다임 전환</p>
          <p>
            <strong>EPID의 한계</strong>:<br />
            - Intel centralized verifier<br />
            - 각 attestation이 IAS 경유<br />
            - 대규모 scale 어려움
          </p>
          <p className="mt-2">
            <strong>DCAP의 해결</strong>:<br />
            - Intel = Certificate Authority only (PCK 발급)<br />
            - Verification = 운영자가 직접<br />
            - 표준 X.509/ECDSA 사용<br />
            - 기존 PKI 인프라 재활용
          </p>
          <p className="mt-2">
            <strong>확장 방향</strong>:<br />
            - IETF RATS 표준화<br />
            - Cross-vendor verifier (Veraison)<br />
            - Attestation + blockchain audit<br />
            - Attestation-as-a-Service (cloud 3rd party)
          </p>
        </div>

      </div>
    </section>
  );
}
