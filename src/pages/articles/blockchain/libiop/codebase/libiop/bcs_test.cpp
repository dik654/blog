TEST(BasicOneRoundTests, BCSTest) {
    /* Theres no special casing within the code between additive and multiplicative at default round params. */
    typedef libff::gf64 FieldT;
    typedef binary_hash_digest MT_root_hash;
    size_t dim = 6;
    field_subset<FieldT> codeword_domain(1ull << dim);
    size_t num_oracles = 1;
    round_parameters<FieldT> round_params = round_parameters<FieldT>();
    std::vector<size_t> query_positions({0, 1, 2, 3});
    bool zk = false;
    bool preprocessing = false;
    size_t expected_proof_size = 5*hash_size<binary_hash_digest>() + query_positions.size() * num_oracles*sizeof(FieldT);
    run_single_round_test<FieldT, MT_root_hash>(codeword_domain, num_oracles, round_params, query_positions,
        zk, preprocessing, expected_proof_size);

    zk = true;
    expected_proof_size += query_positions.size() * zk_salt_size;
    run_single_round_test<FieldT, MT_root_hash>(codeword_domain, num_oracles, round_params, query_positions,
        zk, preprocessing, expected_proof_size);
