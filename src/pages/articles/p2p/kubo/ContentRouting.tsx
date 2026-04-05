import CodePanel from '@/components/ui/code-panel';
import RoutingFlowViz from './viz/RoutingFlowViz';
import { ROUTING_CODE, ROUTING_ANNOTATIONS, ROUTER_TABLE } from './ContentRoutingData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ContentRouting({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="content-routing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Content Routing</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Content Routing은 <strong>CID로부터 해당 블록을 보유한 피어를 찾는</strong> 과정입니다.<br />
          Kubo는 여러 라우터를 병렬로 실행하는 <code>ComposableParallel</code> 구조를 사용합니다.
        </p>
        <h3>라우터 우선순위</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">라우터 타입</th>
                <th className="text-left p-2">우선순위</th>
                <th className="text-left p-2">특징</th>
              </tr>
            </thead>
            <tbody>
              {ROUTER_TABLE.map((r) => (
                <tr key={r.type} className="border-b border-muted">
                  <td className="p-2 font-mono text-xs">{r.type}</td>
                  <td className="p-2">{r.priority}</td>
                  <td className="p-2">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>DHT 기반 콘텐츠 발견</h3>
        <p>
          Kademlia DHT의 <code>FIND_PROVIDERS</code> RPC로
          CID 해시와 가장 가까운 노드들을 탐색합니다.<br />
          블록 보유 노드는 주기적으로 <code>ADD_PROVIDER</code>로 자신을 DHT에 등록합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-composer', codeRefs['kubo-composer'])} />
            <span className="text-[10px] text-muted-foreground self-center">Composer 라우터</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-dht-routing', codeRefs['kubo-dht-routing'])} />
            <span className="text-[10px] text-muted-foreground self-center">DHT 라우팅</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-http-routing', codeRefs['kubo-http-routing'])} />
            <span className="text-[10px] text-muted-foreground self-center">HTTP 위임 라우팅</span>
          </div>
        )}
        <CodePanel title="병렬 라우터 조합" code={ROUTING_CODE} annotations={ROUTING_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Content Routing 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPFS Content Routing
//
// 질문: "이 CID 누가 가지고 있어?"
//
// 3가지 Router:
//
// 1. DHT (Kademlia)
//    - Decentralized
//    - Public IPFS network
//    - Slow (수 초 ~ 수십 초)
//    - Scalable
//
// 2. HTTP Delegated Routing
//    - Centralized (usually)
//    - Fast (수 밀리초)
//    - IPNI (InterPlanetary Network Indexer)
//    - cid.contact, others
//
// 3. Bitswap (opportunistic)
//    - 이미 연결된 peer에게 질문
//    - WANT_HAVE broadcasts
//    - Session-based
//
// Parallel Strategy (Composer):
//   모두 동시에 query
//   첫 응답 반환
//   → 최소 latency

// DHT Operations:
//
// ADD_PROVIDER (내가 보유 알림):
//   주기적 republish (12 hours)
//   DHT의 k 가까운 노드에 저장
//
// FIND_PROVIDERS (찾기):
//   Iterative Kademlia lookup
//   가까운 노드부터 query
//   Provider 목록 수집

// Provider Records:
//   (CID, PeerID, expiration)
//   Signed by provider
//   TTL: 24 hours
//   Republish every 12 hours

// IPNI (Network Indexer):
//   중앙화된 index 서비스
//   - 빠른 조회
//   - 대규모 dataset (Filecoin 통합)
//   - cid.contact (가장 큼)
//   - AWS Neptune graph DB 기반

// HTTP Delegated Routing:
//   RFC 9 draft
//   /routing/v1/providers/{cid}
//   Returns: ProvidersResponse
//
//   장점: 빠름, 경량 클라이언트 친화
//   단점: 중앙화, trust 필요

// Performance:
//   DHT: 5-30 seconds typical
//   HTTP: 50-500ms
//   Bitswap (connected peers): 50-200ms
//
// → Hybrid strategy essential for UX

// Reprovide 시스템:
//   Daemon이 주기적으로 blocks 재광고
//   - strategy: "all" (모든 CID)
//   - strategy: "pinned" (pinned만)
//   - strategy: "roots" (root만, fast)

// Configuration (Kubo):
//   Routing.Type: "dht" | "dhtclient" | "dhtserver"
//                 | "delegated" | "auto" | "autoclient"
//
//   "auto": DHT + HTTP delegated
//   Recommended default`}
        </pre>
      </div>
      <div className="mt-8"><RoutingFlowViz /></div>
    </section>
  );
}
