// IPC main bcd7c0d · contracts/contracts/lib/LibGateway.sol
// 실제 commitParentFinality 함수에서 storage transition만 발췌했습니다.

library LibGateway {
    // 이 함수가 직접 거절하는 것은 같은 높이 또는 과거 높이입니다.
    // Hash ancestry와 parent view의 정당성은 이 함수 바깥의 책임입니다.
    function commitParentFinality(
        ParentFinality calldata finality
    ) internal returns (ParentFinality memory lastFinality) {
        GatewayActorStorage storage s =
            LibGatewayActorStorage.appStorage();

        uint256 lastHeight = s.latestParentHeight;
        if (lastHeight >= finality.height) {
            revert ParentFinalityAlreadyCommitted();
        }

        // 호출자가 새 hash와 비교할 수 있도록 직전 finality를 돌려줍니다.
        lastFinality = s.finalitiesMap[lastHeight];

        s.finalitiesMap[finality.height] = finality;
        s.latestParentHeight = finality.height;
    }
}
