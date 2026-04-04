import type { CodeRef } from '@/components/code/types';

import filecoinGo from '../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/filecoin.go?raw';
import weightGo from '../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/weight.go?raw';
import mineGo from '../../blockchain/filecoin-lotus/codebase/lotus/chain/consensus/filcns/mine.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'ec-validate': {
    path: 'lotus/chain/consensus/filcns/filecoin.go',
    code: filecoinGo, lang: 'go', highlight: [114, 155],
    desc: 'ValidateBlock — 동기 기본 검증: 부모 TipSet 로드 → 높이 연속성 → 타임스탬프 범위',
    annotations: [
      { lines: [114, 117], color: 'sky', note: 'blockSanityChecks — 기본 형식 검사' },
      { lines: [121, 131], color: 'emerald', note: '부모 TipSet + Lookback TipSet 로드' },
      { lines: [140, 155], color: 'amber', note: '높이 연속성 + 미래 블록 거부 (MaxHeightDrift=5)' },
    ],
  },
  'ec-winner': {
    path: 'lotus/chain/consensus/filcns/filecoin.go',
    code: filecoinGo, lang: 'go', highlight: [180, 232],
    desc: 'winnerCheck — VRF 검증 + 파워 기반 WinCount 재계산',
    annotations: [
      { lines: [180, 192], color: 'sky', note: 'WinCount 최소 1 + 마이너 자격 확인' },
      { lines: [194, 210], color: 'emerald', note: 'Beacon → DomainSeparation → VRF 검증' },
      { lines: [221, 232], color: 'amber', note: 'ComputeWinCount 재계산 → 헤더 값과 대조' },
    ],
  },
  'ec-async': {
    path: 'lotus/chain/consensus/filcns/filecoin.go',
    code: filecoinGo, lang: 'go', highlight: [157, 279],
    desc: '6개 비동기 병렬 검증: miner → winner → sig → beacon → ticket → WinPoSt',
    annotations: [
      { lines: [157, 162], color: 'sky', note: 'minerCheck — 최소 파워 + 자격' },
      { lines: [234, 240], color: 'emerald', note: 'blockSigCheck — BLS 서명 검증' },
      { lines: [254, 279], color: 'amber', note: 'tktsCheck — 티켓 VRF 검증' },
    ],
  },
  'ec-weight': {
    path: 'lotus/chain/consensus/filcns/weight.go',
    code: weightGo, lang: 'go', highlight: [22, 83],
    desc: 'Weight — 부모 가중치 + log₂(P)×2⁸ + WinCount 보너스',
    annotations: [
      { lines: [22, 28], color: 'sky', note: '부모 가중치 상속: ts.ParentWeight()' },
      { lines: [58, 66], color: 'emerald', note: 'log₂P = BitLen()-1 → ×2⁸ 스케일링' },
      { lines: [70, 82], color: 'amber', note: 'WinCount 보너스: log₂P × wRatio × totalJ' },
    ],
  },
  'ec-create': {
    path: 'lotus/chain/consensus/filcns/mine.go',
    code: mineGo, lang: 'go', highlight: [14, 46],
    desc: 'CreateBlock — Lookback 상태 → 워커 주소 → 서명 → FullBlock 조립',
    annotations: [
      { lines: [14, 18], color: 'sky', note: '부모 TipSet 로드' },
      { lines: [20, 28], color: 'emerald', note: 'Lookback TipSet → 워커 주소 조회' },
      { lines: [39, 46], color: 'amber', note: 'FullBlock 조립: Header + BLS + Secpk' },
    ],
  },
};
