import ErrorViz from './viz/ErrorViz';

export default function ErrorCases({ title }: { title: string }) {
  return (
    <section id="error-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          부트스트랩은 3가지 지점에서 실패할 수 있다.
          <br />
          체크포인트 만료, 네트워크 불일치, Merkle 브랜치 무효.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 피어 연결 실패만 에러다.
          <br />
          Helios는 신뢰 검증 실패가 더 위험하다 — 가짜 체인을 따라갈 수 있기 때문.
        </p>
      </div>
      <div className="not-prose"><ErrorViz /></div>
    </section>
  );
}
