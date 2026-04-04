import type { CodeRef } from '@/components/code/types';
import appConnGo from './codebase/cometbft/proxy/app_conn.go?raw';
import applicationGo from './codebase/cometbft/abci/types/application.go?raw';
import localClientGo from './codebase/cometbft/abci/client/local_client.go?raw';
import { prepareRefs } from './codeRefsPrepare';
import { processRefs } from './codeRefsProcess';
import { finalizeRefs } from './codeRefsFinalize';
import { commitRefs } from './codeRefsCommit';

const baseRefs: Record<string, CodeRef> = {
  'app-conns': {
    path: 'proxy/app_conn.go', code: appConnGo, lang: 'go',
    highlight: [10, 26],
    desc: 'AppConns — 4개 ABCI 연결(Consensus/Mempool/Query/Snapshot)',
    annotations: [
      { lines: [11, 14], color: 'sky',
        note: '4개 연결 — 각각 독립 클라이언트로 동시 동작 가능' },
      { lines: [19, 25], color: 'emerald',
        note: 'NewAppConns — clientCreator가 전송 모드(local/socket/gRPC) 결정' },
    ],
  },
  'application-interface': {
    path: 'abci/types/application.go', code: applicationGo, lang: 'go',
    highlight: [6, 29],
    desc: 'Application 인터페이스 — 앱이 구현해야 할 ABCI 메서드',
    annotations: [
      { lines: [8, 10], color: 'sky',
        note: 'Info/Query — 읽기 전용 연결. 상태 변경 없음' },
      { lines: [13, 13], color: 'emerald',
        note: 'CheckTx — 멤풀 연결. TX 유효성 사전 검증' },
      { lines: [16, 22], color: 'amber',
        note: '합의 연결 — Prepare→Process→Finalize→Commit 순서' },
    ],
  },
  'local-client': {
    path: 'abci/client/local_client.go', code: localClientGo, lang: 'go',
    highlight: [10, 21],
    desc: 'localClient — 같은 프로세스에서 직접 함수 호출 (가장 빠름)',
    annotations: [
      { lines: [13, 15], color: 'sky',
        note: 'Mutex + Application 임베딩 — 락으로 동시 접근 방지' },
      { lines: [19, 21], color: 'emerald',
        note: 'NewLocalClient — app을 감싸서 ABCI Client 인터페이스 구현' },
    ],
  },
};

export const codeRefs: Record<string, CodeRef> = {
  ...baseRefs, ...prepareRefs, ...processRefs,
  ...finalizeRefs, ...commitRefs,
};
