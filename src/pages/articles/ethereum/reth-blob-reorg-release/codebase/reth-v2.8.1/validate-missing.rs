    /// Validates EIP-4844 blob sidecar data and returns the extracted sidecar, if any.
    pub fn validate_eip4844(
        &self,
        transaction: &mut Tx,
    ) -> Result<Option<PooledBlobSidecar>, InvalidPoolTransactionError> {
        let mut maybe_blob_sidecar = None;

        // heavy blob tx validation
        if transaction.is_eip4844() {
            // extract the blob from the transaction
            match transaction.take_blob() {
                EthBlobTransactionSidecar::None => {
                    // this should not happen
                    self.validation_metrics.invalid_4844.increment(1);
                    return Err(InvalidTransactionError::TxTypeNotSupported.into())
                }
                EthBlobTransactionSidecar::Missing => {
                    // This can happen for re-injected blob transactions (on re-org), since the blob
                    // is stripped from the transaction and not included in a block.
                    // check if the blob is in the store, if it's included we previously validated
                    // it and inserted it
                    if self.blob_store.contains(*transaction.hash()).is_ok_and(|c| c) {
                        // validated transaction is already in the store
                    } else {
                        self.validation_metrics.invalid_4844.increment(1);
                        return Err(InvalidPoolTransactionError::Eip4844(
                            Eip4844PoolTransactionError::MissingEip4844BlobSidecar,
                        ))
                    }
                }
