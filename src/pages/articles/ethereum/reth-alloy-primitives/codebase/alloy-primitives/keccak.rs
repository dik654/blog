/// Simple interface to the [`Keccak-256`] hash function.
///
/// Uses the cache if the `keccak-cache-global` feature is enabled.
pub fn keccak256<T: AsRef<[u8]>>(bytes: T) -> B256 {
    #[cfg(feature = "keccak-cache-global")]
    return keccak_cache::compute(bytes.as_ref(), keccak256_impl);
    #[cfg(not(feature = "keccak-cache-global"))]
    return keccak256_impl(bytes.as_ref());
}

#[allow(unused)]
fn keccak256_impl(bytes: &[u8]) -> B256 {
    let mut output = MaybeUninit::<B256>::uninit();

    cfg_if! {
        if #[cfg(all(feature = "asm-keccak", not(miri)))] {
            return B256::new(keccak_asm::Keccak256::digest(bytes).into());
        } else {
            let mut hasher = Keccak256::new();
            hasher.update(bytes);
            // SAFETY: Never reads from `output`.
            unsafe { hasher.finalize_into_raw(output.as_mut_ptr().cast()) };
        }
    }

    // SAFETY: Initialized above.
    unsafe { output.assume_init() }
}
