// broadcast/src/buffered/engine.rs — Engine run loop

/// Instance of the main engine for the module.
/// Responsible for: broadcasting, receiving, caching, responding.
pub struct Engine<E, P, M, D> {
    context: ContextCell<E>,

    public_key: P,              // my identity
    priority: bool,             // send as priority?
    deque_size: usize,          // per-peer cache size

    mailbox_receiver: mpsc::Receiver<Message<P, M>>,
    waiters: BTreeMap<M::Digest, Vec<Waiter<M>>>,
    peer_provider: D,           // peer set changes

    items: BTreeMap<M::Digest, M>,           // cached messages by digest
    deques: BTreeMap<P, VecDeque<M::Digest>>, // LRU per peer
    counts: BTreeMap<M::Digest, usize>,       // refcount per digest
}

/// select_loop! drives the engine: mailbox + network + peer updates
async fn run(mut self, network: (Sender, Receiver)) {
    select_loop! {
        self.context,
        // Handle mailbox messages (Broadcast / Subscribe / Get)
        Some(msg) = self.mailbox_receiver.recv() => match msg {
            Message::Broadcast { recipients, message, responder } =>
                self.handle_broadcast(&mut sender, recipients, message, responder).await,
            Message::Subscribe { digest, responder } =>
                self.handle_subscribe(digest, responder),
            Message::Get { digest, responder } =>
                self.handle_get(digest, responder),
        },
        // Handle incoming network messages
        msg = receiver.recv() => {
            let (peer, msg) = msg?;
            self.handle_network(peer, msg);
        },
        // Handle peer set changes → evict untracked
        Some((_, _, tracked_peers)) = peer_set_subscription.recv() => {
            self.evict_untracked_peers(&tracked_peers);
        },
    }
}
