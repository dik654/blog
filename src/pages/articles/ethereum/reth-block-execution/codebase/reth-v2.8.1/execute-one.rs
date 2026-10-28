/// Consumes the type and executes the block.
///
/// # Note
/// Execution happens without any validation of the output.
fn execute(
    mut self,
    block: &RecoveredBlock<<Self::Primitives as NodePrimitives>::Block>,
) -> Result<BlockExecutionOutput<<Self::Primitives as NodePrimitives>::Receipt>, Self::Error> {
    let result = self.execute_one(block)?;
    let mut state = self.into_state();
    Ok(BlockExecutionOutput { state: state.take_bundle(), result })
}

fn execute_one(
    &mut self,
    block: &RecoveredBlock<<Self::Primitives as NodePrimitives>::Block>,
) -> Result<BlockExecutionResult<<Self::Primitives as NodePrimitives>::Receipt>, Self::Error> {
    let mut executor = self
        .strategy_factory
        .executor_for_block(&mut self.db, block)
        .map_err(BlockExecutionError::other)?;

    let has_bal = block.header().block_access_list_hash().is_some();
    if has_bal {
        executor.evm_mut().db_mut().bal_state.bal_builder = Some(Bal::new());
    } else {
        executor.evm_mut().db_mut().bal_state.bal_builder = None;
    }

    executor.apply_pre_execution_changes()?;
    if has_bal {
        executor.evm_mut().db_mut().bump_bal_index();
    }

    for tx in block.transactions_recovered() {
        executor.execute_transaction(tx)?;
        if has_bal {
            executor.evm_mut().db_mut().bump_bal_index();
        }
    }

    let result = executor.apply_post_execution_changes()?;
    self.db.merge_transitions(BundleRetention::Reverts);
    Ok(result)
}
