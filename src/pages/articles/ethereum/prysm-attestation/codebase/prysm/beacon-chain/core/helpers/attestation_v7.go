// ComputeSubnetForAttestation returns the subnet for which the provided attestation will be broadcasted to.
// This differs from the spec definition by instead passing in the active validators indices in the attestation's
// given epoch.
//
// Spec pseudocode definition:
// def compute_subnet_for_attestation(committees_per_slot: uint64, slot: Slot, committee_index: CommitteeIndex) -> uint64:
//
//	"""
//	Compute the correct subnet for an attestation for Phase 0.
//	Note, this mimics expected future behavior where attestations will be mapped to their shard subnet.
//	"""
//	slots_since_epoch_start = uint64(slot % SLOTS_PER_EPOCH)
//	committees_since_epoch_start = committees_per_slot * slots_since_epoch_start
//
//	return uint64((committees_since_epoch_start + committee_index) % ATTESTATION_SUBNET_COUNT)
func ComputeSubnetForAttestation(activeValCount uint64, att ethpb.Att) uint64 {
	return ComputeSubnetFromCommitteeAndSlot(activeValCount, att.GetCommitteeIndex(), att.GetData().Slot)
}

// ComputeSubnetFromCommitteeAndSlot is a flattened version of ComputeSubnetForAttestation where we only pass in
// the relevant fields from the attestation as function arguments.
//
// Spec pseudocode definition:
// def compute_subnet_for_attestation(committees_per_slot: uint64, slot: Slot, committee_index: CommitteeIndex) -> uint64:
//
//	"""
//	Compute the correct subnet for an attestation for Phase 0.
//	Note, this mimics expected future behavior where attestations will be mapped to their shard subnet.
//	"""
//	slots_since_epoch_start = uint64(slot % SLOTS_PER_EPOCH)
//	committees_since_epoch_start = committees_per_slot * slots_since_epoch_start
//
//	return uint64((committees_since_epoch_start + committee_index) % ATTESTATION_SUBNET_COUNT)
func ComputeSubnetFromCommitteeAndSlot(activeValCount uint64, comIdx primitives.CommitteeIndex, attSlot primitives.Slot) uint64 {
	return ComputeSubnetForCommitteesPerSlot(SlotCommitteeCount(activeValCount), comIdx, attSlot)
}

// ComputeSubnetForCommitteesPerSlot is ComputeSubnetFromCommitteeAndSlot with the
// committees-per-slot supplied directly, skipping the active-validator-count lookup.
func ComputeSubnetForCommitteesPerSlot(committeesPerSlot uint64, comIdx primitives.CommitteeIndex, attSlot primitives.Slot) uint64 {
	slotSinceStart := slots.SinceEpochStarts(attSlot)
	commsSinceStart := uint64(slotSinceStart.Mul(committeesPerSlot))
	return (commsSinceStart + uint64(comIdx)) % params.BeaconConfig().AttestationSubnetCount
}
