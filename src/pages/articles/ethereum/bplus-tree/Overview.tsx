import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">B+tree가 왜 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          데이터베이스는 수억 개의 레코드를 디스크에 저장하고, 빠르게 검색해야 한다.<br />
          배열은 삽입이 느리고, 해시 테이블은 범위 검색이 불가능하다.<br />
          이진 탐색 트리(BST)는 노드마다 디스크 I/O가 발생해 실용적이지 않다.<br />
          B+tree는 한 노드에 수백 개의 키를 담아 디스크 접근 횟수를 극적으로 줄인다.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
