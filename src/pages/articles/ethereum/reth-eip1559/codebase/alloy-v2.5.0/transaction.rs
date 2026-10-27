pub trait Transaction: Send + Sync {
    fn max_fee_per_gas(&self) -> u128;
    fn max_priority_fee_per_gas(&self) -> Option<u128>;

    /// Returns the effective tip for this transaction.
    ///
    /// For dynamic fee transactions:
    /// `min(max_fee_per_gas - base_fee, max_priority_fee_per_gas)`.
    /// For legacy fee transactions: `gas_price - base_fee`.
    fn effective_tip_per_gas(&self, base_fee: u64) -> Option<u128> {
        let base_fee = base_fee as u128;
        let max_fee_per_gas = self.max_fee_per_gas();

        if max_fee_per_gas < base_fee {
            return None;
        }

        let fee = max_fee_per_gas - base_fee;
        self.max_priority_fee_per_gas()
            .map_or(Some(fee), |priority_fee| Some(fee.min(priority_fee)))
    }
}
