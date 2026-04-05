import CodePanel from '@/components/ui/code-panel';
import KadLookupViz from './viz/KadLookupViz';
import KadIterativeLookupViz from './viz/KadIterativeLookupViz';
import { findNodeCode, findValueCode, rpcMessages } from './LookupData';

export default function Lookup({ title }: { title?: string }) {
  return (
    <section id="lookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '노드 조회 & 값 저장/조회'}</h2>
      <div className="not-prose mb-8"><KadLookupViz /></div>
      <div className="not-prose mb-8"><KadIterativeLookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia의 핵심 동작은 <strong>반복적 노드 조회(iterative FIND_NODE)</strong>입니다.<br />
          목표 ID에 가장 가까운 노드를 찾을 때까지 반복적으로 가까운 노드들에게 질의합니다.
        </p>

        <h3>FIND_NODE (반복적 조회)</h3>
        <CodePanel title="FIND_NODE 반복적 조회" code={findNodeCode} annotations={[
          { lines: [1, 3], color: 'sky', note: 'alpha=3 동시 질의, K=20 반환' },
          { lines: [20, 21], color: 'emerald', note: 'alpha개 동시 RPC 전송' },
          { lines: [40, 43], color: 'amber', note: '수렴 체크 — 더 가까운 노드 없으면 종료' },
        ]} />

        <h3>FIND_VALUE (값 조회)</h3>
        <p>
          FIND_VALUE는 FIND_NODE와 동일하지만, 질의 노드가 해당 키를 알고 있으면
          즉시 값을 반환합니다.
        </p>
        <CodePanel title="FIND_VALUE & STORE" code={findValueCode} annotations={[
          { lines: [4, 8], color: 'sky', note: 'Value 응답 시 즉시 반환' },
          { lines: [13, 18], color: 'emerald', note: 'STORE — 가장 가까운 k개에 저장' },
        ]} />

        <h3>RPC 메시지 유형</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          {rpcMessages.map(({ name, desc }) => (
            <div key={name} className="rounded-lg border border-border p-3">
              <p className="font-mono text-xs font-bold text-primary">{name}</p>
              <p className="text-xs text-foreground/70 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <h3>수렴 보장</h3>
        <p>
          각 반복에서 새 노드가 발견되거나, 더 가까운 노드가 없으면 종료됩니다.<br />
          네트워크가 연결되어 있다면 <code>O(log N)</code> 홉으로
          가장 가까운 노드를 반드시 찾습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Iterative vs Recursive Lookup</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Iterative vs Recursive Lookup
//
// Iterative (Kademlia 선택):
//
//   Initiator가 모든 hop 직접 관리
//
//   A → FIND(target) → B
//   B → "여기 k개" → A
//   A → FIND(target) → C (from B's list)
//   C → "여기 k개" → A
//   ... 반복
//
//   장점:
//   ✓ NAT 뒤 노드 지원 (모든 응답이 A에게)
//   ✓ Parallel queries 쉬움
//   ✓ Failure handling 명확
//   ✓ Initiator가 전체 제어
//
//   단점:
//   - Bandwidth: initiator 집중
//   - Round trip: 각 hop마다 왕복

// Recursive (Chord 등):
//
//   Query를 노드 간에 전달
//
//   A → FIND(target) → B
//   B → FIND(target) → C (forward)
//   C → FIND(target) → D (forward)
//   D → "found" → A (directly back)
//
//   장점:
//   ✓ 적은 hop (forwarding)
//   ✓ 총 messages 적음
//
//   단점:
//   - NAT 문제
//   - 중간 노드 failure handling 어려움
//   - Parallel 처리 복잡

// Kademlia가 iterative 선택 이유:
//   - P2P 네트워크: NAT 뒤 노드 많음
//   - 병렬 조회 간단
//   - Robustness 우선

// 수렴 조건:
//
// 1. 더 가까운 노드 없음
//    k개 candidates 중
//    α개 각각 query 후
//    새로 들어온 노드 모두 더 멈
//    → 종료
//
// 2. K개 모두 응답
//    Top-k 노드가 모두 응답 완료
//    → 종료
//
// 3. Timeout
//    Maximum iterations
//    Safety net

// Latency 계산:
//   각 iteration: ~100-500ms (RTT)
//   Log N iterations: N=10^6 → 20 iterations
//   Typical: 2-10 seconds
//
//   대규모 DHT:
//     IPFS: ~5-30 seconds
//     Ethereum discv5: ~1-5 seconds
//     BitTorrent DHT: ~10-60 seconds`}
        </pre>
      </div>
    </section>
  );
}
