/// [`BlockExecutionResult`] combined with state.
pub struct BlockExecutionOutput<T> {
    /// All the receipts of the transactions in the block.
    pub result: BlockExecutionResult<T>,
    /// The changed state of the block after execution.
    pub state: BundleState,
}

pub struct BlockExecutionResult<R> {
    /// Receipts produced by each transaction, in body order.
    pub receipts: Vec<R>,
    /// EIP-7685 execution requests produced by this block.
    pub requests: Requests,
    /// Total transaction gas used by the block.
    pub gas_used: u64,
    /// Total blob gas used by the block.
    pub blob_gas_used: u64,
}

/// Represents the outcome of multiple executed blocks.
pub struct ExecutionOutcome<T> {
    /// Bundle state with reverts.
    pub bundle: BundleState,
    /// One ordered receipt vector per block.
    pub receipts: Vec<Vec<T>>,
    /// First block represented by the bundle.
    pub first_block: BlockNumber,
    /// One request collection per block.
    pub requests: Vec<Requests>,
}
