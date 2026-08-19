// FilOzone/filecoin-services 저장소 · service_contracts/src/FilecoinWarmStorageService.sol
// (commit a391c1c, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 1662줄 중 이
// 글이 다루는 DataSetInfo struct와 possessionProven·nextProvingPeriod만
// 발췌했습니다. Dataset 생성·payment rate 갱신·CDN add-on 로직은
// 생략했습니다.
// 본문 대응: dataset-service section의 "Dataset record", proof-settlement
// section의 "Period state — 판정 전/통과/deadline 놓침".

// === Dataset record ===
// article의 dataset record 다섯 role(payer/payee/provider, rail 연결,
// commission, lifecycle)이 정확히 이 struct의 field들이다.
struct DataSetInfo {
    uint256 pdpRailId; // PDP payment rail의 ID — article의 "payment와 같은 주문을 가리키는지" 연결점
    uint256 cacheMissRailId; // CDN add-on용 cache-miss rail ID
    uint256 cdnRailId; // CDN add-on용 CDN rail ID
    address payer; // article의 "누가" — storage 비용을 지불하는 주체
    address payee; // SP의 수취 주소
    address serviceProvider; // article의 "누구에게" — 현재 dataset을 맡은 provider
    uint256 commissionBps; // Operator commission rate(basis points)
    uint256 clientDataSetId; // Client 쪽 dataset 식별자
    uint256 pdpEndEpoch; // 0이면 아직 PDP rail이 종료되지 않음
    uint256 providerId; // ServiceProviderRegistry의 provider ID
    uint96 pendingOneTimePayments; // updateStorageRates로 flush되기 전 누적된 fee
    uint96 lifecycleReserveBalance; // rail의 lockupFixed를 local mirror한 값
}

// possession proven checks for correct challenge count and reverts if too low
// it also checks that proofs are not late and emits a fault record if so
//
// article의 Period state "판정 전"(NO_PROVING_DEADLINE)·"통과"(provenThisPeriod
// =true)·"deadline 놓침"(provingDeadlines < block.number → revert) 세 값이
// 이 함수 하나의 분기로 나타난다.
function possessionProven(
    uint256 dataSetId,
    uint256, /*challengedLeafCount*/
    uint256, /*seed*/
    uint256 challengeCount
)
    external
    onlyPDPVerifier
{
    requirePaymentNotBeyondEndEpoch(dataSetId);

    // article의 "이미 판정된 period에 다시 제출 불가"
    if (provenThisPeriod[dataSetId]) {
        revert Errors.ProofAlreadySubmitted(dataSetId);
    }

    uint256 expectedChallengeCount = CHALLENGES_PER_PROOF;
    if (challengeCount < expectedChallengeCount) {
        revert Errors.InvalidChallengeCount(dataSetId, expectedChallengeCount, challengeCount);
    }

    // article의 "판정 전" — proving이 아직 시작되지 않은 dataset
    if (provingDeadlines[dataSetId] == NO_PROVING_DEADLINE) {
        revert Errors.ProvingNotStarted(dataSetId);
    }

    // article의 "deadline을 놓침" — challenge window(deadline) 밖의 제출은 거절
    if (provingDeadlines[dataSetId] < block.number) {
        revert Errors.ProvingPeriodPassed(dataSetId, provingDeadlines[dataSetId], block.number);
    }

    uint256 windowStart = provingDeadlines[dataSetId] - challengeWindowSize;
    if (windowStart > block.number) {
        revert Errors.ChallengeWindowTooEarly(dataSetId, windowStart, block.number);
    }

    // article의 "통과" — 이 period를 proven으로 확정
    provenThisPeriod[dataSetId] = true;
    uint256 currentPeriod = getProvingPeriodForEpoch(dataSetId, block.number);
    provenPeriods[dataSetId][currentPeriod >> 8] |= 1 << (currentPeriod & 255);
}

// nextProvingPeriod checks for unsubmitted proof in which case it emits a fault event
//
// article의 "판정 전"에서 다음 period로 넘어가는 rollover 로직 —
// provenThisPeriod가 false로 남아 있던 period는 여기서 fault로 기록된다.
function nextProvingPeriod(uint256 dataSetId, uint256 challengeEpoch, uint256 leafCount, bytes calldata)
    external
    onlyPDPVerifier
{
    // ... deadline 계산(첫 활성화·재활성화 분기)은 생략 ...

    uint256 periodsSkipped;
    if (block.number <= provingDeadlines[dataSetId]) {
        periodsSkipped = 0;
    } else {
        periodsSkipped = (block.number - (provingDeadlines[dataSetId] + 1)) / maxProvingPeriod;
    }

    uint256 faultPeriods = periodsSkipped;
    // article의 "deadline을 놓침" — 이번 period도 아직 proven되지 않았다면
    // fault 대상에 포함
    if (!provenThisPeriod[dataSetId]) {
        faultPeriods += 1;
    }
    if (faultPeriods > 0) {
        emit FaultRecord(dataSetId, faultPeriods, provingDeadlines[dataSetId]);
    }

    // 다음 period로 넘어가며 "판정 전" 상태로 초기화
    provingDeadlines[dataSetId] = provingDeadlines[dataSetId] + maxProvingPeriod * (periodsSkipped + 1);
    provenThisPeriod[dataSetId] = false;
}
