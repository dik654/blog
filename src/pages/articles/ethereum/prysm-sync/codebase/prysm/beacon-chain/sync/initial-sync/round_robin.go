// beacon-chain/sync/initial-sync/round_robin.go — Prysm v5.x

// roundRobinSync fetches blocks in batches from multiple peers.
func (s *Service) roundRobinSync(highestSlot primitives.Slot) error {
	// Select peers that are ahead of us
	peers := s.filterSuitablePeers(highestSlot)
	if len(peers) == 0 {
		return errors.New("no suitable peers for sync")
	}

	// Batch request loop
	startSlot := s.cfg.Chain.HeadSlot() + 1
	for startSlot <= highestSlot {
		// Distribute ranges across peers (round-robin)
		requests := s.buildBatchRequests(startSlot, highestSlot, peers)

		// Fetch blocks concurrently from each peer
		responses, err := s.sendBatchRequests(requests)
		if err != nil {
			return err
		}

		// Sort and deduplicate fetched blocks
		blocks := s.sortAndDedup(responses)

		// Process blocks sequentially
		for _, blk := range blocks {
			if err := s.processBlock(blk); err != nil {
				return err
			}
		}

		// Advance start slot
		startSlot = blocks[len(blocks)-1].Block().Slot() + 1
		s.logSyncProgress(startSlot, highestSlot)
	}
	return nil
}
