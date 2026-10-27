// Reth v2.8.1 · crates/transaction-pool/src/ordering.rs · L39–85

/// Transaction ordering trait to determine the order of transactions.
///
/// Decides how transactions should be ordered within the pool, depending on a `Priority` value.
/// The returned priority must reflect total order.
pub trait TransactionOrdering: Debug + Send + Sync + 'static {
    /// Higher is better.
    type PriorityValue: Ord + Clone + Default + Debug + Send + Sync;
    type Transaction: PoolTransaction;

    fn priority(
        &self,
        transaction: &Self::Transaction,
        base_fee: u64,
    ) -> Priority<Self::PriorityValue>;
}

/// Default ordering for the pool.
/// The transactions are ordered by their coinbase tip.
#[derive(Debug)]
#[non_exhaustive]
pub struct CoinbaseTipOrdering<T>(PhantomData<T>);

impl<T> TransactionOrdering for CoinbaseTipOrdering<T>
where
    T: PoolTransaction + 'static,
{
    type PriorityValue = u128;
    type Transaction = T;

    fn priority(
        &self,
        transaction: &Self::Transaction,
        base_fee: u64,
    ) -> Priority<Self::PriorityValue> {
        transaction.effective_tip_per_gas(base_fee).into()
    }
}
