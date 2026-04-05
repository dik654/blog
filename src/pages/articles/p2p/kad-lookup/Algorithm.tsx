import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { LOOKUP_STRUCT_CODE, ADVANCE_CODE, START_QUERIES_CODE } from './AlgorithmData';
import { codeRefs } from './codeRefs';

export default function Algorithm({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">반복 탐색 알고리즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          go-ethereum의 <code>lookup</code> 구조체가 Kademlia iterative lookup을 구현한다.<br />
          핵심 상수 두 가지: <strong>alpha=3</strong> (동시 질의 수), <strong>bucketSize=16</strong> (최대 결과 수).
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">lookup 구조체</h3>
        <CodePanel title="lookup 구조체 — lookup.go" code={LOOKUP_STRUCT_CODE} annotations={[
          { lines: [6, 7], color: 'sky', note: 'asked/seen: 중복 방지 맵' },
          { lines: [8, 8], color: 'emerald', note: 'result: 거리순 정렬 리스트' },
          { lines: [10, 10], color: 'amber', note: 'queries: 동시 진행 고루틴 수' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">run → advance → startQueries 루프</h3>
        <p>
          <code>run()</code>은 <code>advance()</code>를 반복 호출한다.
          advance 내부에서 <code>startQueries()</code>가 alpha개까지 고루틴을 띄우고,
          <code>replyCh</code>로 응답을 수신한다.<br />
          새 노드가 발견되면 true를 반환하고, 모든 후보를 소진하면 false로 루프를 종료한다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('lookup-advance', codeRefs['lookup-advance'])} />
            <span className="text-[10px] text-muted-foreground self-center">advance()</span>
            <CodeViewButton onClick={() => onCodeRef('lookup-start-queries', codeRefs['lookup-start-queries'])} />
            <span className="text-[10px] text-muted-foreground self-center">startQueries()</span>
          </div>
        )}
        <CodePanel title="advance() — 응답 수신 루프" code={ADVANCE_CODE} annotations={[
          { lines: [3, 4], color: 'sky', note: 'replyCh에서 응답 수신' },
          { lines: [6, 8], color: 'emerald', note: '새 노드 발견 시 true 반환' },
          { lines: [14, 14], color: 'amber', note: '수렴 완료: false 반환' },
        ]} />
        <CodePanel title="startQueries() — alpha=3 동시 질의" code={START_QUERIES_CODE} annotations={[
          { lines: [6, 6], color: 'sky', note: 'result.entries 순회 + alpha 제한' },
          { lines: [9, 11], color: 'emerald', note: '미질의 노드에 고루틴 발사' },
          { lines: [14, 14], color: 'amber', note: '진행 중 질의 유무로 계속 여부 결정' },
        ]} />
        <p>
          수렴 조건: result.entries의 모든 노드에 이미 질의했고(<code>asked</code> 맵),
          진행 중인 고루틴도 0개이면 탐색이 종료된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Kademlia Iterative Lookup 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Kademlia Lookup Algorithm (Maymounkov & Mazières 2002)
//
// 목표: target ID에 가장 가까운 k개 노드 찾기
//
// 기본 개념:
//   - XOR distance metric
//   - k-buckets (보통 k=16 or k=20)
//   - Parallel queries (α=3)
//
// Algorithm:
//
// Input: target ID
// State:
//   shortlist = k closest nodes from local table
//   asked = {}
//   seen = all nodes in shortlist
//
// Loop:
//   1. From shortlist, pick α unasked nodes
//   2. Send FIND_NODE(target) to each in parallel
//   3. Each response: k nodes claiming to be close
//   4. Update shortlist with new closer nodes
//   5. If no new closer nodes found → terminate
//   6. Else → repeat
//
// Convergence:
//   - Each round halves distance on average
//   - O(log n) rounds to reach target
//   - n = total nodes in DHT

// Complexity:
//   Time: O(log n) rounds
//   Messages: O(k · log n)
//   Typical: 20 rounds for 10^6 nodes

// Ethereum's implementation:
//   - α = 3 (concurrency)
//   - k = 16 (bucket size, "result" size)
//   - seedCount = 30 (initial DB seeds)
//   - maxFindnodeFailures = 5

// Parallelism trade-off:
//   Higher α:
//     + 더 빠른 수렴
//     - 더 많은 messages
//     - network 부하 증가
//
//   Lower α:
//     + 대역폭 효율
//     - 느린 lookup
//     - peer churn에 약함
//
// α=3이 경험적 sweet spot

// 실전 고려사항:
//   - Sybil attack 방어 (node ID 검증)
//   - Eclipse attack 방어 (diverse peers)
//   - DoS 방어 (query rate limit)
//   - Timeout 관리 (slow nodes)

// Ethereum discv4/v5 적용:
//   - Node discovery (이웃 찾기)
//   - Peer advertisement
//   - Network bootstrap`}
        </pre>
      </div>
    </section>
  );
}
