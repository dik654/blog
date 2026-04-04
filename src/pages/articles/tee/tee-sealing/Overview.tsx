export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">봉인이 필요한 이유</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TEE(신뢰 실행 환경) 내부에서 생성된 비밀 — 개인키, 설정값, 세션 토큰 — 은
          재부팅 후에도 유지되어야 합니다.
        </p>
        <p>
          그런데 TEE 메모리는 <strong>휘발성</strong>입니다.<br />
          전원이 차단되면 EPC(Enclave Page Cache) 내용은 즉시 소멸합니다.
        </p>
        <p>
          해결책: CPU 고유 키로 비밀을 <strong>암호화(봉인)</strong>한 뒤 디스크에 저장합니다.
          <br />
          재부팅 후 동일 CPU의 동일 enclave에서만 <strong>복호화(개봉)</strong>할 수 있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 원칙</h3>
        <ul>
          <li><strong>CPU 바운드</strong> — Seal Key는 CPU 칩에 물리적으로 내장된 Root Key에서 파생됩니다. 다른 CPU에서는 같은 키를 얻을 수 없습니다.</li>
          <li><strong>코드 바운드</strong> — 키 파생에 enclave 측정값(MRENCLAVE 또는 MRSIGNER)이 포함됩니다. 다른 코드에서는 같은 키를 얻을 수 없습니다.</li>
          <li><strong>무결성 보장</strong> — AES-GCM의 MAC 태그로 변조를 탐지합니다. 1비트라도 수정되면 개봉이 거부됩니다.</li>
        </ul>
      </div>
    </section>
  );
}
