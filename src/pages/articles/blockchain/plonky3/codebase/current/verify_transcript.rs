    // Describe the transcript before replaying it.
    //
    // Every number comes from the configuration and from the AIR, never from the proof.
    // The two the proof does supply, both trace heights, are validated above first.
    let mut challenger = config.initialise_challenger();
    let mut transcript = StarkVerifierTranscript::<SC::Challenger, Val<SC>, SC::Challenge>::new(
        &mut challenger,
        StarkShape::new::<Val<SC>, A>(
            air,
            preprocessed_width,
            degree_bits,
            base_degree_bits,
            num_quotient_chunks,
            SC::Pcs::ZK,
            config.ood_proof_of_work_bits(),
        ),
    );

    // Replay both committed traces and the public values, then redraw the batching challenge.
    //
    // Soundness Error: n/|EF| where n is the number of constraints.
    let alpha = transcript.constraint_phase::<Com<SC>>(
        commitments.trace.clone(),
        preprocessed_commit,
        public_values,
    )?;

    // Replay the quotient commitment and the grind, then redraw the out-of-domain point.
    //
    // Soundness Error: dN/|EF| where `N` is the trace length and our constraint polynomial has
    // degree `d`, plus `ood_proof_of_work_bits` from the grind checked here.
    let zeta = transcript.ood_phase::<Com<SC>>(
        commitments.quotient_chunks.clone(),
        commitments.random.clone(),
        *ood_pow_witness,
    )?;

    // Invariant: no early return may cross the span from here to the driver's `finish`.
    //
    //     prepare   -> a Result, carried rather than returned
    //     delegate  -> Begin, opening argument, End, on any outcome
    //     finish    -> every described step replayed
    //     rejection -> propagated afterwards, never across a live driver
    //
    // Dropping a driver that has not replayed its pattern panics.
    // A panic raised while an error unwinds aborts the process instead of reporting it.
    let prepared = prepare_opening_claims::<SC, A>(
        air,
        commitments,
        opened_values,
        preprocessed,
        trace_domain,
        init_trace_domain,
        &randomized_quotient_chunks_domains,
        zeta,
    );

    // Run the opening argument inside the bracket, lending it the sponge.
    let checked: Result<_, VerificationError<PcsError<SC>>> = transcript.delegate(|challenger| {
        let OpeningClaims {
            periodic_values,
            claims,
        } = prepared?;
        pcs.verify_with_preprocessing(claims, opening_proof, challenger, preprocessed_index)
            .map_err(VerificationError::InvalidOpeningArgument)?;
        Ok(periodic_values)
    });

    // Every described step has now been replayed.
    transcript.finish();
