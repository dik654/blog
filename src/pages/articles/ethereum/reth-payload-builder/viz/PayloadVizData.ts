export const C = {
  cl: '#6366f1',
  engine: '#0ea5e9',
  builder: '#f59e0b',
  payload: '#10b981',
};

export const STEPS = [
  {
    label: 'CL → ForkchoiceUpdated (payload 속성 포함)',
    body: 'CL(비콘 노드)이 새 슬롯의 블록 제안자로 선정되면\nForkchoiceUpdated에 payload_attributes를 포함하여 EL에 전송',
  },
  {
    label: 'EL: canonical 체인 갱신 + 빌드 작업 시작',
    body: 'head_block_hash 검증\n→ canonical 체인 갱신\n→ payload_builder에 새 작업 전달\npayload_id를 발급하여 CL에 반환',
  },
  {
    label: 'PayloadBuilder: TX 풀에서 TX 선택',
    body: 'best_transactions_with_attributes()로\neffective_tip 기준 정렬된 TX를 가져옴\nbase_fee 이상인 TX만 대상',
  },
  {
    label: 'TX 실행 & 가스 소비 추적',
    body: '각 TX를 revm으로 실행\ncumulative_gas가 block_gas_limit에 도달하면 중단\n실행 실패 TX는 건너뜀',
  },
  {
    label: 'CL → GetPayload → 완성된 블록 반환',
    body: 'CL이 GetPayload(payload_id)를 호출\n→ 지금까지 채운 TX + 상태 루트 + 수수료 합계를\nExecutionPayload로 반환',
  },
];
