// FilOzone/filecoin-pay v1.0.0 · src/FilecoinPayV1.sol
// Exact source control-flow excerpt. Imports, events, mappings and unrelated branches are omitted.

struct Account {
    uint256 funds;
    uint256 lockupCurrent;
    uint256 lockupRate;
    // epoch up to and including which lockup has been settled for the account
    uint256 lockupLastSettledAt;
}

struct Rail {
    IERC20 token;
    address from;
    address to;
    address operator;
    address validator;
    uint256 paymentRate;
    uint256 lockupPeriod;
    uint256 lockupFixed;
    // epoch up to and including which this rail has been settled
    uint256 settledUpTo;
    RateChangeQueue.Queue rateChangeQueue;
    uint256 endEpoch; // Final epoch up to which the rail can be settled (0 if not terminated)
    uint256 commissionRateBps;
    address serviceFeeRecipient;
}

struct OperatorApproval {
    bool isApproved;
    uint256 rateAllowance;
    uint256 lockupAllowance;
    uint256 rateUsage;
    uint256 lockupUsage;
    uint256 maxLockupPeriod;
}

function settleRail(uint256 railId, uint256 untilEpoch)
    public
    nonReentrant
    validateRailActive(railId)
    settleAccountLockupBeforeAndAfterForRail(railId, false, 0)
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

// settleRailInternal() chooses (settledUpTo, maximum eligible epoch] and rate segments.

function _settleSegmentGross(
    uint256 railId,
    uint256 epochStart,
    uint256 epochEnd,
    uint256 rate,
    bool skipValidation
) internal returns (uint256 grossSettledAmount, string memory note) {
    Rail storage rail = rails[railId];
    Account storage payer = accounts[rail.token][rail.from];

    if (rate == 0) {
        rail.settledUpTo = epochEnd;
        return (0, "Zero rate payment rail");
    }

    // Calculate the default settlement values (without validation)
    uint256 duration = epochEnd - epochStart;
    grossSettledAmount = rate * duration;
    uint256 settledUntilEpoch = epochEnd;
    note = "";

    // If this rail has an validator and we're not skipping validation, let it decide on the final settlement amount
    if (rail.validator != address(0) && !skipValidation) {
        IValidator validator = IValidator(rail.validator);
        IValidator.ValidationResult memory result =
            validator.validatePayment(railId, grossSettledAmount, epochStart, epochEnd, rate);

        require(
            result.settleUpto <= epochEnd,
            Errors.ValidatorSettledBeyondSegmentEnd(railId, epochEnd, result.settleUpto)
        );
        require(
            result.settleUpto >= epochStart,
            Errors.ValidatorSettledBeforeSegmentStart(railId, epochStart, result.settleUpto)
        );

        settledUntilEpoch = result.settleUpto;
        grossSettledAmount = result.modifiedAmount;
        note = result.note;

        uint256 maxAllowedAmount = rate * (settledUntilEpoch - epochStart);
        require(
            result.modifiedAmount <= maxAllowedAmount,
            Errors.ValidatorModifiedAmountExceedsMaximum(railId, maxAllowedAmount, result.modifiedAmount)
        );
    }

    // Funds and lockup checks plus balance transfers are omitted.
    rail.settledUpTo = settledUntilEpoch;
}
