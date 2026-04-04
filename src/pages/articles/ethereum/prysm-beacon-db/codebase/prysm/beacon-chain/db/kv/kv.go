// beacon-chain/db/kv/kv.go — Prysm v5.x

// Store is the BoltDB-backed key-value store for beacon chain data.
type Store struct {
	db           *bolt.DB
	databasePath string
	blockCache   *ristretto.Cache
	stateCache   *ristretto.Cache
	stateSummary *cache.StateSummaryCache
}

// NewKVStore initializes a new BoltDB-backed KV store.
func NewKVStore(ctx context.Context, dirPath string) (*Store, error) {
	db, err := bolt.Open(
		path.Join(dirPath, "beaconchain.db"),
		params.BeaconIoConfig().ReadWritePermissions,
		&bolt.Options{Timeout: 1 * time.Second},
	)
	if err != nil {
		return nil, err
	}
	// Create buckets if not exist
	if err := db.Update(func(tx *bolt.Tx) error {
		for _, bucket := range Buckets {
			if _, err := tx.CreateBucketIfNotExists(bucket); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}
	kv := &Store{db: db, databasePath: dirPath}
	kv.blockCache, _ = ristretto.NewCache(&ristretto.Config{MaxCost: 1 << 23})
	kv.stateCache, _ = ristretto.NewCache(&ristretto.Config{MaxCost: 1 << 23})
	return kv, nil
}
