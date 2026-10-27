impl TxEip4844Sidecar for BlobTransactionSidecarVariant {
    #[cfg(feature = "kzg")]
    fn validate(
        &self,
        blob_versioned_hashes: &[alloy_primitives::B256],
        proof_settings: &c_kzg::KzgSettings,
    ) -> Result<(), BlobTransactionValidationError> {
        Self::validate(self, blob_versioned_hashes, proof_settings)
    }

    fn size(&self) -> usize {
        Self::size(self)
    }
}
