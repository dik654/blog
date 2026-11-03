pub fn execute(witness: ChunkWitness) -> Result<ChunkInfo, String> {
    let chain = Chain::from_id(witness.blocks[0].chain_id);
    let prev_blockhash = witness.blocks[0].header.parent_hash();
    let post_blockhash = witness
        .blocks
        .last()
        .expect("witnesses can not be empty")
        .header
        .hash_slow();
    let chain_spec = build_chain_spec_force_hardfork(
        chain,
        match witness.fork_name {
            ForkName::EuclidV1 => Hardfork::Euclid,
            ForkName::EuclidV2 => Hardfork::EuclidV2,
            ForkName::Feynman => Hardfork::Feynman,
            ForkName::Galileo => Hardfork::Galileo,
            ForkName::GalileoV2 => Hardfork::GalileoV2,
        },
    );

    let VerifyResult {
        blocks,
        pre_state_root,
        post_state_root,
        withdraw_root,
        ..
    } = verifier::run(&witness.blocks, chain_spec, witness.compression_infos)
        .map_err(|e| format!("verify error: {e}"))?;

    let blocks = manually_drop_on_zkvm!(blocks);
    let mut rlp_buffer = manually_drop_on_zkvm!(Vec::with_capacity(2048));
    let (tx_data_length, tx_data_digest) = blocks.tx_bytes_hash_in(rlp_buffer.as_mut());

    let data_hash = if witness.fork_name < ForkName::EuclidV2 {
        blocks.legacy_data_hash()
    } else {
        B256::default()
    };
    let post_msg_queue_hash = if witness.fork_name >= ForkName::EuclidV2 {
        blocks.rolling_msg_queue_hash(witness.prev_msg_queue_hash, witness.validium.as_ref())
    } else {
        B256::default()
    };

    let chunk_info = ChunkInfo {
        chain_id: chain.id(),
        prev_state_root: pre_state_root,
        post_state_root,
        data_hash,
        withdraw_root,
        tx_data_digest,
        tx_data_length: tx_data_length as u64,
        initial_block_number: blocks[0].header().number,
        prev_msg_queue_hash: witness.prev_msg_queue_hash,
        post_msg_queue_hash,
        block_ctxs: blocks.iter().map(block_to_context).collect(),
        prev_blockhash,
        post_blockhash,
        encryption_key: witness.validium.map(|input| {
            SecretKey::try_from_bytes(input.secret_key)
                .expect("validium key")
                .public_key()
                .to_bytes(true)
        }),
    };

    #[cfg(target_os = "zkvm")]
    println!("chunk_info = {}", chunk_info);

    Ok(chunk_info)
}
