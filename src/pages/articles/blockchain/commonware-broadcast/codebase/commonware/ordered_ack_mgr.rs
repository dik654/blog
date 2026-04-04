// consensus/src/ordered_broadcast/ack_manager.rs

/// Evidence — either partial votes or a complete certificate.
enum Evidence<S: Scheme, D: Digest> {
    Partials(Partials<S, D>),
    Certificate(S::Certificate),
}

/// Manages acknowledgements for chunks.
/// Map: Sequencer => Height => Epoch => Evidence
pub struct AckManager<P: PublicKey, S: Scheme, D: Digest> {
    acks: HashMap<P, BTreeMap<Height, BTreeMap<Epoch, Evidence<S, D>>>>,
}

impl<P, S, D> AckManager<P, S, D> {
    /// Adds a vote. If quorum newly reached → returns certificate.
    pub fn add_ack(
        &mut self,
        ack: &Ack<P, S, D>,
        scheme: &S,
        strategy: &impl Strategy,
    ) -> Option<S::Certificate> {
        let evidence = self.acks
            .entry(ack.chunk.sequencer.clone())
            .or_default()
            .entry(ack.chunk.height)
            .or_default()
            .entry(ack.epoch)
            .or_default();
        match evidence {
            Evidence::Partials(partials) => {
                partials.signers.insert(ack.signer_index);
                partials.attestations
                    .entry(ack.chunk.payload)
                    .or_default()
                    .push(ack.attestation.clone());
                // Check quorum → combine into certificate
                scheme.try_assemble(partials, strategy)
            }
            Evidence::Certificate(_) => None, // already certified
        }
    }
}
