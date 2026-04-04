export const CRATE_CODE = `// bulletproofs/src/ 구조
generators.rs        ← PedersenGens, BulletproofGens (기저점 생성)
inner_product_proof.rs ← InnerProductProof (O(log n) 크기)
range_proof/
  mod.rs             ← RangeProof (단일·다중 집계)
  dealer.rs          ← MPC 딜러 (집계 조율)
  party.rs           ← MPC 파티 (개별 증명 기여)
  messages.rs        ← 라운드 메시지 타입
r1cs/                ← R1CS 시스템 (yoloproofs feature)
transcript.rs        ← Merlin 트랜스크립트 (Fiat-Shamir)

// 사용 곡선: Ristretto255 (curve25519-dalek)
// - 8-torsion 없는 소수 위수 군
// - CompressedRistretto: 32 bytes`;

export const GENERATORS_CODE = `// generators.rs — 기저점 생성 (실제 코드)

// Pedersen 커밋: C = v*B + r*B_blinding
pub struct PedersenGens {
    pub B: RistrettoPoint,          // 값 기저점 (Ristretto basepoint)
    pub B_blinding: RistrettoPoint, // 블라인딩 기저점 (hash-to-group)
}

impl PedersenGens {
    // v*B + r*B_blinding (멀티스칼라 곱셈)
    pub fn commit(&self, value: Scalar, blinding: Scalar) -> RistrettoPoint {
        RistrettoPoint::multiscalar_mul(&[value, blinding],
                                        &[self.B, self.B_blinding])
    }
}

// Bulletproof 기저점 쌍 G, H (범위 증명용)
// n: 비트 수, m: 집계 크기 → 총 n*m 쌍 필요
pub struct BulletproofGens {
    pub gens_capacity: usize,  // 지원 최대 비트 수
    pub party_capacity: usize, // 지원 최대 집계 크기
    G_vec: Vec<Vec<RistrettoPoint>>,  // G[party][bit]
    H_vec: Vec<Vec<RistrettoPoint>>,  // H[party][bit]
}

// 기저점 생성: SHAKE256("GeneratorsChain" || label) XOF로 결정론적 생성
// → 이산 로그 관계를 알 수 없음 (Nothing-up-my-sleeve)
struct GeneratorsChain { reader: Sha3XofReader }
impl Iterator for GeneratorsChain {
    type Item = RistrettoPoint;
    fn next(&mut self) -> Option<Self::Item> {
        let mut buf = [0u8; 64];
        self.reader.read(&mut buf);
        Some(RistrettoPoint::from_uniform_bytes(&buf))
    }
}`;
