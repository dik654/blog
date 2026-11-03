    let (trace_commit, trace_data) = info_span!("commit to trace data")
        .in_scope(|| pcs.commit([(ext_trace_domain, trace)]))
        .map_err(|source| ProvingError::Pcs {
            phase: "trace commitment",
            source,
        })?;

    // Preprocessed commitment and prover data (if any).
    let (preprocessed_commit, preprocessed_data_ref) = preprocessed
        .map(|pp| (pp.commitment.clone(), &pp.prover_data))
        .unzip();

    // Describe the transcript before running it.
    //
    // Every number comes from the configuration and from the AIR, never from a proof.
    // The verifier builds the identical description from its own copies of both.
    let mut transcript = StarkProverTranscript::<SC::Challenger, Val<SC>, SC::Challenge>::new(
        &mut challenger,
        StarkShape::new::<Val<SC>, A>(
            air,
            preprocessed_width,
            log_ext_degree,
            log_degree,
            num_quotient_chunks,
            SC::Pcs::ZK,
            config.ood_proof_of_work_bits(),
        ),
    );

    // Bind both committed traces and the public values, then draw the batching challenge.
    //
    // Soundness Error:
    // If a prover is malicious, we can find a row `i` such that some of the constraints
    // C_0, ..., C_n are non 0 on this row. The malicious prover "wins" if the random challenge
    // alpha is such that:
    // (1): C_0(i) + alpha * C_1(i) + ... + alpha^n * C_n(i) = 0
    // This is a polynomial of degree n, so it has at most n roots. Thus the probability of this
    // occurring for a given trace and set of constraints is n/|EF|.
    //
    // The AIR's shape reaches the seed through the transcript's own description.
    // A wider trace or another quotient chunk count therefore draws a different alpha.
    //
    // What the seed does not carry is the constraint polynomials themselves.
    // A prover may claim another AIR of the same shape without moving this sample.
    // The verifier evaluates the AIR it holds, so checking that AIR is its job regardless.
    let alpha = transcript.constraint_phase::<Com<SC>>(
        trace_commit.clone(),
        preprocessed_commit.filter(|_| preprocessed_width > 0),
        public_values,
    );

    // A domain large enough to uniquely identify the quotient polynomial.
    // This domain must be contained in the domain over which `trace_data` is defined.
    // Explicitly it should be equal to `gK` for some subgroup `K` contained in `H'`.
    let quotient_domain =
        ext_trace_domain.create_disjoint_domain(1 << (log_ext_degree + log_num_quotient_chunks));

    // Return a the subset of the extended trace `ET` corresponding to the rows giving evaluations
    // over the quotient domain.
    //
    // This only works if the trace domain is `gH'` and the quotient domain is `gK` for some subgroup `K` contained in `H'`.
    // TODO: Make this explicit in `get_evaluations_on_domain` or otherwise fix this.
    let trace_on_quotient_domain = pcs.get_evaluations_on_domain(&trace_data, 0, quotient_domain);
    let preprocessed_on_quotient_domain = preprocessed_data_ref
        .map(|data| pcs.get_evaluations_on_domain_no_random(data, 0, quotient_domain));

    // Compute the quotient polynomial `Q(x)` by evaluating
    //          `C(T_1(x), ..., T_w(x), T_1(hx), ..., T_w(hx), selectors(x)) / Z_H(x)`
    // at every point in the quotient domain. The degree of `Q(x)` is `<= deg(C(x)) - N = 2N - 2` in the case
    // where `deg(C) = 3`. (See the discussion above constraint_degree for more details.)
    let quotient_values = quotient_values(
        pcs,
        air,
        public_values,
        layout,
        trace_domain,
        quotient_domain,
        &trace_on_quotient_domain,
        preprocessed_on_quotient_domain.as_ref(),
        alpha,
    );
