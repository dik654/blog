// a16z/helios 0.11.1 · commit 204c998a927348e1c000a664f08d5b37b1b0d924
// Source excerpt: ethereum/src/evm.rs lines 52-140 and 178-199
    pub async fn transact_inner(
        &mut self,
        tx: &TransactionRequest,
        validate_tx: bool,
        state_overrides: Option<StateOverride>,
    ) -> Result<(ExecutionResult, HashMap<Address, Account>), EvmError> {
        let block = self
            .execution
            .get_block(self.block_id, false)
            .await
            .map_err(|err| EvmError::Generic(err.to_string()))?
            .ok_or(ExecutionError::BlockNotFound(self.block_id))
            .map_err(|err| EvmError::Generic(err.to_string()))?;

        // Pin block to a specific hash for the entire EVM run.
        let pinned_block: RpcBlockHash = block.header.hash.into();

        let mut db = ProofDB::new(pinned_block, self.execution.clone(), state_overrides);
        _ = db.state.prefetch_state(tx, validate_tx).await;

        // Track iterations for debugging
        let mut iteration: u32 = 0;

        let tx_res = loop {
            iteration += 1;

            // Update state first if needed
            if db.state.needs_update() {
                debug!(
                    "evm cache miss (iteration {}): {:?}",
                    iteration,
                    db.state.access.as_ref().unwrap()
                );
                db.state
                    .update_state()
                    .await
                    .map_err(|e| EvmError::Generic(e.to_string()))?;
            }

            // Create EVM after any async operations
            let context = self.get_context(tx, &block, validate_tx);

            // Execute in a scope to ensure EVM is dropped before any potential async operations
            let (result, needs_update) = {
                let mut evm = context.with_db(&mut db).build_mainnet();
                let res = evm.replay();
                let needs_update = evm.db_mut().state.needs_update();
                (res, needs_update)
            };

            if result.is_ok() || !needs_update {
                break result.map(|res| (res.result, mem::take(&mut db.state.accounts)));
            }
        };

        tx_res.map_err(|err| EvmError::Generic(format!("generic: {err}")))
    }

    fn get_context(
        &self,
        tx: &TransactionRequest,
        block: &Block<Transaction>,
        validate_tx: bool,
    ) -> Context {
        let spec = get_spec_id_for_block_timestamp(block.header.timestamp, &self.fork_schedule);
        let mut tx_env = Self::tx_env(tx, spec);

        if <TxType as Into<u8>>::into(
            <TransactionRequest as TransactionBuilder<Ethereum>>::output_tx_type(tx),
        ) == 0u8
        {
            tx_env.chain_id = None;
        } else {
            tx_env.chain_id = Some(self.chain_id);
        }

        let mut cfg = CfgEnv::default();
        cfg.spec = get_spec_id_for_block_timestamp(block.header.timestamp, &self.fork_schedule);
        cfg.chain_id = self.chain_id;
        cfg.disable_block_gas_limit = !validate_tx;
        cfg.disable_eip3607 = !validate_tx;
        cfg.disable_base_fee = !validate_tx;
        cfg.disable_nonce_check = !validate_tx;

        Context::mainnet()
            .with_tx(tx_env)
            .with_block(Self::block_env(block, &self.fork_schedule))
            .with_cfg(cfg)
    }
    fn block_env(block: &Block<Transaction, Header>, fork_schedule: &ForkSchedule) -> BlockEnv {
        // Get blob base fee update fraction based on fork
        let blob_base_fee_update_fraction =
            fork_schedule.get_blob_base_fee_update_fraction(block.header.timestamp());

        let blob_excess_gas_and_price = block
            .header
            .excess_blob_gas()
            .map(|v| BlobExcessGasAndPrice::new(v, blob_base_fee_update_fraction))
            .unwrap_or_else(|| BlobExcessGasAndPrice::new(0, blob_base_fee_update_fraction));

        BlockEnv {
            number: U256::from(block.header.number()),
            beneficiary: block.header.beneficiary(),
            timestamp: U256::from(block.header.timestamp()),
            gas_limit: block.header.gas_limit(),
            basefee: block.header.base_fee_per_gas().unwrap_or_default(),
            difficulty: block.header.difficulty(),
            prevrandao: block.header.mix_hash(),
            blob_excess_gas_and_price: Some(blob_excess_gas_and_price),
        }
    }
