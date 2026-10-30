// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/state/stategen/hot_state_cache.go — 핵심 발췌

var hotStateCacheSize = 32

// get은 block root로 찾은 cached state를 복사해서 반환합니다.
func (c *hotStateCache) get(blockRoot [32]byte) state.BeaconState {
	c.lock.RLock()
	defer c.lock.RUnlock()
	item, exists := c.cache.Get(blockRoot)
	if exists && item != nil {
		return item.(state.BeaconState).Copy()
	}
	return nil
}

// getWithoutCopy는 같은 cached object를 그대로 반환합니다.
func (c *hotStateCache) getWithoutCopy(blockRoot [32]byte) state.BeaconState {
	c.lock.RLock()
	defer c.lock.RUnlock()
	item, exists := c.cache.Get(blockRoot)
	if exists && item != nil {
		return item.(state.BeaconState)
	}
	return nil
}

func (c *hotStateCache) put(blockRoot [32]byte, st state.BeaconState) {
	c.lock.Lock()
	defer c.lock.Unlock()
	c.cache.Add(blockRoot, st)
}
