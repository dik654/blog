// Reth v2.8.1 · crates/transaction-pool/src/pool/state.rs
// Excerpts: L3–48 and L143–205. Reason helpers between them are omitted.

bitflags::bitflags! {
    /// Marker to represents the current state of a transaction in the pool and from which the corresponding sub-pool is derived, depending on what bits are set.
    ///
    /// The [`SubPool`] the transaction belongs to is derived from its state and determined by the following sequential checks:
    ///
    /// - If it satisfies the [`TxState::PENDING_POOL_BITS`] it belongs in the pending sub-pool: [`SubPool::Pending`].
    /// - If it is an EIP-4844 blob transaction it belongs in the blob sub-pool: [`SubPool::Blob`].
    /// - If it satisfies the [`TxState::BASE_FEE_POOL_BITS`] it belongs in the base fee sub-pool: [`SubPool::BaseFee`].
    ///
    /// Otherwise, it belongs in the queued sub-pool: [`SubPool::Queued`].
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default, PartialOrd, Ord)]
    pub(crate) struct TxState: u8 {
        /// Set to `1` if all ancestor transactions are pending.
        const NO_PARKED_ANCESTORS = 0b10000000;
        /// Set to `1` if the transaction is either the next transaction of the sender (on chain nonce == tx.nonce) or all prior transactions are also present in the pool.
        const NO_NONCE_GAPS = 0b01000000;
        /// Set to `1` if the sender's balance can cover the maximum cost for this transaction.
        const ENOUGH_BALANCE = 0b00100000;
        /// Bit set to true if the transaction has a lower gas limit than the block's gas limit.
        const NOT_TOO_MUCH_GAS = 0b00010000;
        /// Set to 1 if `maxFeePerGas` meets the requirement of the pending block.
        const ENOUGH_FEE_CAP_BLOCK = 0b00001000;
        /// Set to 1 if `maxBlobFeePerGas` meets the pending block's blob fee.
        const ENOUGH_BLOB_FEE_CAP_BLOCK = 0b00000100;
        /// Marks whether the transaction is a blob transaction.
        const BLOB_TRANSACTION = 0b00000010;

        const PENDING_POOL_BITS = Self::NO_PARKED_ANCESTORS.bits() | Self::NO_NONCE_GAPS.bits() | Self::ENOUGH_BALANCE.bits() | Self::NOT_TOO_MUCH_GAS.bits() | Self::ENOUGH_FEE_CAP_BLOCK.bits() | Self::ENOUGH_BLOB_FEE_CAP_BLOCK.bits();
        const BASE_FEE_POOL_BITS = Self::NO_PARKED_ANCESTORS.bits() | Self::NO_NONCE_GAPS.bits() | Self::ENOUGH_BALANCE.bits() | Self::NOT_TOO_MUCH_GAS.bits();
        const QUEUED_POOL_BITS  = Self::NO_PARKED_ANCESTORS.bits();
        const BLOB_POOL_BITS  = Self::BLOB_TRANSACTION.bits();
    }
}

// ... TxState helpers L51–141 omitted ...

/// Identifier for the transaction Sub-pool
#[derive(Debug, Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
#[repr(u8)]
pub enum SubPool {
    /// Missing or queued ancestors, or insufficient sender funds.
    Queued = 0,
    /// Does not meet the pending block's base fee requirement.
    BaseFee,
    /// All non-pending blob transactions.
    Blob,
    /// Ready to be included in the next block.
    Pending,
}

impl SubPool {
    #[inline]
    pub const fn is_pending(&self) -> bool {
        matches!(self, Self::Pending)
    }

    #[inline]
    pub const fn is_queued(&self) -> bool {
        matches!(self, Self::Queued)
    }

    #[inline]
    pub const fn is_base_fee(&self) -> bool {
        matches!(self, Self::BaseFee)
    }

    #[inline]
    pub const fn is_blob(&self) -> bool {
        matches!(self, Self::Blob)
    }

    #[inline]
    pub fn is_promoted(&self, other: Self) -> bool {
        self > &other
    }
}

impl From<TxState> for SubPool {
    fn from(value: TxState) -> Self {
        if value.is_pending() {
            Self::Pending
        } else if value.is_blob() {
            // all _non-pending_ blob transactions are in the blob sub-pool
            Self::Blob
        } else if value.bits() < TxState::BASE_FEE_POOL_BITS.bits() {
            Self::Queued
        } else {
            Self::BaseFee
        }
    }
}
