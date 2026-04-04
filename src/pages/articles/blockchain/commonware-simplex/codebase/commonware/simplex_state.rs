// consensus/src/simplex/actors/voter/state.rs — State<E, S, L, D>

/// Per-Epoch state machine.
/// Tracks proposals and certificates for each view.
/// Vote aggregation and verification is handled by the batcher.
pub struct State<E: Clock + CryptoRngCore + Metrics, S: Scheme<D>, L: ElectorConfig<S>, D: Digest> {
    context: E,              // runtime (clock, rng, metrics)
    scheme: S,               // signing scheme (ed25519 | BLS threshold)
    elector: L::Elector,     // leader election (RoundRobin | Random VRF)
    epoch: Epoch,            // current epoch (unique per engine run)
    activity_timeout: ViewDelta, // how many views behind finalized tip to track
    leader_timeout: Duration,    // time to wait for leader proposal
    certification_timeout: Duration, // time to wait for certification progress
    timeout_retry: Duration,     // interval between nullify retries
    view: View,              // current view being driven
    last_finalized: View,    // highest finalized view observed
    genesis: Option<D>,      // genesis block digest
    views: BTreeMap<View, Round<S, D>>, // per-view round state

    certification_candidates: BTreeSet<View>,   // views ready for certification
    outstanding_certifications: BTreeSet<View>,  // in-flight certification requests
    // ... metrics gauges omitted
}

/// Seeds the state machine with genesis and advances into view 1.
pub fn set_genesis(&mut self, genesis: D) {
    self.genesis = Some(genesis);
    self.enter_view(GENESIS_VIEW.next());
    self.set_leader(GENESIS_VIEW.next(), None);
}

/// Advances the view and updates the leader.
fn enter_view(&mut self, view: View) -> bool {
    if view <= self.view {
        return false;       // already at or past this view
    }
    let now = self.context.current();
    let leader_deadline = now + self.leader_timeout;
    let certification_deadline = now + self.certification_timeout;

    let round = self.create_round(view);
    round.set_deadlines(leader_deadline, certification_deadline);
    self.view = view;
    true
}
