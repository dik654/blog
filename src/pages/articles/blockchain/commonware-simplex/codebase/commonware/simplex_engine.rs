// commonware/consensus/simplex/src/engine.rs — Simplex Engine

pub struct Engine<A: Automaton, R: Relay, C: Committer, S: Scheme> {
    config: Config,
    automaton: A,
    relay: R,
    committer: C,

    view: u64,
    leader: LeaderRotation,
    votes: HashMap<u64, Vec<Vote>>,
    view_changes: HashMap<u64, Vec<ViewChange>>,
    timer: Timer,

    _scheme: PhantomData<S>,
}

impl<A, R, C, S> Engine<A, R, C, S>
where
    A: Automaton,
    R: Relay,
    C: Committer,
    S: Scheme,
{
    /// Main engine loop — handles all consensus events
    pub async fn run(&mut self, mut receiver: Receiver<Message>) {
        loop {
            tokio::select! {
                // Incoming message
                Some(msg) = receiver.recv() => {
                    match msg {
                        Message::Propose(p) => self.handle_propose(p).await,
                        Message::Vote(v) => self.handle_vote(v).await,
                        Message::Finalize(f) => self.handle_finalize(f).await,
                        Message::ViewChange(vc) => self.handle_view_change(vc).await,
                    }
                }
                // Timer expired
                _ = self.timer.tick() => {
                    self.handle_timeout().await;
                }
            }
        }
    }

    /// Enter a new view — leader proposes immediately (no 2Δ wait)
    async fn enter_view(&mut self, view: u64) {
        self.view = view;
        self.timer.reset(self.config.timeout); // 3Δ timeout

        let leader = self.leader.get(view);
        if leader == self.config.me {
            // Change #3: Leader proposes immediately, no waiting
            let highest_cert = self.find_highest_cert();
            let proposal = self.automaton.propose(/* context */).await;
            let msg = Message::Propose(Propose {
                view,
                block: proposal,
                cert: highest_cert,
            });
            self.relay.broadcast(msg);
        }
    }

    /// Handle incoming proposal
    async fn handle_propose(&mut self, p: Propose) {
        if p.view != self.view { return; }

        // Change #2: Verify no-commit proof via View-change messages
        // instead of checking for higher certificates
        let valid = self.verify_no_commit(p.view, &p.cert);
        if !valid { return; }

        let verified = self.automaton.verify(/* ctx */, p.block).await;
        if verified {
            // Lazy verification: don't verify signature yet
            // Only verify when quorum is reached
            let vote = Vote { view: p.view, digest: p.block.digest() };
            self.relay.broadcast(Message::Vote(vote));
        }
    }
}
