impl From<&BundleWitness> for BundleInfo {
    fn from(witness: &BundleWitness) -> Self {
        assert!(!witness.batch_infos.is_empty(), "at least one batch in a bundle");

        let first_batch = witness.batch_infos.first().unwrap();
        let last_batch = witness.batch_infos.last().unwrap();

        BundleInfo {
            chain_id: first_batch.chain_id,
            num_batches: u32::try_from(witness.batch_infos.len()).unwrap(),
            prev_state_root: first_batch.parent_state_root,
            prev_batch_hash: first_batch.parent_batch_hash,
            post_state_root: last_batch.state_root,
            batch_hash: last_batch.batch_hash,
            withdraw_root: last_batch.withdraw_root,
            msg_queue_hash: last_batch.post_msg_queue_hash,
            encryption_key: first_batch.encryption_key.clone(),
        }
    }
}
