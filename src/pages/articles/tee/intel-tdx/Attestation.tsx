export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TDX 원격 증명 & Quote</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TDX는 DCAP 기반 원격 증명을 사용합니다.<br />
          TD 내부에서 TDG.MR.REPORT로 리포트를 생성하고, QE(Quoting Enclave)가 Quote로 변환합니다.
        </p>

        <h3>TDX Quote 구성</h3>
        <ul>
          <li><strong>MRTD</strong> — TD 초기 측정값 (코드 + 설정 해시)</li>
          <li><strong>RTMR</strong> — Runtime Measurement Registers (동적 측정)</li>
          <li><strong>REPORTDATA</strong> — 사용자 정의 데이터 (64바이트)</li>
          <li><strong>TEE_TCB_SVN</strong> — TD Module 보안 버전 번호</li>
        </ul>

        <h3>검증 흐름</h3>
        <p>
          1. TD가 TDG.MR.REPORT로 TDREPORT 생성합니다.<br />
          2. QE가 TDREPORT를 ECDSA 서명하여 TDX Quote 생성합니다.<br />
          3. 검증자가 PCK 인증서 체인으로 Quote 서명을 검증합니다.
        </p>
      </div>
    </section>
  );
}
