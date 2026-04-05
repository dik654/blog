import AttestChainViz from './viz/AttestChainViz';
import RemoteAttestStepViz from './viz/RemoteAttestStepViz';

export default function RemoteAttestation() {
  return (
    <section id="remote-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">원격 증명 핵심 질문</h3>
        <p>
          <strong>원격 증명</strong>(Remote Attestation): TEE 내부 코드의 무결성을 원격 검증<br />
          <strong>핵심 질문</strong>: "서버에서 내가 의도한 코드가 변조 없이 실행 중인가?"<br />
          <strong>답변</strong>: 암호학적 증명 — HW 서명 + 측정값 + 인증서 체인<br />
          → <a href="/tee/tee-attestation" className="text-indigo-400 hover:underline">원격 증명 심층 분석 참조</a>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">증명 체인 계층</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 계층적 신뢰 전파

// Layer 1: Hardware Root
// - CPU manufacturer (Intel, AMD, Arm)
// - eFuse 저장 root key
// - 불변, 변조 불가
// - Trust anchor (의심할 수 없는 기준점)

// Layer 2: Platform Certificates
// - Intel PCK / AMD VCEK / ARM IAK
// - CPU 고유 certificate
// - Manufacturer가 서명
// - 제조 시점 HW 상태 증명

// Layer 3: Attestation Key
// - 런타임 생성
// - PCK로 서명 (증명)
// - 일회용 또는 수명 제한

// Layer 4: Report Signature
// - 실행 중 TEE가 생성
// - Measurement, nonce, platform info 포함
// - AK로 서명

// Layer 5: Application Data
// - TEE가 처리하는 실제 데이터
// - 세션 키로 암호화
// - 증명된 채널로 전송

// 각 레이어가 하위 레이어 보증
// One chain of trust
// 어떤 레이어 깨지면 전체 무효`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">벤더별 Attestation 체인</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">벤더</th>
                <th className="border border-border px-3 py-2 text-left">체인</th>
                <th className="border border-border px-3 py-2 text-left">형식</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Intel SGX (DCAP)</td>
                <td className="border border-border px-3 py-2">Intel Root → Platform CA → PCK → AK → Quote</td>
                <td className="border border-border px-3 py-2">Binary struct + ECDSA P-256</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Intel TDX</td>
                <td className="border border-border px-3 py-2">Intel Root → PCK → AK → TD Quote</td>
                <td className="border border-border px-3 py-2">Binary struct + ECDSA</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">AMD SEV-SNP</td>
                <td className="border border-border px-3 py-2">AMD Root → ARK → ASK → VCEK → Report</td>
                <td className="border border-border px-3 py-2">Binary report + ECDSA P-384</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ARM CCA</td>
                <td className="border border-border px-3 py-2">SiP CA → IAK → RAK → CCA Token</td>
                <td className="border border-border px-3 py-2">CBOR/COSE/EAT</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">TPM 2.0</td>
                <td className="border border-border px-3 py-2">TPM EK → AIK → Quote</td>
                <td className="border border-border px-3 py-2">TPM2_Quote structure</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">전형적인 검증 플로우</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Client ↔ TEE Server Remote Attestation

// 1) Client가 TEE에 연결 시도
Client → Server: "Hello, need attestation"

// 2) Client가 challenge 전송 (replay 방어)
Client generates nonce = random(32 bytes)
Client → Server: nonce

// 3) TEE가 자신의 report 생성
report = {
    measurement: MRENCLAVE,      // 코드 해시
    nonce: client_nonce,          // challenge 포함
    platform: {
        tcb_version: ...,
        attributes: ...,
    },
    user_data: hash(session_pubkey),  // 키 바인딩
};

// 4) TEE가 report에 서명 (via attestation key)
signature = ECDSA_sign(report, attestation_key);

// 5) TEE → Client: (report, signature, cert_chain)

// 6) Client 측 검증
// 6a. Cert chain 검증 (up to manufacturer root)
assert verify_chain(cert_chain, root_ca) == valid;

// 6b. Signature 검증
assert ECDSA_verify(signature, report, cert_chain[0].pubkey) == valid;

// 6c. Measurement 매칭 (예상값과 비교)
assert report.measurement in allowed_measurements;

// 6d. Nonce 확인
assert report.nonce == client_nonce;

// 6e. TCB 버전 최소 요건
assert report.platform.tcb_version >= MIN_TCB;

// 6f. user_data 확인 (세션 키 바인딩)
assert report.user_data == hash(server_session_pubkey);

// 7) All checks passed → trust 수립
// 8) TLS handshake with server_session_pubkey
// 9) Send sensitive data`}</pre>

      </div>
      <div className="not-prose mt-6">
        <RemoteAttestStepViz />
      </div>
      <div className="not-prose mt-8">
        <AttestChainViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 정책</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Client-side policy enforcement

class AttestationPolicy:
    # 허용된 MRENCLAVE (또는 MRSIGNER)
    allowed_measurements: Set[bytes]

    # 최소 TCB 버전
    min_tcb_version: TcbVersion

    # Debug enclave 거부
    reject_debug: bool = True

    # Attributes 요구사항
    required_attributes: dict

    # 인증서 만료 허용 범위
    cert_validity_days: int = 90

    def verify(self, report):
        if report.mrenclave not in self.allowed_measurements:
            return "unknown_enclave"

        if report.tcb_version < self.min_tcb_version:
            return "outdated_tcb"

        if report.attributes.debug and self.reject_debug:
            return "debug_not_allowed"

        for key, value in self.required_attributes.items():
            if report.attributes.get(key) != value:
                return f"attribute_mismatch_{key}"

        return "ok"

# 정책 업데이트
# - 새 enclave 버전 배포 시 MRENCLAVE 추가
# - CVE 발견 시 MIN_TCB 증가
# - 공격 탐지 시 emergency revocation`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Attestation의 실전적 함정</p>
          <p>
            <strong>흔한 실수</strong>:<br />
            ✗ Nonce 없이 report 받기 (replay 가능)<br />
            ✗ Cert chain 검증 생략<br />
            ✗ MRENCLAVE hardcoding (업데이트 불가)<br />
            ✗ TCB version 체크 skipping<br />
            ✗ user_data binding 없이 세션 키 사용
          </p>
          <p className="mt-2">
            <strong>Best practices</strong>:<br />
            ✓ Nonce 매번 새로 생성<br />
            ✓ MRSIGNER + SVN으로 업그레이드 허용<br />
            ✓ TCB policy 명시적으로<br />
            ✓ user_data에 세션 키 해시 binding<br />
            ✓ 정책은 audit-loggable 형태로 저장
          </p>
          <p className="mt-2">
            <strong>프레임워크 활용</strong>:<br />
            - Intel SGX SDK Quote Verification Library<br />
            - Veraison (open-source verifier)<br />
            - Keylime (TPM-based attestation)<br />
            - Azure Attestation Service<br />
            → 직접 구현보다 검증된 라이브러리 사용
          </p>
        </div>

      </div>
    </section>
  );
}
