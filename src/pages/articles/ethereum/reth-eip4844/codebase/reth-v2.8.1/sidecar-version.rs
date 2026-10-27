// EIP-7594 sidecar version handling
if self.eip7594 {
    // Standard Ethereum behavior
    if self.fork_tracker.is_osaka_activated() {
        if sidecar.is_eip4844() {
            self.validation_metrics.invalid_4844.increment(1);
            return Err(InvalidPoolTransactionError::Eip4844(
                Eip4844PoolTransactionError::UnexpectedEip4844SidecarAfterOsaka,
            ))
        }
    } else if sidecar.is_eip7594() && !self.allow_7594_sidecars() {
        self.validation_metrics.invalid_4844.increment(1);
        return Err(InvalidPoolTransactionError::Eip4844(
            Eip4844PoolTransactionError::UnexpectedEip7594SidecarBeforeOsaka,
        ))
    }
} else {
    // EIP-7594 disabled: always reject v1 sidecars, accept v0
    if sidecar.is_eip7594() {
        self.validation_metrics.invalid_4844.increment(1);
        return Err(InvalidPoolTransactionError::Eip4844(
            Eip4844PoolTransactionError::Eip7594SidecarDisallowed,
        ))
    }
}
