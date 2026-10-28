impl<S: ConsensusSpec, R: ConsensusRpc<S>, DB: Database> ConsensusClient<S, R, DB> {
    pub fn new(rpc: &Url, config: Arc<Config>) -> Result<ConsensusClient<S, R, DB>> {
        let (block_send, block_recv) = channel(256);
        let (finalized_block_send, finalized_block_recv) = watch::channel(None);
        let (checkpoint_send, checkpoint_recv) = watch::channel(None);
        let (sync_status_send, sync_status_recv) = watch::channel(ConsensusSyncStatus::Syncing);
        let (shutdown_send, shutdown_recv) = watch::channel(false);

        let config_clone = config.clone();
        let rpc = rpc.to_string();
        let genesis_time = config.chain.genesis_time;
        let db = Arc::new(DB::new(&config)?);
        let initial_checkpoint = config
            .checkpoint
            .unwrap_or_else(|| db.load_checkpoint().unwrap_or(config.default_checkpoint));

        #[cfg(not(target_arch = "wasm32"))]
        let run = tokio::spawn;

        #[cfg(target_arch = "wasm32")]
        let run = wasm_bindgen_futures::spawn_local;

        let mut shutdown_rx = shutdown_recv.clone();

        run(async move {
            let mut inner = Inner::<S, R>::new(
                &rpc,
                block_send,
                finalized_block_send,
                checkpoint_send,
                config.clone(),
            );

            let res = inner.sync(initial_checkpoint).await;
            if let Err(err) = res {
                if config.load_external_fallback {
                    let res = sync_all_fallbacks(&mut inner, config.chain.chain_id).await;
                    if let Err(err) = res {
                        error!(target: "helios::consensus", err = %err, "sync failed");
                        _ = sync_status_send.send(ConsensusSyncStatus::Error(err.to_string()));
                        return;
                    }
                } else if let Some(fallback) = &config.fallback {
                    let res = sync_fallback(&mut inner, fallback).await;
                    if let Err(err) = res {
                        error!(target: "helios::consensus", err = %err, "sync failed");
                        _ = sync_status_send.send(ConsensusSyncStatus::Error(err.to_string()));
                        return;
                    }
                } else {
                    error!(target: "helios::consensus", err = %err, "sync failed");
                    _ = sync_status_send.send(ConsensusSyncStatus::Error(err.to_string()));
                    return;
                }
            }

            if let Err(err) = inner.send_blocks().await {
                error!(target: "helios::consensus", error = %err, "failed to publish initial blocks");
                _ = sync_status_send.send(ConsensusSyncStatus::Error(err.to_string()));
                return;
            }
            _ = sync_status_send.send(ConsensusSyncStatus::Synced);

            let start = Instant::now() + inner.duration_until_next_update().to_std().unwrap();
            let mut interval = interval_at(start, std::time::Duration::from_secs(12));

            loop {
                tokio::select! {
                    result = shutdown_rx.changed() => {
                        if result.is_err() || *shutdown_rx.borrow_and_update() {
                            info!(target: "helios::consensus", "shutting down consensus client");
