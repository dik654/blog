// Source: FilOzone/pdp v3.5.0 (commit 4d6b30f95845ca5ef35f9430a3a3f435af54d291)
// File: src/PDPVerifier.sol
// Exact control-flow excerpt. Unrelated declarations and fee logic are omitted.

function provePossession(uint256 setId, IPDPTypes.Proof[] calldata proofs) public payable {
    uint256 nProofs = proofs.length;
    require(msg.sender == storageProvider[setId], "Only the storage provider can prove possession");
    require(nProofs > 0, "empty proof");
    {
        uint256 challengeEpoch = nextChallengeEpoch[setId];
        require(block.number >= challengeEpoch, "premature proof");
        require(challengeEpoch != NO_CHALLENGE_SCHEDULED, "no challenge scheduled");
    }

    IPDPTypes.PieceIdAndOffset[] memory challenges =
        new IPDPTypes.PieceIdAndOffset[](proofs.length);

    uint256 seed = drawChallengeSeed(setId);
    {
        uint256 leafCount = challengeRange[setId];
        bool legacy = _usesLegacyPieceStorage(setId);
        uint256 sumTreeTop = 256 - BitOps.clz(_pieceCount(setId, legacy));
        for (uint64 i = 0; i < nProofs; i++) {
            bytes memory payload = abi.encodePacked(seed, setId, i);
            uint256 challengeIdx = uint256(keccak256(payload)) % leafCount;

            challenges[i] =
                _findAndVerifyProof(setId, proofs[i], challengeIdx, sumTreeTop, legacy);
        }
    }

    // Proof-fee calculation is omitted from this excerpt.
    dataSetLastProvenEpoch[setId] = block.number;

    {
        address listenerAddr = dataSetListener[setId];
        if (listenerAddr != address(0)) {
            PDPListener(listenerAddr).possessionProven(
                setId,
                dataSetLeafCount[setId],
                seed,
                proofs.length
            );
        }
    }

    emit PossessionProven(setId, challenges);
}

function _findAndVerifyProof(
    uint256 setId,
    IPDPTypes.Proof calldata proof,
    uint256 challengeIdx,
    uint256 sumTreeTop,
    bool legacy
) internal view returns (IPDPTypes.PieceIdAndOffset memory challenge) {
    challenge = findOnePieceId(setId, challengeIdx, sumTreeTop, legacy);
    (bytes32 root, uint256 height) = _proofRootAndHeight(setId, challenge.pieceId, legacy);
    require(
        MerkleVerify.verify(proof.proof, root, proof.leaf, challenge.offset, height),
        "proof did not verify"
    );
}

function getRandomness(uint256 epoch) public view returns (uint256) {
    return FVMRandom.getBeaconRandomness(epoch);
}

function drawChallengeSeed(uint256 setId) internal view returns (uint256) {
    return getRandomness(nextChallengeEpoch[setId]);
}

function findOnePieceId(uint256 setId, uint256 leafIndex, uint256 top, bool legacy)
    internal
    view
    returns (IPDPTypes.PieceIdAndOffset memory)
{
    require(leafIndex < dataSetLeafCount[setId], "Leaf index out of bounds");
    uint256 pieceCount = _pieceCount(setId, legacy);
    uint256 searchPtr = (1 << top) - 1;
    uint256 acc = 0;

    uint256 candidate;
    for (uint256 h = top; h > 0; h--) {
        if (searchPtr >= pieceCount) {
            searchPtr -= 1 << (h - 1);
            continue;
        }

        uint256 sum = _sumTreeValue(setId, searchPtr, legacy);
        candidate = acc + sum;
        if (candidate <= leafIndex) {
            acc += sum;
            searchPtr += 1 << (h - 1);
        } else {
            searchPtr -= 1 << (h - 1);
        }
    }
    candidate = acc + _sumTreeValue(setId, searchPtr, legacy);
    if (candidate <= leafIndex) {
        return IPDPTypes.PieceIdAndOffset(searchPtr + 1, leafIndex - candidate);
    }
    return IPDPTypes.PieceIdAndOffset(searchPtr, leafIndex - acc);
}
