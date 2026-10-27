let res = proof_settings
    .verify_blob_kzg_proof_batch(
        Blob::slice_as_ckzg(self.blobs.as_slice()),
        Bytes48::slice_as_ckzg(self.commitments.as_slice()),
        Bytes48::slice_as_ckzg(self.proofs.as_slice()),
    )
    .map_err(BlobTransactionValidationError::KZGError)?;

res.then_some(()).ok_or(BlobTransactionValidationError::InvalidProof)
