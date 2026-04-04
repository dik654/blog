import type { CodeRef } from '@/components/code/types';

import routingTableRs from './codebase/rqbit/crates/dht/src/routing_table.rs?raw';
import dhtRs from './codebase/rqbit/crates/dht/src/dht.rs?raw';
import peerStoreRs from './codebase/rqbit/crates/dht/src/peer_store.rs?raw';

export const dhtRefs: Record<string, CodeRef> = {
  'routing-table': {
    path: 'dht/src/routing_table.rs',
    code: routingTableRs,
    lang: 'rust',
    highlight: [471, 533],
    desc: 'RoutingTable은 Kademlia 라우팅 테이블입니다. XOR 거리 기반 BucketTree로 노드를 관리합니다.',
    annotations: [
      { lines: [474, 474], color: 'sky', note: 'id — 자신의 노드 ID (20바이트). 버킷 분할 기준' },
      { lines: [476, 476], color: 'emerald', note: 'buckets — BucketTree. 이진 트리 구조로 ID 공간 분할' },
      { lines: [495, 511], color: 'amber', note: 'sorted_by_distance_from — XOR 거리순 정렬. 상태(Good>Questionable>Unknown>Bad)도 반영' },
      { lines: [521, 533], color: 'violet', note: 'add_node — 버킷에 노드 삽입. 꽉 차면 자기 ID 포함 버킷만 분할' },
    ],
  },

  'bucket-tree': {
    path: 'dht/src/routing_table.rs',
    code: routingTableRs,
    lang: 'rust',
    highlight: [72, 77],
    desc: 'BucketTree는 ID 공간을 이진 트리로 분할합니다. 리프마다 최대 8개 노드를 저장합니다.',
    annotations: [
      { lines: [73, 73], color: 'sky', note: 'data — Vec<BucketTreeNode>. 트리 노드를 배열에 저장 (인덱스로 참조)' },
      { lines: [75, 76], color: 'emerald', note: 'size / max_size — 현재 노드 수와 전체 제한 (기본 512)' },
    ],
  },

  'bucket-insert': {
    path: 'dht/src/routing_table.rs',
    code: routingTableRs,
    lang: 'rust',
    highlight: [247, 366],
    desc: 'insert_into_leaf는 버킷 삽입 로직입니다. 기존 노드 확인 → Bad 교체 → 공간 있으면 추가 → 자기 ID 포함 시 분할.',
    annotations: [
      { lines: [268, 269], color: 'sky', note: '중복 검사 — 이미 있으면 WasExisting 반환' },
      { lines: [283, 293], color: 'emerald', note: 'Bad 교체 — 응답 없는 노드를 새 노드로 교체' },
      { lines: [304, 309], color: 'amber', note: '공간 확인 — 8개 미만이면 바로 추가' },
      { lines: [313, 315], color: 'violet', note: '분할 조건 — 자기 ID가 버킷 범위에 포함될 때만 분할' },
    ],
  },

  'node-status': {
    path: 'dht/src/routing_table.rs',
    code: routingTableRs,
    lang: 'rust',
    highlight: [407, 448],
    desc: 'NodeStatus는 DHT 노드의 건강 상태입니다. BEP 5 규격에 따라 Good/Questionable/Bad를 판별합니다.',
    annotations: [
      { lines: [408, 413], color: 'sky', note: '4단계 상태 — Good(응답 활발), Questionable(15분 비활성), Bad(연속 에러), Unknown' },
      { lines: [425, 425], color: 'emerald', note: 'Bad 판정 — 2회 연속 에러이면 Bad 노드로 교체 대상' },
      { lines: [430, 434], color: 'amber', note: 'Good 판정 — 15분 이내 응답이 있었으면 Good' },
      { lines: [438, 445], color: 'violet', note: 'Questionable — 15분 비활성이면 재확인 필요' },
    ],
  },

  'dht-recursive-request': {
    path: 'dht/src/dht.rs',
    code: dhtRs,
    lang: 'rust',
    highlight: [188, 198],
    desc: 'RecursiveRequest는 Kademlia iterative lookup의 핵심 구조입니다. info_hash에 가까운 노드를 재귀적으로 탐색합니다.',
    annotations: [
      { lines: [189, 190], color: 'sky', note: 'max_depth / useful_nodes_limit — 탐색 깊이와 유용한 노드 수 제한' },
      { lines: [191, 192], color: 'emerald', note: 'info_hash / request — 탐색 대상 해시와 요청 타입 (GetPeers/FindNode)' },
      { lines: [194, 194], color: 'amber', note: 'useful_nodes — XOR 거리순으로 가까운 노드 목록 (RwLock 보호)' },
      { lines: [195, 196], color: 'violet', note: 'peer_tx / node_tx — 발견된 피어와 노드를 상위로 전달하는 채널' },
    ],
  },

  'dht-stats': {
    path: 'dht/src/dht.rs',
    code: dhtRs,
    lang: 'rust',
    highlight: [50, 57],
    desc: 'DhtStats는 DHT 상태 모니터링용 구조체입니다.',
    annotations: [
      { lines: [53, 53], color: 'sky', note: 'id — 자신의 DHT 노드 ID' },
      { lines: [54, 54], color: 'emerald', note: 'outstanding_requests — 응답 대기 중인 요청 수' },
      { lines: [55, 56], color: 'amber', note: 'routing_table_size — IPv4/IPv6 라우팅 테이블 크기' },
    ],
  },
};
