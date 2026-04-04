import type { CodeRef } from '@/components/code/types';

import lookupGo from './codebase/go-ethereum/p2p/discover/lookup.go?raw';

export const lookupRefs: Record<string, CodeRef> = {
  'geth-lookup-struct': {
    path: 'p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [31, 63],
    desc: 'lookup 구조체는 반복 노드 조회를 수행합니다. target에 가장 가까운 bucketSize(16)개 노드를 alpha(3) 동시 쿼리로 찾습니다.',
    annotations: [
      { lines: [31, 40], color: 'sky', note: 'lookup — asked/seen 맵, result, replyCh' },
      { lines: [44, 63], color: 'emerald', note: 'newLookup — 로컬 테이블에서 초기 후보 선택' },
    ],
  },
  'geth-lookup-advance': {
    path: 'p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [78, 131],
    desc: 'advance는 쿼리 결과를 받아 더 가까운 노드를 발견하면 계속 반복합니다. startQueries에서 alpha개 동시 goroutine 쿼리를 실행합니다.',
    annotations: [
      { lines: [78, 92], color: 'sky', note: 'advance — replyCh에서 응답 수신 + addNodes' },
      { lines: [114, 130], color: 'emerald', note: 'startQueries — alpha 동시 쿼리, 미질의 노드만' },
      { lines: [132, 142], color: 'amber', note: 'query — goroutine에서 queryfunc 실행 후 응답' },
    ],
  },
};
