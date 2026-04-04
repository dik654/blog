export default function Attestation() {
  return (
    <section id="attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CCA 증명 토큰</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CCA Attestation Token은 Realm 측정값과 플랫폼 증명을 결합합니다.<br />
          PSA(Platform Security Architecture) 기반으로 표준화되어 있습니다.
        </p>

        <h3>토큰 구조</h3>
        <ul>
          <li><strong>Realm Token</strong> — RIM(Realm Initial Measurement) + REM(Runtime Extensible Measurement)</li>
          <li><strong>Platform Token</strong> — 하드웨어 루트키로 서명된 플랫폼 정보</li>
          <li><strong>포맷</strong> — CBOR(Concise Binary Object Representation) + COSE 서명</li>
        </ul>

        <h3>검증 흐름</h3>
        <p>
          1. Realm이 RMM에 증명 요청을 보냅니다.<br />
          2. RMM이 Realm Token을 생성하고, 플랫폼이 Platform Token을 추가합니다.<br />
          3. 검증자가 COSE 서명 체인을 검증합니다.
        </p>
      </div>
    </section>
  );
}
