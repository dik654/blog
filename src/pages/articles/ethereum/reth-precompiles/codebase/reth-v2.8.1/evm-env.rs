// Source: paradigmxyz/reth v2.8.1
// crates/ethereum/evm/src/lib.rs (focused excerpt)

fn evm_env(&self, header: &Header) -> Result<EvmEnv<SpecId>, Self::Error> {
    Ok(EvmEnv::for_eth_block(
        header,
        self.chain_spec(),
        self.chain_spec().chain().id(),
        self.chain_spec().blob_params_at_timestamp(header.timestamp),
    ))
}
