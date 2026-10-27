pub fn kzg_to_versioned_hash(commitment: &[u8]) -> B256 {
    use sha2::Digest;

    debug_assert_eq!(commitment.len(), 48, "commitment length is not 48");
    let mut res = sha2::Sha256::digest(commitment);
    res[0] = VERSIONED_HASH_VERSION_KZG;
    B256::new(res.into())
}
