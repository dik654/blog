async fn sync_fallback<S: ConsensusSpec, R: ConsensusRpc<S>>(
    inner: &mut Inner<S, R>,
    fallback: &Url,
) -> Result<()> {
    let checkpoint = CheckpointFallback::fetch_checkpoint_from_api(fallback).await?;
    inner.sync(checkpoint).await
}

async fn sync_all_fallbacks<S: ConsensusSpec, R: ConsensusRpc<S>>(
    inner: &mut Inner<S, R>,
    chain_id: u64,
) -> Result<()> {
    let network = Network::from_chain_id(chain_id)?;
    let checkpoint = CheckpointFallback::new()
        .build()
        .await?
        .fetch_latest_checkpoint(&network)
        .await?;

    inner.sync(checkpoint).await
}

