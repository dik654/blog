import type { CodeRef } from '@/components/code/types';
import executionGo from './codebase/cometbft/internal/state/execution.go?raw';
import appConnConsGo from './codebase/cometbft/proxy/app_conn_consensus.go?raw';
import localClientGo from './codebase/cometbft/abci/client/local_client.go?raw';

export const processRefs: Record<string, CodeRef> = {
  'process-proposal': {
    path: 'internal/state/execution.go',
    code: executionGo,
    lang: 'go',
    highlight: [57, 79],
    desc: 'ProcessProposal — 검증자가 제안 블록을 검증',
    annotations: [
      { lines: [61, 71], color: 'sky',
        note: 'appConn.ProcessProposal 호출 — 앱에 전체 블록 내용 전달' },
      { lines: [77, 78], color: 'emerald',
        note: 'ACCEPT → prevote 투표, REJECT → nil prevote 전송' },
    ],
  },
  'proxy-process': {
    path: 'proxy/app_conn_consensus.go',
    code: appConnConsGo,
    lang: 'go',
    highlight: [31, 37],
    desc: 'AppConnConsensus.ProcessProposal — 프록시 계층',
    annotations: [
      { lines: [32, 32], color: 'sky',
        note: '동일한 호출 경로: BlockExecutor → proxy → localClient → app' },
      { lines: [36, 36], color: 'emerald',
        note: '검증자 모두 이 경로로 제안 검증 (제안자 포함)' },
    ],
  },
  'local-process': {
    path: 'abci/client/local_client.go',
    code: localClientGo,
    lang: 'go',
    highlight: [46, 51],
    desc: 'localClient.ProcessProposal — Mutex 보호 직접 호출',
    annotations: [
      { lines: [48, 49], color: 'sky',
        note: 'Lock/Unlock — PrepareProposal과 동일한 보호 패턴' },
      { lines: [50, 50], color: 'emerald',
        note: 'app.Application.ProcessProposal — SDK의 검증 로직 실행' },
    ],
  },
};
