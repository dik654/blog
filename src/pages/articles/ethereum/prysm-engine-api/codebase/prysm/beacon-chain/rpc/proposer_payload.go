payloadId, ok := vs.PayloadIDCache.PayloadID(slot, parentRoot, parentFull)

if ok && payloadId != [8]byte{} {
	var pid primitives.PayloadID
	copy(pid[:], payloadId[:])
	payloadIDCacheHit.Inc()
	res, err := vs.ExecutionEngineCaller.GetPayload(ctx, pid, slot)
	if err == nil {
		warnIfFeeRecipientDiffers(val.FeeRecipient[:], res.ExecutionData.FeeRecipient())
		return res, nil
	}
	if !errors.Is(err, context.DeadlineExceeded) {
		return nil, errors.Wrap(err, "could not get cached payload from execution client")
	}
}

payloadID, _, err := vs.ExecutionEngineCaller.ForkchoiceUpdated(ctx, f, attr)
if err != nil {
	return nil, errors.Wrap(err, "could not prepare payload")
}
if payloadID == nil {
	return nil, fmt.Errorf("nil payload with block hash: %#x", parentHash)
}
res, err := vs.ExecutionEngineCaller.GetPayload(ctx, *payloadID, slot)
if err != nil {
	return nil, err
}
