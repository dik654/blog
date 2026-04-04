// ruint — U256 산술 연산 내부 구현

/// 4개 u64 limb, little-endian 순서
/// limbs[0] = 최하위 64비트, limbs[3] = 최상위 64비트
pub struct Uint<const BITS: usize, const LIMBS: usize> {
    limbs: [u64; LIMBS],
}

pub type U256 = Uint<256, 4>;

impl U256 {
    /// wrapping 덧셈 — EVM 기본 동작 (2^256 mod)
    pub fn overflowing_add(self, rhs: Self) -> (Self, bool) {
        let mut result = [0u64; 4];
        let mut carry = 0u64;
        for i in 0..4 {
            let (sum, c1) = self.limbs[i].overflowing_add(rhs.limbs[i]);
            let (sum, c2) = sum.overflowing_add(carry);
            result[i] = sum;
            carry = (c1 as u64) + (c2 as u64);
        }
        (Self { limbs: result }, carry != 0)
    }

    /// checked 덧셈 — 오버플로 시 None 반환
    pub fn checked_add(self, rhs: Self) -> Option<Self> {
        let (result, overflow) = self.overflowing_add(rhs);
        if overflow { None } else { Some(result) }
    }

    /// saturating 덧셈 — 오버플로 시 MAX 반환
    pub fn saturating_add(self, rhs: Self) -> Self {
        self.checked_add(rhs).unwrap_or(Self::MAX)
    }
}
