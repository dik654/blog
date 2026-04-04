import type { FlowNode } from './FlowDiagram';

/* ── rpc-2: EthCall / Call / EstimateCall ─────────────────────── */
export const rpcCallFlowData: Record<string, FlowNode[]> = {
  'rpc-2': [
    {
      id: 'r2-1', fn: 'eth_call(request, block_id)', desc: '상태 변경 없이 EVM 실행 결과만 반환하는 RPC',
      color: 'sky', codeRefKey: 'rpc-2',
      children: [
        {
          id: 'r2-1-1', fn: 'EthCall::call() [트레이트 기본 구현 위임]',
          desc: 'reth_rpc_eth_api의 기본 구현 사용 — 이 파일은 파라미터 바인딩만',
          color: 'emerald', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r2-1-1-1', fn: 'Call::call_with(request, block_state)',
              desc: '실제 EVM 실행 로직 — 격리된 상태에서 실행',
              color: 'amber', codeRefKey: 'rpc-2',
              children: [
                {
                  id: 'r2-1-1-1-1', fn: 'CacheDB::new(block_state)',
                  desc: '읽기: 스냅샷, 쓰기: 메모리에만 — 상태 격리',
                  color: 'violet', codeRefKey: 'rpc-2',
                  detail: 'CacheDB는 읽기는 실제 DB에서, 쓰기는 내부 HashMap에만 합니다. 함수 종료 시 HashMap이 버려져 상태 변경이 사라집니다.',
                },
                {
                  id: 'r2-1-1-1-2', fn: 'EVM::transact(tx)',
                  desc: 'EVM 실행 — 반환값·가스 사용량·로그 수집',
                  color: 'sky', codeRefKey: 'engine-tree-0',
                },
                {
                  id: 'r2-1-1-1-3', fn: '상태 변경 드롭 (CacheDB 버림)',
                  desc: '실행 결과만 반환 — 온체인 상태는 변경되지 않음',
                  color: 'slate', codeRefKey: 'rpc-2',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'r2-2', fn: 'eth_estimateGas(request, block_id)', desc: '트랜잭션 실행에 필요한 최소 가스량 이진 탐색',
      color: 'sky', codeRefKey: 'rpc-2',
      children: [
        {
          id: 'r2-2-1', fn: 'EstimateCall::estimate_gas() [트레이트 기본 구현 위임]',
          desc: '이진 탐색으로 최소 gasLimit 계산',
          color: 'emerald', codeRefKey: 'rpc-2',
          children: [
            {
              id: 'r2-2-1-1', fn: '이진 탐색 (lo=21000, hi=block_gas_limit)',
              desc: '각 mid 값으로 Call::call_with() 실행 — 성공 여부로 범위 좁힘',
              color: 'amber', codeRefKey: 'rpc-2',
              detail: '보통 15~20회 이진 탐색으로 수렴합니다. 각 단계마다 EVM을 실행하므로 복잡한 컨트랙트는 비쌀 수 있습니다.',
            },
          ],
        },
      ],
    },
  ],
};
