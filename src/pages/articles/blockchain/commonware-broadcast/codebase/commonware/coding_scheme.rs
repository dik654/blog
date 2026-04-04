// coding/src/lib.rs — Scheme + PhasedScheme traits

/// A scheme for encoding data into pieces and recovering.
pub trait Scheme: Debug + Clone + Send + Sync + 'static {
    type Commitment: Digest;
    type Shard: Clone + Codec + Send + Sync + 'static;
    type CheckedShard: Clone + Send + Sync;
    type Error: Debug + Send;

    /// Encode data → (commitment, shards). Deterministic.
    fn encode(
        config: &Config, data: impl Buf, strategy: &impl Strategy,
    ) -> Result<(Self::Commitment, Vec<Self::Shard>), Self::Error>;

    /// Check shard integrity against commitment.
    fn check(
        config: &Config, commitment: &Self::Commitment,
        index: u16, shard: &Self::Shard,
    ) -> Result<Self::CheckedShard, Self::Error>;

    /// Decode from minimum_shards checked shards.
    fn decode<'a>(
        config: &Config, commitment: &Self::Commitment,
        shards: impl Iterator<Item = &'a Self::CheckedShard>,
        strategy: &impl Strategy,
    ) -> Result<Vec<u8>, Self::Error>;
}

/// PhasedScheme — separate local (strong) and forwarded (weak) handling.
/// Strong shard → weaken() → CheckingData + WeakShard to forward.
/// check() validates weak shards with checking data (no trusted setup).
pub trait PhasedScheme: Debug + Clone + Send + Sync + 'static {
    type Commitment: Digest;
    type StrongShard: Clone + Codec + Send + Sync;
    type WeakShard: Clone + Codec + Send + Sync;
    type CheckingData: Clone + Eq + Send + Sync;
    type CheckedShard: Clone + Send + Sync;
    type Error: Debug + Send;

    fn encode(config: &Config, data: impl Buf, strategy: &impl Strategy)
        -> Result<(Self::Commitment, Vec<Self::StrongShard>), Self::Error>;

    fn weaken(config: &Config, commitment: &Self::Commitment,
        index: u16, shard: Self::StrongShard)
        -> Result<(Self::CheckingData, Self::CheckedShard, Self::WeakShard), Self::Error>;

    fn check(config: &Config, commitment: &Self::Commitment,
        checking_data: &Self::CheckingData, index: u16, weak: Self::WeakShard)
        -> Result<Self::CheckedShard, Self::Error>;

    fn decode<'a>(config: &Config, commitment: &Self::Commitment,
        checking_data: Self::CheckingData,
        shards: impl Iterator<Item = &'a Self::CheckedShard>,
        strategy: &impl Strategy) -> Result<Vec<u8>, Self::Error>;
}
