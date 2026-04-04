export default function IasDcap() {
  return (
    <section id="ias-dcap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IAS vs DCAP 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>IAS (Intel Attestation Service)</h3>
        <ul>
          <li><strong>서명</strong> — EPID 그룹 서명 (프라이버시 보호)</li>
          <li><strong>검증</strong> — Intel 서버에 요청 필수 (온라인 의존)</li>
          <li><strong>장점</strong> — 설정 간단, 플랫폼 익명성 보장</li>
          <li><strong>단점</strong> — Intel 서버 장애 시 검증 불가</li>
        </ul>

        <h3>DCAP (Data Center Attestation Primitives)</h3>
        <ul>
          <li><strong>서명</strong> — ECDSA (P-256)</li>
          <li><strong>검증</strong> — 로컬에서 PCK 인증서 체인 검증 (오프라인 가능)</li>
          <li><strong>장점</strong> — Intel 서버 의존 제거, 에어갭 환경 지원</li>
          <li><strong>단점</strong> — PCK 인증서 캐시 인프라 필요</li>
        </ul>

        <p>
          클라우드 환경에서는 DCAP이 표준입니다.<br />
          Azure, GCP 모두 DCAP 기반 증명을 지원합니다.
        </p>
      </div>
    </section>
  );
}
