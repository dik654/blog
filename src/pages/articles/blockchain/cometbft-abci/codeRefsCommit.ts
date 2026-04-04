import type { CodeRef } from '@/components/code/types';
import executionGo from './codebase/cometbft/internal/state/execution.go?raw';
import appConnConsGo from './codebase/cometbft/proxy/app_conn_consensus.go?raw';
import localClientGo from './codebase/cometbft/abci/client/local_client.go?raw';

export const commitRefs: Record<string, CodeRef> = {
  'apply-block-commit': {
    path: 'internal/state/execution.go',
    code: executionGo,
    lang: 'go',
    highlight: [105, 120],
    desc: 'ApplyBlock 후반부 — Commit → prune → mempool Update → state Save',
    annotations: [
      { lines: [106, 107], color: 'sky',
        note: 'appConn.Commit — 앱이 상태를 디스크에 영구 저장' },
      { lines: [112, 114], color: 'emerald',
        note: 'RetainHeight — 앱이 보관할 블록 높이 지정, 초과분 pruning' },
      { lines: [117, 117], color: 'amber',
        note: 'mempool.Update — 실행 완료된 TX 제거, 무효화된 TX 재검증' },
      { lines: [120, 120], color: 'violet',
        note: 'store.Save — CometBFT 상태 저장. 반드시 app Commit 이후 실행' },
    ],
  },
  'proxy-commit': {
    path: 'proxy/app_conn_consensus.go',
    code: appConnConsGo,
    lang: 'go',
    highlight: [49, 55],
    desc: 'AppConnConsensus.Commit — 프록시 계층',
    annotations: [
      { lines: [50, 50], color: 'sky',
        note: '호출 경로: BlockExecutor → AppConnConsensus → localClient → app' },
      { lines: [54, 54], color: 'emerald',
        note: 'Commit 후 앱 상태가 확정 — 이후 CometBFT가 자체 상태 저장' },
    ],
  },
  'local-commit': {
    path: 'abci/client/local_client.go',
    code: localClientGo,
    lang: 'go',
    highlight: [33, 37],
    desc: 'localClient.Commit — Mutex 보호 직접 호출',
    annotations: [
      { lines: [34, 35], color: 'sky',
        note: 'Lock/Unlock — Commit 중 다른 ABCI 호출 차단' },
      { lines: [36, 36], color: 'emerald',
        note: 'app.Application.Commit — SDK MultiStore의 Commit() 실행' },
    ],
  },
};
