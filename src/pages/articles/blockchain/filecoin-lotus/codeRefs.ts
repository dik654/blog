import type { CodeRef } from '@/components/code/types';

import filecoinGo from './codebase/lotus/chain/consensus/filcns/filecoin.go?raw';
import weightGo from './codebase/lotus/chain/consensus/filcns/weight.go?raw';
import mineGo from './codebase/lotus/chain/consensus/filcns/mine.go?raw';
import storeGo from './codebase/lotus/chain/store/store.go?raw';
import stmgrGo from './codebase/lotus/chain/stmgr/stmgr.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'lotus-filecoin-ec': {
    path: 'lotus/chain/consensus/filcns/filecoin.go',
    code: filecoinGo,
    lang: 'go',
    highlight: [44, 57],
    desc: 'FilecoinEC는 Expected Consensus의 핵심 구조체입니다. ChainStore, StateManager, Beacon, Verifier를 조합하여 블록 검증과 리더 선출을 수행합니다.',
    annotations: [
      { lines: [44, 57], color: 'sky', note: 'FilecoinEC 구조체 — store, beacon, sm, verifier' },
      { lines: [98, 112], color: 'emerald', note: 'NewFilecoinExpectedConsensus — 합의 엔진 초기화' },
      { lines: [114, 155], color: 'amber', note: 'ValidateBlock — 높이, 타임스탬프, 미래 블록 검사' },
      { lines: [180, 232], color: 'violet', note: 'winnerCheck — VRF 검증 + 파워 기반 WinCount 확인' },
    ],
  },

  'lotus-weight': {
    path: 'lotus/chain/consensus/filcns/weight.go',
    code: weightGo,
    lang: 'go',
    highlight: [22, 83],
    desc: 'Weight 함수는 Filecoin 체인 가중치를 계산합니다. 부모 가중치 + log2(총 파워) + (WinCount 비례 보너스)로 heaviest chain을 선택합니다.',
    annotations: [
      { lines: [22, 26], color: 'sky', note: 'Weight 시그니처 — 체인 가중치 공식' },
      { lines: [32, 56], color: 'emerald', note: 'totalPower 로드 — PowerActor에서 QualityAdjPower 조회' },
      { lines: [58, 66], color: 'amber', note: 'log2P — 파워의 비트 길이로 로그 근사' },
      { lines: [70, 82], color: 'violet', note: 'eWeight — WinCount × log2P × wRatio 보너스' },
    ],
  },

  'lotus-mine': {
    path: 'lotus/chain/consensus/filcns/mine.go',
    code: mineGo,
    lang: 'go',
    highlight: [14, 46],
    desc: 'CreateBlock은 블록 생성 함수입니다. 부모 TipSet에서 Lookback 상태를 구하고, 워커 주소로 서명한 뒤 BLS/Secpk 메시지를 포함한 FullBlock을 반환합니다.',
    annotations: [
      { lines: [14, 18], color: 'sky', note: 'CreateBlock 시그니처 — Wallet + BlockTemplate' },
      { lines: [20, 28], color: 'emerald', note: 'Lookback TipSet + 워커 주소 조회' },
      { lines: [30, 33], color: 'amber', note: 'CreateBlockHeader — 메시지 처리 + 헤더 생성' },
      { lines: [39, 46], color: 'violet', note: 'FullBlock 조립 — Header + BLS + Secpk' },
    ],
  },

  'lotus-chainstore': {
    path: 'lotus/chain/store/store.go',
    code: storeGo,
    lang: 'go',
    highlight: [100, 134],
    desc: 'ChainStore는 체인 데이터의 핵심 접근점입니다. chain/state Blockstore, ARC 캐시(TipSet/MsgMeta), 리오그 알림 채널을 관리합니다.',
    annotations: [
      { lines: [91, 99], color: 'sky', note: 'ChainStore 주석 — 두 ARC 캐시 설명' },
      { lines: [100, 134], color: 'emerald', note: 'ChainStore 구조체 — Blockstore, heaviest, cindex' },
      { lines: [136, 158], color: 'amber', note: 'NewChainStore — ARC 캐시 초기화 + 리오그 핸들러' },
    ],
  },

  'lotus-statemgr': {
    path: 'lotus/chain/stmgr/stmgr.go',
    code: stmgrGo,
    lang: 'go',
    highlight: [125, 167],
    desc: 'StateManager는 상태 쿼리와 마이그레이션을 관리합니다. 네트워크 버전별 마이그레이션 맵, 실행 트레이스 캐시, Executor 인터페이스를 통해 TipSet을 실행합니다.',
    annotations: [
      { lines: [120, 123], color: 'sky', note: 'Executor 인터페이스 — ExecuteTipSet 메서드' },
      { lines: [125, 140], color: 'emerald', note: 'StateManager 구조체 — ChainStore, networkVersions, migrations' },
      { lines: [142, 167], color: 'amber', note: '캐시 필드 — stCache, execTraceCache, beacon 등' },
    ],
  },
};
