// Ensure the versioned hashes and commitments have the same length.
if blob_versioned_hashes.len() != self.commitments.len() {
    return Err(c_kzg::Error::MismatchLength(format!(
        "There are {} versioned commitment hashes and {} commitments",
        blob_versioned_hashes.len(),
        self.commitments.len()
    ))
    .into());
}

for (versioned_hash, commitment) in
    blob_versioned_hashes.iter().zip(self.commitments.iter())
{
    // calculate & verify versioned hash
    let calculated_versioned_hash = kzg_to_versioned_hash(commitment.as_slice());
    if *versioned_hash != calculated_versioned_hash {
        return Err(BlobTransactionValidationError::WrongVersionedHash {
            have: *versioned_hash,
            expected: calculated_versioned_hash,
        });
    }
}
