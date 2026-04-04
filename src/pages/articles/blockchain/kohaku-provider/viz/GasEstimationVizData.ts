export const C = {
  base: '#6366f1', priority: '#10b981', limit: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 1: base_fee — 헤더에서 직접 추출',
    body: 'let base_fee = helios.get_block("latest").base_fee_per_gas\n블록 헤더에 포함된 값. Merkle 증명으로 검증됨.',
  },
  {
    label: 'Line 2: 우선순위 수수료 — feeHistory',
    body: 'helios.call(eth_feeHistory(5, "latest", [25, 75]))\n최근 5블록의 25/75 퍼센타일 우선순위 수수료.\n네트워크 혼잡도를 반영한 적정값.',
  },
  {
    label: 'Line 3: gas_limit — eth_call로 추정',
    body: 'gas_limit = helios.eth_call(tx).gas_used * 120 / 100\nProofDB 기반 로컬 EVM 실행 결과에 20% 버퍼.\n풀 노드 없이도 정확한 가스 추정.',
  },
  {
    label: 'Line 4: max_fee — EIP-1559 권장값',
    body: 'max_fee = base_fee * 2 + max_priority\nbase_fee 2배 + 우선순위 = 최대 수수료.\n2배 마진 — 다음 블록 base_fee 변동 대비.',
  },
];
