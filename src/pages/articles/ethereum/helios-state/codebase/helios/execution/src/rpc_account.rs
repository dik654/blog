async fn get_account(
    &self,
    address: Address,
    slots: &[B256],
    with_code: bool,
    block_id: BlockId,
) -> Result<Account> {
    let block = self
        .get_block(block_id, false)
        .await?
        .ok_or(eyre!("block not found"))?;

    let proof = self
        .provider
        .get_proof(address, slots.to_vec())
        .block_id(block.header().hash().into())
        .await?;

    verify_account_proof(&proof, block.header().state_root())?;
    verify_storage_proof(&proof)?;

    let code = if with_code {
        if proof.code_hash == KECCAK_EMPTY || proof.code_hash == B256::ZERO {
            Some(Bytes::new())
        } else {
            let code = self.provider.get_code_at(address).await?;
            verify_code_hash_proof(&proof, &code)?;
            Some(code)
        }
    } else {
        None
    };

    Ok(Account {
        account: TrieAccount {
            nonce: proof.nonce,
            balance: proof.balance,
            storage_root: proof.storage_hash,
            code_hash: proof.code_hash,
        },
        code,
        account_proof: proof.account_proof,
        storage_proof: proof.storage_proof,
    })
}
