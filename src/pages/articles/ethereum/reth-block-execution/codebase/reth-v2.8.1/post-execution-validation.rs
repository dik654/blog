pub fn validate_block_post_execution<B, R, ChainSpec>(
    block: &RecoveredBlock<B>,
    chain_spec: &ChainSpec,
    result: &BlockExecutionResult<R>,
    receipt_root_bloom: Option<(B256, Bloom)>,
    block_access_list_hash: Option<B256>,
) -> Result<(), ConsensusError>
where
    B: Block,
    R: Receipt,
    ChainSpec: EthereumHardforks,
{
    if block.header().gas_used() != result.gas_used {
        return Err(ConsensusError::BlockGasUsed {
            gas: GotExpected {
                got: result.gas_used,
                expected: block.header().gas_used(),
            },
            gas_spent_by_tx: gas_spent_by_transactions(&result.receipts),
        });
    }

    if chain_spec.is_byzantium_active_at_block(block.header().number()) {
        verify_receipts(
            block.header().receipts_root(),
            block.header().logs_bloom(),
            &result.receipts,
        )?;
    }

    if chain_spec.is_prague_active_at_timestamp(block.header().timestamp()) {
        let Some(header_requests_hash) = block.header().requests_hash() else {
            return Err(ConsensusError::RequestsHashMissing);
        };
        let requests_hash = result.requests.requests_hash();
        if requests_hash != header_requests_hash {
            return Err(ConsensusError::BodyRequestsHashDiff(
                GotExpected::new(requests_hash, header_requests_hash).into(),
            ));
        }
    }

    if chain_spec.is_amsterdam_active_at_timestamp(block.header().timestamp()) {
        let Some(got) = block_access_list_hash else {
            return Err(ConsensusError::BlockAccessListHashMissing);
        };
        let expected = block.header().block_access_list_hash().unwrap_or_default();
        if got != expected {
            return Err(ConsensusError::BlockAccessListHashMismatch(
                GotExpected::new(got, expected).into(),
            ));
        }
    }

    Ok(())
}
