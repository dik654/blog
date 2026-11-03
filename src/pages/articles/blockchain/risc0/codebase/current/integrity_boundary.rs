/// Verify the integrity of this receipt, ensuring the claim and journal
/// are attested to by the seal.
///
/// This does not verify the success of the guest execution. In
/// particular, the guest could have exited with an error (e.g.
/// `ExitCode::Halted(1)`) or faulted state. It also does not check the
/// image ID, or otherwise constrain what guest was executed. After calling
/// this method, the caller should check the [ReceiptClaim] fields
/// relevant to their application. If you need to verify a successful
/// guest execution and access the journal, the `verify` function is
/// recommended.
pub fn verify_integrity_with_context(
    &self,
    ctx: &VerifierContext,
) -> Result<(), VerificationError> {
    if self.inner.verifier_parameters() != self.metadata.verifier_parameters {
        // inner verifier_parameters do not match metadata.verifier_parameters.
        // This is an internal inconsistency in the receipt struct.
        return Err(VerificationError::ReceiptFormatError);
    }

    tracing::debug!("Receipt::verify_integrity_with_context");
    self.inner.verify_integrity_with_context(ctx)?;

    // Check that self.journal is attested to by the inner receipt.
    // We need to open the claim digest to do this, so it cannot be pruned.
    let maybe_pruned_claim = self.inner.claim()?;
    let claim = maybe_pruned_claim
        .as_value()
        .map_err(|_| VerificationError::ReceiptFormatError)?;
