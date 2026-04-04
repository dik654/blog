import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const cometbftAbciTree: FileNode = d('cometbft', [
  d('internal/state', [
    f('execution.go — BlockExecutor', 'internal/state/execution.go', 'create-proposal-block'),
  ]),
  d('proxy', [
    f('app_conn.go — AppConns (4개 연결)', 'proxy/app_conn.go', 'app-conns'),
    f('app_conn_consensus.go — 합의 프록시', 'proxy/app_conn_consensus.go', 'proxy-prepare'),
  ]),
  d('abci', [
    d('types', [
      f('application.go — Application 인터페이스', 'abci/types/application.go', 'application-interface'),
    ]),
    d('client', [
      f('local_client.go — localClient', 'abci/client/local_client.go', 'local-client'),
    ]),
  ]),
]);
