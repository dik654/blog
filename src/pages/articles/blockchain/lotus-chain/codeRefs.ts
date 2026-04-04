import type { CodeRef } from '@/components/code/types';
import syncGo from './codebase/lotus/chain/sync/sync.go?raw';
import stmgrGo from './codebase/lotus/chain/stmgr/stmgr.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'chain-sync': {
    path: 'lotus/chain/sync/sync.go',
    code: syncGo,
    lang: 'go',
    highlight: [13, 43],
    desc: 'Syncer.Sync() — 헤더→메시지→검증→상태계산 4단계 파이프라인',
    annotations: [
      { lines: [13, 17], color: 'sky',
        note: 'Syncer 구조체 — ChainStore(저장) + StateManager(실행) + peer ID' },
      { lines: [25, 30], color: 'emerald',
        note: '1단계: collectHeaders — 역순 헤더 수집, 부모 CID 연결 확인' },
      { lines: [32, 34], color: 'violet',
        note: '2단계: collectMessages — Bitswap P2P로 메시지 수집' },
      { lines: [36, 40], color: 'amber',
        note: '3단계: ValidateBlock — 서명, 타임스탬프, 부모 해시, 메시지 루트 4항목 검증' },
      { lines: [42, 43], color: 'rose',
        note: '4단계: ApplyBlocks — FVM으로 메시지 실행 → state root 계산' },
    ],
  },
  'state-apply': {
    path: 'lotus/chain/stmgr/stmgr.go',
    code: stmgrGo,
    lang: 'go',
    highlight: [13, 41],
    desc: 'StateManager.ApplyBlocks() — FVM으로 메시지 실행 → state root',
    annotations: [
      { lines: [13, 17], color: 'sky',
        note: 'StateManager — ChainStore + Executor(FVM) + stCache(결과 캐시)' },
      { lines: [23, 28], color: 'emerald',
        note: '부모 상태에서 FVM 인스턴스 생성 — StateBase + Epoch 설정' },
      { lines: [29, 30], color: 'amber',
        note: '💡 CronTick 먼저 — WindowPoSt deadline, 보상 분배, 결함 처리' },
      { lines: [31, 37], color: 'violet',
        note: '사용자 메시지 순차 실행 — 가스 소비 + 상태 변경 + 이벤트 로그' },
      { lines: [39, 41], color: 'rose',
        note: 'Flush() → 최종 state root (HAMT root CID) 반환' },
    ],
  },
};
