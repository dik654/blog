import TotalOrderViz from './viz/TotalOrderViz';

export default function TotalOrder() {
  return (
    <section id="total-order" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">전체 순서 브로드캐스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SMR의 핵심 빌딩 블록 — 모든 복제본이 같은 순서로 메시지 수신.
        </p>
      </div>
      <div className="not-prose"><TotalOrderViz /></div>
    </section>
  );
}
