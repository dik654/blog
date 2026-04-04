// beacon-chain/forkchoice/doubly-linked-tree/store.go (Prysm v5)

// ForkChoiceStore — 포크 선택 트리의 전체 상태를 관리한다.
type ForkChoiceStore struct {
	nodeByRoot     map[[32]byte]*Node
	nodeByPayload  map[[32]byte]*Node
	treeRootNode   *Node
	headNode       *Node
	justifiedCheckpoint *forkchoicetypes.Checkpoint
	finalizedCheckpoint *forkchoicetypes.Checkpoint
	proposerBoostRoot   [32]byte
}

// Node — doubly-linked-tree의 개별 노드. 부모·자식 양방향 참조.
type Node struct {
	slot           primitives.Slot
	root           [32]byte
	parent         *Node
	children       []*Node
	weight         uint64
	bestDescendant *Node
	justifiedEpoch primitives.Epoch
	finalizedEpoch primitives.Epoch
}

// InsertNode — 새 블록이 도착하면 트리에 노드를 추가한다.
func (f *ForkChoiceStore) InsertNode(ctx context.Context,
	state *forkchoicetypes.BlockAndCheckpoints,
) error {
	node := &Node{
		slot:           state.Block.Slot(),
		root:           state.Root,
		justifiedEpoch: state.JustifiedCheckpoint.Epoch,
		finalizedEpoch: state.FinalizedCheckpoint.Epoch,
	}
	parent, ok := f.nodeByRoot[state.Block.ParentRoot()]
	if !ok {
		return errUnknownParent
	}
	node.parent = parent
	parent.children = append(parent.children, node)
	f.nodeByRoot[state.Root] = node
	return nil
}
