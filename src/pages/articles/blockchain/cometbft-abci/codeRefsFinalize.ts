import type { CodeRef } from '@/components/code/types';
import executionGo from './codebase/cometbft/internal/state/execution.go?raw';
import appConnConsGo from './codebase/cometbft/proxy/app_conn_consensus.go?raw';
import localClientGo from './codebase/cometbft/abci/client/local_client.go?raw';

export const finalizeRefs: Record<string, CodeRef> = {
  'apply-block': {
    path: 'internal/state/execution.go',
    code: executionGo,
    lang: 'go',
    highlight: [82, 98],
    desc: 'ApplyBlock 전반부 — mempool Lock 후 FinalizeBlock 호출',
    annotations: [
      { lines: [86, 87], color: 'sky',
        note: 'mempool.Lock() — 블록 실행 중 새 TX 유입 방지' },
      { lines: [90, 99], color: 'emerald',
        note: 'appConn.FinalizeBlock — 블록의 모든 TX를 한 번에 앱으로 전달' },
      { lines: [102, 103], color: 'amber',
        note: 'updateState — 앱 응답(ValidatorUpdates 등)으로 합의 상태 갱신' },
    ],
  },
  'proxy-finalize': {
    path: 'proxy/app_conn_consensus.go',
    code: appConnConsGo,
    lang: 'go',
    highlight: [40, 46],
    desc: 'AppConnConsensus.FinalizeBlock — 프록시 계층',
    annotations: [
      { lines: [41, 41], color: 'sky',
        note: '호출 경로: BlockExecutor → AppConnConsensus → localClient → app' },
      { lines: [45, 45], color: 'emerald',
        note: 'FinalizeBlock은 ABCI v2의 핵심 — 이전 3개 호출을 통합' },
    ],
  },
  'local-finalize': {
    path: 'abci/client/local_client.go',
    code: localClientGo,
    lang: 'go',
    highlight: [25, 29],
    desc: 'localClient.FinalizeBlock — Mutex 보호 직접 호출',
    annotations: [
      { lines: [26, 27], color: 'sky',
        note: 'Lock/Unlock — 동시 합의 접근 방지 (한 블록씩 순차 실행)' },
      { lines: [28, 28], color: 'emerald',
        note: 'app.Application.FinalizeBlock — SDK가 모든 TX 실행, 이벤트 생성' },
    ],
  },
};
