fn evm_env(&self, header: &Header) -> Result<EvmEnv<SpecId>, Self::Error> {
    Ok(EvmEnv::for_eth_block(
        header,
        self.chain_spec(),
        self.chain_spec().chain().id(),
        self.chain_spec().blob_params_at_timestamp(header.timestamp),
    ))
}

fn context_for_block<'a>(
    &self,
    block: &'a SealedBlock<Block>,
) -> Result<EthBlockExecutionCtx<'a>, Self::Error> {
    Ok(EthBlockExecutionCtx {
        tx_count_hint: Some(block.transaction_count()),
        parent_hash: block.header().parent_hash,
        parent_beacon_block_root: block.header().parent_beacon_block_root,
        ommers: &block.body().ommers,
        withdrawals: block
            .body()
            .withdrawals
            .as_ref()
            .map(|w| Cow::Borrowed(w.as_slice())),
        extra_data: block.header().extra_data.clone(),
        slot_number: block.header().slot_number,
    })
}
