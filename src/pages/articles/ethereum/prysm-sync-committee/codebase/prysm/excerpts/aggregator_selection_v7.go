// IsSyncCommitteeAggregator checks whether the provided signature is for a valid
// aggregator.
//
// def is_sync_committee_aggregator(signature: BLSSignature) -> bool:
//
//	modulo = max(1, SYNC_COMMITTEE_SIZE // SYNC_COMMITTEE_SUBNET_COUNT // TARGET_AGGREGATORS_PER_SYNC_SUBCOMMITTEE)
//	return bytes_to_uint64(hash(signature)[0:8]) % modulo == 0
func IsSyncCommitteeAggregator(sig []byte) (bool, error) {
	if len(sig) != fieldparams.BLSSignatureLength {
		return false, errors.New("incorrect sig length")
	}

	cfg := params.BeaconConfig()
	modulo := max(1, cfg.SyncCommitteeSize/cfg.SyncCommitteeSubnetCount/cfg.TargetAggregatorsPerSyncSubcommittee)
	hashedSig := hash.Hash(sig)
	return bytesutil.FromBytes8(hashedSig[:8])%modulo == 0, nil
}
