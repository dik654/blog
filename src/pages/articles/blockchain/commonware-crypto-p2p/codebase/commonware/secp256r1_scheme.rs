// ── cryptography/src/secp256r1/standard.rs ──
// NIST P-256 — RFC 6979 결정론적 서명,
// BIP 62 low-s 정규화, SEC1 v2 압축 공개키

/// secp256r1 비밀 키
#[derive(Clone)]
pub struct PrivateKey {
    key: Secret<p256::ecdsa::SigningKey>,
}

impl crate::Signer for PrivateKey {
    type Signature = Signature;
    type PublicKey = PublicKey;

    fn sign(&self, namespace: &[u8], msg: &[u8]) -> Self::Signature {
        let payload = union_unique(namespace, msg);
        let digest = sha256(&payload); // SHA-256 → sign
        self.key.expose(|key| {
            let (sig, _) = key.sign_prehash_recoverable(&digest)
                .expect("signing failed");
            sig.normalize_s()  // BIP 62: low-s 정규화
        }).into()
    }

    fn public_key(&self) -> Self::PublicKey {
        self.key.expose(|key| PublicKey {
            key: *key.verifying_key(),
        })
    }
}

/// secp256r1 공개 키 (33바이트 압축 SEC1)
pub struct PublicKey {
    key: p256::ecdsa::VerifyingKey,
}
// PublicKey::SIZE = 33 bytes, Signature::SIZE = 64 bytes

// ── cryptography/src/secp256r1/recoverable.rs ──
// Recoverable variant: Signature = 65 bytes (r + s + v)
pub trait Recoverable: Signature {
    fn recover_signer(&self, namespace: &[u8],
                      msg: &[u8]) -> Option<PublicKey>;
    // v 바이트로 공개키 복원 → EIP-712 스타일 서명 검증
}
