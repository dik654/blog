impl<const BITS: usize, const LIMBS: usize> Uint<BITS, LIMBS> {
    /// Computes `self + rhs`, returning [`None`] if overflow occurred.
    #[inline(always)]
    #[must_use]
    pub const fn checked_add(self, rhs: Self) -> Option<Self> {
        match self.overflowing_add(rhs) {
            (value, false) => Some(value),
            _ => None,
        }
    }

    /// Calculates $\mod{\mathtt{self} + \mathtt{rhs}}_{2^{BITS}}$.
    #[inline]
    #[must_use]
    pub const fn overflowing_add(mut self, rhs: Self) -> (Self, bool) {
        if BITS == 0 {
            return (Self::ZERO, false);
        }
        let mut carry = false;
        let mut i = 0;
        while i < LIMBS {
            (self.limbs[i], carry) = carrying_add(self.limbs[i], rhs.limbs[i], carry);
            i += 1;
        }
        let overflow = carry | (self.limbs[LIMBS - 1] > Self::MASK);
        (self.masked(), overflow)
    }

    /// Computes `self + rhs`, saturating at the numeric bounds instead of
    /// overflowing.
    #[inline(always)]
    #[must_use]
    pub const fn saturating_add(self, rhs: Self) -> Self {
        match self.overflowing_add(rhs) {
            (value, false) => value,
            _ => Self::MAX,
        }
    }
}
