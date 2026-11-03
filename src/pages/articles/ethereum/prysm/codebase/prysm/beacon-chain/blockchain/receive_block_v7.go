func (s *Service) ReceiveBlock(ctx context.Context, block interfaces.ReadOnlySignedBeaconBlock, blockRoot [32]byte, avs das.AvailabilityChecker) error {
	ctx, span := trace.StartSpan(ctx, "blockChain.ReceiveBlock")
	defer span.End()
	// Return early if the block is blacklisted
	if features.BlacklistedBlock(blockRoot) {
		return errBlacklistedRoot
	}
	// Return early if the block has been synced
	if s.InForkchoice(blockRoot) {
		log.WithField("blockRoot", fmt.Sprintf("%#x", blockRoot)).Debug("Ignoring already synced block")
		return nil
	}

	receivedTime := time.Now()
	err := s.blockBeingSynced.set(blockRoot)
	if errors.Is(err, errBlockBeingSynced) {
		log.WithField("blockRoot", fmt.Sprintf("%#x", blockRoot)).Debug("Ignoring block currently being synced")
		return nil
	}
	defer s.blockBeingSynced.unset(blockRoot)

	blockCopy, err := block.Copy()
	if err != nil {
		return errors.Wrap(err, "block copy")
	}
	roblock, err := blocks.NewROBlockWithRoot(blockCopy, blockRoot)
	if err != nil {
		return errors.Wrap(err, "new ro block with root")
	}

	preState, err := s.GetBlockPreState(ctx, roblock)
	if err != nil {
		return errors.Wrap(err, "could not get block's prestate")
	}

	currentCheckpoints := s.saveCurrentCheckpoints(preState)
	postState, isValidPayload, err := s.validateExecutionAndConsensus(ctx, preState, roblock)
	if err != nil {
		return errors.Wrap(err, "validator execution and consensus")
	}

	daWaitedTime, err := s.handleDA(ctx, avs, roblock)
	if err != nil {
		return errors.Wrap(err, "handle da")
	}

	// Defragment the state before continuing block processing.
	s.defragmentState(postState)

	// The rest of block processing takes a lock on forkchoice.
	s.cfg.ForkChoiceStore.Lock()
	defer s.cfg.ForkChoiceStore.Unlock()
	if err := s.savePostStateInfo(ctx, blockRoot, blockCopy, postState); err != nil {
		return errors.Wrap(err, "could not save post state info")
	}
	args := &postBlockProcessConfig{
		ctx:            ctx,
		roblock:        roblock,
		postState:      postState,
		isValidPayload: isValidPayload,
	}
	if err := s.postBlockProcess(args); err != nil {
		err := errors.Wrap(err, "could not process block")
		tracing.AnnotateError(span, err)
		return errors.Wrap(err, "post block process")
	}
	if err := s.updateCheckpoints(ctx, currentCheckpoints, preState, postState, blockRoot); err != nil {
		return errors.Wrap(err, "update checkpoints")
	}
	// If slasher is configured, forward the attestations in the block via an event feed for processing.
	if s.slasherEnabled {
		go s.sendBlockAttestationsToSlasher(blockCopy, preState)
	}

	// Handle post block operations such as pruning exits and bls messages if incoming block is the head
	if err := s.prunePostBlockOperationPools(ctx, blockCopy, blockRoot); err != nil {
		log.WithError(err).Error("Could not prune canonical objects from pool ")
	}

	// Have we been finalizing? Should we start saving hot states to db?
	if err := s.checkSaveHotStateDB(ctx); err != nil {
		log.WithError(err).Error("Could not check save hot state DB")
	}

	// We apply the same heuristic to some of our more important caches.
	if err := s.handleCaches(); err != nil {
		return errors.Wrap(err, "handle caches")
	}
	s.reportPostBlockProcessing(blockCopy, blockRoot, receivedTime, daWaitedTime)
	return nil
}
