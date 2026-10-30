// ProcessAttestation processes attestation for vote accounting, it iterates around validator indices
// and update their votes accordingly.
func (f *ForkChoice) ProcessAttestation(ctx context.Context, validatorIndices []uint64, blockRoot [32]byte, slot primitives.Slot, payloadStatus bool) {
	_, span := trace.StartSpan(ctx, "doublyLinkedForkchoice.ProcessAttestation")
	defer span.End()

	// ...
	for _, index := range validatorIndices {
		// Validator indices will grow the vote cache.
		for index >= uint64(len(f.votes)) {
			f.votes = append(f.votes, Vote{currentRoot: params.BeaconConfig().ZeroHash, nextRoot: params.BeaconConfig().ZeroHash})
		}

		vote := &f.votes[index]
		targetEpoch := slots.ToEpoch(slot)
		nextEpoch := slots.ToEpoch(vote.nextSlot)

		// A zero next root means no prior message, spec update_latest_messages semantics.
		firstVote := vote.nextRoot == params.BeaconConfig().ZeroHash
		if firstVote || targetEpoch > nextEpoch {
			vote.nextSlot = slot
			vote.nextRoot = blockRoot
			vote.nextPayloadStatus = payloadStatus
		}
	}

	processedAttestationCount.Inc()
}
