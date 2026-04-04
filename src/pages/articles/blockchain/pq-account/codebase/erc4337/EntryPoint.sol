// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

contract EntryPoint {
    function handleOps(
        PackedUserOperation[] calldata ops,
        address payable beneficiary
    ) public {
        uint256 opslen = ops.length;
        UserOpInfo[] memory opInfos = new UserOpInfo[](opslen);

        // Phase 1: 전체 UserOp 사전 검증
        for (uint256 i = 0; i < opslen; i++) {
            UserOpInfo memory opInfo = opInfos[i];
            (
                uint256 validationData,
                uint256 pmValidationData
            ) = _validatePrepayment(i, ops[i], opInfo);
            _validateAccountAndPaymasterValidationData(
                i, validationData, pmValidationData, address(0)
            );
        }

        // Phase 2: 검증 통과한 UserOp 실행
        uint256 collected = 0;
        for (uint256 i = 0; i < opslen; i++) {
            collected += _executeUserOp(i, ops[i], opInfos[i]);
        }

        // Phase 3: 가스비 정산 → beneficiary (번들러)
        _compensate(beneficiary, collected);
    }

    function _validatePrepayment(
        uint256 opIndex,
        PackedUserOperation calldata op,
        UserOpInfo memory opInfo
    ) internal returns (uint256, uint256) {
        // nonce 확인
        require(op.nonce == getNonce(op.sender, 0), "AA25 invalid nonce");
        // nonce 증가: 7 → 8
        _incrementNonce(op.sender);
        // 예치금 확인 및 차감
        uint256 missingFunds = op.maxFeePerGas * op.callGasLimit
            - deposits[op.sender];
        // 스마트 계정의 validateUserOp 호출
        uint256 validationData = IAccount(op.sender)
            .validateUserOp(op, getUserOpHash(op), missingFunds);
        require(validationData == 0, "AA24 signature error");
        return (validationData, 0);
    }

    function _executeUserOp(
        uint256 opIndex,
        PackedUserOperation calldata op,
        UserOpInfo memory opInfo
    ) internal returns (uint256 collected) {
        (bool success, bytes memory result) =
            op.sender.call{gas: op.callGasLimit}(op.callData);
        // callData 디코딩: transfer(to=0x5678, amount=500 USDC)
        // 상태 변경: balances[sender] -= 500, balances[to] += 500
        emit UserOperationEvent(
            getUserOpHash(op), op.sender, address(0),
            op.nonce, success, opInfo.actualGasCost
        );
        collected = opInfo.actualGasCost;
    }
}
