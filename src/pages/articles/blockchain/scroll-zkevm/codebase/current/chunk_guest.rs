fn main() {
    Crypto::install();

    ecies::sha256::set_digest_provider(|| {
        Box::new(ecies::sha256::ext::ExtSha256Core::new(sha256_digest))
    })
    .unwrap();

    let witness_bytes = C::read_witness_bytes();
    let witness = C::deserialize_witness(&witness_bytes);
    let public_inputs = C::validate(witness);

    reveal_pi_hash(public_inputs.pi_hash());
}
