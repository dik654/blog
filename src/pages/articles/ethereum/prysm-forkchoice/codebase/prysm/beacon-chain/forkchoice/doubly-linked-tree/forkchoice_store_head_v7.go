// head starts from justified root and then follows the best descendant links
// to find the best block for head.
func (s *Store) head(ctx context.Context) ([32]byte, error) {
	ctx, span := trace.StartSpan(ctx, "doublyLinkedForkchoice.head")
	defer span.End()

	if err := ctx.Err(); err != nil {
		return [32]byte{}, err
	}

	// JustifiedRoot has to be known
	ej := s.emptyNodeByRoot[s.clampCheckpointRoot(s.justifiedCheckpoint.Epoch, s.justifiedCheckpoint.Root)]
	if ej == nil {
		return [32]byte{}, errors.WithMessage(errUnknownJustifiedRoot, fmt.Sprintf("%#x", s.justifiedCheckpoint.Root))
	}
	jn := ej.node

	// If the justified node doesn't have a best descendant,
	// the best node is itself.
	bestDescendant := jn.bestDescendant
	if bestDescendant == nil {
		bestDescendant = jn
	}
	currentEpoch := slots.EpochsSinceGenesis(s.genesisTime)
	if !bestDescendant.viableForHead(s.justifiedCheckpoint.Epoch, currentEpoch) {
		s.allTipsAreInvalid = true
		return [32]byte{}, fmt.Errorf("head at slot %d with weight %d is not eligible, finalizedEpoch, justified Epoch %d, %d != %d, %d",
			bestDescendant.slot, bestDescendant.weight/10e9, bestDescendant.finalizedEpoch, bestDescendant.justifiedEpoch, s.finalizedCheckpoint.Epoch, s.justifiedCheckpoint.Epoch)
	}
	s.allTipsAreInvalid = false

	// Update metrics.
	if bestDescendant != s.headNode {
		headChangesCount.Inc()
		headSlotNumber.Set(float64(bestDescendant.slot))
		s.headNode = bestDescendant
	}

	return bestDescendant.root, nil
}
