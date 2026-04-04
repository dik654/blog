use ethers::types::*;

pub struct ExecutionRpc {
    provider: RpcClient,
}

impl ExecutionRpc {
    pub async fn get_balance(
        &self, addr: &Address,
        block: BlockTag,
    ) -> Result<U256> {
        let proof = self.provider
            .get_proof(addr, &[], block)
            .await?;
        verify_proof(&proof)?;
        Ok(proof.balance)
    }

    pub async fn get_code(
        &self, addr: &Address,
        block: BlockTag,
    ) -> Result<Bytes> {
        let proof = self.provider
            .get_proof(addr, &[], block)
            .await?;
        verify_proof(&proof)?;
        Ok(proof.code)
    }

    pub async fn get_storage_at(
        &self, addr: &Address,
        slot: H256, block: BlockTag,
    ) -> Result<H256> {
        let proof = self.provider
            .get_proof(
                addr, &[slot], block,
            ).await?;
        verify_proof(&proof)?;
        Ok(proof.storage_proof[0]
            .value)
    }
}
