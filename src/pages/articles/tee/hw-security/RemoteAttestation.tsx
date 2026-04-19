import AttestChainViz from './viz/AttestChainViz';
import RemoteAttestStepViz from './viz/RemoteAttestStepViz';
import AttestLayersViz from './viz/AttestLayersViz';
import AttestFlowViz from './viz/AttestFlowViz';
import AttestPolicyViz from './viz/AttestPolicyViz';

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
      </div>
      <div className="not-prose my-6"><AttestLayersViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
      </div>
      <div className="not-prose my-6"><AttestFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mt-6">
        <RemoteAttestStepViz />
      </div>
      <div className="not-prose mt-8">
        <AttestChainViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Attestation 정책</h3>
      </div>
      <div className="not-prose my-6"><AttestPolicyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

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
