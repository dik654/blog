export const C = { phase1: '#6366f1', phase2: '#10b981', phase3: '#f59e0b' };

export const STEPS = [
  {
    label: 'for (uint i = 0; i < ops.length; i++) 루프',
    body: '번들러가 제출한 UserOperation 배열을 순회합니다.\n보통 한 번들에 1~10개의 UserOp이 포함됩니다.',
  },
  {
    label: 'Phase 1: _validatePrepayment(i, ops[i], opInfo)',
    body: 'nonce 확인, 예치금 차감, 서명 검증을 수행합니다.\n검증 실패 시 해당 UserOp만 건너뛰고 나머지는 계속 처리합니다.',
  },
  {
    label: 'Phase 2: _executeUserOp(i, ops[i], opInfo)',
    body: '검증 통과한 UserOp의 callData를 실행합니다.\nop.sender.call{gas: callGasLimit}(op.callData)로 스마트 계정에 위임합니다.',
  },
  {
    label: '_compensate(beneficiary, collected) — 가스비 정산',
    body: '실행에 사용된 가스비를 번들러(beneficiary)에게 지급합니다.\n사용자 예치금에서 차감된 금액이 번들러에게 전달됩니다.',
  },
];
