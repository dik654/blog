// consensus/src/ordered_broadcast/engine.rs — Engine run loop

pub struct Engine<E, C, S, P, D, A, R, Z, M, T> {
    context: ContextCell<E>,
    sequencer_signer: Option<ChunkSigner<C>>,
    sequencers_provider: S,
    validators_provider: P,
    automaton: A,          // application callback
    relay: R,              // notification relay
    reporter: Z,           // activity reporter
    tip_manager: TipManager<C::PublicKey, P::Scheme, D>,
    ack_manager: AckManager<C::PublicKey, P::Scheme, D>,
    epoch: Epoch,
}

/// The select_loop! handles: proposals, rebroadcasts,
/// incoming nodes, incoming acks, pending verifications.
async fn run(mut self, chunk_network, ack_network) {
    select_loop! {
        self.context,
        on_start => {
            // Request new proposal if I'm a sequencer
            if let Some(context) = self.should_propose() {
                let receiver = self.automaton.propose(context).await;
                pending = Some((context, receiver));
            }
        },
        // Propose a new chunk
        receiver = propose => {
            self.propose(context, payload, &mut node_sender).await;
        },
        // Handle incoming nodes from other sequencers
        msg = node_receiver.recv() => {
            let node = Node::read_staged(&mut msg, &self.validators_provider)?;
            self.validate_node(&node, &sender)?;
            self.handle_certificate(&parent_chunk, epoch, cert).await;
            self.handle_node(&node).await;
        },
        // Handle incoming acks (partial signatures)
        msg = ack_receiver.recv() => {
            self.validate_ack(&ack, &sender)?;
            self.handle_ack(&ack).await;  // may produce certificate
        },
    }
}
