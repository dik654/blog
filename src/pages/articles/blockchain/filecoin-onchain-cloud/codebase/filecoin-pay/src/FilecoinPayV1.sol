// FilOzone/filecoin-pay 저장소 · src/FilecoinPayV1.sol (commit 04ded6a,
// 2026년 8월 기준 이 글이 인용하는 SHA). 전체 1822줄 중 이 글이 다루는
// Account·Rail struct와 settleRail·_settleSegmentGross만 발췌했습니다.
// Rate-change queue·termination·fee 분배 세부 로직은 생략했습니다.
// 본문 대응: payment-rail section의 "Payment rail의 다섯 장부 항목"
// (Deposit·Operator allowance·Variable rate·Fixed lockup)과 그 정산 로직.

// article의 "Deposit" — payer가 실제로 맡겨 둔 잔액
struct Account {
    uint256 funds; // article의 Deposit
    uint256 lockupCurrent;
    uint256 lockupRate;
    uint256 lockupLastSettledAt; // lockup이 정산된 마지막 epoch
}

// article의 "Variable rate"·"Fixed lockup" — 두 값이 정확히 이 struct의
// paymentRate·lockupFixed field다.
struct Rail {
    IERC20 token;
    address from; // payer
    address to; // payee
    address operator; // article의 "Operator allowance"를 실제로 쓰는 주체
    address validator; // WarmStorageService 같은 외부 검증자 — proof 결과를 반영
    uint256 paymentRate; // article의 Variable rate — epoch당 누적 지급 속도
    uint256 lockupPeriod;
    uint256 lockupFixed; // article의 Fixed lockup
    uint256 settledUpTo; // 이 rail이 정산된 마지막 epoch
    RateChangeQueue.Queue rateChangeQueue;
    uint256 endEpoch; // 0이면 아직 종료되지 않음
    uint256 commissionRateBps;
    address serviceFeeRecipient;
}

// article의 "Operator allowance" — operator가 payer를 대신해 만들 수 있는
// rail의 상한
struct OperatorApproval {
    bool isApproved;
    uint256 rateAllowance;
    uint256 lockupAllowance;
    uint256 rateUsage;
    uint256 lockupUsage;
    uint256 maxLockupPeriod;
}

// settleRail — 외부에서 호출하는 진입점. 실제 계산은 settleRailInternal에
// 위임한다.
function settleRail(uint256 railId, uint256 untilEpoch)
    public
    returns (
        uint256 totalSettledAmount,
        uint256 totalNetPayeeAmount,
        uint256 totalOperatorCommission,
        uint256 totalNetworkFee,
        uint256 finalSettledEpoch,
        string memory note
    )
{
    return settleRailInternal(railId, untilEpoch, false);
}

function settleRailInternal(uint256 railId, uint256 untilEpoch, bool skipValidation)
    internal
    returns (
        uint256 totalSettledAmount,
        uint256 totalNetPayeeAmount,
        uint256 totalOperatorCommission,
        uint256 totalNetworkFee,
        uint256 finalSettledEpoch,
        string memory note
    )
{
    Rail storage rail = rails[railId];
    Account storage payer = accounts[rail.token][rail.from];

    // article의 "어디까지 지급했는가" — settledUpTo(startEpoch)에서
    // maxSettlementEpoch까지만 이번 호출에서 정산한다.
    uint256 startEpoch = rail.settledUpTo;
    uint256 maxSettlementEpoch = min(untilEpoch, payer.lockupLastSettledAt);
    if (startEpoch >= maxSettlementEpoch) {
        return (0, 0, 0, 0, startEpoch, "already settled up to epoch");
    }

    (totalSettledAmount, note) =
        _settleSegmentGross(railId, startEpoch, maxSettlementEpoch, rail.paymentRate, skipValidation);
}

// _settleSegmentGross — article의 "Rate가 epoch당 2이고 10 epochs가
// proven이면 variable 지급 기여는 20"이 정확히 이 grossSettledAmount =
// rate * duration 계산이다. validator(WarmStorageService)가 proof 결과에
//따라 이 값을 다시 좁힐 수 있다는 점이 article의 "open이나 faulted
// epoch를 proven처럼 곱하지 않는다"에 대응한다.
function _settleSegmentGross(
    uint256 railId,
    uint256 epochStart,
    uint256 epochEnd,
    uint256 rate,
    bool skipValidation
) internal returns (uint256 grossSettledAmount, string memory note) {
    Rail storage rail = rails[railId];

    if (rate == 0) {
        rail.settledUpTo = epochEnd;
        return (0, "Zero rate payment rail");
    }

    uint256 duration = epochEnd - epochStart;
    grossSettledAmount = rate * duration; // article의 rate * proven epoch 수
    uint256 settledUntilEpoch = epochEnd;

    // article의 proof-aware 조정 — validator(예: WarmStorageService)가
    // 실제 proof 결과를 보고 최종 정산 구간과 금액을 좁힐 수 있다.
    if (rail.validator != address(0) && !skipValidation) {
        IValidator validator = IValidator(rail.validator);
        IValidator.ValidationResult memory result =
            validator.validatePayment(railId, grossSettledAmount, epochStart, epochEnd, rate);

        settledUntilEpoch = result.settleUpto;
        grossSettledAmount = result.modifiedAmount;
        note = result.note;
    }

    rail.settledUpTo = settledUntilEpoch;
}
