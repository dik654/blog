	// Handle block when the parent is unknown.
	if !s.cfg.chain.HasBlock(ctx, parentRoot) {
		if res, err := s.verifyPendingBlockSignature(ctx, pid, blk, blockRoot); err != nil {
			log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not verify block signature")
			return res, err
		}
		s.pendingQueueLock.Lock()
		if err := s.insertBlockToPendingQueue(blk.Block().Slot(), blk, blockRoot); err != nil {
			s.pendingQueueLock.Unlock()
			log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not insert block to pending queue")
			return pubsub.ValidationIgnore, err
		}
		s.pendingQueueLock.Unlock()
		go func() {
			if err := s.sendBatchRootRequest(s.ctx, [][32]byte{parentRoot}, rand.NewGenerator()); err != nil {
				log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not request unknown parent block")
			}
		}()
		err := errors.Errorf("unknown parent for block with slot %d and parent root %#x", blk.Block().Slot(), parentRoot)
		log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not identify parent for block")
		return pubsub.ValidationIgnore, err
	}
	if res, err := s.validateExecutionPayloadBidParentSeen(ctx, blk.Block()); res == pubsub.ValidationIgnore {
		if sigRes, sigErr := s.verifyPendingBlockSignature(ctx, pid, blk, blockRoot); sigErr != nil {
			log.WithError(sigErr).WithFields(getBlockFields(blk)).Debug("Could not verify block signature")
			return sigRes, sigErr
		}
		s.pendingQueueLock.Lock()
		if qErr := s.insertBlockToPendingQueue(blk.Block().Slot(), blk, blockRoot); qErr != nil {
			s.pendingQueueLock.Unlock()
			log.WithError(qErr).WithFields(getBlockFields(blk)).Debug("Could not insert block to pending queue")
			return pubsub.ValidationIgnore, qErr
		}
		s.pendingQueueLock.Unlock()
		go s.requestPayloadEnvelope(blk.Block().ParentRoot())
		log.WithError(err).WithFields(getBlockFields(blk)).Debug("Parent payload not yet available, queuing block")
		return pubsub.ValidationIgnore, err
	}

	if res, err := s.validateExecutionPayloadBid(ctx, blk.Block()); err != nil {
		if res == pubsub.ValidationReject {
			s.setBadBlock(ctx, blockRoot)
		}
		return res, err
	}

	err = s.validateBeaconBlock(ctx, blk, blockRoot)
	if err != nil {
		if errors.Is(err, blocks.ErrInvalidSignature) {
			s.downscorePeer(pid, "invalidBlockSignature")
			return pubsub.ValidationReject, err
		}
		if s.hasBadBlock(blockRoot) || errors.Is(err, blocks.ErrInvalidProposerIndex) || errors.Is(err, errBlockSlotNotAfterParent) {
			log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not validate beacon block")
			return pubsub.ValidationReject, err
		}
		if !errors.Is(err, ErrOptimisticParent) {
			log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not validate beacon block")
			return pubsub.ValidationIgnore, err
		}
	}

	// Record attribute of valid block.
	span.SetAttributes(trace.Int64Attribute("slotInEpoch", int64(blk.Block().Slot()%params.BeaconConfig().SlotsPerEpoch)))
	blkPb, err := blk.Proto()
	if err != nil {
		log.WithError(err).WithFields(getBlockFields(blk)).Debug("Could not convert beacon block to protobuf type")
		return pubsub.ValidationIgnore, err
	}
	msg.ValidatorData = blkPb // Used in downstream subscriber

	// Log the arrival time of the accepted block
	graffiti := blk.Block().Body().Graffiti()
	startTime, err := slots.StartTime(genesisTime, blk.Block().Slot())
	logFields := logrus.Fields{
		"blockSlot":     blk.Block().Slot(),
		"proposerIndex": blk.Block().ProposerIndex(),
		"graffiti":      string(graffiti[:]),
	}
	if err != nil {
		log.WithError(err).WithFields(logFields).Warn("Received block, could not report timing information.")
		return pubsub.ValidationAccept, nil
	}
	sinceSlotStartTime := receivedTime.Sub(startTime)
	validationTime := prysmTime.Now().Sub(receivedTime)
	logFields["sinceSlotStartTime"] = sinceSlotStartTime
	logFields["validationTime"] = validationTime
	log.WithFields(logFields).Debug("Received block")

	blockArrivalGossipSummary.Observe(float64(sinceSlotStartTime.Milliseconds()))
	blockVerificationGossipSummary.Observe(float64(validationTime.Milliseconds()))

	if s.cfg.operationNotifier != nil {
		s.cfg.operationNotifier.OperationFeed().Send(&feed.Event{
			Type: operation.BlockGossipReceived,
			Data: &operation.BlockGossipReceivedData{
				SignedBlock: blk,
			},
		})
	}

	return pubsub.ValidationAccept, nil
}
