wrap_fixed_bytes!(
    /// Ethereum 256 byte bloom filter.
    pub struct Bloom<256>;
);

impl Bloom {
    /// Returns true if this bloom filter is a possible superset of the other
    /// bloom filter, admitting false positives.
    ///
    /// Note: This method may return false positives. This is inherent to the
    /// bloom filter data structure.
    #[inline]
    pub fn contains_input(&self, input: BloomInput<'_>) -> bool {
        let hash = input.into_hash();
        self.contains_m3_2048_hashed(&hash)
    }

    /// Accrues the input into the bloom filter.
    pub fn accrue(&mut self, input: BloomInput<'_>) {
        let hash = input.into_hash();
        self.m3_2048_hashed(&hash);
    }

    /// [`m3_2048`](Self::m3_2048) but with a pre-hashed input.
    pub fn m3_2048_hashed(&mut self, hash: &B256) {
        for i in [0, 2, 4] {
            let bit = (hash[i + 1] as usize + ((hash[i] as usize) << 8)) & 0x7FF;
            self[BLOOM_SIZE_BYTES - 1 - bit / 8] |= 1 << (bit % 8);
        }
    }

    /// [`contains_m3_2048`](Self::contains_m3_2048) but with a pre-hashed input.
    fn contains_m3_2048_hashed(&self, hash: &B256) -> bool {
        for i in [0, 2, 4] {
            // Each adjacent hash byte pair forms one big-endian 11-bit index.
            // Bloom bytes are stored high-to-low, while bits within a byte are low-to-high.
            let bit = (hash[i + 1] as usize + ((hash[i] as usize) << 8)) & 0x7FF;
            if self[BLOOM_SIZE_BYTES - 1 - bit / 8] & (1 << (bit % 8)) == 0 {
                return false;
            }
        }
        true
    }
}
