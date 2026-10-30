// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/core/transition/transition.go
// 아래 함수 본문은 공식 태그의 연속 구간을 그대로 발췌했습니다.

// ProcessSlot happens every slot and focuses on the slot counter and block roots record updates.
// It happens regardless if there's an incoming block or not.
// Spec pseudocode definition:
//
//	def process_slot(state: BeaconState) -> None:
//	  # Cache state root
//	  previous_state_root = hash_tree_root(state)
//	  state.state_roots[state.slot % SLOTS_PER_HISTORICAL_ROOT] = previous_state_root
//	  # Cache latest block header state root
//	  if state.latest_block_header.state_root == Bytes32():
//	      state.latest_block_header.state_root = previous_state_root
//	  # Cache block root
//	  previous_block_root = hash_tree_root(state.latest_block_header)
//	  state.block_roots[state.slot % SLOTS_PER_HISTORICAL_ROOT] = previous_block_root
func ProcessSlot(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	ctx, span := prysmTrace.StartSpan(ctx, "core.state.ProcessSlot")
	defer span.End()
	span.SetAttributes(prysmTrace.Int64Attribute("slot", int64(state.Slot()))) // lint:ignore uintcast -- This is OK for tracing.

	prevStateRoot, err := state.HashTreeRoot(ctx)
	if err != nil {
		return nil, err
	}
	if err := state.UpdateStateRootAtIndex(
		uint64(state.Slot()%params.BeaconConfig().SlotsPerHistoricalRoot),
		prevStateRoot,
	); err != nil {
		return nil, err
	}

	zeroHash := params.BeaconConfig().ZeroHash
	// Cache latest block header state root.
	header := state.LatestBlockHeader()
	if header.StateRoot == nil || bytes.Equal(header.StateRoot, zeroHash[:]) {
		header.StateRoot = prevStateRoot[:]
		if err := state.SetLatestBlockHeader(header); err != nil {
			return nil, err
		}
	}
	prevBlockRoot, err := state.LatestBlockHeader().HashTreeRoot()
	if err != nil {
		tracing.AnnotateError(span, err)
		return nil, errors.Wrap(err, "could not determine prev block root")
	}
	// Cache the block root.
	if err := state.UpdateBlockRootAtIndex(
		uint64(state.Slot()%params.BeaconConfig().SlotsPerHistoricalRoot),
		prevBlockRoot,
	); err != nil {
		return nil, err
	}

	// <spec fn="process_slot" fork="gloas" lines="11-13" hash="2b894194">
	// state.block_roots[slot_index] = previous_block_root
	// # [New in Gloas:EIP7732]
	// # Unset the next payload availability
	// </spec>
	if state.Version() >= version.Gloas {
		index := uint64((state.Slot() + 1) % params.BeaconConfig().SlotsPerHistoricalRoot)
		if err := state.UpdateExecutionPayloadAvailabilityAtIndex(index, 0x0); err != nil {
			return nil, err
		}
	}

	return state, nil
}

// ProcessSlots includes core slot processing as well as a cache
func ProcessSlots(ctx context.Context, state state.BeaconState, slot primitives.Slot) (state.BeaconState, error) {
	ctx, span := prysmTrace.StartSpan(ctx, "core.state.ProcessSlots")
	defer span.End()
	if state == nil || state.IsNil() {
		return nil, errors.New("nil state")
	}
	span.SetAttributes(prysmTrace.Int64Attribute("slots", int64(slot)-int64(state.Slot()))) // lint:ignore uintcast -- This is OK for tracing.

	// The block must have a higher slot than parent state.
	if state.Slot() >= slot {
		err := fmt.Errorf("expected state.slot %d < slot %d", state.Slot(), slot)
		tracing.AnnotateError(span, err)
		return nil, err
	}

	highestSlot := state.Slot()
	key, err := cacheKey(ctx, state)
	if err != nil {
		return nil, err
	}

	// Restart from cached value, if one exists.
	cachedState, err := SkipSlotCache.Get(ctx, key)
	if err != nil {
		return nil, err
	}

	if cachedState != nil && !cachedState.IsNil() && cachedState.Slot() < slot {
		highestSlot = cachedState.Slot()
		state = cachedState
	}
	if err := SkipSlotCache.MarkInProgress(key); errors.Is(err, cache.ErrAlreadyInProgress) {
		cachedState, err = SkipSlotCache.Get(ctx, key)
		if err != nil {
			return nil, err
		}
		if cachedState != nil && !cachedState.IsNil() && cachedState.Slot() < slot {
			highestSlot = cachedState.Slot()
			state = cachedState
		}
	} else if err != nil {
		return nil, err
	}
	defer func() {
		SkipSlotCache.MarkNotInProgress(key)
	}()
	state, err = ProcessSlotsCore(ctx, span, state, slot, cacheBestBeaconStateOnErrFn(highestSlot, key))
	if err != nil {
		return nil, err
	}
	if highestSlot < state.Slot() {
		SkipSlotCache.Put(ctx, key, state)
	}

	return state, nil
}

// ProcessSlotsCore process through skip slots and apply epoch transition when it's needed
//
// Spec pseudocode definition:
//
//	def process_slots(state: BeaconState, slot: Slot) -> None:
//	  assert state.slot < slot
//	  while state.slot < slot:
//	      process_slot(state)
//	      # Process epoch on the start slot of the next epoch
//	      if (state.slot + 1) % SLOTS_PER_EPOCH == 0:
//	          process_epoch(state)
//	      state.slot = Slot(state.slot + 1)
func ProcessSlotsCore(ctx context.Context, span trace.Span, state state.BeaconState, slot primitives.Slot, fn customProcessingFn) (state.BeaconState, error) {
	var err error
	for state.Slot() < slot {
		if fn != nil {
			if err = fn(ctx, state); err != nil {
				tracing.AnnotateError(span, err)
				return nil, err
			}
		}
		state, err = ProcessSlot(ctx, state)
		if err != nil {
			tracing.AnnotateError(span, err)
			return nil, errors.Wrap(err, "could not process slot")
		}

		state, err = ProcessEpoch(ctx, state)
		if err != nil {
			tracing.AnnotateError(span, err)
			return nil, err
		}

		if err := state.SetSlot(state.Slot() + 1); err != nil {
			tracing.AnnotateError(span, err)
			return nil, errors.Wrap(err, "failed to increment state slot")
		}

		state, err = UpgradeState(ctx, state)
		if err != nil {
			tracing.AnnotateError(span, err)
			return nil, errors.Wrap(err, "failed to upgrade state")
		}

		logBlobLimitIncrease(state.Slot())
	}
	return state, nil
}

// ProcessEpoch is a wrapper on fork specific epoch processing
func ProcessEpoch(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	ctx, span := prysmTrace.StartSpan(ctx, "core.state.ProcessEpoch")
	defer span.End()

	var err error
	if time.CanProcessEpoch(state) {
		if state.Version() >= version.Gloas {
			if err = processEpochGloas(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Fulu {
			if err = fulu.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Electra {
			if err = electra.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Altair {
			if err = altair.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else {
			state, err = ProcessEpochPrecompute(ctx, state)
			if err != nil {
				return nil, errors.Wrap(err, "could not process epoch with optimizations")
			}
		}
	}
	return state, nil
}
