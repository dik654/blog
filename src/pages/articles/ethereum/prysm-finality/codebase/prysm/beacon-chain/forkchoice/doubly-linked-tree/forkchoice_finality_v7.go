func (f *ForkChoice) updateCheckpoints(ctx context.Context, jc, fc *ethpb.Checkpoint) error {
	if jc.Epoch > f.store.justifiedCheckpoint.Epoch {
		f.store.prevJustifiedCheckpoint = f.store.justifiedCheckpoint
		jcRoot := f.store.clampCheckpointRoot(jc.Epoch, bytesutil.ToBytes32(jc.Root))
		f.store.justifiedCheckpoint = &forkchoicetypes.Checkpoint{Epoch: jc.Epoch, Root: jcRoot}
		if err := f.updateJustifiedBalances(ctx, jcRoot); err != nil {
			return errors.Wrap(err, "could not update justified balances")
		}
	}
	if fc.Epoch <= f.store.finalizedCheckpoint.Epoch {
		return nil
	}
	f.store.finalizedCheckpoint = &forkchoicetypes.Checkpoint{
		Epoch: fc.Epoch,
		Root:  f.store.clampCheckpointRoot(fc.Epoch, bytesutil.ToBytes32(fc.Root)),
	}
	return f.store.prune(ctx)
}

func (s *Store) prune(ctx context.Context) error {
	ctx, span := trace.StartSpan(ctx, "doublyLinkedForkchoice.Prune")
	defer span.End()

	finalizedEpoch := s.finalizedCheckpoint.Epoch
	finalizedRoot := s.clampCheckpointRoot(finalizedEpoch, s.finalizedCheckpoint.Root)
	fen, ok := s.emptyNodeByRoot[finalizedRoot]
	if !ok || fen == nil {
		return errors.WithMessage(errUnknownFinalizedRoot, fmt.Sprintf("%#x", s.finalizedCheckpoint.Root))
	}
	fn := fen.node
	if fn.parent == nil {
		return nil
	}
	s.finalizedPayloadBlockHash = s.checkpointPayloadHashForRoot(finalizedRoot)
	treeRootParentHash := s.parentHash(fen)

	s.finalizedDependentRoot = fn.parent.node.root

	if err := s.pruneFinalizedNodeByRootMap(ctx, s.treeRootNode, fn); err != nil {
		return err
	}

	fn.parent = nil
	s.treeRootNode = fn
	s.treeRootParentHash = treeRootParentHash

	prunedCount.Inc()
	checkpointMaxSlot, err := slots.EpochStart(finalizedEpoch)
	if err != nil {
		return errors.Wrap(err, "could not compute epoch start")
	}
	if fn.slot == checkpointMaxSlot {
		return nil
	}

	remaining := fen.children[:0]
	for _, child := range fen.children {
		if child != nil && child.slot <= checkpointMaxSlot {
			if err := s.pruneFinalizedNodeByRootMap(ctx, child, fn); err != nil {
				return errors.Wrap(err, "could not prune incompatible finalized child")
			}
			continue
		}
		remaining = append(remaining, child)
	}
	fen.children = remaining
	ffn := s.fullNodeByRoot[finalizedRoot]
	if ffn == nil {
		return nil
	}
	remaining = ffn.children[:0]
	for _, child := range ffn.children {
		if child != nil && child.slot <= checkpointMaxSlot {
			if err := s.pruneFinalizedNodeByRootMap(ctx, child, fn); err != nil {
				return errors.Wrap(err, "could not prune incompatible finalized child")
			}
			continue
		}
		remaining = append(remaining, child)
	}
	ffn.children = remaining
	return nil
}
