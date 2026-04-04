import type { CodeRef } from '@/components/code/types';

import tableGo from './codebase/go-ethereum/p2p/discover/table.go?raw';

export const tableRefs: Record<string, CodeRef> = {
  'geth-table-struct': {
    path: 'p2p/discover/table.go',
    code: tableGo,
    lang: 'go',
    highlight: [42, 99],
    desc: 'Table은 Kademlia 스타일 라우팅 테이블입니다. nBuckets개 버킷 배열, nursery 부트스트랩 노드, revalidation 로직을 관리합니다.',
    annotations: [
      { lines: [42, 58], color: 'sky', note: 'alpha=3, bucketSize=16, nBuckets 상수' },
      { lines: [64, 90], color: 'emerald', note: 'Table 구조체 — buckets, nursery, rand, db' },
      { lines: [93, 99], color: 'amber', note: 'transport 인터페이스 — ping, lookupRandom 등' },
    ],
  },
  'geth-bucket': {
    path: 'p2p/discover/table.go',
    code: tableGo,
    lang: 'go',
    highlight: [101, 120],
    desc: 'bucket은 entries(활성 노드)와 replacements(대체 후보)를 가집니다. 최근 활성 노드가 entries[0]에 위치합니다.',
    annotations: [
      { lines: [103, 108], color: 'sky', note: 'bucket — entries + replacements + IP 제한' },
      { lines: [110, 120], color: 'emerald', note: 'addNodeOp, trackRequestOp 채널 메시지' },
    ],
  },
  'geth-new-table': {
    path: 'p2p/discover/table.go',
    code: tableGo,
    lang: 'go',
    highlight: [122, 155],
    desc: 'newTable은 라우팅 테이블을 초기화합니다. nBuckets개 버킷 생성, IP 서브넷 제한 설정, 부트노드 시드 로딩을 수행합니다.',
    annotations: [
      { lines: [124, 138], color: 'sky', note: '채널 초기화 + IP 제한 설정' },
      { lines: [139, 144], color: 'emerald', note: '각 버킷 초기화 (서브넷 제한 포함)' },
      { lines: [148, 153], color: 'amber', note: '부트노드 설정 + 시드 노드 로딩' },
    ],
  },
};
