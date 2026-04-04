// commonware/consensus/src/lib.rs — Core Consensus Traits

/// Block height (monotonically increasing)
pub trait Heightable {
    fn height(&self) -> u64;
}

/// View number within a height
pub trait Viewable {
    fn view(&self) -> u64;
}

/// A block that can be proposed and voted on
pub trait Block: Heightable + Clone + Send + Sync + 'static {
    fn digest(&self) -> Digest;
    fn parent(&self) -> Digest;
}

/// A block with an attached quorum certificate
pub trait CertifiableBlock: Block {
    type Certificate: Clone + Send + Sync;
    fn certificate(&self) -> &Self::Certificate;
}

/// State machine that drives application logic
pub trait Automaton: Send + Sync + 'static {
    type Context;

    /// Genesis block digest
    fn genesis(&self) -> Digest;

    /// Propose a new block for the given context
    fn propose(
        &self,
        context: Self::Context,
    ) -> oneshot::Receiver<Proposal>;

    /// Verify a proposed block
    fn verify(
        &self,
        context: Self::Context,
        proposal: Proposal,
    ) -> oneshot::Receiver<bool>;
}

/// Network relay for sending consensus messages
pub trait Relay: Send + Sync + 'static {
    /// Broadcast message to all participants
    fn broadcast(&self, msg: Message);
    /// Send message to a specific participant
    fn send(&self, to: PublicKey, msg: Message);
}

/// Committed block reporter
pub trait Committer: Send + Sync + 'static {
    /// Called when a block is finalized
    fn prepared(&self, proof: Proof, block: Block);
    /// Called when a block is decided
    fn finalized(&self, proof: Proof, block: Block);
}

/// Application interface combining Automaton + Committer
pub trait Application: Automaton + Committer {}
