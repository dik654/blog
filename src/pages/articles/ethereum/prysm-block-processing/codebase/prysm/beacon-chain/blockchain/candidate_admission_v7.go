// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/blockchain/process_block.go, execution_engine.go — 발췌

// postBlockProcess는 검증이 끝난 block과 post-state를 fork-choice 후보로 등록합니다.
func (s *Service) postBlockProcess(cfg *postBlockProcessConfig) error {
	ctx := cfg.ctx

	err := s.cfg.ForkChoiceStore.InsertNode(ctx, cfg.postState, cfg.roblock)
	if err != nil {
		s.rollbackBlock(ctx, cfg.roblock.Root())
		return errors.Wrapf(err, "could not insert block %d to fork choice store", cfg.roblock.Block().Slot())
	}

	if err := s.handleBlockAttestations(ctx, cfg.roblock.Block(), cfg.postState); err != nil {
		return errors.Wrap(err, "could not handle block's attestations")
	}
	s.InsertSlashingsToForkChoiceStore(ctx, cfg.roblock.Block().Body().AttesterSlashings())

	if cfg.isValidPayload {
		if err := s.cfg.ForkChoiceStore.SetOptimisticToValid(ctx, cfg.roblock.Root()); err != nil {
			return errors.Wrap(err, "could not set optimistic block to valid")
		}
	}

	cfg.headRoot, err = s.cfg.ForkChoiceStore.Head(ctx)
	if err != nil {
		log.WithError(err).Warn("Could not update head")
	}
	if cfg.headRoot != cfg.roblock.Root() {
		s.logNonCanonicalBlockReceived(cfg.roblock.Root(), cfg.headRoot)
		return nil
	}
	return nil
}

// pruneInvalidBlock은 EL이 INVALID를 돌려준 block과 영향을 받은 후손을 제거합니다.
func (s *Service) pruneInvalidBlock(
	ctx context.Context,
	root, parentRoot, parentHash [32]byte,
	latestValidHash [32]byte,
) error {
	invalidRoots, err := s.cfg.ForkChoiceStore.SetOptimisticToInvalid(
		ctx, root, parentRoot, parentHash, latestValidHash,
	)
	if err != nil {
		return err
	}
	if err := s.removeInvalidBlockAndState(ctx, invalidRoots); err != nil {
		return err
	}
	return invalidBlock{
		invalidAncestorRoots: invalidRoots,
		error:                ErrInvalidPayload,
		lastValidHash:        latestValidHash,
	}
}
