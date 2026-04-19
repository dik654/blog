import RecVsIterFlowViz from './viz/RecVsIterFlowViz';
import LookupParamsViz from './viz/LookupParamsViz';
import LookupFlowViz from './viz/LookupFlowViz';

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

        <h3 className="text-xl font-semibold mt-8 mb-3">Recursive vs Iterative</h3>
        <div className="not-prose mb-4"><RecVsIterFlowViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kademlia Lookup 파라미터</h3>
        <div className="not-prose mb-4"><LookupParamsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 Lookup 흐름</h3>
        <div className="not-prose mb-4"><LookupFlowViz /></div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Kademlia의 O(log n)</p>
          <p>
            <strong>왜 logarithmic?</strong>:<br />
            - 각 FINDNODE 결과는 거리를 반으로 줄임 (평균)<br />
            - 거리 2^256 → 반복마다 1 bit씩 감소<br />
            - 최대 256 iterations, 실제로는 log2(N) 노드 수
          </p>
          <p className="mt-2">
            <strong>실제 성능</strong>:<br />
            - 10K 노드: ~13 hops<br />
            - 1M 노드: ~20 hops<br />
            - α=3 parallel: 4-5 rounds<br />
            - Latency: 200-500ms typical
          </p>
        </div>

      </div>
    </section>
  );
}
