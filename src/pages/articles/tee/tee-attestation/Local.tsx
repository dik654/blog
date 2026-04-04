export default function Local() {
  return (
    <section id="local" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">로컬 증명 (EREPORT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          같은 플랫폼(CPU) 내에서 Enclave 간 신뢰를 검증합니다.<br />
          EREPORT 명령어가 CPU 내부 키로 MAC(메시지 인증 코드)을 생성합니다.
        </p>

        <h3>동작 흐름</h3>
        <ol>
          <li>Enclave A가 EREPORT(대상=Enclave B)를 생성합니다.</li>
          <li>CPU가 Report Key로 MAC을 계산합니다.</li>
          <li>Enclave B가 EGETKEY로 같은 Report Key를 얻어 MAC을 검증합니다.</li>
        </ol>

        <h3>제약사항</h3>
        <p>
          Report Key는 CPU 외부로 내보낼 수 없습니다.<br />
          따라서 로컬 증명은 같은 물리 머신에서만 동작합니다.
        </p>
      </div>
    </section>
  );
}
