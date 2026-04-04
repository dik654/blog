export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐색이란? — 왜 반복적인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia 탐색 = 특정 Node ID에 가장 가까운 k개 노드를 네트워크에서 찾는 과정.
          <br />
          재귀(recursive)가 아닌 <strong>반복(iterative)</strong> 방식: 질의자가 직접 각 홉을 실행한다.
        </p>
        <p>
          재귀 방식(A→B→C→D)은 중간 노드가 응답을 릴레이해야 하므로
          하나가 죽으면 전체 체인이 끊긴다. 반복 방식은 질의자가 모든 응답을 직접 수집하므로
          개별 노드 장애에 강건하다.
        </p>
        <p>
          go-ethereum의 <code>lookup.go</code>는 이 반복 탐색을 <strong>α=3 동시 질의</strong> +
          <strong>가장 가까운 k=16개 유지</strong>로 구현한다.
        </p>
      </div>
    </section>
  );
}
