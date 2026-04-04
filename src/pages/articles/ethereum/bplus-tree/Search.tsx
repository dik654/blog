import SearchViz from './viz/SearchViz';

export default function Search() {
  return (
    <section id="search" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검색 과정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          검색은 root에서 시작해 leaf까지 내려가는 하향식 탐색이다.<br />
          각 노드에서 이진 탐색으로 적절한 자식 포인터를 선택한다.<br />
          범위 검색 시에는 시작 키의 leaf를 찾은 뒤, 연결 리스트를 따라 순차 탐색한다.<br />
          시간 복잡도는 O(log_m n)으로, m=100이면 1억 레코드도 높이 4로 충분하다.
        </p>
      </div>
      <div className="not-prose"><SearchViz /></div>
    </section>
  );
}
