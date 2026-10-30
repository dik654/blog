// OffchainLabs/prysm v7.3.1 @ 96d418cd
// validator/client/propose.go — Fulu proposal 경로 발췌

func (v *validator) ProposeBlock(ctx context.Context, slot primitives.Slot, pubKey [fieldparams.BLSPubkeyLength]byte) {
	if slot == 0 {
		return
	}

	lock := async.NewMultilock(fmt.Sprint(roleProposer), string(pubKey[:]))
	lock.Lock()
	defer lock.Unlock()

	epoch := primitives.Epoch(slot / params.BeaconConfig().SlotsPerEpoch)
	randaoReveal, err := v.signRandaoReveal(ctx, pubKey, epoch, slot)
	if err != nil {
		return
	}
	g, err := v.Graffiti(ctx, pubKey)
	if err != nil {
		log.WithError(err).Warn("Could not get graffiti")
	}

	b, err := v.validatorClient.BeaconBlock(ctx, &ethpb.BlockRequest{
		Slot:          slot,
		RandaoReveal:  randaoReveal,
		Graffiti:      g,
		BuilderConfig: v.builderConfigForSlot(ctx, pubKey, slot),
	})
	if err != nil {
		return
	}

	wb, err := blocks.NewBeaconBlock(b.Block)
	if err != nil {
		return
	}
	sig, signingRoot, err := v.signBlock(ctx, pubKey, epoch, slot, wb)
	if err != nil {
		return
	}
	blk, err := blocks.BuildSignedBeaconBlock(wb, sig)
	if err != nil {
		return
	}

	if err := v.db.SlashableProposalCheck(ctx, pubKey, blk, signingRoot, v.emitAccountMetrics, ValidatorProposeFailVec); err != nil {
		return
	}

	// Deneb 이후 pre-Gloas full block은 blob/data-column contents와 함께 제출합니다.
	pb, err := blk.Proto()
	if err != nil {
		return
	}
	genericSignedBlock, err := buildGenericSignedBlockFuluWithBlobs(pb, b)
	if err != nil {
		return
	}

	if _, err := v.validatorClient.ProposeBeaconBlock(ctx, genericSignedBlock); err != nil {
		return
	}
}

func (v *validator) signRandaoReveal(ctx context.Context, pubKey [fieldparams.BLSPubkeyLength]byte, epoch primitives.Epoch, slot primitives.Slot) ([]byte, error) {
	domain, err := v.domainData(ctx, epoch, params.BeaconConfig().DomainRandao[:])
	if err != nil {
		return nil, err
	}
	sszUint := primitives.SSZUint64(epoch)
	root, err := signing.ComputeSigningRoot(&sszUint, domain.SignatureDomain)
	if err != nil {
		return nil, err
	}
	return v.km.Sign(ctx, &validatorpb.SignRequest{
		PublicKey:       pubKey[:],
		SigningRoot:     root[:],
		SignatureDomain: domain.SignatureDomain,
		Object:          &validatorpb.SignRequest_Epoch{Epoch: epoch},
		SigningSlot:     slot,
	})
}
