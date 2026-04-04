import ContextViz from './viz/ContextViz';

export default function Overview({ title }: { title: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          풀 노드(Reth)는 모든 블록을 재실행해서 상태를 검증한다.
          <br />
          디스크 1TB, 동기화 수 시간 — 모바일이나 브라우저에서는 불가능하다.
        </p>
        <p className="leading-7">
          Helios는 <strong>블록 실행 없이</strong> 동일한 신뢰를 달성한다.
          <br />
          Sync Committee BLS 서명으로 헤더를 검증하고, Merkle 증명으로 상태를 검증한다.
        </p>
        <p className="leading-7">
          아래 8개 아티클에서 Helios의 모든 경로를 라인 단위로 추적한다.
          <br />
          각 섹션마다 Reth 풀 노드와의 차이를 비교한다.
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}
