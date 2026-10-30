// applyWeightChangesConsensusNode recomputes the weight of the node passed as an argument and all of its descendants,
// using the current balance stored in each node.
func (s *Store) applyWeightChangesConsensusNode(ctx context.Context, n *Node) error {
	// Recursively calling the children to sum their weights.
	en := s.emptyNodeByRoot[n.root]
	if err := s.applyWeightChangesPayloadNode(ctx, en); err != nil {
		return err
	}
	childrenWeight := en.weight
	fn := s.fullNodeByRoot[n.root]
	if fn != nil {
		if err := s.applyWeightChangesPayloadNode(ctx, fn); err != nil {
			return err
		}
		childrenWeight += fn.weight
	}
	if n.root == params.BeaconConfig().ZeroHash {
		return nil
	}
	n.weight = n.balance + childrenWeight
	return nil
}
