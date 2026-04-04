// alloy-primitives — Address, B256, U256

/// 20바이트 이더리움 주소 — 스택 할당, zero-copy
pub struct Address(pub FixedBytes<20>);

/// 32바이트 해시 (Keccak256 결과, 트랜잭션 해시 등)
pub struct B256(pub FixedBytes<32>);

/// 256비트 부호 없는 정수 — 4개의 u64 limb로 표현
/// 힙 할당 없이 스택에서 연산
pub struct U256 {
    limbs: [u64; 4],  // little-endian 순서
}

impl U256 {
    pub const ZERO: Self = Self { limbs: [0; 4] };
    pub const MAX: Self = Self { limbs: [u64::MAX; 4] };

    /// wei → Gwei 변환 (10^9으로 나눗셈)
    pub fn to_gwei(self) -> u64 {
        (self / U256::from(1_000_000_000)).to::<u64>()
    }
}

/// FixedBytes: 컴파일 타임 크기 고정, Copy trait 구현
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub struct FixedBytes<const N: usize>(pub [u8; N]);

impl<const N: usize> AsRef<[u8]> for FixedBytes<N> {
    fn as_ref(&self) -> &[u8] { &self.0 }
}
