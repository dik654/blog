let expected_base_fee = if chain_spec
    .fork(Hardfork::London)
    .transitions_at_block(header.number())
{
    alloy_eips::eip1559::INITIAL_BASE_FEE
} else {
    chain_spec
        .next_block_base_fee(parent, header.timestamp())
        .ok_or(ConsensusError::BaseFeeMissing)?
};

if expected_base_fee != base_fee {
    return Err(ConsensusError::BaseFeeDiff(GotExpected {
        got: base_fee,
        expected: expected_base_fee,
    }));
}
