void bcs_prover<FieldT, MT_hash_type>::signal_prover_round_done()
{
    libff::enter_block("Finish prover round");
    iop_protocol<FieldT>::signal_prover_round_done();
    std::size_t ended_round = this->num_prover_rounds_done_-1;
    const domain_to_oracles_map mapping = this->oracles_in_round_by_domain(ended_round);
    const round_parameters<FieldT> round_params = this->get_round_parameters(ended_round);

    /* First, go through all the oracle messages in this round and
       compress each one using a Merkle Tree.
       Absorb the computed MT root into the hashchain.
     */
    for (auto &kv : mapping)
    {
        std::vector<std::shared_ptr<std::vector<FieldT>>> all_oracle_evaluated_contents;
        for (auto &v : kv.second) // kv.second is a vector of all oracle handles over this domain from this round.
        {
            all_oracle_evaluated_contents.emplace_back(this->oracles_[v.id()].evaluated_contents());
        }
        libff::enter_block("Construct Merkle tree");
        this->Merkle_trees_[this->processed_MTs_].construct_with_leaves_serialized_by_cosets(
            all_oracle_evaluated_contents, round_params.quotient_map_size_);
        libff::leave_block("Construct Merkle tree");
    }

    this->run_hashchain_for_round();

    libff::leave_block("Finish prover round");
    libff::enter_block("pow");
    // If we are in the last round, do a proof of work
    if (this->num_prover_rounds_done_ == this->num_interaction_rounds_)
    {
        MT_hash_type pow_challenge = this->hashchain_->squeeze_root_type();
        this->pow_answer_ = this->pow_.solve_pow(this->parameters_.compression_hasher, pow_challenge);
    }
    libff::leave_block("pow");
