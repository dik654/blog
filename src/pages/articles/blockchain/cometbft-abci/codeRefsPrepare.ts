import type { CodeRef } from '@/components/code/types';
import executionGo from './codebase/cometbft/internal/state/execution.go?raw';
import appConnConsGo from './codebase/cometbft/proxy/app_conn_consensus.go?raw';
import localClientGo from './codebase/cometbft/abci/client/local_client.go?raw';

export const prepareRefs: Record<string, CodeRef> = {
  'create-proposal-block': {
    path: 'internal/state/execution.go',
    code: executionGo,
    lang: 'go',
    highlight: [22, 53],
    desc: 'CreateProposalBlock — 제안자가 블록을 구성하는 진입점',
    annotations: [
      { lines: [30, 31], color: 'sky',
        note: 'mempool에서 TX를 가져옴 — maxBytes/maxGas 제한 내에서 수집' },
      { lines: [35, 46], color: 'emerald',
        note: 'appConn.PrepareProposal 호출 — 앱에 TX 재정렬/필터링 위임' },
      { lines: [52, 53], color: 'amber',
        note: '앱이 반환한 TxRecords로 블록 TX 교체 — 앱이 최종 TX 결정권 보유' },
    ],
  },
  'proxy-prepare': {
    path: 'proxy/app_conn_consensus.go',
    code: appConnConsGo,
    lang: 'go',
    highlight: [22, 28],
    desc: 'AppConnConsensus.PrepareProposal — 프록시 계층',
    annotations: [
      { lines: [23, 23], color: 'sky',
        note: 'BlockExecutor → AppConnConsensus → localClient → app 호출 경로' },
      { lines: [27, 27], color: 'emerald',
        note: 'app.appConn이 localClient이면 직접 함수 호출 (직렬화 없음)' },
    ],
  },
  'local-prepare': {
    path: 'abci/client/local_client.go',
    code: localClientGo,
    lang: 'go',
    highlight: [39, 44],
    desc: 'localClient.PrepareProposal — Mutex 보호 직접 호출',
    annotations: [
      { lines: [41, 42], color: 'sky',
        note: 'Lock/Unlock — 동시 접근 방지. 한 번에 하나의 합의 호출만 실행' },
      { lines: [43, 43], color: 'emerald',
        note: 'app.Application.PrepareProposal — Cosmos SDK BaseApp으로 직접 진입' },
    ],
  },
};
