// ── cryptography/src/handshake/key_exchange.rs ──
// X25519 임시 키 교환 → AES-GCM 대칭 암호화

/// X25519 공유 비밀
pub struct SharedSecret {
    secret: Secret<x25519_dalek::SharedSecret>,
}

/// 임시 X25519 공개키 (32바이트)
pub struct EphemeralPublicKey {
    inner: x25519_dalek::PublicKey,
}

/// 임시 비밀키 — 키 교환 후 즉시 소멸
pub struct SecretKey {
    inner: Secret<x25519_dalek::EphemeralSecret>,
}

impl SecretKey {
    /// 새 임시 비밀키 생성
    pub fn new(rng: impl CryptoRngCore) -> Self {
        Self { inner: Secret::new(
            x25519_dalek::EphemeralSecret::random_from_rng(rng)
        )}
    }

    /// 대응하는 공개키 도출
    pub fn public(&self) -> EphemeralPublicKey {
        self.inner.expose(|s| EphemeralPublicKey {
            inner: x25519_dalek::PublicKey::from(s),
        })
    }

    /// X25519 키 교환 — non-contributory면 None
    pub fn exchange(self, other: &EphemeralPublicKey)
        -> Option<SharedSecret> {
        let secret = self.inner.expose_unwrap();
        let out = secret.diffie_hellman(&other.inner);
        if !out.was_contributory() { return None; }
        Some(SharedSecret::new(out))
    }
}

// ── handshake/cipher.rs ──
// 공유 비밀 → HKDF → ChaCha20-Poly1305 대칭키 도출
// CounterNonce: u128 카운터 → 96-bit nonce (12B)
// TAG_SIZE = 16 bytes (Poly1305 인증 태그)
