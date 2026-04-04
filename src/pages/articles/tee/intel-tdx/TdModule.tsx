export default function TdModule() {
  return (
    <section id="td-module" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TD Module & SEAM</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SEAM(Secure Arbitration Mode)은 하이퍼바이저보다 높은 권한 레벨입니다.<br />
          TD Module이 SEAM 모드에서 실행되어 VM 진입/탈출을 중재합니다.
        </p>

        <h3>권한 구조</h3>
        <ul>
          <li><strong>SEAM Root</strong> — Intel이 서명한 P-SEAMLDR (로더)</li>
          <li><strong>SEAM Module</strong> — TD Module. TD 생성, 메모리 매핑, 증명 처리</li>
          <li><strong>VMX Root</strong> — 하이퍼바이저. TD 메모리 직접 접근 불가</li>
          <li><strong>VMX Non-Root</strong> — Trust Domain (게스트 VM)</li>
        </ul>

        <h3>TD 진입/탈출</h3>
        <p>
          TDG.VP.ENTER로 TD에 진입합니다.<br />
          TD에서 나올 때(TD Exit) TD Module이 하이퍼바이저에 전달할 정보를 필터링합니다.<br />
          하이퍼바이저는 TD 레지스터/메모리를 직접 볼 수 없습니다.
        </p>
      </div>
    </section>
  );
}
