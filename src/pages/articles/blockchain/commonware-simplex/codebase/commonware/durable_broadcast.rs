// Sync everything appended this iteration (during message
// processing and construction) in a single coalesced sync.
// This runs even if there is nothing to broadcast (e.g. a
// certification result was recorded) so every artifact is
// durable by the end of the iteration that appended it.
self = self.sync_journal().await;

// Broadcast everything we built (and report it to the application).
self.notify(
    &mut batcher,
    &mut resolver,
    &mut vote_sender,
    &mut certificate_sender,
    staged,
);
