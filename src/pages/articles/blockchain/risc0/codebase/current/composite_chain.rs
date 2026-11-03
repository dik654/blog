// Verify each segment and its chaining to the next.
let mut expected_pre_state_digest = None;
for receipt in receipts {
    receipt.verify_integrity_with_context(ctx)?;
    tracing::debug!("claim: {:#?}", receipt.claim);
    if let Some(id) = expected_pre_state_digest
        && id != receipt.claim.pre.digest::<sha::Impl>()
    {
        return Err(VerificationError::ImageVerificationError);
    }
    if receipt.claim.exit_code != ExitCode::SystemSplit {
        return Err(VerificationError::UnexpectedExitCode);
    }
    if !receipt.claim.output.is_none() {
        return Err(VerificationError::ReceiptFormatError);
    }
    expected_pre_state_digest = Some(
        receipt
            .claim
            .post
            .as_value()
            .map_err(|_| VerificationError::ReceiptFormatError)?
            .digest::<sha::Impl>(),
    );
}

// Verify the last receipt in the continuation.
final_receipt.verify_integrity_with_context(ctx)?;
tracing::debug!("final: {:#?}", final_receipt.claim);
if let Some(id) = expected_pre_state_digest
    && id != final_receipt.claim.pre.digest::<sha::Impl>()
{
    return Err(VerificationError::ImageVerificationError);
}
