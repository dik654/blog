// ── cryptography/src/lib.rs — trait 계층 ──

/// Produces Signatures over messages that can be verified
/// with a corresponding PublicKey.
pub trait Signer: Random + Send + Sync + Clone + 'static {
    type Signature: Signature;                 // 생성할 서명 타입
    type PublicKey: PublicKey<Signature = Self::Signature>; // 대응 공개키

    fn public_key(&self) -> Self::PublicKey;   // 서명자의 공개키

    /// namespace를 반드시 지정 — 도메인 분리로 리플레이 차단
    /// 내부에서 union_unique(namespace, msg)를 호출하여
    /// 네트워크 메시지 서명이 실행 계층에서 재사용 불가
    fn sign(&self, namespace: &[u8], msg: &[u8]) -> Self::Signature;

    fn from_seed(seed: u64) -> Self {          // 테스트 전용
        Self::random(&mut ChaCha20Rng::seed_from_u64(seed))
    }
}

/// 직렬화 가능한 비밀 키
pub trait PrivateKey: Signer + Sized + ReadExt + Encode {}

/// 서명 검증 인터페이스
pub trait Verifier {
    type Signature: Signature;
    fn verify(&self, namespace: &[u8], msg: &[u8],
              sig: &Self::Signature) -> bool;
}

/// 공개키 — Ord + Hash로 정렬/집합 연산 가능
pub trait PublicKey: Verifier + Sized + ReadExt
    + Encode + PartialEq + Array {}

/// 서명 값 — 고정 크기 직렬화
pub trait Signature: Sized + Clone + ReadExt
    + Encode + PartialEq + Array {}

/// secp256r1 전용 — 서명에서 공개키 복원
pub trait Recoverable: Signature {
    type PublicKey: PublicKey<Signature = Self>;
    fn recover_signer(&self, namespace: &[u8],
                      msg: &[u8]) -> Option<Self::PublicKey>;
}

/// 배치 검증 — 서명 누적 후 일괄 검증
pub trait BatchVerifier {
    type PublicKey: PublicKey;
    fn new() -> Self;
    fn add(&mut self, namespace: &[u8], message: &[u8],
           public_key: &Self::PublicKey,
           signature: &<Self::PublicKey as Verifier>::Signature) -> bool;
    /// 랜덤 가중치로 위조 배치 공격 방지
    fn verify<R: CryptoRngCore>(self, rng: &mut R) -> bool;
}
