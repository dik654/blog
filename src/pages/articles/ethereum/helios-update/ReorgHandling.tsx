export default function ReorgHandling({ title }: { title: string }) {
  return (
    <section id="reorg-handling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          optimistic 헤더는 finalized가 아니므로 reorg될 수 있다.
          <br />
          새 Update의 attested_header가 이전과 다른 브랜치면 교체된다.
        </p>
        <p className="leading-7">
          finalized 헤더는 reorg 불가능하다. 2/3 투표로 확정되었기 때문.
          <br />
          Helios는 finalized 기준으로만 상태 증명을 요청한다.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 reorg 시 블록을 언와인드(unwind)한다.
          <br />
          Helios는 헤더만 교체하면 되므로 reorg 비용이 0에 가깝다.
        </p>
      </div>
    </section>
  );
}
