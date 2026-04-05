import CodePanel from '@/components/ui/code-panel';
import KadRPCViz from './viz/KadRPCViz';
import { rpcItems, iterativeFindCode, storeGetCode, maintenanceCode } from './AlgorithmsData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Algorithms({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="algorithms" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '핵심 알고리즘'}</h2>
      <div className="not-prose mb-8"><KadRPCViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia의 모든 동작은 4개의 RPC와 1개의 반복 조회 알고리즘으로 구성됩니다.
        </p>

        <h3>4가지 RPC</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {rpcItems.map(rpc => (
            <div key={rpc.name} className="rounded-lg border border-border/60 p-3">
              <p className="font-mono font-bold text-sm text-indigo-400">{rpc.name}</p>
              <p className="text-sm mt-1 text-foreground/80">{rpc.desc}</p>
            </div>
          ))}
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-lookup-struct', codeRefs['geth-lookup-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">lookup.go — 반복 조회</span>
            <CodeViewButton onClick={() => onCodeRef('geth-lookup-advance', codeRefs['geth-lookup-advance'])} />
            <span className="text-[10px] text-muted-foreground self-center">advance()</span>
          </div>
        )}

        <h3>반복 노드 조회 (Iterative FIND_NODE)</h3>
        <p>
          단순 재귀 조회 대신 <strong>반복적(iterative)</strong> 방식을 사용합니다.<br />
          조회자가 직접 각 홉을 실행해 네트워크 연결성 문제를 회피합니다.
        </p>
        <CodePanel title="반복적 FIND_NODE 알고리즘" code={iterativeFindCode} annotations={[
          { lines: [1, 2], color: 'sky', note: 'alpha=3 동시 질의, K=20 목표 노드 수' },
          { lines: [18, 19], color: 'emerald', note: 'alpha개 동시 RPC 전송' },
          { lines: [33, 35], color: 'amber', note: '수렴 체크 — 최근접 노드 불변 시 종료' },
        ]} />

        <h3>값 저장 및 조회</h3>
        <CodePanel title="값 저장 & 조회" code={storeGetCode} annotations={[
          { lines: [1, 4], color: 'sky', note: 'STORE — 가장 가까운 k개에 저장' },
          { lines: [6, 10], color: 'emerald', note: 'GET — FIND_VALUE로 반복 조회' },
        ]} />

        <h3>주기적 유지 보수</h3>
        <CodePanel title="주기적 유지보수" code={maintenanceCode} annotations={[
          { lines: [3, 7], color: 'sky', note: '1시간마다 버킷 새로고침' },
          { lines: [9, 12], color: 'emerald', note: '저장 값 재발행 — 만료 방지' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Kademlia 4 RPC 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Kademlia 4 RPC 프로토콜
//
// 1. PING
//    "노드 살아있는지 확인"
//    용도:
//      - Liveness check (버킷 유지)
//      - NAT keep-alive
//      - Bootstrap 확인
//    응답: PONG (보낸 노드 + 자기 ID)
//
// 2. STORE (key, value)
//    "이 값을 저장해줘"
//    용도:
//      - DHT value 저장
//      - Content advertisement
//    응답: Acknowledgement
//    저장: 메모리 또는 디스크
//    TTL: 기본 24시간
//
// 3. FIND_NODE (target_id)
//    "이 ID에 가까운 노드 k개 알려줘"
//    용도:
//      - Peer discovery
//      - Routing table population
//    응답: k개의 {id, IP, port}
//    핵심: XOR distance 기반 선택
//
// 4. FIND_VALUE (key)
//    "이 key의 value 또는 가까운 노드"
//    용도:
//      - DHT value 조회
//    응답:
//      - Value (있으면)
//      - 가까운 노드 k개 (없으면)
//    → iterative 조회로 수렴

// 프로토콜 특성:
//   - UDP 기반 (일반적)
//   - Stateless messages
//   - Request ID로 매칭
//   - Sender ID 포함

// Iterative FIND_NODE 의사코드:
//   function iterative_find_node(target):
//       closest = local_routing.k_closest(target)
//       seen = {self}
//       queried = {}
//
//       while True:
//           picked = closest.filter(n not in queried)[:α]
//           if empty(picked): break
//
//           responses = parallel_rpc(FIND_NODE, picked, target)
//           queried.extend(picked)
//
//           new_closest = set()
//           for resp in responses:
//               for node in resp:
//                   if node not in seen:
//                       seen.add(node)
//                       new_closest.add(node)
//
//           closest = top_k(closest ∪ new_closest, target)
//
//           if closest unchanged for 1 round: break
//
//       return closest

// 복잡도:
//   Time: O(log n) rounds
//   Messages per round: α (=3)
//   Total messages: O(α · log n) ≈ O(log n)`}
        </pre>
      </div>
    </section>
  );
}
