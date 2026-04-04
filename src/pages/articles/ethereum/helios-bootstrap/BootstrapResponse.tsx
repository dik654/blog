import BootRespViz from './viz/BootRespViz';

export default function BootstrapResponse({ title }: { title: string }) {
  return (
    <section id="bootstrap-response" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Bootstrap 응답은 3개 필드로 구성된다.
          <br />
          header, current_sync_committee, current_sync_committee_branch.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 블록 본문(body)을 전부 받는다.
          <br />
          Helios는 헤더 + 위원회 + Merkle 증명만 받는다. 데이터 크기가 수천 배 작다.
        </p>
      </div>
      <div className="not-prose"><BootRespViz /></div>
    </section>
  );
}
