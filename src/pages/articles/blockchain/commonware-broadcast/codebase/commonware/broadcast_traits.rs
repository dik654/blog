// actor/src/lib.rs · v2026.9.0
/// Feedback from submitting work to a bounded endpoint.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Feedback {
    /// The work was accepted within the configured capacity.
    Ok,
    /// The submission exceeded configured capacity but was handled by the overflow policy.
    Backoff,
    /// The endpoint is closed.
    Closed,
}

impl Feedback {
    // 한국어 설명: Ok와 Backoff는 모두 local endpoint가 요청을 처리한 상태입니다.
    pub const fn accepted(self) -> bool {
        matches!(self, Self::Ok | Self::Backoff)
    }
}

// broadcast/src/lib.rs · v2026.9.0
/// Broadcaster is the interface responsible for attempting replication of messages across a network.
pub trait Broadcaster: Clone + Send + 'static {
    type Recipients;
    type Message: Codec + Clone + Send + 'static;

    // 한국어 설명: Feedback은 local 접수 결과이며 recipient 수신 확인이 아닙니다.
    fn broadcast(&self, recipients: Self::Recipients, message: Self::Message) -> Feedback;
}
