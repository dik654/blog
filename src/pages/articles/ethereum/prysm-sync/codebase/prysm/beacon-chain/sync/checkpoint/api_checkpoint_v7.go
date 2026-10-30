func (dl *APIInitializer) Initialize(ctx context.Context, d db.Database) error {
	origin, err := d.OriginCheckpointBlockRoot(ctx)
	if err == nil && origin != params.BeaconConfig().ZeroHash {
		log.WithField("root", fmt.Sprintf("%#x", origin)).Info("Origin checkpoint found in the database, ignoring checkpoint sync flags")
		return nil
	}
	if err != nil && !errors.Is(err, db.ErrNotFound) {
		return errors.Wrap(err, "error while checking database for origin root")
	}
	od, err := DownloadFinalizedData(ctx, dl.c)
	if err != nil {
		return errors.Wrap(err, "Error retrieving checkpoint origin state and block")
	}
	return d.SaveOrigin(ctx, od.StateBytes(), od.BlockBytes())
}

func DownloadFinalizedData(ctx context.Context, client *beacon.Client) (*OriginData, error) {
	sb, err := client.GetState(ctx, beacon.IdFinalized)
	if err != nil {
		return nil, err
	}
	vu, err := detect.FromState(sb)
	if err != nil {
		return nil, errors.Wrap(err, "error detecting chain config for finalized state")
	}

	s, err := vu.UnmarshalBeaconState(sb)
	if err != nil {
		return nil, errors.Wrap(err, "error unmarshaling finalized state to correct version")
	}

	slot := s.LatestBlockHeader().Slot
	bb, err := client.GetBlock(ctx, beacon.IdFromSlot(slot))
	if err != nil {
		return nil, errors.Wrapf(err, "error requesting block by slot = %d", slot)
	}
	b, err := vu.UnmarshalBeaconBlock(bb)
	if err != nil {
		return nil, errors.Wrap(err, "unable to unmarshal block to a supported type using the detected fork schedule")
	}
	br, err := b.Block().HashTreeRoot()
	if err != nil {
		return nil, errors.Wrap(err, "error computing hash_tree_root of retrieved block")
	}
	bodyRoot, err := b.Block().Body().HashTreeRoot()
	if err != nil {
		return nil, errors.Wrap(err, "error computing hash_tree_root of retrieved block body")
	}

	sbr := bytesutil.ToBytes32(s.LatestBlockHeader().BodyRoot)
	if sbr != bodyRoot {
		return nil, errors.Wrapf(errCheckpointBlockMismatch, "state body root = %#x, block body root = %#x", sbr, bodyRoot)
	}
	sr, err := s.HashTreeRoot(ctx)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to compute htr for finalized state at slot=%d", s.Slot())
	}

	return &OriginData{
		st: s,
		b:  b,
		sb: sb,
		bb: bb,
		vu: vu,
		br: br,
		sr: sr,
	}, nil
}
