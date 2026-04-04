// ── cryptography/src/bls12381/scheme.rs ──
// blst 크레이트 기반 — ZCash BLS12-381 직렬화,
// RFC 9380 해시-투-커브 준수

/// BLS12-381 비밀 키 (32바이트 스칼라)
#[derive(Clone, Debug)]
pub struct PrivateKey {
    raw: Secret<[u8; PRIVATE_KEY_LENGTH]>, // zeroize 적용
    key: Private,                           // blst 내부 스칼라
}

impl crate::Signer for PrivateKey {
    type Signature = Signature;
    type PublicKey = PublicKey;

    fn public_key(&self) -> Self::PublicKey {
        // MinPk variant: 공개키 48B, 서명 96B
        PublicKey::from(ops::compute_public::<MinPk>(&self.key))
    }

    fn sign(&self, namespace: &[u8], msg: &[u8]) -> Self::Signature {
        // hash-to-curve + 서명
        ops::sign_message::<MinPk>(&self.key, namespace, msg).into()
    }
}

/// BLS12-381 공개 키 (48바이트 G1 점)
#[derive(Clone, Eq, PartialEq)]
pub struct PublicKey {
    raw: [u8; 48],                      // 직렬화된 압축 포인트
    key: <MinPk as Variant>::Public,    // blst G1 Affine
}

impl crate::Verifier for PublicKey {
    type Signature = Signature;
    fn verify(&self, namespace: &[u8], msg: &[u8],
              sig: &Self::Signature) -> bool {
        ops::verify_message::<MinPk>(
            &self.key, namespace, msg, &sig.signature
        ).is_ok()
    }
}

// PublicKey::SIZE = 48 bytes, Signature::SIZE = 96 bytes
// 집계 서명: 여러 서명을 G2 점 덧셈으로 결합 → 96B 유지
