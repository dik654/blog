import AttestChainViz from './viz/AttestChainViz';
import RemoteAttestStepViz from './viz/RemoteAttestStepViz';

export default function RemoteAttestation() {
  return (
    <section id="remote-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원격 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>원격 증명(Remote Attestation)</strong> — 원격 검증자가 TEE 내부 코드의 무결성을 확인하는 프로토콜<br />
          "이 서버에서 정말 내가 의도한 코드가 변조 없이 실행되고 있는가?"라는 질문에 답변<br />
          → <a href="/tee/tee-attestation" className="text-indigo-400 hover:underline">원격 증명 심층 분석 (로컬 → 원격 → DCAP)</a>
        </p>

        <h3>증명 체인 (Attestation Chain)</h3>
        <p>
          증명은 계층적 — 하드웨어 → 펌웨어 → 애플리케이션 순으로 신뢰가 전파<br />
          각 단계에서 이전 단계의 서명을 포함하여 연쇄 검증 가능
        </p>

        <h3>검증 프로세스</h3>
        <p>
          앱이 Report 생성 → Quoting Enclave가 Quote로 서명 → 검증 서비스에 전송<br />
          검증자는 제조사(Intel IAS, AMD KDS)의 인증서 체인으로 서명 유효성 확인
        </p>
      </div>
      <div className="not-prose mt-6">
        <RemoteAttestStepViz />
      </div>
      <div className="not-prose mt-8">
        <AttestChainViz />
      </div>
    </section>
  );
}
