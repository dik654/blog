import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import DHTViz from './viz/DHTViz';

export default function DHTImpl({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="dht-impl" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DHT 구현</h2>
      <p className="leading-7 mb-4">
        rqbit DHT — Kademlia 알고리즘 기반 피어 검색 + 토렌트 정보 공유<br />
        동적 BucketTree 구조, IPv4/IPv6 이중 라우팅 테이블,
        DashMap 기반 고성능 동시성 처리가 특징입니다.
      </p>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('routing-table', codeRefs['routing-table'])} />
          <CodeViewButton onClick={() => onCodeRef('bucket-tree', codeRefs['bucket-tree'])} />
          <CodeViewButton onClick={() => onCodeRef('dht-recursive-request', codeRefs['dht-recursive-request'])} />
        </div>
      )}

      <DHTViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">BucketTree vs 전통적 k-bucket</h3>
        <p className="leading-7">
          전통적 Kademlia — 160개 고정 크기 배열 사용<br />
          rqbit — 동적 트리 구조(BucketTree) 채택<br />
          각 BucketTreeNode — bits(담당 비트 수), start/end_inclusive(ID 범위),
          Leaf 또는 LeftRight(자식 인덱스) 포함<br />
          버킷 가득 참(8개 노드) 시 자신의 ID 범위 내에서만 분할 → 높은 메모리 효율
        </p>

        <h3 className="text-lg font-semibold">노드 상태 관리</h3>
        <p className="leading-7">
          RoutingTableNode — 각 노드의 last_request, last_response,
          last_query, errors_in_a_row 추적<br />
          정렬: 상태(Good=0, Questionable=1, Unknown=2, Bad=3) 1차 키,
          XOR 거리 2차 키 → 건강한 가까운 노드 우선
        </p>

        <h3 className="text-lg font-semibold">BitTorrent DHT 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BitTorrent DHT (BEP-5, Mainline DHT)
//
// Based on Kademlia with torrent-specific extensions
//
// RPC Methods:
//
// 1. ping
//    Q: {q: "ping", a: {id: node_id}}
//    R: {id: responder_id}
//
// 2. find_node
//    Q: {q: "find_node", a: {id, target}}
//    R: {id, nodes: <compact node info>}
//
// 3. get_peers
//    Q: {q: "get_peers", a: {id, info_hash}}
//    R: {id, token, values/nodes}
//    → values: list of peers for info_hash
//    → nodes: closer nodes if no peers
//
// 4. announce_peer
//    Q: {q: "announce_peer", a: {
//         id, info_hash, port, token
//       }}
//    R: {id}
//    → Announce that you're downloading

// Node ID:
//   160-bit (SHA-1 size)
//   일반적으로 random
//   권장: 위치 기반 (IP derivable)

// Token System:
//   DoS 방지용
//   announce_peer requires valid token
//   Token obtained from get_peers response
//   Short-lived (10 minutes)
//
//   token = SHA-1(secret || peer_ip)

// Bootstrap Nodes:
//   router.bittorrent.com:6881
//   dht.transmissionbt.com:6881
//   router.utorrent.com:6881
//   dht.libtorrent.org:25401

// 동작 순서 (torrent download):
//
//   1. Extract infohash from .torrent
//   2. DHT bootstrap
//   3. Iterative get_peers(infohash)
//   4. Collect peer IPs
//   5. Connect to peers via BT wire protocol
//   6. Announce self when downloading
//   7. Other peers discover you via DHT

// rqbit 특화:
//   - BucketTree (dynamic, memory efficient)
//   - IPv4/IPv6 dual stack
//   - DashMap for concurrent access
//   - Tokio async I/O
//
// vs libtorrent:
//   Simpler codebase
//   Rust safety guarantees
//   No C++ complexity`}
        </pre>
      </div>
    </section>
  );
}
