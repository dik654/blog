import type { CodeRef } from '@/components/code/types';
import mpoolGo from './codebase/lotus/chain/messagepool/messagepool.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'mpool-add': {
    path: 'lotus/chain/messagepool/messagepool.go', code: mpoolGo,
    lang: 'go', highlight: [11, 40],
    desc: 'MessagePool.Add() — 서명→Nonce→가스→밸런스 4단계 검증 후 pending 맵에 추가',
    annotations: [
      { lines: [11, 16], color: 'sky', note: 'MessagePool 구조체 — pending맵, curTs, baseFee' },
      { lines: [19, 28], color: 'emerald', note: '서명 + Nonce 검증 — 갭 허용 안 함' },
      { lines: [29, 38], color: 'amber', note: '가스 + 밸런스 검증 → pending 추가' },
    ],
  },
  'mpool-estimate': {
    path: 'lotus/chain/messagepool/messagepool.go', code: mpoolGo,
    lang: 'go', highlight: [42, 50],
    desc: 'GasEstimateMessageGas — GasLimit 시뮬레이션 + BaseFee·Premium 자동 추정',
    annotations: [
      { lines: [42, 45], color: 'sky', note: '시그니처 — Message를 받아 가스 파라미터 채움' },
      { lines: [46, 49], color: 'emerald', note: 'GasLimit: 실행 시뮬, FeeCap: BaseFee×1.25+Prem' },
    ],
  },
};
