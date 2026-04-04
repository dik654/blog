// commonware/consensus/simplex/src/engine.rs — Vote/Finalize handling

impl<A, R, C, S> Engine<A, R, C, S>
where A: Automaton, R: Relay, C: Committer, S: Scheme
{
    /// Handle vote — collect n-f votes to form certificate
    async fn handle_vote(&mut self, vote: Vote) {
        if vote.view != self.view { return; }

        self.votes.entry(vote.view)
            .or_default()
            .push(vote.clone());

        let n = self.config.participants.len();
        let f = (n - 1) / 3;
        let threshold = n - f;

        let votes = &self.votes[&vote.view];
        if votes.len() >= threshold {
            // Quorum reached! Now batch-verify all signatures
            // (Lazy Verification — only verify at quorum)
            if S::is_batchable() {
                let valid = S::batch_verify(votes);
                if !valid { return; }
            }

            // Form certificate
            let cert = Certificate::new(vote.view, vote.digest, votes);

            // Send Finalize with certificate
            let finalize = Finalize {
                view: vote.view,
                digest: vote.digest,
                cert: cert.clone(),
            };
            self.relay.broadcast(Message::Finalize(finalize));

            // Change #1: Immediately enter next view!
            // (Don't stay in current view)
            self.committer.prepared(cert, /* block */);
            self.enter_view(self.view + 1).await;
        }
    }

    /// Handle finalize — n-f finalizes = decide
    async fn handle_finalize(&mut self, f: Finalize) {
        self.finalizes.entry(f.view)
            .or_default()
            .push(f.clone());

        let threshold = self.config.participants.len()
            - (self.config.participants.len() - 1) / 3;

        let finalizes = &self.finalizes[&f.view];
        if finalizes.len() >= threshold {
            // Decide! Block is committed.
            self.committer.finalized(f.cert, /* block */);

            // Forward n-f Finalize messages for other nodes
            for fin in finalizes {
                self.relay.broadcast(Message::Finalize(fin.clone()));
            }
        }
    }

    /// Handle timeout — Change #4: 3Δ (not 6Δ)
    async fn handle_timeout(&mut self) {
        let vc = ViewChange { view: self.view };
        self.relay.broadcast(Message::ViewChange(vc));
        // Don't exit view yet — wait for n-f View-changes
    }

    /// Handle view-change collection
    async fn handle_view_change(&mut self, vc: ViewChange) {
        self.view_changes.entry(vc.view)
            .or_default()
            .push(vc.clone());

        let threshold = self.config.participants.len()
            - (self.config.participants.len() - 1) / 3;

        if self.view_changes[&vc.view].len() >= threshold {
            // Forward and enter next view
            for v in &self.view_changes[&vc.view] {
                self.relay.broadcast(Message::ViewChange(v.clone()));
            }
            self.enter_view(self.view + 1).await;
        }
    }
}
