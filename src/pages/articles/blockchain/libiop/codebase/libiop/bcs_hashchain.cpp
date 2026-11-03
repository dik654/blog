void bcs_protocol<FieldT, MT_root_hash>::run_hashchain_for_round(
    const std::size_t round,
    const std::vector<MT_root_hash> round_MT_roots,
    const std::vector<std::vector<FieldT> > prover_messages)
{
    /* Assume the Merkle tree is already created. */
    for (auto MT_root : round_MT_roots)
    {
        this->hashchain_->absorb(MT_root);
    }

    /* Add the prover message hash as a "root" and update the pseudorandom state */
    this->absorb_prover_messages(round, prover_messages);
    this->squeeze_verifier_random_messages(round);
}
