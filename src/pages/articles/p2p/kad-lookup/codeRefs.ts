import type { CodeRef } from '@/components/code/types';
import lookupGo from './codebase/go-ethereum/p2p/discover/lookup.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'lookup-advance': {
    path: 'go-ethereum/p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [78, 92],
    desc: 'advance()는 startQueries()로 고루틴을 띄우고 replyCh에서 응답을 수신한다. 새 노드가 발견되면 true, 수렴하면 false를 반환한다.',
    annotations: [
      { lines: [78, 92], color: 'sky', note: 'advance: 질의 발사 + 응답 수신 루프' },
      { lines: [114, 130], color: 'emerald', note: 'startQueries: alpha=3 제한 고루틴 생성' },
    ],
  },
  'lookup-start-queries': {
    path: 'go-ethereum/p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [114, 130],
    desc: 'startQueries()는 result.entries에서 미질의 노드를 찾아 alpha(3)개까지 고루틴을 생성한다.',
    annotations: [
      { lines: [114, 130], color: 'emerald', note: 'startQueries: 가장 가까운 미질의 노드에 질의' },
      { lines: [132, 142], color: 'amber', note: 'query: FINDNODE RPC + trackRequest' },
    ],
  },
  'nodes-by-distance': {
    path: 'go-ethereum/p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [44, 63],
    desc: 'newLookup에서 lookup 초기화 — findnodeByID로 테이블에서 가장 가까운 16개 노드를 시드로 사용한다.',
    annotations: [
      { lines: [44, 63], color: 'sky', note: 'newLookup: 초기 시드 로드 + asked/seen 설정' },
      { lines: [94, 103], color: 'emerald', note: 'addNodes: seen 필터 + result.push' },
    ],
  },
  'do-refresh': {
    path: 'go-ethereum/p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [144, 164],
    desc: 'lookupIterator는 lookup을 연속 생성하며 발견된 노드를 순회한다. slowdown으로 최소 1초 간격을 보장한다.',
    annotations: [
      { lines: [149, 157], color: 'sky', note: 'lookupIterator 구조체' },
      { lines: [175, 212], color: 'emerald', note: 'Next(): 버퍼 소진 시 advance/새 lookup' },
    ],
  },
  'load-seeds': {
    path: 'go-ethereum/p2p/discover/lookup.go',
    code: lookupGo,
    lang: 'go',
    highlight: [132, 142],
    desc: 'query() 고루틴 — queryfunc(FINDNODE RPC)를 실행하고 trackRequest로 테이블에 피드백한다.',
    annotations: [
      { lines: [132, 142], color: 'amber', note: 'query: RPC 실행 + 결과 채널 전송' },
    ],
  },
};
