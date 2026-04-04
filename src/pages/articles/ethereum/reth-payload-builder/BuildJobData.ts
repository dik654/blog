export interface BuildPhase {
  phase: string;
  action: string;
  detail: string;
  color: string;
}

export const BUILD_PHASES: BuildPhase[] = [
  {
    phase: 'TX 이터레이터 획득',
    action: 'best_transactions_with_attributes(base_fee)',
    detail: 'TX 풀에서 effective_tip 기준 내림차순으로 정렬된 이터레이터를 가져온다. base_fee 이상인 TX만 대상이다. CoinbaseTipOrdering이 정렬 키를 제공한다.',
    color: '#6366f1',
  },
  {
    phase: '가스 한도 검사',
    action: 'cumulative_gas + tx.gas_limit <= block_gas_limit',
    detail: '현재까지 누적된 가스 + 새 TX의 가스 한도가 블록 한도를 초과하면 건너뛴다. 아직 남은 TX 중 가스가 작은 것이 있을 수 있으므로 즉시 종료하지 않는다.',
    color: '#0ea5e9',
  },
  {
    phase: 'revm 실행',
    action: 'evm.transact(tx) → ExecutionResult',
    detail: 'revm으로 TX를 실행한다. 성공하면 상태 변경(BundleState)에 누적한다. 실패하면 mark_invalid()로 TX 풀에서 제거하고 다음 TX로 진행한다.',
    color: '#f59e0b',
  },
  {
    phase: 'BuiltPayload 패킹',
    action: 'executed_txs + state_changes → BuiltPayload',
    detail: '실행된 TX 목록과 BundleState를 BuiltPayload로 패킹한다. block_value(수수료 합계)를 계산하여 CL이 MEV 블록과 비교할 수 있게 한다.',
    color: '#10b981',
  },
];

export interface BuildInsight {
  question: string;
  answer: string;
}

export const BUILD_INSIGHTS: BuildInsight[] = [
  {
    question: '왜 가스 초과 TX를 건너뛰고 계속 진행하는가?',
    answer: '블록 가스 한도가 2,000만이고 잔여가 500만일 때, 가스 한도 1,000만인 TX는 들어가지 않지만 200만인 TX는 가능하다. 수익 극대화를 위해 남은 공간을 최대한 채운다.',
  },
  {
    question: 'mark_invalid()는 무엇을 하는가?',
    answer: 'TX 풀의 이터레이터에 실패 TX를 알린다. 해당 TX와 같은 sender의 이후 nonce TX도 무효가 되므로 건너뛴다. 불필요한 실행을 방지한다.',
  },
  {
    question: 'block_value는 어떻게 계산되는가?',
    answer: '각 TX의 effective_tip * gas_used를 합산한다. CL은 이 값과 MEV 빌더의 블록 가치를 비교하여 더 수익 높은 블록을 선택한다.',
  },
];
