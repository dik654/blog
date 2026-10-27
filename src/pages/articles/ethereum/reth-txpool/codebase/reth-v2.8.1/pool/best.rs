// Reth v2.8.1 · crates/transaction-pool/src/pool/best.rs
// Excerpts: L87–120 and L206–248.

/// An iterator that returns transactions that can be executed on the current state.
///
/// The PendingPool contains all gapless transactions of a sender, but only yields the
/// transaction with the current on-chain nonce.
#[derive(Debug)]
pub struct BestTransactions<T: TransactionOrdering> {
    /// Copy of all pending transactions when this iterator was created.
    pub(crate) all: OrdMap<TransactionId, PendingTransaction<T>>,
    /// Transactions that can be executed right away.
    /// Once nonce N is returned, it unlocks N+1.
    pub(crate) independent: BTreeSet<PendingTransaction<T>>,
    /// Senders whose yielded transaction was marked invalid.
    pub(crate) invalid: FxHashSet<SenderId>,
    pub(crate) new_transaction_receiver: Option<Receiver<PendingTransaction<T>>>,
    pub(crate) last_priority: Option<Priority<T::PriorityValue>>,
    pub(crate) skip_blobs: bool,
    pub(crate) allow_updates_out_of_order: bool,
}

// ... iterator helpers L122–205 omitted ...

pub fn next_tx_and_priority(
    &mut self,
) -> Option<(Arc<ValidPoolTransaction<T::Transaction>>, Priority<T::PriorityValue>)> {
    loop {
        self.add_new_transactions();
        // Remove the next independent tx with the highest priority
        let best = self.pop_best()?;
        let sender_id = best.transaction.sender_id();

        // skip transactions for which sender was marked as invalid
        if self.invalid.contains(&sender_id) {
            continue
        }

        // Insert transactions that just got unlocked.
        if let Some(unlocked) = self.all.get(&best.unlocks()) {
            self.independent.insert(unlocked.clone());
        }

        if self.skip_blobs && best.transaction.is_eip4844() {
            self.mark_invalid(
                &best.transaction,
                InvalidPoolTransactionError::Eip4844(
                    Eip4844PoolTransactionError::NoEip4844Blobs,
                ),
            )
        } else {
            if self.new_transaction_receiver.is_some() {
                self.last_priority = Some(best.priority.clone())
            }
            return Some((best.transaction, best.priority))
        }
    }
}
