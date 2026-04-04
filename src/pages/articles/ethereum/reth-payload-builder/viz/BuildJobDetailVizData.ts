export const C = { pool: '#6366f1', exec: '#f59e0b', gas: '#0ea5e9', ok: '#10b981' };

export const STEPS = [
  {
    label: 'best_transactions_with_attributes()',
    body: 'TX 풀에서 effective_tip 기준 내림차순 정렬된\nTX 이터레이터를 가져옴\nbase_fee 이상인 TX만 대상',
  },
  {
    label: '가스 한도 검사 + revm 실행',
    body: 'cumulative_gas + tx.gas_limit > block_gas_limit\n→ 초과하면 해당 TX 건너뜀\n통과하면 revm으로 실행\n실패 시 mark_invalid()로 풀에서 제거',
  },
  {
    label: '누적 + continuous building',
    body: '성공 TX를 executed_txs에 추가\ncumulative_gas 갱신\nGetPayload 호출 전까지 계속 더 좋은 TX 추가\n→ 수익 극대화',
  },
  {
    label: 'BuiltPayload 반환',
    body: 'executed_txs + BundleState를\nBuiltPayload로 패킹\nblock_value(수수료 합계) 계산\n→ CL이 MEV 비교에 사용',
  },
];
