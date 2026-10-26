/// The ring of numbers modulo $2^{\mathtt{BITS}}$.
#[derive(Clone, Copy, Eq, PartialEq, Hash)]
#[repr(transparent)]
pub struct Uint<const BITS: usize, const LIMBS: usize> {
    limbs: [u64; LIMBS],
}

impl<const BITS: usize, const LIMBS: usize> Uint<BITS, LIMBS> {
    /// The largest value that can be represented by this integer type,
    /// $2^{\mathtt{BITS}} - 1$.
    pub const MAX: Self = Self::from_limbs_unmasked([u64::MAX; LIMBS]);

    /// Convert to an array of limbs.
    ///
    /// Limbs are least significant first.
    #[inline(always)]
    #[must_use]
    pub const fn into_limbs(self) -> [u64; LIMBS] {
        self.limbs
    }
}
