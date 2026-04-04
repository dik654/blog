// beacon-chain/forkchoice/doubly-linked-tree/forkchoice.go (Prysm v5)

// ProcessBlock — 새 블록 도착 시 트리에 삽입 + 체크포인트 갱신.
func (f *ForkChoice) ProcessBlock(ctx context.Context,
	state *forkchoicetypes.BlockAndCheckpoints,
) error {
	return f.store.InsertNode(ctx, state)
}

// ProcessAttestation — 어테스테이션 수신 시 가중치 업데이트.
// 검증자의 투표를 반영해 해당 노드의 weight를 증가시킨다.
func (f *ForkChoice) ProcessAttestation(
	ctx context.Context, index primitives.ValidatorIndex,
	blockRoot [32]byte, targetEpoch primitives.Epoch,
) {
	f.votes[index] = Vote{
		currentRoot: blockRoot,
		nextRoot:    blockRoot,
		nextEpoch:   targetEpoch,
	}
}

// computeHead — 루트에서 시작해 가장 무거운 경로를 따라 헤드를 결정한다.
// LMD-GHOST: 각 포크에서 가중치가 높은 자식을 선택.
func (s *ForkChoiceStore) computeHead(ctx context.Context) ([32]byte, error) {
	node := s.justifiedNode()
	for {
		if len(node.children) == 0 {
			s.headNode = node
			return node.root, nil
		}
		best := node.children[0]
		for _, child := range node.children[1:] {
			if child.weight > best.weight ||
				(child.weight == best.weight && bytes.Compare(child.root[:], best.root[:]) > 0) {
				best = child
			}
		}
		node = best
	}
}
