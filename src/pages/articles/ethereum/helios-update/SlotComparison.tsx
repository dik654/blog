export default function SlotComparison({ title }: { title: string }) {
  return (
    <section id="slot-comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          optimistic 헤더는 항상 finalized 헤더보다 최신이다.
          <br />
          <code>optimistic.slot &gt;= finalized.slot</code>이 불변 조건.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 safe/finalized/latest 3가지 블록 태그를 구분한다.
          <br />
          Helios도 동일한 구분 — optimistic이 latest, finalized가 finalized에 대응.
        </p>
      </div>
    </section>
  );
}
