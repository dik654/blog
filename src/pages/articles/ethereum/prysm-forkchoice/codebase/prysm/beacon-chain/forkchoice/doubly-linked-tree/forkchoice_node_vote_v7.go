// Node defines the individual block which includes its block parent, ancestor and how much weight accounted for it.
// This is used as an array based stateful DAG for efficient fork choice look up.
type Node struct {
	slot primitives.Slot // slot of the block converted to the node.
	// ...
	root           [fieldparams.RootLength]byte // root of the block converted to the node.
	// ...
	parent *PayloadNode // parent index of this node.
	// ...
	bestDescendant *Node // bestDescendant node of this node.
	justifiedEpoch primitives.Epoch             // justifiedEpoch of this node.
	// ...
	finalizedEpoch primitives.Epoch             // finalizedEpoch of this node.
	// ...
	balance        uint64                       // the balance that voted for this node directly
	weight         uint64                       // weight of this node: the total balance including children
	// ...
}

// Vote defines an individual validator's vote.
type Vote struct {
	currentRoot          [fieldparams.RootLength]byte // current voting root.
	nextRoot             [fieldparams.RootLength]byte // next voting root.
	nextSlot             primitives.Slot              // slot of the next voting period.
	currentSlot          primitives.Slot              // slot of the current voting period.
	nextPayloadStatus    bool                         // whether the next vote is for a full or empty payload
	currentPayloadStatus bool                         // whether the current vote is for a full or empty payload
}
