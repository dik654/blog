fn validate_aggregated_pi(
    agg_pis: &[Self::AggregatedPublicInputs],
    agg_pi_hashes: &[B256],
) {
    assert!(!agg_pis.is_empty(), "at least 1 pi to aggregate");

    for w in agg_pis.windows(2) {
        w[1].validate(&w[0]);
    }

    for (agg_pi, &agg_pi_hash) in agg_pis.iter().zip_eq(agg_pi_hashes.iter()) {
        assert_eq!(
            agg_pi.pi_hash(),
            agg_pi_hash,
            "pi hash mismatch between proofs and witness computed"
        );
    }
}

fn validate_chunk_link(next: &ChunkInfo, prev: &ChunkInfo) {
    assert_eq!(next.chain_id, prev.chain_id);
    assert_eq!(next.prev_state_root, prev.post_state_root);
    assert_eq!(next.prev_msg_queue_hash, prev.post_msg_queue_hash);
}
