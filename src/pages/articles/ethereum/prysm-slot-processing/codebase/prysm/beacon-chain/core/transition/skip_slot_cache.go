// OffchainLabs/prysm v7.3.1 @ 96d418cd
// 두 공식 파일의 연속 구간을 파일별로 그대로 발췌했습니다.

// beacon-chain/core/transition/skip_slot_cache.go

// SkipSlotCache exists for the unlikely scenario that is a large gap between the head state and
// the current slot. If the beacon chain were ever to be stalled for several epochs, it may be
// difficult or impossible to compute the appropriate beacon state for assignments within a
// reasonable amount of time.
var SkipSlotCache = cache.NewSkipSlotCache()

// The key for skip slot cache is mixed between state root and state slot.
// state root is in the mix to defend against different forks with same skip slots
// to hit the same cache. We don't want beacon states mixed up between different chains.
func cacheKey(_ context.Context, state state.ReadOnlyBeaconState) ([32]byte, error) {
	bh := state.LatestBlockHeader()
	if bh == nil {
		return [32]byte{}, errors.New("block head in state can't be nil")
	}
	r, err := bh.HashTreeRoot()
	if err != nil {
		return [32]byte{}, err
	}
	return hash.Hash(append(bytesutil.Bytes32(uint64(state.Slot())), r[:]...)), nil
}

// beacon-chain/cache/skip_slot_cache.go

// SkipSlotCache is used to store the cached results of processing skip slots in transition.ProcessSlots.
type SkipSlotCache struct {
	cache      *lru.Cache
	lock       sync.RWMutex
	disabled   bool // Allow for programmatic toggling of the cache, useful during initial sync.
	inProgress map[[32]byte]bool
}

// NewSkipSlotCache initializes the map and underlying cache.
func NewSkipSlotCache() *SkipSlotCache {
	return &SkipSlotCache{
		cache:      lruwrpr.New(8),
		inProgress: make(map[[32]byte]bool),
	}
}

// Get waits for any in progress calculation to complete before returning a
// cached response, if any.
func (c *SkipSlotCache) Get(ctx context.Context, r [32]byte) (state.BeaconState, error) {
	ctx, span := trace.StartSpan(ctx, "skipSlotCache.Get")
	defer span.End()
	if c.disabled {
		// Return a miss result if cache is not enabled.
		skipSlotCacheMiss.Inc()
		return nil, nil
	}

	delay := minDelay

	// Another identical request may be in progress already. Let's wait until
	// any in progress request resolves or our timeout is exceeded.
	inProgress := false
	for {
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}

		c.lock.RLock()
		if !c.inProgress[r] {
			c.lock.RUnlock()
			break
		}
		inProgress = true
		c.lock.RUnlock()

		// This increasing backoff is to decrease the CPU cycles while waiting
		// for the in progress boolean to flip to false.
		time.Sleep(time.Duration(delay) * time.Nanosecond)
		delay *= delayFactor
		delay = min(delay, maxDelay)
	}
	span.SetAttributes(trace.BoolAttribute("inProgress", inProgress))

	item, exists := c.cache.Get(r)

	if exists && item != nil {
		skipSlotCacheHit.Inc()
		span.SetAttributes(trace.BoolAttribute("hit", true))
		return item.(state.BeaconState).Copy(), nil
	}
	skipSlotCacheMiss.Inc()
	span.SetAttributes(trace.BoolAttribute("hit", false))
	return nil, nil
}

// MarkInProgress a request so that any other similar requests will block on
// Get until MarkNotInProgress is called.
func (c *SkipSlotCache) MarkInProgress(r [32]byte) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	if c.inProgress[r] {
		return ErrAlreadyInProgress
	}
	c.inProgress[r] = true
	return nil
}

// MarkNotInProgress will release the lock on a given request. This should be
// called after put.
func (c *SkipSlotCache) MarkNotInProgress(r [32]byte) {
	c.lock.Lock()
	defer c.lock.Unlock()

	delete(c.inProgress, r)
}

// Put the response in the cache.
func (c *SkipSlotCache) Put(_ context.Context, r [32]byte, state state.BeaconState) {
	if c.disabled {
		return
	}
	// Copy state so cached value is not mutated.
	c.cache.Add(r, state.Copy())
}
