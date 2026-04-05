import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Remote Attestation이란</h3>
        <p>
          <strong>원격 증명</strong>(Remote Attestation): TEE 내부 코드의 신뢰성을 원격으로 검증<br />
          "이 코드가 정말 TEE 안에서, 의도한 바이너리로, 패치된 CPU에서 실행 중인가?"<br />
          <strong>암호학적 증명</strong> — 단순 신뢰가 아닌 수학적 검증<br />
          <strong>3자 모델</strong>: Attester(TEE) → Verifier(검증자) → Relying Party(의존자)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation의 역할</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 왜 attestation이 필수인가

// 시나리오 없이 attestation
// 1. 사용자가 cloud 서비스에 민감 데이터 전송
// 2. 서비스는 "TEE에서 안전하게 처리"라고 주장
// 3. 사용자: "정말? 증명해봐"
// 4. 서비스: "그냥 믿어"
// → 불신의 고리 끊을 수 없음

// Attestation 있을 때
// 1. 사용자가 서비스에 challenge 전송 (nonce)
// 2. 서비스 TEE가 attestation report 생성
//    - 포함: code measurement, nonce, platform info
// 3. TEE가 HW 서명 (CPU vendor root 체인)
// 4. 사용자가 report 검증
//    - CPU vendor 인증서 체인 확인
//    - Measurement가 예상값인지 확인
//    - Nonce 일치 확인
// 5. 검증 성공 → 데이터 전송 OK

// 이제 신뢰가 수학적 기반 위에서 수립
// CPU vendor만 신뢰하면 됨 (sw 전체 신뢰 불필요)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 필수 구성 요소</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">요소</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
                <th className="border border-border px-3 py-2 text-left">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Code Measurement</td>
                <td className="border border-border px-3 py-2">실행 중인 코드 identity</td>
                <td className="border border-border px-3 py-2">MRENCLAVE, MRTD, RIM</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Platform Info</td>
                <td className="border border-border px-3 py-2">CPU·펌웨어 상태</td>
                <td className="border border-border px-3 py-2">CPUSVN, TCB version</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Nonce (Challenge)</td>
                <td className="border border-border px-3 py-2">Replay 공격 방어</td>
                <td className="border border-border px-3 py-2">REPORTDATA, user_data</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">HW 서명</td>
                <td className="border border-border px-3 py-2">Report 무결성</td>
                <td className="border border-border px-3 py-2">ECDSA P-256/384</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cert Chain</td>
                <td className="border border-border px-3 py-2">신뢰 체인</td>
                <td className="border border-border px-3 py-2">PCK, VCEK, IAK</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 표준들</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 주요 attestation 표준

// Intel
// - EPID (2015~2020 SGX) → deprecated
// - DCAP (2019~) — ECDSA 기반, 분산 검증
// - TDX DCAP — DCAP 확장

// AMD
// - SEV Reports (2016~)
// - SNP Attestation (2021~) — VCEK 인증

// ARM
// - CCA Token (2023~) — CBOR/COSE/EAT
// - PSA Attestation Token (2019~) — IoT용

// IETF 표준
// - RATS (Remote Attestation Procedures)
// - EAT (Entity Attestation Token)
// - RFC 9334: RATS Architecture
// - draft-ietf-rats-eat: EAT format

// TCG (Trusted Computing Group)
// - TPM Quote (2003~)
// - DICE (Device Identifier Composition Engine)

// 추세
// - Vendor-specific → 표준 (EAT)
// - 중앙집중 → 분산 verifier (Veraison)
// - Cloud-specific → cross-platform`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 사용 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 전형적 confidential computing 플로우

// Step 1: 사용자가 TEE 앱에 연결 (TLS)
//         └─> TLS가 그 자체로 충분한 인증 제공?
//             NO - 상대방이 진짜 TEE인지 모름

// Step 2: TEE에 challenge 전송 (nonce)
user → TEE: random_nonce (32B)

// Step 3: TEE가 report 생성
//         - measurement 포함
//         - nonce 포함 (replay 방어)
//         - 이 TEE가 가진 key의 공개키 포함 (binding)

// Step 4: TEE가 HW에 서명 요청
//         ECDSA(sk_hw, hash(report))

// Step 5: TEE → user: (report, signature, cert_chain)

// Step 6: User 측 검증
// 6a. cert_chain 검증 (up to Intel/AMD/ARM root CA)
// 6b. signature 검증 (cert 공개키로)
// 6c. measurement 확인 (expected 값과 비교)
// 6d. nonce 확인 (내가 보낸 값인가)
// 6e. TCB 확인 (최신 패치 적용됐나)

// Step 7: 검증 성공 → 세션 키 교환 & 데이터 전송
//         검증 실패 → 연결 거부

// 결과: TEE 신뢰 수립 + 보안 채널`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Attestation vs Certificate</p>
          <p>
            <strong>일반 X.509 인증서</strong>:<br />
            - CA가 pre-signed<br />
            - "이 도메인은 이 회사 소유" 증명<br />
            - 코드 실행 환경에 대한 보장 없음
          </p>
          <p className="mt-2">
            <strong>TEE Attestation</strong>:<br />
            - TEE가 실시간 생성<br />
            - "이 코드가 지금 TEE에서 실행 중" 증명<br />
            - 매 세션/요청마다 fresh
          </p>
          <p className="mt-2">
            <strong>결합</strong>:<br />
            - <strong>RA-TLS</strong>: TLS cert에 attestation 내장<br />
            - X.509 extension에 SGX Quote 추가<br />
            - 기존 TLS 인프라 그대로 + attestation 검증 추가<br />
            - → 기존 HTTPS 클라이언트 소량 수정으로 적용 가능
          </p>
        </div>

      </div>
    </section>
  );
}
