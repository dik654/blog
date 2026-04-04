import type { CodeRef } from '@/components/code/types';

import tableGo from './codebase/go-ethereum/p2p/discover/table.go?raw';
import netGo from './codebase/go-ethereum/p2p/discover/netutil/net.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'add-ip': {
    path: 'go-ethereum/p2p/discover/table.go',
    code: tableGo,
    lang: 'go',
    highlight: [9, 24],
    desc: 'addIP는 2단계 IP 쿼터를 검사합니다. 먼저 테이블 전역 한도(/24당 10개)를 확인하고, 통과하면 버킷별 한도(/24당 2개)를 확인합니다. 버킷 한도 초과 시 전역 카운터도 롤백합니다.',
    annotations: [
      { lines: [3, 6], color: 'sky', note: '두 단계 IP 제한 상수 — /24 서브넷 기준' },
      { lines: [16, 18], color: 'amber', note: '1단계: 테이블 전역 한도 체크 (/24당 10개)' },
      { lines: [19, 22], color: 'rose', note: '2단계: 버킷별 한도 체크 (/24당 2개) + 롤백' },
    ],
  },

  'distinct-net-set': {
    path: 'go-ethereum/p2p/discover/netutil/net.go',
    code: netGo,
    lang: 'go',
    highlight: [4, 20],
    desc: 'DistinctNetSet은 서브넷별 IP 카운팅 구조체입니다. IP를 /24 프리픽스로 변환한 뒤 맵에서 카운터를 관리하여, Limit 이상이면 거부합니다.',
    annotations: [
      { lines: [4, 8], color: 'sky', note: '서브넷 프리픽스별 카운터를 맵으로 관리' },
      { lines: [12, 18], color: 'emerald', note: '한도 미만이면 카운터 증가 후 허용' },
    ],
  },

  'add-found-node': {
    path: 'go-ethereum/p2p/discover/table.go',
    code: tableGo,
    lang: 'go',
    highlight: [26, 41],
    desc: 'addFoundNode는 새 노드를 버킷에 추가합니다. 버킷이 가득 차면 교체 목록에 대기시키고, IP 쿼터를 통과해야만 실제 추가됩니다.',
    annotations: [
      { lines: [31, 34], color: 'amber', note: '버킷 가득 → 기존 노드 보호, 교체 목록으로' },
      { lines: [35, 37], color: 'rose', note: 'IP 쿼터 통과 필수' },
      { lines: [38, 40], color: 'emerald', note: '모든 검사 통과 시 버킷에 추가' },
    ],
  },
};
