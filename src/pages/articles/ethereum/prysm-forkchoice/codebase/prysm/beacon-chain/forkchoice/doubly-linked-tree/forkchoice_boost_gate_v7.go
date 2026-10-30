		// Apply proposer boost
		now := time.Now()
		if now.Before(s.genesisTime) {
			return ret, nil
		}
		currentSlot := slots.CurrentSlot(s.genesisTime)
		sss, err := slots.SinceSlotStart(currentSlot, s.genesisTime, now)
		if err != nil {
			return nil, fmt.Errorf("could not determine time since current slot started: %w", err)
		}
		bps := params.BeaconConfig().AttestationDueBPS
		if block.Version() >= version.Gloas {
			bps = params.BeaconConfig().AttestationDueBPSGloas
		}
		boostThreshold := params.BeaconConfig().SlotComponentDuration(bps)
		isFirstBlock := s.proposerBoostRoot == [32]byte{}
		if currentSlot == slot && sss < boostThreshold && isFirstBlock {
			depEpoch := slots.ToEpoch(currentSlot)
			if depEpoch > 0 {
				depEpoch--
			}
			depRoot, err := s.dependentRootForEpoch(root, depEpoch)
			// ...
			headDepRoot, err := s.dependentRoot(depEpoch)
			// ...
			if depRoot == headDepRoot {
				s.proposerBoostRoot = root
			}
		}
