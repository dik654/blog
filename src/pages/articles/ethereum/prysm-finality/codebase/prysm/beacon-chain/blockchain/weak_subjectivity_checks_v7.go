func NewWeakSubjectivityVerifier(wsc *ethpb.Checkpoint, db weakSubjectivityDB) (*WeakSubjectivityVerifier, error) {
	if wsc == nil || len(wsc.Root) == 0 || wsc.Epoch == 0 {
		log.Debug("--weak-subjectivity-checkpoint not provided")
		return &WeakSubjectivityVerifier{
			enabled: false,
		}, nil
	}
	startSlot, err := slots.EpochStart(wsc.Epoch)
	if err != nil {
		return nil, err
	}
	return &WeakSubjectivityVerifier{
		enabled:  true,
		verified: false,
		root:     bytesutil.ToBytes32(wsc.Root),
		epoch:    wsc.Epoch,
		db:       db,
		slot:     startSlot,
	}, nil
}

func (v *WeakSubjectivityVerifier) VerifyWeakSubjectivity(ctx context.Context, finalizedEpoch primitives.Epoch) error {
	if v.verified || !v.enabled {
		return nil
	}
	if v.epoch >= finalizedEpoch {
		return nil
	}
	log.Infof("Performing weak subjectivity check for root %#x in epoch %d", v.root, v.epoch)

	if !v.db.HasBlock(ctx, v.root) {
		return errors.Wrap(errWSBlockNotFound, fmt.Sprintf("missing root %#x", v.root))
	}
	if !v.db.IsFinalizedBlock(ctx, v.root) {
		return errors.Wrap(errWSBlockNotCanonical, fmt.Sprintf("root=%#x, epoch=%d", v.root, v.epoch))
	}
	endSlot := v.slot + params.BeaconConfig().SlotsPerEpoch - 1
	filter := filters.NewFilter().SetStartSlot(v.slot).SetEndSlot(endSlot)
	roots, err := v.db.BlockRoots(ctx, filter)
	if err != nil {
		return errors.Wrap(err, "error while retrieving block roots to verify weak subjectivity")
	}
	if slices.Contains(roots, v.root) {
		log.Info("Weak subjectivity check has passed!!")
		v.verified = true
		return nil
	}
	return errors.Wrap(errWSBlockNotFoundInEpoch, fmt.Sprintf("root=%#x, epoch=%d", v.root, v.epoch))
}
