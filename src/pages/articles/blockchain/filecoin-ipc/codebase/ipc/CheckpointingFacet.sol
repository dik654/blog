// IPC main bcd7c0d · contracts/contracts/gateway/router/CheckpointingFacet.sol
// 실제 source에서 checkpoint 기록과 message 실행이 갈라지는 지점을 읽도록
// import와 unrelated 함수만 생략한 학습용 발췌입니다.

struct BottomUpCheckpoint {
    AppHashBreakdown commitment;
    IpcEnvelope[] msgs;
    FullActivityRollup activity;
}

contract CheckpointingFacet is GatewayActorModifiers {
    event StateCommitmentCreated(
        uint64 checkpointHeight,
        AppHashBreakdown breakdown
    );

    // 이미 암호학적으로 검증된 checkpoint만 system actor 경계를 통과합니다.
    // 이 함수는 quorum을 새로 계산하지 않습니다.
    function commitCheckpoint(
        BottomUpCheckpoint calldata checkpoint
    ) external systemActorOnly {
        if (block.number <= s.lastestBottomUpCheckpointHeight) {
            revert CheckpointAlreadyExists();
        }

        emit StateCommitmentCreated(
            uint64(block.number),
            checkpoint.commitment
        );
        emit BottomUpBatchRecorded(
            uint64(block.number),
            checkpoint.msgs
        );
        emit ActivityRollupRecorded(
            uint64(block.number),
            checkpoint.activity
        );

        s.lastestBottomUpCheckpointHeight = uint64(block.number);
    }

    // Checkpoint event를 기록한 것과 message effect를 실행한 것은 다릅니다.
    // 실제 bottom-up message batch는 별도 호출에서 적용됩니다.
    function execBottomUpMsgBatch(IpcEnvelope[] calldata msgs) external {
        (bool subnetExists, Subnet storage subnet) =
            LibGateway.getSubnet(msg.sender);
        if (!subnetExists) {
            revert SubnetNotFound();
        }

        _execBottomUpMsgBatch(msgs, subnet);
    }

    function _execBottomUpMsgBatch(
        IpcEnvelope[] calldata msgs,
        Subnet storage subnet
    ) internal {
        uint256 totalValue;
        uint256 crossMsgLength = msgs.length;

        // 실행할 batch 전체 value를 먼저 계산합니다.
        for (uint256 i; i < crossMsgLength; ) {
            totalValue += msgs[i].value;
            unchecked {
                ++i;
            }
        }

        uint256 totalAmount = totalValue;

        // Child circulating supply보다 큰 release는 거절합니다.
        if (subnet.circSupply < totalAmount) {
            revert NotEnoughSubnetCircSupply();
        }

        subnet.circSupply -= totalAmount;
        LibGateway.applyMessages(subnet.id, msgs);
    }
}
