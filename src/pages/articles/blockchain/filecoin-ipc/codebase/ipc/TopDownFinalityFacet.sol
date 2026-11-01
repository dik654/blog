// IPC main bcd7c0d · contracts/contracts/gateway/router/TopDownFinalityFacet.sol
// 실제 source의 호출 경계를 유지하고, 읽는 순서를 알려 주는 한글 주석만 더했습니다.

contract TopDownFinalityFacet is GatewayActorModifiers {
    // 이 facet은 finality를 직접 판별하지 않고 LibGateway의 저장 경계를 호출합니다.
    // 이전 finality를 돌려주는 이유는 호출자가 일관성·reorg를 비교할 수 있게 하기 위해서입니다.
    function commitParentFinality(
        ParentFinality calldata finality
    ) external systemActorOnly returns (
        bool hasCommittedBefore,
        ParentFinality memory previousFinality
    ) {
        previousFinality = LibGateway.commitParentFinality(finality);
        hasCommittedBefore = previousFinality.height != 0;
    }

    // Parent에서 관찰한 validator change는 먼저 tracker에 쌓입니다.
    function storeValidatorChanges(
        PowerChangeRequest[] calldata changeRequests
    ) external systemActorOnly {
        s.validatorsTracker.batchStoreChange(changeRequests);
    }

    // Finality와 함께 확인된 change set을 child membership으로 적용합니다.
    function applyFinalityChanges()
        external
        systemActorOnly
        returns (uint64 configurationNumber)
    {
        configurationNumber =
            s.validatorsTracker.changes.nextConfigurationNumber - 1;

        if (
            (configurationNumber + 1) ==
            s.validatorsTracker.changes.startConfigurationNumber
        ) {
            return 0;
        }

        s.validatorsTracker.confirmChange(configurationNumber);

        // 확인된 tracker에서 active validators와 현재 power를 다시 읽습니다.
        address[] memory validators =
            s.validatorsTracker.validators.listActiveValidators();
        uint256 vLength = validators.length;
        Validator[] memory vs = new Validator[](vLength);
        for (uint256 i; i < vLength; ) {
            address addr = validators[i];
            ValidatorInfo storage info =
                s.validatorsTracker.validators.validators[addr];

            uint256 weight = info.currentPower;
            vs[i] = Validator({
                weight: weight,
                addr: addr,
                metadata: info.metadata
            });
            unchecked {
                ++i;
            }
        }

        // 새 power table과 configuration number를 child membership에 반영합니다.
        LibGateway.updateMembership(Membership({
            configurationNumber: configurationNumber,
            validators: vs
        }));
        return configurationNumber;
    }
}
