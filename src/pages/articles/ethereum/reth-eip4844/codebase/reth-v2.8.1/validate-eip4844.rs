// validate the blob
if let Err(err) = transaction.validate_blob(&sidecar, self.kzg_settings.get()) {
    self.validation_metrics.invalid_4844.increment(1);
    return Err(InvalidPoolTransactionError::Eip4844(
        Eip4844PoolTransactionError::InvalidEip4844Blob(err),
    ))
}
// Record the duration of successful blob validation as histogram
self.validation_metrics.blob_validation_duration.record(now.elapsed());
// store the extracted blob
maybe_blob_sidecar = Some(sidecar);
