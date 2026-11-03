aurora_snark_argument<FieldT, hash_type> aurora_snark_prover(
    const r1cs_constraint_system<FieldT> &constraint_system,
    const r1cs_primary_input<FieldT> &primary_input,
    const r1cs_auxiliary_input<FieldT> &auxiliary_input,
    const aurora_snark_parameters<FieldT, hash_type> &parameters)
{
    libff::enter_block("Aurora SNARK prover");
    parameters.print();

    bcs_prover<FieldT, hash_type> IOP(parameters.bcs_params_);
    aurora_iop<FieldT> full_protocol(IOP, constraint_system, parameters.iop_params_);
    full_protocol.register_interactions();
    IOP.seal_interaction_registrations();
    full_protocol.register_queries();
    IOP.seal_query_registrations();

    full_protocol.produce_proof(primary_input, auxiliary_input);

    libff::enter_block("Obtain transcript");
    const aurora_snark_argument<FieldT, hash_type> transcript = IOP.get_transcript();
    libff::leave_block("Obtain transcript");

    IOP.describe_sizes();

    libff::leave_block("Aurora SNARK prover");
    return transcript;
}

template<typename FieldT, typename hash_type>
bool aurora_snark_verifier(const r1cs_constraint_system<FieldT> &constraint_system,
                           const r1cs_primary_input<FieldT> &primary_input,
                           const aurora_snark_argument<FieldT, hash_type> &proof,
                           const aurora_snark_parameters<FieldT, hash_type> &parameters)
{
    libff::enter_block("Aurora SNARK verifier");
    parameters.print();

    bcs_verifier<FieldT, hash_type> IOP(parameters.bcs_params_, proof);

    libff::enter_block("Aurora IOP protocol initialization and registration");
    aurora_iop<FieldT> full_protocol(IOP, constraint_system, parameters.iop_params_);
    full_protocol.register_interactions();
    IOP.seal_interaction_registrations();
    full_protocol.register_queries();
    IOP.seal_query_registrations();
    libff::leave_block("Aurora IOP protocol initialization and registration");

    libff::enter_block("Check semantic validity of IOP transcript");
    const bool IOP_transcript_valid = IOP.transcript_is_valid();
    libff::leave_block("Check semantic validity of IOP transcript");

    const bool full_protocol_accepts = full_protocol.verifier_predicate(primary_input);

    libff::print_indent(); printf("* IOP transcript valid: %s\n", IOP_transcript_valid ? "true" : "false");
    libff::print_indent(); printf("* Full protocol decision predicate satisfied: %s\n", full_protocol_accepts ? "true" : "false");
    const bool decision = IOP_transcript_valid && full_protocol_accepts;
    libff::leave_block("Aurora SNARK verifier");

    return decision;
}
