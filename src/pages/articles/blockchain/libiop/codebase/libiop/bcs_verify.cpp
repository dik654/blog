        /* Absorb MT roots into hashchain. */
        // Each domain has one Merkle tree containing all the oracles.
        const std::vector<hash_digest_type> MT_roots_for_round(
            this->transcript_.MT_roots_.cbegin() + processed_MTs,
            this->transcript_.MT_roots_.cbegin() + processed_MTs + num_domains);
        this->run_hashchain_for_round(round, MT_roots_for_round, this->transcript_.prover_messages_);

        /* Validate all MT queries relative to the transcript. */
        for (std::size_t i = 0; i < num_domains; i++)
        {
            const auto &root = this->transcript_.MT_roots_[processed_MTs];
            std::vector<std::size_t> &query_positions = this->transcript_.query_positions_[processed_MTs];
            std::vector<std::size_t> &MT_leaf_positions = this->transcript_.MT_leaf_positions_[processed_MTs];
            std::vector<std::vector<FieldT> > &query_responses = this->transcript_.query_responses_[processed_MTs];
            const auto &proof = this->transcript_.MT_set_membership_proofs_[processed_MTs];

            // Step 1) serialize query responses into leafs
            std::vector<std::vector< FieldT> > MT_leaf_columns =
                this->query_responses_to_MT_leaf_responses(query_positions, query_responses, round);

            // Step 2) validate proof
            const bool proof_is_valid = this->Merkle_trees_[processed_MTs]
                .validate_set_membership_proof(root, MT_leaf_positions, MT_leaf_columns, proof);

            if (!proof_is_valid)
            {
                this->transcript_is_valid_ = false;
            }
            processed_MTs++;
        }
    }

    /* Check proof of work */

    hash_digest_type pow_challenge = this->hashchain_->squeeze_root_type();
    bool valid_pow = this->pow_.verify_pow(this->parameters_.compression_hasher, pow_challenge, this->transcript_.proof_of_work_);
    if (!valid_pow)
    {
        printf("Invalid pow\n");
        this->transcript_is_valid_ = false;
