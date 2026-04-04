import type { CodeRef } from '@/components/code/types';
import executionGo from './codebase/cometbft/state/execution.go?raw';
import validationGo from './codebase/cometbft/state/validation.go?raw';

export const codeRefs: Record<string, CodeRef> = {
  'apply-block': {
    path: 'state/execution.go', code: executionGo, lang: 'go', highlight: [31, 90],
    desc: 'ApplyBlock — 블록 실행의 유일한 진입점, 전체 상태 전이를 한 함수에 집약',
    annotations: [
      { lines: [36, 38], color: 'sky',
        note: '① ValidateBlock — 헤더(ChainID, Height), LastCommit(2/3+ 서명), Evidence(유효기간) 검증' },
      { lines: [41, 50], color: 'emerald',
        note: '② FinalizeBlock(ABCI) — 확정 블록을 앱에 전달. TX 실행 결과 + ValidatorUpdates + AppHash 수신' },
      { lines: [62, 62], color: 'amber',
        note: '③ SaveFinalizeBlockResponse — ABCI 응답을 DB에 저장. 크래시 복구 시 재활용' },
      { lines: [69, 72], color: 'violet',
        note: '⑤ updateState — 새 State 구성: NextValidators 갱신, ConsensusParams 갱신' },
      { lines: [75, 78], color: 'rose',
        note: '⑥ Commit — 멤풀 락 → ABCI Commit → 멤풀 비동기 갱신. 앱이 상태를 영구 저장하는 유일한 시점' },
    ],
  },
  'block-executor': {
    path: 'state/execution.go', code: executionGo, lang: 'go', highlight: [17, 27],
    desc: 'BlockExecutor 구조체 — store, proxyApp, mempool, evpool 의존성',
    annotations: [
      { lines: [18, 18], color: 'sky',
        note: 'store — State 저장소. Save(state)로 DB 기록' },
      { lines: [20, 20], color: 'emerald',
        note: 'proxyApp — ABCI Consensus 연결. FinalizeBlock/Commit 호출 대상' },
      { lines: [22, 23], color: 'amber',
        note: 'mempool/evpool — Commit 후 멤풀 갱신, 증거 풀 갱신에 사용' },
    ],
  },
  'validate-block': {
    path: 'state/validation.go', code: validationGo, lang: 'go', highlight: [12, 46],
    desc: 'validateBlock — 헤더·커밋·증거 4가지 검증',
    annotations: [
      { lines: [14, 22], color: 'sky',
        note: '① 헤더 검증 — ChainID 일치, Height = LastBlockHeight+1, LastBlockID 일치' },
      { lines: [25, 31], color: 'emerald',
        note: '② LastCommit 검증 — 이전 밸리데이터 세트로 VerifyCommitLightTrusting (2/3+ 서명 확인)' },
      { lines: [34, 38], color: 'amber',
        note: '③ Evidence 검증 — MaxAgeNumBlocks 내 유효기간. 만료된 증거는 거부' },
      { lines: [41, 43], color: 'violet',
        note: '④ Proposer 검증 — 블록 제안자가 밸리데이터 세트에 존재하는지 확인' },
    ],
  },
};
