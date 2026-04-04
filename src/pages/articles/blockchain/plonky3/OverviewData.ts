export const CRATE_MAP_CODE = `// github.com/Plonky3/Plonky3 크레이트 구조
필드
  baby-bear/    ← BabyBear (2^31 - 2^27 + 1), 27-adicity
  koala-bear/   ← KoalaBear (2^31 - 2^24 + 1)
  goldilocks/   ← Goldilocks (2^64 - 2^32 + 1)
  mersenne-31/  ← Mersenne-31 (2^31 - 1)
  monty-31/     ← Montgomery 곱셈 공통 구현 (BabyBear/KoalaBear 공유)
  field/        ← Field, TwoAdicField, ExtensionField 트레이트

해시 & PCS
  poseidon2/    ← Poseidon2 퍼뮤테이션 (Merkle 내부 압축)
  merkle-tree/  ← N진 머클 트리 (MerkleTree<F,W,M,N,DIGEST_ELEMS>)
  fri/          ← FRI 증명 생성 + TwoAdicFriPcs

STARK
  air/          ← Air, AirBuilder, WindowAccess 트레이트
  uni-stark/    ← STARK 증명기 (StarkGenericConfig, prove_with_preprocessed)
  batch-stark/  ← 다중 AIR 배치 증명

예시 AIR
  keccak-air/   ← Keccak-256 AIR 구현
  poseidon2-air/ ← Poseidon2 순열 AIR
  blake3-air/   ← Blake3 해시 AIR

유틸
  challenger/   ← Fiat-Shamir 채린저 (DuplexChallenger)
  dft/          ← 이산 푸리에 변환 (Radix-2 DFT)
  commit/       ← Pcs, Mmcs 트레이트`;

export const BABYBEAR_CODE = `// baby-bear/src/baby_bear.rs — 실제 구현
pub type BabyBear = MontyField31<BabyBearParameters>;

impl MontyParameters for BabyBearParameters {
    /// BabyBear 소수: 2^31 - 2^27 + 1 = 2013265921
    /// 31비트 중 2-adicity가 가장 높은 소수 (2^27 = 134217728 두 배 인수)
    const PRIME: u32 = 0x78000001;  // 2_013_265_921

    // Montgomery 표현: a_mont = a * 2^32 mod p
    const MONTY_BITS: u32 = 32;
    const MONTY_MU: u32 = 0x88000001;  // -p^{-1} mod 2^32
}

impl TwoAdicData for BabyBearParameters {
    /// 2-adicity = 27: FFT 크기 최대 2^27 = 128M
    const TWO_ADICITY: usize = 27;

    // 각 크기별 원시근 (TWO_ADIC_GENERATORS[k]의 order = 2^k)
    const TWO_ADIC_GENERATORS: &'static [BabyBear] = &BabyBear::new_array([
        0x1,         // order 1 = 2^0
        0x78000000,  // order 2 = 2^1
        0x67055c21,  // order 4 = 2^2
        // ...27개
    ]);
}

impl RelativelyPrimePower<7> for BabyBearParameters {
    /// Poseidon2의 S-box: x^7 (7 * 1725656503 ≡ 1 mod (p-1))
    fn exp_root_d<R: PrimeCharacteristicRing>(val: R) -> R {
        exp_1725656503(val)
    }
}`;

export const CONFIG_CODE = `// uni-stark/src/config.rs — STARK 파라미터 트레이트
pub trait StarkGenericConfig: Clone {
    /// 다항식 커밋 스킴 (예: TwoAdicFriPcs)
    type Pcs: Pcs<Self::Challenge, Self::Challenger>;

    /// 확장체 (예: BabyBear의 4차 확장 BabyBearExt4)
    type Challenge: ExtensionField<Val<Self>>;

    /// Fiat-Shamir 채린저 (예: DuplexChallenger<BabyBear, Poseidon2>)
    type Challenger: FieldChallenger<Val<Self>>
        + CanObserve<Commitment>
        + CanSample<Self::Challenge>;

    fn pcs(&self) -> &Self::Pcs;
    fn initialise_challenger(&self) -> Self::Challenger;
    fn is_zk(&self) -> usize { Self::Pcs::ZK as usize }
}

// 실제 SP1이 사용하는 설정 예시
type BabyBearConfig = StarkConfig<
    TwoAdicFriPcs<BabyBear, Radix2DFT, MerkleTreeMmcs<BabyBear, Poseidon2>, ...>,
    BabyBearExt4,   // Challenge: 128-bit 보안
    DuplexChallenger<BabyBear, Poseidon2Permutation, 16>,
>;`;
