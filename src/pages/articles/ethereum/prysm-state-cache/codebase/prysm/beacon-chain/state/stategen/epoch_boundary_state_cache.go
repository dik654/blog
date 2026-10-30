// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/state/stategen/epoch_boundary_state_cache.go — 핵심 발췌

var maxCacheSize = uint64(8)

// getByBlockRoot는 FIFO에 저장한 state를 복사해서 반환합니다.
func (e *epochBoundaryState) getByBlockRootLockFree(
	r [32]byte,
) (*rootStateInfo, bool, error) {
	obj, exists, err := e.rootStateCache.GetByKey(string(r[:]))
	if err != nil || !exists {
		return nil, false, err
	}
	s := obj.(*rootStateInfo)
	return &rootStateInfo{root: r, state: s.state.Copy()}, true, nil
}

// put은 epoch-start state 자체도 복사해서 FIFO에 넣습니다.
func (e *epochBoundaryState) put(
	blockRoot [32]byte,
	s state.ReadOnlyBeaconState,
) error {
	e.rootStateCache.AddIfNotPresent(&rootStateInfo{
		root:  blockRoot,
		state: s.Copy(),
	})
	trim(e.rootStateCache, maxCacheSize)
	trim(e.slotRootCache, maxCacheSize)
	return nil
}
