import type { CodeRef } from '@/components/code/types';
import stateGo from './codebase/cometbft/state/state.go?raw';
import storeGo from './codebase/cometbft/state/store.go?raw';
import blockStoreGo from './codebase/cometbft/store/store.go?raw';
import evidencePoolGo from './codebase/cometbft/evidence/pool.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'state-struct': {
    path: 'state/state.go', code: stateGo, lang: 'go', highlight: [16, 48],
    desc: 'State 구조체 — 합의 엔진의 스냅샷, 마지막 확정 블록 기준 모든 정보',
    annotations: [
      { lines: [20, 21], color: 'sky',
        note: 'ChainID, InitialHeight — 불변. 제네시스에서 설정' },
      { lines: [24, 26], color: 'emerald',
        note: 'LastBlockHeight/ID/Time — 마지막 확정 블록. 재시작 시 이 높이+1부터 합의' },
      { lines: [34, 37], color: 'amber',
        note: '밸리데이터 3중 세트 — Last(이전 검증), Current(투표), Next(다음 적용)' },
      { lines: [40, 41], color: 'violet',
        note: 'ConsensusParams — 블록 크기, 증거 유효기간, 가스. FinalizeBlock에서 갱신' },
      { lines: [44, 47], color: 'rose',
        note: 'LastResultsHash + AppHash — 앱 상태 루트. 다음 블록 헤더에 포함' },
    ],
  },
  'state-store': {
    path: 'state/store.go', code: storeGo, lang: 'go', highlight: [14, 29],
    desc: 'Store 인터페이스 — Save/Load/LoadValidators/PruneStates',
    annotations: [
      { lines: [16, 17], color: 'sky',
        note: 'Save() — applyBlock 후 호출. LevelDB에 직렬화. 크래시 복구 기준점' },
      { lines: [18, 19], color: 'emerald',
        note: 'Load() — 시작 시 마지막 State 복원' },
      { lines: [20, 21], color: 'amber',
        note: 'LoadValidators(h) — 과거 높이의 밸리데이터 세트. 증거 검증에 필요' },
      { lines: [28, 28], color: 'violet',
        note: 'PruneStates — 오래된 상태 삭제. 디스크 절약' },
    ],
  },
  'block-store': {
    path: 'store/store.go', code: blockStoreGo, lang: 'go', highlight: [18, 35],
    desc: 'BlockStore — LevelDB 블록 저장, base~height 연속 보장',
    annotations: [
      { lines: [19, 19], color: 'sky',
        note: 'db — LevelDB 인스턴스. 블록 데이터의 물리 저장소' },
      { lines: [22, 23], color: 'emerald',
        note: 'base, height — 연속 범위 보장. Prune 시 base 전진' },
    ],
  },
  'block-save': {
    path: 'store/store.go', code: blockStoreGo, lang: 'go', highlight: [44, 65],
    desc: 'SaveBlock() — 블록·파트·커밋을 분리 저장',
    annotations: [
      { lines: [45, 47], color: 'sky',
        note: 'nil 블록 방어. panic으로 잘못된 호출 즉시 감지' },
      { lines: [49, 51], color: 'emerald',
        note: 'g != w (got != wanted) → 연속성 보장. 빈 높이 방지' },
      { lines: [54, 60], color: 'amber',
        note: 'BlockMeta + 파트 순회 → 각각 키 기반 LevelDB 저장' },
      { lines: [64, 64], color: 'violet',
        note: 'bs.height = height — 새 최고 높이 갱신' },
    ],
  },
  'evidence-pool': {
    path: 'evidence/pool.go', code: evidencePoolGo, lang: 'go', highlight: [13, 25],
    desc: 'Pool — 비잔틴 증거 수집 풀, 블록 제안 시 수확',
    annotations: [
      { lines: [16, 17], color: 'sky',
        note: 'evidenceStore + evidenceList — DB 영구 저장 + CList 메모리 풀' },
      { lines: [20, 21], color: 'emerald',
        note: 'stateDB + state — 밸리데이터 세트 로드용. 증거 검증 필수' },
    ],
  },
  'evidence-add': {
    path: 'evidence/pool.go', code: evidencePoolGo, lang: 'go', highlight: [42, 59],
    desc: 'AddEvidence() — 중복·만료 확인 → verify → 풀 추가',
    annotations: [
      { lines: [44, 49], color: 'sky',
        note: 'isPending/isCommitted — 이미 알려진 증거 무시' },
      { lines: [52, 54], color: 'emerald',
        note: 'verify — infraction height의 밸리데이터로 서명 검증' },
      { lines: [57, 58], color: 'amber',
        note: 'evidenceList.PushBack — CList에 추가. 블록 제안 시 수확' },
    ],
  },
  'evidence-update': {
    path: 'evidence/pool.go', code: evidencePoolGo, lang: 'go', highlight: [68, 90],
    desc: 'Update() + CheckEvidence() — 블록 확정 후 정리, 검증',
    annotations: [
      { lines: [69, 73], color: 'sky',
        note: 'Update — state 갱신 + committed 증거 제거' },
      { lines: [83, 89], color: 'emerald',
        note: 'CheckEvidence — 블록 내 증거 목록을 일괄 검증' },
    ],
  },
};
