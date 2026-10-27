// Payload EVM environment for the next block.
self.chain_spec()
    .next_block_base_fee(parent, attributes.timestamp)
    .unwrap_or_default();

// Transaction-pool view of the next block price.
let pending_block_base_fee = chain_spec
    .next_block_base_fee(new_tip.header(), new_tip.timestamp())
    .unwrap_or_default();
