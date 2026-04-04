// ── commonware/cryptography/src/lib.rs ──

/// Signer trait — 네임스페이스 기반 서명 생성
pub trait Signer: Send + Sync + 'static {
    fn sign(&self, namespace: &[u8], msg: &[u8]) -> Signature;
    fn public_key(&self) -> PublicKey;
}

/// PrivateKey — 지정된 서명 스킴의 비밀 키
pub trait PrivateKey: Signer + Clone {
    fn from_seed(seed: &[u8; 32]) -> Self;
    fn to_bytes(&self) -> Vec<u8>;
}

/// Verifier — 공개키 기반 서명 검증
pub trait Verifier: Send + Sync + 'static {
    fn verify(&self, namespace: &[u8], msg: &[u8], sig: &Signature) -> bool;
}

/// PublicKey — 직렬화/역직렬화 가능한 공개키
pub trait PublicKey: Verifier + Clone + Ord + Hash {
    fn from_bytes(bytes: &[u8]) -> Result<Self, Error>;
    fn to_bytes(&self) -> Vec<u8>;
    fn len() -> usize;
}

/// Signature — 직렬화/역직렬화 가능한 서명 값
pub trait Signature: Clone + Send + Sync {
    fn from_bytes(bytes: &[u8]) -> Result<Self, Error>;
    fn to_bytes(&self) -> Vec<u8>;
}

/// Recoverable — 서명에서 공개키 복원 (secp256r1)
pub trait Recoverable: Signature {
    fn recover(&self, namespace: &[u8], msg: &[u8]) -> Result<PublicKey, Error>;
}

/// BatchVerifier — 서명 배치 검증 (Lazy Verification)
pub trait BatchVerifier: Default + Send {
    fn add(&mut self, pk: &PublicKey, namespace: &[u8], msg: &[u8], sig: &Signature);
    fn verify(self) -> bool;
    fn is_batchable() -> bool;
}

/// Digest — 고정 크기 해시 출력
pub type Digest = [u8; 32];

/// Hasher — 상태 기반 해시 함수 추상화
pub trait Hasher: Default {
    fn update(&mut self, data: &[u8]);
    fn finalize(self) -> Digest;
}

// ── commonware/p2p/src/lib.rs ──

/// Message<P> — 발신자 공개키 + 직렬화된 페이로드
pub type Message<P> = (P, IoBuf);

/// Channel — 멀티플렉싱 채널 식별자
pub type Channel = u64;

/// Recipients — 메시지 수신 대상 지정
pub enum Recipients<P: PublicKey> {
    All,
    Some(Vec<P>),
    One(P),
}

/// Sender trait 계층 — 전송 제어 수준별 분리
pub trait Sender<P: PublicKey>: Clone + Send + 'static {
    async fn send(&self, r: Recipients<P>, msg: Bytes, priority: bool) -> Result<Vec<P>>;
}
pub trait CheckedSender<P>: Sender<P> { /* 메시지 크기 검증 */ }
pub trait LimitedSender<P>: CheckedSender<P> { /* 대역폭 제한 */ }
pub trait UnlimitedSender<P>: LimitedSender<P> { /* 제한 없음 */ }

/// Blocker — 악성 피어 동적 차단
pub trait Blocker<P: PublicKey>: Clone + Send + 'static {
    fn block(&self, peer: P); // block! 매크로로 호출
}

// ── commonware/runtime/src/lib.rs ──

/// Clock — 실시간 vs 결정론적 시간 추상화
pub trait Clock: Clone + Send + 'static {
    fn current(&self) -> SystemTime;
    fn sleep(&self, duration: Duration) -> impl Future<Output = ()>;
    fn sleep_until(&self, deadline: SystemTime) -> impl Future<Output = ()>;
}
// deterministic::Runtime — 시뮬레이션 모드 (동일 시드 → 동일 결과)
// tokio::Runtime — 프로덕션 모드 (실제 OS 타이머)
