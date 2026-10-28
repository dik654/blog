pub fn payload_id(
    parent: &B256,
    attributes: &alloy_rpc_types_engine::PayloadAttributes,
) -> PayloadId {
    use sha2::Digest;
    let mut hasher = sha2::Sha256::new();
    hasher.update(parent.as_slice());
    hasher.update(&attributes.timestamp.to_be_bytes()[..]);
    hasher.update(attributes.prev_randao.as_slice());
    hasher.update(attributes.suggested_fee_recipient.as_slice());
    if let Some(withdrawals) = &attributes.withdrawals {
        hasher.update(alloy_rlp::encode(withdrawals));
    }

    if let Some(parent_beacon_block) = attributes.parent_beacon_block_root {
        hasher.update(parent_beacon_block);
    }

    if let Some(slot_number) = attributes.slot_number {
        hasher.update(slot_number.to_be_bytes());
    }

    if let Some(target_gas_limit) = attributes.target_gas_limit {
        hasher.update(target_gas_limit.to_be_bytes());
    }

    let out = hasher.finalize();

    #[allow(deprecated)]
    PayloadId::new(out.as_slice()[..8].try_into().expect("sufficient length"))
}
