while let Some(pool_tx) = best_txs.next() {
    let exceeds_gas_limit = if is_amsterdam {
        let regular_available_gas = block_gas_limit.saturating_sub(block_regular_gas_used);
        let state_available_gas = block_gas_limit.saturating_sub(block_state_gas_used);
        let regular_tx_gas_limit = pool_tx.gas_limit().min(tx_gas_limit_cap);

        if regular_tx_gas_limit > regular_available_gas {
            Some((regular_tx_gas_limit, regular_available_gas))
        } else if pool_tx.gas_limit() > state_available_gas {
            Some((pool_tx.gas_limit(), state_available_gas))
        } else {
            None
        }
    } else {
        let block_available_gas = block_gas_limit.saturating_sub(cumulative_tx_gas_used);
        (pool_tx.gas_limit() > block_available_gas)
            .then_some((pool_tx.gas_limit(), block_available_gas))
    };

    if let Some((transaction_gas_limit, block_available_gas)) = exceeds_gas_limit {
        best_txs.mark_invalid(
            &pool_tx,
            InvalidPoolTransactionError::ExceedsGasLimit(
                transaction_gas_limit,
                block_available_gas,
            ),
        );
        continue
    }

    if cancel.is_cancelled() {
        return Ok(BuildOutcome::Cancelled)
    }
}
