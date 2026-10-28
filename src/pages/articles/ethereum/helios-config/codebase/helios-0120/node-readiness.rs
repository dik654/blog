
#[cfg_attr(not(target_arch = "wasm32"), async_trait)]
#[cfg_attr(target_arch = "wasm32", async_trait(?Send))]
impl<N: NetworkSpec, C: Consensus<N::BlockResponse>, E: ExecutionProvider<N>> HeliosApi<N>
    for Node<N, C, E>
{
    async fn shutdown(&self) {
        info!(target: "helios::client","shutting down");
        if let Err(err) = self.consensus.shutdown() {
            warn!(target: "helios::client", error = %err, "graceful shutdown failed");
        }
    }

    async fn wait_synced(&self) -> Result<()> {
        self.consensus.wait_synced().await?;
        // Ethereum publishes both heads before consensus reports Synced. Other
        // networks (e.g. OP Stack) may only publish a latest head.
        let has_finalized_head = self.finalized_block_watch.borrow().is_some();
        tokio::try_join!(
            wait_for_initial_block(self.latest_block_status.clone()),
            async {
                if has_finalized_head {
                    wait_for_initial_block(self.finalized_block_status.clone()).await?;
                }
                Ok::<_, eyre::Report>(())
            },
        )?;
        Ok(())
    }

    async fn call(
        &self,
        tx: &N::TransactionRequest,
        block_id: BlockId,
        state_overrides: Option<StateOverride>,
    ) -> Result<Bytes> {
        self.check_blocktag_age(&block_id).await?;
        let (result, ..) = N::transact(
            tx,
            false,
            self.execution.clone(),
