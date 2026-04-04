// beacon-chain/forkchoice/doubly-linked-tree/store.go — Finality (Prysm v5)

// UpdateJustifiedCheckpoint — justified 체크포인트를 갱신한다.
// 2/3 이상 검증자가 투표한 에폭 경계 블록이 justified가 된다.
func (f *ForkChoiceStore) UpdateJustifiedCheckpoint(
	ctx context.Context, cp *forkchoicetypes.Checkpoint,
) error {
	if cp.Epoch < f.justifiedCheckpoint.Epoch {
		return errOldJustifiedCheckpoint
	}
	f.justifiedCheckpoint = cp
	return nil
}

// UpdateFinalizedCheckpoint — finalized 체크포인트를 갱신한다.
// justified → 다음 에폭에서 다시 2/3 투표 → finalized로 확정.
func (f *ForkChoiceStore) UpdateFinalizedCheckpoint(
	ctx context.Context, cp *forkchoicetypes.Checkpoint,
) error {
	f.finalizedCheckpoint = cp
	return nil
}

// Prune — finalized 체크포인트 아래의 노드를 모두 제거한다.
// finalized 노드가 새 루트가 되고, 이전 노드들은 GC 대상.
func (f *ForkChoiceStore) Prune(ctx context.Context,
	finalizedRoot [32]byte,
) error {
	finalizedNode, ok := f.nodeByRoot[finalizedRoot]
	if !ok {
		return errUnknownFinalizedRoot
	}
	f.pruneBelowNode(finalizedNode)
	f.treeRootNode = finalizedNode
	finalizedNode.parent = nil
	return nil
}
