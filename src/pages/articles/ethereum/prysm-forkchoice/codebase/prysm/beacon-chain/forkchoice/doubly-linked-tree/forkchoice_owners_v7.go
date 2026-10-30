// ForkChoice defines the overall fork choice store which includes all block nodes, validator's latest votes and balances.
type ForkChoice struct {
	sync.RWMutex
	store             *Store
	votes             []Vote                      // tracks individual validator's last vote.
	balances          []uint64                    // tracks individual validator's balances last accounted in votes.
	justifiedBalances []uint64                    // tracks individual validator's last justified balances.
	balancesByRoot    forkchoice.BalancesByRooter // handler to obtain balances for the state with a given root
}

// Store defines the fork choice store which includes block nodes and the last view of checkpoint information.
type Store struct {
	justifiedCheckpoint *forkchoicetypes.Checkpoint // latest justified epoch in store.
	// ...
	finalizedCheckpoint       *forkchoicetypes.Checkpoint                   // latest finalized epoch in store.
	proposerBoostRoot         [fieldparams.RootLength]byte                  // latest block root that was boosted after being received in a timely manner.
	previousProposerBoostRoot [fieldparams.RootLength]byte                  // previous block root that was boosted after being received in a timely manner.
	previousProposerBoostScore uint64                                       // previous proposer boosted root score.
	// ...
	committeeWeight uint64 // tracks the total active validator balance divided by the number of slots per Epoch.
	// ...
	treeRootNode *Node // the root node of the store tree.
	// ...
	headNode        *Node                                         // last head Node
	emptyNodeByRoot map[[fieldparams.RootLength]byte]*PayloadNode // nodes indexed by roots.
	// ...
	slashedIndices map[primitives.ValidatorIndex]bool // the list of equivocating validator indices
	// ...
}
