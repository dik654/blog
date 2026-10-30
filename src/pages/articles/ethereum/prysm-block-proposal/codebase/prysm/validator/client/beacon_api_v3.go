// OffchainLabs/prysm v7.3.1 @ 96d418cd
// validator/client/beacon-api/get_beacon_block.go — 발췌

func (c *beaconApiValidatorClient) beaconBlock(
	ctx context.Context,
	slot primitives.Slot,
	randaoReveal, graffiti []byte,
	builderConfig *ethpb.BuilderConfig,
) (*ethpb.GenericBeaconBlock, error) {
	queryParams := neturl.Values{}
	queryParams.Add("randao_reveal", hexutil.Encode(randaoReveal))
	if len(graffiti) > 0 {
		g := bytesutil.ToBytes32(graffiti)
		queryParams.Add("graffiti", hexutil.Encode(g[:]))
	}

	if slots.ToEpoch(slot) >= params.BeaconConfig().GloasForkEpoch {
		return c.beaconBlockV4(ctx, slot, queryParams, builderConfig)
	}

	queryUrl := apiutil.BuildURL(fmt.Sprintf("/eth/v3/validator/blocks/%d", slot), queryParams)
	data, header, err := c.handler.GetSSZ(ctx, queryUrl, blockFreshnessOptions(ctx, decode)...)
	if err != nil {
		return nil, fmt.Errorf("get ssz: %w", err)
	}
	return decodeBlockV3Response(data, header, queryUrl)
}
