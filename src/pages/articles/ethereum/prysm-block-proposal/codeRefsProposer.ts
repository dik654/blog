import type { CodeRef } from '@/components/code/types';
import proposerRaw from './codebase/prysm/beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go?raw';

export const proposerCodeRefs: Record<string, CodeRef> = {
  'get-block': {
    path: 'beacon-chain/rpc/.../validator/proposer.go — GetBlock()',
    lang: 'go',
    code: proposerRaw,
    highlight: [5, 47],
    desc: 'GetBlock — 검증자의 블록 제안 요청을 처리하여 완성된 블록 반환',
    annotations: [
      { lines: [7, 12], color: 'sky', note: '헤드 상태 조회 + 슬롯 전진' },
      { lines: [14, 17], color: 'emerald', note: '제안자 인덱스 확인' },
      { lines: [19, 21], color: 'amber', note: '어테스테이션 풀에서 최적 선택' },
      { lines: [24, 24], color: 'violet', note: 'eth1 데이터 + 예치금 수집' },
      { lines: [27, 38], color: 'rose', note: '블록 구조체 조립 (RANDAO, Graffiti 포함)' },
      { lines: [40, 44], color: 'sky', note: '상태 루트 계산 후 블록에 설정' },
    ],
  },
  'aggregate-attestations': {
    path: 'beacon-chain/rpc/.../validator/proposer.go — GetBlock()',
    lang: 'go',
    code: proposerRaw,
    highlight: [19, 24],
    desc: '어테스테이션 수집 — 풀에서 집계된 투표를 필터링하여 블록에 포함',
    annotations: [
      { lines: [19, 19], color: 'sky', note: '집계된 어테스테이션 조회' },
      { lines: [20, 20], color: 'emerald', note: '현재 상태와 호환되는 것만 필터링' },
    ],
  },
};
