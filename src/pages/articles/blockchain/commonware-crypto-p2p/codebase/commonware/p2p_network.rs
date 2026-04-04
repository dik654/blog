// ── p2p/src/lib.rs — 네트워킹 프리미티브 ──

/// Message — (발신자 공개키, 암호화 해제된 페이로드)
pub type Message<P> = (P, IoBuf);

/// Channel — u64 식별자로 멀티플렉싱
pub type Channel = u64;

/// Recipients — 메시지 수신 범위
#[derive(Clone, Debug)]
pub enum Recipients<P: PublicKey> {
    All,         // 전체 피어
    Some(Vec<P>), // 특정 피어 집합
    One(P),      // 단일 피어
}

/// UnlimitedSender — 대역폭 제한 없는 전송
pub trait UnlimitedSender: Clone + Send + Sync + 'static {
    type PublicKey: PublicKey;
    type Error: Debug + StdError;
    fn send(&mut self, recipients: Recipients<Self::PublicKey>,
            message: impl Into<IoBufs> + Send, priority: bool)
        -> impl Future<Output = Result<Vec<Self::PublicKey>>>;
}

/// LimitedSender — 레이트 리밋 확인 후 전송
pub trait LimitedSender: Clone + Send + Sync + 'static {
    type Checked<'a>: CheckedSender + Send where Self: 'a;
    fn check<'a>(&'a mut self, recipients: Recipients<Self::PublicKey>)
        -> impl Future<Output = Result<Self::Checked<'a>, SystemTime>>;
}

/// Sender — LimitedSender 기본 구현 (blanket impl)
pub trait Sender: LimitedSender {
    fn send(&mut self, recipients: Recipients<Self::PublicKey>,
            message: impl Into<IoBufs> + Send, priority: bool)
        -> impl Future<Output = Result<Vec<Self::PublicKey>>> {
        async move {
            match self.check(recipients).await {
                Ok(checked) => checked.send(message, priority).await,
                Err(_) => Ok(Vec::new()), // 전부 제한 중 → 빈 결과
            }
        }
    }
}
impl<S: LimitedSender> Sender for S {} // blanket impl

/// Blocker — 악성 피어 차단 + 재연결 거부
pub trait Blocker: Clone + Send + 'static {
    type PublicKey: PublicKey;
    fn block(&mut self, peer: Self::PublicKey)
        -> impl Future<Output = ()>;
}

/// block! 매크로 — warn 로깅 + 즉시 차단
macro_rules! block {
    ($blocker:expr, $peer:expr, $($arg:tt)+) => {
        tracing::warn!(peer = ?$peer, $($arg)+);
        $blocker.block($peer).await;
    };
}
