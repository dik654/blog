export default function TCB() {
  return (
    <section id="tcb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB (Trusted Computing Base)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TCB는 시스템 보안을 책임지는 모든 하드웨어/소프트웨어의 합입니다.<br />
          TCB가 작을수록 공격 표면(attack surface)이 줄어듭니다.
        </p>

        <h3>TCB 크기 비교</h3>
        <ul>
          <li><strong>SGX</strong> — TCB = CPU + Enclave 코드 (수 MB). OS 제외</li>
          <li><strong>TDX</strong> — TCB = CPU + VM 전체. 기존 OS 수정 없이 사용</li>
          <li><strong>SEV-SNP</strong> — TCB = CPU + 펌웨어. VM 메모리 무결성 보장</li>
        </ul>

        <h3>TCB 최소화 원칙</h3>
        <p>
          TCB에 포함된 코드의 버그 = 전체 보안 붕괴입니다.<br />
          따라서 TEE 설계의 핵심은 TCB를 최소화하는 것입니다.
        </p>
      </div>
    </section>
  );
}
