// ── cryptography/src/ed25519/scheme.rs ──
// ed25519-consensus 크레이트 사용 — 합의 컨텍스트의
// 엄격한 검증 규칙 준수 (ZIP-215 문서 참조)

/// Ed25519 비밀 키 — Secret<SigningKey>로 메모리 보호
#[derive(Clone, Debug)]
pub struct PrivateKey {
    key: Secret<ed25519_consensus::SigningKey>, // zeroize 적용
}

impl crate::Signer for PrivateKey {
    type Signature = Signature;
    type PublicKey = PublicKey;

    fn sign(&self, namespace: &[u8], msg: &[u8]) -> Self::Signature {
        // union_unique(namespace, msg) → namespace + msg를 합쳐
        // 도메인 분리된 페이로드 생성
        let payload = Cow::Owned(union_unique(namespace, msg));
        self.key.expose(|key| Signature::from(key.sign(&payload)))
    }

    fn public_key(&self) -> Self::PublicKey {
        self.key.expose(|key| PublicKey {
            key: key.verification_key().to_owned(),
        })
    }
}

/// Ed25519 공개 키 — Ord + Hash 구현으로 BTreeSet에 저장 가능
#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct PublicKey {
    key: ed25519_consensus::VerificationKey,
}

impl crate::Verifier for PublicKey {
    type Signature = Signature;
    fn verify(&self, namespace: &[u8], msg: &[u8],
              sig: &Self::Signature) -> bool {
        let payload = Cow::Owned(union_unique(namespace, msg));
        self.key.verify(&sig.key, &payload).is_ok()
    }
}

// PublicKey::SIZE = 32 bytes, Signature::SIZE = 64 bytes
