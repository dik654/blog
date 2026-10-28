fn new_payload_job(
    &self,
    input: BuildNewPayload<Builder::Attributes>,
    id: PayloadId,
) -> Result<Self::Job, PayloadBuilderError> {
    let BuildNewPayload { attributes, parent_hash, mut resources } = input;
    let parent_header = if parent_hash.is_zero() {
        self.client
            .latest_header()
            .map_err(PayloadBuilderError::from)?
            .ok_or_else(|| PayloadBuilderError::MissingParentHeader(B256::ZERO))?
    } else {
        self.client
            .sealed_header_by_hash(parent_hash)
            .map_err(PayloadBuilderError::from)?
            .ok_or_else(|| PayloadBuilderError::MissingParentHeader(parent_hash))?
    };

    let parent_hash = parent_header.hash();
    let cached_reads = self.maybe_pre_cached(parent_hash);
    let parent_block_info = self.maybe_parent_block_info(parent_hash);

    let config = PayloadConfig::new(Arc::new(parent_header), attributes, id)
        .with_parent_block_info(parent_block_info);

    let until = self.job_deadline(config.attributes.timestamp());
    let deadline = Box::pin(tokio::time::sleep_until(until));

    let mut job = BasicPayloadJob {
        config,
        executor: self.executor.clone(),
        deadline,
        interval: tokio::time::interval(self.config.interval),
        best_payload: PayloadState::Missing,
        pending_block: None,
        cached_reads,
        execution_cache: resources.take_execution_cache(),
        state_root_handle: resources.take_state_root_handle(),
        leases: resources.take_leases(),
        payload_task_guard: self.payload_task_guard.clone(),
        metrics: Default::default(),
        builder: self.builder.clone(),
    };

    job.spawn_build_job();

    Ok(job)
}
