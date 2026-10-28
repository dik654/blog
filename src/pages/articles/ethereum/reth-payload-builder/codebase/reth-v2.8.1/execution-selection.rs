let miner_fee = tx.effective_tip_per_gas(base_fee);
let tx_hash = *tx.tx_hash();

let mut tx_regular_gas_used = 0;
let gas_output = match builder.execute_transaction_with_result_closure(tx, |result| {
    tx_regular_gas_used = result.result().result.gas().block_regular_gas_used();
}) {
    Ok(gas_output) => gas_output,
    Err(BlockExecutionError::Validation(BlockValidationError::InvalidTx {
        error, ..
    })) => {
        if error.is_nonce_too_low() {
            trace!(target: "payload_builder", %error, ?tx_hash, "skipping nonce too low transaction");
        } else {
            trace!(target: "payload_builder", %error, ?tx_hash, "skipping invalid transaction and its descendants");
            best_txs.mark_invalid(
                &pool_tx,
                InvalidPoolTransactionError::Consensus(
                    InvalidTransactionError::TxTypeNotSupported,
                ),
            );
        }
        continue
    }
    Err(BlockExecutionError::Validation(
        BlockValidationError::TransactionGasLimitMoreThanAvailableBlockGas {
            transaction_gas_limit,
            block_available_gas,
        },
    )) => {
        trace!(target: "payload_builder", %transaction_gas_limit, %block_available_gas, ?tx_hash, "skipping transaction exceeding block gas limit");
        best_txs.mark_invalid(
            &pool_tx,
            InvalidPoolTransactionError::ExceedsGasLimit(
                transaction_gas_limit,
                block_available_gas,
            ),
        );
        continue
    }
    Err(err) => return Err(PayloadBuilderError::evm(err)),
};

let gas_used = gas_output.tx_gas_used();
let miner_fee = miner_fee.expect("fee is always valid; execution succeeded");
total_fees += U256::from(miner_fee) * U256::from(gas_used);
cumulative_tx_gas_used += gas_used;
block_regular_gas_used += tx_regular_gas_used;
block_state_gas_used += gas_output.state_gas_used();

if !is_better_payload(best_payload.as_ref(), total_fees) {
    drop(builder);
    return Ok(BuildOutcome::Aborted { fees: total_fees, cached_reads })
}
