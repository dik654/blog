// FilOzone/filecoin-services v1.5.0
// service_contracts/src/modules/FWSSProvingModule.sol
// Exact source control-flow excerpt. Imports, inheritance and unrelated functions are omitted.

function possessionProven(
    uint256 dataSetId,
    uint256, /*challengedLeafCount*/
    uint256, /*seed*/
    uint256 challengeCount
)
    external
    onlyPDPVerifier
{
    LibServiceLifecycleGuards.requirePaymentNotBeyondEndEpoch(dataSetId, dataSetInfo[dataSetId].pdpEndEpoch);

    if (provenThisPeriod[dataSetId]) {
        revert Errors.ProofAlreadySubmitted(dataSetId);
    }

    uint256 expectedChallengeCount = CHALLENGES_PER_PROOF;
    if (challengeCount < expectedChallengeCount) {
        revert Errors.InvalidChallengeCount(dataSetId, expectedChallengeCount, challengeCount);
    }

    if (provingDeadlines[dataSetId] == NO_PROVING_DEADLINE) {
        revert Errors.ProvingNotStarted(dataSetId);
    }

    // check for proof outside of challenge window
    if (provingDeadlines[dataSetId] < block.number) {
        revert Errors.ProvingPeriodPassed(dataSetId, provingDeadlines[dataSetId], block.number);
    }

    uint256 windowStart = provingDeadlines[dataSetId] - challengeWindowSize;
    if (windowStart > block.number) {
        revert Errors.ChallengeWindowTooEarly(dataSetId, windowStart, block.number);
    }
    provenThisPeriod[dataSetId] = true;
    uint256 currentPeriod = getProvingPeriodForEpoch(dataSetId, block.number);
    provenPeriods[dataSetId][currentPeriod >> 8] |= 1 << (currentPeriod & 255);
}

// nextProvingPeriod(), getProvingPeriodForEpoch() and railTerminated() omitted.

function validatePayment(
    uint256 railId,
    uint256 proposedAmount,
    uint256 fromEpoch,
    uint256 toEpoch,
    uint256 /* rate */
)
    external
    view
    override
    returns (ValidationResult memory result)
{
    uint256 dataSetId = railToDataSet[railId];
    if (dataSetId == 0) {
        return
            ValidationResult({modifiedAmount: 0, settleUpto: toEpoch, note: "Rail not associated with a data set"});
    }

    uint256 totalEpochsRequested = toEpoch - fromEpoch;
    require(totalEpochsRequested > 0, Errors.InvalidEpochRange(fromEpoch, toEpoch));

    uint256 activationEpoch = provingActivationEpoch[dataSetId];
    if (activationEpoch == 0 || toEpoch <= activationEpoch) {
        return ValidationResult({modifiedAmount: 0, settleUpto: toEpoch, note: "No proving activity"});
    }

    (uint256 provenEpochCount, uint256 settleUpTo) =
        _findProvenEpochs(dataSetId, fromEpoch, toEpoch, activationEpoch);

    if (provenEpochCount == 0) {
        return ValidationResult({
            modifiedAmount: 0, settleUpto: settleUpTo, note: "No proven epochs in the requested range"
        });
    }

    uint256 modifiedAmount = (proposedAmount * provenEpochCount) / totalEpochsRequested;

    return ValidationResult({modifiedAmount: modifiedAmount, settleUpto: settleUpTo, note: ""});
}

function _findProvenEpochs(uint256 dataSetId, uint256 fromEpoch, uint256 toEpoch, uint256 activationEpoch)
    internal
    view
    returns (uint256 provenEpochCount, uint256 settleUpTo)
{
    require(toEpoch >= activationEpoch && toEpoch <= block.number, Errors.InvalidEpochRange(fromEpoch, toEpoch));
    if (fromEpoch < activationEpoch) {
        fromEpoch = activationEpoch;
    }
    settleUpTo = fromEpoch;
    uint256 provingPeriod = maxProvingPeriod;
    uint256 startingPeriod = LibProving.provingPeriodForEpoch(activationEpoch, fromEpoch + 1, provingPeriod);
    uint256 endingPeriod = LibProving.provingPeriodForEpoch(activationEpoch, toEpoch, provingPeriod);
    uint256 deadline = LibProving.calcPeriodDeadline(activationEpoch, startingPeriod, provingPeriod);
    for (uint256 period = startingPeriod; period <= endingPeriod; period++) {
        if (_isPeriodProven(dataSetId, period)) {
            uint256 settleStart = Math.max(deadline - provingPeriod, fromEpoch);
            settleUpTo = Math.min(toEpoch, deadline);
            provenEpochCount += settleUpTo - settleStart;
        } else if (deadline < block.number) {
            // Faulted: deadline passed, no proof, advance with zero payment
            settleUpTo = Math.min(toEpoch, deadline);
        } //else { } // Open: deadline hasn't passed, proof may still arrive, block settlement
        deadline += provingPeriod;
    }

    return (provenEpochCount, settleUpTo);
}
