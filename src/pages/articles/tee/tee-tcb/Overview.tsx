export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TCB란 무엇인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>TCB(Trusted Computing Base)</strong> — 시스템 보안을 책임지는 <strong>모든 하드웨어와 소프트웨어의 합</strong><br />
          OS 커널, 펌웨어, 하이퍼바이저, 드라이버 등 권한이 있는 모든 코드가 포함됩니다
        </p>
        <p>
          TCB에 포함된 코드의 버그 = <strong>전체 보안 붕괴</strong><br />
          TCB가 1,000만 줄이면 통계적으로 수천 개의 버그가 잠재합니다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">TEE의 핵심 원칙: TCB 최소화</h3>
        <p>
          TEE(Trusted Execution Environment)는 <strong>TCB를 극단적으로 줄여</strong> 공격 표면을 최소화합니다<br />
          OS와 하이퍼바이저를 TCB에서 <strong>제외</strong>하는 것이 핵심 설계 철학입니다
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">구분</th>
                <th className="border border-border px-4 py-2 text-left">일반 시스템</th>
                <th className="border border-border px-4 py-2 text-left">TEE 시스템</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">TCB 크기</td>
                <td className="border border-border px-4 py-2">수천만 줄 (OS 전체)</td>
                <td className="border border-border px-4 py-2">수만 줄 (Enclave 코드만)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">OS 침해 시</td>
                <td className="border border-border px-4 py-2">모든 데이터 노출</td>
                <td className="border border-border px-4 py-2">TEE 내부 데이터 보호</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">검증 가능성</td>
                <td className="border border-border px-4 py-2">사실상 불가능</td>
                <td className="border border-border px-4 py-2">정형 검증 가능 범위</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
