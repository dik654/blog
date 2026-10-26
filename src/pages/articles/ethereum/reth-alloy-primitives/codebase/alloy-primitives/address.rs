use crate::{FixedBytes, aliases::U160, utils::keccak256};

wrap_fixed_bytes!(
    // we implement Display with the checksum, so we don't derive it
    extra_derives: [],
    /// An Ethereum address, 20 bytes in length.
    ///
    /// This type is separate from [`FixedBytes<20>`].
    pub struct Address<20>;
);

impl Address {
    /// Computes the `create` address for this address and nonce:
    ///
    /// `keccak256(rlp([sender, nonce]))[12:]`
    #[cfg(feature = "rlp")]
    #[inline]
    #[must_use]
    pub fn create(&self, nonce: u64) -> Self {
        use alloy_rlp::{EMPTY_LIST_CODE, EMPTY_STRING_CODE, Encodable};

        // max u64 encoded length is `1 + u64::BYTES`
        const MAX_LEN: usize = 1 + (1 + 20) + 9;

        let len = 22 + nonce.length();
        debug_assert!(len <= MAX_LEN);

        let mut out = [0u8; MAX_LEN];

        // list header
        // minus 1 to account for the list header itself
        out[0] = EMPTY_LIST_CODE + len as u8 - 1;

        // address header + address
        out[1] = EMPTY_STRING_CODE + 20;
        out[2..22].copy_from_slice(self.as_slice());

        // nonce
        nonce.encode(&mut &mut out[22..]);

        let hash = keccak256(&out[..len]);
        Self::from_word(hash)
    }
}
