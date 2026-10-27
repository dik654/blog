pub struct TxEip4844 {
    // ...
    /// It contains a vector of fixed size hash(32 bytes)
    pub blob_versioned_hashes: Vec<B256>,

    /// Max fee per data gas
    ///
    /// aka BlobFeeCap or blobGasFeeCap
    #[cfg_attr(feature = "serde", serde(with = "alloy_serde::quantity"))]
    pub max_fee_per_blob_gas: u128,

    /// Input has two uses depending if transaction is Create or Call (if `to` field is None or
    /// Some). pub init: An unlimited size byte array specifying the
    /// EVM-code for the account initialisation procedure CREATE,
    /// data: An unlimited size byte array specifying the
    /// input data of the message call, formally Td.
    pub input: Bytes,
}

// ...

pub fn validate_blob<T: TxEip4844Sidecar>(
    &self,
    sidecar: &T,
    proof_settings: &c_kzg::KzgSettings,
) -> Result<(), BlobTransactionValidationError> {
    sidecar.validate(&self.blob_versioned_hashes, proof_settings)
}
