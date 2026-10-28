// a16z/helios 0.11.1 · commit 204c998a927348e1c000a664f08d5b37b1b0d924
// Source excerpt: core/src/client/node.rs lines 186-236 and 281-389
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
            self.get_chain_id().await,
            self.fork_schedule,
            block_id,
            state_overrides,
        )
        .await?;

        let res = match result {
            ExecutionResult::Success { output, .. } => Ok(output.into_data()),
            ExecutionResult::Revert { output, .. } => {
                Err(EvmError::Revert(Some(output.to_vec().into())))
            }
            ExecutionResult::Halt { .. } => Err(EvmError::Revert(None)),
        }?;

        Ok(res)
    }

    async fn estimate_gas(
        &self,
        tx: &N::TransactionRequest,
        block_id: Option<BlockId>,
        state_overrides: Option<StateOverride>,
    ) -> Result<u64> {
        let block_id = block_id.unwrap_or(BlockId::latest());
        self.check_blocktag_age(&block_id).await?;

        let (result, ..) = N::transact(
            tx,
            false,
            self.execution.clone(),
            self.get_chain_id().await,
            self.fork_schedule,
            block_id,
            state_overrides,
        )
        .await?;

        Ok(result.gas_used())
    }
    async fn get_balance(&self, address: Address, block_id: BlockId) -> Result<U256> {
        self.check_blocktag_age(&block_id).await?;
        let account = self
            .execution
            .get_account(address, &[], false, block_id)
            .await?;

        Ok(account.account.balance)
    }

    async fn get_nonce(&self, address: Address, block_id: BlockId) -> Result<u64> {
        self.check_blocktag_age(&block_id).await?;
        let account = self
            .execution
            .get_account(address, &[], false, block_id)
            .await?;

        Ok(account.account.nonce)
    }

    async fn get_block_transaction_count(&self, block_id: BlockId) -> Result<Option<u64>> {
        let block = self.execution.get_block(block_id, false).await?;
        Ok(block.map(|block| block.transactions().hashes().len() as u64))
    }

    async fn get_code(&self, address: Address, block_id: BlockId) -> Result<Bytes> {
        self.check_blocktag_age(&block_id).await?;
        let account = self
            .execution
            .get_account(address, &[], true, block_id)
            .await?;

        account
            .code
            .ok_or(eyre!("Failed to fetch code for address"))
    }

    async fn get_storage_at(
        &self,
        address: Address,
        slot: U256,
        block_id: BlockId,
    ) -> Result<B256> {
        self.check_blocktag_age(&block_id).await?;
        self.execution
            .get_account(address, &[slot.into()], false, block_id)
            .await?
            .get_storage_value(slot.into())
            .ok_or(eyre!("slot not found"))
            .map(|v| v.into())
    }

    async fn get_proof(
        &self,
        address: Address,
        slots: &[B256],
        block_id: BlockId,
    ) -> Result<EIP1186AccountProofResponse> {
        self.check_blocktag_age(&block_id).await?;
        let account = self
            .execution
            .get_account(address, slots, false, block_id)
            .await?;

        Ok(EIP1186AccountProofResponse {
            address,
            balance: account.account.balance,
            code_hash: account.account.code_hash,
            nonce: account.account.nonce,
            storage_hash: account.account.storage_root,
            account_proof: account.account_proof,
            storage_proof: account.storage_proof,
        })
    }

    async fn send_raw_transaction(&self, bytes: &[u8]) -> Result<B256> {
        self.execution.send_raw_transaction(bytes).await
    }

    async fn get_transaction_receipt(&self, tx_hash: B256) -> Result<Option<N::ReceiptResponse>> {
        self.execution.get_receipt(tx_hash).await
    }

    async fn get_block_receipts(
        &self,
        block_id: BlockId,
    ) -> Result<Option<Vec<N::ReceiptResponse>>> {
        self.check_blocktag_age(&block_id).await?;
        self.execution.get_block_receipts(block_id).await
    }

    async fn get_transaction(&self, tx_hash: B256) -> Result<Option<N::TransactionResponse>> {
        self.execution.get_transaction(tx_hash).await
    }

    async fn get_transaction_by_block_and_index(
        &self,
        block_id: BlockId,
        index: u64,
    ) -> Result<Option<N::TransactionResponse>> {
        self.check_blocktag_age(&block_id).await?;
        self.execution
            .get_transaction_by_location(block_id, index)
            .await
    }

    async fn get_logs(&self, filter: &Filter) -> Result<Vec<Log>> {
        self.execution.get_logs(filter).await
    }
