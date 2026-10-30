pub fn new(
    round: Rnd,
    scheme: Arc<S>,
    blocker: B,
    reporter: R,
    track_historical_votes: bool,
) -> Self {
    let quorum = scheme.participants().quorum::<N3f1>();
    let len = scheme.participants().len();
    Self {
        blocker,
        reporter,
        verifier: Verifier::new(round, scheme, quorum),

        votes: VoteTracker::new(len, track_historical_votes),

        proposal_sent: false,

        span: ViewSpan::new(),
    }
}
