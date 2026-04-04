export default function Isolation() {
  return (
    <section id="isolation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 격리 & 암호화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TEE의 핵심 메커니즘: 메모리 컨트롤러가 실시간으로 암호화/복호화합니다.<br />
          CPU 캐시에서는 평문, DRAM에서는 암호문으로 저장됩니다.
        </p>

        <h3>격리 방식</h3>
        <ul>
          <li><strong>SGX EPC</strong> — Enclave Page Cache. 전용 물리 메모리 영역</li>
          <li><strong>SEV SME/TME</strong> — 메모리 컨트롤러의 AES 엔진이 페이지별 암호화</li>
          <li><strong>TDX MKTME</strong> — Multi-Key TME. VM별 다른 키 사용</li>
        </ul>

        <h3>접근 제어</h3>
        <p>
          CPU가 하드웨어 수준에서 메모리 접근 권한을 검사합니다.<br />
          TEE 외부 코드가 TEE 메모리에 접근하면 암호화된 쓰레기 값만 읽힙니다.
        </p>
      </div>
    </section>
  );
}
