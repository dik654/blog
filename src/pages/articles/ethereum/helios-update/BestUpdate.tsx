export default function BestUpdate({ title }: { title: string }) {
  return (
    <section id="best-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          같은 슬롯에 여러 Update가 도착할 수 있다.
          <br />
          참여자 수가 가장 많은 Update를 best로 선택한다.
        </p>
        <p className="leading-7">
          <code>best_valid_update</code>에 임시 저장 후, finalized 확정 시 적용한다.
          <br />
          참여자 수 = 보안 수준. 많을수록 더 신뢰할 수 있다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 fork choice rule(LMD-GHOST)로 최선 블록을 선택한다.
          <br />
          Helios는 참여자 수 기반으로 최선 Update를 선택한다 — 더 단순한 규칙.
        </p>
      </div>
    </section>
  );
}
