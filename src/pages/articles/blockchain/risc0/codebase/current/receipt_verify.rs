pub fn verify_with_context(
    &self,
    ctx: &VerifierContext,
    image_id: impl Into<Digest>,
) -> Result<(), VerificationError> {
    if self.inner.verifier_parameters() != self.metadata.verifier_parameters {
        // inner verifier_parameters do not match metadata.verifier_parameters.
        // This is an internal inconsistency in the receipt struct.
        return Err(VerificationError::ReceiptFormatError);
    }

    tracing::debug!("Receipt::verify_with_context");
    self.inner.verify_integrity_with_context(ctx)?;

    // Check that the claim on the verified receipt matches what was expected. Since we have
    // constrained all field in the ReceiptClaim, we can directly construct the expected digest
    // and do not need to open the claim digest on the inner receipt.
    let expected_claim = ReceiptClaim::ok(image_id, MaybePruned::Pruned(self.journal.digest()));
    if expected_claim.digest() != self.inner.claim()?.digest() {
        tracing::debug!(
            "receipt claim does not match expected claim:\nreceipt: {:#?}\nexpected: {:#?}",
            self.inner.claim()?,
            expected_claim
        );
        return Err(VerificationError::ClaimDigestMismatch {
            expected: expected_claim.digest(),
            received: self.claim()?.digest(),
        });
    }

    Ok(())
}
