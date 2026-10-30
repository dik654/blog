// OffchainLabs Prysm v7.3.1 @ 96d418cd964b083e37519a9df274030a1beac7db
// beacon-chain/db/kv/kv.go — focused source excerpt

// Store defines an implementation of the Prysm Database interface
// using BoltDB as the underlying persistent kv-store for Ethereum Beacon Nodes.
type Store struct {
	db                  *bolt.DB
	databasePath        string
	blockCache          *ristretto.Cache[string, interfaces.ReadOnlySignedBeaconBlock]
	validatorEntryCache *ristretto.Cache[[]byte, *ethpb.Validator]
	stateSummaryCache   *stateSummaryCache
	stateDiffCache      *stateDiffCache
	archiveStatus       *ArchiveStatus
	archiveLock         sync.RWMutex
	ctx                 context.Context
}

var Buckets = [][]byte{
	blocksBucket,
	stateBucket,
	chainMetadataBucket,
	checkpointBucket,
	stateSummaryBucket,
	stateValidatorsBucket,
	stateDiffBucket,
	hotStateSnapshotsBucket,
	archiveResumeSnapshotsBucket,
	// Indices buckets.
	blockSlotIndicesBucket,
	stateSlotIndicesBucket,
	blockParentRootIndicesBucket,
	finalizedBlockRootsIndexBucket,
	blockRootValidatorHashesBucket,
	// Migrations.
	migrationsBucket,
	executionPayloadEnvelopesBucket,
	executionPayloadEnvelopeBlockHashBucket,
}
