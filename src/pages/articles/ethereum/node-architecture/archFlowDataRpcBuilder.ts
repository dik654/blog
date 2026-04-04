import type { FlowNode } from './FlowDiagram';

/* ── rpc-0: RpcModuleBuilder ──────────────────────────────────── */
export const rpcBuilderFlowData: Record<string, FlowNode[]> = {
  'rpc-0': [
    {
      id: 'r0-1', fn: 'RpcModuleBuilder::new()', desc: 'RPC 서버 조립 빌더 패턴 시작',
      color: 'sky', codeRefKey: 'rpc-0',
      detail: 'Reth 노드 시작 시 한 번 실행됩니다. 모든 의존성을 주입하고 jsonrpsee 서버를 구성합니다.',
      children: [
        {
          id: 'r0-1-1', fn: '.with_provider(provider)',
          desc: 'DatabaseProvider 주입 — 블록·상태 조회 의존성',
          color: 'emerald', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-2', fn: '.with_pool(pool)',
          desc: 'TransactionPool 주입 — txpool 조회/제출 의존성',
          color: 'amber', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-3', fn: '.with_network(network)',
          desc: 'NetworkHandle 주입 — 피어 정보·p2p 연결 의존성',
          color: 'violet', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-4', fn: '.with_evm_config(evm_config)',
          desc: 'EvmConfig 주입 — eth_call·estimateGas EVM 설정',
          color: 'sky', codeRefKey: 'rpc-0',
        },
        {
          id: 'r0-1-5', fn: '.build()',
          desc: '네임스페이스별 RPC 모듈 조립 및 jsonrpsee 등록',
          color: 'rose', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r0-1-5-1', fn: 'EthApiServer::into_rpc()',
              desc: 'eth_ 네임스페이스 — getBalance, sendRawTransaction 등',
              color: 'emerald', codeRefKey: 'rpc-2',
            },
            {
              id: 'r0-1-5-2', fn: 'DebugApiServer::into_rpc()',
              desc: 'debug_ 네임스페이스 — traceTransaction, getRawBlock 등',
              color: 'amber', codeRefKey: 'rpc-0',
            },
            {
              id: 'r0-1-5-3', fn: 'module.merge(eth_module)',
              desc: '모든 네임스페이스 모듈을 하나의 RpcModule로 합산',
              color: 'slate', codeRefKey: 'rpc-0',
            },
          ],
        },
        {
          id: 'r0-1-6', fn: 'RpcServerConfig.start(module)',
          desc: 'HTTP(:8545), WebSocket(:8546), IPC 동시 서빙 시작',
          color: 'slate', codeRefKey: 'rpc-0',
          detail: 'jsonrpsee의 ServerBuilder를 사용합니다. HTTP와 WebSocket을 동일 포트에서 서빙하거나 분리할 수 있습니다.',
        },
      ],
    },
  ],
};
