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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Recursive Lookup (DNS 방식)
// Q = Querier, T = Target
//
// Q → A: "find T"
// A → B: "find T" (relay)
// B → C: "find T"
// C → D: found!
// D → C: here it is
// C → B: relay
// B → A: relay
// A → Q: response
//
// 문제
// ✗ 중간 노드 장애 시 전체 chain 끊김
// ✗ 중간 노드가 결과 조작 가능
// ✗ Progress tracking 어려움
// ✗ Timeout handling 복잡

// Iterative Lookup (Kademlia 방식)
// Q = Querier, A/B/C = intermediate nodes
//
// Q → A: "who do you know near T?"
// A → Q: "B, X, Y"
// Q → B: "who do you know near T?"
// B → Q: "C, Z"
// Q → C: "who do you know near T?"
// C → Q: "D"
// Q → D: "who are you?"
// D → Q: response (found!)

// 장점
// ✓ Querier가 전체 flow 통제
// ✓ 중간 노드 장애에 강건
// ✓ Progress 항상 visible
// ✓ Easier to implement`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Kademlia Lookup 파라미터</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Standard Kademlia parameters

// k (bucket size) = 16 or 20
// - How many nodes per distance bucket
// - Redundancy factor
// - Ethereum: k = 16

// α (concurrency) = 3
// - Simultaneous parallel queries
// - Pipeline lookups for speed
// - Resilient to slow/dead peers

// TTL (routing table refresh) = 1 hour
// - Periodic bucket refresh
// - Keep routing table fresh
// - Evict stale entries

// Query timeout = 500ms ~ 2s
// - Too short: miss slow peers
// - Too long: slow lookups

// Ethereum specific
// - 256-bit node IDs (keccak256 of pubkey)
// - UDP-based queries
// - Max 1280 byte packets

// 성능 예상
// - Network size: 10,000 nodes
// - log2(10000) ≈ 13 hops max
// - 평균 lookup latency: 200-500ms
// - α=3 parallel: faster but more bandwidth`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 Lookup 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Iterative lookup algorithm (pseudocode)

def lookup(target_id, k=16, alpha=3):
    # Initialize with closest known nodes
    shortlist = routing_table.closest_k(target_id)
    closest = shortlist[0]
    queried = set()
    waiting = set()

    while True:
        # Find α unqueried nodes from shortlist
        candidates = [n for n in shortlist[:k]
                     if n not in queried and n not in waiting][:alpha]

        if not candidates and not waiting:
            break  # no more to query

        # Send parallel queries
        for node in candidates:
            send_findnode(node, target_id)
            waiting.add(node)

        # Wait for any response
        response = wait_for_response(timeout=500ms)
        if not response:
            continue

        waiting.remove(response.from)
        queried.add(response.from)

        # Add new nodes to shortlist
        for new_node in response.nodes:
            if new_node not in queried and new_node not in shortlist:
                shortlist.insert_sorted(new_node, key=distance_to_target)

        # Check if we found closer node
        new_closest = shortlist[0]
        if distance(new_closest, target) >= distance(closest, target):
            # No progress, but continue until all k queried
            if len(queried) >= k:
                break
        else:
            closest = new_closest

    return shortlist[:k]`}</pre>

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
