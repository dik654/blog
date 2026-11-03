// Source: FilOzone/pdp v3.5.0 (commit 4d6b30f95845ca5ef35f9430a3a3f435af54d291)
// File: src/SimplePDPService.sol
// Exact listener excerpt. Unrelated callbacks are omitted.

function possessionProven(
    uint256 dataSetId,
    uint256, /*challengedLeafCount*/
    uint256, /*seed*/
    uint256 challengeCount
)
    external
    onlyPDPVerifier
{
    if (provenThisPeriod[dataSetId]) {
        revert("Only one proof of possession allowed per proving period. Open a new proving period.");
    }
    if (challengeCount < getChallengesPerProof()) {
        revert("Invalid challenge count < 5");
    }
    if (provingDeadlines[dataSetId] == NO_PROVING_DEADLINE) {
        revert("Proving not yet started");
    }
    if (provingDeadlines[dataSetId] < block.number) {
        revert("Current proving period passed. Open a new proving period.");
    }

    if (provingDeadlines[dataSetId] - challengeWindow() > block.number) {
        revert("Too early. Wait for challenge window to open");
    }
    provenThisPeriod[dataSetId] = true;
}

function nextProvingPeriod(
    uint256 dataSetId,
    uint256 challengeEpoch,
    uint256, /*leafCount*/
    bytes calldata
)
    external
    onlyPDPVerifier
{
    if (provingDeadlines[dataSetId] == NO_PROVING_DEADLINE) {
        uint256 firstDeadline = block.number + getMaxProvingPeriod();
        if (challengeEpoch < firstDeadline - challengeWindow() || challengeEpoch > firstDeadline) {
            revert("Next challenge epoch must fall within the next challenge window");
        }
        provingDeadlines[dataSetId] = firstDeadline;
        provenThisPeriod[dataSetId] = false;
        return;
    }

    uint256 prevDeadline = provingDeadlines[dataSetId] - getMaxProvingPeriod();
    if (block.number <= prevDeadline) {
        revert("One call to nextProvingPeriod allowed per proving period");
    }

    uint256 periodsSkipped;
    if (block.number <= provingDeadlines[dataSetId]) {
        periodsSkipped = 0;
    } else {
        periodsSkipped = (block.number - (provingDeadlines[dataSetId] + 1))
            / getMaxProvingPeriod();
    }

    uint256 nextDeadline;
    if (challengeEpoch == NO_CHALLENGE_SCHEDULED) {
        nextDeadline = NO_PROVING_DEADLINE;
    } else {
        nextDeadline = provingDeadlines[dataSetId]
            + getMaxProvingPeriod() * (periodsSkipped + 1);
        if (challengeEpoch < nextDeadline - challengeWindow() || challengeEpoch > nextDeadline) {
            revert("Next challenge epoch must fall within the next challenge window");
        }
    }
    uint256 faultPeriods = periodsSkipped;
    if (!provenThisPeriod[dataSetId]) {
        faultPeriods += 1;
    }
    if (faultPeriods > 0) {
        emit FaultRecord(dataSetId, faultPeriods, provingDeadlines[dataSetId]);
    }
    provingDeadlines[dataSetId] = nextDeadline;
    provenThisPeriod[dataSetId] = false;
}
