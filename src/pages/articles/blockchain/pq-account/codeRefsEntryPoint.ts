import type { CodeRef } from '@/components/code/types';

export const entryPointRefs: Record<string, CodeRef> = {
  'handle-ops': {
    path: 'erc4337/EntryPoint.sol', lang: 'typescript', highlight: [12, 30],
    desc: 'handleOps()는 번들러가 제출한 UserOperation 배열을 처리합니다.\nPhase 1: 전체 검증, Phase 2: 실행, Phase 3: 가스비 정산.',
    code: `function handleOps(
    PackedUserOperation[] calldata ops,
    address payable beneficiary
) public {
    // Phase 1: 전체 UserOp 사전 검증
    for (uint256 i = 0; i < opslen; i++) {
        _validatePrepayment(i, ops[i], opInfo);
    }
    // Phase 2: 검증 통과한 UserOp 실행
    for (uint256 i = 0; i < opslen; i++) {
        collected += _executeUserOp(i, ops[i], opInfos[i]);
    }
    // Phase 3: 가스비 정산
    _compensate(beneficiary, collected);
}`,
    annotations: [
      { lines: [5, 8] as [number, number], color: 'sky' as const, note: 'Phase 1: nonce + 서명 검증' },
      { lines: [9, 12] as [number, number], color: 'emerald' as const, note: 'Phase 2: callData 실행' },
      { lines: [13, 15] as [number, number], color: 'amber' as const, note: 'Phase 3: 번들러에게 가스비 지급' },
    ],
  },
  'validate-prepayment': {
    path: 'erc4337/EntryPoint.sol', lang: 'typescript', highlight: [3, 11],
    desc: '_validatePrepayment()은 nonce 확인, 예치금 차감, 서명 검증을 수행합니다.',
    code: `function _validatePrepayment(uint256 opIndex, op, opInfo)
    internal returns (uint256, uint256) {
    require(op.nonce == getNonce(op.sender, 0), "AA25");
    _incrementNonce(op.sender);  // 7 → 8
    uint256 missingFunds = op.maxFeePerGas * op.callGasLimit
        - deposits[op.sender];
    uint256 validationData = IAccount(op.sender)
        .validateUserOp(op, getUserOpHash(op), missingFunds);
    require(validationData == 0, "AA24 signature error");
}`,
    annotations: [
      { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'nonce 확인 + 증가' },
      { lines: [5, 6] as [number, number], color: 'amber' as const, note: '부족 예치금 계산' },
      { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '스마트 계정에 서명 검증 위임' },
    ],
  },
  'execute-userop': {
    path: 'erc4337/EntryPoint.sol', lang: 'typescript', highlight: [2, 6],
    desc: '_executeUserOp()는 검증 통과한 UserOp의 callData를 실행합니다.',
    code: `function _executeUserOp(uint256 opIndex, op, opInfo) internal {
    (bool success, bytes memory result) =
        op.sender.call{gas: op.callGasLimit}(op.callData);
    // transfer(to=0x5678, amount=500 USDC)
    // balances[sender] -= 500 (2000→1500)
    // balances[to] += 500 (300→800)
    emit UserOperationEvent(hash, sender, nonce, success, gasCost);
}`,
    annotations: [
      { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'callData를 스마트 계정에 전달' },
      { lines: [4, 6] as [number, number], color: 'emerald' as const, note: '상태 변경: 토큰 전송' },
      { lines: [7, 7] as [number, number], color: 'amber' as const, note: '실행 결과 이벤트 발행' },
    ],
  },
};
